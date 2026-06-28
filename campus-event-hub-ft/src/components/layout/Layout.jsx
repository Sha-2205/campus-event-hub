import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useApp } from '../../context/AppContext';

export default function Layout({ children }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { globalLoading } = useApp();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased">
      {/* Upper Navigation Header */}
      <Navbar onToggleMobileSidebar={() => setMobileSidebarOpen(true)} />

      {/* Main Container Flow */}
      <div className="flex flex-1 relative">
        {/* Navigation Sidebar Panel */}
        <Sidebar 
          mobileOpen={mobileSidebarOpen} 
          onCloseMobile={() => setMobileSidebarOpen(false)} 
        />

        {/* Core Content Arena */}
        <main 
          id="main-viewport"
          className="flex-1 min-w-0 flex flex-col relative px-4 py-6 md:p-8"
        >
          {/* Global loader backdrop */}
          {globalLoading && (
            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-slate-400 font-semibold tracking-wider uppercase">Loading Campus Hub...</span>
              </div>
            </div>
          )}
          
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}
