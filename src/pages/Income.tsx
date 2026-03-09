import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2, Edit2 } from 'lucide-react';

const Income = () => {
  const { user } = useAuth();
  const [incomes, setIncomes] = useState<any[]>([]);
  const [formData, setFormData] = useState({ amount: '', source: '', date: '' });
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchIncomes = async () => {
    if (!user) return;
    const res = await axios.get(`/api/income/${user.uid}`);
    setIncomes(res.data);
  };

  useEffect(() => {
    fetchIncomes();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/api/income/${editingId}`, formData);
        setEditingId(null);
      } else {
        await axios.post('/api/income', { ...formData, userId: user?.uid });
      }
      setFormData({ amount: '', source: '', date: '' });
      fetchIncomes();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure?')) {
      await axios.delete(`/api/income/${id}`);
      fetchIncomes();
    }
  };

  const startEdit = (income: any) => {
    setEditingId(income.id);
    setFormData({
      amount: income.amount.toString(),
      source: income.source,
      date: income.date.split('T')[0]
    });
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          {editingId ? 'Edit Income' : 'Add New Income'}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="number"
            placeholder="Amount"
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Source (e.g. Salary)"
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            value={formData.source}
            onChange={(e) => setFormData({ ...formData, source: e.target.value })}
            required
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
            className="md:col-span-3 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Plus size={20} />
            <span>{editingId ? 'Update Income' : 'Add Income'}</span>
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Source</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {incomes.map((income) => (
              <tr key={income.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-gray-900 font-medium">{income.source}</td>
                <td className="px-6 py-4 text-green-600 font-bold">${income.amount.toLocaleString()}</td>
                <td className="px-6 py-4 text-gray-500">{income.date.split('T')[0]}</td>
                <td className="px-6 py-4 text-right space-x-3">
                  <button onClick={() => startEdit(income)} className="text-indigo-600 hover:text-indigo-800">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(income.id)} className="text-red-600 hover:text-red-800">
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

export default Income;
