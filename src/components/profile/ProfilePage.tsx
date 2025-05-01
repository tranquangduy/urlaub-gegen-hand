'use client';

import { useProfile } from '@/contexts/ProfileContext';
import ProfileView from './ProfileView';
import ProfileForm from './ProfileForm';

interface ProfilePageProps {
  mode?: 'view' | 'edit';
}

export default function ProfilePage({ mode = 'view' }: ProfilePageProps) {
  const { isLoading } = useProfile();

  // Show loading state
  if (isLoading) {
    return (
      <div className="w-full flex justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {mode === 'edit' ? <ProfileForm /> : <ProfileView />}
    </div>
  );
}
