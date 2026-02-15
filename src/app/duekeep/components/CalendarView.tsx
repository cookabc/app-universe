import React, { useMemo, useState } from 'react';
import { CalendarPicker } from './CalendarPicker';
import { EventItem } from '../types';

interface CalendarViewProps {
  events: EventItem[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({ events }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  });

  const selectedLabel = useMemo(() => {
    return selectedDate.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  }, [selectedDate]);

  const dailyEvents = useMemo(() => {
    return events.filter(e => 
      e.date.getFullYear() === selectedDate.getFullYear() &&
      e.date.getMonth() === selectedDate.getMonth() &&
      e.date.getDate() === selectedDate.getDate()
    );
  }, [events, selectedDate]);

  return (
     <div className="flex-1 flex flex-col h-full bg-background-light dark:bg-background-dark">
      <header className="pt-14 pb-2 px-5 sticky top-0 z-20 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md">
        <h1 className="text-[34px] leading-tight font-bold tracking-tight text-gray-900 dark:text-white">Calendar</h1>
      </header>
      
      <main className="flex-1 overflow-y-auto px-4 pt-2 pb-28 space-y-6 no-scrollbar">
         <CalendarPicker selectedDate={selectedDate} onChange={setSelectedDate} />
         
         <div className="space-y-4">
            <h2 className="ml-1 text-[17px] font-semibold text-gray-900 dark:text-white">{selectedLabel}</h2>
            
            <div className="space-y-3">
                {dailyEvents.length > 0 ? (
                  dailyEvents.map(event => (
                    <EventRow 
                      key={event.id}
                      color={event.color} 
                      title={event.name} 
                      time={event.isAllDay ? 'All Day' : event.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
                      location={event.category} 
                    />
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 ml-1">No events for this day</p>
                )}
            </div>
         </div>
      </main>
    </div>
  )
}

type EventRowProps = {
  color: string;
  title: string;
  time: string;
  location: string;
};

const EventRow: React.FC<EventRowProps> = ({ color, title, time, location }) => (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-4 shadow-sm flex items-start space-x-4">
        <div className="w-1 h-10 rounded-full mt-1" style={{ backgroundColor: color }}></div>
        <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white text-[17px]">{title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{time}</p>
            <div className="flex items-center mt-2 text-gray-400 dark:text-gray-500">
                <span className="material-icons-round text-sm mr-1">label</span>
                <span className="text-xs">{location}</span>
            </div>
        </div>
    </div>
);
