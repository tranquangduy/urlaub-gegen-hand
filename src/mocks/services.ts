import {
  User,
  Profile,
  Listing,
  Booking,
  Message,
  Review,
  Verification,
  Category,
  CategorySlug,
} from '@/types';

// Storage keys for localStorage
const STORAGE_KEYS = {
  USERS: 'urlaub_users',
  PROFILES: 'urlaub_profiles',
  LISTINGS: 'urlaub_listings',
  BOOKINGS: 'urlaub_bookings',
  MESSAGES: 'urlaub_messages',
  REVIEWS: 'urlaub_reviews',
  VERIFICATIONS: 'urlaub_verifications',
  CATEGORIES: 'urlaub_categories',
  DB_VERSION: 'urlaub_db_version',
};

// Current schema version for data versioning
const CURRENT_DB_VERSION = '1.0';

// Type for all possible entities
type EntityType =
  | 'users'
  | 'profiles'
  | 'listings'
  | 'bookings'
  | 'messages'
  | 'reviews'
  | 'verifications'
  | 'categories';

// Map entity types to their data interfaces
interface EntityTypeMap {
  users: User;
  profiles: Profile;
  listings: Listing;
  bookings: Booking;
  messages: Message;
  reviews: Review;
  verifications: Verification;
  categories: Category;
}

// Helper function to get storage key from entity type
const getStorageKey = (entityType: EntityType): string => {
  switch (entityType) {
    case 'users':
      return STORAGE_KEYS.USERS;
    case 'profiles':
      return STORAGE_KEYS.PROFILES;
    case 'listings':
      return STORAGE_KEYS.LISTINGS;
    case 'bookings':
      return STORAGE_KEYS.BOOKINGS;
    case 'messages':
      return STORAGE_KEYS.MESSAGES;
    case 'reviews':
      return STORAGE_KEYS.REVIEWS;
    case 'verifications':
      return STORAGE_KEYS.VERIFICATIONS;
    case 'categories':
      return STORAGE_KEYS.CATEGORIES;
    default:
      throw new Error(`Unknown entity type: ${entityType}`);
  }
};

// ----- Core Storage Service Functions -----

/**
 * Initialize local storage for the application
 * Check version and reset if needed
 */
export const initializeStorage = (): void => {
  if (typeof window === 'undefined') {
    // Skip in server-side rendering
    return;
  }

  try {
    const storedVersion = localStorage.getItem(STORAGE_KEYS.DB_VERSION);

    // If version doesn't match, clear and reinitialize
    if (storedVersion !== CURRENT_DB_VERSION) {
      console.log(`Database version mismatch. Resetting local storage.`);
      resetStorage();
      localStorage.setItem(STORAGE_KEYS.DB_VERSION, CURRENT_DB_VERSION);
    }
  } catch (error) {
    console.error('Error initializing localStorage:', error);
  }
};

/**
 * Reset all data in local storage
 */
export const resetStorage = (): void => {
  if (typeof window === 'undefined') return;

  try {
    // Clear only our application's data, not all localStorage
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });

    // Set initial empty arrays for collections
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.VERIFICATIONS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify([]));

    // Set the current version
    localStorage.setItem(STORAGE_KEYS.DB_VERSION, CURRENT_DB_VERSION);
  } catch (error) {
    console.error('Error resetting localStorage:', error);
  }
};

/**
 * Check localStorage space usage
 * @returns The percentage of used localStorage space
 */
export const checkStorageUsage = (): number | null => {
  if (typeof window === 'undefined') return null;

  try {
    // Rough estimate: most browsers support ~5MB of localStorage
    const maxLocalStorageSize = 5 * 1024 * 1024;
    let totalStorageUsed = 0;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key) || '';
        totalStorageUsed += key.length + value.length;
      }
    }

    return (totalStorageUsed / maxLocalStorageSize) * 100;
  } catch (error) {
    console.error('Error checking localStorage usage:', error);
    return null;
  }
};

// ----- Generic CRUD Functions -----

/**
 * Get all entities of a specific type
 */
