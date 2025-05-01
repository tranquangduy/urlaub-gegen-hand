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
  UserRole,
  BookingStatus,
} from '@/types';

import {
  getAll,
  getById,
  create,
  update,
  remove,
  getUserByEmail,
  getListingsWithHosts,
  getBookingsWithDetails,
  getMessagesForConversation,
  getPaginated,
  searchEntities,
  filter,
  PaginationOptions,
  getProfileWithUser,
} from './services';

// Simulate network latency for a more realistic API experience
const SIMULATED_DELAY_MS = process.env.NODE_ENV === 'development' ? 500 : 0;

/**
 * Utility to add a delay to simulate network latency
 */
const delay = (ms: number = SIMULATED_DELAY_MS): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Simulate an API response with proper structure
 */
interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
  timestamp: string;
}

// Create a type for API error responses
type ApiErrorResponse = Omit<ApiResponse<null>, 'data'> & {
  data: null;
  success: false;
};

/**
 * Wrap data in a standard API response format
 */
const createApiResponse = <T>(
  data: T,
  success = true,
  error?: string
): ApiResponse<T> => {
  return {
    data,
    success,
    error,
    timestamp: new Date().toISOString(),
  };
};

// Create a typed error response
const createErrorResponse = (error: string): ApiErrorResponse => {
  return {
    data: null,
    success: false,
    error,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Utility to handle errors in a consistent way
 */
const handleApiError = (error: unknown): ApiErrorResponse => {
  const errorMessage =
    error instanceof Error ? error.message : 'An error occurred';
  console.error('API Error:', errorMessage);
  return createErrorResponse(errorMessage);
};

// ------ Auth API Endpoints ------

/**
 * Register a new user
 */
export const apiRegister = async (
  email: string,
  password: string,
  name: string,
  roles: UserRole[]
): Promise<ApiResponse<{ user: User; token: string }> | ApiErrorResponse> => {
  try {
    await delay();

    // Check if user already exists
    const existingUser = getUserByEmail(email);
    if (existingUser) {
      return createErrorResponse('User with this email already exists');
    }

    // Create a new user
    const newUser: User = {
      id: `user_${Date.now()}`,
      email,
      passwordHash: password, // In a real app, this would be hashed
      name,
      roles,
      createdAt: new Date(),
      updatedAt: new Date(),
      emailVerified: undefined, // Requires verification
    };

    create('users', newUser);

    // Generate a fake JWT token
    const token = `mock_jwt_token_${newUser.id}`;

    return createApiResponse({ user: newUser, token });
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Login a user
 */
export const apiLogin = async (
  email: string,
  password: string
): Promise<ApiResponse<{ user: User; token: string }> | ApiErrorResponse> => {
  try {
    await delay();

    // Find the user
    const user = getUserByEmail(email);
    if (!user) {
      return createApiResponse(
        null as any,
        false,
        'No user found with this email'
      );
    }

    // Check password (in a real app, this would compare hashes)
    if (user.passwordHash !== password) {
      return createApiResponse(null as any, false, 'Invalid password');
    }

    // Generate a fake JWT token
    const token = `mock_jwt_token_${user.id}`;

    return createApiResponse({ user, token });
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get the current logged-in user
 */
export const apiGetCurrentUser = async (
  token: string
): Promise<ApiResponse<User> | ApiErrorResponse> => {
  try {
    await delay();

    // Extract user ID from token (in a real app, this would validate JWT)
    const userId = token.replace('mock_jwt_token_', '');
    const user = getById('users', userId);

    if (!user) {
      return createApiResponse(null as any, false, 'Invalid token');
    }

    return createApiResponse(user);
  } catch (error) {
    return handleApiError(error);
  }
};

// ------ User API Endpoints ------

/**
 * Get a user by ID
 */
export const apiGetUser = async (
  userId: string
): Promise<ApiResponse<User> | ApiErrorResponse> => {
  try {
    await delay();
    const user = getById('users', userId);

    if (!user) {
      return createApiResponse(null as any, false, 'User not found');
    }

    return createApiResponse(user);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get all users with pagination
 */
export const apiGetUsers = async (
  options: PaginationOptions = { page: 1, limit: 10 }
): Promise<
  | ApiResponse<{
      users: User[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>
  | ApiErrorResponse
> => {
  try {
    await delay();
    const result = getPaginated('users', options);

    return createApiResponse({
      users: result.data,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    });
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Create a new profile for a user
 */
export const apiCreateProfile = async (
  userId: string,
  profileData: Partial<Profile>
): Promise<ApiResponse<Profile> | ApiErrorResponse> => {
  try {
    await delay();

    // Check if user exists
    const user = getById('users', userId);
    if (!user) {
      return createApiResponse(null as any, false, 'User not found');
    }

    // Check if profile already exists
    const existingProfiles = filter(
      'profiles',
      (profile) => profile.userId === userId
    );
    if (existingProfiles.length > 0) {
      return createApiResponse(
        null as any,
        false,
        'Profile already exists for this user'
      );
    }

    // Create a new profile
    const newProfile: Profile = {
      id: `profile_${Date.now()}`,
      userId,
      bio: profileData.bio || '',
      profilePictureUrl: profileData.profilePictureUrl,
      languages: profileData.languages || [],
      hostRating: profileData.hostRating,
      helperRating: profileData.helperRating,
      skills: profileData.skills || [],
      preferredCategories: profileData.preferredCategories || [],
      availabilityStartDate: profileData.availabilityStartDate,
      availabilityEndDate: profileData.availabilityEndDate,
      hoursPerWeek: profileData.hoursPerWeek,
      travelPreferences: profileData.travelPreferences,
      createdAt: new Date(),
      updatedAt: new Date(),
      user: user, // Link back to user
    };

    create('profiles', newProfile);

    // Update user with profile reference
    update('users', userId, { profileId: newProfile.id });

    return createApiResponse(newProfile);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Update a user profile
 */
export const apiUpdateProfile = async (
  profileId: string,
  profileData: Partial<Profile>
): Promise<ApiResponse<Profile> | ApiErrorResponse> => {
  try {
    await delay();

    const updatedProfile = update('profiles', profileId, profileData);
    if (!updatedProfile) {
      return createApiResponse(null as any, false, 'Profile not found');
    }

    return createApiResponse(updatedProfile);
  } catch (error) {
    return handleApiError(error);
  }
};

// ------ Listing API Endpoints ------

/**
 * Create a new listing
 */
export const apiCreateListing = async (
  hostId: string,
  listingData: Partial<Listing>
): Promise<ApiResponse<Listing> | ApiErrorResponse> => {
  try {
    await delay();

    // Check if user exists and is a host
    const user = getById('users', hostId);
    if (!user) {
      return createApiResponse(null as any, false, 'User not found');
    }

    if (!user.roles.includes('host') && !user.roles.includes('both')) {
      return createApiResponse(
        null as any,
        false,
        'User is not authorized to create listings'
      );
    }

    // Create a new listing
    const newListing: Listing = {
      id: `listing_${Date.now()}`,
      hostId,
      title: listingData.title || 'Untitled Listing',
      description: listingData.description || '',
      location: listingData.location || {
        address: '',
        city: '',
        country: '',
      },
      accommodationType: listingData.accommodationType || 'private_room',
      amenities: listingData.amenities || [],
      requiredHelpCategories: listingData.requiredHelpCategories || [],
      workHoursPerWeek: listingData.workHoursPerWeek || 20,
      benefitsOffered: listingData.benefitsOffered || [],
      availabilityStartDate: listingData.availabilityStartDate || new Date(),
      availabilityEndDate:
        listingData.availabilityEndDate ||
        new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
      photos: listingData.photos || [],
      houseRules: listingData.houseRules || '',
      requiredLanguages: listingData.requiredLanguages || [],
      createdAt: new Date(),
      updatedAt: new Date(),
      host: user,
    };

    create('listings', newListing);
    return createApiResponse(newListing);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get all listings with pagination and filters
 */
export const apiGetListings = async (
  options: PaginationOptions = { page: 1, limit: 10 },
  filters: {
    category?: CategorySlug;
    location?: string;
    dateFrom?: Date;
    dateTo?: Date;
    accommodationType?: string;
    workHoursMax?: number;
  } = {}
): Promise<
  | ApiResponse<{
      listings: Listing[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>
  | ApiErrorResponse
> => {
  try {
    await delay();

    // Apply filters
    const filterFn = (listing: Listing) => {
      let passes = true;

      if (filters.category && passes) {
        passes = listing.requiredHelpCategories.includes(filters.category);
      }

      if (filters.location && passes) {
        const locationLower = filters.location.toLowerCase();
        passes =
          listing.location.city.toLowerCase().includes(locationLower) ||
          listing.location.country.toLowerCase().includes(locationLower);
      }

      if (filters.dateFrom && passes) {
        passes =
          new Date(listing.availabilityEndDate) >= new Date(filters.dateFrom);
      }

      if (filters.dateTo && passes) {
        passes =
          new Date(listing.availabilityStartDate) <= new Date(filters.dateTo);
      }

      if (filters.accommodationType && passes) {
        passes = listing.accommodationType === filters.accommodationType;
      }

      if (filters.workHoursMax && passes) {
        passes = listing.workHoursPerWeek <= filters.workHoursMax;
      }

      return passes;
    };

    const result = getPaginated('listings', options, filterFn);

    // Enrich with host data
    const listings = result.data.map((listing) => {
      const host = getById('users', listing.hostId) || ({} as User);
      return { ...listing, host };
    });

    return createApiResponse({
      listings,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    });
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get a specific listing
 */
export const apiGetListing = async (
  listingId: string
): Promise<ApiResponse<Listing> | ApiErrorResponse> => {
  try {
    await delay();
    const listing = getById('listings', listingId);

    if (!listing) {
      return createApiResponse(null as any, false, 'Listing not found');
    }

    // Enrich with host data
    const host = getById('users', listing.hostId) || ({} as User);
    const enrichedListing = { ...listing, host };

    return createApiResponse(enrichedListing);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Update a listing
 */
export const apiUpdateListing = async (
  listingId: string,
  userId: string,
  listingData: Partial<Listing>
): Promise<ApiResponse<Listing> | ApiErrorResponse> => {
  try {
    await delay();

    // Get the listing
    const listing = getById('listings', listingId);
    if (!listing) {
      return createApiResponse(null as any, false, 'Listing not found');
    }

    // Check if user is the owner
    if (listing.hostId !== userId) {
      return createApiResponse(
        null as any,
        false,
        'You are not authorized to update this listing'
      );
    }

    // Update the listing
    const updatedListing = update('listings', listingId, listingData);
    if (!updatedListing) {
      return createApiResponse(null as any, false, 'Failed to update listing');
    }

    return createApiResponse(updatedListing);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Delete a listing
 */
export const apiDeleteListing = async (
  listingId: string,
  userId: string
): Promise<ApiResponse<{ success: boolean }> | ApiErrorResponse> => {
  try {
    await delay();

    // Get the listing
    const listing = getById('listings', listingId);
    if (!listing) {
      return createErrorResponse('Listing not found');
    }

    // Check if user is the owner
    if (listing.hostId !== userId) {
      return createErrorResponse(
        'You are not authorized to delete this listing'
      );
    }

    // Delete the listing
    const success = remove('listings', listingId);
    return createApiResponse({ success });
  } catch (error) {
    return handleApiError(error);
  }
};

// ------ Booking API Endpoints ------

/**
 * Create a booking request
 */
export const apiCreateBooking = async (
  listingId: string,
  helperId: string,
  startDate: Date,
  endDate: Date,
  notes?: string
): Promise<ApiResponse<Booking> | ApiErrorResponse> => {
  try {
    await delay();

    // Check if listing exists
    const listing = getById('listings', listingId);
    if (!listing) {
      return createErrorResponse('Listing not found');
    }

    // Check if user exists
    const helper = getById('users', helperId);
    if (!helper) {
      return createErrorResponse('User not found');
    }

    // Check if dates are within listing availability
    const listingStart = new Date(listing.availabilityStartDate);
    const listingEnd = new Date(listing.availabilityEndDate);
    const requestStart = new Date(startDate);
    const requestEnd = new Date(endDate);

    if (requestStart < listingStart || requestEnd > listingEnd) {
      return createErrorResponse(
        'Booking dates are outside of listing availability'
      );
    }

    // Create a new booking
    const newBooking: Booking = {
      id: `booking_${Date.now()}`,
      listingId,
      helperId,
      startDate: requestStart,
      endDate: requestEnd,
      status: 'pending',
      notes,
      createdAt: new Date(),
      updatedAt: new Date(),
      listing,
      helper,
    };

    create('bookings', newBooking);
    return createApiResponse(newBooking);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get all bookings for a user (as host or helper)
 */
export const apiGetUserBookings = async (
  userId: string,
  role: 'host' | 'helper',
  status?: BookingStatus
): Promise<ApiResponse<Booking[]>> => {
  try {
    await delay();

    // Get all bookings
    const bookings = getBookingsWithDetails();

    // Filter by user role and optionally by status
    const filteredBookings = bookings.filter((booking) => {
      // Filter by role
      const roleMatch =
        role === 'helper'
          ? booking.helperId === userId
          : booking.listing.hostId === userId;

      // Filter by status if provided
      const statusMatch = status ? booking.status === status : true;

      return roleMatch && statusMatch;
    });

    return createApiResponse(filteredBookings);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Update a booking status
 */
export const apiUpdateBookingStatus = async (
  bookingId: string,
  userId: string,
  status: BookingStatus
): Promise<ApiResponse<Booking>> => {
  try {
    await delay();

    // Get the booking
    const booking = getById('bookings', bookingId);
    if (!booking) {
      return createApiResponse(null as any, false, 'Booking not found');
    }

    // Check if user is authorized (host or helper)
    const listing = getById('listings', booking.listingId);
    if (!listing) {
      return createApiResponse(null as any, false, 'Listing not found');
    }

    if (booking.helperId !== userId && listing.hostId !== userId) {
      return createApiResponse(
        null as any,
        false,
        'You are not authorized to update this booking'
      );
    }

    // Update the booking status
    const updatedBooking = update('bookings', bookingId, { status });
    if (!updatedBooking) {
      return createApiResponse(null as any, false, 'Failed to update booking');
    }

    return createApiResponse(updatedBooking);
  } catch (error) {
    return handleApiError(error);
  }
};

// ------ Message API Endpoints ------

/**
 * Send a message
 */
export const apiSendMessage = async (
  senderId: string,
  receiverId: string,
  content: string,
  bookingId?: string,
  imageUrl?: string
): Promise<ApiResponse<Message>> => {
  try {
    await delay();

    // Check if users exist
    const sender = getById('users', senderId);
    if (!sender) {
      return createApiResponse(null as any, false, 'Sender not found');
    }

    const receiver = getById('users', receiverId);
    if (!receiver) {
      return createApiResponse(null as any, false, 'Receiver not found');
    }

    // Check if booking exists if provided
    if (bookingId) {
      const booking = getById('bookings', bookingId);
      if (!booking) {
        return createApiResponse(null as any, false, 'Booking not found');
      }
    }

    // Create a new message
    const newMessage: Message = {
      id: `message_${Date.now()}`,
      senderId,
      receiverId,
      bookingId,
      content,
      imageUrl,
      createdAt: new Date(),
      sender, // Link back to sender
      receiver, // Link back to receiver
      booking: undefined, // Set if needed
    };

    create('messages', newMessage);
    return createApiResponse(newMessage);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get conversation messages between two users
 */
export const apiGetConversation = async (
  userId1: string,
  userId2: string
): Promise<ApiResponse<Message[]>> => {
  try {
    await delay();

    // Get messages between these users
    const messages = getMessagesForConversation(userId1, userId2);
    return createApiResponse(messages);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Mark messages as read
 */
export const apiMarkMessagesAsRead = async (
  userId: string,
  messageIds: string[]
): Promise<ApiResponse<{ success: boolean }>> => {
  try {
    await delay();

    let success = true;

    // Check each message and mark as read if receiver matches
    for (const messageId of messageIds) {
      const message = getById('messages', messageId);

      if (message && message.receiverId === userId && !message.readAt) {
        update('messages', messageId, { readAt: new Date() });
      } else {
        // Don't fail the operation, just note that not all messages were updated
        success = false;
      }
    }

    return createApiResponse({ success });
  } catch (error) {
    return handleApiError(error);
  }
};

// ------ Review API Endpoints ------

/**
 * Create a review
 */
export const apiCreateReview = async (
  bookingId: string,
  reviewerId: string,
  revieweeId: string,
  rating: number,
  comment?: string,
  photoUrl?: string
): Promise<ApiResponse<Review>> => {
  try {
    await delay();

    // Check if booking exists and is completed
    const booking = getById('bookings', bookingId);
    if (!booking) {
      return createApiResponse(null as any, false, 'Booking not found');
    }

    if (booking.status !== 'completed') {
      return createApiResponse(
        null as any,
        false,
        'Cannot review a booking that is not completed'
      );
    }

    // Check if users exist
    const reviewer = getById('users', reviewerId);
    if (!reviewer) {
      return createApiResponse(null as any, false, 'Reviewer not found');
    }

    const reviewee = getById('users', revieweeId);
    if (!reviewee) {
      return createApiResponse(null as any, false, 'Reviewee not found');
    }

    // Check if review already exists
    const existingReviews = filter(
      'reviews',
      (review) =>
        review.bookingId === bookingId && review.reviewerId === reviewerId
    );

    if (existingReviews.length > 0) {
      return createApiResponse(
        null as any,
        false,
        'You have already reviewed this booking'
      );
    }

    // Create a new review
    const newReview: Review = {
      id: `review_${Date.now()}`,
      bookingId,
      reviewerId,
      revieweeId,
      rating,
      comment,
      photoUrl,
      createdAt: new Date(),
      booking: booking,
      reviewer: reviewer,
      reviewee: reviewee,
    };

    create('reviews', newReview);
    return createApiResponse(newReview);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get reviews for a user
 */
export const apiGetUserReviews = async (
  userId: string
): Promise<ApiResponse<Review[]>> => {
  try {
    await delay();

    // Get reviews where user is the reviewee
    const reviews = filter('reviews', (review) => review.revieweeId === userId);

    // Enrich with reviewer data
    const enrichedReviews = reviews.map((review) => {
      const reviewer = getById('users', review.reviewerId) || ({} as User);
      return { ...review, reviewer };
    });

    return createApiResponse(enrichedReviews);
  } catch (error) {
    return handleApiError(error);
  }
};

// ------ Category API Endpoints ------

/**
 * Get all categories
 */
export const apiGetCategories = async (): Promise<ApiResponse<Category[]>> => {
  try {
    await delay();
    const categories = getAll('categories');
    return createApiResponse(categories);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get category by slug
 */
export const apiGetCategoryBySlug = async (
  slug: CategorySlug
): Promise<ApiResponse<Category>> => {
  try {
    await delay();
    const categories = filter(
      'categories',
      (category) => category.slug === slug
    );

    if (categories.length === 0) {
      return createApiResponse(null as any, false, 'Category not found');
    }

    return createApiResponse(categories[0]);
  } catch (error) {
    return handleApiError(error);
  }
};

// ------ Search API Endpoints ------

/**
 * Search across multiple entity types
 */
export interface SearchResults {
  listings: Listing[];
  users: User[];
  totalResults: number;
}

export const apiSearch = async (
  query: string,
  types: string[] = ['listings', 'users']
): Promise<ApiResponse<SearchResults>> => {
  try {
    await delay();

    let listings: Listing[] = [];
    let users: User[] = [];

    // Search listings
    if (types.includes('listings')) {
      listings = searchEntities('listings', query, [
        'title',
        'description',
        'houseRules',
      ]);

      // Enrich with host data
      listings = listings.map((listing) => {
        const host = getById('users', listing.hostId) || ({} as User);
        return { ...listing, host };
      });
    }

    // Search users
    if (types.includes('users')) {
      users = searchEntities('users', query, ['name', 'email']);
    }

    const totalResults = listings.length + users.length;

    return createApiResponse({
      listings,
      users,
      totalResults,
    });
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * API Method Map for easier access
 */
export const api = {
  // Auth
  register: apiRegister,
  login: apiLogin,
  getCurrentUser: apiGetCurrentUser,

  // Users
  getUser: apiGetUser,
  getUsers: apiGetUsers,
  createProfile: apiCreateProfile,
  updateProfile: apiUpdateProfile,

  // Listings
  createListing: apiCreateListing,
  getListings: apiGetListings,
  getListing: apiGetListing,
  updateListing: apiUpdateListing,
  deleteListing: apiDeleteListing,

  // Bookings
  createBooking: apiCreateBooking,
  getUserBookings: apiGetUserBookings,
  updateBookingStatus: apiUpdateBookingStatus,

  // Messages
  sendMessage: apiSendMessage,
  getConversation: apiGetConversation,
  markMessagesAsRead: apiMarkMessagesAsRead,

  // Reviews
  createReview: apiCreateReview,
  getUserReviews: apiGetUserReviews,

  // Categories
  getCategories: apiGetCategories,
  getCategoryBySlug: apiGetCategoryBySlug,

  // Search
  search: apiSearch,

  // New getProfile function
  getProfile: async (
    profileId: string
  ): Promise<ApiResponse<Profile> | ApiErrorResponse> => {
    try {
      await delay();

      // Use the utility function to get the profile with its associated user
      const profile = getProfileWithUser(profileId);

      if (!profile) {
        return createApiResponse(null as any, false, 'Profile not found');
      }

      return createApiResponse(profile);
    } catch (error) {
      return handleApiError(error);
    }
  },
};
