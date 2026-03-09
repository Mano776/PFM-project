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
import { TrendingUp, TrendingDown, Wallet, AlertTriangle, Download } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

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
  const budgetUsage = data.budget > 0 ? (data.totalExpenses / data.budget) * 100 : 0;
  const showWarning = budgetUsage >= 80;

  const barData = {
    labels: ['Income', 'Expenses'],
    datasets: [
      {
        label: 'Amount ($)',
        data: [data.totalIncome, data.totalExpenses],
        backgroundColor: ['rgba(79, 70, 229, 0.6)', 'rgba(239, 68, 68, 0.6)'],
      },
    ],
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
          '#4F46E5', '#EF4444', '#10B981', '#F59E0B', '#6366F1', '#EC4899'
        ],
      },
    ],
  };

  const handleDownload = () => {
    window.open(`/api/report/download/${user?.uid}`, '_blank');
  };

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Financial Overview</h2>
        <button
          onClick={handleDownload}
          className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Download size={20} />
          <span>Download PDF Report</span>
        </button>
      </div>

      {showWarning && (
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg flex items-center space-x-3">
          <AlertTriangle className="text-amber-400" />
          <p className="text-amber-700">
            <span className="font-bold">Budget Warning:</span> You have used {budgetUsage.toFixed(1)}% of your monthly budget!
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-50 rounded-lg text-green-600">
              <TrendingUp size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-500 font-medium">Total Income</p>
          <p className="text-2xl font-bold text-gray-900">${data.totalIncome.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-red-50 rounded-lg text-red-600">
              <TrendingDown size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-500 font-medium">Total Expenses</p>
          <p className="text-2xl font-bold text-gray-900">${data.totalExpenses.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
              <Wallet size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-500 font-medium">Remaining Balance</p>
          <p className="text-2xl font-bold text-gray-900">${balance.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Income vs Expenses</h3>
          <div className="h-64">
            <Bar data={barData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Expense by Category</h3>
          <div className="h-64">
            <Pie data={pieData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
