import React from 'react';
import { Listing, Profile } from '@/types';
import ListingGallery from './ListingGallery'; // Assuming this will be created
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { MapPin, Wrench, Check } from 'lucide-react';
import { format } from 'date-fns';

interface ListingDetailViewProps {
  listing: Listing;
  hostProfile: Profile | null;
}

// Placeholder for ListingGallery - expects string URLs now
const ListingGallery = ({ photos }: { photos?: string[] }) => (
  <div className="bg-gray-200 aspect-video rounded-md flex items-center justify-center">
    {photos && photos.length > 0 ? (
      // Basic image display for now - Carousel can be implemented later
      <img
        src={photos[0]}
        alt="Listing primary"
        className="object-cover w-full h-full rounded-md"
      />
    ) : (
      <p>No Photos Available</p>
    )}
  </div>
);

// Assuming a basic WorkRequirement shape if not explicitly defined in @/types
// This should ideally be added to src/types/index.ts
interface WorkRequirement {
  taskType: string;
  frequency: string;
  description: string;
}

const ListingDetailView: React.FC<ListingDetailViewProps> = ({
  listing,
  hostProfile,
}) => {
  // Destructure properties directly available on Listing type
  const {
    title,
    description,
    location,
    accommodationType,
    amenities,
    requiredHelpCategories, // Use this for "Help Needed"
    workHoursPerWeek,
    benefitsOffered,
    availabilityStartDate,
    availabilityEndDate,
    photos,
    houseRules,
    requiredLanguages,
  } = listing;

  const address = location?.address
    ? `${location.address}, ${location.city}, ${location.country}`
    : 'Address not specified';

  // Use accommodationType from Listing
  const propertyType = accommodationType || 'Type not specified';

  // Format availability dates using direct properties
  const availabilityDates = {
    from: availabilityStartDate ? new Date(availabilityStartDate) : undefined,
    to: availabilityEndDate ? new Date(availabilityEndDate) : undefined,
  };
  const formattedStartDate = availabilityStartDate
    ? format(new Date(availabilityStartDate), 'PPP')
    : 'N/A';
  const formattedEndDate = availabilityEndDate
    ? format(new Date(availabilityEndDate), 'PPP')
    : 'N/A';

  // Placeholder for Work Requirements display - structure needs confirmation
  // Maybe combine requiredHelpCategories and workHoursPerWeek?
  const workRequirementsDisplay: WorkRequirement[] = requiredHelpCategories.map(
    (category) => ({
      taskType: category
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase()), // Format slug
      frequency: `${workHoursPerWeek} hrs/week`, // Assuming hours apply to all categories
      description: `Help required in the ${category} category.`, // Generic description
    })
  );

  return (
    <div className="space-y-8">
      {/* Title and Basic Info */}
      <section>
        <h1 className="text-3xl font-bold mb-2">
          {title || 'Untitled Listing'}
        </h1>
        <div className="flex items-center text-muted-foreground mb-4">
          <MapPin className="mr-2 h-4 w-4" />
          <span>{address}</span>
        </div>
        <Badge variant="outline">{propertyType.replace(/_/g, ' ')}</Badge>
      </section>

      {/* Photo Gallery */}
      <section>
        <ListingGallery photos={photos} />
      </section>

      <Separator />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column (Details) */}
        <div className="md:col-span-2 space-y-6">
          {/* Description */}
          <section>
            <h2 className="text-2xl font-semibold mb-3">About this place</h2>
            <p className="text-muted-foreground whitespace-pre-line">
              {description || 'No description available.'}
            </p>
          </section>

          <Separator />

          {/* Amenities */}
          <section>
            <h2 className="text-2xl font-semibold mb-3">
              What this place offers
            </h2>
            {amenities && amenities.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center text-sm">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No amenities listed.
              </p>
            )}
          </section>

          <Separator />

          {/* Work Requirements */}
          <section>
            <h2 className="text-2xl font-semibold mb-3">Help Needed</h2>
            {workRequirementsDisplay && workRequirementsDisplay.length > 0 ? (
              <div className="space-y-4">
                {workRequirementsDisplay.map(
                  (req: WorkRequirement, index: number) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center">
                          <Wrench className="mr-2 h-5 w-5" />
                          {req.taskType}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground pt-1">
                          {req.frequency}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {req.description}
                        </p>
                      </CardContent>
                    </Card>
                  )
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No specific help requirements listed.
              </p>
            )}
          </section>

          <Separator />

          {/* Additional Info */}
          {(benefitsOffered?.length ||
            requiredLanguages?.length ||
            houseRules) && (
            <>
              <section>
                <h2 className="text-2xl font-semibold mb-3">
                  Other Information
                </h2>
                {benefitsOffered && benefitsOffered.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium mb-1">Benefits Offered:</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      {benefitsOffered.map((benefit, i) => (
                        <li key={i}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {requiredLanguages && requiredLanguages.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium mb-1">Languages Required:</h4>
                    <div className="flex flex-wrap gap-2">
                      {requiredLanguages.map((lang, i) => (
                        <Badge key={i} variant="secondary">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {houseRules && (
                  <div>
                    <h4 className="font-medium mb-1">House Rules:</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">
                      {houseRules}
                    </p>
                  </div>
                )}
              </section>
              <Separator />
            </>
          )}

          {/* Availability */}
          <section>
            <h2 className="text-2xl font-semibold mb-3">Availability</h2>
            {availabilityStartDate ? (
              <>
                <p className="text-sm text-muted-foreground mb-4">
                  Available from {formattedStartDate} to {formattedEndDate}
                </p>
                <Calendar
                  mode="range"
                  selected={availabilityDates}
                  className="rounded-md border p-0 mx-auto sm:mx-0"
                  numberOfMonths={2}
                  disabled // Make it read-only for display
                  // TODO: Consider showing recurring availability if that data exists on Listing
                />
                {/* Removed recurringDays logic as it's not directly on Listing type */}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Availability not specified.
              </p>
            )}
          </section>
        </div>

        {/* Right Column (Host Info & Booking) */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Host Information</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              {hostProfile ? (
                <>
                  <Avatar className="h-20 w-20">
                    {/* Use profilePictureUrl from Profile type */}
                    <AvatarImage
                      src={hostProfile.profilePictureUrl}
                      alt={hostProfile.firstName || 'Host'}
                    />
                    <AvatarFallback>
                      {hostProfile.firstName?.[0]}
                      {hostProfile.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <p className="font-semibold">
                    {hostProfile.firstName} {hostProfile.lastName}
                  </p>
                  {/* <Button variant="outline" size="sm">View Profile</Button> */}
                </>
              ) : (
                <p className="text-muted-foreground">
                  Host information loading or not available.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Interested?</CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Request to Book / Apply</Button>
              {/* TODO: Implement booking/application logic later */}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ListingDetailView;
