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
  const hasRole = (role: UserRole) =>
    userRoles.includes(role) || userRoles.includes('both');

  const isHost = hasRole('host');
  const isHelper = hasRole('helper');

  // Required fields for all users
  const requiredFields = [
    !!profile.bio,
    !!profile.profilePictureUrl,
    !!profile.languages?.length,
    !!profile.firstName,
    !!profile.lastName,
  ];

  // Count personal info fields
  const personalInfoFields = [
    !!profile.dateOfBirth,
    !!profile.gender,
    !!profile.phoneNumber,
    !!profile.address?.city,
    !!profile.address?.country,
  ];

  // Host-specific fields
  const hostFields = isHost
    ? [
        !!profile.hostingExperience,
        !!profile.propertyDetails?.propertyType,
        !!profile.propertyDetails?.numberOfRooms,
        !!profile.propertyDetails?.maxGuests,
        !!profile.propertyDetails?.amenities?.length,
        !!profile.hostingPreferences?.minStayDuration,
        !!profile.hostingPreferences?.maxStayDuration,
      ]
    : [];

  // Helper-specific fields
  const helperFields = isHelper
    ? [
        !!profile.skills?.length,
        !!profile.preferredCategories?.length,
        !!profile.availabilityStartDate,
        !!profile.availabilityEndDate,
        !!profile.hoursPerWeek,
        !!profile.helperExperience,
        !!profile.emergencyContact?.name,
        !!profile.emergencyContact?.phoneNumber,
      ]
    : [];

  // Combine all applicable fields
  const allFields = [
    ...requiredFields,
    ...personalInfoFields,
    ...hostFields,
    ...helperFields,
  ];

  // Calculate percentage
  const filledFields = allFields.filter(Boolean).length;
  const totalFields = allFields.length;

  return Math.round((filledFields / totalFields) * 100);
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