export const getAll = <T extends EntityType>(
  entityType: T
): EntityTypeMap[T][] => {
  if (typeof window === 'undefined') return [];

  try {
    const storageKey = getStorageKey(entityType);
    const jsonData = localStorage.getItem(storageKey);

    if (!jsonData) {
      // Initialize if not found
      localStorage.setItem(
        storageKey,
        JSON.stringify([
          {
            email: 'admin@admin.de',
            passwordHash: 'admin123',
            id: '1',
          },
        ])
      );
      return [];
    }

    return JSON.parse(jsonData) as EntityTypeMap[T][];
  } catch (error) {
    console.error(`Error retrieving ${entityType} from localStorage:`, error);
    return [];
  }
};

/**
 * Get a specific entity by ID
 */
export const getById = <T extends EntityType>(
  entityType: T,
  id: string
): EntityTypeMap[T] | null => {
  if (typeof window === 'undefined') return null;

  try {
    const entities = getAll(entityType);
    return entities.find((entity) => entity.id === id) || null;
  } catch (error) {
    console.error(`Error retrieving ${entityType} with ID ${id}:`, error);
    return null;
  }
};

/**
 * Create a new entity
 */
export const create = <T extends EntityType>(
  entityType: T,
  entity: EntityTypeMap[T]
): EntityTypeMap[T] => {
  if (typeof window === 'undefined') return entity;

  try {
    const entities = getAll(entityType);
    const storageKey = getStorageKey(entityType);

    // Check for duplicate ID
    if (entities.some((e) => e.id === entity.id)) {
      throw new Error(`Entity with ID ${entity.id} already exists`);
    }

    const updatedEntities = [...entities, entity];
    localStorage.setItem(storageKey, JSON.stringify(updatedEntities));
    return entity;
  } catch (error) {
    console.error(`Error creating ${entityType}:`, error);
    throw error;
  }
};

/**
 * Create multiple entities at once
 */
export const createMany = <T extends EntityType>(
  entityType: T,
  entities: EntityTypeMap[T][]
): EntityTypeMap[T][] => {
  if (typeof window === 'undefined') return entities;

  try {
    const existingEntities = getAll(entityType);
    const storageKey = getStorageKey(entityType);

    // Filter out entities with duplicate IDs
    const newEntities = entities.filter(
      (entity) => !existingEntities.some((e) => e.id === entity.id)
    );

    const updatedEntities = [...existingEntities, ...newEntities];
    localStorage.setItem(storageKey, JSON.stringify(updatedEntities));
    return newEntities;
  } catch (error) {
    console.error(`Error creating multiple ${entityType}:`, error);
    throw error;
  }
};

/**
 * Update an existing entity
 */
export const update = <T extends EntityType>(
  entityType: T,
  id: string,
  updates: Partial<EntityTypeMap[T]>
): EntityTypeMap[T] | null => {
  if (typeof window === 'undefined') return null;

  try {
    const entities = getAll(entityType);
    const storageKey = getStorageKey(entityType);

    const index = entities.findIndex((entity) => entity.id === id);
    if (index === -1) {
      console.error(`Entity with ID ${id} not found`);
      return null;
    }

    // Create an updated entity with new values
    const updatedEntity = {
      ...entities[index],
      ...updates,
      updatedAt: new Date(), // Auto-update the updatedAt timestamp
    } as EntityTypeMap[T];

    // Replace the old entity with the updated one
    entities[index] = updatedEntity;
    localStorage.setItem(storageKey, JSON.stringify(entities));

    return updatedEntity;
  } catch (error) {
    console.error(`Error updating ${entityType} with ID ${id}:`, error);
    return null;
  }
};

/**
 * Delete an entity by ID
 */
export const remove = <T extends EntityType>(
  entityType: T,
  id: string
): boolean => {
  if (typeof window === 'undefined') return false;

  try {
    const entities = getAll(entityType);
    const storageKey = getStorageKey(entityType);

    const filteredEntities = entities.filter((entity) => entity.id !== id);

    // Check if any entity was removed
    if (filteredEntities.length === entities.length) {
      return false; // No entity was found with that ID
    }

    localStorage.setItem(storageKey, JSON.stringify(filteredEntities));
    return true;
  } catch (error) {
    console.error(`Error removing ${entityType} with ID ${id}:`, error);
    return false;
  }
};

