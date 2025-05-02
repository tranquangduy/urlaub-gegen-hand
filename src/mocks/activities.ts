export interface MockActivity {
  id: string;
  title: string;
  timestamp: Date;
  description?: string;
}

export const mockActivities: MockActivity[] = [
  {
    id: 'a1',
    title: 'New listing created: Cozy Mountain Retreat',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    description: 'Your new listing "Cozy Mountain Retreat" is now live.',
  },
  {
    id: 'a2',
    title: 'Booking request received',
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    description: 'A guest has requested a stay from 2025-06-05 to 2025-06-10.',
  },
  {
    id: 'a3',
    title: 'Listing deactivated: City Apartment',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    description: 'You have deactivated your "City Apartment" listing.',
  },
];
