import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { Plus } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import EventCard from '../../components/events/EventCard';
import EventFilters from '../../components/events/EventFilters';

export default function EventsPage() {
  const { user } = useAuth();
  const { showToast } = useApp();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All',
    'Technical',
    'Sports',
    'Cultural',
    'Academic',
    'Social',
    'Workshop',
    'Seminar',
    'Competition',
    'Other'
  ];

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/events');
      setEvents(response.data);
    } catch (err) {
      showToast('Failed to retrieve event list.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleRegister = async (e, eventId, title) => {
    e.stopPropagation();
    try {
      await api.post(`/api/events/${eventId}/register`);
      showToast(`Registered successfully for "${title}"!`, 'success');
      fetchEvents();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to complete registration.', 'error');
    }
  };

  const handleUnregister = async (e, eventId, title) => {
    e.stopPropagation();
    try {
      await api.post(`/api/events/${eventId}/unregister`);
      showToast(`Cancelled registration for "${title}".`, 'info');
      fetchEvents();
    } catch (err) {
      showToast('Failed to remove registration.', 'error');
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || event.category.toLowerCase() === selectedCategory.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-12 font-sans animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-left">
          <h1 className="text-2xl font-display font-bold text-white">Campus Events Board</h1>
          <p className="text-xs text-slate-400 mt-1">Explore hackathons, workshops, sprints, and competitions.</p>
        </div>
        <Button
          id="btn-create-event-top"
          variant="primary"
          icon={Plus}
          onClick={() => navigate('/events/create')}
        >
          Create New Event
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <EventFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
      />

      {/* Events Grid layout */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[30vh]">
          <div className="h-8 w-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              userId={user?.id}
              onRegister={handleRegister}
              onUnregister={handleUnregister}
            />
          ))}
        </div>
      ) : (
        <Card className="border-dashed border-slate-800 p-12 text-center bg-transparent">
          <p className="text-slate-400 font-semibold italic text-sm">No campus events match your selected filters.</p>
          <Button
            id="btn-create-event-fallback"
            variant="primary"
            icon={Plus}
            className="mt-4"
            onClick={() => navigate('/events/create')}
          >
            Create Your First Event
          </Button>
        </Card>
      )}
    </div>
  );
}
