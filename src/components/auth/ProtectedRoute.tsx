'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { UserRole } from '@/types';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: UserRole[];
  fallbackPath?: string;
}

export default function ProtectedRoute({
  children,
  requiredRoles = [],
  fallbackPath = '/login',
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Create a state flag to avoid redirecting during server-side rendering
  const wasRedirected =
    typeof window !== 'undefined'
      ? sessionStorage.getItem(`redirected_${pathname}`) === 'true'
      : false;

  // If still loading auth state, show loading UI
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated and not already redirected, redirect to login
  if (!isAuthenticated && !wasRedirected) {
    // Mark as redirected to avoid infinite loops
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(`redirected_${pathname}`, 'true');

      // Store the current path for redirect back after login
      sessionStorage.setItem('auth_redirect_path', pathname);

      // Navigate to login
      router.push(fallbackPath);
    }

    // Return null while redirecting
    return null;
  }

  // Clear the redirected flag once authenticated
  if (isAuthenticated && wasRedirected && typeof window !== 'undefined') {
    sessionStorage.removeItem(`redirected_${pathname}`);
  }

  // Check roles if required and user is authenticated
  if (isAuthenticated && requiredRoles.length > 0 && user) {
    // Check if the user has at least one of the required roles
    const hasRequiredRole = requiredRoles.some(
      (role) => user.roles.includes(role) || user.roles.includes('both')
    );

    // If no required role, redirect to unauthorized page
    if (!hasRequiredRole && !wasRedirected) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(`redirected_${pathname}`, 'true');
        router.push('/unauthorized');
      }

      // Return null while redirecting
      return null;
    }
  }

  // If all checks pass, render the children
  return <>{children}</>;
}
