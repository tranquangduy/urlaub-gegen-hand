import { faker } from '@faker-js/faker';
import {
  User,
  UserRole,
  Profile,
  Listing,
  AccommodationType,
  CategorySlug,
  Category,
  Booking,
  BookingStatus,
  Message,
  Review,
  Verification,
} from '@/types';

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

const ALL_ACCOMMODATION_TYPES: AccommodationType[] = [
  'private_room',
  'shared_room',
  'entire_place',
  'tent_space',
  'camper_van',
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
const ALL_SKILLS = [
  'Gardening',
  'Childcare',
  'Web Development',
  'Cooking',
  'Teaching',
  'Construction',
  'Animal Care',
  'Hospitality',
];

let userIdCounter = 1;
let profileIdCounter = 1;
let listingIdCounter = 1;
let bookingIdCounter = 1;
let messageIdCounter = 1;
let reviewIdCounter = 1;
let verificationIdCounter = 1;

export function generateMockUser(overrides: Partial<User> = {}): User {
  const id = `user_${userIdCounter++}`;
  const roles = overrides.roles || [
    faker.helpers.arrayElement<UserRole>(['host', 'helper', 'both']),
  ];
  const createdAt = faker.date.past();
  return {
    id,
    email: faker.internet.email(),
    passwordHash: faker.internet.password(), // Placeholder
    roles,
    name: faker.person.fullName(),
    createdAt,
    updatedAt: faker.date.between({ from: createdAt, to: new Date() }),
    emailVerified: faker.datatype.boolean(0.8)
      ? faker.date.recent()
      : undefined,
    profileId: `profile_${id.split('_')[1]}`, // Assume profile is created alongside user
    ...overrides,
  };
}

export function generateMockProfile(
  userId: string,
  roles: UserRole[],
  overrides: Partial<Profile> = {}
): Profile {
  const id = `profile_${profileIdCounter++}`;
  const createdAt = faker.date.past();
  const profile: Profile = {
    id,
    userId,
    bio: faker.lorem.paragraph(),
    profilePictureUrl: faker.image.avatar(),
    languages: faker.helpers.arrayElements(
      ALL_LANGUAGES,
      faker.number.int({ min: 1, max: 3 })
    ),
    createdAt,
    updatedAt: faker.date.between({ from: createdAt, to: new Date() }),
    user: {} as User, // Placeholder, link later
    ...overrides,
  };

  if (roles.includes('host')) {
    profile.hostRating = faker.number.float({
      min: 3,
      max: 5,
      fractionDigits: 1,
    });
  }
  if (roles.includes('helper')) {
    profile.helperRating = faker.number.float({
      min: 3,
      max: 5,
      fractionDigits: 1,
    });
    profile.skills = faker.helpers.arrayElements(
      ALL_SKILLS,
      faker.number.int({ min: 1, max: 4 })
    );
    profile.preferredCategories = faker.helpers.arrayElements(
      ALL_CATEGORY_SLUGS,
      faker.number.int({ min: 1, max: 3 })
    );
    profile.availabilityStartDate = faker.date.future({ years: 0.5 });
    profile.availabilityEndDate = faker.date.future({
      years: 1,
      refDate: profile.availabilityStartDate,
    });
    profile.hoursPerWeek = faker.helpers.arrayElement([10, 15, 20, 25, 30]);
    profile.travelPreferences = faker.location.country();
  }

  return profile;
}

export function generateMockCategory(slug: CategorySlug): Category {
  // Simple mapping for names based on slugs
  const name = slug
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  return {
    slug,
    name,
    description: faker.lorem.sentence(),
  };
}

export function generateMockListing(
  hostId: string,
  overrides: Partial<Listing> = {}
): Listing {
  const id = `listing_${listingIdCounter++}`;
  const createdAt = faker.date.past();
  const availabilityStartDate = faker.date.future({ years: 0.5 });

  return {
    id,
    hostId,
    title: faker.lorem.sentence(5),
    description: faker.lorem.paragraphs(3),
    location: {
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      country: faker.location.country(),
      latitude: parseFloat(faker.location.latitude().toFixed(6)),
      longitude: parseFloat(faker.location.longitude().toFixed(6)),
    },
    accommodationType: faker.helpers.arrayElement(ALL_ACCOMMODATION_TYPES),
    amenities: faker.helpers.arrayElements(
      ['WiFi', 'Kitchen', 'Washer', 'Free Parking', 'Private Bathroom'],
      faker.number.int({ min: 1, max: 4 })
    ),
    requiredHelpCategories: faker.helpers.arrayElements(
      ALL_CATEGORY_SLUGS,
      faker.number.int({ min: 1, max: 3 })
    ),
    workHoursPerWeek: faker.helpers.arrayElement([15, 20, 25, 30, 35]),
    benefitsOffered: faker.helpers.arrayElements(
      ['Meals', 'Language Practice', 'Local Tours', 'Skill Exchange'],
      faker.number.int({ min: 0, max: 3 })
    ),
    availabilityStartDate,
    availabilityEndDate: faker.date.future({
      years: 1,
      refDate: availabilityStartDate,
    }),
    photos: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () =>
      faker.image.urlLoremFlickr({ category: 'house' })
    ),
    houseRules: faker.lorem.paragraph(),
    requiredLanguages: faker.helpers.arrayElements(
      ALL_LANGUAGES,
      faker.number.int({ min: 1, max: 2 })
    ),
    createdAt,
    updatedAt: faker.date.between({ from: createdAt, to: new Date() }),
    host: {} as User, // Placeholder
    ...overrides,
  };
}

