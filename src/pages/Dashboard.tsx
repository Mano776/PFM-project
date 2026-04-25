import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { TrendingUp, TrendingDown, Wallet, AlertTriangle, Download, Plus, Zap } from 'lucide-react';
import { DashboardSkeleton } from '../components/Skeleton';
import PageWrapper from '../components/PageWrapper';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Animated counter hook
function useCountUp(target: number, duration = 900) {
  const [value, setValue] = useState(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);

  return value;
}

const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: number;
  iconBgInfo: string;
}> = ({ icon, label, value, iconBgInfo }) => {
  const displayed = useCountUp(value);
  return (
    <div className="bg-white dark:bg-[#0c0d21] p-7 rounded-[2rem] shadow-[0_4px_24px_rgb(0,0,0,0.02)] flex flex-col justify-between hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all h-[200px] border border-transparent dark:border-white/5">
      <div className="mb-4">
        <div className={`w-12 h-12 flex items-center justify-center rounded-[14px] ${iconBgInfo} dark:bg-white/5 dark:border dark:border-white/5`}>
            {icon}
        </div>
      </div>
      <div>
          <p className="text-[12px] text-[#9ca3af] dark:text-slate-500 font-bold uppercase tracking-wider mb-2">{label}</p>
          <p className="text-3xl font-black text-[#14172c] dark:text-white tracking-tight">
             ₹{displayed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
      </div>
    </div>
  );
};

// ── Savings Card (own component so useCountUp hook is at top-level) ──────────
const SavingsCard: React.FC<{ potentialSavings: number }> = ({ potentialSavings }) => {
  const displayed = useCountUp(potentialSavings);
  return (
    <div className="bg-[#f4f2ff] dark:bg-[#5542f6]/5 rounded-[2rem] p-8 relative overflow-hidden flex flex-col justify-between border-[0.5px] border-indigo-100/30 dark:border-white/5 col-span-1 lg:col-span-1 min-h-[380px] transition-colors">
      <div>
        <div className="flex justify-between items-start mb-10">
          <div className="w-16 h-16 bg-[#5542f6] rounded-[20px] flex items-center justify-center text-white shadow-xl shadow-indigo-200/50">
            <Zap size={28} fill="currentColor" />
          </div>
          <span className="bg-[#e4dfff] text-[#5542f6] text-[11px] font-bold px-3.5 py-1.5 rounded-lg tracking-wider">
            SAVINGS TIP
          </span>
        </div>
        <div className="mt-6">
          <p className="text-[12px] font-bold text-[#6b7280] dark:text-indigo-300 uppercase tracking-wider mb-2">Potential Savings</p>
          <p className="text-[40px] font-black text-[#5542f6] dark:text-indigo-400 tracking-tight mb-3">
            ₹{displayed.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[14px] text-[#6b7280] dark:text-slate-400 font-medium leading-relaxed max-w-[200px]">
            Save your spare change to grow your money!
          </p>
        </div>
      </div>
      <button className="absolute bottom-8 right-8 w-16 h-16 bg-[#5542f6] rounded-full flex items-center justify-center text-white hover:bg-[#4331d2] transition-colors shadow-xl shadow-indigo-200/50 focus:outline-none focus:ring-4 focus:ring-indigo-100">
        <Plus size={28} strokeWidth={2.5} />
      </button>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    budget: 0,
    expenses: [] as any[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const [incomeRes, expenseRes, budgetRes] = await Promise.all([
          axios.get(`/api/income/${user.uid}`),
          axios.get(`/api/expense/${user.uid}`),
          axios.get(`/api/budget/${user.uid}`),
        ]);

        const totalIncome = incomeRes.data.reduce((sum: number, item: any) => sum + item.amount, 0);
        const totalExpenses = expenseRes.data.reduce((sum: number, item: any) => sum + item.amount, 0);

        setData({
          totalIncome,
          totalExpenses,
          budget: budgetRes.data.amount || 0,
          expenses: expenseRes.data,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const balance = data.totalIncome - data.totalExpenses;
  const monthlyBalance = balance; 

  const barData = {
    labels: ['Income', 'Expenses'],
    datasets: [
      {
        label: 'Amount (INR)',
        data: [data.totalIncome, data.totalExpenses],
        backgroundColor: ['rgba(139, 92, 246, 0.7)'], 
        borderRadius: 4,
        barThickness: 48,
      },
    ],
  };

  const barOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
          legend: {
              display: false,
          }
      },
      scales: {
          y: {
              beginAtZero: true,
              max: Math.max(data.totalIncome, data.totalExpenses) > 0 ? undefined : 1.0,
              grid: {
                  color: '#f3f4f6', 
              },
              border: {
                  display: false
              },
              ticks: {
                  color: '#9ca3af',
                  font: {
                      family: "'Inter', sans-serif",
                      size: 11
                  }
              }
          },
          x: {
              grid: {
                  display: false,
              },
              border: {
                  display: false
              },
              ticks: {
                  color: '#9ca3af',
                  font: {
                      family: "'Inter', sans-serif",
                      size: 12
                  }
              }
          }
      }
  };

  const categoryData: any = {};
  data.expenses.forEach((exp) => {
    categoryData[exp.category] = (categoryData[exp.category] || 0) + exp.amount;
  });

  const pieData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        data: Object.values(categoryData),
        backgroundColor: [
          '#5542f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'
        ],
        borderWidth: 0,
      },
    ],
  };
  
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'right' as const,
            labels: {
                color: '#6b7280',
                font: {
                    family: "'Inter', sans-serif",
                    size: 12,
                },
                padding: 20,
                usePointStyle: true,
                pointStyle: 'circle'
            }
        }
    }
  };

  const handleDownload = () => {
    window.open(`/api/report/download/${user?.uid}`, '_blank');
  };

  if (loading) return <PageWrapper><DashboardSkeleton /></PageWrapper>;

  return (
    <PageWrapper>
      <div className="space-y-10 font-sans pb-10">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-[36px] font-black text-[#14172c] dark:text-white tracking-tight mb-2">Finance Overview</h2>
            <p className="text-[#6b7280] dark:text-slate-400 font-medium text-[15px]">Your money at a glance.</p>
          </div>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 bg-[#5542f6] text-white px-7 py-3.5 rounded-2xl hover:bg-[#4331d2] transition-colors shadow-lg shadow-indigo-200/50 font-bold text-[15px]"
          >
            <Download size={20} strokeWidth={2.5}/>
            <span>Get Report</span>
          </button>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<TrendingUp size={24} className="text-[#10b981]" strokeWidth={2.5}/>}
            label="Total Income"
            value={data.totalIncome}
            iconBgInfo="bg-[#ecfdf5]"
          />
          <StatCard
            icon={<TrendingDown size={24} className="text-[#ef4444]" strokeWidth={2.5}/>}
            label="Total Expenses"
            value={data.totalExpenses}
            iconBgInfo="bg-[#fef2f2]"
          />
          <StatCard
            icon={<Wallet size={24} className="text-[#5542f6]" strokeWidth={2.5}/>}
            label="Total Balance"
            value={balance}
            iconBgInfo="bg-[#eef2ff]"
          />
          <StatCard
            icon={<Wallet size={24} className="text-[#a855f7]" strokeWidth={2.5}/>} 
            label="Monthly Balance"
            value={monthlyBalance}
            iconBgInfo="bg-[#faf5ff]"
          />
        </div>

        {/* Bottom Section: Savings Card + Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Potential Savings Card */}
            <SavingsCard potentialSavings={0} />

            {/* Income vs Expenses Chart */}
            <div className="bg-white dark:bg-[#0c0d21] rounded-[2rem] p-8 shadow-[0_4px_24px_rgb(0,0,0,0.02)] border border-transparent dark:border-white/5 col-span-1 lg:col-span-1 min-h-[380px] flex flex-col transition-colors">
                <h3 className="text-[19px] font-black text-[#14172c] dark:text-white mb-8">Income vs Expenses</h3>
                <div className="flex-1 w-full min-h-[220px]">
                    <Bar data={barData} options={barOptions} />
                </div>
                <div className="flex justify-center mt-6">
                     <div className="flex items-center gap-2">
                         <div className="w-10 h-3 bg-[#8b5cf6] rounded-sm opacity-70"></div>
                         <span className="text-[12px] font-bold text-[#9ca3af]">Amount (INR)</span>
                     </div>
                </div>
            </div>

            {/* Expense by Category Chart */}
            <div className="bg-white dark:bg-[#0c0d21] rounded-[2rem] p-8 shadow-[0_4px_24px_rgb(0,0,0,0.02)] border border-transparent dark:border-white/5 col-span-1 lg:col-span-1 min-h-[380px] relative flex flex-col transition-colors">
                <h3 className="text-[19px] font-black text-[#14172c] dark:text-white mb-6">Expense by Category</h3>
                <div className="flex-1 flex items-center justify-center">
                    {Object.keys(categoryData).length > 0 ? (
                        <div className="w-full min-h-[220px]">
                            <Pie data={pieData} options={pieOptions} />
                        </div>
                    ) : (
                        <p className="text-[#9ca3af] text-[15px] font-medium">No expense data yet</p>
                    )}
                </div>
                <button className="absolute bottom-8 right-8 w-16 h-16 bg-[#5542f6] rounded-full flex items-center justify-center text-white hover:bg-[#4331d2] transition-colors shadow-xl shadow-indigo-200/50 focus:outline-none focus:ring-4 focus:ring-indigo-100">
                    <Plus size={28} strokeWidth={2.5} />
                </button>
            </div>

        </div>
      </div>
    </PageWrapper>
  );
};

export default Dashboard;
