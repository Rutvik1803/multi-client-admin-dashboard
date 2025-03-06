'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Define the user type
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'client';
  permissions: string[];
  token: string;
}

// Context type
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User | void>;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (requiredPermissions: string[]) => boolean;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Load user from local storage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${backendUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid email or password');
      }

      const userData = await response.json();

      // Store user in local storage
      localStorage.setItem('user', JSON.stringify(userData));

      // Set user in state
      setUser(userData);

      // ✅ Corrected Redirect Logic
      if (userData.role === 'admin') {
        router.replace('/dashboard'); // Admins go to Dashboard
      } else {
        const firstPage =
          userData.permissions.length > 0
            ? `/dashboard/${userData.permissions[0]}`
            : '/dashboard';
        router.replace(firstPage); // Clients go to their first permitted page
      }

      return userData; // ✅ Ensure login function returns user data
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    // ✅ Clear all stored user data
    localStorage.removeItem('user');
    setUser(null);

    // Redirect to login
    router.replace('/login');
  };

  // Permission check function
  const hasPermission = (requiredPermissions: string[]): boolean => {
    if (!user) return false; // No user, no access
    if (user.role === 'admin') return true; // Admins have full access

    // Check if user has any of the required permissions
    return requiredPermissions.some((permission) =>
      user.permissions.includes(permission)
    );
  };

  // Context value
  const contextValue = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    hasPermission,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
