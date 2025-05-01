'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { CalendarIcon, Search } from 'lucide-react';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { CategorySlug } from '@/types'; // Assuming CategorySlug type is available
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

// TODO: Fetch or define categories properly
const ALL_CATEGORY_SLUGS: CategorySlug[] = [
  'housesitting',
  'agriculture_gardening',
  'petsitting_petcare',
  'sustainability_eco_projects',
  'ngos_childcare_nature_conservation',
  'construction_renovation',
  'household_help',
  'teaching_knowledge_sharing',
  'creative_activities',
  'tourism',
  'volunteer_work',
  'other',
];

const ALL_LANGUAGES = [
  'English',
  'German',
  'Spanish',
  'French',
  'Italian',
  'Portuguese',
];

// Extended SearchParams type
interface SearchParams {
  location?: string;
  startDate?: string;
  endDate?: string;
  category?: CategorySlug;
  languages?: string[];
  minHours?: number;
  maxHours?: number;
}

interface SearchFormProps {
  initialParams: SearchParams;
  onSearch: (params: SearchParams) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ initialParams, onSearch }) => {
  const [location, setLocation] = useState(initialParams.location || '');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    if (initialParams.startDate && initialParams.endDate) {
      try {
        return {
          from: new Date(initialParams.startDate),
          to: new Date(initialParams.endDate),
        };
      } catch {
        return undefined;
      }
    }
    return undefined;
  });
  const [category, setCategory] = useState<CategorySlug | undefined>(
    initialParams.category
  );
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(
    initialParams.languages || []
  );
  const [workHours, setWorkHours] = useState<[number, number]>([
    initialParams.minHours ?? 0,
    initialParams.maxHours ?? 40, // Default max hours
  ]);

  // Update local state if initialParams change (e.g., browser back/forward)
  useEffect(() => {
    setLocation(initialParams.location || '');
    setDateRange(() => {
      if (initialParams.startDate && initialParams.endDate) {
        try {
          return {
            from: new Date(initialParams.startDate),
            to: new Date(initialParams.endDate),
          };
        } catch {
          return undefined;
        }
      }
      return undefined;
    });
    setCategory(initialParams.category);
    setSelectedLanguages(initialParams.languages || []);
    setWorkHours([initialParams.minHours ?? 0, initialParams.maxHours ?? 40]);
  }, [initialParams]);

  const handleLanguageChange = (language: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(language)
        ? prev.filter((lang) => lang !== language)
        : [...prev, language]
    );
  };

  const handleWorkHoursChange = (value: number[]) => {
    if (value.length === 2) {
      setWorkHours([value[0], value[1]]);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    onSearch({
      location: location || undefined,
      startDate: dateRange?.from?.toISOString().split('T')[0],
      endDate: dateRange?.to?.toISOString().split('T')[0],
      category: category,
      languages: selectedLanguages.length > 0 ? selectedLanguages : undefined,
      minHours: workHours[0] > 0 ? workHours[0] : undefined, // Don't send 0 min
      maxHours: workHours[1] < 40 ? workHours[1] : undefined, // Don't send default max
    });
  };

  // Trigger search immediately when filters change (optional, can keep submit button)
  // useEffect(() => {
  //    handleSubmit();
  // }, [location, dateRange, category, selectedLanguages, workHours]);

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full mb-6 border rounded-lg bg-card shadow-sm"
      defaultValue="item-1"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger className="px-4 py-3 hover:no-underline">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            <span className="font-semibold">Search Listings</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="p-4 border-t">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end"
          >
            {/* Location Input */}
            <div className="lg:col-span-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                type="text"
                placeholder="City, Country..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            {/* Date Range Picker */}
            <div>
              <Label>Dates</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className={`w-full justify-start text-left font-normal ${
                      !dateRange && 'text-muted-foreground'
                    }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, 'LLL dd, y')} -{' '}
                          {format(dateRange.to, 'LLL dd, y')}
                        </>
                      ) : (
                        format(dateRange.from, 'LLL dd, y')
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                    disabled={{ before: new Date() }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Category Select */}
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={category}
                onValueChange={(value) =>
                  setCategory(
                    value === '' ? undefined : (value as CategorySlug)
                  )
                }
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Any Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_">Any Category</SelectItem>
                  {ALL_CATEGORY_SLUGS.map((slug) => (
                    <SelectItem key={slug} value={slug}>
                      {slug
                        .replace(/_/g, ' ')
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* --- Advanced Filters --- */}

            {/* Languages Filter */}
            <div className="lg:col-span-2 space-y-2">
              <Label>Languages Spoken</Label>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {ALL_LANGUAGES.map((lang) => (
                  <div key={lang} className="flex items-center space-x-2">
                    <Checkbox
                      id={`lang-${lang}`}
                      checked={selectedLanguages.includes(lang)}
                      onCheckedChange={() => handleLanguageChange(lang)}
                    />
                    <Label
                      htmlFor={`lang-${lang}`}
                      className="font-normal text-sm"
                    >
                      {lang}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Work Hours Filter */}
            <div className="lg:col-span-2 space-y-2">
              <Label>
                Work Hours per Week ({workHours[0]} - {workHours[1]} hrs)
              </Label>
              <Slider
                defaultValue={workHours}
                value={workHours}
                onValueChange={handleWorkHoursChange}
                min={0}
                max={40}
                step={5}
                minStepsBetweenThumbs={1}
                className="py-2"
              />
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full lg:col-start-4">
              <Search className="mr-2 h-4 w-4" /> Apply Filters
            </Button>
          </form>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default SearchForm;
