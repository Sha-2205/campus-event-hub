import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import api from '../../api/axios';
import { ChevronLeft, Users, UserMinus, Shield } from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

export default function TeamMembersPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useApp();

  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const [teamRes, membersRes] = await Promise.all([
        api.get(`/api/teams/${id}`),
        api.get(`/api/teams/${id}/members`)
      ]);
      setTeam(teamRes.data);
      setMembers(membersRes.data);
    } catch (err) {
      showToast('Failed to load team members.', 'error');
      navigate(`/teams/${id}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchMembers();
    }
  }, [id]);

  const handleRemoveMember = async (userId, userName) => {
    const isSelf = userId === user?.id;
    const confirmMsg = isSelf 
      ? 'Are you sure you want to leave this team?'
      : `Remove "${userName}" from the team?`;

    if (!window.confirm(confirmMsg)) return;

    try {
      await api.delete(`/api/teams/${id}/members/${userId}`);
      showToast(isSelf ? 'You have left the team.' : `Removed "${userName}" from squad.`, 'info');
      if (isSelf) {
        navigate('/teams');
      } else {
        fetchMembers();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to remove member.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[45vh]">
        <div className="h-8 w-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isLead = team?.creatorId === user?.id;

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full pb-12 font-sans animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button id="btn-members-back" variant="outline" size="sm" onClick={() => navigate(`/teams/${id}`)} icon={ChevronLeft}>
            Back to Team
          </Button>
          <span className="text-slate-500 text-sm font-semibold text-left">Manage Roster</span>
        </div>
      </div>

      <div className="text-left flex flex-col gap-1">
        <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
          <Users className="w-6 h-6 text-indigo-400" />
          {team?.name} — Team Members
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">Explore profiles and roles of all current collaboration members.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {members.map((member) => {
          const isMemberLead = member.id === team?.creatorId;
          const showKick = isLead && !isMemberLead;

          return (
            <Card
              key={member.id}
              id={`member-card-${member.id}`}
              className="bg-slate-900/35 border-slate-900/80 p-5 flex items-center justify-between gap-4 text-left"
            >
              <div 
                className="flex items-center gap-3.5 cursor-pointer flex-1"
                onClick={() => navigate(`/profile/${member.id}`)}
              >
                <div className="h-12 w-12 rounded-xl overflow-hidden ring-2 ring-slate-800/80 shrink-0">
                  <img 
                    src={member.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'} 
                    alt={member.name} 
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-slate-100 hover:text-indigo-400 transition-colors">
                      {member.name}
                    </span>
                    {isMemberLead && (
                      <Badge variant="indigo" className="text-[9px] py-0 px-1.5 flex items-center gap-1">
                        <Shield className="w-2.5 h-2.5" />
                        Team Lead
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">{member.major || 'General Science'}</p>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {member.skills?.slice(0, 3).map(skill => (
                      <Badge key={skill} variant="slate" className="text-[9px] py-0 px-1.5">{skill}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                {showKick && (
                  <Button
                    id={`btn-kick-member-${member.id}`}
                    variant="outline"
                    size="sm"
                    icon={UserMinus}
                    onClick={() => handleRemoveMember(member.id, member.name)}
                    className="text-xs text-rose-400 hover:bg-rose-500/10 border-slate-800"
                  >
                    Remove
                  </Button>
                )}
                {member.id === user?.id && !isMemberLead && (
                  <Button
                    id="btn-leave-team-members"
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveMember(user?.id, user?.name)}
                    className="text-xs text-rose-400 hover:bg-rose-500/10 border-slate-800"
                  >
                    Leave Team
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
