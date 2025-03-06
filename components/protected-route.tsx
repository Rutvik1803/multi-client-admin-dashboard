'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/authContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermissions = [],
}) => {
  const { user, isAuthenticated, hasPermission } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    // Check permissions
    if (!hasPermission(requiredPermissions)) {
      // Redirect to a default or unauthorized page
      router.replace('/dashboard/unauthorized');
    }
  }, [isAuthenticated, user, requiredPermissions, hasPermission, router]);

  // Render children if authenticated and has permissions
  if (!isAuthenticated || !hasPermission(requiredPermissions)) {
    return null;
  }

  return <>{children}</>;
};
