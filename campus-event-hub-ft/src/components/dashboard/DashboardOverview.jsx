import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import api from '../../api/axios';
import { 
  Calendar, 
  Users, 
  Sparkles, 
  Compass, 
  TrendingUp, 
  ShieldAlert, 
  Clock, 
  PlusCircle, 
  Award,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatCard from './StatCard';
import DashboardHeader from './DashboardHeader';
import QuickActions from './QuickActions';
import Card from '../common/Card';
import Badge from '../common/Badge';

export default function DashboardOverview() {
  const { user } = useAuth();
  const { showToast } = useApp();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [profileStats, setProfileStats] = useState({ totalUsers: 0, topSkills: [], topInterests: [] });
  const [eventStats, setEventStats] = useState({ activeEvents: 0, registrationsCount: 0, categories: {} });
  const [teamStats, setTeamStats] = useState({ totalTeams: 0, avgTeamSize: 0 });
  const [myRegisteredEvents, setMyRegisteredEvents] = useState([]);
  const [myJoinedTeams, setMyJoinedTeams] = useState([]);

  // Fetch all necessary stats from the requested endpoints
  useEffect(() => {
    async function loadStatsAndOverview() {
      try {
        setLoading(true);
        const [
          profileRes,
          eventRes,
          teamRes,
          myRegisteredRes,
          myTeamsRes
        ] = await Promise.all([
          api.get('/api/profile/stats'),
          api.get('/api/events/stats/dashboard'),
          api.get('/api/teams/stats/dashboard'),
          api.get('/api/events/user/registered'),
          api.get('/api/teams/user/my-teams')
        ]);

        setProfileStats(profileRes.data);
        setEventStats(eventRes.data);
        setTeamStats(teamRes.data);
        setMyRegisteredEvents(myRegisteredRes.data);
        setMyJoinedTeams(myTeamsRes.data);
      } catch (err) {
        console.error("Failed to load dashboard metrics:", err);
        showToast("Error retrieving latest campus statistics feed.", "error");
      } finally {
        setLoading(false);
      }
    }

    loadStatsAndOverview();
  }, [showToast]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[45vh] w-full">
        <div className="h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <span className="text-slate-400 text-xs font-bold uppercase tracking-wider animate-pulse">
          Fetching campus analytics and workspace...
        </span>
      </div>
    );
  }

  // Derive recent campus/personal activities to display in the recent activity feed
  const recentActivities = [
    ...(myRegisteredEvents.length > 0 
      ? myRegisteredEvents.map(e => ({
          id: `act-reg-${e.id}`,
          type: 'registration',
          title: `Registered for "${e.title}"`,
          subtitle: `Event location: ${e.location}`,
          time: 'Active confirmation',
          icon: Award,
          iconColor: 'text-emerald-400 bg-emerald-500/10'
        }))
      : []),
    ...(myJoinedTeams.length > 0
      ? myJoinedTeams.map(t => ({
          id: `act-team-${t.id}`,
          type: 'team',
          title: `Joined squad: ${t.name}`,
          subtitle: `Connected to event collaboration`,
          time: 'Active participation',
          icon: Users,
          iconColor: 'text-violet-400 bg-violet-500/10'
        }))
      : []),
    {
      id: 'act-feed-welcome',
      type: 'info',
      title: 'Joined Campus Event Hub',
      subtitle: 'Set up your student profile and skills tags',
      time: 'Account activation',
      icon: Compass,
      iconColor: 'text-sky-400 bg-sky-500/10'
    }
  ].slice(0, 4);

  return (
    <div className="flex flex-col gap-8 w-full animate-fade-in text-left">
      {/* Dynamic Welcome Hero component */}
      <DashboardHeader user={user} />

      {/* Grid of Modular StatCards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Active Campus Events"
          value={eventStats.activeEvents || 0}
          icon={Calendar}
          variant="indigo"
          description="Hackathons & workshops live"
          trend={{ value: 'New today', isPositive: true }}
          id="stat-events-count"
        />

        <StatCard
          title="My Event Seats"
          value={myRegisteredEvents.length || 0}
          icon={Award}
          variant="emerald"
          description="Confirmed registrations"
          trend={{ value: '100% Seat', isPositive: true }}
          id="stat-registrations-count"
        />

        <StatCard
          title="Campus Team Squads"
          value={teamStats.totalTeams || 0}
          icon={Users}
          variant="violet"
          description={`Average size: ${teamStats.avgTeamSize || 0} members`}
          trend={{ value: 'Active collab', isPositive: true }}
          id="stat-teams-count"
        />

        <StatCard
          title="Hub Students"
          value={profileStats.totalUsers || 0}
          icon={Compass}
          variant="sky"
          description="Active peers registered"
          trend={{ value: 'Growing list', isPositive: true }}
          id="stat-students-count"
        />
      </div>

      {/* Two Columns: Recent Activities vs. Quick Actions / Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Recent Activity Feed & Demanded Skills */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Recent Activity Timeline Card */}
          <Card className="border-slate-850 bg-slate-900/25 p-6 text-left">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/40 mb-5">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-400" />
                <h2 className="text-base font-bold text-slate-100">Recent Action Log</h2>
              </div>
              <Badge variant="slate" className="text-[10px]">REALTIME FEED</Badge>
            </div>

            <div className="flex flex-col gap-5 relative">
              {/* Timeline line */}
              <div className="absolute top-2.5 bottom-2.5 left-5.5 w-0.5 bg-slate-800" />

              {recentActivities.map((act) => {
                const Icon = act.icon;
                return (
                  <div key={act.id} className="flex items-start gap-4 relative z-10 group" id={`activity-item-${act.id}`}>
                    <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 border border-slate-800/60 shadow-lg ${act.iconColor} group-hover:scale-105 transition-all`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors truncate">
                          {act.title}
                        </h4>
                        <span className="text-[10px] text-slate-500 font-semibold whitespace-nowrap">
                          {act.time}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 font-medium truncate">
                        {act.subtitle}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Demanded Campus Skills Analysis */}
          <Card className="border-slate-850 bg-slate-900/25 p-6 text-left">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              <h2 className="text-base font-bold text-slate-100">High-Demand Campus Expertise</h2>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed font-medium mb-4">
              Below are the top-ranking skills student leaders are searching for across campus projects. Add these tags to your profile to get matches.
            </p>

            <div className="flex flex-wrap gap-2.5">
              {profileStats.topSkills && profileStats.topSkills.length > 0 ? (
                profileStats.topSkills.map((skillObj, index) => (
                  <div 
                    key={skillObj.name} 
                    id={`demand-skill-${skillObj.name}`}
                    onClick={() => navigate(`/search/skill-match?query=${encodeURIComponent(skillObj.name)}`)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/85 hover:bg-slate-950 border border-slate-800 hover:border-indigo-500/20 rounded-xl cursor-pointer transition-all text-xs font-semibold select-none group"
                  >
                    <span className="text-[10px] text-indigo-400 font-bold font-mono">#{index + 1}</span>
                    <span className="text-slate-200 group-hover:text-indigo-300 transition-colors">{skillObj.name}</span>
                    <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-mono text-[9px]">
                      {skillObj.count} peers
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-slate-500 text-xs italic font-medium py-2">
                  No expertise index computed yet. Configure your skills profile.
                </div>
              )}
            </div>
          </Card>

        </div>

        {/* Right Column: Quick Actions Menu & Campus Category Breakdown */}
        <div className="flex flex-col gap-6">
          
          {/* Quick Actions Component */}
          <QuickActions />

          {/* Campus Categories breakdown list */}
          <Card className="border-slate-850 bg-slate-900/25 p-5 text-left">
            <h3 className="text-sm font-bold text-slate-300 mb-3 uppercase tracking-wider">
              Event Categories Index
            </h3>
            
            <div className="flex flex-col gap-2.5">
              {Object.entries(eventStats.categories || {}).length > 0 ? (
                Object.entries(eventStats.categories).map(([category, count]) => (
                  <div 
                    key={category}
                    onClick={() => navigate(`/events?category=${encodeURIComponent(category)}`)}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/40 hover:bg-slate-900 border border-slate-800/40 hover:border-slate-800 cursor-pointer transition-all"
                  >
                    <span className="text-xs font-semibold text-slate-300 capitalize">{category}</span>
                    <Badge variant="indigo" className="text-[10px] px-2">{count} events</Badge>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 italic font-medium">
                  No active categories tracked.
                </p>
              )}
            </div>
          </Card>

        </div>

      </div>
    </div>
  );
}
