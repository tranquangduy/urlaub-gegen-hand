'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProfileView from './ProfileView';
import ProfileForm from './ProfileForm';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export interface ProfilePageProps {
  userId?: string; // If provided, shows another user's profile
}

export default function ProfilePage({ userId }: ProfilePageProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'view' | 'edit'>('view');

  // Is this the current user's profile?
  const isOwnProfile = !userId || (user && user.id === userId);

  // Handle switching to edit mode
  const handleEditClick = () => {
    setActiveTab('edit');
  };

  // Handle returning to view mode
  const handleViewClick = () => {
    setActiveTab('view');
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">
          {isOwnProfile ? 'Your Profile' : 'User Profile'}
        </h1>

        {isOwnProfile && (
          <div className="flex space-x-4">
            <Tabs
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as 'view' | 'edit')}
            >
              <TabsList>
                <TabsTrigger value="view">View</TabsTrigger>
                <TabsTrigger value="edit">Edit</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        )}
      </div>

      {activeTab === 'view' ? (
        <ProfileView userId={userId} onEdit={handleEditClick} />
      ) : (
        <div className="space-y-6">
          <div className="flex justify-end">
            <Button onClick={handleViewClick} variant="outline">
              Cancel
            </Button>
          </div>
          <ProfileForm />
        </div>
      )}
    </div>
  );
}
