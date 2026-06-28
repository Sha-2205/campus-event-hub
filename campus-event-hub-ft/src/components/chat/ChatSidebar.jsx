import React from 'react';
import { Hash, BarChart3, Users, Compass, HelpCircle } from 'lucide-react';
import Button from '../common/Button';

export default function ChatSidebar({
  myTeams = [],
  selectedTeamId,
  onSelectTeam,
  activeTeamMembers = [],
  onNavigateToStats,
  onNavigateToTeams,
}) {
  return (
    <div className="w-full md:w-64 bg-slate-900/40 border border-slate-900 rounded-2xl p-4 flex flex-col gap-6 text-left shrink-0">
      {/* Channels section */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">
            # Workspace Channels
          </span>
        </div>
        
        {myTeams.length > 0 ? (
          <div className="flex flex-col gap-1.5 max-h-[220px] overflow-y-auto pr-1">
            {myTeams.map((team) => {
              const isSelected = team.id === selectedTeamId;
              return (
                <button
                  key={team.id}
                  id={`channel-btn-${team.id}`}
                  onClick={() => onSelectTeam(team.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer
                    ${isSelected
                      ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30'
                      : 'bg-transparent text-slate-400 border border-transparent hover:text-slate-200 hover:bg-slate-900/30'
                    }
                  `}
                >
                  <Hash className={`w-4 h-4 shrink-0 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <span className="truncate">{team.name}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="p-3 text-center border border-dashed border-slate-800 rounded-xl bg-slate-950/10">
            <p className="text-[10px] text-slate-500 font-medium italic">No active channels.</p>
            <Button
              id="sidebar-explore-teams"
              variant="secondary"
              size="sm"
              icon={Compass}
              className="mt-2 text-[10px] py-1 px-2.5 w-full justify-center"
              onClick={onNavigateToTeams}
            >
              Explore Teams
            </Button>
          </div>
        )}
      </div>

      {/* Metrics shortcut */}
      {selectedTeamId && (
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest px-1">
            📊 Channel Insights
          </span>
          <button
            id="sidebar-view-stats-btn"
            onClick={() => onNavigateToStats && onNavigateToStats(selectedTeamId)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-slate-900/65 text-indigo-400 hover:text-indigo-300 border border-indigo-500/10 hover:border-indigo-500/20 transition-all text-left cursor-pointer"
          >
            <BarChart3 className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>Communication Stats</span>
          </button>
        </div>
      )}

      {/* Roster list */}
      {selectedTeamId && activeTeamMembers.length > 0 && (
        <div className="flex-1 flex flex-col gap-2 min-h-[160px]">
          <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest px-1 flex items-center gap-1">
            <Users className="w-3 h-3 text-slate-600" />
            Active Users ({activeTeamMembers.length})
          </span>
          <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2 max-h-[250px]">
            {activeTeamMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-2.5 px-1 py-1 rounded-lg"
              >
                <div className="relative shrink-0">
                  <img
                    src={member.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&h=60&fit=crop'}
                    alt={member.name}
                    className="h-6 w-6 rounded-md object-cover ring-1 ring-slate-800"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute bottom-[-2px] right-[-2px] block h-2 w-2 rounded-full bg-emerald-500 ring-1 ring-slate-900" />
                </div>
                <div className="flex flex-col text-left min-w-0">
                  <span className="text-[11px] font-bold text-slate-300 truncate">{member.name}</span>
                  <span className="text-[9px] text-slate-500 font-semibold truncate leading-none mt-0.5">{member.major || 'Student'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
