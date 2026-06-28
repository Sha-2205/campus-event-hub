import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { useApp } from '../../context/AppContext';
import api from '../../api/axios';
import ChatSidebar from '../../components/chat/ChatSidebar';
import ChatWindow from '../../components/chat/ChatWindow';

export default function TeamChatPage() {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useApp();
  
  const {
    messages,
    loading,
    connected,
    selectTeamRoom,
    sendNewMessage,
    editTeamMessage,
    deleteTeamMessage,
    reactToTeamMessage
  } = useChat();

  const [myTeams, setMyTeams] = useState([]);
  const [activeTeam, setActiveTeam] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loadingSidebar, setLoadingSidebar] = useState(true);

  // Load user's channel list
  useEffect(() => {
    async function loadUserChannels() {
      try {
        setLoadingSidebar(true);
        const res = await api.get('/api/teams/user/my-teams');
        setMyTeams(res.data);
      } catch (err) {
        console.error('Failed to load user channel listings', err);
      } finally {
        setLoadingSidebar(false);
      }
    }

    if (user) {
      loadUserChannels();
    }
  }, [user]);

  // Activate selected team room in context & fetch current roster
  useEffect(() => {
    if (teamId) {
      selectTeamRoom(teamId);
      
      // Fetch specific team metadata & members list
      async function loadTeamData() {
        try {
          const [teamRes, membersRes] = await Promise.all([
            api.get(`/api/teams/${teamId}`),
            api.get(`/api/teams/${teamId}/members`)
          ]);
          setActiveTeam(teamRes.data);
          setTeamMembers(membersRes.data);
        } catch (err) {
          showToast('Could not load workspace context.', 'error');
          navigate('/chat');
        }
      }

      loadTeamData();
    } else {
      selectTeamRoom(null);
      setActiveTeam(null);
      setTeamMembers([]);
    }
  }, [teamId, selectTeamRoom, navigate, showToast]);

  const handleSendMessage = async (content) => {
    if (!teamId) return;
    try {
      await sendNewMessage(teamId, content);
    } catch (err) {
      // Toast already shown in context
    }
  };

  const handleEditMessage = async (msgId, content) => {
    if (!teamId) return;
    try {
      await editTeamMessage(teamId, msgId, content);
    } catch (err) {
      // Error handled
    }
  };

  const handleDeleteMessage = async (msgId) => {
    if (!teamId) return;
    if (!window.confirm('Are you sure you want to delete this message permanently?')) return;
    try {
      await deleteTeamMessage(teamId, msgId);
    } catch (err) {
      // Error handled
    }
  };

  const handleToggleReaction = async (msgId, reaction) => {
    if (!teamId) return;
    await reactToTeamMessage(teamId, msgId, reaction);
  };

  const handleSelectTeam = (id) => {
    navigate(`/chat/${id}`);
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row gap-6 max-w-7xl mx-auto w-full pb-6 font-sans animate-fade-in h-[calc(100vh-8.5rem)] min-h-0">
      {/* Channels List Sidebar */}
      <ChatSidebar
        myTeams={myTeams}
        selectedTeamId={teamId}
        onSelectTeam={handleSelectTeam}
        activeTeamMembers={teamMembers}
        onNavigateToStats={(id) => navigate(`/chat/${id}/stats`)}
        onNavigateToTeams={() => navigate('/teams')}
      />

      {/* Primary Communication Feed Window */}
      <ChatWindow
        activeTeam={activeTeam}
        messages={messages}
        userId={user?.id}
        loading={loading}
        connected={connected}
        onSendMessage={handleSendMessage}
        onEditMessage={handleEditMessage}
        onDeleteMessage={handleDeleteMessage}
        onToggleReaction={handleToggleReaction}
        onViewBoard={(id) => navigate(`/teams/${id}`)}
        onBackToChannels={() => navigate('/chat')}
      />
    </div>
  );
}
