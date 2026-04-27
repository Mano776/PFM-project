import express from 'express';
import { db } from '../firebaseConfig.ts';

const router = express.Router();

// Get all goals for a user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const snapshot = await db.collection('goals').where('userId', '==', userId).get();
    const goals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(goals);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Add goal
router.post('/', async (req, res) => {
  try {
    const { userId, title, targetAmount, currentAmount, deadline } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const docRef = await db.collection('goals').add({
      userId,
      title,
      targetAmount: parseFloat(targetAmount),
      currentAmount: parseFloat(currentAmount),
      deadline: deadline || new Date().toISOString(),
      createdAt: new Date().toISOString()
    });
    res.status(201).json({ id: docRef.id });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update goal
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, targetAmount, currentAmount, deadline } = req.body;
    await db.collection('goals').doc(id).update({
      title,
      targetAmount: parseFloat(targetAmount),
      currentAmount: parseFloat(currentAmount),
      deadline
    });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete goal
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('goals').doc(id).delete();
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