/**
 * Filter entities based on criteria function
 */
export const filter = <T extends EntityType>(
  entityType: T,
  filterFn: (entity: EntityTypeMap[T]) => boolean
): EntityTypeMap[T][] => {
  if (typeof window === 'undefined') return [];

  try {
    const entities = getAll(entityType);
    return entities.filter(filterFn);
  } catch (error) {
    console.error(`Error filtering ${entityType}:`, error);
    return [];
  }
};

// ----- Specialized Query Functions -----

/**
 * Get a user by email
 */
export const getUserByEmail = (email: string): User | null => {
  if (typeof window === 'undefined') return null;
  try {
    const users = getAll('users');
    console.log(users.find((user) => user.email === email));
    return users.find((user) => user.email === email) || null;
  } catch (error) {
    console.error(`Error retrieving user by email ${email}:`, error);
    return null;
  }
};

/**
 * Get a user with their profile
 */
export const getUserWithProfile = (
  userId: string
): (User & { profile?: Profile }) | null => {
  if (typeof window === 'undefined') return null;

  try {
    const user = getById('users', userId);
    if (!user) return null;

    // Find the profile for this user
    const profile = getAll('profiles').find((p) => p.userId === userId);
    if (profile) {
      // Create a copy with the profile attached
      return {
        ...user,
        profile, // Adding as an extension
      };
    }

    return user;
  } catch (error) {
    console.error(
      `Error retrieving user with profile for ID ${userId}:`,
      error
    );
    return null;
  }
};

/**
 * Get profile with related user data
 */
export const getProfileWithUser = (profileId: string): Profile | null => {
  if (typeof window === 'undefined') return null;

  try {
    const profile = getById('profiles', profileId);
    if (!profile) return null;

    // Find the user for this profile
    const user = getById('users', profile.userId);
    if (user) {
      return {
        ...profile,
        user,
      };
    }

    return profile;
  } catch (error) {
    console.error(
      `Error retrieving profile with user for ID ${profileId}:`,
      error
    );
    return null;
  }
};

/**
 * Get listings with host information
 */
export const getListingsWithHosts = (): Listing[] => {
  if (typeof window === 'undefined') return [];

  try {
    const listings = getAll('listings');
    const users = getAll('users');

    return listings.map((listing) => {
      const host =
        users.find((user) => user.id === listing.hostId) || ({} as User);
      return {
        ...listing,
        host,
      };
    });
  } catch (error) {
    console.error('Error retrieving listings with hosts:', error);
    return [];
  }
};

/**
 * Get bookings with related listing and user information
 */
export const getBookingsWithDetails = (): Booking[] => {
  if (typeof window === 'undefined') return [];

  try {
    const bookings = getAll('bookings');
    const listings = getAll('listings');
    const users = getAll('users');

    return bookings.map((booking) => {
      const listing =
        listings.find((l) => l.id === booking.listingId) || ({} as Listing);
      const helper =
        users.find((u) => u.id === booking.helperId) || ({} as User);

      return {
        ...booking,
        listing,
        helper,
      };
    });
  } catch (error) {
    console.error('Error retrieving bookings with details:', error);
    return [];
  }
};

/**
 * Get messages with sender and receiver information
 */
export const getMessagesForConversation = (
  userId1: string,
  userId2: string
): Message[] => {
  if (typeof window === 'undefined') return [];

  try {
    const messages = getAll('messages');
    const users = getAll('users');

    // Filter messages between these two users
    const conversationMessages = messages.filter(
      (msg) =>
        (msg.senderId === userId1 && msg.receiverId === userId2) ||
        (msg.senderId === userId2 && msg.receiverId === userId1)
    );

    // Add sender and receiver objects
    return conversationMessages
      .map((message) => {
        const sender =
          users.find((user) => user.id === message.senderId) || ({} as User);
        const receiver =
          users.find((user) => user.id === message.receiverId) || ({} as User);

        return {
          ...message,
          sender,
          receiver,
        };
      })
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  } catch (error) {
    console.error(`Error retrieving messages for conversation:`, error);
    return [];
  }
};

