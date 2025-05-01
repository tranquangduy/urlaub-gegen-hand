'use client';

import { useState, useRef } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, Upload, Check, X } from 'lucide-react';
import { formatFileSize } from '@/lib/utils';

interface ProfilePhotoUploaderProps {
  currentImageUrl?: string;
  fallbackName: string; // Used for Avatar fallback
  onImageChange: (imageDataUrl: string | null) => void;
  maxSizeMb?: number;
}

const MAX_FILE_SIZE_MB = 2; // Default max size 2MB

export default function ProfilePhotoUploader({
  currentImageUrl,
  fallbackName,
  onImageChange,
  maxSizeMb = MAX_FILE_SIZE_MB,
}: ProfilePhotoUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentImageUrl || null
  );
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);

    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (e.g., JPG, PNG, GIF).');
      return;
    }

    // Check file size
    const maxSizeInBytes = maxSizeMb * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      setError(
        `File size exceeds the limit of ${maxSizeMb}MB. Size: ${formatFileSize(
          file.size
        )}`
      );
      return;
    }

    // Read file as data URL for preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
      // Here you might want to add cropping/resizing before saving
      // For simplicity, we'll directly use the result for now
    };
    reader.onerror = () => {
      setError('Failed to read the selected file.');
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!previewUrl || previewUrl === currentImageUrl) {
      // No changes or no preview
      return;
    }
    setIsSaving(true);
    // Simulate saving delay
    setTimeout(() => {
      onImageChange(previewUrl); // Pass the new Data URL up
      setIsSaving(false);
      // Optionally clear the file input?
      // if (fileInputRef.current) fileInputRef.current.value = '';
    }, 500);
  };

  const handleCancel = () => {
    setPreviewUrl(currentImageUrl || null); // Revert to original or null
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Clear the file input
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    onImageChange(null); // Notify parent that image is removed
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Clear the file input
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const avatarFallback =
    fallbackName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase() || '?';

  return (
    <div className="flex flex-col items-center space-y-4">
      <Avatar className="h-32 w-32 border-4 border-muted">
        <AvatarImage src={previewUrl || undefined} alt={fallbackName} />
        <AvatarFallback className="text-4xl">{avatarFallback}</AvatarFallback>
      </Avatar>

      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {error && (
        <div className="text-red-600 text-sm flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-2">
        <Button onClick={triggerFileInput} variant="outline" size="sm">
          <Upload className="h-4 w-4 mr-1" />
          Change Photo
        </Button>

        {previewUrl && previewUrl !== currentImageUrl && (
          <>
            <Button onClick={handleSave} size="sm" disabled={isSaving}>
              {isSaving ? (
                'Saving...'
              ) : (
                <>
                  <Check className="h-4 w-4 mr-1" /> Save
                </>
              )}
            </Button>
            <Button
              onClick={handleCancel}
              variant="ghost"
              size="sm"
              disabled={isSaving}
            >
              <X className="h-4 w-4 mr-1" /> Cancel
            </Button>
          </>
        )}

        {previewUrl && (
          <Button
            onClick={handleRemove}
            variant="destructive"
            size="sm"
            disabled={isSaving}
          >
            <X className="h-4 w-4 mr-1" /> Remove Photo
          </Button>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        Max file size: {maxSizeMb}MB. Recommended: Square image.
      </p>
    </div>
  );
}
