import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-3">
        <div className="h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Verifying session...</span>
      </div>
    );
  }

  if (!user) {
    // Redirect to login page, remembering where we came from
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
