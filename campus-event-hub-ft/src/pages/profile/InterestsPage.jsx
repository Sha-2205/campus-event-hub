import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../../context/ProfileContext';
import { useApp } from '../../context/AppContext';
import { ChevronLeft, Compass } from 'lucide-react';
import Button from '../../components/common/Button';
import InterestsManager from '../../components/profile/InterestsManager';

export default function InterestsPage() {
  const navigate = useNavigate();
  const { profile, loading, updateInterests } = useProfile();
  const { showToast } = useApp();

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
      <div className="flex flex-col items-center justify-center min-h-[40vh] w-full">
        <div className="h-8 w-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full pb-12 font-sans animate-fade-in text-left">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button 
            id="btn-interests-page-back" 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/profile/me')} 
            icon={ChevronLeft}
          >
            My Profile
          </Button>
          <span className="text-slate-400 text-sm font-semibold">Domains & Interests Workspace</span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Compass className="w-6 h-6 text-violet-400" />
          <h1 className="text-xl font-bold text-white">Manage Domains & Interests</h1>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Select hackathon topics, industry fields, and specialized categories you are excited to explore or master during your team builds.
        </p>
      </div>

      <InterestsManager 
        interests={profile?.interests || []}
        onAdd={handleAddInterest}
        onRemove={handleRemoveInterest}
      />
    </div>
  );
}
