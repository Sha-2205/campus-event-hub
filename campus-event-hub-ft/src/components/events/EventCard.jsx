import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';

export default function EventCard({ event, userId, onRegister, onUnregister }) {
  const navigate = useNavigate();
  if (!event) return null;

  const isRegistered = event.registeredUsers?.includes(userId);
  const spotsLeft = event.capacity - (event.registeredUsers?.length || 0);

  return (
    <Card
      id={`event-card-item-${event.id}`}
      hover
      onClick={() => navigate(`/events/${event.id}`)}
      className="bg-slate-900/35 hover:bg-slate-900/45 border-slate-900/80 flex flex-col justify-between h-full p-6 relative overflow-hidden group cursor-pointer"
    >
      {/* Cancelled badge overlay */}
      {event.cancelled && (
        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[1px] z-10 flex items-center justify-center">
          <span className="px-4 py-1.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-bold uppercase tracking-wider">
            Cancelled Event
          </span>
        </div>
      )}

      {/* Interactive hover border line */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex flex-col gap-4 text-left">
        <div className="flex items-center justify-between">
          <Badge variant={event.category === 'Technology' ? 'indigo' : event.category === 'Design' ? 'violet' : 'amber'}>
            {event.category}
          </Badge>
          <span className="text-[10px] text-slate-500 font-bold tracking-wider">
            {event.registeredUsers?.length || 0} / {event.capacity} ATTENDING
          </span>
        </div>

        <div>
          <h3 className="text-base font-bold text-slate-100 group-hover:text-indigo-400 transition-colors line-clamp-1">
            {event.title}
          </h3>
          <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed font-medium">
            {event.description}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-6 pt-4 border-t border-slate-900/60">
        <div className="flex flex-col gap-1.5 text-xs text-slate-400 font-medium text-left">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-slate-600" />
            <span>
              {(() => {
                if (!event || !event.date) return '';
                const dateObj = new Date(event.date);
                return isNaN(dateObj.getTime())
                  ? 'Invalid Date'
                  : dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
              })()}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <MapPin className="w-3.5 h-3.5 text-slate-600 animate-pulse" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            id={`btn-card-details-${event.id}`}
            type="button"
            onClick={() => navigate(`/events/${event.id}`)}
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
          >
            View Details
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {!event.cancelled && (
            isRegistered ? (
              <Button
                id={`btn-card-unreg-${event.id}`}
                variant="secondary"
                size="sm"
                onClick={(e) => onUnregister(e, event.id, event.title)}
                className="text-xs py-1.5 px-3 border border-indigo-500/20 text-indigo-400 font-semibold"
              >
                Leave
              </Button>
            ) : (
              <Button
                id={`btn-card-reg-${event.id}`}
                variant="primary"
                size="sm"
                onClick={(e) => onRegister(e, event.id, event.title)}
                className="text-xs py-1.5 px-3 font-semibold"
                disabled={spotsLeft <= 0}
              >
                {spotsLeft <= 0 ? 'Full' : 'Join'}
              </Button>
            )
          )}
        </div>
      </div>
    </Card>
  );
}
