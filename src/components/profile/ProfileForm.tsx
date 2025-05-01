'use client';

import { useState, useEffect } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getUserDisplayName } from '@/lib/utils';

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
    // Address
    addressStreet: '',
    addressCity: '',
    addressState: '',
    addressPostalCode: '',
    addressCountry: '',
    // Other fields as needed
  });

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

  // Populate form with existing profile data
  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        bio: profile.bio || '',
        phoneNumber: profile.phoneNumber || '',
        website: profile.website || '',
        addressStreet: profile.address?.street || '',
        addressCity: profile.address?.city || '',
        addressState: profile.address?.state || '',
        addressPostalCode: profile.address?.postalCode || '',
        addressCountry: profile.address?.country || '',
      });
    }
  }, [profile]);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError('');
    setSuccess(false);

    try {
      // Prepare data for API
      const profileData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        bio: formData.bio,
        phoneNumber: formData.phoneNumber,
        website: formData.website,
        address: {
          street: formData.addressStreet,
          city: formData.addressCity,
          state: formData.addressState,
          postalCode: formData.addressPostalCode,
          country: formData.addressCountry,
        },
      };

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

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Profile completion meter */}
      <div className="mb-8">
        <h3 className="text-sm font-medium mb-2">
          Profile Completion: {completionPercentage}%
        </h3>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
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
                Update your basic profile information visible to other users
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* First Name */}
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Your first name"
                    />
                  </div>

                  {/* Last Name */}
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Your last name"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell others about yourself..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Phone Number */}
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  {/* Website */}
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Address</h3>

                  {/* Street */}
                  <div className="space-y-2">
                    <Label htmlFor="addressStreet">Street Address</Label>
                    <Input
                      id="addressStreet"
                      name="addressStreet"
                      value={formData.addressStreet}
                      onChange={handleChange}
                      placeholder="123 Main St"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* City */}
                    <div className="space-y-2">
                      <Label htmlFor="addressCity">City</Label>
                      <Input
                        id="addressCity"
                        name="addressCity"
                        value={formData.addressCity}
                        onChange={handleChange}
                        placeholder="New York"
                      />
                    </div>

                    {/* State/Province */}
                    <div className="space-y-2">
                      <Label htmlFor="addressState">State/Province</Label>
                      <Input
                        id="addressState"
                        name="addressState"
                        value={formData.addressState}
                        onChange={handleChange}
                        placeholder="NY"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Postal Code */}
                    <div className="space-y-2">
                      <Label htmlFor="addressPostalCode">Postal Code</Label>
                      <Input
                        id="addressPostalCode"
                        name="addressPostalCode"
                        value={formData.addressPostalCode}
                        onChange={handleChange}
                        placeholder="10001"
                      />
                    </div>

                    {/* Country */}
                    <div className="space-y-2">
                      <Label htmlFor="addressCountry">Country</Label>
                      <Input
                        id="addressCountry"
                        name="addressCountry"
                        value={formData.addressCountry}
                        onChange={handleChange}
                        placeholder="United States"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                      Saving...
                    </>
                  ) : (
                    'Save Profile'
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        {/* Host Profile Tab */}
        <TabsContent value="host">
          <Card>
            <CardHeader>
              <CardTitle>Host Information</CardTitle>
              <CardDescription>
                Add details about your hosting experience and property
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Host profile form will be implemented in subtask 4.2
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Helper Profile Tab */}
        <TabsContent value="helper">
          <Card>
            <CardHeader>
              <CardTitle>Helper Information</CardTitle>
              <CardDescription>
                Add details about your skills and availability as a helper
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Helper profile form will be implemented in subtask 4.2
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
