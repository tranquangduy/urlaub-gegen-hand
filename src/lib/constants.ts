import { Category, CategorySlug } from '@/types';

// Define categories matching the slugs
export const CATEGORIES: Record<CategorySlug, Category> = {
  housesitting: {
    id: 'cat-1',
    slug: 'housesitting',
    name: 'Housesitting',
    description: 'Looking after a property while the owner is away.',
  },
  agriculture_gardening: {
    id: 'cat-2',
    slug: 'agriculture_gardening',
    name: 'Agriculture & Gardening',
    description: 'Working on farms, gardens, or related projects.',
  },
  petsitting_petcare: {
    id: 'cat-3',
    slug: 'petsitting_petcare',
    name: 'Pet Sitting & Pet Care',
    description:
      'Caring for animals, including feeding, walking, and grooming.',
  },
  sustainability_eco_projects: {
    id: 'cat-4',
    slug: 'sustainability_eco_projects',
    name: 'Sustainability & Eco Projects',
    description:
      'Projects focused on environmental conservation and sustainable living.',
  },
  ngos_childcare_nature_conservation: {
    id: 'cat-5',
    slug: 'ngos_childcare_nature_conservation',
    name: 'NGOs, Childcare & Nature Conservation',
    description:
      'Work with non-profits, children, or in nature conservation efforts.',
  },
  construction_renovation: {
    id: 'cat-6',
    slug: 'construction_renovation',
    name: 'Construction & Renovation',
    description: 'Helping with building, repairing, or renovating structures.',
  },
  household_help: {
    id: 'cat-7',
    slug: 'household_help',
    name: 'Household Help',
    description:
      'Assisting with daily chores like cleaning, cooking, and organizing.',
  },
  teaching_knowledge_sharing: {
    id: 'cat-8',
    slug: 'teaching_knowledge_sharing',
    name: 'Teaching & Knowledge Sharing',
    description: 'Sharing skills or knowledge, tutoring, or leading workshops.',
  },
  creative_activities: {
    id: 'cat-9',
    slug: 'creative_activities',
    name: 'Creative Activities',
    description:
      'Engaging in artistic or creative projects like painting, music, or writing.',
  },
  tourism: {
    id: 'cat-10',
    slug: 'tourism',
    name: 'Tourism',
    description:
      'Assisting in hospitality, tour guiding, or related tourism activities.',
  },
  volunteer_work: {
    id: 'cat-11',
    slug: 'volunteer_work',
    name: 'Volunteer Work',
    description:
      'General volunteering opportunities not covered by other categories.',
  },
  other: {
    id: 'cat-12',
    slug: 'other',
    name: 'Other',
    description: 'Various other types of help or projects.',
  },
};

// Define predefined skills associated with categories
export const SKILLS_BY_CATEGORY: Record<CategorySlug, string[]> = {
  housesitting: [
    'Property Maintenance',
    'Security Checks',
    'Mail Collection',
    'Plant Care',
    'Basic Repairs',
  ],
  agriculture_gardening: [
    'Planting & Seeding',
    'Harvesting',
    'Weeding',
    'Composting',
    'Irrigation',
    'Pruning',
    'Soil Management',
    'Operating Machinery',
    'Greenhouse Management',
    'Permaculture Design',
  ],
  petsitting_petcare: [
    'Dog Walking',
    'Cat Care',
    'Feeding Animals',
    'Grooming',
    'Administering Medication',
    'Bird Care',
    'Reptile Care',
    'Small Mammal Care',
    'Farm Animal Care',
  ],
  sustainability_eco_projects: [
    'Recycling Programs',
    'Waste Reduction',
    'Renewable Energy Projects',
    'Water Conservation',
    'Organic Farming',
    'Environmental Education',
    'Trail Building/Maintenance',
  ],
  ngos_childcare_nature_conservation: [
    'Childcare & Babysitting',
    'Tutoring & Mentoring',
    'Community Outreach',
    'Fundraising',
    'Wildlife Monitoring',
    'Habitat Restoration',
    'Administrative Support',
  ],
  construction_renovation: [
    'Carpentry',
    'Painting',
    'Plumbing Basics',
    'Electrical Basics',
    'Masonry',
    'Drywall Installation',
    'Tiling',
    'Roofing Basics',
    'Demolition',
  ],
  household_help: [
    'Cleaning',
    'Cooking & Meal Prep',
    'Laundry',
    'Ironing',
    'Organizing',
    'Shopping',
    'Deep Cleaning',
    'Window Washing',
  ],
  teaching_knowledge_sharing: [
    'Language Teaching',
    'Subject Tutoring',
    'Workshop Facilitation',
    'Curriculum Development',
    'Computer Skills Teaching',
    'Yoga/Fitness Instruction',
    'Music Instruction',
  ],
  creative_activities: [
    'Painting & Drawing',
    'Photography & Videography',
    'Graphic Design',
    'Web Design',
    'Writing & Editing',
    'Music Performance/Composition',
    'Crafting (Sewing, Knitting, etc.)',
    'Sculpting',
    'Acting/Performance',
  ],
  tourism: [
    'Reception & Customer Service',
    'Tour Guiding',
    'Event Planning & Assistance',
    'Bartending/Waiting Tables',
    'Reservation Management',
    'Activity Coordination',
  ],
  volunteer_work: [
    'General Assistance',
    'Community Service',
    'Event Support',
    'Elderly Care Assistance',
    'Disaster Relief Support',
  ],
  other: ['Driving', 'IT Support', 'Research', 'Translation'],
};

// Flattened list of all predefined skills for easier searching/selection
export const ALL_PREDEFINED_SKILLS = Object.values(SKILLS_BY_CATEGORY).flat();
