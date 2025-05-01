import { UserRole, Profile } from '@/types';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format date to a readable string
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

/**
 * Calculate profile completion percentage based on filled fields
 */
export function calculateProfileCompletion(
  profile: Partial<Profile>,
  userRoles: UserRole[] = []
): number {
  if (!profile) return 0;

  const hasRole = (role: UserRole) =>
    userRoles.includes(role) || userRoles.includes('both');

  const isHost = hasRole('host');
  const isHelper = hasRole('helper');

  // Define weights for different sections (adjust as needed)
  const weights = {
    basic: 4,
    address: 1,
    host: 3,
    helper: 3, // Includes skills
  };

  // Fields for each section
  const basicFields = [
    !!profile.firstName,
    !!profile.lastName,
    !!profile.bio,
    !!profile.profilePictureUrl, // Consider adding placeholder check?
    !!profile.languages?.length,
    !!profile.dateOfBirth,
    !!profile.gender,
  ];

  const addressFields = [
    !!profile.address?.city,
    !!profile.address?.country,
    // Add street, state, postalCode if deemed important
  ];

  const hostFields = isHost
    ? [
        !!profile.hostingExperience,
        !!profile.propertyDetails?.propertyType,
        // Add more host-specific fields if needed
      ]
    : [];

  const helperFields = isHelper
    ? [
        !!profile.helperExperience,
        !!profile.skills?.length, // Include skills check
        !!profile.availabilityStartDate, // Or a combined availability check
        // Add more helper-specific fields if needed
      ]
    : [];

  // Calculate filled fields for each section
  const filledBasic = basicFields.filter(Boolean).length;
  const filledAddress = addressFields.filter(Boolean).length;
  const filledHost = hostFields.filter(Boolean).length;
  const filledHelper = helperFields.filter(Boolean).length;

  // Calculate weighted completion score
  let totalScore = 0;
  let maxScore = 0;

  if (basicFields.length > 0) {
    totalScore += (filledBasic / basicFields.length) * weights.basic;
    maxScore += weights.basic;
  }
  if (addressFields.length > 0) {
    totalScore += (filledAddress / addressFields.length) * weights.address;
    maxScore += weights.address;
  }
  if (isHost && hostFields.length > 0) {
    totalScore += (filledHost / hostFields.length) * weights.host;
    maxScore += weights.host;
  }
  if (isHelper && helperFields.length > 0) {
    totalScore += (filledHelper / helperFields.length) * weights.helper;
    maxScore += weights.helper;
  }

  // Calculate percentage
  if (maxScore === 0) return 0;
  const percentage = Math.round((totalScore / maxScore) * 100);

  // Ensure percentage doesn't exceed 100
  return Math.min(percentage, 100);
}

/**
 * Format a number as currency
 */
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Truncate a string to a specified length
 */
export function truncateString(str: string, maxLength = 100): string {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength)}...`;
}

/**
 * Get a user's full name or username as fallback
 */
export function getUserDisplayName(
  firstName?: string,
  lastName?: string,
  fallback = 'User'
): string {
  if (firstName && lastName) return `${firstName} ${lastName}`;
  if (firstName) return firstName;
  if (lastName) return lastName;
  return fallback;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Create a slug from a string
 */
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

/**
 * Get today's date at the start of the day (midnight)
 */
export function getToday(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} bytes`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
