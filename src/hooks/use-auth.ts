import { useAuth0 } from "@auth0/auth0-react";
import { useCallback, useMemo, useState, useEffect } from "react";

/**
 * Custom hook that extends Auth0's useAuth0 hook with BankDojo Jr. specific functionality
 * Provides easy access to authentication state and user role management
 */
export const useAuth = () => {
  const auth0 = useAuth0();
  const [roleRefresh, setRoleRefresh] = useState(0);
  
  // Listen for storage changes and custom role update events
  useEffect(() => {
    const handleRoleUpdate = () => {
      setRoleRefresh(prev => prev + 1);
    };
    
    // Listen for localStorage changes (from other tabs/windows)
    window.addEventListener('storage', handleRoleUpdate);
    
    // Listen for custom role update events
    window.addEventListener('roleUpdated', handleRoleUpdate);
    
    return () => {
      window.removeEventListener('storage', handleRoleUpdate);
      window.removeEventListener('roleUpdated', handleRoleUpdate);
    };
  }, []);
  
  // Extract user role from Auth0 metadata or localStorage
  const userRole = useMemo(() => {
    if (!auth0.user) return null;
    
    // First check localStorage (for immediate role assignment)
    const storedRole = localStorage.getItem('userRole');
    console.log('useAuth - stored role in localStorage:', storedRole);
    if (storedRole && ['student', 'teacher'].includes(storedRole)) {
      console.log('useAuth - returning stored role:', storedRole);
      return storedRole as 'student' | 'teacher';
    }
    
    // Check app_metadata for role (set by Auth0 rules/actions)
    const appMetadata = (auth0.user as any)['https://bankdojo.app/app_metadata'];
    if (appMetadata?.role) {
      // Store in localStorage for faster access
      localStorage.setItem('userRole', appMetadata.role);
      return appMetadata.role;
    }
    
    // Fallback: check user_metadata
    const userMetadata = (auth0.user as any)['https://bankdojo.app/user_metadata'];
    if (userMetadata?.role) {
      localStorage.setItem('userRole', userMetadata.role);
      return userMetadata.role;
    }
    
    // No role assigned yet - user needs to select role
    console.log('useAuth - no role found, returning null');
    return null;
  }, [auth0.user, roleRefresh]);

  // Check if user is a teacher
  const isTeacher = useMemo(() => userRole === 'teacher', [userRole]);
  
  // Check if user is a student
  const isStudent = useMemo(() => userRole === 'student', [userRole]);
  
  // Check if user needs to select a role
  const needsRoleSelection = useMemo(() => {
    const needs = auth0.isAuthenticated && auth0.user && userRole === null;
    console.log('needsRoleSelection:', { isAuthenticated: auth0.isAuthenticated, hasUser: !!auth0.user, userRole, needs });
    return needs;
  }, [auth0.isAuthenticated, auth0.user, userRole]);

  // Enhanced login function with role-specific redirects
  const loginAsStudent = useCallback(() => {
    auth0.loginWithRedirect({
      authorizationParams: {
        redirect_uri: `${window.location.origin}/callback`,
        prompt: 'login'
      },
      appState: { targetUrl: '/student' }
    });
  }, [auth0]);

  const loginAsTeacher = useCallback(() => {
    auth0.loginWithRedirect({
      authorizationParams: {
        redirect_uri: `${window.location.origin}/callback`,
        prompt: 'login'
      },
      appState: { targetUrl: '/teacher' }
    });
  }, [auth0]);

  // Enhanced logout function
  const logout = useCallback(() => {
    auth0.logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  }, [auth0]);

  // Get access token for API calls
  const getAccessToken = useCallback(async () => {
    try {
      return await auth0.getAccessTokenSilently();
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  }, [auth0]);

  // Set user role and trigger re-render
  const setUserRole = useCallback((role: 'student' | 'teacher') => {
    localStorage.setItem('userRole', role);
    window.dispatchEvent(new CustomEvent('roleUpdated'));
    setRoleRefresh(prev => prev + 1);
  }, []);

  // Enhanced user info with role and avatar
  const userInfo = useMemo(() => {
    if (!auth0.user) return null;
    
    return {
      id: auth0.user.sub || '',
      name: auth0.user.name || '',
      email: auth0.user.email || '',
      avatar: auth0.user.picture || '',
      role: userRole,
      nickname: auth0.user.nickname || '',
      emailVerified: auth0.user.email_verified || false
    };
  }, [auth0.user, userRole]);

  return {
    // Auth0 core methods and state
    ...auth0,
    
    // Enhanced methods
    loginAsStudent,
    loginAsTeacher,
    logout,
    getAccessToken,
    setUserRole,
    
    // Role-based helpers
    userRole,
    isTeacher,
    isStudent,
    needsRoleSelection,
    userInfo,
    
    // Convenience flags
    isAuthenticated: auth0.isAuthenticated,
    isLoading: auth0.isLoading,
    error: auth0.error
  };
};

export type AuthUser = ReturnType<typeof useAuth>['userInfo'];
export type UserRole = 'student' | 'teacher' | null;