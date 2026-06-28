import React from 'react';
import Card from '../common/Card';

export default function StatCard({
  title,
  value,
  icon: Icon,
  variant = 'indigo', // indigo, emerald, violet, sky, amber, etc.
  description,
  trend, // e.g. { value: '12%', isPositive: true }
  id
}) {
  const safeId = id || `stat-card-${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

  const themeClasses = {
    indigo: {
      bg: 'bg-indigo-500/10',
      text: 'text-indigo-400',
      border: 'border-indigo-500/20'
    },
    emerald: {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      border: 'border-emerald-500/20'
    },
    violet: {
      bg: 'bg-violet-500/10',
      text: 'text-violet-400',
      border: 'border-violet-500/20'
    },
    sky: {
      bg: 'bg-sky-500/10',
      text: 'text-sky-400',
      border: 'border-sky-500/20'
    },
    amber: {
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      border: 'border-amber-500/20'
    }
  }[variant] || {
    bg: 'bg-slate-500/10',
    text: 'text-slate-400',
    border: 'border-slate-500/20'
  };

  return (
    <Card 
      id={safeId} 
      hover 
      className="p-5 flex flex-col justify-between h-full bg-slate-900/35 border-slate-800/80 hover:bg-slate-900/50 hover:border-slate-700/60 transition-all duration-300"
    >
      <div className="flex items-start justify-between w-full">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {title}
          </span>
          <span className="text-2xl md:text-3xl font-extrabold font-display text-white mt-1">
            {value}
          </span>
        </div>
        
        {Icon && (
          <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 border ${themeClasses.bg} ${themeClasses.text} ${themeClasses.border} shadow-inner`}>
            <Icon className="w-5 h-5 text-current" />
          </div>
        )}
      </div>

      {(trend || description) && (
        <div className="flex items-center gap-2 mt-4.5 pt-3 border-t border-slate-800/40 w-full text-xs font-semibold">
          {trend && (
            <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-lg text-[10px] ${
              trend.isPositive 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15' 
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/15'
            }`}>
              {trend.isPositive ? '↑' : '↓'} {trend.value}
            </span>
          )}
          {description && (
            <span className="text-slate-400 font-medium">
              {description}
            </span>
          )}
        </div>
      )}
    </Card>
  );
}
