import express from 'express';
import { db } from '../firebaseConfig.ts';

const router = express.Router();

// Get all income for a user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const snapshot = await db.collection('income').where('userId', '==', userId).get();
    const income = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(income);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Add income
router.post('/', async (req, res) => {
  console.log('Backend: Received request to add income:', req.body);
  try {
    const { userId, amount, source, date } = req.body;
    
    if (!userId) {
      console.error('Backend: Missing userId in request');
      return res.status(400).json({ error: 'User ID is required' });
    }

    console.log('Backend: Attempting to add to Firestore...');
    const docRef = await db.collection('income').add({
      userId,
      amount: parseFloat(amount),
      source,
      date: date || new Date().toISOString(),
      createdAt: new Date().toISOString()
    });
    console.log('Backend: Successfully added document with ID:', docRef.id);
    res.status(201).json({ id: docRef.id });
  } catch (error: any) {
    console.error('Backend Error adding income:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Update income
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, source, date } = req.body;
    await db.collection('income').doc(id).update({
      amount: parseFloat(amount),
      source,
      date
    });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete income
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('income').doc(id).delete();
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
