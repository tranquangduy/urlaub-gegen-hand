'use client';

import { useState } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate, getUserDisplayName } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';
import {
  User,
  MapPin,
  Mail,
  Phone,
  Globe,
  Calendar,
  Home,
  Briefcase,
  Edit,
  AlertTriangle,
  CheckCircle,
  Heart,
  Users,
  Wrench,
  Clock,
} from 'lucide-react';

export default function ProfileView() {
  const { user } = useAuth();
  const { profile, isLoading, completionPercentage } = useProfile();

  // Default active tab based on user role
  const getDefaultTab = (): string => {
    if (!user?.roles) return 'basic';

    if (user.roles.includes('host')) return 'host';
    if (user.roles.includes('helper')) return 'helper';
    return 'basic';
  };

  const [activeTab, setActiveTab] = useState(getDefaultTab());

  // Show loading state
  if (isLoading) {
    return (
      <div className="w-full flex justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Show message if profile doesn't exist
  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Profile not found</AlertTitle>
          <AlertDescription>
            You haven&apos;t created a profile yet. Please create one to
            proceed.
          </AlertDescription>
        </Alert>
        <Button asChild>
          <Link href="/profile/edit">Create Profile</Link>
        </Button>
      </div>
    );
  }

  // Handle profile completion alert level
  const getCompletionAlertVariant = (): 'default' | 'destructive' => {
    if (completionPercentage >= 50) return 'default';
    return 'destructive';
  };

  // Format social media link
  const formatSocialLink = (type: string, username: string | undefined) => {
    if (!username) return null;

    const baseUrls: Record<string, string> = {
      instagram: 'https://instagram.com/',
      facebook: 'https://facebook.com/',
      twitter: 'https://twitter.com/',
      linkedin: 'https://linkedin.com/in/',
    };

    const url = baseUrls[type];
    if (!url) return username;

    return (
      <a
        href={`${url}${username.replace('@', '')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline"
      >
        {username}
      </a>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Alert if profile is incomplete */}
      {completionPercentage < 100 && (
        <Alert className="mb-6" variant={getCompletionAlertVariant()}>
          {completionPercentage >= 80 ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertTriangle className="h-4 w-4" />
          )}
          <AlertTitle>
            {completionPercentage >= 80
              ? 'Profile almost complete!'
              : completionPercentage >= 50
              ? 'Profile incomplete'
              : 'Profile requires attention'}
          </AlertTitle>
          <AlertDescription>
            Your profile is {completionPercentage}% complete.{' '}
            <Link href="/profile/edit" className="font-medium underline ml-1">
              Complete your profile
            </Link>
          </AlertDescription>
        </Alert>
      )}

      {/* Profile header card */}
      <Card className="mb-6">
        <CardHeader className="pb-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <Avatar className="h-20 w-20">
                {profile.profilePictureUrl ? (
                  <AvatarImage
                    src={profile.profilePictureUrl}
                    alt={getUserDisplayName(
                      profile.firstName,
                      profile.lastName,
                      'User'
                    )}
                  />
                ) : (
                  <AvatarFallback>
                    {getUserDisplayName(
                      profile.firstName,
                      profile.lastName,
                      'U'
                    )
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <CardTitle className="text-2xl">
                  {getUserDisplayName(
                    profile.firstName,
                    profile.lastName,
                    'User'
                  )}
                </CardTitle>
                <div className="text-muted-foreground mt-1 flex flex-wrap gap-2">
                  {user?.roles?.map((role) => (
                    <span
                      key={role}
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        role === 'host'
                          ? 'bg-blue-100 text-blue-800'
                          : role === 'helper'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </span>
                  ))}
                </div>
                {profile.address?.city && profile.address?.country && (
                  <div className="text-sm text-muted-foreground mt-1 flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {profile.address.city}, {profile.address.country}
                  </div>
                )}
              </div>
            </div>
            <Button asChild className="mt-4 md:mt-0">
              <Link href="/profile/edit">
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {profile.bio && (
            <p className="text-muted-foreground">{profile.bio}</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {profile.languages && profile.languages.length > 0 && (
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span>{profile.languages.join(', ')}</span>
              </div>
            )}

            {profile.phoneNumber && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{profile.phoneNumber}</span>
              </div>
            )}

            {profile.website && (
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <a
                  href={
                    profile.website.startsWith('http')
                      ? profile.website
                      : `https://${profile.website}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {profile.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}

            {profile.dateOfBirth && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Born {formatDate(profile.dateOfBirth)}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Profile details tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList
          className="grid w-full mb-6"
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact information card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">
                      Full Name
                    </dt>
                    <dd>
                      {getUserDisplayName(
                        profile.firstName,
                        profile.lastName,
                        'Not provided'
                      )}
                    </dd>
                  </div>

                  {profile.phoneNumber && (
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">
                        Phone
                      </dt>
                      <dd>{profile.phoneNumber}</dd>
                    </div>
                  )}

                  {profile.website && (
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">
                        Website
                      </dt>
                      <dd>
                        <a
                          href={
                            profile.website.startsWith('http')
                              ? profile.website
                              : `https://${profile.website}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {profile.website.replace(/^https?:\/\//, '')}
                        </a>
                      </dd>
                    </div>
                  )}

                  {profile.gender && (
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">
                        Gender
                      </dt>
                      <dd>
                        {profile.gender === 'prefer_not_to_say'
                          ? 'Prefer not to say'
                          : profile.gender.charAt(0).toUpperCase() +
                            profile.gender.slice(1)}
                      </dd>
                    </div>
                  )}

                  {profile.dateOfBirth && (
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">
                        Date of Birth
                      </dt>
                      <dd>{formatDate(profile.dateOfBirth)}</dd>
                    </div>
                  )}
                </dl>
              </CardContent>
            </Card>

            {/* Address card */}
            {(profile.address?.street ||
              profile.address?.city ||
              profile.address?.country) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <address className="not-italic">
                    {profile.address?.street && <p>{profile.address.street}</p>}
                    {(profile.address?.city ||
                      profile.address?.state ||
                      profile.address?.postalCode) && (
                      <p>
                        {profile.address?.city && `${profile.address.city}, `}
                        {profile.address?.state && `${profile.address.state} `}
                        {profile.address?.postalCode &&
                          profile.address.postalCode}
                      </p>
                    )}
                    {profile.address?.country && (
                      <p>{profile.address.country}</p>
                    )}
                  </address>
                </CardContent>
              </Card>
            )}

            {/* Social media card */}
            {(profile.socialMedia?.instagram ||
              profile.socialMedia?.facebook ||
              profile.socialMedia?.twitter ||
              profile.socialMedia?.linkedin) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Social Media
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-3">
                    {profile.socialMedia?.instagram && (
                      <li className="flex items-center">
                        <span className="font-medium w-24">Instagram:</span>
                        {formatSocialLink(
                          'instagram',
                          profile.socialMedia.instagram
                        )}
                      </li>
                    )}
                    {profile.socialMedia?.facebook && (
                      <li className="flex items-center">
                        <span className="font-medium w-24">Facebook:</span>
                        {formatSocialLink(
                          'facebook',
                          profile.socialMedia.facebook
                        )}
                      </li>
                    )}
                    {profile.socialMedia?.twitter && (
                      <li className="flex items-center">
                        <span className="font-medium w-24">Twitter:</span>
                        {formatSocialLink(
                          'twitter',
                          profile.socialMedia.twitter
                        )}
                      </li>
                    )}
                    {profile.socialMedia?.linkedin && (
                      <li className="flex items-center">
                        <span className="font-medium w-24">LinkedIn:</span>
                        {formatSocialLink(
                          'linkedin',
                          profile.socialMedia.linkedin
                        )}
                      </li>
                    )}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Host Profile Tab */}
        {user?.roles?.includes('host') && (
          <TabsContent value="host">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Property details card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Home className="h-5 w-5 mr-2" />
                    Property Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {profile.hostingExperience ? (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">
                        Hosting Experience
                      </h4>
                      <p>{profile.hostingExperience}</p>
                    </div>
                  ) : (
                    <div className="p-4 rounded border border-amber-200 bg-amber-50 mb-6">
                      <p className="text-amber-800 text-sm flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Add details about your hosting experience to help
                        potential helpers
                      </p>
                    </div>
                  )}

                  <dl className="space-y-4">
                    {profile.propertyDetails?.propertyType && (
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">
                          Property Type
                        </dt>
                        <dd>{profile.propertyDetails.propertyType}</dd>
                      </div>
                    )}

                    {profile.propertyDetails?.numberOfRooms !== undefined && (
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">
                          Number of Rooms
                        </dt>
                        <dd>{profile.propertyDetails.numberOfRooms}</dd>
                      </div>
                    )}

                    {profile.propertyDetails?.maxGuests !== undefined && (
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">
                          Maximum Guests
                        </dt>
                        <dd>{profile.propertyDetails.maxGuests}</dd>
                      </div>
                    )}

                    {profile.propertyDetails?.amenities &&
                      profile.propertyDetails.amenities.length > 0 && (
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">
                            Amenities
                          </dt>
                          <dd className="flex flex-wrap gap-1 mt-1">
                            {profile.propertyDetails.amenities.map(
                              (amenity) => (
                                <span
                                  key={amenity}
                                  className="bg-gray-100 px-2 py-0.5 rounded-md text-sm"
                                >
                                  {amenity}
                                </span>
                              )
                            )}
                          </dd>
                        </div>
                      )}
                  </dl>
                </CardContent>
              </Card>

              {/* Hosting preferences card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Heart className="h-5 w-5 mr-2" />
                    Hosting Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <dl className="space-y-4">
                    {(profile.hostingPreferences?.minStayDuration !==
                      undefined ||
                      profile.hostingPreferences?.maxStayDuration !==
                        undefined) && (
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">
                          Stay Duration
                        </dt>
                        <dd>
                          {profile.hostingPreferences?.minStayDuration !==
                            undefined && (
                            <span>
                              Minimum:{' '}
                              {profile.hostingPreferences.minStayDuration} days
                            </span>
                          )}
                          {profile.hostingPreferences?.minStayDuration !==
                            undefined &&
                            profile.hostingPreferences?.maxStayDuration !==
                              undefined && <span className="mx-2">•</span>}
                          {profile.hostingPreferences?.maxStayDuration !==
                            undefined && (
                            <span>
                              Maximum:{' '}
                              {profile.hostingPreferences.maxStayDuration} days
                            </span>
                          )}
                        </dd>
                      </div>
                    )}

                    {profile.hostingPreferences?.preferredHelperGender &&
                      profile.hostingPreferences.preferredHelperGender !==
                        'no_preference' && (
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">
                            Preferred Helper Gender
                          </dt>
                          <dd>
                            {profile.hostingPreferences.preferredHelperGender
                              .charAt(0)
                              .toUpperCase() +
                              profile.hostingPreferences.preferredHelperGender.slice(
                                1
                              )}
                          </dd>
                        </div>
                      )}

                    {(profile.hostingPreferences?.preferredHelperAgeMin !==
                      undefined ||
                      profile.hostingPreferences?.preferredHelperAgeMax !==
                        undefined) && (
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">
                          Preferred Helper Age Range
                        </dt>
                        <dd>
                          {profile.hostingPreferences?.preferredHelperAgeMin !==
                            undefined && (
                            <span>
                              From{' '}
                              {profile.hostingPreferences.preferredHelperAgeMin}
                            </span>
                          )}
                          {profile.hostingPreferences?.preferredHelperAgeMin !==
                            undefined &&
                            profile.hostingPreferences
                              ?.preferredHelperAgeMax !== undefined && (
                              <span> to </span>
                            )}
                          {profile.hostingPreferences?.preferredHelperAgeMax !==
                            undefined && (
                            <span>
                              {profile.hostingPreferences.preferredHelperAgeMax}{' '}
                              years
                            </span>
                          )}
                        </dd>
                      </div>
                    )}
                  </dl>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}

        {/* Helper Profile Tab */}
        {user?.roles?.includes('helper') && (
          <TabsContent value="helper">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Helper details card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Briefcase className="h-5 w-5 mr-2" />
                    Helper Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {/* Skills Section */}
                  {profile.skills && profile.skills.length > 0 ? (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                        <Wrench className="h-4 w-4 mr-1.5" />
                        Skills
                      </h4>
                      <dd className="flex flex-wrap gap-2">
                        {profile.skills.map((skill) => (
                          <span
                            key={skill}
                            className="bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full text-xs font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </dd>
                    </div>
                  ) : (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Skills
                      </h4>
                      <p className="text-sm text-muted-foreground italic">
                        No skills added yet.
                      </p>
                    </div>
                  )}

                  {/* Availability Section - Updated */}
                  {(profile.availabilityStartDate ||
                    profile.availabilityEndDate) && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                        <Clock className="h-4 w-4 mr-1.5" />
                        Availability Period
                      </h4>
                      <dd className="text-sm">
                        {profile.availabilityStartDate && (
                          <span>
                            From {formatDate(profile.availabilityStartDate)}
                          </span>
                        )}
                        {profile.availabilityStartDate &&
                          profile.availabilityEndDate && <span> to </span>}
                        {profile.availabilityEndDate && (
                          <span>{formatDate(profile.availabilityEndDate)}</span>
                        )}
                      </dd>
                    </div>
                  )}

                  {profile.hoursPerWeek !== undefined && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">
                        Hours per Week
                      </h4>
                      <p>{profile.hoursPerWeek}</p>
                    </div>
                  )}

                  {profile.helperExperience ? (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">
                        Helper Experience
                      </h4>
                      <p>{profile.helperExperience}</p>
                    </div>
                  ) : (
                    <div className="p-4 rounded border border-amber-200 bg-amber-50 mb-6">
                      <p className="text-amber-800 text-sm flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Add details about your helper experience to find better
                        matches
                      </p>
                    </div>
                  )}

                  {profile.travelPreferences && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">
                        Travel Preferences
                      </h4>
                      <p>{profile.travelPreferences}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Health and emergency card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Health & Emergency
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <dl className="space-y-4">
                    {profile.dietaryRestrictions &&
                      profile.dietaryRestrictions.length > 0 && (
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">
                            Dietary Restrictions
                          </dt>
                          <dd className="flex flex-wrap gap-1 mt-1">
                            {profile.dietaryRestrictions.map((restriction) => (
                              <span
                                key={restriction}
                                className="bg-red-50 text-red-700 px-2 py-0.5 rounded-md text-sm"
                              >
                                {restriction}
                              </span>
                            ))}
                          </dd>
                        </div>
                      )}

                    {profile.allergies && profile.allergies.length > 0 && (
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">
                          Allergies
                        </dt>
                        <dd className="flex flex-wrap gap-1 mt-1">
                          {profile.allergies.map((allergy) => (
                            <span
                              key={allergy}
                              className="bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-md text-sm"
                            >
                              {allergy}
                            </span>
                          ))}
                        </dd>
                      </div>
                    )}

                    {(profile.emergencyContact?.name ||
                      profile.emergencyContact?.phoneNumber) && (
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">
                          Emergency Contact
                        </dt>
                        <dd className="mt-1">
                          {profile.emergencyContact?.name && (
                            <div className="flex items-center">
                              <User className="h-3 w-3 mr-1 text-muted-foreground" />
                              <span className="text-sm">
                                {profile.emergencyContact.name}
                                {profile.emergencyContact?.relationship && (
                                  <span className="text-muted-foreground ml-1">
                                    ({profile.emergencyContact.relationship})
                                  </span>
                                )}
                              </span>
                            </div>
                          )}

                          {profile.emergencyContact?.phoneNumber && (
                            <div className="flex items-center mt-1">
                              <Phone className="h-3 w-3 mr-1 text-muted-foreground" />
                              <span className="text-sm">
                                {profile.emergencyContact.phoneNumber}
                              </span>
                            </div>
                          )}

                          {profile.emergencyContact?.email && (
                            <div className="flex items-center mt-1">
                              <Mail className="h-3 w-3 mr-1 text-muted-foreground" />
                              <span className="text-sm">
                                {profile.emergencyContact.email}
                              </span>
                            </div>
                          )}
                        </dd>
                      </div>
                    )}

                    {(profile.education?.level ||
                      profile.education?.field ||
                      profile.education?.institution) && (
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">
                          Education
                        </dt>
                        <dd className="mt-1">
                          {profile.education?.level && (
                            <div className="text-sm">
                              {profile.education.level}
                            </div>
                          )}

                          {profile.education?.field && (
                            <div className="text-sm text-muted-foreground">
                              Field: {profile.education.field}
                            </div>
                          )}

                          {profile.education?.institution && (
                            <div className="text-sm text-muted-foreground">
                              Institution: {profile.education.institution}
                            </div>
                          )}
                        </dd>
                      </div>
                    )}
                  </dl>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
