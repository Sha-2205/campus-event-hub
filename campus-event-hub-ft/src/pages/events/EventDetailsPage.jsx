import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import api from '../../api/axios';
import { 
  ChevronLeft, 
  UserSquare2, 
  Trash2, 
  Plus,
  AlertTriangle
} from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import EventDetails from '../../components/events/EventDetails';
import AttendeesList from '../../components/events/AttendeesList';

export default function EventDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useApp();

  const [event, setEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [eventTeams, setEventTeams] = useState([]);
  const [creatorProfile, setCreatorProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const [eventRes, attendeesRes, teamsRes] = await Promise.all([
        api.get(`/api/events/${id}`),
        api.get(`/api/events/${id}/attendees`),
        api.get(`/api/teams?eventId=${id}`)
      ]);

      setEvent(eventRes.data);
      setAttendees(attendeesRes.data);
      setEventTeams(teamsRes.data);

      // Load creator info
      const creatorRes = await api.get(`/api/profile/${eventRes.data.creatorId}`);
      setCreatorProfile(creatorRes.data);
    } catch (err) {
      showToast('Event not found.', 'error');
      navigate('/events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleRegister = async () => {
    try {
      await api.post(`/api/events/${id}/register`);
      showToast('You are now registered!', 'success');
      fetchDetails();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to register.', 'error');
    }
  };

  const handleUnregister = async () => {
    try {
      await api.post(`/api/events/${id}/unregister`);
      showToast('You have cancelled your seat registration.', 'info');
      fetchDetails();
    } catch (err) {
      showToast('Failed to unregister.', 'error');
    }
  };

  const handleCancelEvent = async () => {
    if (!window.confirm('Are you sure you want to cancel this event? This action cannot be undone.')) return;
    try {
      await api.post(`/api/events/${id}/cancel`);
      showToast('This event has been cancelled.', 'info');
      fetchDetails();
    } catch (err) {
      showToast('Failed to cancel event.', 'error');
    }
  };

  const handleDeleteEvent = async () => {
    if (!window.confirm('Delete this event entirely? All registered lists and teams will be severed.')) return;
    try {
      await api.delete(`/api/events/${id}`);
      showToast('Event deleted permanently.', 'success');
      navigate('/events');
    } catch (err) {
      showToast('Failed to delete event.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[40vh]">
        <div className="h-8 w-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isCreator = event?.creatorId === user?.id;
 const isRegistered =
  event?.registeredUsers?.includes(user?.id) || false;
  const spotsLeft =
  (event?.capacity || 0) - (event?.registeredUsers?.length || 0);

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-12 font-sans animate-fade-in">
      {/* Upper Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button id="btn-back-to-events-detail" variant="outline" size="sm" onClick={() => navigate('/events')} icon={ChevronLeft}>
            All Events
          </Button>
          <span className="text-slate-500 text-sm font-semibold">Event Specification Details</span>
        </div>

        {isCreator && (
          <div className="flex items-center gap-2">
            {!event?.cancelled && (
              <Button
                id="btn-cancel-event"
                variant="outline"
                size="sm"
                icon={AlertTriangle}
                className="text-amber-500 border-amber-500/20 hover:bg-amber-500/10"
                onClick={handleCancelEvent}
              >
                Cancel Event
              </Button>
            )}
            <Button
              id="btn-delete-event"
              variant="danger"
              size="sm"
              icon={Trash2}
              onClick={handleDeleteEvent}
            >
              Delete Permanent
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Core details column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <EventDetails event={event} />

          {/* Event Teams workspace block */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <UserSquare2 className="w-5 h-5 text-indigo-400" />
                Project Teams for this Event ({eventTeams.length})
              </h2>
              <Button
                id="btn-create-team-detail"
                variant="secondary"
                size="sm"
                icon={Plus}
                onClick={() => navigate(`/teams/create?eventId=${id}`)}
              >
                Create Team
              </Button>
            </div>

            {eventTeams.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {eventTeams.map((team) => (
                  <Card
                    key={team._id}
                    id={`team-card-${team._id}`}
                    hover
                    onClick={() => navigate(`/teams/${team._id}`)}
                    className="bg-slate-900/25 hover:bg-slate-900/35 border-slate-900 flex flex-col justify-between p-5 h-full"
                  >
                    <div>
                      <h3 className="text-sm font-bold text-slate-100 hover:text-indigo-400 transition-colors">
                        {team.name}
                      </h3>
                      <p className="text-xs text-slate-400 font-medium mt-1 line-clamp-3 leading-relaxed">
                        {team.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-900/40 text-[11px] text-slate-500 font-bold">
                      <span>👥 {(team.members || []).length} members</span>
                      <span className="text-indigo-400">Join Workspace →</span>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-dashed border-slate-800 p-8 text-center bg-transparent">
                <p className="text-xs text-slate-500 italic font-semibold">No active project teams formed for this event yet.</p>
                <button 
                  onClick={() => navigate(`/teams/create?eventId=${id}`)}
                  className="text-xs text-indigo-400 hover:underline mt-1 font-bold"
                >
                  Assemble a project team now
                </button>
              </Card>
            )}
          </div>
        </div>

        {/* Action column sidebar */}
        <div className="flex flex-col gap-6">
          <Card className="border-slate-800 p-6 bg-slate-900/30 flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider select-none">Seat Registration</h3>
            
            <div className="flex justify-between items-center bg-slate-950/40 rounded-xl p-3 border border-slate-900">
              <span className="text-xs text-slate-400 font-semibold">Seat Status</span>
              <Badge variant={spotsLeft <= 0 ? 'rose' : 'emerald'}>
                {spotsLeft <= 0 ? 'FULLY BOOKED' : `${spotsLeft} Seats Open`}
              </Badge>
            </div>

            {event?.cancelled ? (
              <div className="text-xs text-center text-rose-400 font-semibold bg-rose-500/10 p-3 rounded-xl border border-rose-500/10">
                This event is cancelled. Seat bookings are frozen.
              </div>
            ) : isRegistered ? (
              <div className="flex flex-col gap-2">
                <div className="text-xs text-center text-emerald-400 font-semibold bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/10">
                  ✓ You are registered for this event
                </div>
                <Button id="btn-unregister-detail" variant="outline" className="w-full" onClick={handleUnregister}>
                  Leave Event
                </Button>
              </div>
            ) : (
              <Button
                id="btn-register-detail"
                variant="primary"
                className="w-full"
                onClick={handleRegister}
                disabled={spotsLeft <= 0}
              >
                {spotsLeft <= 0 ? 'Registration Closed' : 'Join Event'}
              </Button>
            )}
          </Card>

          <Card className="border-slate-800 p-6 bg-slate-900/30 flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Event Creator</h3>
            {creatorProfile && (
              <div 
                onClick={() => navigate(`/profile/${creatorProfile.id}`)}
                className="flex items-center gap-3 cursor-pointer p-1 rounded-xl hover:bg-slate-900/40 transition-all"
              >
                <img 
                  src={creatorProfile.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'} 
                  alt={creatorProfile.name} 
                  className="h-10 w-10 rounded-xl object-cover"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-200">{creatorProfile.name}</span>
                  <span className="text-[10px] text-indigo-400 font-semibold">{creatorProfile.major}</span>
                </div>
              </div>
            )}
          </Card>

          {/* Attendees list */}
          <AttendeesList attendees={attendees} />
        </div>
      </div>
    </div>
  );
}
