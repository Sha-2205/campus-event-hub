import React from 'react';

export default function Card({
  children,
  className = '',
  id,
  hover = false,
  onClick,
}) {
  const safeId = id || `card-${Math.random().toString(36).substring(2, 7)}`;
  const interactiveStyles = onClick ? 'cursor-pointer select-none active:scale-[0.99]' : '';
  const hoverStyles = hover || onClick ? 'hover:border-slate-600/80 hover:shadow-xl hover:shadow-slate-950/25 transition-all duration-300' : '';

  return (
    <div
      id={safeId}
      onClick={onClick}
      className={`bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800/80 p-6 ${interactiveStyles} ${hoverStyles} ${className}`}
    >
      {children}
    </div>
  );
}
