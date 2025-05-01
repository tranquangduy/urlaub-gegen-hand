import {
  generateMockUser,
  generateMockProfile,
  generateMockListing,
  generateMockBooking,
  generateMockMessage,
  generateMockReview,
  generateMockVerification,
  generateMockCategory,
} from './generators';
import { resetStorage, createMany } from './services';
import {
  Category,
  CategorySlug,
  User,
  Profile,
  Listing,
  Booking,
  Message,
  Review,
  Verification,
} from '@/types';

// All category slugs for our app
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

/**
 * Generate categories for all our predefined slugs
 */
const generateCategories = (): Category[] => {
  return ALL_CATEGORY_SLUGS.map((slug, index) => ({
    ...generateMockCategory(slug),
    id: `category_${index + 1}`,
  }));
};

/**
 * Generate a set of connected users and profiles
 * @param count Number of users to generate
 * @returns Object containing arrays of users and profiles
 */
const generateUsersAndProfiles = (
  count: number
): { users: User[]; profiles: Profile[] } => {
  const users: User[] = [];
  const profiles: Profile[] = [];

  for (let i = 1; i <= count; i++) {
    // Generate a user
    const user = generateMockUser({ id: `user_${i}` });
    users.push(user);

    // Generate a matching profile
    const profile = generateMockProfile(user.id, user.roles, {
      id: `profile_${i}`,
    });
    profiles.push(profile);
  }

  return { users, profiles };
};

/**
 * Generate listings for host users
 * @param hostUsers Users who are hosts
 * @param count Number of listings to generate
 * @returns Array of listings
 */
const generateListings = (hostUsers: User[], count: number): Listing[] => {
  const listings: Listing[] = [];

  for (let i = 1; i <= count; i++) {
    // Choose a random host user
    const randomHostIndex = Math.floor(Math.random() * hostUsers.length);
    const hostUser = hostUsers[randomHostIndex];

    // Generate a listing for this host
    const listing = generateMockListing(hostUser.id, { id: `listing_${i}` });
    listings.push(listing);
  }

  return listings;
};

/**
 * Generate bookings between listings and helper users
 * @param listings Available listings
 * @param helperUsers Users who are helpers
 * @param count Number of bookings to generate
 * @returns Array of bookings
 */
const generateBookings = (
  listings: Listing[],
  helperUsers: User[],
  count: number
): Booking[] => {
  const bookings: Booking[] = [];

  for (let i = 1; i <= count; i++) {
    // Choose a random listing and helper
    const randomListingIndex = Math.floor(Math.random() * listings.length);
    const randomHelperIndex = Math.floor(Math.random() * helperUsers.length);

    const listing = listings[randomListingIndex];
    const helper = helperUsers[randomHelperIndex];

    // Generate a booking between this listing and helper
    const booking = generateMockBooking(
      listing.id,
      helper.id,
      listing.availabilityStartDate,
      listing.availabilityEndDate,
      { id: `booking_${i}` }
    );

    bookings.push(booking);
  }

  return bookings;
};

/**
 * Generate messages between users
 * @param users All users
 * @param bookings Optional bookings to associate with messages
 * @param count Number of messages to generate
 * @returns Array of messages
 */
const generateMessages = (
  users: User[],
  bookings: Booking[] = [],
  count: number
): Message[] => {
  const messages: Message[] = [];

  for (let i = 1; i <= count; i++) {
    // Choose two different random users
    let sender, receiver;
    do {
      const randomIndex1 = Math.floor(Math.random() * users.length);
      const randomIndex2 = Math.floor(Math.random() * users.length);
      sender = users[randomIndex1];
      receiver = users[randomIndex2];
    } while (sender.id === receiver.id);

    // Optionally associate with a booking (for 50% of messages)
    let bookingId: string | undefined;
    if (bookings.length > 0 && Math.random() > 0.5) {
      const randomBookingIndex = Math.floor(Math.random() * bookings.length);
      bookingId = bookings[randomBookingIndex].id;
    }

    // Generate a message
    const message = generateMockMessage(sender.id, receiver.id, bookingId, {
      id: `message_${i}`,
    });
    messages.push(message);
  }

  return messages;
};

/**
 * Generate reviews for completed bookings
 * @param bookings Bookings to review
 * @param count Number of reviews to generate (up to bookings.length)
 * @returns Array of reviews
 */
const generateReviews = (bookings: Booking[], count: number): Review[] => {
  const reviews: Review[] = [];
  const reviewableBookings = bookings.filter((b) => b.status === 'completed');
  const actualCount = Math.min(count, reviewableBookings.length);

  for (let i = 1; i <= actualCount; i++) {
    const booking = reviewableBookings[i - 1];

    // Generate a review from helper to host
    const helperToHostReview = generateMockReview(
      booking.id,
      booking.helperId,
      booking.listing.hostId,
      { id: `review_${i * 2 - 1}` }
    );
    reviews.push(helperToHostReview);

    // Generate a review from host to helper
    const hostToHelperReview = generateMockReview(
      booking.id,
      booking.listing.hostId,
      booking.helperId,
      { id: `review_${i * 2}` }
    );
    reviews.push(hostToHelperReview);
  }

  return reviews;
};

/**
 * Generate email verifications for users
 * @param users Users to verify
 * @returns Array of verifications
 */
const generateVerifications = (users: User[]): Verification[] => {
  const verifications: Verification[] = [];

  users.forEach((user, index) => {
    if (user.emailVerified) {
      const verification = generateMockVerification(user.id, {
        id: `verification_${index + 1}`,
      });
      verifications.push(verification);
    }
  });

  return verifications;
};

/**
 * Seed the database with a complete set of mock data
 * @returns Object with counts of seeded data
 */
export const seedDatabase = (): {
  categories: number;
  users: number;
  profiles: number;
  listings: number;
  bookings: number;
  messages: number;
  reviews: number;
  verifications: number;
} => {
  console.log('Seeding database with mock data...');

  // Reset the database first
  resetStorage();

  // Generate categories
  const categories = generateCategories();
  createMany('categories', categories);

  // Generate users and profiles
  const { users, profiles } = generateUsersAndProfiles(20);
  createMany('users', users);
  createMany('profiles', profiles);

  // Filter users by role for later use
  const hostUsers = users.filter(
    (user) => user.roles.includes('host') || user.roles.includes('both')
  );
  const helperUsers = users.filter(
    (user) => user.roles.includes('helper') || user.roles.includes('both')
  );

  // Generate listings for hosts
  const listings = generateListings(hostUsers, 15);
  createMany('listings', listings);

  // Generate bookings between listings and helpers
  const bookings = generateBookings(listings, helperUsers, 10);
  createMany('bookings', bookings);

  // Generate messages between users
  const messages = generateMessages(users, bookings, 30);
  createMany('messages', messages);

  // Generate reviews for completed bookings
  const reviews = generateReviews(bookings, 5);
  createMany('reviews', reviews);

  // Generate verifications for users
  const verifications = generateVerifications(users);
  createMany('verifications', verifications);

  console.log('Database seeded successfully!');

  // Return counts of seeded data (useful for debugging)
  return {
    categories: categories.length,
    users: users.length,
    profiles: profiles.length,
    listings: listings.length,
    bookings: bookings.length,
    messages: messages.length,
    reviews: reviews.length,
    verifications: verifications.length,
  };
};
