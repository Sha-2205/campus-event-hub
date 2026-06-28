import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import api from '../../api/axios';
import { ChevronLeft, BarChart3, HelpCircle } from 'lucide-react';
import Button from '../../components/common/Button';
import ChatStatsCard from '../../components/chat/ChatStatsCard';

export default function ChatStatsPage() {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { stats, loadStats } = useChat();

  const [team, setTeam] = useState(null);
  const [loadingTeam, setLoadingTeam] = useState(true);

  useEffect(() => {
    async function loadTeam() {
      try {
        setLoadingTeam(true);
        const res = await api.get(`/api/teams/${teamId}`);
        setTeam(res.data);
      } catch (err) {
        console.error('Failed to load team context for stats', err);
      } finally {
        setLoadingTeam(false);
      }
    }

    if (teamId) {
      loadTeam();
      loadStats(teamId);
    }
  }, [teamId, loadStats]);

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full pb-12 font-sans animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            id="btn-stats-back-to-chat"
            variant="outline"
            size="sm"
            onClick={() => navigate(`/chat/${teamId}`)}
            icon={ChevronLeft}
          >
            Back to Chat
          </Button>
          <span className="text-slate-500 text-sm font-semibold text-left">Analytics Desk</span>
        </div>
      </div>

      <div className="text-left flex flex-col gap-1">
        <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2.5">
          <BarChart3 className="w-6 h-6 text-indigo-400" />
          Workspace Analytics — #{team?.name || 'Channel'}
        </h1>
        <p className="text-xs text-slate-400">
          Track participation index, overall chat engagement, and message delivery distribution.
        </p>
      </div>

      <ChatStatsCard stats={stats} teamName={team?.name} />
    </div>
  );
}
