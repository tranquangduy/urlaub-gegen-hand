import React from 'react';
import { Listing } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';

interface ListingCardProps {
  listing: Listing;
  className?: string;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing, className }) => {
  const { id, title, location, accommodationType, photos } = listing;
  const address =
    location?.city && location?.country
      ? `${location.city}, ${location.country}`
      : 'Location not specified';
  const primaryPhoto = photos?.[0] || '/placeholder-image.jpg'; // Fallback image

  return (
    <Card
      className={`overflow-hidden transition-shadow hover:shadow-md ${className}`}
    >
      <Link href={`/listings/${id}`} className="block">
        <CardHeader className="p-0">
          <div className="aspect-video relative w-full">
            <Image
              src={primaryPhoto}
              alt={title || 'Listing image'}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-2">
          <CardTitle className="text-lg font-semibold truncate">
            {title || 'Untitled Listing'}
          </CardTitle>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="mr-1 h-4 w-4 flex-shrink-0" />
            <span className="truncate">{address}</span>
          </div>
          <Badge variant="outline" className="capitalize">
            {accommodationType?.replace(/_/g, ' ') || 'Unknown Type'}
          </Badge>
        </CardContent>
      </Link>
      {/* Footer can be added later if needed e.g., for price or rating */}
      {/* <CardFooter className="p-4 pt-0">
        <p>Footer content</p>
      </CardFooter> */}
    </Card>
  );
};

export default ListingCard;
