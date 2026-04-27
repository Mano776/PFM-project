import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Target, Plus, Trash2, Edit2, TrendingUp } from 'lucide-react';
import { useToast, ConfirmModal } from '../components/Toast';
import { SkeletonCard } from '../components/Skeleton';
import PageWrapper from '../components/PageWrapper';

const Goals = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [goals, setGoals] = useState<any[]>([]);
  const [formData, setFormData] = useState({ title: '', targetAmount: '', currentAmount: '', deadline: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const fetchGoals = async () => {
    if (!user) return;
    try {
      const res = await axios.get(`/api/goals/${user.uid}`);
      setGoals(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Fetch goals error:', err);
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await axios.put(`/api/goals/${editingId}`, formData);
        setEditingId(null);
        showToast('Goal updated!', 'success');
      } else {
        await axios.post('/api/goals', { ...formData, userId: user?.uid });
        showToast('Goal added!', 'success');
      }
      setFormData({ title: '', targetAmount: '', currentAmount: '', deadline: '' });
      fetchGoals();
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to save goal', 'error');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await axios.delete(`/api/goals/${deleteTarget}`);
      showToast('Goal deleted', 'warning');
      fetchGoals();
    } catch {
      showToast('Failed to delete goal', 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  const startEdit = (goal: any) => {
    setEditingId(goal.id);
    setFormData({
      title: goal.title,
      targetAmount: goal.targetAmount.toString(),
      currentAmount: goal.currentAmount.toString(),
      deadline: goal.deadline ? goal.deadline.split('T')[0] : ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <PageWrapper>
      <div className="space-y-8">
        <ConfirmModal
          isOpen={!!deleteTarget}
          message="Are you sure you want to delete this goal?"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />

        <div>
          <h2 className="text-[28px] sm:text-[36px] font-black text-[#14172c] dark:text-white tracking-tight mb-2">Goals</h2>
          <p className="text-[#6b7280] dark:text-slate-400 font-medium text-[15px]">Track your financial milestones.</p>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-[#1a1c2e] rounded-[2rem] p-6 sm:p-8 shadow-[0_4px_24px_rgb(0,0,0,0.02)] border border-transparent dark:border-[#2d304d] transition-colors">
          <h3 className="text-[18px] font-black text-[#14172c] dark:text-white mb-6">
            {editingId ? '✏️ Edit Goal' : '+ Add New Goal'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Goal Title (e.g. New Car)"
              className="px-4 py-3.5 bg-[#f3f4f8] dark:bg-[#252841] border-none rounded-[12px] focus:ring-2 focus:ring-[#5542f6] outline-none text-[#14172c] dark:text-white font-medium transition-colors"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Target Amount (₹)"
              className="px-4 py-3.5 bg-[#f3f4f8] dark:bg-[#252841] border-none rounded-[12px] focus:ring-2 focus:ring-[#5542f6] outline-none text-[#14172c] dark:text-white font-medium transition-colors"
              value={formData.targetAmount}
              onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Current Savings (₹)"
              className="px-4 py-3.5 bg-[#f3f4f8] dark:bg-[#252841] border-none rounded-[12px] focus:ring-2 focus:ring-[#5542f6] outline-none text-[#14172c] dark:text-white font-medium transition-colors"
              value={formData.currentAmount}
              onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
              required
            />
            <input
              type="date"
              className="px-4 py-3.5 bg-[#f3f4f8] dark:bg-[#252841] border-none rounded-[12px] focus:ring-2 focus:ring-[#5542f6] outline-none text-[#14172c] dark:text-white font-medium transition-colors"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
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
              <span>{loading ? 'Processing...' : editingId ? 'Update Goal' : 'Add Goal'}</span>
            </button>
          </form>
        </div>

        {/* Goals List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listLoading ? (
            [...Array(3)].map((_, i) => <SkeletonCard key={i} className="h-64 rounded-[2rem]" />)
          ) : goals.length === 0 ? (
            <div className="col-span-full bg-white dark:bg-[#1a1c2e] rounded-[2rem] p-16 text-center border border-transparent dark:border-[#2d304d]">
              <div className="w-16 h-16 bg-[#eef2ff] dark:bg-indigo-500/10 text-[#5542f6] rounded-[20px] flex items-center justify-center mb-4 mx-auto">
                <Target size={32} />
              </div>
              <h3 className="text-lg font-bold text-[#14172c] dark:text-white mb-1">No goals yet</h3>
              <p className="text-sm text-[#9ca3af]">Start saving for your dreams!</p>
            </div>
          ) : (
            goals.map((goal) => {
              const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
              return (
                <div key={goal.id} className="bg-white dark:bg-[#1a1c2e] rounded-[2rem] p-6 shadow-[0_4px_24px_rgb(0,0,0,0.02)] border border-transparent dark:border-[#2d304d] transition-colors flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-[#eef2ff] dark:bg-indigo-500/10 rounded-xl text-[#5542f6]">
                        <TrendingUp size={20} />
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => startEdit(goal)} className="p-2 text-gray-400 hover:text-[#5542f6] transition-colors"><Edit2 size={16}/></button>
                        <button onClick={() => setDeleteTarget(goal.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                      </div>
                    </div>
                    <h4 className="text-lg font-black text-[#14172c] dark:text-white mb-1">{goal.title}</h4>
                    <p className="text-xs text-[#9ca3af] dark:text-slate-500 font-bold uppercase tracking-wider mb-6">Target: ₹{(Number(goal.targetAmount) || 0).toLocaleString()}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-bold">
                        <span className="text-[#14172c] dark:text-slate-200">₹{(Number(goal.currentAmount) || 0).toLocaleString()}</span>
                        <span className="text-[#5542f6]">{Math.round(progress)}%</span>
                      </div>
                      <div className="h-2.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#5542f6] rounded-full transition-all duration-1000"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-50 dark:border-white/5 flex justify-between items-center">
                    <span className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-widest">Deadline</span>
                    <span className="text-[13px] font-bold text-[#14172c] dark:text-slate-300">{goal.deadline ? goal.deadline.split('T')[0] : 'No date'}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default Goals;
