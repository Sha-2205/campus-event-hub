import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import api from '../../api/axios';
import { 
  ChevronLeft, 
  Users, 
  MessageSquare, 
  Settings, 
  UserPlus, 
  UserCheck, 
  UserX, 
  LogOut, 
  Trash2,
  Calendar
} from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

export default function TeamDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useApp();

  const [team, setTeam] = useState(null);
  const [event, setEvent] = useState(null);
  const [members, setMembers] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTeamDetails = async () => {
    try {
      setLoading(true);
      const teamRes = await api.get(`/api/teams/${id}`);
      console.log("Team Data:", teamRes.data);
      setTeam(teamRes.data);

      const membersRes = await api.get(`/api/teams/${id}/members`);
const requestsRes = await api.get(`/api/teams/${id}/pending-requests`);

setMembers(membersRes.data);
setPendingRequests(requestsRes.data);

// fetch event only if eventId exists
    const eventId =
      teamRes.data.eventId ||
      teamRes.data.event ||
      teamRes.data.event?._id;

    if (eventId) {
      const eventRes = await api.get(`/api/events/${eventId}`);
      setEvent(eventRes.data);
    }
    } catch (err) {
      showToast('Team not found.', 'error');
      navigate('/teams');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamDetails();
  }, [id]);

  const handleAccept = async (userId, userName) => {
    try {
      await api.post(`/api/teams/${id}/accept-request/${userId}`);
      showToast(`Approved "${userName}" join request!`, 'success');
      fetchTeamDetails();
    } catch (err) {
      showToast('Failed to approve request.', 'error');
    }
  };

  const handleReject = async (userId, userName) => {
    try {
      await api.post(`/api/teams/${id}/reject-request/${userId}`);
      showToast(`Rejected "${userName}" join request.`, 'info');
      fetchTeamDetails();
    } catch (err) {
      showToast('Failed to reject request.', 'error');
    }
  };

  const handleKickMember = async (userId, userName) => {
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
        fetchTeamDetails();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to remove member.', 'error');
    }
  };

  const handleDeleteTeam = async () => {
    if (!window.confirm('Delete this team permanently? This cannot be undone.')) return;
    try {
      await api.delete(`/api/teams/${id}`);
      showToast('Team deleted successfully.', 'success');
      navigate('/teams');
    } catch (err) {
      showToast('Failed to delete team.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[40vh]">
        <div className="h-8 w-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isLead = team?.creatorId === user?.id;
const isMember = members.some(
  member => member._id === user?.id || member.id === user?.id
);

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-12 font-sans animate-fade-in">
      {/* Header breadcrumb & navigation bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button id="btn-back-to-teams-detail" variant="outline" size="sm" onClick={() => navigate('/teams')} icon={ChevronLeft}>
            All Teams
          </Button>
          <span className="text-slate-500 text-sm font-semibold text-left">Team Workspace Specs</span>
        </div>

        <div className="flex gap-2">
          {isLead && (
            <>
              <Button
                id="btn-edit-team-specs"
                variant="secondary"
                size="sm"
                icon={Settings}
                onClick={() => navigate(`/teams/${id}/edit`)}
              >
                Edit Workspace
              </Button>
              <Button
                id="btn-delete-team"
                variant="danger"
                size="sm"
                icon={Trash2}
                onClick={handleDeleteTeam}
              >
                Disband Team
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Core details workspace */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card className="border-slate-800 p-6 md:p-8 bg-slate-900/30 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/15 w-fit">
                {members.length} / {team?.capacity || 5} MEMBERS ({Math.max(0, (team?.capacity || 5) - members.length)} SLOTS LEFT)
              </span>
              <h1 className="text-2xl md:text-3.5xl font-display font-extrabold text-white mt-1">
                {team?.name}
              </h1>
            </div>

            <p className="text-sm text-slate-300 font-medium leading-relaxed whitespace-pre-wrap">
              {team?.description}
            </p>

            {/* Objective */}
            {team?.objective && (
              <div className="flex flex-col gap-1.5 mt-2 text-left">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Team Objective</span>
                <p className="text-sm text-slate-200 font-medium bg-slate-950/30 border border-slate-900 rounded-2xl p-4 leading-relaxed whitespace-pre-wrap">
                  {team.objective}
                </p>
              </div>
            )}

            {/* Required Skills & Tags */}
            {( (team?.requiredSkills && team.requiredSkills.length > 0) || (team?.tags && team.tags.length > 0) ) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                {team?.requiredSkills && team.requiredSkills.length > 0 && (
                  <div className="flex flex-col gap-2 text-left">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Required Skills</span>
                    <div className="flex flex-wrap gap-1.5">
                      {team.requiredSkills.map((skill, index) => (
                        <span key={index} className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/15">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {team?.tags && team.tags.length > 0 && (
                  <div className="flex flex-col gap-2 text-left">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tags</span>
                    <div className="flex flex-wrap gap-1.5">
                      {team.tags.map((tag, index) => (
                        <span key={index} className="text-xs font-semibold text-indigo-300 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/15">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="h-px bg-slate-850 my-2" />

            {/* Target Campus Event */}
            {event && (
              <div 
                onClick={() => navigate(`/events/${event._id || event.id}`)}
                className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-950/40 border border-slate-900 hover:border-indigo-500/20 cursor-pointer transition-all"
              >
                <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Formed for Event</p>
                  <p className="text-xs font-bold text-slate-200 mt-0.5 hover:text-indigo-300 transition-colors">{event.title}</p>
                </div>
              </div>
            )}
          </Card>

          {/* Pending Approval Requests Section */}
          {isLead && (
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-indigo-400" />
                Pending Join Requests ({pendingRequests.length})
              </h2>

              {pendingRequests.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {pendingRequests.map((reqUser) => (
                    <Card 
                      key={reqUser.id}
                      className="border-slate-900 bg-slate-900/20 p-4 flex flex-col sm:flex-row items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={reqUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'} 
                          alt={reqUser.name} 
                          className="h-10 w-10 rounded-xl object-cover"
                        />
                        <div className="text-left">
                          <p className="text-sm font-bold text-slate-100">{reqUser.name}</p>
                          <p className="text-[10px] text-slate-500 font-semibold">{reqUser.major}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {reqUser.skills.map(s => (
                              <Badge key={s} variant="slate" className="text-[9px] py-0 px-1.5">{s}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          id={`btn-accept-${reqUser.id}`}
                          variant="primary"
                          size="sm"
                          icon={UserCheck}
                          onClick={() => handleAccept(reqUser.id, reqUser.name)}
                          className="text-xs bg-emerald-600 hover:bg-emerald-500 shadow-none border-none py-1.5 px-3.5"
                        >
                          Approve
                        </Button>
                        <Button
                          id={`btn-reject-${reqUser.id}`}
                          variant="outline"
                          size="sm"
                          icon={UserX}
                          onClick={() => handleReject(reqUser.id, reqUser.name)}
                          className="text-xs border-slate-800 py-1.5 px-3.5 hover:bg-slate-900"
                        >
                          Decline
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="border-dashed border-slate-800 p-6 text-center bg-transparent">
                  <p className="text-xs text-slate-500 font-semibold italic">No pending requests at this time.</p>
                </Card>
              )}
            </div>
          )}
        </div>

        {/* Workspace members sidebar */}
        <div className="flex flex-col gap-6">
          {/* Action shortcuts */}
          {isMember && (
            <Card className="border-slate-850 p-6 bg-slate-900/30 flex flex-col gap-3">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider select-none">Project Center</h3>
              <Button
                id="btn-goto-team-chat"
                variant="primary"
                icon={MessageSquare}
                className="w-full"
                onClick={() => navigate(`/chat/${id}`)}
              >
                Launch Team Chat
              </Button>

              <Button
                id="btn-goto-team-members"
                variant="outline"
                icon={Users}
                className="w-full border-slate-800 hover:bg-slate-900 text-slate-300"
                onClick={() => navigate(`/teams/${id}/members`)}
              >
                View Roster ({members.length})
              </Button>

              {isLead && (
                <Button
                  id="btn-goto-team-requests"
                  variant="outline"
                  icon={UserPlus}
                  className="w-full border-slate-800 hover:bg-slate-900 text-slate-300"
                  onClick={() => navigate(`/teams/${id}/requests`)}
                >
                  Join Requests ({pendingRequests.length})
                </Button>
              )}
              
              {!isLead && (
                <Button
                  id="btn-leave-team"
                  variant="outline"
                  icon={LogOut}
                  className="w-full text-rose-400 hover:bg-rose-500/10 border-slate-800"
                  onClick={() => handleKickMember(user?.id, user?.name)}
                >
                  Leave Team
                </Button>
              )}
            </Card>
          )}

          {/* Members list */}
          <Card className="border-slate-800 p-6 bg-slate-900/30 flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-900/60 pb-3">
              <Users className="w-4 h-4 text-indigo-400" />
              Team Members ({members.length})
            </h3>

            <div className="flex flex-col gap-3">
              {members.map((member) => {
                const memberIsLead = member.id === team?.creatorId;
                const showKick = isLead && !memberIsLead;

                return (
                  <div 
                    key={member.id} 
                    className="flex items-center justify-between p-1.5 rounded-xl hover:bg-slate-900/40 transition-all group"
                  >
                    <div 
                      onClick={() => navigate(`/profile/${member.id}`)}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <img 
                        src={member.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'} 
                        alt={member.name} 
                        className="h-9 w-9 rounded-xl object-cover"
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-200 hover:text-indigo-400 transition-colors flex items-center gap-1">
                          {member.name}
                          {memberIsLead && (
                            <Badge variant="indigo" className="text-[8px] py-0 px-1">Lead</Badge>
                          )}
                        </span>
                        <span className="text-[9px] text-slate-500 font-semibold">{member.major}</span>
                      </div>
                    </div>

                    {showKick && (
                      <button
                        id={`btn-kick-${member.id}`}
                        onClick={() => handleKickMember(member.id, member.name)}
                        className="hidden group-hover:flex p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors text-xs font-semibold cursor-pointer"
                        title="Remove member"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
