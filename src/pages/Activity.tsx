import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Activity as ActivityIcon, ArrowUpCircle, ArrowDownCircle, Search } from 'lucide-react';
import { SkeletonRow } from '../components/Skeleton';
import PageWrapper from '../components/PageWrapper';

const Activity = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchActivities = async () => {
      if (!user) return;
      try {
        const [incomeRes, expenseRes] = await Promise.all([
          axios.get(`/api/income/${user.uid}`),
          axios.get(`/api/expense/${user.uid}`),
        ]);

        const income = Array.isArray(incomeRes.data) ? incomeRes.data : [];
        const expense = Array.isArray(expenseRes.data) ? expenseRes.data : [];

        const combined = [
          ...income.map((item: any) => ({ ...item, type: 'income' })),
          ...expense.map((item: any) => ({ ...item, type: 'expense' })),
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        setActivities(combined);
      } catch (err) {
        console.error('Fetch activities error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, [user]);

  const filteredActivities = activities.filter(activity => 
    activity.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageWrapper>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-[28px] sm:text-[36px] font-black text-[#14172c] dark:text-white tracking-tight mb-2">Activity</h2>
            <p className="text-[#6b7280] dark:text-slate-400 font-medium text-[15px]">Your complete transaction history.</p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Search activity..."
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-[#1a1c2e] border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-[#5542f6] outline-none text-[#14172c] dark:text-white font-medium transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-[#1a1c2e] rounded-[2rem] overflow-hidden shadow-[0_4px_24px_rgb(0,0,0,0.02)] border border-transparent dark:border-[#2d304d] transition-colors">
          {loading ? (
            <div className="p-6 overflow-x-auto">
              <table className="w-full">
                <tbody>
                  {[...Array(6)].map((_, i) => <SkeletonRow key={i} />)}
                </tbody>
              </table>
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4">
              <div className="w-16 h-16 bg-[#eef2ff] dark:bg-indigo-500/10 text-[#5542f6] rounded-[20px] flex items-center justify-center mb-4">
                <ActivityIcon size={32} />
              </div>
              <h3 className="text-lg font-bold text-[#14172c] dark:text-white mb-1">No activity found</h3>
              <p className="text-sm text-[#9ca3af]">Try searching for something else or add some transactions.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#f9fafb] dark:bg-[#252841] border-b border-gray-100 dark:border-[#2d304d]">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-[#9ca3af] dark:text-slate-500 uppercase tracking-wider">Transaction</th>
                    <th className="px-6 py-4 text-xs font-bold text-[#9ca3af] dark:text-slate-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-xs font-bold text-[#9ca3af] dark:text-slate-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-xs font-bold text-[#9ca3af] dark:text-slate-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-[#2d304d]">
                  {filteredActivities.map((activity) => (
                    <tr key={activity.id} className="hover:bg-[#f9fafb] dark:hover:bg-[#252841] transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            activity.type === 'income' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                          }`}>
                            {activity.type === 'income' ? <ArrowUpCircle size={20} /> : <ArrowDownCircle size={20} />}
                          </div>
                          <div>
                            <p className="font-bold text-[#14172c] dark:text-slate-200">
                              {activity.type === 'income' ? activity.source : activity.description || 'Untitled Transaction'}
                            </p>
                            <p className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider">{activity.type}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="px-3 py-1 bg-gray-50 dark:bg-white/5 text-[#6b7280] dark:text-slate-400 rounded-lg text-xs font-bold uppercase">
                          {activity.type === 'income' ? 'INCOME' : activity.category}
                        </span>
                      </td>
                      <td className={`px-6 py-5 font-black text-[16px] ${
                        activity.type === 'income' ? 'text-[#10b981]' : 'text-red-500'
                      }`}>
                        {activity.type === 'income' ? '+' : '-'}₹{(Number(activity.amount) || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-5 text-[#9ca3af] dark:text-slate-500 font-medium">{activity.date ? activity.date.split('T')[0] : 'No date'}</td>
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

export default Activity;
