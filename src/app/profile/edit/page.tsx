import { Metadata } from 'next';
import ProfilePage from '@/components/profile/ProfilePage';

export const metadata: Metadata = {
  title: 'Edit Profile | Urlaub gegen Hand',
  description:
    'Edit your user profile details including personal information, skills, and preferences.',
};

export default function EditProfileRoute() {
  return <ProfilePage mode="edit" />;
}
