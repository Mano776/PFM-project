import React from 'react';
import PageWrapper from '../components/PageWrapper';
import { RefreshCw } from 'lucide-react';

const Recurring = () => (
  <PageWrapper>
    <div className="space-y-8">
      <div>
        <h2 className="text-[36px] font-black text-[#14172c] tracking-tight mb-2">Recurring</h2>
        <p className="text-[#6b7280] font-medium text-[15px]">Manage your recurring transactions.</p>
      </div>
      <div className="bg-white rounded-[2rem] p-16 shadow-[0_4px_24px_rgb(0,0,0,0.02)] flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-[#eef2ff] rounded-[20px] flex items-center justify-center mb-6">
          <RefreshCw size={36} className="text-[#5542f6]" strokeWidth={2} />
        </div>
        <h3 className="text-xl font-black text-[#14172c] mb-3">No recurring transactions</h3>
        <p className="text-[#9ca3af] font-medium max-w-xs">Add subscriptions, bills, and other recurring payments to stay on top of them.</p>
        <button className="mt-8 bg-[#5542f6] text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-[#4331d2] transition-colors shadow-lg shadow-indigo-200/50">
          + Add Recurring
        </button>
      </div>
    </div>
  </PageWrapper>
);

export default Recurring;
