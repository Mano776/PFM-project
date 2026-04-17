import express from 'express';
import { db } from '../firebaseConfig.ts';

const router = express.Router();

// Get budget for a user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const snapshot = await db.collection('budgets').where('userId', '==', userId).limit(1).get();
    if (snapshot.empty) {
      return res.json({ amount: 0 });
    }
    res.json({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Set or update budget
router.post('/', async (req, res) => {
  console.log('Backend: Received request to set budget:', req.body);
  try {
    const { userId, amount } = req.body;
    
    if (!userId) {
      console.error('Backend: Missing userId in budget request');
      return res.status(400).json({ error: 'User ID is required' });
    }

    console.log('Backend: Checking for existing budget for user:', userId);
    const snapshot = await db.collection('budgets').where('userId', '==', userId).limit(1).get();
    
    if (snapshot.empty) {
      console.log('Backend: Creating new budget document...');
      const docRef = await db.collection('budgets').add({
        userId,
        amount: parseFloat(amount),
        updatedAt: new Date().toISOString()
      });
      console.log('Backend: Successfully created budget with ID:', docRef.id);
      return res.status(201).json({ id: docRef.id });
    } else {
      const docId = snapshot.docs[0].id;
      console.log('Backend: Updating existing budget with ID:', docId);
      await db.collection('budgets').doc(docId).update({
        amount: parseFloat(amount),
        updatedAt: new Date().toISOString()
      });
      console.log('Backend: Successfully updated budget');
      return res.json({ id: docId });
    }
  } catch (error: any) {
    console.error('Backend Error setting budget:', error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
