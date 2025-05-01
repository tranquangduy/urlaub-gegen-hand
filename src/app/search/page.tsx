'use client';

import React, {
  useState,
  useEffect,
  Suspense,
  useMemo,
  useCallback,
} from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Listing, CategorySlug } from '@/types';
import { getAll } from '@/mocks/services';
import SearchForm from '@/components/search/SearchForm';
import SearchResults from '@/components/search/SearchResults';
import LoadingSkeleton from '@/components/search/LoadingSkeleton';
import { parseISO, isWithinInterval, compareAsc } from 'date-fns';
import { FilterTags } from '@/components/search/FilterTags';

// Placeholder for Container
const TempContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="container mx-auto px-4 py-8">{children}</div>
);

// Extended SearchParams type to include new filters and pagination
interface SearchParams {
  location?: string;
  startDate?: string;
  endDate?: string;
  category?: CategorySlug;
  languages?: string[];
  minHours?: number;
  maxHours?: number;
  page?: number;
  // sortBy?: string; // Future: Add sorting param
}

const ITEMS_PER_PAGE = 12;

function SearchPageContent() {
  const searchParamsHook = useSearchParams();
  const router = useRouter();

  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Parse search params from URL, including new ones
  const currentParams = useMemo(() => {
    const params: SearchParams = {};
    params.location = searchParamsHook.get('location') || undefined;
    params.startDate = searchParamsHook.get('startDate') || undefined;
    params.endDate = searchParamsHook.get('endDate') || undefined;
    params.category =
      (searchParamsHook.get('category') as CategorySlug) || undefined;
    params.languages = searchParamsHook.getAll('lang') || undefined; // Get all lang params
    const minH = searchParamsHook.get('minHours');
    params.minHours = minH ? parseInt(minH, 10) : undefined;
    const maxH = searchParamsHook.get('maxHours');
    params.maxHours = maxH ? parseInt(maxH, 10) : undefined;
    const page = searchParamsHook.get('page');
    params.page = page ? parseInt(page, 10) : 1;
    return params;
  }, [searchParamsHook]);

  // Fetch all listings once on initial load
  useEffect(() => {
    setLoading(true);
    setError(null);
    try {
      // Simulate async fetching
      setTimeout(() => {
        setAllListings(getAll('listings'));
        setLoading(false);
      }, 300); // Shorter delay
    } catch (err) {
      console.error('Error fetching all listings:', err);
      setError('Failed to load listings data.');
      setLoading(false);
    }
  }, []);

  // Filter and paginate listings based on currentParams and allListings
  const { paginatedListings, totalPages } = useMemo(() => {
    if (loading || error) return { paginatedListings: [], totalPages: 0 };

    const filtered = allListings.filter((listing) => {
      // Status filter (always apply)
      if (listing.status !== 'active') return false;

      // Location filter
      if (
        currentParams.location &&
        !(
          listing.location.city
            .toLowerCase()
            .includes(currentParams.location.toLowerCase()) ||
          listing.location.country
            .toLowerCase()
            .includes(currentParams.location.toLowerCase()) ||
          listing.location.address
            .toLowerCase()
            .includes(currentParams.location.toLowerCase())
        )
      ) {
        return false;
      }

      // Date range filter
      if (currentParams.startDate && currentParams.endDate) {
        try {
          const searchStart = parseISO(currentParams.startDate);
          const searchEnd = parseISO(currentParams.endDate);
          const listingStart = new Date(listing.availabilityStartDate);
          const listingEnd = new Date(listing.availabilityEndDate);
          if (
            !isWithinInterval(listingStart, {
              start: searchStart,
              end: searchEnd,
            }) &&
            !isWithinInterval(listingEnd, {
              start: searchStart,
              end: searchEnd,
            }) &&
            !isWithinInterval(searchStart, {
              start: listingStart,
              end: listingEnd,
            })
          ) {
            return false;
          }
        } catch {
          /* Ignore invalid dates */
        }
      }

      // Category filter
      if (
        currentParams.category &&
        !listing.requiredHelpCategories.includes(currentParams.category)
      ) {
        return false;
      }

      // Languages filter (must have ALL selected languages)
      if (currentParams.languages && currentParams.languages.length > 0) {
        const listingLangsLower =
          listing.requiredLanguages?.map((l) => l.toLowerCase()) || [];
        const requiredLangsLower = currentParams.languages.map((l) =>
          l.toLowerCase()
        );
        if (
          !requiredLangsLower.every((lang) => listingLangsLower.includes(lang))
        ) {
          return false;
        }
      }

      // Work Hours filter
      if (
        currentParams.minHours &&
        listing.workHoursPerWeek < currentParams.minHours
      ) {
        return false;
      }
      if (
        currentParams.maxHours &&
        listing.workHoursPerWeek > currentParams.maxHours
      ) {
        return false;
      }

      return true;
    });

    // TODO: Add sorting logic here (e.g., based on currentParams.sortBy)
    const sorted = filtered.sort(
      (a, b) => compareAsc(new Date(b.createdAt), new Date(a.createdAt)) // Default sort: newest first
    );

    // Pagination
    const calculatedTotalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
    const currentPage = currentParams.page || 1;
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginated = sorted.slice(startIndex, endIndex);

    return { paginatedListings: paginated, totalPages: calculatedTotalPages };
  }, [allListings, currentParams, loading, error]);

  // Function to update URL search params - useCallback for stability
  const handleSearch = useCallback(
    (newParams: Partial<SearchParams>) => {
      const query = new URLSearchParams(searchParamsHook); // Keep existing params

      // Update or remove params
      Object.entries(newParams).forEach(([key, value]) => {
        if (
          value !== undefined &&
          value !== null &&
          (typeof value !== 'string' || value !== '') &&
          (!Array.isArray(value) || value.length > 0)
        ) {
          // Special handling for array (languages)
          if (key === 'languages' && Array.isArray(value)) {
            query.delete('lang'); // Clear existing lang params
            value.forEach((lang) => query.append('lang', lang));
          } else if (key !== 'languages') {
            query.set(key, String(value));
          }
        } else {
          // Remove param if value is empty/undefined/null
          if (key === 'languages') {
            query.delete('lang');
          } else {
            query.delete(key);
          }
        }
      });

      // Reset page to 1 when filters change (excluding page itself)
      const filtersChanged = Object.keys(newParams).some((k) => k !== 'page');
      if (filtersChanged) {
        query.set('page', '1');
      }

      router.push(`/search?${query.toString()}`, { scroll: false }); // Prevent scroll jump
    },
    [router, searchParamsHook]
  );

  const handlePageChange = (newPage: number) => {
    handleSearch({ page: newPage });
  };

  // Compute active filters from currentParams, excluding pagination
  const activeFilters = useMemo(() => {
    const filters: Record<string, string | number | string[]> = {};
    if (currentParams.location) filters.location = currentParams.location;
    if (currentParams.startDate) filters.startDate = currentParams.startDate;
    if (currentParams.endDate) filters.endDate = currentParams.endDate;
    if (currentParams.category) filters.category = currentParams.category;
    if (currentParams.languages && currentParams.languages.length > 0)
      filters.languages = currentParams.languages;
    if (currentParams.minHours !== undefined)
      filters.minHours = currentParams.minHours;
    if (currentParams.maxHours !== undefined)
      filters.maxHours = currentParams.maxHours;
    return filters;
  }, [currentParams]);

  // Handler to remove individual filters or clear all
  const handleRemoveFilter = useCallback(
    (key: string, value?: string) => {
      if (key === 'all') {
        // Clear all filters
        handleSearch({
          location: undefined,
          startDate: undefined,
          endDate: undefined,
          category: undefined,
          languages: undefined,
          minHours: undefined,
          maxHours: undefined,
        });
      } else if (key === 'languages' && value) {
        const newLangs =
          currentParams.languages?.filter((l) => l !== value) || [];
        handleSearch({ languages: newLangs.length > 0 ? newLangs : undefined });
      } else {
        // Remove single filter
        handleSearch({ [key]: undefined });
      }
    },
    [handleSearch, currentParams.languages]
  );

  return (
    <TempContainer>
      <h1 className="text-3xl font-bold mb-6">Find Your Next Opportunity</h1>
      <div className="mb-8">
        {/* Pass currentParams to keep form in sync with URL */}
        <SearchForm initialParams={currentParams} onSearch={handleSearch} />
        {/* Display active filter tags */}
        <FilterTags filters={activeFilters} onRemove={handleRemoveFilter} />
      </div>

      {loading ? (
        <LoadingSkeleton count={ITEMS_PER_PAGE} />
      ) : error ? (
        <p className="text-red-500 text-center">Error: {error}</p>
      ) : (
        <SearchResults
          listings={paginatedListings}
          currentPage={currentParams.page || 1}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </TempContainer>
  );
}

// Use Suspense to handle client-side navigation and search params
export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <TempContainer>
          <LoadingSkeleton count={ITEMS_PER_PAGE} />{' '}
          {/* Show skeleton during initial load */}
        </TempContainer>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
