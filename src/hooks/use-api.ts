/**
 * React Query hooks for API calls
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  studentAPI,
  teacherAPI,
  questAPI,
  classAPI,
  storeAPI,
  transactionAPI,
  healthAPI,
  type Student,
  type Teacher,
  type Quest,
  type Class,
  type TeacherStats,
  type Transaction,
  type Activity,
} from '@/lib/api';

// Student hooks
export function useStudent(id: string) {
  return useQuery({
    queryKey: ['student', id],
    queryFn: () => studentAPI.get(id),
    enabled: !!id,
  });
}

export function useStudents(classId?: string) {
  return useQuery({
    queryKey: ['students', classId],
    queryFn: () => studentAPI.getAll(classId),
  });
}

export function useStudentTransactions(studentId: string) {
  return useQuery({
    queryKey: ['student-transactions', studentId],
    queryFn: () => studentAPI.getTransactions(studentId),
    enabled: !!studentId,
  });
}

export function useStudentActivities(studentId: string) {
  return useQuery({
    queryKey: ['student-activities', studentId],
    queryFn: () => studentAPI.getActivities(studentId),
    enabled: !!studentId,
  });
}

export function useStudentQuests(studentId: string) {
  return useQuery({
    queryKey: ['student-quests', studentId],
    queryFn: () => studentAPI.getQuests(studentId),
    enabled: !!studentId,
  });
}

export function useAllocateCoins() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ studentId, data }: { studentId: string; data: { saveAmount: number; spendAmount: number } }) =>
      studentAPI.allocateCoins(studentId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['student', variables.studentId] });
    },
  });
}

export function useSetGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ studentId, data }: { studentId: string; data: { name: string; targetAmount: number } }) =>
      studentAPI.setGoal(studentId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['student', variables.studentId] });
    },
  });
}

// Teacher hooks
export function useTeacher(id: string) {
  return useQuery({
    queryKey: ['teacher', id],
    queryFn: () => teacherAPI.get(id),
    enabled: !!id,
  });
}

export function useTeacherStats(teacherId: string) {
  return useQuery({
    queryKey: ['teacher-stats', teacherId],
    queryFn: () => teacherAPI.getStats(teacherId),
    enabled: !!teacherId,
  });
}

export function useTeacherPendingSubmissions(teacherId: string) {
  return useQuery({
    queryKey: ['teacher-pending-submissions', teacherId],
    queryFn: () => teacherAPI.getPendingSubmissions(teacherId),
    enabled: !!teacherId,
  });
}

export function useClassProgress(teacherId: string, classId: string) {
  return useQuery({
    queryKey: ['class-progress', teacherId, classId],
    queryFn: () => teacherAPI.getClassProgress(teacherId, classId),
    enabled: !!teacherId && !!classId,
  });
}

// Quest hooks
export function useQuests(filters?: { classId?: string; complexity?: string; activeOnly?: boolean }) {
  return useQuery({
    queryKey: ['quests', filters],
    queryFn: () => questAPI.getAll(filters),
  });
}

export function useQuest(id: string) {
  return useQuery({
    queryKey: ['quest', id],
    queryFn: () => questAPI.get(id),
    enabled: !!id,
  });
}

export function useQuestSubmissions(questId: string, status?: string) {
  return useQuery({
    queryKey: ['quest-submissions', questId, status],
    queryFn: () => questAPI.getSubmissions(questId, status),
    enabled: !!questId,
  });
}

export function useSubmitQuest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ questId, data }: { questId: string; data: { studentId: string; answer: string; reflection?: string } }) =>
      questAPI.submit(questId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['quest-submissions', variables.questId] });
      queryClient.invalidateQueries({ queryKey: ['student-quests', variables.data.studentId] });
    },
  });
}

export function useReviewSubmission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ questId, submissionId, data }: { questId: string; submissionId: string; data: { status: 'approved' | 'returned'; teacherId: string } }) =>
      questAPI.reviewSubmission(questId, submissionId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['quest-submissions', variables.questId] });
      queryClient.invalidateQueries({ queryKey: ['teacher-stats'] });
    },
  });
}

// Class hooks
export function useClasses(teacherId?: string) {
  return useQuery({
    queryKey: ['classes', teacherId],
    queryFn: () => classAPI.getAll(teacherId),
  });
}

export function useClass(id: string) {
  return useQuery({
    queryKey: ['class', id],
    queryFn: () => classAPI.get(id),
    enabled: !!id,
  });
}

export function useJoinClass() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ classId, data }: { classId: string; data: { studentId: string; joinCode: string } }) =>
      classAPI.join(classId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
  });
}

// Store hooks
export function useStoreItems(classId?: string) {
  return useQuery({
    queryKey: ['store-items', classId],
    queryFn: () => storeAPI.getItems(classId),
  });
}

export function usePurchaseItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, data }: { itemId: string; data: { studentId: string } }) =>
      storeAPI.purchase(itemId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['student', variables.data.studentId] });
      queryClient.invalidateQueries({ queryKey: ['student-transactions', variables.data.studentId] });
      queryClient.invalidateQueries({ queryKey: ['student-activities', variables.data.studentId] });
    },
  });
}

// Health check
export function useHealth() {
  return useQuery({
    queryKey: ['health'],
    queryFn: () => healthAPI.check(),
    refetchInterval: 30000, // Check every 30 seconds
  });
}

