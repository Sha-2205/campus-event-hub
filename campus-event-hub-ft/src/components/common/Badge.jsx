import React from 'react';

export default function Badge({
  children,
  variant = 'indigo', // indigo, emerald, rose, amber, slate, sky, violet
  id,
  className = '',
}) {
  const safeId = id || `badge-${(typeof children === 'string' ? children : 'tag').toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

  const styles = {
    indigo: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/15',
    emerald: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15',
    rose: 'bg-rose-500/10 text-rose-400 border border-rose-500/15',
    amber: 'bg-amber-500/10 text-amber-400 border border-amber-500/15',
    slate: 'bg-slate-800/80 text-slate-300 border border-slate-700/50',
    sky: 'bg-sky-500/10 text-sky-400 border border-sky-500/15',
    violet: 'bg-violet-500/10 text-violet-400 border border-violet-500/15',
  };

  return (
    <span
      id={safeId}
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold select-none ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
