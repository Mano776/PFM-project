import express from 'express';
import { db } from '../firebaseConfig.ts';

const router = express.Router();

// Get all recurring transactions for a user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const snapshot = await db.collection('recurring').where('userId', '==', userId).get();
    const recurring = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(recurring);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Add recurring
router.post('/', async (req, res) => {
  try {
    const { userId, title, amount, type, frequency, startDate } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const docRef = await db.collection('recurring').add({
      userId,
      title,
      amount: parseFloat(amount),
      type, // 'income' or 'expense'
      frequency, // 'monthly', 'yearly', etc.
      startDate: startDate || new Date().toISOString(),
      createdAt: new Date().toISOString()
    });
    res.status(201).json({ id: docRef.id });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update recurring
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, amount, type, frequency, startDate } = req.body;
    await db.collection('recurring').doc(id).update({
      title,
      amount: parseFloat(amount),
      type,
      frequency,
      startDate
    });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete recurring
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('recurring').doc(id).delete();
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
