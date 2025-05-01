'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Listing } from '@/types';

// Assuming PROPERTY_TYPES might be moved to constants later or passed as prop
const PROPERTY_TYPES = [
  'House',
  'Apartment',
  'Farm',
  'Villa',
  'Hostel',
  'Cottage',
  'Other',
];

interface ListingFormStep1Props {
  data: Partial<Listing>;
  updateData: (update: Partial<Listing>) => void;
  errors: { [key: string]: string };
}

export default function ListingFormStep1({
  data,
  updateData,
  errors,
}: ListingFormStep1Props) {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    updateData({ [e.target.name]: e.target.value });
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateData({
      location: {
        address: data.location?.address || '',
        city: data.location?.city || '',
        country: data.location?.country || '',
        ...(data.location?.latitude && { latitude: data.location.latitude }),
        ...(data.location?.longitude && { longitude: data.location.longitude }),
        [name]: value,
      },
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    updateData({ [name]: value });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Basic Information</h2>

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Listing Title</Label>
        <Input
          id="title"
          name="title"
          value={data.title || ''}
          onChange={handleChange}
          placeholder="e.g., Cozy Farm Stay near the Alps"
          required
        />
        {errors.title && (
          <p className="text-xs text-red-500 mt-1">{errors.title}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={data.description || ''}
          onChange={handleChange}
          placeholder="Describe your place, the help needed, and what you offer..."
          rows={5}
          required
        />
        {errors.description && (
          <p className="text-xs text-red-500 mt-1">{errors.description}</p>
        )}
      </div>

      {/* Location */}
      <div className="space-y-4 border p-4 rounded-md">
        <h3 className="text-lg font-medium">Location</h3>
        <div className="space-y-2">
          <Label htmlFor="address">Street Address</Label>
          <Input
            id="address"
            name="address"
            value={data.location?.address || ''}
            onChange={handleLocationChange}
            placeholder="123 Main Street"
          />
          {/* Add error display if needed */}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              name="city"
              value={data.location?.city || ''}
              onChange={handleLocationChange}
              placeholder="City"
              required
            />
            {/* Add error display if needed */}
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              name="country"
              value={data.location?.country || ''}
              onChange={handleLocationChange}
              placeholder="Country"
              required
            />
            {/* Add error display if needed */}
          </div>
          {/* Optional: Add State/Province, Postal Code */}
        </div>
      </div>

      {/* Accommodation Type */}
      <div className="space-y-2">
        <Label htmlFor="accommodationType">Accommodation Type</Label>
        <Select
          value={data.accommodationType || ''}
          onValueChange={(value) =>
            handleSelectChange('accommodationType', value)
          }
        >
          <SelectTrigger id="accommodationType">
            <SelectValue placeholder="Select accommodation type" />
          </SelectTrigger>
          <SelectContent>
            {PROPERTY_TYPES.map((type) => (
              <SelectItem
                key={type}
                value={type.toLowerCase().replace(/ /g, '_')}
              >
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.accommodationType && (
          <p className="text-xs text-red-500 mt-1">
            {errors.accommodationType}
          </p>
        )}
      </div>
    </div>
  );
}
