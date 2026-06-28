import React from 'react';
import Button from '../common/Button';
import { Plus, Users, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DashboardHeader({ user, onActionClick }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-gradient-to-r from-indigo-950/40 via-indigo-900/10 to-transparent p-6 md:p-8 rounded-3xl border border-indigo-500/10 shadow-2xl relative overflow-hidden">
      {/* Absolute abstract background accent */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-52 h-52 bg-indigo-500/8 rounded-full blur-3xl pointer-events-none" />
      
      <div className="flex items-start gap-4 md:gap-5">
        <div className="h-16 w-16 md:h-20 md:w-20 rounded-2xl overflow-hidden shrink-0 ring-4 ring-indigo-500/10 border border-indigo-500/20 shadow-xl bg-slate-900">
          <img 
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face'} 
            alt={user?.name}
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        
        <div className="text-left">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              ACTIVE STUDENT HUB
            </span>
            <span className="text-slate-500 text-xs">• Active Semester</span>
          </div>
          
          <h1 className="text-2xl md:text-3.5xl font-display font-extrabold tracking-tight text-white mt-1">
            Welcome back, {user?.name || 'Student'}!
          </h1>
          
          <p className="text-slate-400 text-sm mt-1 max-w-xl font-medium leading-relaxed">
            Coordinating events, projects, and matches for <span className="text-indigo-300 font-semibold">{user?.major || 'General Engineering'}</span>.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0 z-10">
        <Button 
          id="dash-header-btn-create"
          onClick={() => navigate('/events/create')}
          variant="primary"
          icon={Plus}
        >
          Create Event
        </Button>
        <Button 
          id="dash-header-btn-teams"
          onClick={() => navigate('/teams')}
          variant="secondary"
          icon={Users}
        >
          Browse Teams
        </Button>
      </div>
    </div>
  );
}
