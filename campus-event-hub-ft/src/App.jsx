import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProfileProvider } from './context/ProfileContext';
import { AppProvider } from './context/AppContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Import all application views
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';

import MyProfilePage from './pages/profile/MyProfilePage';
import UserProfilePage from './pages/profile/UserProfilePage';
import EditProfilePage from './pages/profile/EditProfilePage';
import SkillsPage from './pages/profile/SkillsPage';
import InterestsPage from './pages/profile/InterestsPage';

import EventsPage from './pages/events/EventsPage';
import EventDetailsPage from './pages/events/EventDetailsPage';
import CreateEventPage from './pages/events/CreateEventPage';
import EditEventPage from './pages/events/EditEventPage';
import MyRegisteredEventsPage from './pages/events/MyRegisteredEventsPage';
import EventAttendeesPage from './pages/events/EventAttendeesPage';

import TeamsPage from './pages/teams/TeamsPage';
import TeamDetailsPage from './pages/teams/TeamDetailsPage';
import CreateTeamPage from './pages/teams/CreateTeamPage';
import EditTeamPage from './pages/teams/EditTeamPage';
import MyTeamsPage from './pages/teams/MyTeamsPage';
import TeamMembersPage from './pages/teams/TeamMembersPage';
import TeamRequestsPage from './pages/teams/TeamRequestsPage';
import SkillMatchPage from './pages/teams/SkillMatchPage';

import ChatPage from './pages/chat/ChatPage';
import TeamChatPage from './pages/chat/TeamChatPage';
import ChatStatsPage from './pages/chat/ChatStatsPage';

import UsersPage from './pages/search/UsersPage';
import UsersDirectoryPage from './pages/profile/UsersDirectoryPage';
import SkillSearchPage from './pages/search/SkillSearchPage';
import { ChatProvider } from './context/ChatContext';


export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AuthProvider>
          <ProfileProvider>
            <ChatProvider>
              <Routes>
                {/* Public Access Paths */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Authenticated Workspace Hubs (Wrapped in Layout & ProtectedRoute) */}
                <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                  <Route path="/" element={<DashboardPage />} />

                  {/* Profile sub-routes */}
                  <Route path="/profile/me" element={<MyProfilePage />} />
                  <Route path="/profile/edit" element={<EditProfilePage />} />
                  <Route path="/profile/skills" element={<SkillsPage />} />
                  <Route path="/profile/interests" element={<InterestsPage />} />
                  <Route path="/profile/:id" element={<UserProfilePage />} />

                  {/* Events sub-routes */}
                  <Route path="/events" element={<EventsPage />} />
                  <Route path="/events/create" element={<CreateEventPage />} />
                  <Route path="/events/my-registrations" element={<MyRegisteredEventsPage />} />
                  <Route path="/events/:id" element={<EventDetailsPage />} />
                  <Route path="/events/:id/edit" element={<EditEventPage />} />
                  <Route path="/events/:id/attendees" element={<EventAttendeesPage />} />

                  {/* Teams sub-routes */}
                  <Route path="/teams" element={<TeamsPage />} />
                  <Route path="/teams/create" element={<CreateTeamPage />} />
                  <Route path="/teams/my-teams" element={<MyTeamsPage />} />
                  <Route path="/teams/skill-match" element={<SkillMatchPage />} />
                  <Route path="/teams/:id" element={<TeamDetailsPage />} />
                  <Route path="/teams/:id/edit" element={<EditTeamPage />} />
                  <Route path="/teams/:id/members" element={<TeamMembersPage />} />
                  <Route path="/teams/:id/requests" element={<TeamRequestsPage />} />

                  {/* Chats sub-routes */}
                  <Route path="/chat" element={<ChatPage />} />
                  <Route path="/chat/:teamId" element={<TeamChatPage />} />
                  <Route path="/chat/:teamId/stats" element={<ChatStatsPage />} />

                  {/* Discovery sub-routes */}
                  <Route path="/search/users" element={<UsersDirectoryPage />} />
                  <Route path="/profile/directory" element={<UsersDirectoryPage />} />
                  <Route path="/search/skill-match" element={<SkillSearchPage />} />

                </Route>

                {/* Default Catch-all redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </ChatProvider>
          </ProfileProvider>
        </AuthProvider>
      </AppProvider>
    </BrowserRouter>
  );
}
