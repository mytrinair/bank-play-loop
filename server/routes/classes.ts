/**
 * Class Routes
 * Handles class management, join codes, and feature toggles
 */

import { Hono } from 'hono';
import { z } from 'zod';
import { db } from '../db';
import type { Class, ComplexityPreset } from '../types';

const classes = new Hono();

// Validation schemas
const createClassSchema = z.object({
  name: z.string().min(1),
  teacherId: z.string(),
  grade: z.string(),
  complexity: z.enum(['Starter', 'Core', 'Advanced']),
  storeEnabled: z.boolean().optional(),
  storeLocked: z.boolean().optional(),
  reflectionsRequired: z.boolean().optional(),
  surpriseEventsEnabled: z.boolean().optional(),
  autoSplitEnabled: z.boolean().optional(),
  autoSplitRatio: z.object({
    save: z.number(),
    spend: z.number(),
  }).optional(),
  minSavePercentage: z.number().min(0).max(100).optional(),
  cycleLengthDays: z.number().positive().optional(),
});

const updateClassSchema = createClassSchema.partial();

const joinClassSchema = z.object({
  studentId: z.string(),
  joinCode: z.string(),
});

// Generate a random join code (format: ABC-123)
function generateJoinCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const part1 = Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  const part2 = Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `${part1}-${part2}`;
}

// GET /api/classes - Get all classes (optionally filtered by teacherId)
classes.get('/', (c) => {
  const teacherId = c.req.query('teacherId');
  
  let classesList = Array.from(db.classes.values());
  
  if (teacherId) {
    classesList = classesList.filter(c => c.teacherId === teacherId);
  }
  
  // Enrich with student and teacher data
  const enrichedClasses = classesList.map(classData => ({
    ...classData,
    students: classData.studentIds
      .map(id => db.students.get(id))
      .filter(Boolean),
    teacher: db.teachers.get(classData.teacherId),
  }));
  
  return c.json({ classes: enrichedClasses });
});

// GET /api/classes/:id - Get a specific class
classes.get('/:id', (c) => {
  const id = c.req.param('id');
  const classData = db.classes.get(id);
  
  if (!classData) {
    return c.json({ error: 'Class not found' }, 404);
  }
  
  // Enrich with student and teacher data
  const enrichedClass = {
    ...classData,
    students: classData.studentIds
      .map(studentId => db.students.get(studentId))
      .filter(Boolean),
    teacher: db.teachers.get(classData.teacherId),
  };
  
  return c.json({ class: enrichedClass });
});

// POST /api/classes - Create a new class
classes.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const data = createClassSchema.parse(body);
    
    // Validate teacher exists
    const teacher = db.teachers.get(data.teacherId);
    if (!teacher) {
      return c.json({ error: 'Teacher not found' }, 404);
    }
    
    // Generate unique join code
    let joinCode = generateJoinCode();
    while (Array.from(db.classes.values()).some(c => c.joinCode === joinCode)) {
      joinCode = generateJoinCode();
    }
    
    const classData: Class = {
      id: `class-${Date.now()}`,
      name: data.name,
      teacherId: data.teacherId,
      grade: data.grade,
      complexity: data.complexity,
      joinCode,
      studentIds: [],
      storeEnabled: data.storeEnabled ?? true,
      storeLocked: data.storeLocked ?? false,
      reflectionsRequired: data.reflectionsRequired ?? false,
      surpriseEventsEnabled: data.surpriseEventsEnabled ?? false,
      autoSplitEnabled: data.autoSplitEnabled ?? false,
      autoSplitRatio: data.autoSplitRatio,
      minSavePercentage: data.minSavePercentage,
      cycleLengthDays: data.cycleLengthDays ?? 7,
      createdAt: new Date().toISOString(),
    };
    
    db.classes.set(classData.id, classData);
    
    // Add class to teacher's classes list
    teacher.classes.push(classData.id);
    db.teachers.set(data.teacherId, teacher);
    
    return c.json({ class: classData }, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Validation error', details: error.errors }, 400);
    }
    throw error;
  }
});

// PUT /api/classes/:id - Update class settings
classes.put('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const classData = db.classes.get(id);
    
    if (!classData) {
      return c.json({ error: 'Class not found' }, 404);
    }
    
    const body = await c.req.json();
    const updates = updateClassSchema.parse(body);
    
    // Update class
    Object.assign(classData, updates);
    db.classes.set(id, classData);
    
    return c.json({ class: classData });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Validation error', details: error.errors }, 400);
    }
    throw error;
  }
});

// POST /api/classes/:id/join - Join a class using join code
classes.post('/:id/join', async (c) => {
  try {
    const classId = c.req.param('id');
    const classData = db.classes.get(classId);
    
    if (!classData) {
      return c.json({ error: 'Class not found' }, 404);
    }
    
    const body = await c.req.json();
    const data = joinClassSchema.parse(body);
    
    // Validate join code
    if (classData.joinCode !== data.joinCode) {
      return c.json({ error: 'Invalid join code' }, 400);
    }
    
    // Validate student exists
    const student = db.students.get(data.studentId);
    if (!student) {
      return c.json({ error: 'Student not found' }, 404);
    }
    
    // Check if student is already in class
    if (classData.studentIds.includes(data.studentId)) {
      return c.json({ error: 'Student already in class' }, 400);
    }
    
    // Add student to class
    classData.studentIds.push(data.studentId);
    db.classes.set(classId, classData);
    
    // Update student's classId
    student.classId = classId;
    db.students.set(data.studentId, student);
    
    return c.json({ message: 'Student joined class successfully', class: classData });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Validation error', details: error.errors }, 400);
    }
    throw error;
  }
});

// GET /api/classes/join/:joinCode - Get class info by join code (for preview before joining)
classes.get('/join/:joinCode', (c) => {
  const joinCode = c.req.param('joinCode');
  const classData = Array.from(db.classes.values()).find(c => c.joinCode === joinCode);
  
  if (!classData) {
    return c.json({ error: 'Class not found' }, 404);
  }
  
  // Return minimal info (don't expose full student list)
  return c.json({
    class: {
      id: classData.id,
      name: classData.name,
      grade: classData.grade,
      complexity: classData.complexity,
      teacher: db.teachers.get(classData.teacherId)?.name,
    },
  });
});

// POST /api/classes/:id/regenerate-join-code - Regenerate join code
classes.post('/:id/regenerate-join-code', (c) => {
  const id = c.req.param('id');
  const classData = db.classes.get(id);
  
  if (!classData) {
    return c.json({ error: 'Class not found' }, 404);
  }
  
  // Generate new unique join code
  let joinCode = generateJoinCode();
  while (Array.from(db.classes.values()).some(c => c.joinCode === joinCode && c.id !== id)) {
    joinCode = generateJoinCode();
  }
  
  classData.joinCode = joinCode;
  db.classes.set(id, classData);
  
  return c.json({ class: classData });
});

export default classes;

