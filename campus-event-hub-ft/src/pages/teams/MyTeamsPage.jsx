import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import api from '../../api/axios';
import { Users, Compass, ChevronRight, MessageSquare } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

export default function MyTeamsPage() {
  const { user } = useAuth();
  const { showToast } = useApp();
  const navigate = useNavigate();

  const [myTeams, setMyTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyTeams = async () => {
  try {
    setLoading(true);

    const response = await api.get('/api/teams/user/my-teams');

    console.log("MY TEAMS:", response.data);

    setMyTeams(response.data);

  } catch (err) {
    console.error(err);
    showToast('Failed to retrieve your team groups.', 'error');
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchMyTeams();
  }, []);
  useEffect(() => {
  console.log("MY TEAMS STATE:", myTeams);
}, [myTeams]);

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-12 font-sans animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold text-white">My Project Teams</h1>
        <p className="text-xs text-slate-400 mt-1">Review active groups, edit team parameters, or participate in chats.</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[30vh]">
          <div className="h-8 w-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : myTeams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myTeams.map((team) => {
            const isLead = team.creatorId === user?.id;

            return (
              <Card
                key={team._id}
                id={`my-team-card-${team._id}`}
                hover
                onClick={() => navigate(`/teams/${team._id}`)}
                className="bg-slate-900/35 hover:bg-slate-900/45 border-slate-900/80 flex flex-col justify-between h-full p-6"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider bg-indigo-500/10 px-2.5 py-1 rounded border border-indigo-500/25">
                      {team.members?.length || 0} Members
                    </span>
                    {isLead && (
                      <span className="text-[9px] text-indigo-300 font-bold uppercase border border-indigo-500/20 px-2 py-0.5 rounded-full bg-indigo-500/5">
                        Team Lead
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-100 hover:text-indigo-400 transition-colors line-clamp-1">
                      {team.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2.5 line-clamp-3 leading-relaxed font-medium">
                      {team.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 mt-6 pt-4 border-t border-slate-900/60" onClick={(e) => e.stopPropagation()}>
                  <button
                    id={`btn-my-team-details-${team.id}`}
                    onClick={() => navigate(`/teams/${team.id}`)}
                    className="text-xs font-bold text-slate-400 hover:text-slate-100 flex items-center gap-1 transition-colors"
                  >
                    Workspace Details
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <Button
                   id={`btn-my-team-chat-${team.id || team._id}`}
                    variant="primary"
                    size="sm"
                    icon={MessageSquare}
                   onClick={() => navigate(`/chat/${team.id || team._id}`)}
                    className="text-xs py-1.5 px-3.5"
                  >
                    Open Chat
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="border-dashed border-slate-800 p-12 text-center bg-transparent">
          <p className="text-slate-400 font-semibold italic text-sm">You are not registered in any project teams yet.</p>
          <Button
            id="btn-explore-teams-fallback"
            variant="primary"
            icon={Compass}
            className="mt-4"
            onClick={() => navigate('/teams')}
          >
            Find a Team
          </Button>
        </Card>
      )}
    </div>
  );
}
