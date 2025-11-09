/**
 * Teacher Routes
 * Handles all teacher-related API endpoints
 */

import { Hono } from 'hono';
import { z } from 'zod';
import { db } from '../db';
import type { Teacher, Class, TeacherStats } from '../types';

const teachers = new Hono();

// Validation schemas
const createTeacherSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

// GET /api/teachers - Get all teachers
teachers.get('/', (c) => {
  const teachersList = Array.from(db.teachers.values());
  return c.json({ teachers: teachersList });
});

// GET /api/teachers/:id - Get a specific teacher with classes
teachers.get('/:id', (c) => {
  const id = c.req.param('id');
  const teacher = db.teachers.get(id);
  
  if (!teacher) {
    return c.json({ error: 'Teacher not found' }, 404);
  }
  
  // Get teacher's classes with full details
  const classes = teacher.classes
    .map(classId => db.classes.get(classId))
    .filter((c): c is Class => c !== undefined);
  
  return c.json({ teacher: { ...teacher, classes } });
});

// POST /api/teachers - Create a new teacher
teachers.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const data = createTeacherSchema.parse(body);
    
    const teacher: Teacher = {
      id: `teacher-${Date.now()}`,
      name: data.name,
      email: data.email,
      classes: [],
      createdAt: new Date().toISOString(),
    };
    
    db.teachers.set(teacher.id, teacher);
    
    return c.json({ teacher }, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Validation error', details: error.errors }, 400);
    }
    throw error;
  }
});

// GET /api/teachers/:id/stats - Get teacher dashboard statistics
teachers.get('/:id/stats', (c) => {
  const id = c.req.param('id');
  const teacher = db.teachers.get(id);
  
  if (!teacher) {
    return c.json({ error: 'Teacher not found' }, 404);
  }
  
  // Get all classes for this teacher
  const classes = teacher.classes
    .map(classId => db.classes.get(classId))
    .filter((c): c is Class => c !== undefined);
  
  // Get all students in these classes
  const allStudentIds = classes.flatMap(c => c.studentIds);
  const students = allStudentIds
    .map(id => db.students.get(id))
    .filter(Boolean);
  
  // Count pending quest submissions
  const pendingReviews = Array.from(db.questSubmissions.values())
    .filter(sub => 
      sub.status === 'pending' && 
      allStudentIds.includes(sub.studentId)
    ).length;
  
  // Count completed quests this week
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const completedQuests = Array.from(db.transactions.values())
    .filter(t => 
      t.type === 'earn' && 
      t.questId &&
      allStudentIds.includes(t.studentId) &&
      new Date(t.createdAt) >= weekAgo
    ).length;
  
  // Calculate average completion rate
  const totalQuests = Array.from(db.quests.values())
    .filter(q => classes.some(c => q.classId === c.id || !q.classId))
    .length;
  
  const avgCompletion = totalQuests > 0 && students.length > 0
    ? Math.round((completedQuests / (students.length * totalQuests)) * 100)
    : 0;
  
  // Calculate concept mastery (simplified - based on quest types completed)
  const questSubmissions = Array.from(db.questSubmissions.values())
    .filter(sub => 
      allStudentIds.includes(sub.studentId) && 
      sub.status === 'approved'
    );
  
  const conceptCounts = {
    'Needs vs Wants': 0,
    'Budgeting': 0,
    'Comparison': 0,
    'Goal Setting': 0,
  };
  
  questSubmissions.forEach(sub => {
    const quest = db.quests.get(sub.questId);
    if (quest && conceptCounts.hasOwnProperty(quest.type)) {
      conceptCounts[quest.type as keyof typeof conceptCounts]++;
    }
  });
  
  const totalSubmissions = questSubmissions.length;
  const conceptMastery = {
    'Needs vs Wants': totalSubmissions > 0 
      ? Math.round((conceptCounts['Needs vs Wants'] / totalSubmissions) * 100)
      : 0,
    'Budgeting': totalSubmissions > 0
      ? Math.round((conceptCounts['Budgeting'] / totalSubmissions) * 100)
      : 0,
    'Comparison': totalSubmissions > 0
      ? Math.round((conceptCounts['Comparison'] / totalSubmissions) * 100)
      : 0,
    'Goal Setting': totalSubmissions > 0
      ? Math.round((conceptCounts['Goal Setting'] / totalSubmissions) * 100)
      : 0,
  };
  
  const stats: TeacherStats = {
    activeStudents: students.length,
    questsCompleted: completedQuests,
    pendingReviews,
    avgCompletion: avgCompletion,
    totalClasses: classes.length,
    conceptMastery,
  };
  
  return c.json({ stats });
});

// GET /api/teachers/:id/pending-submissions - Get all pending submissions for teacher's classes
teachers.get('/:id/pending-submissions', (c) => {
  const id = c.req.param('id');
  const teacher = db.teachers.get(id);
  
  if (!teacher) {
    return c.json({ error: 'Teacher not found' }, 404);
  }
  
  // Get all classes for this teacher
  const classes = teacher.classes
    .map(classId => db.classes.get(classId))
    .filter((c): c is Class => c !== undefined);
  
  // Get all students in these classes
  const allStudentIds = classes.flatMap(c => c.studentIds);
  
  // Get all pending submissions for students in these classes
  const submissions = Array.from(db.questSubmissions.values())
    .filter(sub => 
      sub.status === 'pending' && 
      allStudentIds.includes(sub.studentId)
    );
  
  // Enrich with student and quest data
  const enrichedSubmissions = submissions.map(sub => ({
    ...sub,
    student: db.students.get(sub.studentId),
    quest: db.quests.get(sub.questId),
  }));
  
  return c.json({ submissions: enrichedSubmissions });
});

// GET /api/teachers/:id/classes/:classId/progress - Get class progress heatmap
teachers.get('/:id/classes/:classId/progress', (c) => {
  const classId = c.req.param('classId');
  const classData = db.classes.get(classId);
  
  if (!classData) {
    return c.json({ error: 'Class not found' }, 404);
  }
  
  const students = classData.studentIds
    .map(id => db.students.get(id))
    .filter(Boolean);
  
  // Get all quest submissions for students in this class
  const submissions = Array.from(db.questSubmissions.values())
    .filter(sub => classData.studentIds.includes(sub.studentId));
  
  // Calculate progress by concept and student
  const progress = students.map(student => {
    const studentSubmissions = submissions.filter(s => s.studentId === student.id);
    const approved = studentSubmissions.filter(s => s.status === 'approved').length;
    const total = studentSubmissions.length;
    
    return {
      studentId: student.id,
      studentName: student.name,
      totalQuests: total,
      completedQuests: approved,
      completionRate: total > 0 ? Math.round((approved / total) * 100) : 0,
    };
  });
  
  return c.json({ progress });
});

export default teachers;

