import React from 'react';
import PageWrapper from '../components/PageWrapper';
import { Target } from 'lucide-react';

const Goals = () => (
  <PageWrapper>
    <div className="space-y-8">
      <div>
        <h2 className="text-[36px] font-black text-[#14172c] dark:text-white tracking-tight mb-2">Goals</h2>
        <p className="text-[#6b7280] dark:text-slate-400 font-medium text-[15px]">Track your financial goals.</p>
      </div>
      <div className="bg-white dark:bg-[#1a1c2e] rounded-[2rem] p-16 shadow-[0_4px_24px_rgb(0,0,0,0.02)] border border-transparent dark:border-[#2d304d] flex flex-col items-center justify-center text-center transition-colors">
        <div className="w-20 h-20 bg-[#eef2ff] dark:bg-indigo-500/10 rounded-[20px] flex items-center justify-center mb-6">
          <Target size={36} className="text-[#5542f6] dark:text-indigo-400" strokeWidth={2} />
        </div>
        <h3 className="text-xl font-black text-[#14172c] dark:text-white mb-3">No goals yet</h3>
        <p className="text-[#9ca3af] dark:text-slate-500 font-medium max-w-xs">Set your first financial goal and start tracking your progress.</p>
        <button className="mt-8 bg-[#5542f6] text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-[#4331d2] transition-colors shadow-lg shadow-indigo-200/50">
          + Add Goal
        </button>
      </div>
    </div>
  </PageWrapper>
);

export default Goals;
