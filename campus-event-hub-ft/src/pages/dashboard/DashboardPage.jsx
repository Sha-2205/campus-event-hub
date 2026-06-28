import React from 'react';
import DashboardOverview from '../../components/dashboard/DashboardOverview';

export default function DashboardPage() {
  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 font-sans">
      {/* Renders our clean modular Campus Event Hub Dashboard */}
      <DashboardOverview />
    </div>
  );
}
