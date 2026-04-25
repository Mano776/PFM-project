import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
import { Search, Bell, Menu, X } from 'lucide-react';

const Layout = () => {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#f4f7fe]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-[3px] border-[#5542f6] border-t-transparent rounded-full animate-spin" />
        <span className="text-[#9ca3af] font-medium text-sm">Loading...</span>
      </div>
    </div>
  );
  if (!user) return <Navigate to="/login" />;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#f4f7fe] dark:bg-[#050614] font-sans transition-colors duration-300">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — fixed on mobile, static on md+ */}
      <div className={`
        fixed top-0 left-0 h-full z-40 transition-transform duration-300 ease-in-out
        md:static md:translate-x-0 md:z-auto md:h-screen md:sticky md:top-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Navbar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen md:h-screen md:overflow-hidden">
        {/* Top Header */}
        <header className="px-4 sm:px-8 py-5 sm:py-8 flex items-center justify-between gap-4 flex-shrink-0">
          {/* Hamburger — mobile only */}
          <button
            className="md:hidden w-11 h-11 bg-white dark:bg-[#0f1129] rounded-[12px] flex items-center justify-center text-[#14172c] dark:text-white border border-gray-100 dark:border-white/5 shadow-sm flex-shrink-0"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={22} strokeWidth={2} />
          </button>

          {/* Search */}
          <div className="relative flex-1 max-w-xs sm:max-w-sm lg:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={17} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search transactions..."
              className="w-full pl-10 pr-4 py-3 sm:py-3.5 bg-white/70 dark:bg-white/10 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/50 text-sm placeholder-gray-400 dark:placeholder-slate-500 text-gray-700 dark:text-slate-200 outline-none backdrop-blur-md transition-all shadow-sm border border-transparent dark:border-white/5"
            />
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3 sm:gap-5 flex-shrink-0">
            {/* Avatar stack — hidden on very small screens */}
            <div className="hidden sm:flex -space-x-3 cursor-pointer">
              <img className="w-9 h-9 border-[3px] border-[#f4f7fe] rounded-full object-cover z-40" src="https://i.pravatar.cc/100?img=1" alt="Avatar 1" />
              <img className="w-9 h-9 border-[3px] border-[#f4f7fe] rounded-full object-cover z-30" src="https://i.pravatar.cc/100?img=5" alt="Avatar 2" />
              <img className="w-9 h-9 border-[3px] border-[#f4f7fe] rounded-full object-cover z-20" src="https://i.pravatar.cc/100?img=9" alt="Avatar 3" />
              <div className="w-9 h-9 border-[3px] border-[#f4f7fe] rounded-full bg-[#5542f6] flex items-center justify-center text-white text-[10px] font-bold z-10 shadow-sm">
                +12
              </div>
            </div>
            <button className="w-11 h-11 bg-white dark:bg-[#0f1129] rounded-full flex items-center justify-center text-[#14172c] dark:text-white hover:bg-gray-50 dark:hover:bg-[#15172b] border border-gray-100 dark:border-white/5 shadow-sm transition-all focus:outline-none relative">
              <Bell size={20} strokeWidth={1.8} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#5542f6] rounded-full" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 pb-8 hide-scrollbar">
          <div className="max-w-[1400px] mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
