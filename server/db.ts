/**
 * In-memory database for BankDojo Jr.
 * Perfect for hackathon - no database setup required!
 * Data persists only during server runtime.
 */

import type {
  Student,
  Teacher,
  Class,
  Quest,
  QuestSubmission,
  Transaction,
  StoreItem,
  Purchase,
  Cycle,
  SurpriseEvent,
  Activity,
  Goal,
} from './types';

// In-memory storage using Maps (fast lookups, no setup needed)
export const db = {
  students: new Map<string, Student>(),
  teachers: new Map<string, Teacher>(),
  classes: new Map<string, Class>(),
  quests: new Map<string, Quest>(),
  questSubmissions: new Map<string, QuestSubmission>(),
  transactions: new Map<string, Transaction>(),
  storeItems: new Map<string, StoreItem>(),
  purchases: new Map<string, Purchase>(),
  cycles: new Map<string, Cycle>(),
  surpriseEvents: new Map<string, SurpriseEvent>(),
  activities: new Map<string, Activity>(),
  goals: new Map<string, Goal>(),
};

/**
 * Initialize database with sample data for development/demo
 * This creates a realistic starting state for testing
 */
export function initDatabase() {
  // Clear existing data
  Object.values(db).forEach(map => map.clear());

  // Create sample teacher
  const teacher: Teacher = {
    id: 'teacher-1',
    name: 'Mrs. Johnson',
    email: 'mrs.johnson@school.edu',
    classes: ['class-1', 'class-2'],
    createdAt: new Date().toISOString(),
  };
  db.teachers.set(teacher.id, teacher);

  // Create sample classes with different complexity presets
  const morningClass: Class = {
    id: 'class-1',
    name: 'Morning Class',
    teacherId: teacher.id,
    grade: 'Grade 3',
    complexity: 'Core',
    joinCode: 'ABC-123',
    studentIds: ['student-1'],
    storeEnabled: true,
    storeLocked: false,
    reflectionsRequired: false,
    surpriseEventsEnabled: false,
    autoSplitEnabled: false, // Student choice
    minSavePercentage: 20, // Minimum 20% must go to Save
    cycleLengthDays: 7,
    createdAt: new Date().toISOString(),
  };

  const afternoonClass: Class = {
    id: 'class-2',
    name: 'Afternoon Class',
    teacherId: teacher.id,
    grade: 'Grade 3',
    complexity: 'Starter',
    joinCode: 'XYZ-789',
    studentIds: [],
    storeEnabled: true,
    storeLocked: true, // Locked until goal met
    reflectionsRequired: true,
    surpriseEventsEnabled: false,
    autoSplitEnabled: true, // Auto-split 60/40
    autoSplitRatio: { save: 60, spend: 40 },
    cycleLengthDays: 7,
    createdAt: new Date().toISOString(),
  };

  db.classes.set(morningClass.id, morningClass);
  db.classes.set(afternoonClass.id, afternoonClass);

  // Create sample goal
  const goal: Goal = {
    id: 'goal-1',
    name: 'New Backpack 🎒',
    targetAmount: 75,
    currentAmount: 45,
    createdAt: new Date().toISOString(),
  };
  db.goals.set(goal.id, goal);

  // Create sample student
  const student: Student = {
    id: 'student-1',
    name: 'Alex',
    email: 'alex@student.edu',
    avatarId: 'panda',
    classId: morningClass.id,
    coins: 73,
    saveAmount: 45,
    spendAmount: 28,
    currentGoal: goal,
    createdAt: new Date().toISOString(),
    lastCycleReset: new Date().toISOString(),
  };
  db.students.set(student.id, student);

  // Create sample quests for different complexity levels
  const quest1: Quest = {
    id: 'quest-1',
    title: 'Shopping Trip',
    description: 'Help Sarah decide what to buy at the store. Which items are needs?',
    type: 'Needs vs Wants',
    rewardCoins: 10,
    classId: morningClass.id,
    complexity: 'Core',
    isActive: true,
    createdAt: new Date().toISOString(),
  };

  const quest2: Quest = {
    id: 'quest-2',
    title: 'Plan Your Week',
    description: 'You have 15 coins to spend this week. Plan how to use them wisely.',
    type: 'Budgeting',
    rewardCoins: 15,
    classId: morningClass.id,
    complexity: 'Core',
    isActive: true,
    createdAt: new Date().toISOString(),
  };

  const quest3: Quest = {
    id: 'quest-3',
    title: 'Compare Prices',
    description: 'Which store has better prices? Compare and decide.',
    type: 'Comparison',
    rewardCoins: 12,
    classId: morningClass.id,
    complexity: 'Core',
    isActive: true,
    createdAt: new Date().toISOString(),
  };

  db.quests.set(quest1.id, quest1);
  db.quests.set(quest2.id, quest2);
  db.quests.set(quest3.id, quest3);

  // Create sample store items
  const storeItem1: StoreItem = {
    id: 'item-1',
    name: 'Art Supplies',
    description: 'Colored pencils and markers',
    cost: 8,
    jar: 'spend',
    isAvailable: true,
    classId: morningClass.id,
    createdAt: new Date().toISOString(),
  };

  const storeItem2: StoreItem = {
    id: 'item-2',
    name: 'Sticker Pack',
    description: 'Fun animal stickers',
    cost: 5,
    jar: 'spend',
    isAvailable: true,
    classId: morningClass.id,
    createdAt: new Date().toISOString(),
  };

  db.storeItems.set(storeItem1.id, storeItem1);
  db.storeItems.set(storeItem2.id, storeItem2);

  // Create sample transactions
  const transaction1: Transaction = {
    id: 'tx-1',
    studentId: student.id,
    type: 'earn',
    amount: 12,
    jar: 'save',
    description: 'Completed "Compare Prices"',
    questId: quest3.id,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  };

  const transaction2: Transaction = {
    id: 'tx-2',
    studentId: student.id,
    type: 'spend',
    amount: 8,
    jar: 'spend',
    description: 'Bought Art Supplies',
    storeItemId: storeItem1.id,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
  };

  db.transactions.set(transaction1.id, transaction1);
  db.transactions.set(transaction2.id, transaction2);

  // Create sample activities
  const activity1: Activity = {
    id: 'activity-1',
    studentId: student.id,
    type: 'quest_completed',
    description: 'Completed "Compare Prices"',
    coins: 12,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  };

  const activity2: Activity = {
    id: 'activity-2',
    studentId: student.id,
    type: 'purchase',
    description: 'Bought Art Supplies',
    coins: -8,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  };

  db.activities.set(activity1.id, activity1);
  db.activities.set(activity2.id, activity2);

  // Create current cycle for the class
  const cycle: Cycle = {
    id: 'cycle-1',
    classId: morningClass.id,
    weekNumber: 1,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
    createdAt: new Date().toISOString(),
  };
  db.cycles.set(cycle.id, cycle);

  console.log('✅ Database initialized with sample data');
  console.log(`   - ${db.teachers.size} teachers`);
  console.log(`   - ${db.classes.size} classes`);
  console.log(`   - ${db.students.size} students`);
  console.log(`   - ${db.quests.size} quests`);
  console.log(`   - ${db.storeItems.size} store items`);
}

