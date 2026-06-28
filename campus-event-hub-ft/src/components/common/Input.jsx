import React from 'react';

export default function Input({
  label,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon: Icon,
  required = false,
  className = '',
  ...props
}) {
  const safeId = id || `input-${label ? label.toLowerCase().replace(/[^a-z0-9]/g, '-') : Math.random().toString(36).substring(2, 7)}`;

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label htmlFor={safeId} className="text-xs font-semibold tracking-wider text-slate-400 uppercase select-none">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-slate-500 pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={safeId}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full bg-slate-950/40 border text-sm text-slate-100 rounded-xl px-4 py-2.5 transition-all duration-200 outline-none
            ${Icon ? 'pl-11' : ''}
            ${error ? 'border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/20' : 'border-slate-850 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10'}
            placeholder:text-slate-600`}
          {...props}
        />
      </div>
      {error && (
        <span className="text-xs font-medium text-rose-400 mt-1 select-none flex items-center gap-1">
          <svg className="w-3 h-3 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {error}
        </span>
      )}
    </div>
  );
}
