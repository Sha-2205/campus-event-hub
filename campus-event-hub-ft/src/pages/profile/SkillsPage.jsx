import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../../context/ProfileContext';
import { useApp } from '../../context/AppContext';
import { ChevronLeft, Award } from 'lucide-react';
import Button from '../../components/common/Button';
import SkillsManager from '../../components/profile/SkillsManager';

export default function SkillsPage() {
  const navigate = useNavigate();
  const { profile, loading, updateSkills } = useProfile();
  const { showToast } = useApp();

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
            id="btn-skills-page-back" 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/profile/me')} 
            icon={ChevronLeft}
          >
            My Profile
          </Button>
          <span className="text-slate-400 text-sm font-semibold">Technical Expertise Workspace</span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Award className="w-6 h-6 text-indigo-400" />
          <h1 className="text-xl font-bold text-white">Manage Tech Expertise</h1>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Your skills are used to match you with hackathon teams looking for your specific stack. Add all technologies, languages, and frameworks you have experience with.
        </p>
      </div>

      <SkillsManager 
        skills={profile?.skills || []}
        onAdd={handleAddSkill}
        onRemove={handleRemoveSkill}
      />
    </div>
  );
}
