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
  console.log('Backend: Received request to add expense:', req.body);
  try {
    const { userId, amount, category, description, date } = req.body;
    
    if (!userId) {
      console.error('Backend: Missing userId in request');
      return res.status(400).json({ error: 'User ID is required' });
    }

    console.log('Backend: Attempting to add expense to Firestore...');
    const docRef = await db.collection('expenses').add({
      userId,
      amount: parseFloat(amount),
      category,
      description,
      date: date || new Date().toISOString(),
      createdAt: new Date().toISOString()
    });
    console.log('Backend: Successfully added expense document with ID:', docRef.id);
    res.status(201).json({ id: docRef.id });
  } catch (error: any) {
    console.error('Backend Error adding expense:', error.message);
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
