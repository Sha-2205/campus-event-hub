import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users } from 'lucide-react';
import Card from '../common/Card';

export default function AttendeesList({ attendees = [] }) {
  const navigate = useNavigate();

  return (
    <Card className="border-slate-800 p-6 bg-slate-900/30 flex flex-col gap-4 text-left">
      <div className="flex items-center justify-between border-b border-slate-900/60 pb-3">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 select-none">
          <Users className="w-4.5 h-4.5 text-indigo-400" />
          Attendees ({attendees.length})
        </h3>
      </div>

      <div className="flex flex-col gap-2.5 max-h-56 overflow-y-auto pr-1">
        {attendees.length > 0 ? (
          attendees.map((attendee) => (
            <div 
              key={attendee.id} 
              onClick={() => navigate(`/profile/${attendee.id}`)}
              className="flex items-center gap-2.5 cursor-pointer p-1.5 rounded-lg hover:bg-slate-900/50 transition-all group"
            >
              <img 
                src={attendee.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop'} 
                alt={attendee.name} 
                className="h-7.5 w-7.5 rounded-lg object-cover ring-1 ring-slate-800 group-hover:ring-indigo-500/30 transition-all"
                referrerPolicy="no-referrer"
              />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-300 group-hover:text-indigo-400 transition-colors">{attendee.name}</span>
                <span className="text-[9px] text-slate-500 font-semibold">{attendee.major || 'General Science'}</span>
              </div>
            </div>
          ))
        ) : (
          <span className="text-xs text-slate-500 italic py-2 font-medium">No attendees registered yet. Be the first!</span>
        )}
      </div>
    </Card>
  );
}
