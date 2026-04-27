import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { RefreshCw, Plus, Trash2, Edit2, Clock } from 'lucide-react';
import { useToast, ConfirmModal } from '../components/Toast';
import { SkeletonRow } from '../components/Skeleton';
import PageWrapper from '../components/PageWrapper';

const FREQUENCIES = ['Monthly', 'Weekly', 'Yearly', 'Daily'];
const TYPES = ['expense', 'income'];

const Recurring = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [recurring, setRecurring] = useState<any[]>([]);
  const [formData, setFormData] = useState({ title: '', amount: '', type: 'expense', frequency: 'Monthly', startDate: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const fetchRecurring = async () => {
    if (!user) return;
    try {
      const res = await axios.get(`/api/recurring/${user.uid}`);
      setRecurring(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Fetch recurring error:', err);
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    fetchRecurring();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await axios.put(`/api/recurring/${editingId}`, formData);
        setEditingId(null);
        showToast('Recurring updated!', 'success');
      } else {
        await axios.post('/api/recurring', { ...formData, userId: user?.uid });
        showToast('Recurring added!', 'success');
      }
      setFormData({ title: '', amount: '', type: 'expense', frequency: 'Monthly', startDate: '' });
      fetchRecurring();
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to save recurring', 'error');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await axios.delete(`/api/recurring/${deleteTarget}`);
      showToast('Recurring deleted', 'warning');
      fetchRecurring();
    } catch {
      showToast('Failed to delete recurring', 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  const startEdit = (item: any) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      amount: item.amount.toString(),
      type: item.type,
      frequency: item.frequency,
      startDate: item.startDate ? item.startDate.split('T')[0] : ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <PageWrapper>
      <div className="space-y-8">
        <ConfirmModal
          isOpen={!!deleteTarget}
          message="Are you sure you want to delete this recurring transaction?"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />

        <div>
          <h2 className="text-[28px] sm:text-[36px] font-black text-[#14172c] dark:text-white tracking-tight mb-2">Recurring</h2>
          <p className="text-[#6b7280] dark:text-slate-400 font-medium text-[15px]">Manage your subscriptions and regular payments.</p>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-[#1a1c2e] rounded-[2rem] p-6 sm:p-8 shadow-[0_4px_24px_rgb(0,0,0,0.02)] border border-transparent dark:border-[#2d304d] transition-colors">
          <h3 className="text-[18px] font-black text-[#14172c] dark:text-white mb-6">
            {editingId ? '✏️ Edit Recurring' : '+ Add New Recurring'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <input
              type="text"
              placeholder="Title (e.g. Netflix)"
              className="px-4 py-3.5 bg-[#f3f4f8] dark:bg-[#252841] border-none rounded-[12px] focus:ring-2 focus:ring-[#5542f6] outline-none text-[#14172c] dark:text-white font-medium transition-colors"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Amount (₹)"
              className="px-4 py-3.5 bg-[#f3f4f8] dark:bg-[#252841] border-none rounded-[12px] focus:ring-2 focus:ring-[#5542f6] outline-none text-[#14172c] dark:text-white font-medium transition-colors"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
            <select
              className="px-4 py-3.5 bg-[#f3f4f8] dark:bg-[#252841] border-none rounded-[12px] focus:ring-2 focus:ring-[#5542f6] outline-none text-[#14172c] dark:text-white font-medium transition-colors"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              required
            >
              {TYPES.map(t => <option key={t} value={t} className="bg-white dark:bg-[#1a1c2e] uppercase">{t}</option>)}
            </select>
            <select
              className="px-4 py-3.5 bg-[#f3f4f8] dark:bg-[#252841] border-none rounded-[12px] focus:ring-2 focus:ring-[#5542f6] outline-none text-[#14172c] dark:text-white font-medium transition-colors"
              value={formData.frequency}
              onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
              required
            >
              {FREQUENCIES.map(f => <option key={f} value={f} className="bg-white dark:bg-[#1a1c2e]">{f}</option>)}
            </select>
            <input
              type="date"
              className="px-4 py-3.5 bg-[#f3f4f8] dark:bg-[#252841] border-none rounded-[12px] focus:ring-2 focus:ring-[#5542f6] outline-none text-[#14172c] dark:text-white font-medium transition-colors"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className={`sm:col-span-2 lg:col-span-5 text-white py-3.5 rounded-[14px] transition-colors flex items-center justify-center gap-2 font-bold text-[15px] shadow-lg ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#5542f6] hover:bg-[#4331d2] shadow-indigo-200/50'
              }`}
            >
              <Plus size={20} />
              <span>{loading ? 'Processing...' : editingId ? 'Update Recurring' : 'Add Recurring'}</span>
            </button>
          </form>
        </div>

        {/* Recurring List */}
        <div className="bg-white dark:bg-[#1a1c2e] rounded-[2rem] overflow-hidden shadow-[0_4px_24px_rgb(0,0,0,0.02)] border border-transparent dark:border-[#2d304d] transition-colors">
          {listLoading ? (
            <div className="p-6 overflow-x-auto">
              <table className="w-full">
                <tbody>
                  {[...Array(4)].map((_, i) => <SkeletonRow key={i} />)}
                </tbody>
              </table>
            </div>
          ) : recurring.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <div className="w-16 h-16 bg-[#eef2ff] dark:bg-indigo-500/10 text-[#5542f6] rounded-[20px] flex items-center justify-center mb-4">
                <RefreshCw size={32} />
              </div>
              <h3 className="text-lg font-bold text-[#14172c] dark:text-white mb-1">No recurring items</h3>
              <p className="text-sm text-[#9ca3af]">Add your first subscription or regular payment.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#f9fafb] dark:bg-[#252841] border-b border-gray-100 dark:border-[#2d304d] transition-colors">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-[#9ca3af] dark:text-slate-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-4 text-xs font-bold text-[#9ca3af] dark:text-slate-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-xs font-bold text-[#9ca3af] dark:text-slate-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-4 text-xs font-bold text-[#9ca3af] dark:text-slate-500 uppercase tracking-wider">Frequency</th>
                    <th className="px-6 py-4 text-xs font-bold text-[#9ca3af] dark:text-slate-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-[#2d304d]">
                  {recurring.map((item) => (
                    <tr key={item.id} className="hover:bg-[#f9fafb] dark:hover:bg-[#252841] transition-colors">
                      <td className="px-6 py-4 font-bold text-[#14172c] dark:text-slate-200">{item.title}</td>
                      <td className={`px-6 py-4 font-black ${item.type === 'income' ? 'text-[#10b981]' : 'text-red-500'}`}>
                        ₹{(Number(item.amount) || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase ${
                          item.type === 'income' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                        }`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-[#6b7280] dark:text-slate-400 text-sm font-medium">
                          <Clock size={14} />
                          {item.frequency}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right space-x-3">
                        <button onClick={() => startEdit(item)} className="text-[#5542f6] hover:text-[#4331d2] transition-colors"><Edit2 size={18} /></button>
                        <button onClick={() => setDeleteTarget(item.id)} className="text-red-500 hover:text-red-700 transition-colors"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default Recurring;