export function generateMockBooking(
  listingId: string,
  helperId: string,
  startDate: Date,
  endDate: Date,
  overrides: Partial<Booking> = {}
): Booking {
  const id = `booking_${bookingIdCounter++}`;
  const createdAt = faker.date.past();
  return {
    id,
    listingId,
    helperId,
    startDate,
    endDate,
    status: faker.helpers.arrayElement<BookingStatus>([
      'pending',
      'confirmed',
      'cancelled',
      'completed',
    ]),
    notes: faker.datatype.boolean(0.3) ? faker.lorem.sentence() : undefined,
    createdAt,
    updatedAt: faker.date.between({ from: createdAt, to: new Date() }),
    listing: {} as Listing, // Placeholder
    helper: {} as User, // Placeholder
    ...overrides,
  };
}

export function generateMockMessage(
  senderId: string,
  receiverId: string,
  bookingId?: string,
  overrides: Partial<Message> = {}
): Message {
  const id = `message_${messageIdCounter++}`;
  const createdAt = faker.date.past();
  return {
    id,
    bookingId,
    senderId,
    receiverId,
    content: faker.lorem.sentence(),
    imageUrl: faker.datatype.boolean(0.1) ? faker.image.url() : undefined,
    readAt: faker.datatype.boolean(0.6) ? faker.date.recent() : undefined,
    createdAt,
    sender: {} as User, // Placeholder
    receiver: {} as User, // Placeholder
    booking: {} as Booking | undefined, // Placeholder
    ...overrides,
  };
}

export function generateMockReview(
  bookingId: string,
  reviewerId: string,
  revieweeId: string,
  overrides: Partial<Review> = {}
): Review {
  const id = `review_${reviewIdCounter++}`;
  const createdAt = faker.date.past();
  return {
    id,
    bookingId,
    reviewerId,
    revieweeId,
    rating: faker.number.int({ min: 1, max: 5 }),
    comment: faker.lorem.paragraph(),
    photoUrl: faker.datatype.boolean(0.05) ? faker.image.url() : undefined,
    createdAt,
    booking: {} as Booking, // Placeholder
    reviewer: {} as User, // Placeholder
    reviewee: {} as User, // Placeholder
    ...overrides,
  };
}

export function generateMockVerification(
  userId: string,
  overrides: Partial<Verification> = {}
): Verification {
  const id = `verification_${verificationIdCounter++}`;
  return {
    id,
    userId,
    type: 'email', // Default to email for MVP
    verifiedAt: faker.date.past(),
    user: {} as User, // Placeholder
    ...overrides,
  };
}

// --- Example Usage (can be moved to a service file later) ---

// Generate a set of users and their profiles
// const mockUsers: User[] = [];
// const mockProfiles: Profile[] = [];
// for (let i = 0; i < 10; i++) {
//     const user = generateMockUser();
//     mockUsers.push(user);
//     const profile = generateMockProfile(user.id, user.roles);
//     mockProfiles.push(profile);
//     // Link them (in a real service, this linking would be more robust)
//     profile.user = user;
//     // user.profile = profile; // Add profile relation to User if needed
// }

// console.log("Generated Users:", mockUsers);
// console.log("Generated Profiles:", mockProfiles);
