'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface VerificationReminderProps {
  className?: string;
}

export default function VerificationReminder({
  className = '',
}: VerificationReminderProps) {
  const { user, verifyEmail } = useAuth();
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [error, setError] = useState('');

  // If user is not logged in, or email is already verified, don't show anything
  if (!user || user.emailVerified) {
    return null;
  }

  const handleResendVerification = async () => {
    try {
      setIsResending(true);
      setError('');
      setResendSuccess(false);

      // In a real app, this would send a new verification email
      // For our mock, we'll just call the verifyEmail function with a mock token
      const success = await verifyEmail('mock-verification-token');

      if (success) {
        setResendSuccess(true);
      } else {
        setError(
          'Failed to resend verification email. Please try again later.'
        );
      }
    } catch (err) {
      setError('An unexpected error occurred.');
      console.error('Error resending verification:', err);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div
      className={`bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4 ${className}`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-yellow-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-yellow-700">
            Your email address has not been verified. Please verify your email
            to access all features.
          </p>
          {!resendSuccess ? (
            <div className="mt-2">
              <button
                onClick={handleResendVerification}
                disabled={isResending}
                className="text-sm font-medium text-yellow-700 hover:text-yellow-600 underline"
              >
                {isResending ? 'Sending...' : 'Resend verification email'}
              </button>
            </div>
          ) : (
            <p className="mt-2 text-sm text-green-600">
              Verification email sent! Please check your inbox.
            </p>
          )}
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
