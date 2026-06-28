import React from 'react';
import Card from '../common/Card';
import { Sparkles, Calendar, Search, Users, PlusCircle, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      id: 'qa-skill-match',
      title: 'Analyze Skill-Match',
      description: 'Run matching algorithm to find project mates on campus.',
      icon: Sparkles,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/15 hover:border-indigo-500/40',
      path: '/teams/skill-match'
    },
    {
      id: 'qa-event-browse',
      title: 'Explore All Events',
      description: 'Check active hackathons, workshops, and project seminars.',
      icon: Calendar,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/15 hover:border-emerald-500/40',
      path: '/events'
    },
    {
      id: 'qa-student-search',
      title: 'Student Directory',
      description: 'Search peers, filter by expertise, major, and interests.',
      icon: Search,
      color: 'text-sky-400 bg-sky-500/10 border-sky-500/15 hover:border-sky-500/40',
      path: '/search/users'
    },
    {
      id: 'qa-create-team',
      title: 'Assemble Team Squad',
      description: 'Form a custom collaborative crew for registered events.',
      icon: PlusCircle,
      color: 'text-violet-400 bg-violet-500/10 border-violet-500/15 hover:border-violet-500/40',
      path: '/teams/create'
    }
  ];

  return (
    <div className="flex flex-col gap-4 text-left">
      <div className="flex items-center gap-2 mb-1">
        <Compass className="w-5 h-5 text-indigo-400" />
        <h2 className="text-lg font-display font-bold text-white">Campus Quick Actions</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <Card
              key={act.id}
              id={act.id}
              hover
              onClick={() => navigate(act.path)}
              className="p-5 flex flex-col justify-between hover:bg-slate-900/60 transition-all cursor-pointer h-full border-slate-800/80 hover:border-slate-700/60"
            >
              <div className="flex items-start gap-4">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border ${act.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-200 hover:text-white transition-colors">
                    {act.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed font-medium">
                    {act.description}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
