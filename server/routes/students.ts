/**
 * Student Routes
 * Handles all student-related API endpoints
 */

import { Hono } from 'hono';
import { z } from 'zod';
import { db } from '../db';
import type { Student, Transaction, Activity, Goal, AllocationRequest } from '../types';

const students = new Hono();

// Validation schemas
const createStudentSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  classId: z.string(),
  avatarId: z.string().optional(),
});

const updateCoinsSchema = z.object({
  amount: z.number(),
  jar: z.enum(['save', 'spend']),
  description: z.string().optional(),
});

const allocateCoinsSchema = z.object({
  saveAmount: z.number().min(0),
  spendAmount: z.number().min(0),
});

const setGoalSchema = z.object({
  name: z.string().min(1),
  targetAmount: z.number().positive(),
});

// GET /api/students - Get all students (optionally filtered by classId)
students.get('/', (c) => {
  const classId = c.req.query('classId');
  
  let studentsList = Array.from(db.students.values());
  
  if (classId) {
    studentsList = studentsList.filter(s => s.classId === classId);
  }
  
  return c.json({ students: studentsList });
});

// GET /api/students/:id - Get a specific student
students.get('/:id', (c) => {
  const id = c.req.param('id');
  const student = db.students.get(id);
  
  if (!student) {
    return c.json({ error: 'Student not found' }, 404);
  }
  
  // Get student's class info
  const classData = db.classes.get(student.classId);
  
  return c.json({ 
    student: {
      ...student,
      class: classData,
    },
  });
});

// POST /api/students - Create a new student
students.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const data = createStudentSchema.parse(body);
    
    // Check if class exists
    const classData = db.classes.get(data.classId);
    if (!classData) {
      return c.json({ error: 'Class not found' }, 404);
    }
    
    // Create new student
    const student: Student = {
      id: `student-${Date.now()}`,
      name: data.name,
      email: data.email,
      avatarId: data.avatarId,
      classId: data.classId,
      coins: 0,
      saveAmount: 0,
      spendAmount: 0,
      createdAt: new Date().toISOString(),
    };
    
    db.students.set(student.id, student);
    
    // Add student to class
    classData.studentIds.push(student.id);
    db.classes.set(data.classId, classData);
    
    return c.json({ student }, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Validation error', details: error.errors }, 400);
    }
    throw error;
  }
});

