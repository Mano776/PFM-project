import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2, Edit2, Banknote } from 'lucide-react';
import { useToast, ConfirmModal } from '../components/Toast';
import { SkeletonRow } from '../components/Skeleton';
import PageWrapper from '../components/PageWrapper';

const Income = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [incomes, setIncomes] = useState<any[]>([]);
  const [formData, setFormData] = useState({ amount: '', source: '', date: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const fetchIncomes = async () => {
    if (!user) return;
    const res = await axios.get(`/api/income/${user.uid}`);
    setIncomes(res.data);
    setListLoading(false);
  };

  useEffect(() => {
    fetchIncomes();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (editingId) {
        await axios.put(`/api/income/${editingId}`, formData);
        setEditingId(null);
        showToast('Income updated!', 'success');
      } else {
        await axios.post('/api/income', { ...formData, userId: user?.uid });
        showToast('Income added!', 'success');
      }
      setFormData({ amount: '', source: '', date: '' });
      fetchIncomes();
    } catch (err: any) {
      console.error('Submit error:', err);
      const msg = err.response?.data?.error || err.message || 'An error occurred';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await axios.delete(`/api/income/${deleteTarget}`);
      showToast('Income entry deleted', 'warning');
      fetchIncomes();
    } catch {
      showToast('Failed to delete income', 'error');
    } finally {
      setDeleteTarget(null);
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
    <PageWrapper>
      <div className="space-y-8">
        <ConfirmModal
          isOpen={!!deleteTarget}
          message="Are you sure you want to delete this income entry? This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />

        {/* Page Header */}
        <div>
          <h2 className="text-[28px] sm:text-[36px] font-black text-[#14172c] dark:text-white tracking-tight mb-2">Income</h2>
          <p className="text-[#6b7280] dark:text-slate-400 font-medium text-[15px]">Track all your income sources.</p>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-[#1a1c2e] rounded-[2rem] p-6 sm:p-8 shadow-[0_4px_24px_rgb(0,0,0,0.02)] border border-transparent dark:border-[#2d304d] transition-colors">
          <h3 className="text-[18px] font-black text-[#14172c] dark:text-white mb-6">
            {editingId ? '✏️ Edit Income' : '+ Add New Income'}
          </h3>
          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-[12px] border border-red-100 italic text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <input
              type="number"
              placeholder="Amount (₹)"
              className="px-4 py-3.5 bg-[#f3f4f8] dark:bg-[#252841] border-none rounded-[12px] focus:ring-2 focus:ring-[#5542f6] outline-none text-[#14172c] dark:text-white font-medium placeholder:text-gray-400 dark:placeholder:text-slate-500 transition-colors"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Source (e.g. Salary)"
              className="px-4 py-3.5 bg-[#f3f4f8] dark:bg-[#252841] border-none rounded-[12px] focus:ring-2 focus:ring-[#5542f6] outline-none text-[#14172c] dark:text-white font-medium placeholder:text-gray-400 dark:placeholder:text-slate-500 transition-colors"
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              required
            />
            <input
              type="date"
              className="px-4 py-3.5 bg-[#f3f4f8] dark:bg-[#252841] border-none rounded-[12px] focus:ring-2 focus:ring-[#5542f6] outline-none text-[#14172c] dark:text-white font-medium transition-colors"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className={`sm:col-span-2 lg:col-span-3 text-white py-3.5 rounded-[14px] transition-colors flex items-center justify-center gap-2 font-bold text-[15px] shadow-lg ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#5542f6] hover:bg-[#4331d2] shadow-indigo-200/50'
              }`}
            >
              <Plus size={20} />
              <span>{loading ? 'Processing...' : editingId ? 'Update Income' : 'Add Income'}</span>
            </button>
          </form>
        </div>

        {/* Income List */}
        <div className="bg-white dark:bg-[#1a1c2e] rounded-[2rem] overflow-hidden shadow-[0_4px_24px_rgb(0,0,0,0.02)] border border-transparent dark:border-[#2d304d] transition-colors">
          {listLoading ? (
            <div className="p-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse flex gap-4 py-4 border-b border-gray-100 last:border-0">
                  <div className="h-4 bg-gray-200 rounded flex-1" />
                  <div className="h-4 bg-gray-200 rounded w-24" />
                  <div className="h-4 bg-gray-200 rounded w-24" />
                </div>
              ))}
            </div>
          ) : incomes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <div className="w-16 h-16 bg-green-50 text-green-400 rounded-[20px] flex items-center justify-center mb-4">
                <Banknote size={32} />
              </div>
              <h3 className="text-lg font-bold text-[#14172c] mb-1">No income recorded yet</h3>
              <p className="text-sm text-[#9ca3af]">Add your first income entry using the form above.</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#f9fafb] dark:bg-[#252841] border-b border-gray-100 dark:border-[#2d304d] transition-colors">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-[#9ca3af] dark:text-slate-500 uppercase tracking-wider">Source</th>
                      <th className="px-6 py-4 text-xs font-bold text-[#9ca3af] dark:text-slate-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-4 text-xs font-bold text-[#9ca3af] dark:text-slate-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-xs font-bold text-[#9ca3af] dark:text-slate-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-[#2d304d]">
                    {incomes.map((income) => (
                      <tr key={income.id} className="hover:bg-[#f9fafb] dark:hover:bg-[#252841] transition-colors border-b border-gray-100 dark:border-[#2d304d] last:border-0">
                        <td className="px-6 py-4 text-[#14172c] dark:text-slate-200 font-semibold">{income.source}</td>
                        <td className="px-6 py-4 text-[#10b981] font-black text-[16px]">₹{income.amount.toLocaleString()}</td>
                        <td className="px-6 py-4 text-[#9ca3af] dark:text-slate-500 font-medium">{income.date.split('T')[0]}</td>
                        <td className="px-6 py-4 text-right space-x-3">
                          <button onClick={() => startEdit(income)} className="text-[#5542f6] hover:text-[#4331d2] transition-colors">
                            <Edit2 size={18} />
                          </button>
                          <button onClick={() => setDeleteTarget(income.id)} className="text-red-500 hover:text-red-700 transition-colors">
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
                {incomes.map((income) => (
                  <div key={income.id} className="p-5 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-bold text-[#14172c]">{income.source}</p>
                      <p className="text-xs text-[#9ca3af] mt-0.5">{income.date.split('T')[0]}</p>
                    </div>
                    <div className="flex items-center gap-4 ml-auto">
                      <span className="text-[#10b981] font-black text-[17px]">₹{income.amount.toLocaleString()}</span>
                      <button onClick={() => startEdit(income)} className="text-[#5542f6]"><Edit2 size={17} /></button>
                      <button onClick={() => setDeleteTarget(income.id)} className="text-red-500"><Trash2 size={17} /></button>
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

export default Income;
