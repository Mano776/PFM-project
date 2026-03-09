import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Save, Wallet } from 'lucide-react';

const Budget = () => {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [currentBudget, setCurrentBudget] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchBudget = async () => {
    if (!user) return;
    try {
      const res = await axios.get(`/api/budget/${user.uid}`);
      setCurrentBudget(res.data.amount || 0);
      setAmount(res.data.amount?.toString() || '');
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
    try {
      await axios.post('/api/budget', { userId: user?.uid, amount });
      fetchBudget();
      alert('Budget updated successfully!');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center">
        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Wallet size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Monthly Budget</h2>
        <p className="text-gray-500 mb-6">Set your monthly spending limit to stay on track.</p>
        
        <div className="bg-indigo-600 text-white p-6 rounded-xl mb-8">
          <p className="text-indigo-100 text-sm font-medium uppercase tracking-wider">Current Budget</p>
          <p className="text-4xl font-bold">${currentBudget.toLocaleString()}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700 mb-1">New Budget Amount</label>
            <input
              type="number"
              placeholder="Enter amount"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2 font-bold"
          >
            <Save size={20} />
            <span>Save Budget</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Budget;
