import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import api from '../../api/axios';
import { Sparkles, ChevronLeft, Compass } from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

export default function SkillMatchPage() {
  const { showToast } = useApp();
  const navigate = useNavigate();

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMatches() {
      try {
        setLoading(true);

        // Get logged-in user's profile
        const profileRes = await api.get('/api/profile/me/profile');

        const userSkills =
          profileRes.data?.skills ||
          profileRes.data?.user?.skills ||
          [];

        if (userSkills.length === 0) {
          setMatches([]);
          return;
        }

        // Find matching users
        const response = await api.get(
          '/api/teams/find-users/by-skills',
          {
            params: {
              skills: userSkills
            }
          }
        );

        setMatches(
          Array.isArray(response.data)
            ? response.data
            : response.data?.users || []
        );
      } catch (err) {
        console.error(err);
        showToast(
          'Failed to load user skill recommendations.',
          'error'
        );
      } finally {
        setLoading(false);
      }
    }

    loadMatches();
  }, []);

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full pb-12 font-sans animate-fade-in">

      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          id="btn-back-to-dashboard-match"
          variant="outline"
          size="sm"
          onClick={() => navigate('/')}
          icon={ChevronLeft}
        >
          Dashboard
        </Button>

        <span className="text-slate-500 text-sm font-semibold">
          Campus Networking Center
        </span>
      </div>

      {/* Title */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5.5 h-5.5 text-indigo-400 animate-pulse" />
          Smart Skill Matching Engine
        </h1>

        <p className="text-xs text-slate-400 mt-0.5">
          Find complementary student peers whose skills align with your projects.
        </p>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[30vh]">
          <div className="h-8 w-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : matches.length > 0 ? (

        /* Match Cards */
        <div className="flex flex-col gap-4">

          {matches.map((peer, idx) => {


            const matchPercent = Math.min(
              95,
              60 + ((peer.matchCount || 0) * 12) + ((3 - idx) * 4)
            );

            return (
              <Card
                key={peer.id || peer._id}
                id={`match-peer-card-${peer.id || peer._id}`}
                className="bg-slate-900/35 border-slate-900/80 hover:border-slate-800 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all"
              >

                <div className="flex flex-col sm:flex-row sm:items-start gap-4">

                  {/* Profile Image */}
                  <div className="h-14 w-14 rounded-2xl overflow-hidden shrink-0 ring-4 ring-indigo-500/10 border border-indigo-500/20">
                    <img
                      src={
                        peer.avatar ||
                        peer.profileImage ||
                        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'
                      }
                      alt={peer.name || 'User'}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.src =
                          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop';
                      }}
                    />
                  </div>

                  {/* User Info */}
                  <div className="text-left">

                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="text-base font-bold text-slate-100">
                        {peer.name || 'Unknown User'}
                      </h3>

                      <Badge
                        variant="emerald"
                        className="text-[9px] py-0 px-2 font-bold"
                      >
                        {matchPercent}% COMPATIBILITY
                      </Badge>
                    </div>

                    <p className="text-xs text-indigo-400 font-semibold mt-0.5">
                      {peer.major || 'General Science'}
                    </p>

                    <p className="text-xs text-slate-300 mt-2 line-clamp-2 max-w-xl font-medium leading-relaxed">
                      {peer.bio ||
                        'This student is looking to collaborate on innovative campus projects.'}
                    </p>

                    {/* Skills */}
                    <div className="flex flex-col gap-2 mt-4">

                      {peer.skills?.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-bold text-slate-500 uppercase">
                            Expertises:
                          </span>

                          {peer.skills.map((skill, i) => (
                            <Badge
                              key={`${skill}-${i}`}
                              variant="slate"
                              className="text-[9px] py-0 px-1.5 bg-slate-950/40"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Interests */}
                      {peer.interests?.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-bold text-slate-500 uppercase">
                            Interests:
                          </span>

                          {peer.interests.map((interest, i) => (
                            <Badge
                              key={`${interest}-${i}`}
                              variant="violet"
                              className="text-[9px] py-0 px-1.5"
                            >
                              {interest}
                            </Badge>
                          ))}
                        </div>
                      )}

                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div
                  className="shrink-0 flex items-center gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    id={`btn-match-view-${peer.id || peer._id}`}
                    variant="secondary"
                    size="sm"
                    className="text-xs px-3.5"
                    onClick={() =>
                      navigate(`/profile/${peer.id || peer._id}`)
                    }
                  >
                    View Profile
                  </Button>
                </div>

              </Card>
            );
          })}
        </div>

      ) : (

        /* No Matches */
        <Card className="border-dashed border-slate-800 p-12 text-center bg-transparent">
          <p className="text-slate-400 font-semibold italic text-sm">
            Add more technical skills to your profile to get matched with campus peers!
          </p>

          <Button
            id="btn-goto-profile-match-fallback"
            variant="primary"
            icon={Compass}
            className="mt-4"
            onClick={() => navigate('/profile/me')}
          >
            Customize Profile
          </Button>
        </Card>

      )}
    </div>
  );
}