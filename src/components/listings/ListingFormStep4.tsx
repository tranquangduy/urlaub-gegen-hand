'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Listing, CategorySlug } from '@/types';
import { CATEGORIES } from '@/lib/constants'; // Import categories

interface ListingFormStep4Props {
  data: Partial<Listing>;
  updateData: (update: Partial<Listing>) => void;
  errors: { [key: string]: string };
}

export default function ListingFormStep4({
  data,
  updateData,
  errors,
}: ListingFormStep4Props) {
  const handleCategoryChange = (
    categorySlug: CategorySlug,
    checked: boolean
  ) => {
    const currentCategories = data.requiredHelpCategories || [];
    let updatedCategories;
    if (checked) {
      updatedCategories = [...currentCategories, categorySlug];
    } else {
      updatedCategories = currentCategories.filter(
        (slug) => slug !== categorySlug
      );
    }
    updateData({ requiredHelpCategories: updatedCategories });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Work Requirements</h2>

      <div className="space-y-3">
        <Label>Select the types of help needed</Label>
        <p className="text-sm text-muted-foreground">
          Choose one or more categories that best describe the tasks helpers
          will be involved in.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {Object.values(CATEGORIES).map((category) => (
            <div
              key={category.slug}
              className="flex items-start space-x-3 p-3 border rounded hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <Checkbox
                id={`category-${category.slug}`}
                checked={data.requiredHelpCategories?.includes(category.slug)}
                onCheckedChange={(checked) =>
                  handleCategoryChange(category.slug, !!checked)
                }
                className="mt-1" // Align checkbox with the label text
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor={`category-${category.slug}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {category.name}
                </label>
                {category.description && (
                  <p className="text-xs text-muted-foreground">
                    {category.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
        {errors.requiredHelpCategories && (
          <p className="text-xs text-red-500 mt-1">
            {errors.requiredHelpCategories}
          </p>
        )}
      </div>
      {/* Optional: Add a textarea for more detailed task description */}
      {/* <div className="space-y-2">
        <Label htmlFor="taskDetails">Detailed Task Description (Optional)</Label>
        <Textarea id="taskDetails" name="taskDetails" rows={4} placeholder="Provide more specific details about the required help..." />
      </div> */}
    </div>
  );
}
