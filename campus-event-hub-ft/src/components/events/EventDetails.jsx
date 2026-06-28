import React from 'react';
import { Calendar, MapPin } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';

export default function EventDetails({ event }) {
  if (!event) return null;

  return (
    <Card className="border-slate-800 p-6 md:p-8 bg-slate-900/30 flex flex-col gap-5 relative overflow-hidden text-left">
      {event.cancelled && (
        <div className="absolute top-4 right-4 px-3.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-bold uppercase select-none animate-pulse">
          Cancelled
        </div>
      )}

      <div className="flex flex-col gap-2.5">
        <div className="flex">
          <Badge variant={event.category === 'Technology' ? 'indigo' : event.category === 'Design' ? 'violet' : 'amber'}>
            {event.category}
          </Badge>
        </div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-white mt-1">
          {event.title}
        </h1>
      </div>

      <p className="text-sm text-slate-300 font-medium leading-relaxed whitespace-pre-wrap">
        {event.description}
      </p>

      <div className="h-px bg-slate-800/60 my-2" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-400 font-medium">
        <div className="flex items-center gap-3 bg-slate-950/20 p-3.5 rounded-xl border border-slate-900">
          <Calendar className="w-5 h-5 text-indigo-400" />
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Schedule Date & Time</p>
            <p className="text-slate-200 mt-0.5 font-semibold">
              {(() => {
                if (!event || !event.date) return '';
                const dateObj = new Date(event.date);
                return isNaN(dateObj.getTime())
                  ? 'Invalid Date'
                  : dateObj.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
              })()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-slate-950/20 p-3.5 rounded-xl border border-slate-900">
          <MapPin className="w-5 h-5 text-indigo-400" />
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Room / Location</p>
            <p className="text-slate-200 mt-0.5 font-semibold">{event.location}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
