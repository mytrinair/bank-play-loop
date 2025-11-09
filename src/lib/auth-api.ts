/**
 * Auth-aware API client that automatically includes Auth0 tokens
 * This replaces the generic api.ts to support authenticated requests
 */

import { useAuth0 } from '@auth0/auth0-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Custom hook that provides an authenticated fetch function
 * Automatically includes Auth0 access token in requests
 */
export const useAuthenticatedFetch = () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  const authenticatedFetch = async <T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> => {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Get access token for authenticated requests
    let token: string | null = null;
    if (isAuthenticated) {
      try {
        token = await getAccessTokenSilently();
      } catch (error) {
        console.error('Failed to get access token:', error);
        // Continue without token for public endpoints
      }
    }

    // Prepare headers with authentication
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options?.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      
      // Handle authentication errors
      if (response.status === 401) {
        throw new Error('Authentication required. Please log in.');
      }
      if (response.status === 403) {
        throw new Error('You don\'t have permission to access this resource.');
      }
      
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  };

  return {
    get: <T>(endpoint: string) => authenticatedFetch<T>(endpoint, { method: 'GET' }),
    post: <T>(endpoint: string, data?: any) => 
      authenticatedFetch<T>(endpoint, {
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
      }),
    put: <T>(endpoint: string, data?: any) => 
      authenticatedFetch<T>(endpoint, {
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined,
      }),
    delete: <T>(endpoint: string) => authenticatedFetch<T>(endpoint, { method: 'DELETE' }),
  };
};

/**
 * API client factory that uses the authenticated fetch
 * This creates API methods that automatically include auth tokens
 */
export const createAuthenticatedAPI = (authFetch: ReturnType<typeof useAuthenticatedFetch>) => {
  return {
    // Student API
    student: {
      get: (id: string) => authFetch.get(`/api/students/${id}`),
      getAll: (classId?: string) => authFetch.get(
        `/api/students${classId ? `?classId=${classId}` : ''}`
      ),
      create: (data: { name: string; email: string; classId: string; avatarId?: string }) =>
        authFetch.post('/api/students', data),
      getTransactions: (id: string) => authFetch.get(`/api/students/${id}/transactions`),
      getActivities: (id: string) => authFetch.get(`/api/students/${id}/activities`),
      getQuests: (id: string) => authFetch.get(`/api/students/${id}/quests`),
      allocateCoins: (id: string, data: { saveAmount: number; spendAmount: number }) =>
        authFetch.post(`/api/students/${id}/allocate`, data),
      updateCoins: (id: string, data: { amount: number; jar: 'save' | 'spend'; description?: string }) =>
        authFetch.post(`/api/students/${id}/coins`, data),
      setGoal: (id: string, data: { name: string; targetAmount: number }) =>
        authFetch.put(`/api/students/${id}/goal`, data),
    },

    // Teacher API
    teacher: {
      get: (id: string) => authFetch.get(`/api/teachers/${id}`),
      getAll: () => authFetch.get('/api/teachers'),
      create: (data: { name: string; email: string }) =>
        authFetch.post('/api/teachers', data),
      getStats: (id: string) => authFetch.get(`/api/teachers/${id}/stats`),
      getPendingSubmissions: (id: string) => 
        authFetch.get(`/api/teachers/${id}/pending-submissions`),
      getClassProgress: (id: string, classId: string) =>
        authFetch.get(`/api/teachers/${id}/classes/${classId}/progress`),
    },

    // Quest API
    quest: {
      get: (id: string) => authFetch.get(`/api/quests/${id}`),
      getAll: (filters?: { classId?: string; complexity?: string; activeOnly?: boolean }) => {
        const params = new URLSearchParams();
        if (filters?.classId) params.append('classId', filters.classId);
        if (filters?.complexity) params.append('complexity', filters.complexity);
        if (filters?.activeOnly !== undefined) params.append('activeOnly', String(filters.activeOnly));
        return authFetch.get(`/api/quests${params.toString() ? `?${params.toString()}` : ''}`);
      },
      create: (data: any) => authFetch.post('/api/quests', data),
      submit: (id: string, data: { studentId: string; answer: string; reflection?: string }) =>
        authFetch.post(`/api/quests/${id}/submit`, data),
      getSubmissions: (id: string, status?: string) =>
        authFetch.get(`/api/quests/${id}/submissions${status ? `?status=${status}` : ''}`),
      reviewSubmission: (questId: string, submissionId: string, data: { status: 'approved' | 'returned'; teacherId: string }) =>
        authFetch.post(`/api/quests/${questId}/submissions/${submissionId}/review`, data),
    },

    // Class API
    class: {
      get: (id: string) => authFetch.get(`/api/classes/${id}`),
      getAll: (teacherId?: string) => authFetch.get(
        `/api/classes${teacherId ? `?teacherId=${teacherId}` : ''}`
      ),
      create: (data: any) => authFetch.post('/api/classes', data),
      join: (id: string, data: { studentId: string; joinCode: string }) =>
        authFetch.post(`/api/classes/${id}/join`, data),
      getByJoinCode: (joinCode: string) => authFetch.get(`/api/classes/join/${joinCode}`),
    },

    // Store API
    store: {
      getItems: (classId?: string) => authFetch.get(
        `/api/store${classId ? `?classId=${classId}` : ''}`
      ),
      getItem: (id: string) => authFetch.get(`/api/store/${id}`),
      purchase: (id: string, data: { studentId: string }) =>
        authFetch.post(`/api/store/${id}/purchase`, data),
    },

    // Transaction API
    transaction: {
      getAll: (filters?: { studentId?: string; type?: string; jar?: string }) => {
        const params = new URLSearchParams();
        if (filters?.studentId) params.append('studentId', filters.studentId);
        if (filters?.type) params.append('type', filters.type);
        if (filters?.jar) params.append('jar', filters.jar);
        return authFetch.get(`/api/transactions${params.toString() ? `?${params.toString()}` : ''}`);
      },
      get: (id: string) => authFetch.get(`/api/transactions/${id}`),
    },

    // Health check (public endpoint)
    health: {
      check: () => authFetch.get('/health'),
    },
  };
};