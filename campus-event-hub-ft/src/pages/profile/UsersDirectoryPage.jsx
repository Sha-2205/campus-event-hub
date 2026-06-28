import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../../context/ProfileContext';
import { useApp } from '../../context/AppContext';
import { Search, GraduationCap, Users, Sparkles } from 'lucide-react';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import ProfileCard from '../../components/profile/ProfileCard';

export default function UsersDirectoryPage() {
  const navigate = useNavigate();
  const { fetchAllUsers, searchUsersBySkill, usersLoading } = useProfile();
  const { showToast } = useApp();

  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [skillSearchActive, setSkillSearchActive] = useState(false);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    const list = await fetchAllUsers();
    setStudents(list);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSkillSearchActive(false);
      loadStudents();
      return;
    }

    if (skillSearchActive) {
      // Find students strictly matching this exact skill query via backend search
      const results = await searchUsersBySkill(searchQuery.trim());
      setStudents(results);
      showToast(`Found ${results.length} students listing "${searchQuery}"!`, 'success');
    }
  };

  // Local filtering if we aren't using strict backend skill-matching
  const displayedStudents = skillSearchActive 
    ? students 
    : students.filter(student => 
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.major?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.skills?.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
        student.interests?.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()))
      );

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-12 font-sans animate-fade-in text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-white flex items-center gap-2">
            <GraduationCap className="w-7 h-7 text-indigo-400" />
            Campus Student Directory
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse peer profiles, filter students by expertise tags, and find partners for hackathons.
          </p>
        </div>
      </div>

      {/* Advanced Search Panel */}
      <Card className="border-slate-800 bg-slate-900/20 p-5 flex flex-col sm:flex-row gap-4 items-end">
        <form onSubmit={handleSearch} className="flex-1 flex flex-col sm:flex-row gap-3 w-full">
          <div className="flex-1">
            <Input
              placeholder={
                skillSearchActive 
                  ? "Enter skill to search strictly... (e.g. React, Node.js)" 
                  : "Search students by name, major, or listed skills..."
              }
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (!e.target.value.trim() && skillSearchActive) {
                  // auto refresh if empty
                  loadStudents();
                }
              }}
              icon={Search}
              id="directory-search-input"
            />
          </div>
          
          <Button
            type="submit"
            variant="secondary"
            id="btn-directory-search-submit"
          >
            Search
          </Button>
        </form>

        <div className="flex items-center gap-2.5 sm:mb-1 self-start sm:self-auto shrink-0">
          <button
            type="button"
            id="btn-toggle-skill-strict"
            onClick={() => {
              setSkillSearchActive(!skillSearchActive);
              setSearchQuery('');
              loadStudents();
            }}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer select-none flex items-center gap-1.5 ${
              skillSearchActive 
                ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' 
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Strict Skill Search
          </button>
        </div>
      </Card>

      {/* Grid listing */}
      {usersLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[35vh]">
          <div className="h-9 w-9 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3" />
          <span className="text-slate-500 text-xs font-semibold tracking-wider uppercase animate-pulse">
            Consulting student database...
          </span>
        </div>
      ) : displayedStudents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedStudents.map((student) => (
            <ProfileCard
              key={student.id}
              user={student}
              matchQuery={skillSearchActive ? searchQuery : ''}
            />
          ))}
        </div>
      ) : (
        <Card className="border-dashed border-slate-800 p-12 text-center bg-transparent flex flex-col items-center justify-center gap-2">
          <Users className="w-8 h-8 text-slate-600 mb-1" />
          <p className="text-slate-400 font-bold italic text-sm">No student records match your filter criteria.</p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSkillSearchActive(false);
              loadStudents();
            }}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold underline mt-2"
          >
            Reset Filters
          </button>
        </Card>
      )}
    </div>
  );
}
