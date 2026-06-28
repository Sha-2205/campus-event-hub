import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import api from '../../api/axios';
import { ChevronLeft, UserPlus, UserCheck, UserX, Inbox } from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

export default function TeamRequestsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useApp();

  const [team, setTeam] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const [teamRes, requestsRes] = await Promise.all([
        api.get(`/api/teams/${id}`),
        api.get(`/api/teams/${id}/pending-requests`)
      ]);

      const teamData = teamRes.data;
      if (teamData.creatorId !== user?.id) {
        showToast('Only the team lead can view pending requests.', 'error');
        navigate(`/teams/${id}`);
        return;
      }

      setTeam(teamData);
      setPendingRequests(requestsRes.data);
    } catch (err) {
      showToast('Failed to load pending requests.', 'error');
      navigate(`/teams/${id}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id && user) {
      fetchRequests();
    }
  }, [id, user]);

  const handleAccept = async (userId, userName) => {
    try {
      await api.post(`/api/teams/${id}/accept-request/${userId}`);
      showToast(`Approved "${userName}" join request!`, 'success');
      fetchRequests();
    } catch (err) {
      showToast('Failed to approve request.', 'error');
    }
  };

  const handleReject = async (userId, userName) => {
    try {
      await api.post(`/api/teams/${id}/reject-request/${userId}`);
      showToast(`Rejected "${userName}" join request.`, 'info');
      fetchRequests();
    } catch (err) {
      showToast('Failed to reject request.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[40vh]">
        <div className="h-8 w-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full pb-12 font-sans animate-fade-in">
      <div className="flex items-center gap-3">
        <Button id="btn-requests-back" variant="outline" size="sm" onClick={() => navigate(`/teams/${id}`)} icon={ChevronLeft}>
          Back to Team
        </Button>
        <span className="text-slate-500 text-sm font-semibold text-left">Approval Desk</span>
      </div>

      <div className="text-left flex flex-col gap-1">
        <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
          <UserPlus className="w-6 h-6 text-indigo-400" />
          Pending Join Requests
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">Manage admissions and select complemental skillsets for your squad.</p>
      </div>

      {pendingRequests.length > 0 ? (
        <div className="flex flex-col gap-4">
          {pendingRequests.map((reqUser) => (
            <Card 
              key={reqUser.id}
              className="border-slate-900 bg-slate-900/20 p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-left"
            >
              <div className="flex items-start gap-4">
                <img 
                  src={reqUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'} 
                  alt={reqUser.name} 
                  className="h-12 w-12 rounded-xl object-cover ring-2 ring-slate-800 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-100 hover:text-indigo-400 cursor-pointer" onClick={() => navigate(`/profile/${reqUser.id}`)}>{reqUser.name}</p>
                  <p className="text-xs text-indigo-400 font-semibold mt-0.5">{reqUser.major || 'General Science'}</p>
                  <p className="text-xs text-slate-300 mt-2 font-medium line-clamp-2 max-w-lg leading-relaxed">
                    {reqUser.bio || "Hi, I am excited about joining this team and collaborating together on creative campus projects."}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {reqUser.skills?.map(s => (
                      <Badge key={s} variant="slate" className="text-[9px] py-0 px-2 bg-slate-950/40">{s}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-900">
                <Button
                  id={`btn-accept-request-${reqUser.id}`}
                  variant="primary"
                  size="sm"
                  icon={UserCheck}
                  onClick={() => handleAccept(reqUser.id, reqUser.name)}
                  className="flex-1 md:flex-none text-xs bg-emerald-600 hover:bg-emerald-500 shadow-none border-none py-1.5 px-3.5"
                >
                  Approve
                </Button>
                <Button
                  id={`btn-reject-request-${reqUser.id}`}
                  variant="outline"
                  size="sm"
                  icon={UserX}
                  onClick={() => handleReject(reqUser.id, reqUser.name)}
                  className="flex-1 md:flex-none text-xs border-slate-800 py-1.5 px-3.5 hover:bg-slate-900"
                >
                  Decline
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed border-slate-800 py-16 text-center bg-transparent flex flex-col items-center justify-center gap-3">
          <div className="h-12 w-12 rounded-full bg-slate-900/50 flex items-center justify-center text-slate-600">
            <Inbox className="w-6 h-6" />
          </div>
          <p className="text-sm text-slate-400 font-semibold italic">No pending admission requests at this time.</p>
        </Card>
      )}
    </div>
  );
}
