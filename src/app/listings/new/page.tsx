import { Metadata } from 'next';
import ListingForm from '@/components/listings/ListingForm';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export const metadata: Metadata = {
  title: 'Create New Listing | Urlaub gegen Hand',
  description: 'Create a new listing for your property and help requirements.',
};

export default function NewListingPage() {
  return (
    <ProtectedRoute requiredRoles={['host']}>
      {' '}
      {/* Ensure only hosts can access */}
      <ListingForm />
    </ProtectedRoute>
  );
}
