import React, { useState } from 'react';
import { useProfile } from '../../context/ProfileContext';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { User, Mail, BookOpen, FileText, Check, Edit2, Sparkles, Award } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import SkillsManager from '../../components/profile/SkillsManager';
import InterestsManager from '../../components/profile/InterestsManager';

export default function MyProfilePage() {
  const { 
    profile, 
    loading, 
    updateProfile, 
    updateSkills, 
    updateInterests 
  } = useProfile();
  
  const { user } = useAuth();
  const { showToast } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(profile?.bio || '');
  const [major, setMajor] = useState(profile?.major || '');
  const [avatar, setAvatar] = useState(profile?.avatar || '');

  const AVATAR_OPTIONS = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=face'
  ];

  const handleProfileSave = async () => {
    const result = await updateProfile({ bio, major, avatar });
    if (result.success) {
      setIsEditing(false);
      showToast('Student profile updated successfully!', 'success');
    } else {
      showToast(result.error, 'error');
    }
  };

  const handleAddSkill = async (newSkill) => {
    if (profile?.skills?.some(s => s.toLowerCase() === newSkill.toLowerCase())) {
      showToast('Skill already added.', 'info');
      return;
    }
    const updated = [...(profile?.skills || []), newSkill];
    const result = await updateSkills(updated);
    if (result.success) {
      showToast(`Skill "${newSkill}" listed!`, 'success');
    }
  };

  const handleRemoveSkill = async (skillToRemove) => {
    const updated = profile?.skills?.filter(s => s !== skillToRemove) || [];
    const result = await updateSkills(updated);
    if (result.success) {
      showToast('Skill removed.', 'success');
    }
  };

  const handleAddInterest = async (newInterest) => {
    if (profile?.interests?.some(i => i.toLowerCase() === newInterest.toLowerCase())) {
      showToast('Interest already added.', 'info');
      return;
    }
    const updated = [...(profile?.interests || []), newInterest];
    const result = await updateInterests(updated);
    if (result.success) {
      showToast(`Domain "${newInterest}" listed!`, 'success');
    }
  };

  const handleRemoveInterest = async (interestToRemove) => {
    const updated = profile?.interests?.filter(i => i !== interestToRemove) || [];
    const result = await updateInterests(updated);
    if (result.success) {
      showToast('Domain interest removed.', 'success');
    }
  };

  if (loading && !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[45vh] w-full">
        <div className="h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <span className="text-slate-400 text-xs font-bold uppercase tracking-wider animate-pulse">
          Loading student credentials...
        </span>
      </div>
    );
  }

  const activeAvatar = profile?.avatar || AVATAR_OPTIONS[0];

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto w-full pb-12 font-sans animate-fade-in text-left">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-extrabold tracking-tight text-white flex items-center gap-2">
            <User className="w-6.5 h-6.5 text-indigo-400" />
            My Student Profile
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Display your major, project specialties, and let team leaders find you on campus.
          </p>
        </div>
        
        {!isEditing ? (
          <Button 
            id="profile-btn-edit-master"
            variant="secondary" 
            icon={Edit2}
            onClick={() => {
              setBio(profile?.bio || '');
              setMajor(profile?.major || '');
              setAvatar(profile?.avatar || '');
              setIsEditing(true);
            }}
          >
            Edit Profile
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button 
              id="profile-btn-cancel-master"
              variant="outline" 
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
            <Button 
              id="profile-btn-save-master"
              variant="primary" 
              icon={Check}
              onClick={handleProfileSave}
            >
              Save Changes
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Avatar Cards and Info Summary */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          <Card className="border-slate-800 flex flex-col items-center text-center p-6 bg-slate-900/30">
            <div className="h-28 w-28 rounded-2xl overflow-hidden ring-4 ring-indigo-500/10 border border-indigo-500/20 mb-4.5 relative group">
              <img 
                src={activeAvatar} 
                alt={profile?.name} 
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>

            <h2 className="text-xl font-bold text-slate-100">{profile?.name}</h2>
            <span className="text-xs font-semibold text-indigo-400 mt-1 px-2.5 py-1 rounded-full bg-indigo-500/5 border border-indigo-500/10">
              {profile?.major || 'General Engineering'}
            </span>

            <div className="h-px bg-slate-800/60 my-5 w-full" />

            <div className="flex flex-col gap-3.5 w-full text-left text-xs text-slate-400">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                <span className="truncate font-semibold text-slate-300">{profile?.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <BookOpen className="w-4 h-4 text-slate-500 shrink-0" />
                <span className="font-semibold text-slate-300">{profile?.major || 'Undeclared'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Award className="w-4 h-4 text-slate-500 shrink-0" />
                <span className="font-semibold text-slate-300">
                  {profile?.skills?.length || 0} Registered Skill Tags
                </span>
              </div>
            </div>
          </Card>

          {/* Quick Stats list */}
          <Card className="border-slate-800 p-5 bg-slate-900/30 text-left">
            <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-3">Campus Badge Roles</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/15 text-emerald-400 uppercase">
                Verified Student
              </span>
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-indigo-500/10 border border-indigo-500/15 text-indigo-400 uppercase">
                Team Candidate
              </span>
            </div>
          </Card>
        </div>

        {/* Right Column: Bio updates, Skill inputs, Interest tags */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Biography and Basic Fields Form */}
          <Card className="border-slate-800 p-6 bg-slate-900/30 flex flex-col gap-4 text-left">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <FileText className="w-4.5 h-4.5 text-indigo-400" />
              Student Bio & Academic Major
            </h3>

            {isEditing ? (
              <div className="flex flex-col gap-4 animate-fade-in">
                <Input
                  label="Academic Stream or Major"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  id="profile-major-form-input"
                  placeholder="e.g. Computer Science & AI"
                />

                <div className="flex flex-col gap-1.5 mt-1">
                  <label htmlFor="bio-edit-textarea" className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                    Student Bio / Pitch
                  </label>
                  <textarea
                    id="bio-edit-textarea"
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full bg-slate-950/40 border border-slate-850 text-sm text-slate-100 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10 placeholder:text-slate-600 resize-none font-medium"
                    placeholder="Describe your design stack, coding expertise, or what projects you are eager to collaborate on."
                  />
                </div>

                {/* Avatar Selection Grid */}
                <div className="flex flex-col gap-2 mt-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Choose Avatar Icon
                  </span>
                  <div className="grid grid-cols-6 gap-3">
                    {AVATAR_OPTIONS.map((avUrl, index) => (
                      <button
                        key={avUrl}
                        type="button"
                        id={`btn-avatar-choice-${index}`}
                        onClick={() => setAvatar(avUrl)}
                        className={`h-11 w-11 rounded-xl overflow-hidden border-2 relative cursor-pointer ${
                          avatar === avUrl ? 'border-indigo-500 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                        } transition-all`}
                      >
                        <img src={avUrl} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                        {avatar === avUrl && (
                          <div className="absolute inset-0 bg-indigo-500/20 flex items-center justify-center">
                            <Check className="w-4.5 h-4.5 text-indigo-400 font-bold" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-300 leading-relaxed font-medium whitespace-pre-wrap">
                {profile?.bio || "Describe your background, what projects you are working on, or team matching requirements. Press 'Edit Profile' to write one."}
              </p>
            )}
          </Card>

          {/* Modular Skills Manager */}
          <SkillsManager 
            skills={profile?.skills || []}
            onAdd={handleAddSkill}
            onRemove={handleRemoveSkill}
          />

          {/* Modular Interests Manager */}
          <InterestsManager 
            interests={profile?.interests || []}
            onAdd={handleAddInterest}
            onRemove={handleRemoveInterest}
          />

        </div>
      </div>
    </div>
  );
}
