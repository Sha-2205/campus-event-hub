import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useApp } from '../../context/AppContext';
import { Search, Compass, GraduationCap, Sparkles } from 'lucide-react';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

export default function UsersPage() {
  const navigate = useNavigate();
  const { showToast } = useApp();

  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadAllStudents() {
      try {
        setLoading(true);
        const response = await api.get('/api/profile/users/all');
        setUsersList(response.data);
      } catch (err) {
        showToast('Failed to load student records directory.', 'error');
      } finally {
        setLoading(false);
      }
    }
    loadAllStudents();
  }, []);

  const filteredUsers = usersList.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.major.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-12 font-sans animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
          <GraduationCap className="w-6.5 h-6.5 text-indigo-400" />
          Campus Student Directory
        </h1>
        <p className="text-xs text-slate-400 mt-1">Discover peer student profiles, browse listed tech expertises, and review project bios.</p>
      </div>

      {/* Search Bar Input */}
      <Card className="border-slate-850 bg-slate-900/20 p-4">
        <Input
          placeholder="Search students by name, major/stream, or specific skills (e.g. React, Python)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={Search}
          id="student-search-bar"
        />
      </Card>

      {/* Grid listing */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[30vh]">
          <div className="h-8 w-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredUsers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((student) => (
            <Card
              key={student.id}
              id={`student-card-${student.id}`}
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
                  <span className="text-[10px] text-indigo-400 font-bold block mt-0.5 uppercase tracking-wider">{student.major}</span>
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
                    {student.skills.slice(0, 3).map(s => (
                      <Badge key={s} variant="slate" className="text-[9px] py-0 px-1.5 bg-slate-950/40">{s}</Badge>
                    ))}
                    {student.skills.length > 3 && (
                      <span className="text-[9px] text-slate-600 font-bold font-mono">+{student.skills.length - 3}</span>
                    )}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed border-slate-800 p-12 text-center bg-transparent">
          <p className="text-slate-400 font-semibold italic text-sm">No student records match your filters.</p>
        </Card>
      )}
    </div>
  );
}
