/**
 * Quest Routes
 * Handles quest management and submissions
 */

import { Hono } from 'hono';
import { z } from 'zod';
import { db } from '../db';
import type { Quest, QuestSubmission } from '../types';

const quests = new Hono();

// Validation schemas
const createQuestSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  type: z.enum(['Needs vs Wants', 'Budgeting', 'Comparison', 'Goal Setting']),
  rewardCoins: z.number().positive(),
  classId: z.string().optional(),
  complexity: z.enum(['Starter', 'Core', 'Advanced']),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

const submitQuestSchema = z.object({
  studentId: z.string(),
  answer: z.string().min(1),
  reflection: z.string().max(120).optional(), // 120 char limit per PRD
});

const reviewSubmissionSchema = z.object({
  status: z.enum(['approved', 'returned']),
  teacherId: z.string(),
});

// GET /api/quests - Get all quests (optionally filtered by classId, complexity, active)
quests.get('/', (c) => {
  const classId = c.req.query('classId');
  const complexity = c.req.query('complexity') as 'Starter' | 'Core' | 'Advanced' | undefined;
  const activeOnly = c.req.query('activeOnly') !== 'false';
  
  let questsList = Array.from(db.quests.values());
  
  // Filter by class if classId is provided
  if (classId) {
    questsList = questsList.filter(q => !q.classId || q.classId === classId);
  }
  
  // Filter by complexity if provided
  if (complexity) {
    questsList = questsList.filter(q => q.complexity === complexity);
  }
  
  // Filter active quests
  if (activeOnly) {
    questsList = questsList.filter(q => q.isActive);
    
    // Also filter by time windows
    const now = new Date();
    questsList = questsList.filter(q => {
      if (q.startDate && new Date(q.startDate) > now) return false;
      if (q.endDate && new Date(q.endDate) < now) return false;
      return true;
    });
  }
  
  return c.json({ quests: questsList });
});

// GET /api/quests/:id - Get a specific quest
quests.get('/:id', (c) => {
  const id = c.req.param('id');
  const quest = db.quests.get(id);
  
  if (!quest) {
    return c.json({ error: 'Quest not found' }, 404);
  }
  
  return c.json({ quest });
});

// POST /api/quests - Create a new quest
quests.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const data = createQuestSchema.parse(body);
    
    // Validate class exists if classId is provided
    if (data.classId && !db.classes.get(data.classId)) {
      return c.json({ error: 'Class not found' }, 404);
    }
    
    const quest: Quest = {
      id: `quest-${Date.now()}`,
      title: data.title,
      description: data.description,
      type: data.type,
      rewardCoins: data.rewardCoins,
      classId: data.classId,
      complexity: data.complexity,
      isActive: true,
      startDate: data.startDate,
      endDate: data.endDate,
      createdAt: new Date().toISOString(),
    };
    
    db.quests.set(quest.id, quest);
    
    return c.json({ quest }, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Validation error', details: error.errors }, 400);
    }
    throw error;
  }
});

// PUT /api/quests/:id - Update a quest
quests.put('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const quest = db.quests.get(id);
    
    if (!quest) {
      return c.json({ error: 'Quest not found' }, 404);
    }
    
    const body = await c.req.json();
    const updates = createQuestSchema.partial().parse(body);
    
    // Update quest
    Object.assign(quest, updates);
    db.quests.set(id, quest);
    
    return c.json({ quest });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Validation error', details: error.errors }, 400);
    }
    throw error;
  }
});

// POST /api/quests/:id/submit - Submit an answer to a quest
quests.post('/:id/submit', async (c) => {
  try {
    const questId = c.req.param('id');
    const quest = db.quests.get(questId);
    
    if (!quest) {
      return c.json({ error: 'Quest not found' }, 404);
    }
    
    if (!quest.isActive) {
      return c.json({ error: 'Quest is not active' }, 400);
    }
    
    // Check time window
    const now = new Date();
    if (quest.startDate && new Date(quest.startDate) > now) {
      return c.json({ error: 'Quest has not started yet' }, 400);
    }
    if (quest.endDate && new Date(quest.endDate) < now) {
      return c.json({ error: 'Quest has ended' }, 400);
    }
    
    const body = await c.req.json();
    const data = submitQuestSchema.parse(body);
    
    // Validate student exists
    const student = db.students.get(data.studentId);
    if (!student) {
      return c.json({ error: 'Student not found' }, 404);
    }
    
    // Validate student is in the quest's class (if quest is class-specific)
    if (quest.classId && student.classId !== quest.classId) {
      return c.json({ error: 'Student is not in the quest class' }, 403);
    }
    
    // Check if student already submitted this quest
    const existingSubmission = Array.from(db.questSubmissions.values())
      .find(s => s.questId === questId && s.studentId === data.studentId);
    
    if (existingSubmission && existingSubmission.status === 'approved') {
      return c.json({ error: 'Quest already completed' }, 400);
    }
    
    // Create or update quest submission
    const submission: QuestSubmission = {
      id: existingSubmission?.id || `submission-${Date.now()}`,
      questId,
      studentId: data.studentId,
      answer: data.answer,
      reflection: data.reflection,
      status: 'pending',
      createdAt: existingSubmission?.createdAt || new Date().toISOString(),
    };
    
    db.questSubmissions.set(submission.id, submission);
    
    return c.json({ submission }, existingSubmission ? 200 : 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Validation error', details: error.errors }, 400);
    }
    throw error;
  }
});

