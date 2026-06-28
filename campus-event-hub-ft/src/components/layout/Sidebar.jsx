import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  UserSquare2, 
  Sparkles, 
  MessageSquare, 
  Search, 
  Compass,
  Bookmark,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function Sidebar({ mobileOpen, onCloseMobile }) {
  const { sidebarExpanded, setSidebarExpanded } = useApp();
  const { user } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Explore Events', path: '/events', icon: Calendar },
    { name: 'Registered Events', path: '/events/my-registrations', icon: Bookmark },
    { name: 'Explore Teams', path: '/teams', icon: Users },
    { name: 'My Teams', path: '/teams/my-teams', icon: UserSquare2 },
    { name: 'Skill Matching', path: '/teams/skill-match', icon: Sparkles },
    { name: 'Skill Search', path: '/search/skill-match', icon: Sparkles },
    { name: 'Student Search', path: '/search/users', icon: Search },
    { name: 'My Profile', path: '/profile/me', icon: Compass },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-950/90 backdrop-blur-md border-r border-slate-900/80">
      {/* Upper Brand Info for Mobile (Hidden on Desktop because of navbar) */}
      <div className="md:hidden flex items-center justify-between px-6 h-16 border-b border-slate-900/80">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
            CE
          </div>
          <span className="text-sm font-bold font-display text-white">Campus Event Hub</span>
        </div>
        <button
          id="btn-close-mobile-sidebar"
          onClick={onCloseMobile}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-100 hover:bg-slate-900"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation list */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1.5 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          
          return (
            <NavLink
              id={`nav-link-${item.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              key={item.name}
              to={item.path}
              onClick={() => {
                if (mobileOpen) onCloseMobile();
              }}
              className={({ isActive: linkActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group relative
                ${(isActive || linkActive)
                  ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/20'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60 border border-transparent'
                }
              `}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
              <span className={`transition-all duration-300 ${sidebarExpanded ? 'opacity-100 w-auto' : 'md:opacity-0 md:w-0 md:overflow-hidden'}`}>
                {item.name}
              </span>

              {/* Collapsed Tooltip */}
              {!sidebarExpanded && (
                <div className="hidden md:group-hover:flex absolute left-14 bg-slate-900 border border-slate-850 px-2.5 py-1.5 rounded-lg shadow-2xl text-xs font-semibold text-slate-100 whitespace-nowrap z-50">
                  {item.name}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Mini footer containing collapse controls */}
      <div className="hidden md:flex p-4 border-t border-slate-900/60 justify-center">
        <button
          id="btn-sidebar-collapse-trigger"
          onClick={() => setSidebarExpanded(!sidebarExpanded)}
          className="flex items-center justify-center p-2 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-slate-900 w-full border border-transparent hover:border-slate-800/80 transition-all"
        >
          {sidebarExpanded ? (
            <div className="flex items-center gap-2 text-xs font-semibold">
              <ChevronLeft className="w-4 h-4" />
              Collapse Sidebar
            </div>
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Drawer (Uses simple React conditional render rather than absolute CSS for speed) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop Mask */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={onCloseMobile} 
          />
          
          <div className="relative flex-1 flex flex-col max-w-xs w-full">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Desktop Persistent Sidebar */}
      <div 
        id="desktop-sidebar-wrapper"
        className={`hidden md:block transition-all duration-300 h-[calc(100vh-4rem)] sticky top-16 shrink-0
          ${sidebarExpanded ? 'w-64' : 'w-20'}
        `}
      >
        {sidebarContent}
      </div>
    </>
  );
}
