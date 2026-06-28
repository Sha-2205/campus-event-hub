import React from 'react';
import { Search, Filter } from 'lucide-react';
import Card from '../common/Card';
import Input from '../common/Input';

export default function TeamFilters({
  searchQuery,
  setSearchQuery,
  selectedEventId,
  setSelectedEventId,
  events = []
}) {
  return (
    <Card className="border-slate-850 bg-slate-900/20 p-4 flex flex-col md:flex-row gap-4 text-left">
      <div className="flex-1">
        <Input
          placeholder="Search project teams by name, skills mentioned, or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={Search}
          id="team-search-filter-input"
        />
      </div>
      
      <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider select-none shrink-0 flex items-center gap-1">
          <Filter className="w-3 h-3 text-indigo-400" />
          Filter Event:
        </span>
        <button
          type="button"
          id="filter-event-all"
          onClick={() => setSelectedEventId('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all shrink-0 cursor-pointer
            ${selectedEventId === 'all' 
              ? 'bg-indigo-600/15 text-indigo-400 border-indigo-500/30 font-bold' 
              : 'bg-transparent text-slate-400 border-slate-800/80 hover:text-slate-200 hover:bg-slate-900/40'
            }
          `}
        >
          All Events
        </button>
        {events.map((ev) => (
          <button
            key={ev.id}
            type="button"
            id={`filter-event-${ev.id}`}
            onClick={() => setSelectedEventId(ev.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all shrink-0 cursor-pointer max-w-[150px] truncate
              ${selectedEventId === ev.id 
                ? 'bg-indigo-600/15 text-indigo-400 border-indigo-500/30 font-bold' 
                : 'bg-transparent text-slate-400 border-slate-800/80 hover:text-slate-200 hover:bg-slate-900/40'
              }
            `}
            title={ev.title}
          >
            {ev.title}
          </button>
        ))}
      </div>
    </Card>
  );
}
