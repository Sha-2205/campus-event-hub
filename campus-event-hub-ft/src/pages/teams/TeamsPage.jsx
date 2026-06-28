import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import api from '../../api/axios';
import { Plus, UserSquare2 } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import TeamCard from '../../components/teams/TeamCard';
import TeamFilters from '../../components/teams/TeamFilters';

export default function TeamsPage() {
  const { user } = useAuth();
  const { showToast } = useApp();
  const navigate = useNavigate();

  const [teams, setTeams] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEventId, setSelectedEventId] = useState('all');

  const fetchTeamsAndEvents = async () => {
    try {
      setLoading(true);
      const [teamsRes, eventsRes] = await Promise.all([
        api.get('/api/teams'),
        api.get('/api/events')
      ]);
      setTeams(teamsRes.data);
      setEvents(eventsRes.data);
    } catch (err) {
      showToast('Failed to load teams workspace boards.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamsAndEvents();
  }, []);

  const handleRequestJoin = async (teamId, name) => {
    try {
      await api.post(`/api/teams/${teamId}/request-join`);
      showToast(`Join request submitted to "${name}"!`, 'success');
      fetchTeamsAndEvents();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to request join.', 'error');
    }
  };

  const getEventName = (eventId) => {
    const ev = events.find(e => e.id === eventId);
    return ev ? ev.title : 'General Campus Event';
  };

  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          team.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEvent = selectedEventId === 'all' || team.eventId === selectedEventId;
    return matchesSearch && matchesEvent;
  });

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-12 font-sans animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-left">
          <h1 className="text-2xl font-display font-bold text-white">Project Teams Board</h1>
          <p className="text-xs text-slate-400 mt-1">Join technical projects, design squads, or hackathon teams.</p>
        </div>
        <div className="flex gap-2">
          <Button
            id="btn-teams-my-teams"
            variant="secondary"
            icon={UserSquare2}
            onClick={() => navigate('/teams/my-teams')}
          >
            My Teams
          </Button>
          <Button
            id="btn-teams-create-new"
            variant="primary"
            icon={Plus}
            onClick={() => navigate('/teams/create')}
          >
            Assemble Team
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <TeamFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedEventId={selectedEventId}
        setSelectedEventId={setSelectedEventId}
        events={events}
      />

      {/* Grid listing */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[30vh]">
          <div className="h-8 w-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredTeams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              eventName={getEventName(team.eventId)}
              userId={user?.id}
              onRequestJoin={handleRequestJoin}
            />
          ))}
        </div>
      ) : (
        <Card className="border-dashed border-slate-800 p-12 text-center bg-transparent">
          <p className="text-slate-400 font-semibold italic text-sm">No project teams match your search filters.</p>
          <Button
            id="btn-create-team-fallback"
            variant="primary"
            icon={Plus}
            className="mt-4"
            onClick={() => navigate('/teams/create')}
          >
            Create Your First Team
          </Button>
        </Card>
      )}
    </div>
  );
}

