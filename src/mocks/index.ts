// Re-export everything from the modules
export * from './generators';
export * from './services';
export * from './seed';

// Add a default export for direct importing
import { initializeStorage, seedDatabase } from './services';

/**
 * Initialize the mock database
 * This should be called early in your app, like in _app.tsx
 * @param seed Whether to also seed the database with mock data
 */
export default function initializeMockDatabase(seed = false): void {
  // Only run in browser, not during SSR
  if (typeof window !== 'undefined') {
    // Initialize the storage
    initializeStorage();

    // Optionally seed with mock data
    if (seed) {
      const counts = seedDatabase();
      console.log('Database seeded with:', counts);
    }
  }
}
