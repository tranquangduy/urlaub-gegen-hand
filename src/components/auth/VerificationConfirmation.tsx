'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function VerificationConfirmation() {
  const { verifyEmail } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get('token');

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setError('Invalid verification token. Please try again.');
        setIsVerifying(false);
        return;
      }

      try {
        const result = await verifyEmail(token);
        if (result) {
          setSuccess(true);
        } else {
          setError('Failed to verify your email. The token may have expired.');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setError('An unexpected error occurred during verification.');
      } finally {
        setIsVerifying(false);
      }
    };

    verify();
  }, [token, verifyEmail]);

  // Redirect to dashboard after successful verification
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        router.push('/dashboard');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [success, router]);

  if (isVerifying) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Verifying your email...
        </h2>
        <p className="text-gray-600">
          Please wait while we verify your email address.
        </p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 bg-green-100 text-green-500 flex items-center justify-center rounded-full mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-10 h-10"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Email verified successfully!
        </h2>
        <p className="text-gray-600 mb-4">
          Your email has been successfully verified. You now have full access to
          all features.
        </p>
        <p className="text-gray-500">
          Redirecting to dashboard in a few seconds...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
      <div className="w-16 h-16 bg-red-100 text-red-500 flex items-center justify-center rounded-full mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-10 h-10"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Verification failed
      </h2>
      <p className="text-gray-600 mb-6">{error}</p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/dashboard"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Go to Dashboard
        </Link>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
