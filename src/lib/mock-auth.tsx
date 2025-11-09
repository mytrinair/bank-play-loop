/**
 * Mock Authentication for Development
 * Use this when Auth0 is not configured or for testing
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

interface MockUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'student' | 'teacher';
}

interface MockAuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: MockUser | null;
  loginAsStudent: () => void;
  loginAsTeacher: () => void;
  logout: () => void;
  error: Error | null;
}

const MockAuthContext = createContext<MockAuthContextType | null>(null);

export const MockAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<MockUser | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const loginAsStudent = () => {
    setIsLoading(true);
    setTimeout(() => {
      setUser({
        id: 'mock-student-1',
        name: 'Alex Student',
        email: 'alex@example.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
        role: 'student'
      });
      setIsAuthenticated(true);
      setIsLoading(false);
    }, 1000);
  };

  const loginAsTeacher = () => {
    setIsLoading(true);
    setTimeout(() => {
      setUser({
        id: 'mock-teacher-1',
        name: 'Mrs. Johnson',
        email: 'johnson@school.edu',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Johnson',
        role: 'teacher'
      });
      setIsAuthenticated(true);
      setIsLoading(false);
    }, 1000);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <MockAuthContext.Provider value={{
      isAuthenticated,
      isLoading,
      user,
      loginAsStudent,
      loginAsTeacher,
      logout,
      error
    }}>
      {children}
    </MockAuthContext.Provider>
  );
};

export const useMockAuth = () => {
  const context = useContext(MockAuthContext);
  if (!context) {
    throw new Error('useMockAuth must be used within MockAuthProvider');
  }
  return context;
};

// Environment flag to switch between real Auth0 and mock
export const USE_MOCK_AUTH = import.meta.env.VITE_USE_MOCK_AUTH === 'true';