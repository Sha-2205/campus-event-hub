import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { Mail, BookOpen, ExternalLink, Sparkles } from 'lucide-react';

export default function ProfileCard({ user, matchQuery = '' }) {
  const navigate = useNavigate();
  if (!user) return null;

  // Highlights match if a search query is active
  const isSkillMatched = (skill) => {
    if (!matchQuery) return false;
    return skill.toLowerCase().includes(matchQuery.toLowerCase());
  };

  return (
    <Card
      id={`student-profile-card-${user.id}`}
      hover
      onClick={() => navigate(`/profile/${user.id}`)}
      className="bg-slate-900/35 hover:bg-slate-900/50 border-slate-800/80 hover:border-slate-700/60 flex flex-col justify-between p-6 h-full transition-all duration-300 relative group cursor-pointer"
    >
      {/* Decorative hover gradient border indicator */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex flex-col gap-4 text-left">
        <div className="flex items-start gap-4">
          <div className="h-14 w-14 rounded-xl overflow-hidden shrink-0 ring-2 ring-indigo-500/10 border border-indigo-500/20 shadow-md">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'}
              alt={user.name}
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-slate-100 group-hover:text-indigo-400 transition-colors truncate">
                {user.name}
              </h3>
              <ExternalLink className="w-3.5 h-3.5 text-slate-600 group-hover:text-indigo-400 transition-all opacity-0 group-hover:opacity-100" />
            </div>
            
            <div className="flex items-center gap-1.5 mt-0.5">
              <BookOpen className="w-3 h-3 text-indigo-400" />
              <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider truncate">
                {user.major || 'Computer Science'}
              </span>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed font-medium line-clamp-3">
          {user.bio || 'This student is passionate about tech and looking forward to joining project squads.'}
        </p>
      </div>

      <div className="flex flex-col gap-2.5 mt-5 pt-3.5 border-t border-slate-800/40">
        {user.skills && user.skills.length > 0 ? (
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide mr-1 shrink-0">Skills:</span>
            {user.skills.slice(0, 3).map((skill) => {
              const matched = isSkillMatched(skill);
              return (
                <Badge
                  key={skill}
                  variant={matched ? 'indigo' : 'slate'}
                  className={`text-[9px] py-0 px-1.5 font-semibold ${
                    matched ? 'bg-indigo-500/15 border-indigo-500/20 text-indigo-400 shadow-sm animate-pulse' : 'bg-slate-950/40'
                  }`}
                >
                  {skill}
                </Badge>
              );
            })}
            {user.skills.length > 3 && (
              <span className="text-[9px] text-slate-500 font-bold font-mono">+{user.skills.length - 3}</span>
            )}
          </div>
        ) : (
          <div className="text-[10px] text-slate-600 italic font-medium">No skills listed yet</div>
        )}

        {user.interests && user.interests.length > 0 && (
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide mr-1 shrink-0">Domains:</span>
            {user.interests.slice(0, 2).map((interest) => (
              <Badge
                key={interest}
                variant="violet"
                className="text-[9px] py-0 px-1.5 font-semibold bg-violet-500/10 border-violet-500/15 text-violet-400"
              >
                {interest}
              </Badge>
            ))}
            {user.interests.length > 2 && (
              <span className="text-[9px] text-slate-500 font-bold font-mono">+{user.interests.length - 2}</span>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
