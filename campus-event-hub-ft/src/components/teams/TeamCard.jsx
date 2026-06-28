import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ChevronRight, MessageSquare } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';

export default function TeamCard({
  team,
  eventName = 'General Campus Event',
  userId,
  onRequestJoin,
}) {
  const navigate = useNavigate();
  const isMember = team?.members?.includes(userId);
  const isPending = team?.pendingRequests?.includes(userId);

  return (
    <Card
      key={team.id}
      id={`team-board-card-${team.id}`}
      hover
      onClick={() => navigate(`/teams/${team.id}`)}
      className="bg-slate-900/35 hover:bg-slate-900/45 border-slate-900/80 flex flex-col justify-between h-full p-6 text-left"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Badge variant="indigo">
            {team.members?.length || 0} / {team.capacity || 5} Members
          </Badge>
          <span className="text-[10px] text-slate-500 font-bold uppercase select-none">
            Active Workspace
          </span>
        </div>

        <div>
          <h3 className="text-base font-bold text-slate-100 hover:text-indigo-400 transition-colors line-clamp-1">
            {team.name}
          </h3>
          <p className="text-[10px] text-indigo-400 font-semibold truncate mt-1">
            🎯 Event: {eventName}
          </p>
          <p className="text-xs text-slate-400 mt-2.5 line-clamp-3 leading-relaxed font-medium">
            {team.description || "No description provided."}
          </p>

          {team.requiredSkills && team.requiredSkills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {team.requiredSkills.slice(0, 3).map((skill, i) => (
                <span key={i} className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/15">
                  {skill}
                </span>
              ))}
              {team.requiredSkills.length > 3 && (
                <span className="text-[10px] font-semibold text-slate-500 bg-slate-950/40 px-2 py-0.5 rounded-md">
                  +{team.requiredSkills.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 mt-6 pt-4 border-t border-slate-900/60" onClick={(e) => e.stopPropagation()}>
        <button
          id={`btn-view-team-details-${team.id}`}
          onClick={() => navigate(`/teams/${team.id}`)}
          className="text-xs font-bold text-slate-400 hover:text-slate-100 flex items-center gap-1 transition-colors cursor-pointer"
        >
          View Details
          <ChevronRight className="w-4 h-4" />
        </button>

        {isMember ? (
          <Button
            id={`btn-chat-shortcut-${team.id}`}
            variant="outline"
            size="sm"
            className="text-xs bg-indigo-600/10 hover:bg-indigo-600/25 text-indigo-400 border-indigo-500/20"
            onClick={() => navigate(`/chat/${team.id}`)}
          >
            Team Chat
          </Button>
        ) : isPending ? (
          <span className="px-3 py-1.5 text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl select-none">
            Pending Approval
          </span>
        ) : (
          <Button
            id={`btn-join-request-${team.id}`}
            variant="primary"
            size="sm"
            onClick={() => onRequestJoin && onRequestJoin(team.id, team.name)}
            className="text-xs py-1.5 px-3.5"
          >
            Request Join
          </Button>
        )}
      </div>
    </Card>
  );
}
