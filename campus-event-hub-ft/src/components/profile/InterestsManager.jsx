import React, { useState } from 'react';
import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';
import { Sparkles, Plus, Tag } from 'lucide-react';

export default function InterestsManager({ interests = [], onAdd, onRemove }) {
  const [newInterest, setNewInterest] = useState('');

  const POPULAR_INTERESTS = [
    'Hackathons', 'Web Development', 'Artificial Intelligence', 'Cybersecurity', 
    'Mobile Apps', 'UX/UI Design', 'Game Development', 'Cloud Computing', 
    'Blockchain', 'Competitive Coding', 'Product Management'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newInterest.trim()) return;
    onAdd(newInterest.trim());
    setNewInterest('');
  };

  const remainingPopular = POPULAR_INTERESTS.filter(i => 
    !interests.some(existing => existing.toLowerCase() === i.toLowerCase())
  );

  return (
    <Card className="border-slate-800 p-6 bg-slate-900/30 flex flex-col gap-5 text-left">
      <div>
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Sparkles className="w-4.5 h-4.5 text-violet-400 animate-pulse" />
          Project Domains & Interests
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Specify what kinds of events and topics excite you.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2.5">
        <div className="flex-1">
          <Input
            placeholder="Search or enter interest (e.g. Fintech)..."
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            icon={Tag}
            id="interests-mgr-input"
          />
        </div>
        <Button 
          type="submit" 
          variant="secondary" 
          icon={Plus}
          id="btn-interests-mgr-add"
        >
          Add
        </Button>
      </form>

      {/* Active Interests List */}
      <div className="flex flex-wrap gap-2 min-h-8">
        {interests.length > 0 ? (
          interests.map((interest) => (
            <div 
              key={interest} 
              className="flex items-center gap-1.5 bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 px-3 py-1.5 rounded-xl border border-violet-500/15 text-xs font-semibold transition-all select-none group"
            >
              <span>{interest}</span>
              <button
                type="button"
                id={`btn-remove-interest-${interest.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                onClick={() => onRemove(interest)}
                className="hover:text-rose-400 text-slate-500 text-[10px] ml-1.5 cursor-pointer font-bold transition-colors"
              >
                ✕
              </button>
            </div>
          ))
        ) : (
          <span className="text-xs text-slate-500 font-medium italic">No domains listed yet. Select below to customize.</span>
        )}
      </div>

      {/* Popular Suggestions */}
      {remainingPopular.length > 0 && (
        <div className="mt-2 pt-4 border-t border-slate-800/40">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2.5">
            Suggested Campus Domains
          </span>
          <div className="flex flex-wrap gap-2">
            {remainingPopular.slice(0, 6).map((pop) => (
              <button
                key={pop}
                type="button"
                id={`btn-suggest-interest-${pop.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                onClick={() => onAdd(pop)}
                className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-violet-400 hover:border-violet-500/20 text-xs font-semibold transition-all cursor-pointer select-none"
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
