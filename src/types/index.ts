export type UserRole = 'host' | 'helper' | 'both';

export interface User {
  id: string;
  email: string;
  passwordHash: string; // In a real app, never store plain passwords
  roles: UserRole[];
  name?: string;
  createdAt: Date;
  updatedAt: Date;
  emailVerified?: Date;
  // Relationships
  profileId?: string;
  reviewsGiven?: Review[];
  reviewsReceived?: Review[];
  messagesSent?: Message[];
  messagesReceived?: Message[];
  bookingsMade?: Booking[]; // As Helper
  bookingsHosted?: Booking[]; // As Host
  listings?: Listing[]; // As Host
}

export interface Profile {
  id: string;
  userId: string; // Foreign key to User
  bio?: string;
  profilePictureUrl?: string;
  languages?: string[];
  phoneNumber?: string;
  website?: string;

  // Contact and personal info
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';

  // Location
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };

  // Social media
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };

  // Host specific
  hostRating?: number;
  hostSince?: Date;
  hostingExperience?: string;
  propertyDetails?: {
    propertyType?: string;
    numberOfRooms?: number;
    maxGuests?: number;
    amenities?: string[];
  };
  hostingPreferences?: {
    minStayDuration?: number;
    maxStayDuration?: number;
    preferredHelperGender?: 'male' | 'female' | 'no_preference';
    preferredHelperAgeMin?: number;
    preferredHelperAgeMax?: number;
  };

  // Helper specific
  helperRating?: number;
  skills?: string[];
  preferredCategories?: CategorySlug[];
  availabilityStartDate?: Date;
  availabilityEndDate?: Date;
  hoursPerWeek?: number;
  helperExperience?: string;
  travelPreferences?: string;
  dietaryRestrictions?: string[];
  allergies?: string[];
  emergencyContact?: {
    name?: string;
    relationship?: string;
    phoneNumber?: string;
    email?: string;
  };
  education?: {
    level?: string;
    field?: string;
    institution?: string;
  };

  // Profile completion
  completionPercentage?: number;

  // Common
  createdAt: Date;
  updatedAt: Date;

  // Relationships
  user: User;
}

export type AccommodationType =
  | 'private_room'
  | 'shared_room'
  | 'entire_place'
  | 'tent_space'
  | 'camper_van'
  | 'other';
export type CategorySlug =
  | 'housesitting'
  | 'agriculture_gardening'
  | 'petsitting_petcare'
  | 'sustainability_eco_projects'
  | 'ngos_childcare_nature_conservation'
  | 'construction_renovation'
  | 'household_help'
  | 'teaching_knowledge_sharing'
  | 'creative_activities'
  | 'tourism'
  | 'volunteer_work'
  | 'other';

export interface Category {
  id: string;
  slug: CategorySlug;
  name: string;
  description?: string;
}

export interface Listing {
  id: string;
  hostId: string; // Foreign key to User
  title: string;
  description: string;
  location: {
    address: string;
    city: string;
    country: string;
    // For MVP, lat/lng might be omitted or static
    latitude?: number;
    longitude?: number;
  };
  accommodationType: AccommodationType;
  amenities?: string[];
  requiredHelpCategories: CategorySlug[];
  workHoursPerWeek: number;
  benefitsOffered?: string[];
  availabilityStartDate: Date;
  availabilityEndDate: Date;
  photos?: string[]; // URLs to photos
  houseRules?: string;
  requiredLanguages?: string[];
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
  // Relationships
  host: User;
  bookings?: Booking[];
}

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'cancelled'
  | 'completed'
  | 'issue_reported';

export interface Booking {
  id: string;
  listingId: string; // Foreign key to Listing
  helperId: string; // Foreign key to User
  startDate: Date;
  endDate: Date;
  status: BookingStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  // Relationships
  listing: Listing;
  helper: User;
  messages?: Message[];
  reviews?: Review[]; // Reviews related to this specific booking
}

export interface Message {
  id: string;
  bookingId?: string; // Optional: Link message to a booking context
  conversationId: string; // Link message to a conversation thread
  senderId: string; // Foreign key to User
  receiverId: string; // Foreign key to User
  content: string;
  imageUrl?: string; // Optional image attachment
  readAt?: Date;
  createdAt: Date;
  // Relationships
  sender: User;
  receiver: User;
  booking?: Booking;
}

export interface Review {
  id: string;
  bookingId: string; // Foreign key to Booking
  reviewerId: string; // Foreign key to User
  revieweeId: string; // Foreign key to User
  rating: number; // e.g., 1-5 stars
  comment?: string;
  photoUrl?: string; // Optional photo evidence
  createdAt: Date;
  // Relationships
  booking: Booking;
  reviewer: User;
  reviewee: User;
}

// Simple verification structure for MVP
export interface Verification {
  id: string;
  userId: string; // Foreign key to User
  type: 'email' | 'phone' | 'id'; // ID verification is future consideration
  verifiedAt: Date;
  // Relationships
  user: User;
}

// Add Conversation type for messaging system
export interface Conversation {
  id: string;
  participantIds: string[]; // User IDs participating in this conversation
  lastMessageId?: string; // Reference to the most recent message
  createdAt: Date;
  updatedAt: Date;
}

export interface BookingRequest {
  id: string;
  listingId: string;
  helperId: string;
  startDate: string;
  endDate: string;
  purpose: string;
  specialRequirements?: string;
  status: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
}
