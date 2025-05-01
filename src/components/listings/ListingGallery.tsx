import React from 'react';
// Removed unused Listing import
// import { Listing } from '@/types';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'; // Assuming Shadcn Carousel is set up
import Image from 'next/image'; // Using next/image for optimization
import { Card, CardContent } from '@/components/ui/card';

interface ListingGalleryProps {
  photos?: string[]; // Array of image URLs
  title?: string;
}

const ListingGallery: React.FC<ListingGalleryProps> = ({
  photos,
  title = 'Listing',
}) => {
  if (!photos || photos.length === 0) {
    return (
      <div className="bg-muted aspect-video rounded-md flex items-center justify-center">
        <p className="text-muted-foreground">No Photos Available</p>
      </div>
    );
  }

  return (
    <Carousel className="w-full">
      <CarouselContent>
        {photos.map((url, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-video items-center justify-center p-0 overflow-hidden rounded-lg">
                  {/* Using next/image for optimized image loading */}
                  <Image
                    src={url}
                    alt={`${title} - Photo ${index + 1}`}
                    width={1600} // Provide appropriate dimensions
                    height={900}
                    className="object-cover w-full h-full"
                    priority={index === 0} // Prioritize loading the first image
                  />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-4" />
      <CarouselNext className="absolute right-4" />
    </Carousel>
  );
};

export default ListingGallery;