/**
 * Get all categories or by slug
 */
export const getCategories = (slug?: CategorySlug): Category[] => {
  if (typeof window === 'undefined') return [];

  try {
    const categories = getAll('categories');
    if (slug) {
      return categories.filter((category) => category.slug === slug);
    }
    return categories;
  } catch (error) {
    console.error('Error retrieving categories:', error);
    return [];
  }
};

/**
 * Get all reviews for a user
 */
export const getReviewsForUser = (userId: string): Review[] => {
  if (typeof window === 'undefined') return [];

  try {
    const reviews = getAll('reviews');
    const filteredReviews = reviews.filter(
      (review) => review.revieweeId === userId
    );

    return filteredReviews.map((review) => {
      // Add reviewer info if needed
      const reviewer = getById('users', review.reviewerId) || ({} as User);
      return {
        ...review,
        reviewer,
      };
    });
  } catch (error) {
    console.error(`Error retrieving reviews for user ${userId}:`, error);
    return [];
  }
};

// ----- Data Relationship Utilities -----

/**
 * Link a user and a profile
 */
export const linkUserAndProfile = (
  userId: string,
  profileId: string
): boolean => {
  if (typeof window === 'undefined') return false;

  try {
    const user = getById('users', userId);
    const profile = getById('profiles', profileId);

    if (!user || !profile) {
      return false;
    }

    // Update the user with the profile reference
    update('users', userId, { profileId });

    // Update the profile with the user reference
    update('profiles', profileId, { userId });

    return true;
  } catch (error) {
    console.error(
      `Error linking user ${userId} and profile ${profileId}:`,
      error
    );
    return false;
  }
};

// ----- Data Pagination Utilities -----

export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

/**
 * Get paginated results for any entity type
 */
export const getPaginated = <T extends EntityType>(
  entityType: T,
  options: PaginationOptions,
  filterFn?: (entity: EntityTypeMap[T]) => boolean
): {
  data: EntityTypeMap[T][];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} => {
  if (typeof window === 'undefined') {
    return {
      data: [],
      total: 0,
      page: options.page,
      limit: options.limit,
      totalPages: 0,
    };
  }

  try {
    let entities = getAll(entityType);

    // Apply filter if provided
    if (filterFn) {
      entities = entities.filter(filterFn);
    }

    const total = entities.length;
    const totalPages = Math.ceil(total / options.limit);

    // Sort if specified
    if (options.sortBy) {
      entities.sort((a, b) => {
        const aValue = a[options.sortBy as keyof EntityTypeMap[T]];
        const bValue = b[options.sortBy as keyof EntityTypeMap[T]];

        if (options.sortDirection === 'desc') {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      });
    }

    // Paginate
    const startIndex = (options.page - 1) * options.limit;
    const endIndex = startIndex + options.limit;
    const paginatedData = entities.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      total,
      page: options.page,
      limit: options.limit,
      totalPages,
    };
  } catch (error) {
    console.error(`Error paginating ${entityType}:`, error);
    return {
      data: [],
      total: 0,
      page: options.page,
      limit: options.limit,
      totalPages: 0,
    };
  }
};

// ----- Search Utilities -----

/**
 * Search entities of any type by text query
 */
export const searchEntities = <T extends EntityType>(
  entityType: T,
  query: string,
  fields: (keyof EntityTypeMap[T])[]
): EntityTypeMap[T][] => {
  if (typeof window === 'undefined' || !query.trim()) return [];

  try {
    const entities = getAll(entityType);
    const normalizedQuery = query.toLowerCase().trim();

    return entities.filter((entity) => {
      return fields.some((field) => {
        const value = entity[field];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(normalizedQuery);
        }
        return false;
      });
    });
  } catch (error) {
    console.error(`Error searching ${entityType}:`, error);
    return [];
  }
};

// ----- Data Seeding Functions -----

/**
 * Reset and seed the database with initial data
 */
export { seedDatabase } from './seed';
