/**
 * Store Routes
 * Handles store items and purchases
 */

import { Hono } from 'hono';
import { z } from 'zod';
import { db } from '../db';
import type { StoreItem, Purchase, Transaction, Activity } from '../types';

const store = new Hono();

// Validation schemas
const createStoreItemSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  cost: z.number().positive(),
  imageUrl: z.string().optional(),
  classId: z.string().optional(),
});

const purchaseItemSchema = z.object({
  studentId: z.string(),
});

// GET /api/store - Get all store items (optionally filtered by classId)
store.get('/', (c) => {
  const classId = c.req.query('classId');
  
  let items = Array.from(db.storeItems.values())
    .filter(item => item.isAvailable);
  
  if (classId) {
    items = items.filter(item => !item.classId || item.classId === classId);
  }
  
  return c.json({ items });
});

// GET /api/store/:id - Get a specific store item
store.get('/:id', (c) => {
  const id = c.req.param('id');
  const item = db.storeItems.get(id);
  
  if (!item) {
    return c.json({ error: 'Store item not found' }, 404);
  }
  
  return c.json({ item });
});

// POST /api/store - Create a new store item
store.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const data = createStoreItemSchema.parse(body);
    
    // Validate class exists if classId is provided
    if (data.classId && !db.classes.get(data.classId)) {
      return c.json({ error: 'Class not found' }, 404);
    }
    
    const item: StoreItem = {
      id: `item-${Date.now()}`,
      name: data.name,
      description: data.description,
      cost: data.cost,
      jar: 'spend', // Store items can only be bought with Spend jar
      imageUrl: data.imageUrl,
      isAvailable: true,
      classId: data.classId,
      createdAt: new Date().toISOString(),
    };
    
    db.storeItems.set(item.id, item);
    
    return c.json({ item }, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Validation error', details: error.errors }, 400);
    }
    throw error;
  }
});

// PUT /api/store/:id - Update a store item
store.put('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const item = db.storeItems.get(id);
    
    if (!item) {
      return c.json({ error: 'Store item not found' }, 404);
    }
    
    const body = await c.req.json();
    const updates = createStoreItemSchema.partial().parse(body);
    
    Object.assign(item, updates);
    db.storeItems.set(id, item);
    
    return c.json({ item });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Validation error', details: error.errors }, 400);
    }
    throw error;
  }
});

// POST /api/store/:id/purchase - Purchase a store item
store.post('/:id/purchase', async (c) => {
  try {
    const itemId = c.req.param('id');
    const item = db.storeItems.get(itemId);
    
    if (!item) {
      return c.json({ error: 'Store item not found' }, 404);
    }
    
    if (!item.isAvailable) {
      return c.json({ error: 'Item is not available' }, 400);
    }
    
    const body = await c.req.json();
    const data = purchaseItemSchema.parse(body);
    
    // Validate student exists
    const student = db.students.get(data.studentId);
    if (!student) {
      return c.json({ error: 'Student not found' }, 404);
    }
    
    // Get student's class to check store settings
    const classData = db.classes.get(student.classId);
    if (!classData) {
      return c.json({ error: 'Class not found' }, 404);
    }
    
    // Check if store is enabled
    if (!classData.storeEnabled) {
      return c.json({ error: 'Store is disabled for this class' }, 403);
    }
    
    // Check if store is locked
    if (classData.storeLocked) {
      // Check if student has met their goal (if they have one)
      if (student.currentGoal && !student.currentGoal.completedAt) {
        return c.json({ 
          error: 'Store is locked until you reach your goal',
          goal: student.currentGoal,
        }, 403);
      }
    }
    
    // Check if item is available for this class
    if (item.classId && item.classId !== student.classId) {
      return c.json({ error: 'Item is not available for your class' }, 403);
    }
    
    // Check if student has enough coins in Spend jar
    if (student.spendAmount < item.cost) {
      return c.json({ 
        error: 'Insufficient coins in Spend jar',
        required: item.cost,
        available: student.spendAmount,
      }, 400);
    }
    
    // Process purchase
    student.spendAmount -= item.cost;
    student.coins -= item.cost;
    db.students.set(data.studentId, student);
    
    // Create purchase record
    const purchase: Purchase = {
      id: `purchase-${Date.now()}`,
      studentId: data.studentId,
      storeItemId: itemId,
      cost: item.cost,
      createdAt: new Date().toISOString(),
    };
    
    db.purchases.set(purchase.id, purchase);
    
    // Create transaction record
    const transaction: Transaction = {
      id: `tx-${Date.now()}`,
      studentId: data.studentId,
      type: 'spend',
      amount: item.cost,
      jar: 'spend',
      description: `Purchased: ${item.name}`,
      storeItemId: itemId,
      createdAt: new Date().toISOString(),
    };
    
    db.transactions.set(transaction.id, transaction);
    
    // Create activity record
    const activity: Activity = {
      id: `activity-${Date.now()}`,
      studentId: data.studentId,
      type: 'purchase',
      description: `Purchased: ${item.name}`,
      coins: -item.cost,
      createdAt: new Date().toISOString(),
    };
    
    db.activities.set(activity.id, activity);
    
    return c.json({ 
      purchase, 
      transaction,
      student,
      message: `Purchased ${item.name}! Spend jar now has ${student.spendAmount} coins.`,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Validation error', details: error.errors }, 400);
    }
    throw error;
  }
});

// GET /api/store/purchases - Get purchases (optionally filtered by studentId)
store.get('/purchases', (c) => {
  const studentId = c.req.query('studentId');
  
  let purchases = Array.from(db.purchases.values());
  
  if (studentId) {
    purchases = purchases.filter(p => p.studentId === studentId);
  }
  
  // Enrich with item and student data
  const enrichedPurchases = purchases.map(purchase => ({
    ...purchase,
    item: db.storeItems.get(purchase.storeItemId),
    student: db.students.get(purchase.studentId),
  }));
  
  return c.json({ purchases: enrichedPurchases });
});

export default store;

