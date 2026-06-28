import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { LogOut, Bell, User, Menu, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ onToggleMobileSidebar }) {
  const { user, logout } = useAuth();
  const { sidebarExpanded, setSidebarExpanded } = useApp();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/70 backdrop-blur-md border-b border-slate-900/80 px-4 md:px-6 h-16 flex items-center justify-between">
      {/* Left side: Hamburger and Brand branding */}
      <div className="flex items-center gap-3">
        {/* Mobile menu icon */}
        <button
          id="btn-mobile-menu"
          onClick={onToggleMobileSidebar}
          className="md:hidden p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-900 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop Sidebar Collapse Toggle */}
        <button
          id="btn-desktop-toggle"
          onClick={() => setSidebarExpanded(!sidebarExpanded)}
          className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-900 transition-colors"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 cursor-pointer select-none"
          id="brand-header"
        >
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-500 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20">
            <Compass className="w-5 h-5 animate-pulse" />
          </div>
          <span className="text-base font-display font-bold bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
            Campus Event Hub
          </span>
        </div>
      </div>

      {/* Right side: Action icons, Notification Bell, Profile dropdown */}
      <div className="flex items-center gap-4">
        {/* Notification indicator */}
        <button
          id="btn-notifications"
          className="relative p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 transition-all duration-200"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-slate-950 animate-ping" />
        </button>

        {/* User profile dropdown trigger */}
        {user && (
          <div className="relative">
            <button
              id="btn-profile-dropdown"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-900/60 transition-all duration-200"
            >
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face'}
                alt={user.name}
                className="h-8 w-8 rounded-lg object-cover ring-2 ring-indigo-500/20"
              />
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-100">{user.name}</span>
                <span className="text-[10px] text-slate-500 font-medium">{user.major}</span>
              </div>
            </button>

            {dropdownOpen && (
              <>
                {/* Click overlay mask to close dropdown */}
                <div 
                  className="fixed inset-0 z-40 cursor-default" 
                  onClick={() => setDropdownOpen(false)} 
                />
                
                <div 
                  id="navbar-profile-menu"
                  className="absolute right-0 mt-2 w-52 bg-slate-900 border border-slate-800/80 rounded-xl shadow-2xl p-1.5 z-50 flex flex-col gap-0.5"
                >
                  <button
                    id="menu-btn-profile"
                    onClick={() => { setDropdownOpen(false); navigate('/profile/me'); }}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-slate-100 hover:bg-slate-800/60 rounded-lg transition-all"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    My Profile
                  </button>

                  <div className="h-px bg-slate-800/60 my-1 mx-1.5" />
                  <button
                    id="menu-btn-logout"
                    onClick={() => { setDropdownOpen(false); handleLogout(); }}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
