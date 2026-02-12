import React, { useMemo } from 'react';
import { EventItem } from '../types';
import { calculateCountdown } from '../utils/dateUtils';

interface EventCardProps {
  event: EventItem;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const { diffValue, diffUnit, label } = useMemo(() => {
    return calculateCountdown(event.date);
  }, [event.date]);

  const dateString = event.date.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div 
      className="rounded-[20px] p-5 flex items-center shadow-lg relative overflow-hidden group transition-transform hover:scale-[1.02] active:scale-[0.98] duration-200"
      style={{ backgroundColor: event.color, color: event.textColor }}
    >
      <div className="flex-1 pr-4 z-10">
        <h3 className="text-2xl font-bold mb-1">{event.name}</h3>
        <p className="text-sm font-bold opacity-70">{dateString}</p>
      </div>
      
      {/* Divider */}
      <div className="w-px h-12 bg-black/10 mx-2 z-10"></div>
      
      <div className="flex flex-col items-center justify-center w-24 text-center pl-2 z-10">
        <span className="text-4xl font-bold leading-none">{diffValue}</span>
        <span className="text-[10px] font-bold uppercase tracking-wide opacity-70 mt-1">
          {label}
        </span>
      </div>

      {/* Glossy effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>
    </div>
  );
};