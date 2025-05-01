'use client';

import { useState, FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserRole } from '@/types';

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [roles, setRoles] = useState<UserRole[]>(['helper']);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, error, clearError } = useAuth();
  const router = useRouter();

  // Clear any auth context errors when the component mounts
  useState(() => {
    clearError();
  });

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (!email || !password || !confirmPassword || !name) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage('');

      // Call the register function from auth context
      const success = await register(email, password, name, roles);

      if (success) {
        // Redirect to the dashboard or profile setup page
        router.push('/dashboard');
      } else {
        // Set error message from auth context or a default message
        setErrorMessage(error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle role selection
  const handleRoleChange = (role: UserRole) => {
    if (role === 'both') {
      setRoles(['both']);
    } else if (roles.includes('both')) {
      setRoles([role]);
    } else if (roles.includes(role)) {
      const otherRole = role === 'host' ? 'helper' : 'host';
      if (roles.includes(otherRole)) {
        setRoles(['both']);
      } else {
        // Don't allow deselecting the last role
        return;
      }
    } else {
      setRoles([...roles, role]);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="p-4 sm:p-7">
          <div className="text-center">
            <h1 className="block text-2xl font-bold text-gray-800">Sign up</h1>
            <p className="mt-2 text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                href="/login"
                className="text-blue-600 decoration-2 hover:underline font-medium"
              >
                Sign in here
              </Link>
            </p>
          </div>

          <div className="mt-5">
            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="grid gap-y-4">
                {/* Name input */}
                <div>
                  <label htmlFor="name" className="block text-sm mb-2">
                    Full name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="py-3 px-4 block w-full border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Email input */}
                <div>
                  <label htmlFor="email" className="block text-sm mb-2">
                    Email address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="py-3 px-4 block w-full border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Password input */}
                <div>
                  <label htmlFor="password" className="block text-sm mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      id="password"
                      name="password"
                      className="py-3 px-4 block w-full border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                      placeholder="Password (min. 8 characters)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isSubmitting}
                      minLength={8}
                    />
                  </div>
                </div>

                {/* Confirm password input */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm mb-2"
                  >
                    Confirm password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      className="py-3 px-4 block w-full border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Role selection */}
                <div>
                  <label className="block text-sm mb-2">
                    I want to join as:
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div
                      className={`
                        border rounded-md p-3 text-center cursor-pointer transition
                        ${
                          roles.includes('host') || roles.includes('both')
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }
                      `}
                      onClick={() => handleRoleChange('host')}
                    >
                      <div className="font-medium">Host</div>
                      <div className="text-xs mt-1">
                        I want to offer accommodation
                      </div>
                    </div>

                    <div
                      className={`
                        border rounded-md p-3 text-center cursor-pointer transition
                        ${
                          roles.includes('helper') || roles.includes('both')
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }
                      `}
                      onClick={() => handleRoleChange('helper')}
                    >
                      <div className="font-medium">Helper</div>
                      <div className="text-xs mt-1">
                        I want to find a place to stay
                      </div>
                    </div>
                  </div>
                </div>

                {/* Error message */}
                {(errorMessage || error) && (
                  <div className="text-red-500 text-sm mt-1">
                    {errorMessage || error}
                  </div>
                )}

                {/* Terms and conditions */}
                <div className="text-xs text-gray-500">
                  By signing up, you agree to our{' '}
                  <Link href="/terms" className="text-blue-600 hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link
                    href="/privacy"
                    className="text-blue-600 hover:underline"
                  >
                    Privacy Policy
                  </Link>
                  .
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Please wait
                    </>
                  ) : (
                    'Create account'
                  )}
                </button>
              </div>
            </form>
            {/* End Form */}
          </div>
        </div>
      </div>
    </div>
  );
}
