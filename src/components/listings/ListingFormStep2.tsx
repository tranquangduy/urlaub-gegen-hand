'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Listing } from '@/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

// Example list of common amenities (consider moving to constants)
const COMMON_AMENITIES = [
  'Wifi',
  'Kitchen',
  'Laundry',
  'Parking',
  'Air Conditioning',
  'Heating',
  'Workspace',
  'TV',
  'Pool',
  'Hot Tub',
  'BBQ Grill',
  'Patio or Balcony',
  'Garden or Backyard',
];

// Example list of benefits (consider moving to constants)
const COMMON_BENEFITS = [
  'Meals Provided',
  'Use of Bicycle',
  'Use of Car',
  'Local Transport Card',
  'Language Lessons',
  'Cultural Exchange',
  'Pocket Money',
];

interface ListingFormStep2Props {
  data: Partial<Listing>;
  updateData: (update: Partial<Listing>) => void;
  errors: { [key: string]: string }; // Assuming errors might be relevant here too
}

export default function ListingFormStep2({
  data,
  updateData,
  errors,
}: ListingFormStep2Props) {
  const handleAmenityChange = (amenity: string, checked: boolean) => {
    const currentAmenities = data.amenities || [];
    let updatedAmenities;
    if (checked) {
      updatedAmenities = [...currentAmenities, amenity];
    } else {
      updatedAmenities = currentAmenities.filter((a) => a !== amenity);
    }
    updateData({ amenities: updatedAmenities });
  };

  const handleBenefitChange = (benefit: string, checked: boolean) => {
    const currentBenefits = data.benefitsOffered || [];
    let updatedBenefits;
    if (checked) {
      updatedBenefits = [...currentBenefits, benefit];
    } else {
      updatedBenefits = currentBenefits.filter((b) => b !== benefit);
    }
    updateData({ benefitsOffered: updatedBenefits });
  };

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers or empty string
    if (value === '' || /^[0-9]+$/.test(value)) {
      updateData({
        workHoursPerWeek: value === '' ? undefined : parseInt(value, 10),
      });
    }
  };

  const handleHouseRulesChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    updateData({ houseRules: e.target.value });
  };

  const handleLanguagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const languages = e.target.value
      .split(',')
      .map((lang) => lang.trim())
      .filter(Boolean);
    updateData({ requiredLanguages: languages });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Details & Offerings</h2>

      {/* Amenities */}
      <div className="space-y-3">
        <Label>Amenities Offered</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {COMMON_AMENITIES.map((amenity) => (
            <div key={amenity} className="flex items-center space-x-2">
              <Checkbox
                id={`amenity-${amenity}`}
                checked={data.amenities?.includes(amenity)}
                onCheckedChange={(checked) =>
                  handleAmenityChange(amenity, !!checked)
                }
              />
              <label
                htmlFor={`amenity-${amenity}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {amenity}
              </label>
            </div>
          ))}
        </div>
        {/* Optional: Input for other amenities */}
      </div>

      {/* Work Hours */}
      <div className="space-y-2">
        <Label htmlFor="workHoursPerWeek">Expected Work Hours per Week</Label>
        <Input
          id="workHoursPerWeek"
          name="workHoursPerWeek"
          type="number" // Use number type, but handle parsing manually for better control
          value={
            data.workHoursPerWeek === undefined
              ? ''
              : String(data.workHoursPerWeek)
          }
          onChange={handleHoursChange}
          placeholder="e.g., 20"
          min="0"
        />
        {errors.workHoursPerWeek && (
          <p className="text-xs text-red-500 mt-1">{errors.workHoursPerWeek}</p>
        )}
      </div>

      {/* Benefits Offered */}
      <div className="space-y-3">
        <Label>Benefits Offered to Helper</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {COMMON_BENEFITS.map((benefit) => (
            <div key={benefit} className="flex items-center space-x-2">
              <Checkbox
                id={`benefit-${benefit}`}
                checked={data.benefitsOffered?.includes(benefit)}
                onCheckedChange={(checked) =>
                  handleBenefitChange(benefit, !!checked)
                }
              />
              <label
                htmlFor={`benefit-${benefit}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {benefit}
              </label>
            </div>
          ))}
        </div>
        {/* Optional: Input for other benefits */}
      </div>

      {/* Required Languages */}
      <div className="space-y-2">
        <Label htmlFor="requiredLanguages">
          Required Languages (comma-separated)
        </Label>
        <Input
          id="requiredLanguages"
          name="requiredLanguages"
          value={data.requiredLanguages?.join(', ') || ''}
          onChange={handleLanguagesChange}
          placeholder="e.g., English, German"
        />
        {errors.requiredLanguages && (
          <p className="text-xs text-red-500 mt-1">
            {errors.requiredLanguages}
          </p>
        )}
      </div>

      {/* House Rules */}
      <div className="space-y-2">
        <Label htmlFor="houseRules">House Rules (Optional)</Label>
        <Textarea
          id="houseRules"
          name="houseRules"
          value={data.houseRules || ''}
          onChange={handleHouseRulesChange}
          placeholder="e.g., No smoking indoors, Quiet hours after 10 PM..."
          rows={4}
        />
      </div>
    </div>
  );
}
