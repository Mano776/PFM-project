import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2, Edit2, Receipt } from 'lucide-react';
import { useToast, ConfirmModal } from '../components/Toast';
import { SkeletonRow } from '../components/Skeleton';
import PageWrapper from '../components/PageWrapper';

const CATEGORIES = ['Food', 'Rent', 'Transport', 'Shopping', 'Entertainment', 'Health', 'Utilities', 'Other'];

const Expenses = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [expenses, setExpenses] = useState<any[]>([]);
  const [formData, setFormData] = useState({ amount: '', category: 'Food', description: '', date: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const fetchExpenses = async () => {
    if (!user) return;
    const res = await axios.get(`/api/expense/${user.uid}`);
    setExpenses(res.data);
    setListLoading(false);
  };

  useEffect(() => {
    fetchExpenses();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (editingId) {
        await axios.put(`/api/expense/${editingId}`, formData);
        setEditingId(null);
        showToast('Expense updated!', 'success');
      } else {
        await axios.post('/api/expense', { ...formData, userId: user?.uid });
        showToast('Expense added!', 'success');
      }
      setFormData({ amount: '', category: 'Food', description: '', date: '' });
      fetchExpenses();
    } catch (err: any) {
      console.error('Expense submit error:', err);
      const msg = err.response?.data?.error || err.message || 'Failed to save expense';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await axios.delete(`/api/expense/${deleteTarget}`);
      showToast('Expense deleted', 'warning');
      fetchExpenses();
    } catch {
      showToast('Failed to delete expense', 'error');
    } finally {
      setDeleteTarget(null);
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
    <PageWrapper>
      <div className="space-y-8">
        <ConfirmModal
          isOpen={!!deleteTarget}
          message="Are you sure you want to delete this expense? This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />

        {/* Page Header */}
        <div>
          <h2 className="text-[36px] font-black text-[#14172c] tracking-tight mb-2">Expenses</h2>
          <p className="text-[#6b7280] font-medium text-[15px]">Track and manage your spending.</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-[0_4px_24px_rgb(0,0,0,0.02)]">
          <h3 className="text-[18px] font-black text-[#14172c] mb-6">
            {editingId ? '✏️ Edit Expense' : '+ Add New Expense'}
          </h3>
          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-[12px] border border-red-100 italic text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              type="number"
              placeholder="Amount (₹)"
              className="px-4 py-3.5 bg-[#f3f4f8] border-none rounded-[12px] focus:ring-2 focus:ring-[#5542f6] outline-none text-[#14172c] font-medium"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
            <select
              className="px-4 py-3.5 bg-[#f3f4f8] border-none rounded-[12px] focus:ring-2 focus:ring-[#5542f6] outline-none text-[#14172c] font-medium"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            >
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <input
              type="text"
              placeholder="Description (optional)"
              className="px-4 py-3.5 bg-[#f3f4f8] border-none rounded-[12px] focus:ring-2 focus:ring-[#5542f6] outline-none text-[#14172c] font-medium"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <input
              type="date"
              className="px-4 py-3.5 bg-[#f3f4f8] border-none rounded-[12px] focus:ring-2 focus:ring-[#5542f6] outline-none text-[#14172c] font-medium"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className={`sm:col-span-2 lg:col-span-4 text-white py-3.5 rounded-[14px] transition-colors flex items-center justify-center gap-2 font-bold text-[15px] shadow-lg ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#5542f6] hover:bg-[#4331d2] shadow-indigo-200/50'
              }`}
            >
              <Plus size={20} />
              <span>{loading ? 'Processing...' : editingId ? 'Update Expense' : 'Add Expense'}</span>
            </button>
          </form>
        </div>

        {/* Expense List */}
        <div className="bg-white rounded-[2rem] overflow-hidden shadow-[0_4px_24px_rgb(0,0,0,0.02)]">
          {listLoading ? (
            <div className="p-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse flex gap-4 py-4 border-b border-gray-100 last:border-0">
                  <div className="h-4 bg-gray-200 rounded w-20" />
                  <div className="h-4 bg-gray-200 rounded flex-1" />
                  <div className="h-4 bg-gray-200 rounded w-24" />
                </div>
              ))}
            </div>
          ) : expenses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <div className="w-16 h-16 bg-[#eef2ff] text-[#5542f6] rounded-[20px] flex items-center justify-center mb-4">
                <Receipt size={32} />
              </div>
              <h3 className="text-lg font-bold text-[#14172c] mb-1">No expenses yet</h3>
              <p className="text-sm text-[#9ca3af]">Add your first expense using the form above.</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#f9fafb] border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-[#9ca3af] uppercase tracking-wider">Category</th>
                      <th className="px-6 py-4 text-xs font-bold text-[#9ca3af] uppercase tracking-wider">Description</th>
                      <th className="px-6 py-4 text-xs font-bold text-[#9ca3af] uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-4 text-xs font-bold text-[#9ca3af] uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-xs font-bold text-[#9ca3af] uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {expenses.map((expense) => (
                      <tr key={expense.id} className="hover:bg-[#f9fafb] transition-colors">
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-[#eef2ff] text-[#5542f6] rounded-lg text-xs font-bold uppercase">
                            {expense.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[#14172c] font-medium">{expense.description || '-'}</td>
                        <td className="px-6 py-4 text-red-500 font-black text-[16px]">₹{expense.amount.toLocaleString()}</td>
                        <td className="px-6 py-4 text-[#9ca3af] font-medium">{expense.date.split('T')[0]}</td>
                        <td className="px-6 py-4 text-right space-x-3">
                          <button onClick={() => startEdit(expense)} className="text-[#5542f6] hover:text-[#4331d2] transition-colors">
                            <Edit2 size={18} />
                          </button>
                          <button onClick={() => setDeleteTarget(expense.id)} className="text-red-500 hover:text-red-700 transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Mobile Cards */}
              <div className="sm:hidden divide-y divide-gray-100">
                {expenses.map((expense) => (
                  <div key={expense.id} className="p-5 flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-[#eef2ff] text-[#5542f6] rounded-md text-[10px] font-bold uppercase">{expense.category}</span>
                      </div>
                      <p className="font-medium text-[#14172c] truncate">{expense.description || '—'}</p>
                      <p className="text-xs text-[#9ca3af] mt-0.5">{expense.date.split('T')[0]}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-red-500 font-black text-[17px] whitespace-nowrap">₹{expense.amount.toLocaleString()}</span>
                      <button onClick={() => startEdit(expense)} className="text-[#5542f6]"><Edit2 size={17} /></button>
                      <button onClick={() => setDeleteTarget(expense.id)} className="text-red-500"><Trash2 size={17} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default Expenses;