// GET /api/students/:id/transactions - Get student's transaction history
students.get('/:id/transactions', (c) => {
  const id = c.req.param('id');
  const student = db.students.get(id);
  
  if (!student) {
    return c.json({ error: 'Student not found' }, 404);
  }
  
  const transactions = Array.from(db.transactions.values())
    .filter(t => t.studentId === id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  return c.json({ transactions });
});

// GET /api/students/:id/activities - Get student's activity feed
students.get('/:id/activities', (c) => {
  const id = c.req.param('id');
  const student = db.students.get(id);
  
  if (!student) {
    return c.json({ error: 'Student not found' }, 404);
  }
  
  const activities = Array.from(db.activities.values())
    .filter(a => a.studentId === id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  return c.json({ activities });
});

// GET /api/students/:id/quests - Get available quests for student
students.get('/:id/quests', (c) => {
  const id = c.req.param('id');
  const student = db.students.get(id);
  
  if (!student) {
    return c.json({ error: 'Student not found' }, 404);
  }
  
  const classData = db.classes.get(student.classId);
  if (!classData) {
    return c.json({ error: 'Class not found' }, 404);
  }
  
  // Get quests for student's class or matching complexity
  const quests = Array.from(db.quests.values())
    .filter(q => 
      q.isActive &&
      (q.classId === student.classId || (!q.classId && q.complexity === classData.complexity))
    )
    .filter(q => {
      // Check time windows if set
      const now = new Date();
      if (q.startDate && new Date(q.startDate) > now) return false;
      if (q.endDate && new Date(q.endDate) < now) return false;
      return true;
    });
  
  return c.json({ quests });
});

// POST /api/students/:id/allocate - Allocate coins between Save and Spend jars
students.post('/:id/allocate', async (c) => {
  try {
    const id = c.req.param('id');
    const student = db.students.get(id);
    
    if (!student) {
      return c.json({ error: 'Student not found' }, 404);
    }
    
    const classData = db.classes.get(student.classId);
    if (!classData) {
      return c.json({ error: 'Class not found' }, 404);
    }
    
    const body = await c.req.json();
    const data = allocateCoinsSchema.parse(body);
    
    // Check if auto-split is enabled
    if (classData.autoSplitEnabled && classData.autoSplitRatio) {
      // Auto-split mode - calculate allocation
      const total = student.coins;
      const saveAmount = Math.floor(total * classData.autoSplitRatio.save / 100);
      const spendAmount = total - saveAmount;
      
      student.saveAmount = saveAmount;
      student.spendAmount = spendAmount;
    } else {
      // Student choice mode - validate allocation
      const total = data.saveAmount + data.spendAmount;
      
      if (total > student.coins) {
        return c.json({ error: 'Insufficient coins' }, 400);
      }
      
      // Check minimum save percentage if set
      if (classData.minSavePercentage) {
        const savePercentage = (data.saveAmount / total) * 100;
        if (savePercentage < classData.minSavePercentage) {
          return c.json({ 
            error: `Minimum ${classData.minSavePercentage}% must go to Save jar` 
          }, 400);
        }
      }
      
      student.saveAmount = data.saveAmount;
      student.spendAmount = data.spendAmount;
    }
    
    db.students.set(id, student);
    
    return c.json({ student });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Validation error', details: error.errors }, 400);
    }
    throw error;
  }
});

// POST /api/students/:id/coins - Update student's coins (earn/spend)
students.post('/:id/coins', async (c) => {
  try {
    const id = c.req.param('id');
    const student = db.students.get(id);
    
    if (!student) {
      return c.json({ error: 'Student not found' }, 404);
    }
    
    const body = await c.req.json();
    const data = updateCoinsSchema.parse(body);
    
    // Update student coins
    if (data.amount > 0) {
      // Earning coins
      student.coins += data.amount;
      if (data.jar === 'save') {
        student.saveAmount += data.amount;
      } else {
        student.spendAmount += data.amount;
      }
    } else {
      // Spending coins
      const amount = Math.abs(data.amount);
      if (data.jar === 'save' && student.saveAmount >= amount) {
        student.saveAmount -= amount;
        student.coins -= amount;
      } else if (data.jar === 'spend' && student.spendAmount >= amount) {
        student.spendAmount -= amount;
        student.coins -= amount;
      } else {
        return c.json({ error: 'Insufficient coins in jar' }, 400);
      }
    }
    
    // Update goal progress if goal exists
    if (student.currentGoal) {
      student.currentGoal.currentAmount = student.saveAmount;
      if (student.currentGoal.currentAmount >= student.currentGoal.targetAmount) {
        student.currentGoal.completedAt = new Date().toISOString();
      }
      db.goals.set(student.currentGoal.id, student.currentGoal);
    }
    
    db.students.set(id, student);
    
    // Create transaction record
    const transaction: Transaction = {
      id: `tx-${Date.now()}`,
      studentId: id,
      type: data.amount > 0 ? 'earn' : 'spend',
      amount: Math.abs(data.amount),
      jar: data.jar,
      description: data.description || 'Coin transaction',
      createdAt: new Date().toISOString(),
    };
    
    db.transactions.set(transaction.id, transaction);
    
    // Create activity record
    const activity: Activity = {
      id: `activity-${Date.now()}`,
      studentId: id,
      type: data.amount > 0 ? 'quest_completed' : 'purchase',
      description: data.description || 'Coin transaction',
      coins: data.amount,
      createdAt: new Date().toISOString(),
    };
    
    db.activities.set(activity.id, activity);
    
    return c.json({ student, transaction });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Validation error', details: error.errors }, 400);
    }
    throw error;
  }
});

// PUT /api/students/:id/goal - Set or update student's current goal
students.put('/:id/goal', async (c) => {
  try {
    const id = c.req.param('id');
    const student = db.students.get(id);
    
    if (!student) {
      return c.json({ error: 'Student not found' }, 404);
    }
    
    const body = await c.req.json();
    const data = setGoalSchema.parse(body);
    
    // Create or update goal
    const goalId = student.currentGoal?.id || `goal-${Date.now()}`;
    const goal: Goal = {
      id: goalId,
      name: data.name,
      targetAmount: data.targetAmount,
      currentAmount: student.saveAmount,
      createdAt: student.currentGoal?.createdAt || new Date().toISOString(),
      completedAt: student.saveAmount >= data.targetAmount 
        ? new Date().toISOString() 
        : undefined,
    };
    
    db.goals.set(goalId, goal);
    student.currentGoal = goal;
    db.students.set(id, student);
    
    // Create activity
    const activity: Activity = {
      id: `activity-${Date.now()}`,
      studentId: id,
      type: 'goal_set',
      description: `Set goal: ${data.name}`,
      createdAt: new Date().toISOString(),
    };
    db.activities.set(activity.id, activity);
    
    return c.json({ student, goal });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Validation error', details: error.errors }, 400);
    }
    throw error;
  }
});

export default students;

