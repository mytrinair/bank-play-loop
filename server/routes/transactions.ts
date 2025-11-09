/**
 * Transaction Routes
 * Handles transaction history and queries
 */

import { Hono } from 'hono';
import { db } from '../db';

const transactions = new Hono();

// GET /api/transactions - Get all transactions (optionally filtered by studentId, type, jar)
transactions.get('/', (c) => {
  const studentId = c.req.query('studentId');
  const type = c.req.query('type') as 'earn' | 'spend' | 'transfer' | undefined;
  const jar = c.req.query('jar') as 'save' | 'spend' | undefined;
  const cycleId = c.req.query('cycleId');
  
  let transactionsList = Array.from(db.transactions.values());
  
  // Apply filters
  if (studentId) {
    transactionsList = transactionsList.filter(t => t.studentId === studentId);
  }
  
  if (type) {
    transactionsList = transactionsList.filter(t => t.type === type);
  }
  
  if (jar) {
    transactionsList = transactionsList.filter(t => t.jar === jar);
  }
  
  if (cycleId) {
    transactionsList = transactionsList.filter(t => t.cycleId === cycleId);
  }
  
  // Sort by most recent first
  transactionsList.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  // Enrich with related data
  const enrichedTransactions = transactionsList.map(transaction => ({
    ...transaction,
    student: db.students.get(transaction.studentId),
    quest: transaction.questId ? db.quests.get(transaction.questId) : undefined,
    storeItem: transaction.storeItemId ? db.storeItems.get(transaction.storeItemId) : undefined,
  }));
  
  return c.json({ transactions: enrichedTransactions });
});

// GET /api/transactions/:id - Get a specific transaction
transactions.get('/:id', (c) => {
  const id = c.req.param('id');
  const transaction = db.transactions.get(id);
  
  if (!transaction) {
    return c.json({ error: 'Transaction not found' }, 404);
  }
  
  // Enrich with related data
  const enrichedTransaction = {
    ...transaction,
    student: db.students.get(transaction.studentId),
    quest: transaction.questId ? db.quests.get(transaction.questId) : undefined,
    storeItem: transaction.storeItemId ? db.storeItems.get(transaction.storeItemId) : undefined,
  };
  
  return c.json({ transaction: enrichedTransaction });
});

export default transactions;

