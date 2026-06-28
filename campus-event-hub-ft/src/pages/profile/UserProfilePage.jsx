import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProfile } from '../../context/ProfileContext';
import { useApp } from '../../context/AppContext';
import { ChevronLeft, Mail, BookOpen, Compass, Sparkles, Send, Award, Heart } from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

export default function UserProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchUserProfile } = useProfile();
  const { showToast } = useApp();
  
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        const data = await fetchUserProfile(id);
        if (data) {
          setUserProfile(data);
        } else {
          showToast('Profile not found.', 'error');
          navigate('/search/users');
        }
      } catch (err) {
        showToast('Error loading profile.', 'error');
        navigate('/search/users');
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [id, navigate, showToast]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[40vh] w-full">
        <div className="h-8 w-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3" />
        <span className="text-slate-500 text-xs font-semibold animate-pulse">Loading student record...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full pb-12 font-sans animate-fade-in text-left">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button 
            id="btn-back-to-users-from-profile" 
            variant="outline" 
            size="sm" 
            onClick={() => navigate(-1)} 
            icon={ChevronLeft}
          >
            Back
          </Button>
          <span className="text-slate-400 text-sm font-semibold hidden sm:inline">Student Profile Details</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Left column */}
        <div className="flex flex-col gap-6 md:col-span-1">
          <Card className="border-slate-800 flex flex-col items-center text-center p-6 bg-slate-900/30">
            <div className="h-24 w-24 rounded-2xl overflow-hidden ring-4 ring-indigo-500/10 border border-indigo-500/20 mb-4">
              <img 
                src={userProfile?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop'} 
                alt={userProfile?.name} 
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <h2 className="text-lg font-bold text-slate-100">{userProfile?.name}</h2>
            <span className="text-xs font-semibold text-indigo-400 mt-1 px-2.5 py-1 rounded-full bg-indigo-500/5 border border-indigo-500/10">
              {userProfile?.major || 'Student'}
            </span>
            
            <div className="h-px bg-slate-800/60 my-4.5 w-full" />
            
            <div className="flex flex-col gap-3 w-full text-left text-xs text-slate-400">
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-slate-500" />
                <span className="truncate text-slate-300 font-medium">{userProfile?.email}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-slate-500" />
                <span className="truncate text-slate-300 font-medium">{userProfile?.major || 'Undeclared'}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6 md:col-span-2">
          {/* Biography */}
          <Card className="border-slate-800 p-6 bg-slate-900/30 flex flex-col gap-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Compass className="w-4.5 h-4.5 text-indigo-400" />
              Biography & Summary
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed font-medium whitespace-pre-wrap">
              {userProfile?.bio || "This student hasn't entered a custom biography description yet."}
            </p>
          </Card>

          {/* Listed Skills */}
          <Card className="border-slate-800 p-6 bg-slate-900/30 flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Sparkles className="w-4.5 h-4.5 text-indigo-400" />
              Listed Technical Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {userProfile?.skills && userProfile.skills.length > 0 ? (
                userProfile.skills.map((skill) => (
                  <Badge key={skill} variant="indigo">
                    {skill}
                  </Badge>
                ))
              ) : (
                <span className="text-xs text-slate-500 italic">No skills added yet.</span>
              )}
            </div>
          </Card>

          {/* Listed Interests */}
          <Card className="border-slate-800 p-6 bg-slate-900/30 flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Heart className="w-4.5 h-4.5 text-violet-400 animate-pulse" />
              Project Domains & Interests
            </h3>
            <div className="flex flex-wrap gap-2">
              {userProfile?.interests && userProfile.interests.length > 0 ? (
                userProfile.interests.map((interest) => (
                  <Badge key={interest} variant="violet">
                    {interest}
                  </Badge>
                ))
              ) : (
                <span className="text-xs text-slate-500 italic">No domain interests added yet.</span>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
