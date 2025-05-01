'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Listing } from '@/types';
import { api } from '@/mocks/api';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Import step components (will be created next)
// import ListingFormStep1 from './ListingFormStep1';
// import ListingFormStep2 from './ListingFormStep2';
// import ListingFormStep3 from './ListingFormStep3';
// import ListingFormStep4 from './ListingFormStep4';
// import ListingFormStep5 from './ListingFormStep5';

const TOTAL_STEPS = 5;
const LOCAL_STORAGE_KEY = 'listing_form_draft';

// Initial form state type (will expand as steps are built)
type ListingFormData = Partial<Listing>; // Start with Listing type

export default function ListingForm() {
  const { user } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ListingFormData>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Load draft from localStorage on mount
  useEffect(() => {
    const draft = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (draft) {
      try {
        const parsedDraft = JSON.parse(draft);
        // TODO: Add validation/migration logic if draft structure changes
        setFormData(parsedDraft);
        // Optionally restore step? Needs more logic.
        // setCurrentStep(parsedDraft.lastStep || 1);
      } catch (err) {
        console.error('Error parsing listing draft:', err);
        localStorage.removeItem(LOCAL_STORAGE_KEY); // Clear invalid draft
      }
    }
  }, []);

  // Save draft to localStorage on formData change
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      try {
        // Add metadata like last updated timestamp or step?
        const draftToSave = { ...formData /*, lastStep: currentStep */ };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(draftToSave));
      } catch (err) {
        console.error('Error saving listing draft:', err); // Handle potential quota errors
      }
    }
  }, [formData]);

  const handleNext = async () => {
    // TODO: Implement validation for the current step
    const isValid = true; // Placeholder
    setErrors({}); // Clear previous errors

    if (isValid) {
      if (currentStep < TOTAL_STEPS) {
        setCurrentStep(currentStep + 1);
      } else {
        // Final step - submit the form
        await handleSubmit();
      }
    } else {
      // TODO: Set errors based on validation result
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
      setSubmitError('You must be logged in to create a listing.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      // Final validation of the complete formData
      // Assuming formData holds all necessary fields collected through steps
      const listingDataForApi: Partial<
        Omit<
          Listing,
          'id' | 'createdAt' | 'updatedAt' | 'host' | 'bookings' | 'hostId'
        >
      > = {
        title: formData.title || '',
        description: formData.description || '',
        location: {
          address: formData.location?.address || '',
          city: formData.location?.city || '',
          country: formData.location?.country || '',
          // Consider adding state, postalCode, lat, long later
        },
        accommodationType: formData.accommodationType || 'other',
        amenities: formData.amenities || [],
        requiredHelpCategories: formData.requiredHelpCategories || [],
        workHoursPerWeek: formData.workHoursPerWeek || 0,
        benefitsOffered: formData.benefitsOffered || [],
        availabilityStartDate: formData.availabilityStartDate || new Date(), // Provide default if needed
        availabilityEndDate: formData.availabilityEndDate || new Date(), // Provide default if needed
        photos: formData.photos || [],
        houseRules: formData.houseRules || '',
        requiredLanguages: formData.requiredLanguages || [],
      };

      // Call API with hostId and the prepared data
      const response = await api.createListing(user.id, listingDataForApi);

      if (response.success && response.data) {
        setSubmitSuccess(true);
        localStorage.removeItem(LOCAL_STORAGE_KEY); // Clear draft on success
        setTimeout(() => {
          // Redirect to the newly created listing or a listings page
          router.push(`/listings/${response.data?.id || ''}`);
        }, 1500);
      } else {
        setSubmitError(response.error || 'Failed to create listing.');
      }
    } catch (error) {
      console.error('Listing submission error:', error);
      setSubmitError('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    // TODO: Replace with actual step components
    switch (currentStep) {
      case 1:
        return <div>Step 1: Basic Info (Component Placeholder)</div>; // <ListingFormStep1 data={formData} updateData={updateFormData} errors={errors} />;
      case 2:
        return <div>Step 2: Amenities (Component Placeholder)</div>; // <ListingFormStep2 data={formData} updateData={updateFormData} errors={errors} />;
      case 3:
        return <div>Step 3: Photos (Component Placeholder)</div>; // <ListingFormStep3 data={formData} updateData={updateFormData} errors={errors} />;
      case 4:
        return <div>Step 4: Work Requirements (Component Placeholder)</div>; // <ListingFormStep4 data={formData} updateData={updateFormData} errors={errors} />;
      case 5:
        return <div>Step 5: Availability (Component Placeholder)</div>; // <ListingFormStep5 data={formData} updateData={updateFormData} errors={errors} />;
      default:
        return <div>Invalid Step</div>;
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Create New Listing</h1>

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
            Listing created successfully! Redirecting...
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
      <div className="mb-8 min-h-[300px]">
        {' '}
        {/* Added min-height */}
        {renderStep()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <Button
          onClick={handlePrevious}
          disabled={currentStep === 1 || isSubmitting}
          variant="outline"
        >
          Previous
        </Button>
        <Button onClick={handleNext} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              {currentStep === TOTAL_STEPS ? 'Submitting...' : 'Saving...'}
            </>
          ) : currentStep === TOTAL_STEPS ? (
            'Submit Listing'
          ) : (
            'Next'
          )}
        </Button>
      </div>
    </div>
  );
}
