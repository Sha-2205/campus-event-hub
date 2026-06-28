import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../api/axios';
import { useApp } from '../../context/AppContext';
import { Users, ChevronLeft } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import TeamForm from '../../components/teams/TeamForm';

export default function CreateTeamPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showToast } = useApp();

  const queryEventId = searchParams.get('eventId') || '';

  const [name, setName] = useState('');
  const [eventId, setEventId] = useState(queryEventId);
  const [description, setDescription] = useState('');
  const [capacity, setCapacity] = useState('5');
  const [requiredSkills, setRequiredSkills] = useState('');
  const [tags, setTags] = useState('');
  const [objective, setObjective] = useState('');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadEvents() {
      try {
        const response = await api.get('/api/events');

        setEvents(response.data);

        if (!eventId && response.data.length > 0) {
          setEventId(response.data[0]._id);
        }
      } catch (err) {
        console.error(err);
        showToast('Failed to load active events list.', 'error');
      }
    }

    loadEvents();
  }, []);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();

    if (!name || !eventId || !requiredSkills || !capacity) {
      showToast(
        'Name, event, required skills, and capacity are required.',
        'error'
      );
      return;
    }

    try {
      setLoading(true);

     const payload = {
      name,
      eventId,
      description,
      maxMembers: Number(capacity),

      requiredSkills: requiredSkills
        .split(',')
        .map(skill => skill.trim())
        .filter(Boolean),

      tags: tags
        .split(',')
        .map(tag => tag.trim())
        .filter(Boolean),

      objective
};
      console.log('Sending Team Payload:', payload);

      const response = await api.post(
        '/api/teams/create',
        payload
      );

      console.log('Team Created:', response.data);

      showToast(
        'Team workspace created successfully!',
        'success'
      );

      navigate(`/teams/${response.data._id || response.data.id}`);
    } catch (err) {
      console.log("Full Error:", JSON.stringify(err.response?.data, null, 2));

      showToast(
        err.response?.data?.message ||
          'Failed to create team.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full pb-12 font-sans animate-fade-in">
      <div className="flex items-center gap-3">
        <Button
          id="btn-back-to-teams-create"
          variant="outline"
          size="sm"
          onClick={() => navigate('/teams')}
          icon={ChevronLeft}
        >
          Back
        </Button>

        <span className="text-slate-500 text-sm font-semibold text-left">
          Team Assembly Room
        </span>
      </div>

      <Card className="border-slate-800 p-6 md:p-8 bg-slate-900/30">
        <div className="mb-6 text-left">
          <h1 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            Assemble a Project Team
          </h1>

          <p className="text-xs text-slate-400 mt-1">
            Form a collaboration board for a specific hackathon,
            competition, or class workshop.
          </p>
        </div>

        <TeamForm
          name={name}
          setName={setName}
          eventId={eventId}
          setEventId={setEventId}
          description={description}
          setDescription={setDescription}
          capacity={capacity}
          setCapacity={setCapacity}
          requiredSkills={requiredSkills}
          setRequiredSkills={setRequiredSkills}
          tags={tags}
          setTags={setTags}
          objective={objective}
          setObjective={setObjective}
          events={events}
          loading={loading}
          onSubmit={handleCreateSubmit}
          submitLabel="Create Team Workspace"
          queryEventId={queryEventId}
        />
      </Card>
    </div>
  );
}