// GET /api/quests/:id/submissions - Get all submissions for a quest
quests.get('/:id/submissions', (c) => {
  const questId = c.req.param('id');
  const status = c.req.query('status') as 'pending' | 'approved' | 'returned' | undefined;
  
  let submissions = Array.from(db.questSubmissions.values())
    .filter(s => s.questId === questId);
  
  if (status) {
    submissions = submissions.filter(s => s.status === status);
  }
  
  // Enrich with student and quest data
  const enrichedSubmissions = submissions.map(sub => ({
    ...sub,
    student: db.students.get(sub.studentId),
    quest: db.quests.get(sub.questId),
  }));
  
  return c.json({ submissions: enrichedSubmissions });
});

// POST /api/quests/:id/submissions/:submissionId/review - Review a quest submission
quests.post('/:id/submissions/:submissionId/review', async (c) => {
  try {
    const submissionId = c.req.param('submissionId');
    const submission = db.questSubmissions.get(submissionId);
    
    if (!submission) {
      return c.json({ error: 'Submission not found' }, 404);
    }
    
    const body = await c.req.json();
    const data = reviewSubmissionSchema.parse(body);
    
    // Update submission
    submission.status = data.status;
    submission.reviewedBy = data.teacherId;
    submission.reviewedAt = new Date().toISOString();
    
    db.questSubmissions.set(submissionId, submission);
    
    // If approved, award coins to student
    if (data.status === 'approved') {
      const quest = db.quests.get(submission.questId);
      const student = db.students.get(submission.studentId);
      
      if (quest && student) {
        // Get student's class to check auto-split settings
        const classData = db.classes.get(student.classId);
        
        // Award coins - by default to save jar, or based on class settings
        const jar = classData?.autoSplitEnabled ? 'save' : 'save'; // Default to save
        student.coins += quest.rewardCoins;
        student.saveAmount += quest.rewardCoins;
        db.students.set(submission.studentId, student);
        
        // Update goal progress if goal exists
        if (student.currentGoal) {
          student.currentGoal.currentAmount = student.saveAmount;
          if (student.currentGoal.currentAmount >= student.currentGoal.targetAmount) {
            student.currentGoal.completedAt = new Date().toISOString();
            
            // Create goal reached activity
            const activity = {
              id: `activity-${Date.now()}`,
              studentId: student.id,
              type: 'goal_reached' as const,
              description: `Reached goal: ${student.currentGoal.name}`,
              createdAt: new Date().toISOString(),
            };
            db.activities.set(activity.id, activity);
          }
          db.goals.set(student.currentGoal.id, student.currentGoal);
        }
        
        // Create transaction
        const transaction = {
          id: `tx-${Date.now()}`,
          studentId: submission.studentId,
          type: 'earn' as const,
          amount: quest.rewardCoins,
          jar: jar,
          description: `Completed quest: ${quest.title}`,
          questId: quest.id,
          createdAt: new Date().toISOString(),
        };
        
        db.transactions.set(transaction.id, transaction);
        
        // Create activity
        const activity = {
          id: `activity-${Date.now()}`,
          studentId: submission.studentId,
          type: 'quest_completed' as const,
          description: `Completed quest: ${quest.title}`,
          coins: quest.rewardCoins,
          createdAt: new Date().toISOString(),
        };
        
        db.activities.set(activity.id, activity);
      }
    }
    
    return c.json({ submission });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Validation error', details: error.errors }, 400);
    }
    throw error;
  }
});

export default quests;

