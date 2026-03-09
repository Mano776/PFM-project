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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Reports = () => {
  const { user } = useAuth();
  const [data, setData] = useState({
    income: [] as any[],
    expenses: [] as any[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const [incomeRes, expenseRes] = await Promise.all([
          axios.get(`/api/income/${user.uid}`),
          axios.get(`/api/expense/${user.uid}`),
        ]);
        setData({
          income: incomeRes.data,
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

  // Monthly grouping
  const getMonthlyData = (items: any[]) => {
    const monthly: any = {};
    items.forEach(item => {
      const month = new Date(item.date).toLocaleString('default', { month: 'short' });
      monthly[month] = (monthly[month] || 0) + item.amount;
    });
    return monthly;
  };

  const monthlyIncome = getMonthlyData(data.income);
  const monthlyExpenses = getMonthlyData(data.expenses);
  const months = Array.from(new Set([...Object.keys(monthlyIncome), ...Object.keys(monthlyExpenses)]));

  const barData = {
    labels: months,
    datasets: [
      {
        label: 'Income',
        data: months.map(m => monthlyIncome[m] || 0),
        backgroundColor: 'rgba(79, 70, 229, 0.6)',
      },
      {
        label: 'Expenses',
        data: months.map(m => monthlyExpenses[m] || 0),
        backgroundColor: 'rgba(239, 68, 68, 0.6)',
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

  if (loading) return <div>Loading reports...</div>;

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-900">Detailed Analytics</h2>
      
      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Monthly Trends</h3>
          <div className="h-96">
            <Bar data={barData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Expense Distribution by Category</h3>
          <div className="h-96 flex justify-center">
            <div className="w-full max-w-md">
              <Pie data={pieData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
