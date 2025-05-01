'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/types';
import ProtectedRoute from './ProtectedRoute';

interface RoleBasedRouteProps {
  children: ReactNode;
  requiredRoles: UserRole[];
  mustHaveAllRoles?: boolean; // If true, user must have ALL required roles, not just one
  redirectPath?: string;
}

export default function RoleBasedRoute({
  children,
  requiredRoles,
  mustHaveAllRoles = false,
  redirectPath = '/unauthorized',
}: RoleBasedRouteProps) {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  // First use ProtectedRoute to ensure the user is authenticated
  return (
    <ProtectedRoute>
      {isAuthenticated && user
        ? (() => {
            // If no roles required, just render children
            if (requiredRoles.length === 0) {
              return children;
            }

            // For 'both' role, allow access to anything
            if (user.roles.includes('both')) {
              return children;
            }

            // Check if user has the required roles
            const hasAccess = mustHaveAllRoles
              ? requiredRoles.every((role) => user.roles.includes(role))
              : requiredRoles.some((role) => user.roles.includes(role));

            if (hasAccess) {
              return children;
            } else {
              // Redirect if the user doesn't have the required roles
              router.push(redirectPath);
              return null;
            }
          })()
        : children}
    </ProtectedRoute>
  );
}
