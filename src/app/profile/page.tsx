import { Metadata } from 'next';
import ProfilePage from '@/components/profile/ProfilePage';

export const metadata: Metadata = {
  title: 'My Profile | Urlaub gegen Hand',
  description:
    'View and manage your user profile including personal information, skills, and preferences.',
};

export default function ProfileRoute() {
  return <ProfilePage mode="view" />;
}
