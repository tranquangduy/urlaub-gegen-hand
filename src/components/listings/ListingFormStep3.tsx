'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Upload, Trash2 } from 'lucide-react';
import { formatFileSize } from '@/lib/utils';
import Image from 'next/image';
import { Listing } from '@/types';

interface ListingFormStep3Props {
  data: Partial<Listing>;
  updateData: (update: Partial<Listing>) => void;
  errors: { [key: string]: string };
}

const MAX_PHOTOS = 5; // Limit number of photos
const MAX_FILE_SIZE_MB = 2; // Limit size per photo

export default function ListingFormStep3({
  data,
  updateData,
  errors,
}: ListingFormStep3Props) {
  const [photoUrls, setPhotoUrls] = useState<string[]>(data.photos || []);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setError(null);
    let fileReadErrorOccurred = false; // Track if any file causes an error

    const filesToProcess = Array.from(files).slice(
      0,
      MAX_PHOTOS - photoUrls.length
    );

    if (files.length > filesToProcess.length) {
      setError(
        `You can only add ${
          MAX_PHOTOS - photoUrls.length
        } more photo(s). Maximum is ${MAX_PHOTOS}.`
      );
    }

    const processFile = (file: File): Promise<string | null> => {
      return new Promise((resolve, reject) => {
        // Check file type
        if (!file.type.startsWith('image/')) {
          setError(`File '${file.name}' is not a valid image type.`);
          fileReadErrorOccurred = true;
          return reject(new Error('Invalid file type'));
        }

        // Check file size
        const maxSizeInBytes = MAX_FILE_SIZE_MB * 1024 * 1024;
        if (file.size > maxSizeInBytes) {
          setError(
            `File '${file.name}' (${formatFileSize(
              file.size
            )}) exceeds the ${MAX_FILE_SIZE_MB}MB limit.`
          );
          fileReadErrorOccurred = true;
          return reject(new Error('File too large'));
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.onerror = () => {
          console.error('File reading error for:', file.name);
          if (!fileReadErrorOccurred) {
            setError(`Failed to read file '${file.name}'.`);
            fileReadErrorOccurred = true;
          }
          reject(new Error('File read error'));
        };
        reader.readAsDataURL(file);
      });
    };

    const filePromises = filesToProcess.map(processFile);

    Promise.allSettled(filePromises).then((results) => {
      const successfullyReadUrls = results
        .filter((result) => result.status === 'fulfilled')
        .map(
          (result) => (result as PromiseFulfilledResult<string | null>).value
        )
        .filter((url): url is string => url !== null);

      const updatedPhotos = [...photoUrls, ...successfullyReadUrls];

      // Final check (should already be handled by slicing filesToProcess)
      const finalPhotos = updatedPhotos.slice(0, MAX_PHOTOS);
      setPhotoUrls(finalPhotos);
      updateData({ photos: finalPhotos });

      // Reset file input value
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    });
  };

  const handleRemovePhoto = (indexToRemove: number) => {
    const updatedPhotos = photoUrls.filter(
      (_, index) => index !== indexToRemove
    );
    setPhotoUrls(updatedPhotos);
    updateData({ photos: updatedPhotos });
    setError(null); // Clear error when removing a photo
  };

  const triggerFileInput = () => {
    setError(null);
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Listing Photos</h2>

      <div className="space-y-2">
        <Label htmlFor="photos">Upload Photos (up to {MAX_PHOTOS})</Label>
        <Input
          ref={fileInputRef}
          id="photos"
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
          disabled={photoUrls.length >= MAX_PHOTOS}
        />
        <Button
          onClick={triggerFileInput}
          variant="outline"
          disabled={photoUrls.length >= MAX_PHOTOS}
          type="button" // Ensure it doesn't submit the form
        >
          <Upload className="h-4 w-4 mr-2" />
          {photoUrls.length > 0 ? 'Add More Photos' : 'Select Photos'}
        </Button>
        <p className="text-xs text-muted-foreground">
          Max file size per photo: {MAX_FILE_SIZE_MB}MB.
        </p>
        {error && (
          <div className="text-red-600 text-sm flex items-center mt-2">
            <AlertCircle className="h-4 w-4 mr-1" />
            {error}
          </div>
        )}
        {/* Display general form errors passed down */}
        {errors.photos && (
          <p className="text-xs text-red-500 mt-1">{errors.photos}</p>
        )}
      </div>

      {/* Photo Previews */}
      {photoUrls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {photoUrls.map((url, index) => (
            <div
              key={index}
              className="relative group aspect-square border rounded overflow-hidden"
            >
              <Image
                src={url}
                alt={`Listing photo ${index + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                style={{ objectFit: 'cover' }}
                className="group-hover:opacity-75 transition-opacity"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                onClick={() => handleRemovePhoto(index)}
                aria-label={`Remove photo ${index + 1}`}
                type="button" // Ensure it doesn't submit the form
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
