import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import api from '../../api/axios';
import { Users, ChevronLeft } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import TeamForm from '../../components/teams/TeamForm';

export default function EditTeamPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useApp();

  const [name, setName] = useState('');
  const [eventId, setEventId] = useState('');
  const [description, setDescription] = useState('');
  const [capacity, setCapacity] = useState('5');
  const [requiredSkills, setRequiredSkills] = useState('');
  const [tags, setTags] = useState('');
  const [objective, setObjective] = useState('');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadTeamAndEvents() {
      try {
        setLoading(true);
        const [teamRes, eventsRes] = await Promise.all([
          api.get(`/api/teams/${id}`),
          api.get('/api/events')
        ]);

        const team = teamRes.data;
        if (team.creatorId !== user?.id) {
          showToast('Only the team lead can modify workspace parameters.', 'error');
          navigate(`/teams/${id}`);
          return;
        }

        setName(team.name);
        setEventId(team.eventId);
        setDescription(team.description || '');
        setCapacity(String(team.capacity || 5));
        setRequiredSkills(Array.isArray(team.requiredSkills) ? team.requiredSkills.join(', ') : '');
        setTags(Array.isArray(team.tags) ? team.tags.join(', ') : '');
        setObjective(team.objective || '');
        setEvents(eventsRes.data);
      } catch (err) {
        showToast('Failed to load team data.', 'error');
        navigate('/teams');
      } finally {
        setLoading(false);
      }
    }

    if (id && user) {
      loadTeamAndEvents();
    }
  }, [id, user]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!name || !eventId || !requiredSkills || !capacity) {
      showToast('Name, event, required skills, and capacity are required to modify a team.', 'error');
      return;
    }

    try {
      setSaving(true);
      await api.put(`/api/teams/${id}`, {
        name,
        eventId,
        description,
        capacity: Number(capacity),
        requiredSkills,
        tags,
        objective
      });
      showToast('Team workspace parameters successfully updated!', 'success');
      navigate(`/teams/${id}`);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update team details.', 'error');
    } finally {
      setSaving(false);
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
    <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full pb-12 font-sans animate-fade-in">
      <div className="flex items-center gap-3">
        <Button id="btn-back-to-team-details" variant="outline" size="sm" onClick={() => navigate(`/teams/${id}`)} icon={ChevronLeft}>
          Back to Details
        </Button>
        <span className="text-slate-500 text-sm font-semibold text-left">Modify Workspace Parameters</span>
      </div>

      <Card className="border-slate-800 p-6 md:p-8 bg-slate-900/30">
        <div className="mb-6 text-left">
          <h1 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            Edit Team Workspace
          </h1>
          <p className="text-xs text-slate-400 mt-1">Update your team's name, description, and target campus event representation.</p>
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
          loading={saving}
          onSubmit={handleEditSubmit}
          submitLabel="Save Team Workspace Updates"
        />
      </Card>
    </div>
  );
}
