import express from 'express';
import PDFDocument from 'pdfkit';
import { db } from '../firebaseConfig.ts';

const router = express.Router();

router.get('/download/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch data
    const incomeSnapshot = await db.collection('income').where('userId', '==', userId).get();
    const expenseSnapshot = await db.collection('expenses').where('userId', '==', userId).get();

    const incomes = incomeSnapshot.docs.map(doc => doc.data());
    const expenses = expenseSnapshot.docs.map(doc => doc.data());

    const totalIncome = incomes.reduce((sum, item) => sum + (item.amount || 0), 0);
    const totalExpenses = expenses.reduce((sum, item) => sum + (item.amount || 0), 0);
    const balance = totalIncome - totalExpenses;

    // Create PDF
    const doc = new PDFDocument();
    let filename = `financial_report_${userId}.pdf`;
    
    res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
    res.setHeader('Content-type', 'application/pdf');

    doc.fontSize(25).text('Financial Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(16).text(`Total Income: $${totalIncome.toFixed(2)}`);
    doc.text(`Total Expenses: $${totalExpenses.toFixed(2)}`);
    doc.text(`Remaining Balance: $${balance.toFixed(2)}`);
    doc.moveDown();

    doc.fontSize(18).text('Expense List:', { underline: true });
    doc.moveDown();

    expenses.forEach((exp: any, index: number) => {
      doc.fontSize(12).text(`${index + 1}. ${exp.category}: $${exp.amount} - ${exp.description || 'No description'} (${exp.date.split('T')[0]})`);
    });

    doc.pipe(res);
    doc.end();

  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
