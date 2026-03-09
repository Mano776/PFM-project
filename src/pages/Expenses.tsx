import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2, Edit2 } from 'lucide-react';

const CATEGORIES = ['Food', 'Rent', 'Transport', 'Shopping', 'Entertainment', 'Health', 'Utilities', 'Other'];

const Expenses = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<any[]>([]);
  const [formData, setFormData] = useState({ amount: '', category: 'Food', description: '', date: '' });
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchExpenses = async () => {
    if (!user) return;
    const res = await axios.get(`/api/expense/${user.uid}`);
    setExpenses(res.data);
  };

  useEffect(() => {
    fetchExpenses();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/api/expense/${editingId}`, formData);
        setEditingId(null);
      } else {
        await axios.post('/api/expense', { ...formData, userId: user?.uid });
      }
      setFormData({ amount: '', category: 'Food', description: '', date: '' });
      fetchExpenses();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure?')) {
      await axios.delete(`/api/expense/${id}`);
      fetchExpenses();
    }
  };

  const startEdit = (expense: any) => {
    setEditingId(expense.id);
    setFormData({
      amount: expense.amount.toString(),
      category: expense.category,
      description: expense.description || '',
      date: expense.date.split('T')[0]
    });
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          {editingId ? 'Edit Expense' : 'Add New Expense'}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="number"
            placeholder="Amount"
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            required
          />
          <select
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
          >
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <input
            type="text"
            placeholder="Description"
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <input
            type="date"
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
          <button
            type="submit"
            className="lg:col-span-4 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Plus size={20} />
            <span>{editingId ? 'Update Expense' : 'Add Expense'}</span>
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {expenses.map((expense) => (
              <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase">
                    {expense.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-900">{expense.description || '-'}</td>
                <td className="px-6 py-4 text-red-600 font-bold">${expense.amount.toLocaleString()}</td>
                <td className="px-6 py-4 text-gray-500">{expense.date.split('T')[0]}</td>
                <td className="px-6 py-4 text-right space-x-3">
                  <button onClick={() => startEdit(expense)} className="text-indigo-600 hover:text-indigo-800">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(expense.id)} className="text-red-600 hover:text-red-800">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Expenses;
