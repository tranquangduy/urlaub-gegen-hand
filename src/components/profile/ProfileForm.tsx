'use client';

import { useState, useEffect } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { useAuth } from '@/contexts/AuthContext';
import { Profile } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { isValidEmail, getUserDisplayName, cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CheckCircle2, CalendarIcon } from 'lucide-react';
import SkillsSelector from './SkillsSelector';
import ProfilePhotoUploader from './ProfilePhotoUploader';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';

const LANGUAGES = [
  'English',
  'Spanish',
  'French',
  'German',
  'Italian',
  'Portuguese',
  'Dutch',
  'Russian',
  'Chinese',
  'Japanese',
  'Korean',
  'Arabic',
  'Hindi',
  'Other',
];

const GENDERS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
];

const PROPERTY_TYPES = [
  'House',
  'Apartment',
  'Farm',
  'Villa',
  'Hostel',
  'Cottage',
  'Other',
];

export default function ProfileForm() {
  const { user } = useAuth();
  const {
    profile,
    isLoading,
    error,
    updateProfile,
    createProfile,
    completionPercentage,
  } = useProfile();

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    phoneNumber: '',
    website: '',
    gender: '',
    languages: [] as string[],
    dateOfBirth: '',
    profilePictureUrl: '' as string | null,

    // Address
    addressStreet: '',
    addressCity: '',
    addressState: '',
    addressPostalCode: '',
    addressCountry: '',

    // Social media
    instagram: '',
    facebook: '',
    twitter: '',
    linkedin: '',

    // Host specific
    hostingExperience: '',
    propertyType: '',
    numberOfRooms: '',
    maxGuests: '',
    amenities: '',
    minStayDuration: '',
    maxStayDuration: '',
    preferredHelperGender: 'no_preference',
    preferredHelperAgeMin: '',
    preferredHelperAgeMax: '',

    // Helper specific
    helperExperience: '',
    travelPreferences: '',
    hoursPerWeek: '',
    availabilityStartDate: undefined as Date | undefined,
    availabilityEndDate: undefined as Date | undefined,
    dietaryRestrictions: '',
    allergies: '',
    skills: [] as string[],

    // Emergency contact
    emergencyContactName: '',
    emergencyContactRelationship: '',
    emergencyContactPhone: '',
    emergencyContactEmail: '',

    // Education
    educationLevel: '',
    educationField: '',
    educationInstitution: '',
  });

  // Form validation state
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});

  // Form submission states
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  // Default active tab based on user role
  const getDefaultTab = (): string => {
    if (!user?.roles) return 'basic';

    if (user.roles.includes('host')) return 'host';
    if (user.roles.includes('helper')) return 'helper';
    return 'basic';
  };

  const [activeTab, setActiveTab] = useState(getDefaultTab());
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');

  // Populate form with existing profile data
  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        bio: profile.bio || '',
        phoneNumber: profile.phoneNumber || '',
        website: profile.website || '',
        gender: profile.gender || '',
        languages: profile.languages || [],
        dateOfBirth: profile.dateOfBirth
          ? new Date(profile.dateOfBirth).toISOString().split('T')[0]
          : '',
        profilePictureUrl: profile.profilePictureUrl || null,

        // Address
        addressStreet: profile.address?.street || '',
        addressCity: profile.address?.city || '',
        addressState: profile.address?.state || '',
        addressPostalCode: profile.address?.postalCode || '',
        addressCountry: profile.address?.country || '',

        // Social media
        instagram: profile.socialMedia?.instagram || '',
        facebook: profile.socialMedia?.facebook || '',
        twitter: profile.socialMedia?.twitter || '',
        linkedin: profile.socialMedia?.linkedin || '',

        // Host specific
        hostingExperience: profile.hostingExperience || '',
        propertyType: profile.propertyDetails?.propertyType || '',
        numberOfRooms: profile.propertyDetails?.numberOfRooms?.toString() || '',
        maxGuests: profile.propertyDetails?.maxGuests?.toString() || '',
        amenities: profile.propertyDetails?.amenities?.join(', ') || '',
        minStayDuration:
          profile.hostingPreferences?.minStayDuration?.toString() || '',
        maxStayDuration:
          profile.hostingPreferences?.maxStayDuration?.toString() || '',
        preferredHelperGender:
          profile.hostingPreferences?.preferredHelperGender || 'no_preference',
        preferredHelperAgeMin:
          profile.hostingPreferences?.preferredHelperAgeMin?.toString() || '',
        preferredHelperAgeMax:
          profile.hostingPreferences?.preferredHelperAgeMax?.toString() || '',

        // Helper specific
        helperExperience: profile.helperExperience || '',
        travelPreferences: profile.travelPreferences || '',
        hoursPerWeek: profile.hoursPerWeek?.toString() || '',
        availabilityStartDate: profile.availabilityStartDate
          ? new Date(profile.availabilityStartDate)
          : undefined,
        availabilityEndDate: profile.availabilityEndDate
          ? new Date(profile.availabilityEndDate)
          : undefined,
        dietaryRestrictions: profile.dietaryRestrictions?.join(', ') || '',
        allergies: profile.allergies?.join(', ') || '',
        skills: profile.skills || [],

        // Emergency contact
        emergencyContactName: profile.emergencyContact?.name || '',
        emergencyContactRelationship:
          profile.emergencyContact?.relationship || '',
        emergencyContactPhone: profile.emergencyContact?.phoneNumber || '',
        emergencyContactEmail: profile.emergencyContact?.email || '',

        // Education
        educationLevel: profile.education?.level || '',
        educationField: profile.education?.field || '',
        educationInstitution: profile.education?.institution || '',
      });
    }
  }, [profile]);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear validation error when field is edited
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear validation error when field is edited
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  // Handle skills changes
  const handleSkillsChange = (newSkills: string[]) => {
    setFormData((prev) => ({ ...prev, skills: newSkills }));
    // Optionally clear validation error for skills if any
    if (validationErrors.skills) {
      setValidationErrors((prev) => {
        const updated = { ...prev };
        delete updated.skills;
        return updated;
      });
    }
  };

  // Handle profile picture change
  const handleProfilePictureChange = (imageDataUrl: string | null) => {
    setFormData((prev) => ({ ...prev, profilePictureUrl: imageDataUrl }));
  };

  // Handle date changes
  const handleDateChange = (
    field: 'availabilityStartDate' | 'availabilityEndDate',
    date: Date | undefined
  ) => {
    setFormData((prev) => ({ ...prev, [field]: date }));
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        // Re-validate date range if necessary
        if (
          (field === 'availabilityStartDate' && prev.availabilityEndDate) ||
          (field === 'availabilityEndDate' && prev.availabilityStartDate)
        ) {
          if (
            prev.availabilityStartDate &&
            prev.availabilityEndDate &&
            prev.availabilityStartDate > prev.availabilityEndDate
          ) {
            updated.availabilityEndDate = 'End date must be after start date';
          } else {
            delete updated.availabilityEndDate; // Clear error if valid now
          }
        }
        return updated;
      });
    }
  };

  // Add language to the languages array
  const handleAddLanguage = () => {
    if (selectedLanguage && !formData.languages.includes(selectedLanguage)) {
      setFormData((prev) => ({
        ...prev,
        languages: [...prev.languages, selectedLanguage],
      }));
      setSelectedLanguage('');
    }
  };

  // Remove language from the languages array
  const handleRemoveLanguage = (language: string) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.filter((l) => l !== language),
    }));
  };

  // Validate form
  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    // Basic validation for required fields
    if (!formData.firstName) errors.firstName = 'First name is required';
    if (!formData.lastName) errors.lastName = 'Last name is required';

    // Skills validation (Example: require at least one skill for helpers)
    if (user?.roles?.includes('helper') && formData.skills.length === 0) {
      errors.skills = 'Please select at least one skill';
    }

    // Phone number validation
    if (
      formData.phoneNumber &&
      !/^\+?[\d\s-]{7,15}$/.test(formData.phoneNumber)
    ) {
      errors.phoneNumber = 'Please enter a valid phone number';
    }

    // Website validation
    if (
      formData.website &&
      !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(
        formData.website
      )
    ) {
      errors.website = 'Please enter a valid website URL';
    }

    // Email validation for emergency contact
    if (
      formData.emergencyContactEmail &&
      !isValidEmail(formData.emergencyContactEmail)
    ) {
      errors.emergencyContactEmail = 'Please enter a valid email address';
    }

    // Numeric field validation
    if (formData.numberOfRooms && !/^\d+$/.test(formData.numberOfRooms)) {
      errors.numberOfRooms = 'Please enter a valid number';
    }

    if (formData.maxGuests && !/^\d+$/.test(formData.maxGuests)) {
      errors.maxGuests = 'Please enter a valid number';
    }

    if (formData.minStayDuration && !/^\d+$/.test(formData.minStayDuration)) {
      errors.minStayDuration = 'Please enter a valid number';
    }

    if (formData.maxStayDuration && !/^\d+$/.test(formData.maxStayDuration)) {
      errors.maxStayDuration = 'Please enter a valid number';
    }

    if (formData.hoursPerWeek && !/^\d+$/.test(formData.hoursPerWeek)) {
      errors.hoursPerWeek = 'Please enter a valid number';
    }

    // Age validation
    if (
      formData.preferredHelperAgeMin &&
      !/^\d+$/.test(formData.preferredHelperAgeMin)
    ) {
      errors.preferredHelperAgeMin = 'Please enter a valid age';
    }

    if (
      formData.preferredHelperAgeMax &&
      !/^\d+$/.test(formData.preferredHelperAgeMax)
    ) {
      errors.preferredHelperAgeMax = 'Please enter a valid age';
    }

    // Date validation
    if (formData.availabilityStartDate && formData.availabilityEndDate) {
      const startDate = new Date(formData.availabilityStartDate);
      const endDate = new Date(formData.availabilityEndDate);

      if (startDate > endDate) {
        errors.availabilityEndDate = 'End date must be after start date';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      setFormError('Please correct the errors in the form');
      // Find the first tab with an error and switch to it
      const firstErrorField = Object.keys(validationErrors)[0];
      if (firstErrorField === 'skills') {
        setActiveTab('helper');
      } // Add more logic to switch tabs based on other error fields if needed
      else {
        setActiveTab('basic'); // Default to basic if not a specific helper/host field
      }
      return;
    }

    setSubmitting(true);
    setFormError('');
    setSuccess(false);

    try {
      // Prepare data for API, including profile picture
      const profileData: Partial<Profile> = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        bio: formData.bio,
        phoneNumber: formData.phoneNumber,
        website: formData.website,
        gender: (formData.gender as Profile['gender']) || undefined,
        languages:
          formData.languages.length > 0 ? formData.languages : undefined,
        dateOfBirth: formData.dateOfBirth
          ? new Date(formData.dateOfBirth)
          : undefined,
        profilePictureUrl: formData.profilePictureUrl || undefined,

        address: {
          street: formData.addressStreet,
          city: formData.addressCity,
          state: formData.addressState,
          postalCode: formData.addressPostalCode,
          country: formData.addressCountry,
        },

        socialMedia: {
          instagram: formData.instagram,
          facebook: formData.facebook,
          twitter: formData.twitter,
          linkedin: formData.linkedin,
        },
      };

      // Add host specific fields if applicable
      if (user?.roles?.includes('host')) {
        profileData.hostingExperience = formData.hostingExperience;
        profileData.propertyDetails = {
          propertyType: formData.propertyType,
          numberOfRooms: formData.numberOfRooms
            ? parseInt(formData.numberOfRooms)
            : undefined,
          maxGuests: formData.maxGuests
            ? parseInt(formData.maxGuests)
            : undefined,
          amenities: formData.amenities
            ? formData.amenities.split(',').map((a) => a.trim())
            : undefined,
        };
        profileData.hostingPreferences = {
          minStayDuration: formData.minStayDuration
            ? parseInt(formData.minStayDuration)
            : undefined,
          maxStayDuration: formData.maxStayDuration
            ? parseInt(formData.maxStayDuration)
            : undefined,
          preferredHelperGender: formData.preferredHelperGender as
            | 'male'
            | 'female'
            | 'no_preference',
          preferredHelperAgeMin: formData.preferredHelperAgeMin
            ? parseInt(formData.preferredHelperAgeMin)
            : undefined,
          preferredHelperAgeMax: formData.preferredHelperAgeMax
            ? parseInt(formData.preferredHelperAgeMax)
            : undefined,
        };
      }

      // Add helper specific fields if applicable
      if (user?.roles?.includes('helper')) {
        profileData.helperExperience = formData.helperExperience;
        profileData.travelPreferences = formData.travelPreferences;
        profileData.hoursPerWeek = formData.hoursPerWeek
          ? parseInt(formData.hoursPerWeek)
          : undefined;
        profileData.availabilityStartDate = formData.availabilityStartDate;
        profileData.availabilityEndDate = formData.availabilityEndDate;
        profileData.dietaryRestrictions = formData.dietaryRestrictions
          ? formData.dietaryRestrictions.split(',').map((d) => d.trim())
          : undefined;
        profileData.allergies = formData.allergies
          ? formData.allergies.split(',').map((a) => a.trim())
          : undefined;
        profileData.skills = formData.skills;
        profileData.emergencyContact = {
          name: formData.emergencyContactName,
          relationship: formData.emergencyContactRelationship,
          phoneNumber: formData.emergencyContactPhone,
          email: formData.emergencyContactEmail,
        };
        profileData.education = {
          level: formData.educationLevel,
          field: formData.educationField,
          institution: formData.educationInstitution,
        };
      }

      // Update or create profile
      let success;
      if (profile) {
        success = await updateProfile(profileData);
      } else if (user) {
        success = await createProfile(profileData);
      } else {
        setFormError('You must be logged in to create a profile.');
        setSubmitting(false);
        return;
      }

      if (success) {
        setSuccess(true);
        // Reset form error
        setFormError('');
        window.scrollTo(0, 0);
      } else {
        setFormError('Failed to save profile. Please try again.');
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      setFormError('An unexpected error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="w-full flex justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Helper function to render form field with validation
  const renderField = (
    name: string,
    label: string,
    type: string = 'text',
    required: boolean = false
  ) => {
    return (
      <div className="mb-4">
        <Label htmlFor={name} className="flex items-center gap-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </Label>
        <Input
          id={name}
          name={name}
          type={type}
          value={formData[name as keyof typeof formData] as string}
          onChange={handleChange}
          className={validationErrors[name] ? 'border-red-500' : ''}
          required={required}
        />
        {validationErrors[name] && (
          <p className="text-xs text-red-500 mt-1">{validationErrors[name]}</p>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Profile completion meter */}
      <div className="mb-8">
        <h3 className="text-sm font-medium mb-2 flex items-center">
          Profile Completion: {completionPercentage}%
          {completionPercentage >= 80 && (
            <span className="ml-2 text-green-500 flex items-center">
              <CheckCircle2 size={16} className="mr-1" /> Great progress!
            </span>
          )}
        </h3>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full ${
              completionPercentage < 30
                ? 'bg-red-500'
                : completionPercentage < 70
                ? 'bg-yellow-500'
                : 'bg-green-500'
            }`}
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Success message */}
      {success && (
        <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>
            Your profile has been saved successfully.
          </AlertDescription>
        </Alert>
      )}

      {/* Error message */}
      {(error || formError) && (
        <Alert className="mb-6 bg-red-50 text-red-800 border-red-200">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error || formError}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList
            className="grid w-full mb-8"
            style={{
              gridTemplateColumns: `repeat(${
                user?.roles?.includes('both')
                  ? 3
                  : user?.roles?.includes('host') ||
                    user?.roles?.includes('helper')
                  ? 2
                  : 1
              }, 1fr)`,
            }}
          >
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            {user?.roles?.includes('host') && (
              <TabsTrigger value="host">Host Profile</TabsTrigger>
            )}
            {user?.roles?.includes('helper') && (
              <TabsTrigger value="helper">Helper Profile</TabsTrigger>
            )}
          </TabsList>

          {/* Basic Info Tab */}
          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Fill in your basic personal details. Fields marked with * are
                  required.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="mb-6">
                  <Label>Profile Photo</Label>
                  <ProfilePhotoUploader
                    currentImageUrl={formData.profilePictureUrl || undefined}
                    fallbackName={getUserDisplayName(
                      formData.firstName,
                      formData.lastName,
                      'User'
                    )}
                    onImageChange={handleProfilePictureChange}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderField('firstName', 'First Name', 'text', true)}
                  {renderField('lastName', 'Last Name', 'text', true)}
                </div>

                <div className="mb-4">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell us a bit about yourself..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderField('dateOfBirth', 'Date of Birth', 'date')}

                  <div className="mb-4">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) =>
                        handleSelectChange('gender', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {GENDERS.map((gender) => (
                            <SelectItem key={gender.value} value={gender.value}>
                              {gender.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mb-4">
                  <Label className="mb-2 block">Languages</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.languages.map((language) => (
                      <span
                        key={language}
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center"
                      >
                        {language}
                        <button
                          type="button"
                          className="ml-1 text-blue-600 hover:text-blue-800"
                          onClick={() => handleRemoveLanguage(language)}
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Select
                      value={selectedLanguage}
                      onValueChange={setSelectedLanguage}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {LANGUAGES.map((language) => (
                            <SelectItem key={language} value={language}>
                              {language}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <Button type="button" onClick={handleAddLanguage}>
                      Add
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderField('phoneNumber', 'Phone Number')}
                  {renderField('website', 'Website')}
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Address</h3>

                  {renderField('addressStreet', 'Street')}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderField('addressCity', 'City')}
                    {renderField('addressState', 'State/Province')}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderField('addressPostalCode', 'Postal Code')}
                    {renderField('addressCountry', 'Country')}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">
                    Social Media (Optional)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderField('instagram', 'Instagram')}
                    {renderField('facebook', 'Facebook')}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderField('twitter', 'Twitter/X')}
                    {renderField('linkedin', 'LinkedIn')}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Host Profile Tab */}
          {user?.roles?.includes('host') && (
            <TabsContent value="host">
              <Card>
                <CardHeader>
                  <CardTitle>Host Information</CardTitle>
                  <CardDescription>
                    Share details about your property and hosting preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="mb-4">
                    <Label htmlFor="hostingExperience">
                      Your Hosting Experience
                    </Label>
                    <Textarea
                      id="hostingExperience"
                      name="hostingExperience"
                      value={formData.hostingExperience}
                      onChange={handleChange}
                      placeholder="Describe your experience as a host..."
                      rows={4}
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Property Details</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="mb-4">
                        <Label htmlFor="propertyType">Property Type</Label>
                        <Select
                          value={formData.propertyType}
                          onValueChange={(value) =>
                            handleSelectChange('propertyType', value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select property type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {PROPERTY_TYPES.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>

                      {renderField(
                        'numberOfRooms',
                        'Number of Rooms',
                        'number'
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {renderField('maxGuests', 'Maximum Guests', 'number')}

                      <div className="mb-4">
                        <Label htmlFor="amenities">Amenities</Label>
                        <Textarea
                          id="amenities"
                          name="amenities"
                          value={formData.amenities}
                          onChange={handleChange}
                          placeholder="Wifi, Kitchen, Laundry, etc. (comma separated)"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Hosting Preferences</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {renderField(
                        'minStayDuration',
                        'Minimum Stay (days)',
                        'number'
                      )}
                      {renderField(
                        'maxStayDuration',
                        'Maximum Stay (days)',
                        'number'
                      )}
                    </div>

                    <div className="mb-4">
                      <Label htmlFor="preferredHelperGender">
                        Preferred Helper Gender
                      </Label>
                      <Select
                        value={formData.preferredHelperGender}
                        onValueChange={(value) =>
                          handleSelectChange('preferredHelperGender', value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select preference" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="no_preference">
                              No Preference
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {renderField(
                        'preferredHelperAgeMin',
                        'Preferred Helper Age Min',
                        'number'
                      )}
                      {renderField(
                        'preferredHelperAgeMax',
                        'Preferred Helper Age Max',
                        'number'
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Helper Profile Tab */}
          {user?.roles?.includes('helper') && (
            <TabsContent value="helper">
              <Card>
                <CardHeader>
                  <CardTitle>Helper Information</CardTitle>
                  <CardDescription>
                    Share details about your skills, availability, and
                    preferences as a helper.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="skills">Skills</Label>
                    <SkillsSelector
                      selectedSkills={formData.skills}
                      onChange={handleSkillsChange}
                    />
                    {validationErrors.skills && (
                      <p className="text-xs text-red-500 mt-1">
                        {validationErrors.skills}
                      </p>
                    )}
                  </div>

                  <div className="mb-4">
                    <Label htmlFor="helperExperience">
                      Your Helper Experience
                    </Label>
                    <Textarea
                      id="helperExperience"
                      name="helperExperience"
                      value={formData.helperExperience}
                      onChange={handleChange}
                      placeholder="Describe your experience as a helper..."
                      rows={4}
                    />
                  </div>

                  <div className="mb-4">
                    <Label htmlFor="travelPreferences">
                      Travel Preferences
                    </Label>
                    <Textarea
                      id="travelPreferences"
                      name="travelPreferences"
                      value={formData.travelPreferences}
                      onChange={handleChange}
                      placeholder="Describe your travel preferences and style..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Availability</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="availabilityStartDate">
                          Available From
                        </Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-full justify-start text-left font-normal',
                                !formData.availabilityStartDate &&
                                  'text-muted-foreground'
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {formData.availabilityStartDate ? (
                                format(formData.availabilityStartDate, 'PPP')
                              ) : (
                                <span>Pick a start date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={formData.availabilityStartDate}
                              onSelect={(date) =>
                                handleDateChange('availabilityStartDate', date)
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        {validationErrors.availabilityStartDate && (
                          <p className="text-xs text-red-500 mt-1">
                            {validationErrors.availabilityStartDate}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="availabilityEndDate">
                          Available Until
                        </Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-full justify-start text-left font-normal',
                                !formData.availabilityEndDate &&
                                  'text-muted-foreground'
                              )}
                              disabled={!formData.availabilityStartDate} // Disable if start date not set
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {formData.availabilityEndDate ? (
                                format(formData.availabilityEndDate, 'PPP')
                              ) : (
                                <span>Pick an end date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={formData.availabilityEndDate}
                              onSelect={(date) =>
                                handleDateChange('availabilityEndDate', date)
                              }
                              disabled={(date) =>
                                formData.availabilityStartDate
                                  ? date < formData.availabilityStartDate
                                  : false
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        {validationErrors.availabilityEndDate && (
                          <p className="text-xs text-red-500 mt-1">
                            {validationErrors.availabilityEndDate}
                          </p>
                        )}
                      </div>
                    </div>

                    {renderField(
                      'hoursPerWeek',
                      'Hours Available Per Week',
                      'number'
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="mb-4">
                      <Label htmlFor="dietaryRestrictions">
                        Dietary Restrictions
                      </Label>
                      <Textarea
                        id="dietaryRestrictions"
                        name="dietaryRestrictions"
                        value={formData.dietaryRestrictions}
                        onChange={handleChange}
                        placeholder="Vegetarian, Vegan, Gluten-free, etc. (comma separated)"
                      />
                    </div>

                    <div className="mb-4">
                      <Label htmlFor="allergies">Allergies</Label>
                      <Textarea
                        id="allergies"
                        name="allergies"
                        value={formData.allergies}
                        onChange={handleChange}
                        placeholder="List any allergies (comma separated)"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Emergency Contact</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {renderField('emergencyContactName', 'Contact Name')}
                      {renderField(
                        'emergencyContactRelationship',
                        'Relationship'
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {renderField('emergencyContactPhone', 'Contact Phone')}
                      {renderField(
                        'emergencyContactEmail',
                        'Contact Email',
                        'email'
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">
                      Education (Optional)
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {renderField('educationLevel', 'Education Level')}
                      {renderField('educationField', 'Field of Study')}
                    </div>

                    {renderField('educationInstitution', 'Institution')}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          <div className="mt-6 flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </Tabs>
      </form>
    </div>
  );
}
