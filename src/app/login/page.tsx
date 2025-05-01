import { Metadata } from 'next';
import LoginForm from '@/components/auth/LoginForm';
import AuthLayout from '@/components/auth/AuthLayout';

export const metadata: Metadata = {
  title: 'Login | Urlaub gegen Hand',
  description: 'Login to your Urlaub gegen Hand account.',
};

export default function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
