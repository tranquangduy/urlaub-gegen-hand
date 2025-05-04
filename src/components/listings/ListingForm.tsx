'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Listing } from '@/types';
// Use specific functions from mock services
import {
  getById,
  create as createListing,
  update as updateListing,
} from '@/mocks/services';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation'; // Added useParams
import { toast } from 'sonner';

// Import step components
import ListingFormStep1 from './ListingFormStep1';
import ListingFormStep2 from './ListingFormStep2';
import ListingFormStep3 from './ListingFormStep3';
import ListingFormStep4 from './ListingFormStep4';
import ListingFormStep5 from './ListingFormStep5';

const TOTAL_STEPS = 5;
const LOCAL_STORAGE_KEY_PREFIX = 'listing_form_draft_'; // Use prefix for uniqueness

// Initial form state type
type ListingFormData = Partial<Listing>;

// Props for the form, including optional listingId for editing
interface ListingFormProps {
  listingId?: string;
}

export default function ListingForm({ listingId }: ListingFormProps) {
  const { user } = useAuth();
  const router = useRouter();
  // Get listingId from params if not passed as prop (e.g., for /listings/edit/[id] route)
  const params = useParams();
  const editListingId = listingId || (params.id as string); // Use prop first, then param
  const isEditing = !!editListingId;

  const localStorageKey = `${LOCAL_STORAGE_KEY_PREFIX}${
    editListingId || 'new'
  }`;

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ListingFormData>({});
  const [initialLoading, setInitialLoading] = useState(isEditing); // Only load initially if editing
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Fetch existing data if editing
  useEffect(() => {
    if (isEditing && editListingId) {
      setInitialLoading(true);
      try {
        setTimeout(() => {
          // Simulate fetch
          const existingListing = getById('listings', editListingId);
          if (existingListing) {
            // Check if draft exists and is newer? For now, overwrite with DB data
            setFormData(existingListing);
          } else {
            toast.error('Listing not found for editing.');
            // router.push('/dashboard/host/listings'); // Redirect if not found
          }
          setInitialLoading(false);
        }, 300);
      } catch (err) {
        console.error('Error fetching listing for edit:', err);
        toast.error('Failed to load listing data for editing.');
        setInitialLoading(false);
      }
    }
  }, [isEditing, editListingId]);

  // Load draft from localStorage on mount (only if NOT editing or after initial load)
  // useEffect(() => {
  //   if (!isEditing || !initialLoading) {
  //     // Load draft for new or after initial edit load finishes
  //     const draft = localStorage.getItem(localStorageKey);
  //     if (draft) {
  //       try {
  //         const parsedDraft = JSON.parse(draft);
  //         // Only set draft if it differs from initially loaded data (or if creating new)
  //         if (
  //           !isEditing ||
  //           JSON.stringify(parsedDraft) !== JSON.stringify(formData)
  //         ) {
  //           setFormData(parsedDraft);
  //         }
  //       } catch (err) {
  //         console.error('Error parsing listing draft:', err);
  //         localStorage.removeItem(localStorageKey);
  //       }
  //     }
  //   }
  // }, [isEditing, initialLoading, localStorageKey, formData]); // Add formData dependency

  // Save draft to localStorage on formData change
  useEffect(() => {
    // Avoid saving during initial load or if formData is empty
    if (!initialLoading && Object.keys(formData).length > 0) {
      try {
        const draftToSave = { ...formData };
        localStorage.setItem(localStorageKey, JSON.stringify(draftToSave));
      } catch (err) {
        console.error('Error saving listing draft:', err);
        toast.warning('Could not save draft. Storage might be full.');
      }
    }
  }, [formData, initialLoading, localStorageKey]);

  const handleNext = async () => {
    // TODO: Implement validation for the current step
    const isValid = true;
    setErrors({});

    if (isValid) {
      if (currentStep < TOTAL_STEPS) {
        setCurrentStep(currentStep + 1);
      } else {
        await handleSubmit();
      }
    } else {
      // setErrors(validationErrors);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (data: Partial<ListingFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleSubmit = async () => {
    if (!user) {
      setSubmitError('You must be logged in to create or update a listing.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    // Prepare data (similar logic, but ensure all fields are present for update)
    const listingDataForApi: Partial<Listing> = {
      ...formData, // Start with current form data
      title: formData.title || '', // Ensure required fields have defaults
      description: formData.description || '',
      location: formData.location || { address: '', city: '', country: '' },
      accommodationType: formData.accommodationType || 'other',
      requiredHelpCategories: formData.requiredHelpCategories || [],
      workHoursPerWeek: formData.workHoursPerWeek || 0,
      availabilityStartDate: formData.availabilityStartDate || new Date(),
      availabilityEndDate: formData.availabilityEndDate || new Date(),
      status: formData.status || 'inactive', // Default status if needed
      // Explicitly exclude fields managed by backend/context
      id: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      host: undefined,
      bookings: undefined,
      hostId: isEditing ? undefined : user.id, // Set hostId only when creating
    };

    // Remove undefined keys before sending to mock API if necessary
    Object.keys(listingDataForApi).forEach(
      (key) =>
        listingDataForApi[key as keyof typeof listingDataForApi] ===
          undefined &&
        delete listingDataForApi[key as keyof typeof listingDataForApi]
    );

    try {
      let response;
      if (isEditing && editListingId) {
        // Update existing listing
        response = await updateListing(
          'listings',
          editListingId,
          listingDataForApi
        );
      } else {
        // Create new listing
        response = await createListing('listings', {
          ...listingDataForApi,
          id: `listing_${Date.now()}_${Math.random().toString(16).slice(2)}`, // Generate new ID
          hostId: user.id,
          createdAt: new Date(),
          updatedAt: new Date(),
          status: listingDataForApi.status || 'inactive', // Ensure status is set
        } as Listing); // Type assertion needed as we added required fields
      }

      const resultListing = response; // update/create return the object in mock service

      if (resultListing) {
        // Check if operation returned the listing
        setSubmitSuccess(true);
        localStorage.removeItem(localStorageKey); // Clear draft on success
        toast.success(
          `Listing ${isEditing ? 'updated' : 'created'} successfully!`
        );
        setTimeout(() => {
          // Redirect to the listing detail page or dashboard
          router.push(
            `/listings/${isEditing ? editListingId : resultListing.id}`
          );
        }, 1500);
      } else {
        setSubmitError(`Failed to ${isEditing ? 'update' : 'create'} listing.`);
        toast.error(`Failed to ${isEditing ? 'update' : 'create'} listing.`);
      }
    } catch (error) {
      console.error('Listing submission error:', error);
      setSubmitError('An unexpected error occurred.');
      toast.error('An unexpected error occurred during submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    if (initialLoading) {
      return <p>Loading listing data...</p>; // Add a proper skeleton later
    }
    switch (currentStep) {
      case 1:
        return (
          <ListingFormStep1
            data={formData}
            updateData={updateFormData}
            errors={errors}
          />
        );
      case 2:
        return (
          <ListingFormStep2
            data={formData}
            updateData={updateFormData}
            errors={errors}
          />
        );
      case 3:
        return (
          <ListingFormStep3
            data={formData}
            updateData={updateFormData}
            errors={errors}
          />
        );
      case 4:
        return (
          <ListingFormStep4
            data={formData}
            updateData={updateFormData}
            errors={errors}
          />
        );
      case 5:
        return (
          <ListingFormStep5
            data={formData}
            updateData={updateFormData}
            errors={errors}
          />
        );
      default:
        return <div>Invalid Step</div>;
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">
        {isEditing ? 'Edit Listing' : 'Create New Listing'}
      </h1>

      {/* Progress Bar */}
      <div className="mb-8">
        <Progress
          value={(currentStep / TOTAL_STEPS) * 100}
          className="w-full"
        />
        <p className="text-sm text-muted-foreground mt-2 text-center">
          Step {currentStep} of {TOTAL_STEPS}
        </p>
      </div>

      {/* Submission Status */}
      {submitSuccess && (
        <Alert
          variant="default"
          className="mb-6 border-green-500 text-green-700 bg-green-50"
        >
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>
            Listing {isEditing ? 'updated' : 'created'} successfully!
            Redirecting...
          </AlertDescription>
        </Alert>
      )}
      {submitError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Submission Failed</AlertTitle>
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      )}

      {/* Render Current Step */}
      <div className="mb-8 min-h-[300px]">{renderStep()}</div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <Button
          onClick={handlePrevious}
          disabled={currentStep === 1 || isSubmitting || initialLoading}
          variant="outline"
        >
          Previous
        </Button>
        <Button onClick={handleNext} disabled={isSubmitting || initialLoading}>
          {isSubmitting
            ? currentStep === TOTAL_STEPS
              ? 'Submitting...'
              : 'Saving...'
            : currentStep === TOTAL_STEPS
            ? isEditing
              ? 'Update Listing'
              : 'Create Listing'
            : 'Next'}
        </Button>
      </div>
    </div>
  );
}
