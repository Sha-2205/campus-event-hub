import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useApp } from '../../context/AppContext';
import { Search, Sparkles, ChevronLeft, GraduationCap } from 'lucide-react';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

export default function SkillSearchPage() {
  const navigate = useNavigate();
  const { showToast } = useApp();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        setLoading(true);
       const response = await api.get(
  `/api/profile/search/skills?skills=${encodeURIComponent(query)}`
);
        setResults(response.data || []);
      } catch (err) {
        showToast('Failed to query skills directory.', 'error');
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-12 font-sans animate-fade-in">
      <div className="flex items-center gap-3">
        <Button 
          id="btn-back-to-dashboard-skill-search" 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/')} 
          icon={ChevronLeft}
        >
          Dashboard
        </Button>
        <span className="text-slate-500 text-sm font-semibold">Campus Discovery Engine</span>
      </div>

      <div>
        <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
          <Sparkles className="w-6.5 h-6.5 text-indigo-400 animate-pulse" />
          Skill-Based Student Search
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Directly locate students who possess specific skillsets and expertise required for your hackathon teams.
        </p>
      </div>

      {/* Search Input Bar */}
      <Card className="border-slate-850 bg-slate-900/20 p-4">
        <Input
          placeholder="Type a skill name to search (e.g. React, Python, Figma, SQL, Linux)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          icon={Search}
          id="skill-search-input-field"
        />
      </Card>

      {/* Results Section */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[30vh]">
          <div className="h-8 w-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : query.trim() === '' ? (
        <Card className="border-dashed border-slate-800 p-12 text-center bg-transparent">
          <p className="text-slate-400 font-semibold italic text-sm">
            Enter a skill name above to start searching campus talent.
          </p>
        </Card>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((student) => (
            <Card
              key={student.id}
              id={`skill-student-card-${student.id}`}
              hover
              onClick={() => navigate(`/profile/${student.id}`)}
              className="bg-slate-900/35 hover:bg-slate-900/45 border-slate-900/80 flex flex-col justify-between p-6 h-full"
            >
              <div className="flex items-start gap-4">
                <img
                  src={student.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'}
                  alt={student.name}
                  className="h-12 w-12 rounded-xl object-cover ring-2 ring-indigo-500/10 shrink-0"
                />
                <div className="text-left">
                  <h3 className="text-sm font-bold text-slate-100 hover:text-indigo-400 transition-colors">
                    {student.name}
                  </h3>
                  <span className="text-[10px] text-indigo-400 font-bold block mt-0.5 uppercase tracking-wider">
                    {student.major}
                  </span>
                  <p className="text-xs text-slate-400 mt-2.5 line-clamp-2 leading-relaxed font-medium">
                    {student.bio || "Student is ready to join hackathon teams and collaborate on exciting ideas."}
                  </p>
                </div>
              </div>

              {/* Badges footer */}
              <div className="flex flex-col gap-2 mt-5 pt-3 border-t border-slate-900/50">
                {student.skills.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[9px] font-bold text-slate-500 uppercase">Skills:</span>
                    {student.skills.map(s => {
                      const isMatch = s.toLowerCase().includes(query.toLowerCase());
                      return (
                        <Badge 
                          key={s} 
                          variant={isMatch ? "indigo" : "slate"} 
                          className={`text-[9px] py-0 px-1.5 ${!isMatch ? "bg-slate-950/40" : ""}`}
                        >
                          {s}
                        </Badge>
                      );
                    })}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed border-slate-800 p-12 text-center bg-transparent">
          <p className="text-slate-400 font-semibold italic text-sm">
            No students found on campus matching the skill "{query}".
          </p>
        </Card>
      )}
    </div>
  );
}
