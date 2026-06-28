import React, { useState } from 'react';
import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';
import { Sparkles, Plus, Search, Tag } from 'lucide-react';

export default function SkillsManager({ skills = [], onAdd, onRemove }) {
  const [newSkill, setNewSkill] = useState('');

  const POPULAR_SKILLS = [
    'React', 'Node.js', 'Python', 'Machine Learning', 'Figma', 
    'TypeScript', 'Tailwind CSS', 'SQL', 'Git', 'Data Science', 
    'Java', 'C++', 'Docker', 'AWS'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    onAdd(newSkill.trim());
    setNewSkill('');
  };

  const remainingPopular = POPULAR_SKILLS.filter(s => 
    !skills.some(existing => existing.toLowerCase() === s.toLowerCase())
  );

  return (
    <Card className="border-slate-800 p-6 bg-slate-900/30 flex flex-col gap-5 text-left">
      <div>
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Sparkles className="w-4.5 h-4.5 text-indigo-400 animate-pulse" />
          Technical Skills & Expertise
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Add skills to boost your hackathon and team match rates.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2.5">
        <div className="flex-1">
          <Input
            placeholder="Search or enter a new skill (e.g. Kotlin)..."
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            icon={Tag}
            id="skills-mgr-input"
          />
        </div>
        <Button 
          type="submit" 
          variant="secondary" 
          icon={Plus}
          id="btn-skills-mgr-add"
        >
          Add
        </Button>
      </form>

      {/* Active Skills List */}
      <div className="flex flex-wrap gap-2 min-h-8">
        {skills.length > 0 ? (
          skills.map((skill) => (
            <div 
              key={skill} 
              className="flex items-center gap-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 px-3 py-1.5 rounded-xl border border-indigo-500/15 text-xs font-semibold transition-all select-none group"
            >
              <span>{skill}</span>
              <button
                type="button"
                id={`btn-remove-skill-${skill.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                onClick={() => onRemove(skill)}
                className="hover:text-rose-400 text-slate-500 text-[10px] ml-1.5 cursor-pointer font-bold transition-colors"
              >
                ✕
              </button>
            </div>
          ))
        ) : (
          <span className="text-xs text-slate-500 font-medium italic">No skills listed yet. Add skills below to configure.</span>
        )}
      </div>

      {/* Popular Suggestions */}
      {remainingPopular.length > 0 && (
        <div className="mt-2 pt-4 border-t border-slate-800/40">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2.5">
            Suggested Campus Techs
          </span>
          <div className="flex flex-wrap gap-2">
            {remainingPopular.slice(0, 8).map((pop) => (
              <button
                key={pop}
                type="button"
                id={`btn-suggest-skill-${pop.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                onClick={() => onAdd(pop)}
                className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-indigo-400 hover:border-indigo-500/20 text-xs font-semibold transition-all cursor-pointer select-none"
              >
                + {pop}
              </button>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
