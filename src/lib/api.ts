/**
 * API Service Layer
 * Centralized API client for BankDojo Jr. backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Generic fetch wrapper with error handling
 */
async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

/**
 * GET request
 */
export async function get<T>(endpoint: string): Promise<T> {
  return fetchAPI<T>(endpoint, { method: 'GET' });
}

/**
 * POST request
 */
export async function post<T>(endpoint: string, data?: any): Promise<T> {
  return fetchAPI<T>(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * PUT request
 */
export async function put<T>(endpoint: string, data?: any): Promise<T> {
  return fetchAPI<T>(endpoint, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * DELETE request
 */
export async function del<T>(endpoint: string): Promise<T> {
  return fetchAPI<T>(endpoint, { method: 'DELETE' });
}

// Type definitions for API responses
export interface Student {
  id: string;
  name: string;
  email: string;
  avatarId?: string;
  classId: string;
  coins: number;
  saveAmount: number;
  spendAmount: number;
  currentGoal?: {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    completedAt?: string;
  };
  createdAt: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  classes: string[];
  createdAt: string;
}

export interface Class {
  id: string;
  name: string;
  teacherId: string;
  grade: string;
  complexity: 'Starter' | 'Core' | 'Advanced';
  joinCode: string;
  studentIds: string[];
  storeEnabled: boolean;
  storeLocked: boolean;
  reflectionsRequired: boolean;
  surpriseEventsEnabled: boolean;
  autoSplitEnabled: boolean;
  autoSplitRatio?: { save: number; spend: number };
  minSavePercentage?: number;
  cycleLengthDays: number;
  createdAt: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'Needs vs Wants' | 'Budgeting' | 'Comparison' | 'Goal Setting';
  rewardCoins: number;
  classId?: string;
  complexity: 'Starter' | 'Core' | 'Advanced';
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  createdAt: string;
}

export interface QuestSubmission {
  id: string;
  questId: string;
  studentId: string;
  answer: string;
  reflection?: string;
  status: 'pending' | 'approved' | 'returned';
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  studentId: string;
  type: 'earn' | 'spend' | 'transfer';
  amount: number;
  jar: 'save' | 'spend';
  description: string;
  questId?: string;
  storeItemId?: string;
  cycleId?: string;
  createdAt: string;
}

export interface Activity {
  id: string;
  studentId: string;
  type: 'quest_completed' | 'purchase' | 'goal_set' | 'goal_reached' | 'surprise_event' | 'cycle_reset';
  description: string;
  coins?: number;
  createdAt: string;
}

export interface TeacherStats {
  activeStudents: number;
  questsCompleted: number;
  pendingReviews: number;
  avgCompletion: number;
  totalClasses: number;
  conceptMastery: {
    'Needs vs Wants': number;
    'Budgeting': number;
    'Comparison': number;
    'Goal Setting': number;
  };
}

// Student API
export const studentAPI = {
  get: (id: string) => get<{ student: Student }>(`/api/students/${id}`),
  getAll: (classId?: string) => get<{ students: Student[] }>(
    `/api/students${classId ? `?classId=${classId}` : ''}`
  ),
  create: (data: { name: string; email: string; classId: string; avatarId?: string }) =>
    post<{ student: Student }>('/api/students', data),
  getTransactions: (id: string) => get<{ transactions: Transaction[] }>(`/api/students/${id}/transactions`),
  getActivities: (id: string) => get<{ activities: Activity[] }>(`/api/students/${id}/activities`),
  getQuests: (id: string) => get<{ quests: Quest[] }>(`/api/students/${id}/quests`),
  allocateCoins: (id: string, data: { saveAmount: number; spendAmount: number }) =>
    post<{ student: Student }>(`/api/students/${id}/allocate`, data),
  updateCoins: (id: string, data: { amount: number; jar: 'save' | 'spend'; description?: string }) =>
    post<{ student: Student; transaction: Transaction }>(`/api/students/${id}/coins`, data),
  setGoal: (id: string, data: { name: string; targetAmount: number }) =>
    put<{ student: Student; goal: any }>(`/api/students/${id}/goal`, data),
};

// Teacher API
export const teacherAPI = {
  get: (id: string) => get<{ teacher: Teacher & { classes: Class[] } }>(`/api/teachers/${id}`),
  getAll: () => get<{ teachers: Teacher[] }>('/api/teachers'),
  create: (data: { name: string; email: string }) =>
    post<{ teacher: Teacher }>('/api/teachers', data),
  getStats: (id: string) => get<{ stats: TeacherStats }>(`/api/teachers/${id}/stats`),
  getPendingSubmissions: (id: string) => 
    get<{ submissions: (QuestSubmission & { student?: Student; quest?: Quest })[] }>(`/api/teachers/${id}/pending-submissions`),
  getClassProgress: (id: string, classId: string) =>
    get<{ progress: any[] }>(`/api/teachers/${id}/classes/${classId}/progress`),
};

// Quest API
export const questAPI = {
  get: (id: string) => get<{ quest: Quest }>(`/api/quests/${id}`),
  getAll: (filters?: { classId?: string; complexity?: string; activeOnly?: boolean }) => {
    const params = new URLSearchParams();
    if (filters?.classId) params.append('classId', filters.classId);
    if (filters?.complexity) params.append('complexity', filters.complexity);
    if (filters?.activeOnly !== undefined) params.append('activeOnly', String(filters.activeOnly));
    return get<{ quests: Quest[] }>(`/api/quests${params.toString() ? `?${params.toString()}` : ''}`);
  },
  create: (data: {
    title: string;
    description: string;
    type: Quest['type'];
    rewardCoins: number;
    classId?: string;
    complexity: Quest['complexity'];
    startDate?: string;
    endDate?: string;
  }) => post<{ quest: Quest }>('/api/quests', data),
  submit: (id: string, data: { studentId: string; answer: string; reflection?: string }) =>
    post<{ submission: QuestSubmission }>(`/api/quests/${id}/submit`, data),
  getSubmissions: (id: string, status?: string) =>
    get<{ submissions: (QuestSubmission & { student?: Student; quest?: Quest })[] }>(
      `/api/quests/${id}/submissions${status ? `?status=${status}` : ''}`
    ),
  reviewSubmission: (questId: string, submissionId: string, data: { status: 'approved' | 'returned'; teacherId: string }) =>
    post<{ submission: QuestSubmission }>(`/api/quests/${questId}/submissions/${submissionId}/review`, data),
};

// Class API
export const classAPI = {
  get: (id: string) => get<{ class: Class & { students?: Student[]; teacher?: Teacher } }>(`/api/classes/${id}`),
  getAll: (teacherId?: string) => get<{ classes: (Class & { students?: Student[]; teacher?: Teacher })[] }>(
    `/api/classes${teacherId ? `?teacherId=${teacherId}` : ''}`
  ),
  create: (data: {
    name: string;
    teacherId: string;
    grade: string;
    complexity: Class['complexity'];
    storeEnabled?: boolean;
    storeLocked?: boolean;
    reflectionsRequired?: boolean;
    surpriseEventsEnabled?: boolean;
    autoSplitEnabled?: boolean;
    autoSplitRatio?: { save: number; spend: number };
    minSavePercentage?: number;
    cycleLengthDays?: number;
  }) => post<{ class: Class }>('/api/classes', data),
  join: (id: string, data: { studentId: string; joinCode: string }) =>
    post<{ message: string; class: Class }>(`/api/classes/${id}/join`, data),
  getByJoinCode: (joinCode: string) => get<{ class: Partial<Class> }>(`/api/classes/join/${joinCode}`),
};

// Store API
export const storeAPI = {
  getItems: (classId?: string) => get<{ items: any[] }>(
    `/api/store${classId ? `?classId=${classId}` : ''}`
  ),
  getItem: (id: string) => get<{ item: any }>(`/api/store/${id}`),
  purchase: (id: string, data: { studentId: string }) =>
    post<{ purchase: any; transaction: Transaction; student: Student }>(`/api/store/${id}/purchase`, data),
};

// Transaction API
export const transactionAPI = {
  getAll: (filters?: { studentId?: string; type?: string; jar?: string }) => {
    const params = new URLSearchParams();
    if (filters?.studentId) params.append('studentId', filters.studentId);
    if (filters?.type) params.append('type', filters.type);
    if (filters?.jar) params.append('jar', filters.jar);
    return get<{ transactions: Transaction[] }>(`/api/transactions${params.toString() ? `?${params.toString()}` : ''}`);
  },
  get: (id: string) => get<{ transaction: Transaction }>(`/api/transactions/${id}`),
};

// Health check
export const healthAPI = {
  check: () => get<{ status: string; timestamp: string; service: string }>('/health'),
};

