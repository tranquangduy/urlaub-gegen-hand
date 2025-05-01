'use client';

import { ProfileProvider } from '@/contexts/ProfileContext';
import ProfilePage from '@/components/profile/ProfilePage';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function Profile() {
  return (
    <ProtectedRoute>
      <ProfileProvider>
        <div className="min-h-screen bg-gray-50">
          <ProfilePage />
        </div>
      </ProfileProvider>
    </ProtectedRoute>
  );
}
