import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../../context/ProfileContext';
import { useApp } from '../../context/AppContext';
import { User, BookOpen, FileText, Check, ChevronLeft, Image } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

export default function EditProfilePage() {
  const navigate = useNavigate();
  const { profile, loading, updateProfile } = useProfile();
  const { showToast } = useApp();

  const [bio, setBio] = useState('');
  const [major, setMajor] = useState('');
  const [avatar, setAvatar] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setBio(profile.bio || '');
      setMajor(profile.major || '');
      setAvatar(profile.avatar || '');
    }
  }, [profile]);

  const AVATAR_OPTIONS = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=face'
  ];

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const res = await updateProfile({ bio, major, avatar });
      if (res.success) {
        showToast('Profile updated!', 'success');
        navigate('/profile/me');
      } else {
        showToast(res.error, 'error');
      }
    } catch (err) {
      showToast('Error saving profile.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading && !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] w-full">
        <div className="h-8 w-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full pb-12 font-sans animate-fade-in text-left">
      <div className="flex items-center gap-3">
        <Button 
          id="btn-edit-profile-back" 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/profile/me')} 
          icon={ChevronLeft}
        >
          Cancel
        </Button>
        <span className="text-slate-400 text-sm font-semibold">Edit Student Details</span>
      </div>

      <Card className="border-slate-800 bg-slate-900/30 p-6 flex flex-col gap-6">
        <div className="border-b border-slate-800/60 pb-4">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-400" />
            Profile Customization
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Update your campus bio, choose your avatar, and specify your current major.
          </p>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-5">
          <Input
            label="Academic Stream / Major"
            value={major}
            onChange={(e) => setMajor(e.target.value)}
            placeholder="e.g. Computer Science, Electrical Engineering"
            icon={BookOpen}
            id="edit-profile-major"
            required
          />

          <div className="flex flex-col gap-1.5">
            <label htmlFor="edit-bio" className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
              Biography / Intro Pitch
            </label>
            <textarea
              id="edit-bio"
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-slate-950/40 border border-slate-850 text-sm text-slate-100 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10 placeholder:text-slate-600 resize-none font-medium"
              placeholder="Tell peers what you are build-focused on, your hackathon goals, or any special experience you possess."
              required
            />
          </div>

          <div className="flex flex-col gap-2.5 mt-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
              <Image className="w-4 h-4 text-indigo-400" />
              Select Profile Avatar
            </span>
            <div className="grid grid-cols-6 gap-3">
              {AVATAR_OPTIONS.map((avUrl, index) => (
                <button
                  key={avUrl}
                  type="button"
                  id={`btn-avatar-select-page-${index}`}
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

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800/60">
            <Button
              id="btn-edit-profile-submit"
              type="submit"
              variant="primary"
              disabled={isSaving}
              icon={Check}
            >
              {isSaving ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
