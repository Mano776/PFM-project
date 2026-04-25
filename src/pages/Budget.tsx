import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Save, Wallet } from 'lucide-react';
import { useToast } from '../components/Toast';
import PageWrapper from '../components/PageWrapper';

const Budget = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [amount, setAmount] = useState('');
  const [currentBudget, setCurrentBudget] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBudget = async () => {
    if (!user) return;
    try {
      const [budgetRes, expenseRes] = await Promise.all([
        axios.get(`/api/budget/${user.uid}`),
        axios.get(`/api/expense/${user.uid}`),
      ]);
      setCurrentBudget(budgetRes.data.amount || 0);
      setAmount(budgetRes.data.amount?.toString() || '');
      const total = expenseRes.data.reduce((sum: number, e: any) => sum + e.amount, 0);
      setTotalExpenses(total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudget();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await axios.post('/api/budget', { userId: user?.uid, amount });
      await fetchBudget();
      showToast('Budget updated successfully!', 'success');
    } catch (err: any) {
      console.error('Budget update error:', err);
      const msg = err.response?.data?.error || err.message || 'Failed to update budget';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  const budgetUsage = currentBudget > 0 ? Math.min((totalExpenses / currentBudget) * 100, 100) : 0;
  const barColor =
    budgetUsage >= 80 ? 'bg-red-500' :
      budgetUsage >= 60 ? 'bg-amber-400' :
        'bg-green-500';

  if (loading) return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="animate-pulse bg-gray-200 rounded-3xl h-80" />
      </div>
    </PageWrapper>
  );

  return (
    <PageWrapper>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h2 className="text-[36px] font-black text-[#14172c] dark:text-white tracking-tight mb-2">Budget</h2>
          <p className="text-[#6b7280] dark:text-slate-400 font-medium text-[15px]">Set and track your monthly spending limit.</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-[#1a1c2e] rounded-[2rem] p-6 sm:p-8 shadow-[0_4px_24px_rgb(0,0,0,0.02)] text-center border border-transparent dark:border-[#2d304d] transition-colors">
            <div className="w-16 h-16 bg-[#eef2ff] dark:bg-indigo-500/10 text-[#5542f6] dark:text-indigo-400 rounded-[20px] flex items-center justify-center mx-auto mb-4">
              <Wallet size={32} />
            </div>
            <h2 className="text-2xl font-black text-[#14172c] dark:text-white mb-2">Monthly Budget</h2>
            <p className="text-[#9ca3af] dark:text-slate-500 mb-6 text-[15px]">Set your monthly spending limit to stay on track.</p>

            <div className="bg-[#5542f6] text-white p-6 rounded-[1.25rem] mb-6">
              <p className="text-indigo-200 text-xs font-bold uppercase tracking-wider mb-1">Current Budget</p>
              <p className="text-4xl font-black">₹{currentBudget.toLocaleString()}</p>
            </div>

            {/* Budget Progress Bar */}
            {currentBudget > 0 && (
              <div className="mb-6 text-left">
                <div className="flex justify-between text-sm font-medium text-gray-600 dark:text-slate-400 mb-2">
                  <span>Spent: ₹{totalExpenses.toLocaleString()}</span>
                  <span className={budgetUsage >= 80 ? 'text-red-600 font-bold' : ''}>{budgetUsage.toFixed(1)}% used</span>
                </div>
                <div className="w-full h-3 bg-gray-100 dark:bg-[#252841] rounded-full overflow-hidden transition-colors">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`}
                    style={{ width: `${budgetUsage}%` }}
                  />
                </div>
                {budgetUsage >= 80 && (
                  <p className="mt-2 text-xs text-red-500 font-medium">⚠ You're close to your budget limit!</p>
                )}
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-[12px] border border-red-100 italic text-sm text-left">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="text-left">
                <label className="block text-xs font-bold text-[#374151] dark:text-slate-500 mb-2 uppercase tracking-wider">New Budget Amount (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 50000"
                  className="w-full px-4 py-3.5 bg-[#f3f4f8] dark:bg-[#252841] border-none rounded-[12px] focus:ring-2 focus:ring-[#5542f6] outline-none text-[#14172c] dark:text-white font-medium text-[15px] placeholder:text-gray-400 dark:placeholder:text-slate-500 transition-colors"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className={`w-full text-white py-3.5 rounded-[14px] transition-colors flex items-center justify-center space-x-2 font-bold text-[15px] shadow-lg ${
                  saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#5542f6] hover:bg-[#4331d2] shadow-indigo-200/50'
                }`}
              >
                <Save size={20} />
                <span>{saving ? 'Saving...' : 'Save Budget'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Budget;
