import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
import { Menu, X } from 'lucide-react';

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

          {/* Right actions */}
          <div className="flex items-center gap-3 sm:gap-5 flex-shrink-0 ml-auto">
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
