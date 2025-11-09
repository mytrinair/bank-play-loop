/**
 * Type definitions for BankDojo Jr. Backend
 * Based on PRD: Unlimited Financial Life Platform (Grades 1-5)
 */

// Complexity presets as defined in PRD
export type ComplexityPreset = 'Starter' | 'Core' | 'Advanced';

// Quest types
export type QuestType = 'Needs vs Wants' | 'Budgeting' | 'Comparison' | 'Goal Setting';

// Transaction types
export type TransactionType = 'earn' | 'spend' | 'transfer';

// Jar types
export type JarType = 'save' | 'spend';

// Quest submission status
export type SubmissionStatus = 'pending' | 'approved' | 'returned';

// Student entity
export interface Student {
  id: string;
  name: string;
  email: string;
  avatarId?: string;
  classId: string;
  coins: number;
  saveAmount: number;
  spendAmount: number;
  currentGoal?: Goal;
  createdAt: string;
  lastCycleReset?: string;
}

// Goal entity
export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  createdAt: string;
  completedAt?: string;
}

// Teacher entity
export interface Teacher {
  id: string;
  name: string;
  email: string;
  classes: string[]; // Array of class IDs
  createdAt: string;
}

// Class entity with complexity and feature toggles
export interface Class {
  id: string;
  name: string;
  teacherId: string;
  grade: string;
  complexity: ComplexityPreset;
  joinCode: string;
  studentIds: string[];
  // Feature toggles from PRD
  storeEnabled: boolean;
  storeLocked: boolean; // Lock purchases until min Save met
  reflectionsRequired: boolean;
  surpriseEventsEnabled: boolean;
  autoSplitEnabled: boolean; // Auto-split coins vs student choice
  autoSplitRatio?: { save: number; spend: number }; // e.g., { save: 60, spend: 40 }
  minSavePercentage?: number; // Minimum percentage that must go to Save
  cycleLengthDays: number; // Weekly = 7, bi-weekly = 14, etc.
  createdAt: string;
}

// Quest entity
export interface Quest {
  id: string;
  title: string;
  description: string;
  type: QuestType;
  rewardCoins: number;
  classId?: string; // If null, available to all classes of matching complexity
  complexity: ComplexityPreset;
  isActive: boolean;
  // Time window (optional)
  startDate?: string;
  endDate?: string;
  createdAt: string;
}

// Quest submission entity
export interface QuestSubmission {
  id: string;
  questId: string;
  studentId: string;
  answer: string;
  reflection?: string; // Optional 1-sentence reflection (120 char limit)
  status: SubmissionStatus;
  reviewedBy?: string; // Teacher ID
  reviewedAt?: string;
  createdAt: string;
}

// Transaction entity
export interface Transaction {
  id: string;
  studentId: string;
  type: TransactionType;
  amount: number;
  jar: JarType;
  description: string;
  questId?: string; // If earned from a quest
  storeItemId?: string; // If spent on store item
  cycleId?: string; // Which weekly cycle this belongs to
  createdAt: string;
}

// Store item entity
export interface StoreItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  jar: 'spend'; // Store items can only be bought with Spend jar
  imageUrl?: string;
  isAvailable: boolean;
  classId?: string; // If null, available to all classes
  createdAt: string;
}

// Purchase entity
export interface Purchase {
  id: string;
  studentId: string;
  storeItemId: string;
  cost: number;
  cycleId?: string;
  createdAt: string;
}

// Weekly cycle entity
export interface Cycle {
  id: string;
  classId: string;
  weekNumber: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
}

// Surprise event entity (for Advanced preset)
export interface SurpriseEvent {
  id: string;
  cycleId: string;
  studentId: string;
  title: string;
  description: string;
  cost: number;
  jar: JarType;
  isHandled: boolean;
  createdAt: string;
}

// Activity/feed entity
export interface Activity {
  id: string;
  studentId: string;
  type: 'quest_completed' | 'purchase' | 'goal_set' | 'goal_reached' | 'surprise_event' | 'cycle_reset';
  description: string;
  coins?: number;
  createdAt: string;
}

// Teacher dashboard stats
export interface TeacherStats {
  activeStudents: number;
  questsCompleted: number;
  pendingReviews: number;
  avgCompletion: number;
  totalClasses: number;
  // Concept mastery (heatmap data)
  conceptMastery: {
    'Needs vs Wants': number;
    'Budgeting': number;
    'Comparison': number;
    'Goal Setting': number;
  };
}

// Student allocation request (for Save/Spend split)
export interface AllocationRequest {
  saveAmount: number;
  spendAmount: number;
  totalAmount: number;
}

// Cycle summary (for student/teacher)
export interface CycleSummary {
  cycleId: string;
  studentId: string;
  coinsEarned: number;
  coinsSpent: number;
  saveRate: number; // Percentage saved
  goalMet: boolean;
  questsCompleted: number;
  createdAt: string;
}

