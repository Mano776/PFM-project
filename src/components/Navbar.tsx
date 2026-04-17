import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, ArrowUpCircle, ArrowDownCircle,
  PieChart, Wallet, LogOut, Settings, Target,
  RefreshCw, Activity, Moon, X,
} from 'lucide-react';

interface NavbarProps {
  onClose?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onClose }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  if (!user) return null;

  const navItems = [
    { path: '/', label: 'Overview', icon: LayoutDashboard },
    { path: '/income', label: 'Income', icon: ArrowUpCircle },
    { path: '/expenses', label: 'Expenses', icon: ArrowDownCircle },
    { path: '/budget', label: 'Budget', icon: Wallet },
    { path: '/goals', label: 'Goals', icon: Target },
    { path: '/recurring', label: 'Recurring', icon: RefreshCw },
    { path: '/activity', label: 'Activity', icon: Activity },
    { path: '/reports', label: 'Reports', icon: PieChart },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  const username = user.email ? user.email.split('@')[0] : 'user';

  return (
    <nav className="w-[280px] h-full flex flex-col bg-[#fdfdfd] border-r border-[#f0f0f0] relative">
      {/* Logo row */}
      <div className="p-6 sm:p-8 flex items-center justify-between flex-shrink-0">
        <h1 className="text-[26px] font-black tracking-tight" style={{ color: '#5542f6' }}>FinTrack</h1>
        <div className="flex items-center gap-2">
          <button className="text-[#5542f6] hover:text-indigo-800 transition-colors p-1">
            <Moon size={20} strokeWidth={2} />
          </button>
          {/* Close button — mobile only */}
          {onClose && (
            <button
              onClick={onClose}
              className="md:hidden text-[#9ca3af] hover:text-[#374151] transition-colors p-1"
            >
              <X size={22} strokeWidth={2} />
            </button>
          )}
        </div>
      </div>

      {/* Nav links */}
      <div className="flex-1 px-4 py-2 space-y-1 overflow-y-auto hide-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`flex items-center space-x-4 px-4 py-3 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'bg-[#eef2ff] text-[#5542f6] font-semibold'
                  : 'text-[#6b7280] hover:bg-gray-50 font-medium hover:text-[#374151]'
              }`}
            >
              <Icon
                size={21}
                className={isActive ? 'text-[#5542f6]' : 'text-[#9ca3af]'}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className="text-[15px]">{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Bottom: profile + sign out */}
      <div className="p-5 flex-shrink-0">
        <div className="bg-[#f4f2ff] rounded-[20px] p-4 mb-4 flex items-center space-x-3">
          <div className="w-11 h-11 rounded-full bg-[#5542f6] flex items-center justify-center text-white font-black text-lg shadow-md flex-shrink-0">
            {username[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-bold text-[#14172c] truncate">{username}</p>
            <p className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider mt-0.5">
              Premium Account
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-3 px-4 py-3 text-[#ef4444] hover:bg-[#fef2f2] rounded-2xl transition-all font-bold group"
        >
          <LogOut
            size={19}
            strokeWidth={2.5}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="text-[15px]">Sign Out</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
