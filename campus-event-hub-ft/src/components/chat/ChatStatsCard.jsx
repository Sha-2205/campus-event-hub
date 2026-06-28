import React from 'react';
import { BarChart3, MessageSquare, TrendingUp, Award, Users } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';

export default function ChatStatsCard({
  stats,
  teamName = 'Team Workspace'
}) {
  if (!stats) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[30vh]">
        <div className="h-6 w-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-500 mt-2 font-medium">Crunching workspace logs...</p>
      </div>
    );
  }

  const { totalMessages = 0, senderCounts = {} } = stats;

  const activeSenders = Object.entries(senderCounts).sort((a, b) => b[1] - a[1]);
  const topContributor = activeSenders[0] ? activeSenders[0][0] : 'None';
  const topContributorCount = activeSenders[0] ? activeSenders[0][1] : 0;

  return (
    <div className="flex flex-col gap-6 text-left animate-fade-in">
      {/* Overview stats grids */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total volume card */}
        <Card className="bg-slate-900/35 border-slate-900/80 p-5 flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Deliveries</p>
            <h4 className="text-xl font-extrabold text-slate-100 mt-0.5">{totalMessages}</h4>
          </div>
        </Card>

        {/* Top contributor card */}
        <Card className="bg-slate-900/35 border-slate-900/80 p-5 flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Chat Leader</p>
            <h4 className="text-sm font-extrabold text-slate-100 mt-0.5 truncate" title={topContributor}>
              {topContributor}
            </h4>
            <p className="text-[10px] text-slate-500 font-semibold mt-0.5">{topContributorCount} messages</p>
          </div>
        </Card>

        {/* Engagement Level card */}
        <Card className="bg-slate-900/35 border-slate-900/80 p-5 flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Collaboration Index</p>
            <h4 className="text-sm font-extrabold text-slate-100 mt-0.5">
              {totalMessages > 100 ? 'High Synergy' : totalMessages > 20 ? 'Active' : 'Growing'}
            </h4>
            <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Based on total chat interaction</p>
          </div>
        </Card>
      </div>

      {/* Visual Sender Distribution Card */}
      <Card className="bg-slate-900/20 border-slate-900/80 p-6 flex flex-col gap-5">
        <div>
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-400" />
            Communication Distribution
          </h3>
          <p className="text-[11px] text-slate-500 font-semibold mt-1">Relative message volumes sent per team member in #{teamName}.</p>
        </div>

        {activeSenders.length > 0 ? (
          <div className="flex flex-col gap-4.5 mt-2">
            {activeSenders.map(([name, count]) => {
              const percentage = totalMessages > 0 ? Math.round((count / totalMessages) * 100) : 0;
              return (
                <div key={name} className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-300 truncate">{name}</span>
                    <span className="text-indigo-400 shrink-0">
                      {count} messages <span className="text-slate-600 font-semibold">({percentage}%)</span>
                    </span>
                  </div>
                  {/* Gauge Bar */}
                  <div className="w-full bg-slate-950/60 rounded-full h-2 overflow-hidden border border-slate-900">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center text-slate-600 font-semibold italic text-xs border border-dashed border-slate-850 rounded-xl bg-slate-950/10">
            No message metrics registered to compile a visual chart.
          </div>
        )}
      </Card>
    </div>
  );
}
