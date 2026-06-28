import React from 'react';
import { Search, Filter } from 'lucide-react';
import Card from '../common/Card';
import Input from '../common/Input';

export default function EventFilters({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories = ['All', 'Technology', 'Workshop', 'Design', 'Competition']
}) {
  return (
    <Card className="border-slate-850 bg-slate-900/20 p-4 flex flex-col md:flex-row gap-4 text-left">
      <div className="flex-1">
        <Input
          placeholder="Search events by title, description, or room location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={Search}
          id="event-search-filter-input"
        />
      </div>
      
      <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider select-none shrink-0 flex items-center gap-1">
          <Filter className="w-3 h-3 text-indigo-400" />
          Category:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            id={`filter-cat-comp-${cat.toLowerCase()}`}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all shrink-0 cursor-pointer
              ${selectedCategory === cat 
                ? 'bg-indigo-600/15 text-indigo-400 border-indigo-500/30 font-bold' 
                : 'bg-transparent text-slate-400 border-slate-800/80 hover:text-slate-200 hover:bg-slate-900/40'
              }
            `}
          >
            {cat}
          </button>
        ))}
      </div>
    </Card>
  );
}
