import express from 'express';
import { db } from '../firebaseConfig.ts';

const router = express.Router();

// Get all expenses for a user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const snapshot = await db.collection('expenses').where('userId', '==', userId).get();
    const expenses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(expenses);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Add expense
router.post('/', async (req, res) => {
  try {
    const { userId, amount, category, description, date } = req.body;
    const docRef = await db.collection('expenses').add({
      userId,
      amount: parseFloat(amount),
      category,
      description,
      date: date || new Date().toISOString(),
      createdAt: new Date().toISOString()
    });
    res.status(201).json({ id: docRef.id });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update expense
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, category, description, date } = req.body;
    await db.collection('expenses').doc(id).update({
      amount: parseFloat(amount),
      category,
      description,
      date
    });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete expense
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('expenses').doc(id).delete();
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
