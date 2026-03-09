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
  try {
    const { userId, amount } = req.body;
    const snapshot = await db.collection('budgets').where('userId', '==', userId).limit(1).get();
    
    if (snapshot.empty) {
      const docRef = await db.collection('budgets').add({
        userId,
        amount: parseFloat(amount),
        updatedAt: new Date().toISOString()
      });
      return res.status(201).json({ id: docRef.id });
    } else {
      const docId = snapshot.docs[0].id;
      await db.collection('budgets').doc(docId).update({
        amount: parseFloat(amount),
        updatedAt: new Date().toISOString()
      });
      return res.json({ id: docId });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
