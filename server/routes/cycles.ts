/**
 * Cycle Routes
 * Handles weekly cycles, resets, and cycle summaries
 */

import { Hono } from 'hono';
import { z } from 'zod';
import { db } from '../db';
import type { Cycle, CycleSummary, Activity } from '../types';

const cycles = new Hono();

// Validation schemas
const createCycleSchema = z.object({
  classId: z.string(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

// GET /api/cycles - Get all cycles (optionally filtered by classId, active)
cycles.get('/', (c) => {
  const classId = c.req.query('classId');
  const activeOnly = c.req.query('activeOnly') === 'true';
  
  let cyclesList = Array.from(db.cycles.values());
  
  if (classId) {
    cyclesList = cyclesList.filter(c => c.classId === classId);
  }
  
  if (activeOnly) {
    cyclesList = cyclesList.filter(c => c.isActive);
  }
  
  // Sort by start date (newest first)
  cyclesList.sort((a, b) => 
    new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );
  
  return c.json({ cycles: cyclesList });
});

// GET /api/cycles/:id - Get a specific cycle
cycles.get('/:id', (c) => {
  const id = c.req.param('id');
  const cycle = db.cycles.get(id);
  
  if (!cycle) {
    return c.json({ error: 'Cycle not found' }, 404);
  }
  
  return c.json({ cycle });
});

// GET /api/cycles/:id/summary - Get cycle summary for a student
cycles.get('/:id/summary', (c) => {
  const cycleId = c.req.param('id');
  const studentId = c.req.query('studentId');
  
  if (!studentId) {
    return c.json({ error: 'studentId query parameter is required' }, 400);
  }
  
  const cycle = db.cycles.get(cycleId);
  if (!cycle) {
    return c.json({ error: 'Cycle not found' }, 404);
  }
  
  const student = db.students.get(studentId);
  if (!student) {
    return c.json({ error: 'Student not found' }, 404);
  }
  
  // Get transactions for this cycle
  const transactions = Array.from(db.transactions.values())
    .filter(t => t.studentId === studentId && t.cycleId === cycleId);
  
  const coinsEarned = transactions
    .filter(t => t.type === 'earn')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const coinsSpent = transactions
    .filter(t => t.type === 'spend')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const total = coinsEarned + coinsSpent;
  const saveRate = total > 0 ? Math.round((coinsEarned / total) * 100) : 0;
  
  // Count quests completed
  const questsCompleted = transactions
    .filter(t => t.type === 'earn' && t.questId)
    .length;
  
  // Check if goal was met
  const goalMet = student.currentGoal?.completedAt 
    ? new Date(student.currentGoal.completedAt) >= new Date(cycle.startDate)
    : false;
  
  const summary: CycleSummary = {
    cycleId,
    studentId,
    coinsEarned,
    coinsSpent,
    saveRate,
    goalMet,
    questsCompleted,
    createdAt: new Date().toISOString(),
  };
  
  return c.json({ summary });
});

// POST /api/cycles - Create a new cycle (usually done automatically)
cycles.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const data = createCycleSchema.parse(body);
    
    // Validate class exists
    const classData = db.classes.get(data.classId);
    if (!classData) {
      return c.json({ error: 'Class not found' }, 404);
    }
    
    // Get the last cycle for this class to determine week number
    const lastCycle = Array.from(db.cycles.values())
      .filter(c => c.classId === data.classId)
      .sort((a, b) => b.weekNumber - a.weekNumber)[0];
    
    const weekNumber = lastCycle ? lastCycle.weekNumber + 1 : 1;
    
    // Calculate dates
    const startDate = data.startDate 
      ? new Date(data.startDate)
      : new Date();
    const endDate = data.endDate
      ? new Date(data.endDate)
      : new Date(startDate.getTime() + classData.cycleLengthDays * 24 * 60 * 60 * 1000);
    
    const cycle: Cycle = {
      id: `cycle-${Date.now()}`,
      classId: data.classId,
      weekNumber,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    
    db.cycles.set(cycle.id, cycle);
    
    return c.json({ cycle }, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Validation error', details: error.errors }, 400);
    }
    throw error;
  }
});

// POST /api/cycles/:id/reset - Reset cycle for a class (weekly reset)
cycles.post('/:id/reset', async (c) => {
  try {
    const cycleId = c.req.param('id');
    const cycle = db.cycles.get(cycleId);
    
    if (!cycle) {
      return c.json({ error: 'Cycle not found' }, 404);
    }
    
    const classData = db.classes.get(cycle.classId);
    if (!classData) {
      return c.json({ error: 'Class not found' }, 404);
    }
    
    // Mark current cycle as inactive
    cycle.isActive = false;
    db.cycles.set(cycleId, cycle);
    
    // Create new cycle
    const newCycle: Cycle = {
      id: `cycle-${Date.now()}`,
      classId: cycle.classId,
      weekNumber: cycle.weekNumber + 1,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + classData.cycleLengthDays * 24 * 60 * 60 * 1000).toISOString(),
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    
    db.cycles.set(newCycle.id, newCycle);
    
    // Reset student states for the new cycle
    // Note: In a real implementation, you might want to preserve some state
    // For now, we'll just update the lastCycleReset timestamp
    classData.studentIds.forEach(studentId => {
      const student = db.students.get(studentId);
      if (student) {
        student.lastCycleReset = new Date().toISOString();
        
        // Create cycle reset activity
        const activity: Activity = {
          id: `activity-${Date.now()}-${studentId}`,
          studentId: student.id,
          type: 'cycle_reset',
          description: `New week started! Week ${newCycle.weekNumber}`,
          createdAt: new Date().toISOString(),
        };
        db.activities.set(activity.id, activity);
        
        db.students.set(studentId, student);
      }
    });
    
    return c.json({ 
      message: 'Cycle reset successfully',
      oldCycle: cycle,
      newCycle,
    });
  } catch (error) {
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export default cycles;

