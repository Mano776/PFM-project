import React, { useEffect, useState } from 'react';
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
import { Download, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

// ── Rupee formatter ───────────────────────────────────────────────────────────
const inr = (n: number) =>
  '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const Reports = () => {
  const { user } = useAuth();
  const [data, setData] = useState({ income: [] as any[], expenses: [] as any[] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const [incomeRes, expenseRes] = await Promise.all([
          axios.get(`/api/income/${user.uid}`),
          axios.get(`/api/expense/${user.uid}`),
        ]);
        setData({ income: incomeRes.data, expenses: expenseRes.data });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  // ── Summary ─────────────────────────────────────────────────────────────────
  const totalIncome = data.income.reduce((s, i) => s + i.amount, 0);
  const totalExpenses = data.expenses.reduce((s, e) => s + e.amount, 0);
  const netBalance = totalIncome - totalExpenses;

  // ── Monthly grouped bar chart ───────────────────────────────────────────────
  const getMonthly = (items: any[]) => {
    const map: Record<string, number> = {};
    items.forEach(item => {
      const month = new Date(item.date).toLocaleString('default', { month: 'short', year: '2-digit' });
      map[month] = (map[month] || 0) + item.amount;
    });
    return map;
  };

  const monthlyIncome = getMonthly(data.income);
  const monthlyExpenses = getMonthly(data.expenses);
  const months = Array.from(new Set([...Object.keys(monthlyIncome), ...Object.keys(monthlyExpenses)]));

  const barData = {
    labels: months,
    datasets: [
      {
        label: 'Income',
        data: months.map(m => monthlyIncome[m] || 0),
        backgroundColor: 'rgba(16, 185, 129, 0.75)',
        borderRadius: 6,
        barThickness: 28,
      },
      {
        label: 'Expenses',
        data: months.map(m => monthlyExpenses[m] || 0),
        backgroundColor: 'rgba(239, 68, 68, 0.70)',
        borderRadius: 6,
        barThickness: 28,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#6b7280',
          font: { family: "'Inter', sans-serif", size: 12 },
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx: any) => ` ${ctx.dataset.label}: ${inr(ctx.parsed.y)}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: '#f3f4f6' },
        border: { display: false },
        ticks: {
          color: '#9ca3af',
          font: { family: "'Inter', sans-serif", size: 11 },
          callback: (v: any) => '₹' + Number(v).toLocaleString('en-IN'),
        },
      },
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: '#9ca3af', font: { family: "'Inter', sans-serif", size: 12 } },
      },
    },
  };

  // ── Category pie chart ──────────────────────────────────────────────────────
  const categoryMap: Record<string, number> = {};
  data.expenses.forEach(e => {
    categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
  });

  const pieData = {
    labels: Object.keys(categoryMap),
    datasets: [{
      data: Object.values(categoryMap),
      backgroundColor: ['#5542f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'],
      borderWidth: 0,
    }],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: '#6b7280',
          font: { family: "'Inter', sans-serif", size: 12 },
          padding: 18,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx: any) => ` ${ctx.label}: ${inr(ctx.parsed)}`,
        },
      },
    },
  };

  const handleDownload = () => {
    window.open(`/api/report/download/${user?.uid}`, '_blank');
  };

  if (loading) return (
    <PageWrapper>
      <div className="space-y-8">
        <div className="animate-pulse bg-gray-200 rounded-2xl h-10 w-56" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="animate-pulse bg-gray-200 rounded-[2rem] h-36" />)}
        </div>
        <div className="animate-pulse bg-gray-200 rounded-[2rem] h-[380px]" />
        <div className="animate-pulse bg-gray-200 rounded-[2rem] h-[380px]" />
      </div>
    </PageWrapper>
  );

  return (
    <PageWrapper>
      <div className="space-y-8 pb-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-[36px] font-black text-[#14172c] tracking-tight mb-2">Reports</h2>
            <p className="text-[#6b7280] font-medium text-[15px]">Detailed analytics of your finances.</p>
          </div>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 bg-[#5542f6] text-white px-6 py-3.5 rounded-2xl hover:bg-[#4331d2] transition-colors shadow-lg shadow-indigo-200/50 font-bold text-[15px] w-full sm:w-auto justify-center"
          >
            <Download size={20} strokeWidth={2.5} />
            <span>Download PDF Report</span>
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { label: 'Total Income', value: totalIncome, icon: <TrendingUp size={22} className="text-[#10b981]" strokeWidth={2.5} />, bg: 'bg-[#ecfdf5]', color: 'text-[#10b981]' },
            { label: 'Total Expenses', value: totalExpenses, icon: <TrendingDown size={22} className="text-[#ef4444]" strokeWidth={2.5} />, bg: 'bg-[#fef2f2]', color: 'text-[#ef4444]' },
            { label: 'Net Balance', value: netBalance, icon: <Wallet size={22} className="text-[#5542f6]" strokeWidth={2.5} />, bg: 'bg-[#eef2ff]', color: netBalance >= 0 ? 'text-[#5542f6]' : 'text-[#ef4444]' },
          ].map(card => (
            <div key={card.label} className="bg-white rounded-[2rem] p-6 shadow-[0_4px_24px_rgb(0,0,0,0.02)] flex flex-col gap-4">
              <div className={`w-11 h-11 rounded-[14px] flex items-center justify-center ${card.bg}`}>
                {card.icon}
              </div>
              <div>
                <p className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider mb-1">{card.label}</p>
                <p className={`text-2xl font-black ${card.color} tracking-tight`}>{inr(card.value)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Monthly Trends Bar Chart */}
        <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-[0_4px_24px_rgb(0,0,0,0.02)]">
          <h3 className="text-[19px] font-black text-[#14172c] mb-6">Monthly Trends</h3>
          <div className="h-72 sm:h-96">
            {months.length > 0
              ? <Bar data={barData} options={barOptions} />
              : <div className="h-full flex items-center justify-center text-[#9ca3af] text-sm font-medium">No data to display yet</div>
            }
          </div>
        </div>

        {/* Two column: category pie + top expenses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Category Pie */}
          <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-[0_4px_24px_rgb(0,0,0,0.02)]">
            <h3 className="text-[19px] font-black text-[#14172c] mb-6">Expense by Category</h3>
            <div className="h-72">
              {Object.keys(categoryMap).length > 0
                ? <Pie data={pieData} options={pieOptions} />
                : <div className="h-full flex items-center justify-center text-[#9ca3af] text-sm font-medium">No expense data yet</div>
              }
            </div>
          </div>

          {/* Top Expenses List */}
          <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-[0_4px_24px_rgb(0,0,0,0.02)]">
            <h3 className="text-[19px] font-black text-[#14172c] mb-6">Top Expenses</h3>
            {data.expenses.length === 0 ? (
              <div className="h-full flex items-center justify-center text-[#9ca3af] text-sm font-medium py-16">No expenses recorded yet</div>
            ) : (
              <div className="space-y-3">
                {[...data.expenses]
                  .sort((a, b) => b.amount - a.amount)
                  .slice(0, 6)
                  .map((exp, i) => (
                    <div key={exp.id || i} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[#eef2ff] flex items-center justify-center">
                          <span className="text-[11px] font-black text-[#5542f6]">#{i + 1}</span>
                        </div>
                        <div>
                          <p className="text-[14px] font-semibold text-[#14172c]">{exp.description || exp.category}</p>
                          <p className="text-[11px] text-[#9ca3af]">{exp.date?.split('T')[0]}</p>
                        </div>
                      </div>
                      <span className="text-red-500 font-black text-[15px]">{inr(exp.amount)}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Income Sources List */}
        <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-[0_4px_24px_rgb(0,0,0,0.02)]">
          <h3 className="text-[19px] font-black text-[#14172c] mb-6">Income Sources</h3>
          {data.income.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-[#9ca3af] text-sm font-medium">No income recorded yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#f9fafb] rounded-2xl">
                  <tr>
                    <th className="px-5 py-3.5 text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider rounded-l-2xl">Source</th>
                    <th className="px-5 py-3.5 text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider">Amount (₹)</th>
                    <th className="px-5 py-3.5 text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider rounded-r-2xl">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[...data.income]
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((inc, i) => (
                      <tr key={inc.id || i} className="hover:bg-[#f9fafb] transition-colors">
                        <td className="px-5 py-4 font-semibold text-[#14172c] text-[14px]">{inc.source}</td>
                        <td className="px-5 py-4 text-[#10b981] font-black text-[15px]">{inr(inc.amount)}</td>
                        <td className="px-5 py-4 text-[#9ca3af] font-medium text-[14px]">{inc.date?.split('T')[0]}</td>
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

export default Reports;
