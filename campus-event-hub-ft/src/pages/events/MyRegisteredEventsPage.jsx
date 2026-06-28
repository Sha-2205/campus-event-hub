import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import api from '../../api/axios';
import { Compass } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import EventCard from '../../components/events/EventCard';

export default function MyRegisteredEventsPage() {
  const { user } = useAuth();
  const { showToast } = useApp();
  const navigate = useNavigate();

  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRegistered = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/events/user/registered');
      setRegisteredEvents(response.data);
    } catch (err) {
      showToast('Failed to retrieve registered events.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistered();
  }, []);

  const handleUnregister = async (e, eventId, title) => {
    e.stopPropagation();
    try {
      await api.post(`/api/events/${eventId}/unregister`);
      showToast(`Cancelled registration for "${title}".`, 'info');
      fetchRegistered();
    } catch (err) {
      showToast('Failed to cancel registration.', 'error');
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-12 font-sans animate-fade-in">
      <div className="text-left">
        <h1 className="text-2xl font-display font-bold text-white">My Registered Events</h1>
        <p className="text-xs text-slate-400 mt-1">Check and review schedules for events you are registered to attend.</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[30vh]">
          <div className="h-8 w-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : registeredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {registeredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              userId={user?.id}
              onUnregister={handleUnregister}
            />
          ))}
        </div>
      ) : (
        <Card className="border-dashed border-slate-800 p-12 text-center bg-transparent">
          <p className="text-slate-400 font-semibold italic text-sm">You haven't registered for any upcoming events yet.</p>
          <Button
            id="btn-explore-events-fallback"
            variant="primary"
            icon={Compass}
            className="mt-4"
            onClick={() => navigate('/events')}
          >
            Explore Active Events
          </Button>
        </Card>
      )}
    </div>
  );
}
