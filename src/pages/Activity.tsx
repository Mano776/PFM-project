import React from 'react';
import PageWrapper from '../components/PageWrapper';
import { Activity as ActivityIcon } from 'lucide-react';

const Activity = () => (
  <PageWrapper>
    <div className="space-y-8">
      <div>
        <h2 className="text-[36px] font-black text-[#14172c] tracking-tight mb-2">Activity</h2>
        <p className="text-[#6b7280] font-medium text-[15px]">Your recent financial activity.</p>
      </div>
      <div className="bg-white rounded-[2rem] p-16 shadow-[0_4px_24px_rgb(0,0,0,0.02)] flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-[#eef2ff] rounded-[20px] flex items-center justify-center mb-6">
          <ActivityIcon size={36} className="text-[#5542f6]" strokeWidth={2} />
        </div>
        <h3 className="text-xl font-black text-[#14172c] mb-3">No recent activity</h3>
        <p className="text-[#9ca3af] font-medium max-w-xs">Your transaction history will appear here once you start adding income and expenses.</p>
      </div>
    </div>
  </PageWrapper>
);

export default Activity;
