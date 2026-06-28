import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useApp } from '../../context/AppContext';
import { Calendar, ChevronLeft } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import EventForm from '../../components/events/EventForm';

export default function CreateEventPage() {
  const navigate = useNavigate();
  const { showToast } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('Technical');
  const [capacity, setCapacity] = useState('50');
  const [loading, setLoading] = useState(false);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !date || !time || !location || !category || !capacity) {
      showToast('Please fill out all required parameters.', 'error');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/api/events/create', {
        title,
        description,
        eventDate: date,
        eventTime: time,
        location,
        category,
        capacity: Number(capacity),
        requiredSkills: [],
        tags: []
});
      showToast('Event created successfully! You are auto-registered.', 'success');
      navigate(`/events/${response.data.id}`);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create event.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full pb-12 font-sans animate-fade-in">
      <div className="flex items-center gap-3">
        <Button id="btn-back-to-events-create" variant="outline" size="sm" onClick={() => navigate('/events')} icon={ChevronLeft}>
          Back
        </Button>
        <span className="text-slate-500 text-sm font-semibold text-left">Campus Event Hub Builder</span>
      </div>

      <Card className="border-slate-800 p-6 md:p-8 bg-slate-900/30">
        <div className="mb-6 text-left">
          <h1 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-400" />
            Build a Campus Event
          </h1>
          <p className="text-xs text-slate-400 mt-1">Submit your hackathon, design sprint, or technical workshop details.</p>
        </div>

        <EventForm
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          date={date}
          setDate={setDate}
          time={time}
          setTime={setTime}
          location={location}
          setLocation={setLocation}
          category={category}
          setCategory={setCategory}
          capacity={capacity}
          setCapacity={setCapacity}
          loading={loading}
          onSubmit={handleCreateSubmit}
          submitLabel="Create Event Listing"
        />
      </Card>
    </div>
  );
}
