'use client';

import { useProfile } from '@/contexts/ProfileContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getUserDisplayName } from '@/lib/utils';

export interface ProfileViewProps {
  userId?: string; // If provided, shows another user's profile
  onEdit?: () => void; // Optional callback for edit button
}

export default function ProfileView({ userId, onEdit }: ProfileViewProps) {
  const { user } = useAuth();
  const { profile, isLoading, completionPercentage } = useProfile();

  // Show loading state
  if (isLoading) {
    return (
      <div className="w-full flex justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // If no profile exists yet
  if (!profile) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Profile Not Found</CardTitle>
          <CardDescription>
            {userId
              ? "This user hasn't set up their profile yet."
              : "You haven't set up your profile yet."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!userId && user && (
            <Button onClick={onEdit}>Create Your Profile</Button>
          )}
        </CardContent>
      </Card>
    );
  }

  // Display name for the profile
  const displayName = getUserDisplayName(
    profile.firstName,
    profile.lastName,
    user?.name || 'User'
  );

  // Determine if this is the current user's profile
  const isOwnProfile = !userId || (user && user.id === profile.userId);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card className="w-full overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
        <div className="px-6 pb-6">
          <div className="flex flex-col md:flex-row gap-4 -mt-12">
            <div className="flex-shrink-0">
              <div className="relative">
                {profile.profilePictureUrl ? (
                  <img
                    src={profile.profilePictureUrl}
                    alt={displayName}
                    className="w-24 h-24 rounded-full border-4 border-white bg-white object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center text-gray-500">
                    <span className="text-2xl font-medium">
                      {displayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="md:pt-12 flex-grow">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{displayName}</h2>
                  {profile.user?.roles && (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {profile.user.roles.map((role) => (
                        <span
                          key={role}
                          className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800"
                        >
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {isOwnProfile && onEdit && (
                  <Button
                    onClick={onEdit}
                    variant="outline"
                    className="mt-4 md:mt-0"
                  >
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Profile completion (only for own profile) */}
          {isOwnProfile && (
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-1">
                <span>Profile Completion</span>
                <span className="font-medium">{completionPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Bio Section */}
      {profile.bio && (
        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line">{profile.bio}</p>
          </CardContent>
        </Card>
      )}

      {/* Contact & Location */}
      <Card>
        <CardHeader>
          <CardTitle>Contact & Location</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
          {/* Only show contact details if own profile or certain fields */}
          {profile.user?.email && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Email</h3>
              <p>{profile.user.email}</p>
            </div>
          )}

          {profile.phoneNumber && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Phone</h3>
              <p>{profile.phoneNumber}</p>
            </div>
          )}

          {profile.website && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Website</h3>
              <p>
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {profile.website}
                </a>
              </p>
            </div>
          )}

          {/* Location */}
          {profile.address?.city && profile.address?.country && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Location</h3>
              <p>
                {profile.address.city}
                {profile.address.state && `, ${profile.address.state}`}
                {profile.address.country && `, ${profile.address.country}`}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Languages */}
      {profile.languages && profile.languages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Languages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profile.languages.map((language) => (
                <span
                  key={language}
                  className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                >
                  {language}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Host Information */}
      {user?.roles?.includes('host') && (
        <Card>
          <CardHeader>
            <CardTitle>Host Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
              {profile.hostSince && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Host Since
                  </h3>
                  <p>{format(new Date(profile.hostSince), 'MMMM yyyy')}</p>
                </div>
              )}

              {profile.hostRating && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Rating</h3>
                  <div className="flex items-center">
                    <span className="text-amber-500 mr-1">★</span>
                    <span>{profile.hostRating.toFixed(1)}</span>
                  </div>
                </div>
              )}
            </div>

            {profile.hostingExperience && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Hosting Experience
                </h3>
                <p className="whitespace-pre-line">
                  {profile.hostingExperience}
                </p>
              </div>
            )}

            {/* Additional host details will be added in subtask 4.2 */}
          </CardContent>
        </Card>
      )}

      {/* Helper Information */}
      {user?.roles?.includes('helper') && (
        <Card>
          <CardHeader>
            <CardTitle>Helper Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
              {profile.helperRating && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Rating</h3>
                  <div className="flex items-center">
                    <span className="text-amber-500 mr-1">★</span>
                    <span>{profile.helperRating.toFixed(1)}</span>
                  </div>
                </div>
              )}

              {profile.hoursPerWeek && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Hours Per Week
                  </h3>
                  <p>{profile.hoursPerWeek} hours</p>
                </div>
              )}
            </div>

            {/* Skills */}
            {profile.skills && profile.skills.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Additional helper details will be added in subtask 4.2 */}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
