import React from 'react';

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary', // primary, secondary, outline, danger, ghost
  size = 'md', // sm, md, lg
  disabled = false,
  loading = false,
  icon: Icon,
  className = '',
  id,
}) {
  // Generate safe fallback ID based on content if not provided
  const safeId = id || `btn-${(typeof children === 'string' ? children : 'action').toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]';
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
  };

  const variantStyles = {
    primary: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/15 border border-indigo-500/10',
    secondary: 'bg-slate-800 hover:bg-slate-700/80 text-slate-100 border border-slate-700/50',
    outline: 'bg-transparent hover:bg-slate-800 text-slate-300 hover:text-slate-100 border border-slate-700',
    danger: 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/15 border border-rose-500/10',
    ghost: 'bg-transparent hover:bg-slate-800 text-slate-400 hover:text-slate-200',
  };

  return (
    <button
      id={safeId}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {loading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : Icon ? (
        <Icon className={`${size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} text-current`} />
      ) : null}
      {children}
    </button>
  );
}
