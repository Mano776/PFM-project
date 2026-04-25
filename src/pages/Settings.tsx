import React from 'react';
import { useAuth } from '../context/AuthContext';
import PageWrapper from '../components/PageWrapper';
import { Settings as SettingsIcon, User, Bell, Shield, Palette } from 'lucide-react';

const SettingsSection: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="bg-white dark:bg-[#1a1c2e] rounded-[1.5rem] p-6 shadow-[0_4px_24px_rgb(0,0,0,0.02)] flex items-center gap-5 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all cursor-pointer group border border-transparent dark:border-[#2d304d]">
    <div className="w-12 h-12 bg-[#eef2ff] dark:bg-indigo-500/10 rounded-[14px] flex items-center justify-center flex-shrink-0 group-hover:bg-[#5542f6] transition-colors">
      <span className="text-[#5542f6] dark:text-indigo-400 group-hover:text-white transition-colors">{icon}</span>
    </div>
    <div className="flex-1">
      <p className="font-bold text-[#14172c] dark:text-white text-[15px]">{title}</p>
      <p className="text-[#9ca3af] dark:text-slate-500 text-[13px] mt-0.5">{description}</p>
    </div>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" className="dark:stroke-slate-600" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
  </div>
);

const Settings = () => {
  const { user } = useAuth();
  const username = user?.email?.split('@')[0] ?? 'user';

  return (
    <PageWrapper>
      <div className="space-y-8">
        <div>
          <h2 className="text-[36px] font-black text-[#14172c] dark:text-white tracking-tight mb-2">Settings</h2>
          <p className="text-[#6b7280] dark:text-slate-400 font-medium text-[15px]">Manage your account preferences.</p>
        </div>

        {/* Profile Card */}
        <div className="bg-[#f4f2ff] dark:bg-[#252841] rounded-[2rem] p-8 flex items-center gap-6 border border-transparent dark:border-[#2d304d] transition-colors">
          <div className="w-20 h-20 rounded-full bg-[#5542f6] flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-indigo-200/50">
            {username[0].toUpperCase()}
          </div>
          <div>
            <h3 className="text-[22px] font-black text-[#14172c] dark:text-white">{username}</h3>
            <p className="text-[#6b7280] dark:text-slate-400 font-medium mt-1">{user?.email}</p>
            <span className="inline-block mt-2 bg-[#5542f6] text-white text-[11px] font-bold px-3 py-1 rounded-lg tracking-wider">PREMIUM ACCOUNT</span>
          </div>
        </div>

        {/* Settings Options */}
        <div className="space-y-3">
          <SettingsSection icon={<User size={22} strokeWidth={2}/>} title="Profile" description="Update your personal information" />
          <SettingsSection icon={<Bell size={22} strokeWidth={2}/>} title="Notifications" description="Manage alerts and reminders" />
          <SettingsSection icon={<Shield size={22} strokeWidth={2}/>} title="Security" description="Password, 2FA, and account security" />
          <SettingsSection icon={<Palette size={22} strokeWidth={2}/>} title="Appearance" description="Theme, language, and display settings" />
        </div>
      </div>
    </PageWrapper>
  );
};

export default Settings;
