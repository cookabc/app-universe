import React, { createContext, useContext, useState, useEffect } from 'react';
import { EventItem, EVENT_CATEGORIES, EventCategory } from '../types';
import { MOCK_EVENTS } from '../constants';

interface AppContextType {
  events: EventItem[];
  setEvents: React.Dispatch<React.SetStateAction<EventItem[]>>;
  addEvent: (e: EventItem) => void;
  updateEvent: (e: EventItem) => void;
  deleteEvent: (id: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<EventItem[]>(MOCK_EVENTS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('events');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const restored = parsed.map((e: unknown) => {
            if (typeof e !== 'object' || e === null) return null;
            const item = e as Record<string, unknown>;
            
            let cat: EventCategory = 'General';
            if (typeof item.category === 'string' && EVENT_CATEGORIES.includes(item.category as EventCategory)) {
              cat = item.category as EventCategory;
            }

            const dateStr = typeof item.date === 'string' ? item.date : '';
            const dateObj = new Date(dateStr);
            const validDate = isNaN(dateObj.getTime()) ? new Date() : dateObj;

            return {
              ...item,
              id: typeof item.id === 'string' ? item.id : crypto.randomUUID(),
              name: typeof item.name === 'string' ? item.name : 'Untitled Event',
              date: validDate,
              isAllDay: typeof item.isAllDay === 'boolean' ? item.isAllDay : false,
              alertEnabled: typeof item.alertEnabled === 'boolean' ? item.alertEnabled : true,
              repeatOption: typeof item.repeatOption === 'string' ? item.repeatOption : 'Never',
              category: cat,
              color: typeof item.color === 'string' ? item.color : '#007AFF',
              textColor: typeof item.textColor === 'string' ? item.textColor : '#FFFFFF',
              type: (item.type === 'past' || item.type === 'future') ? item.type : 'future'
            } as EventItem;
          }).filter((e): e is EventItem => e !== null);
          
          if (restored.length > 0) {
            setEvents(restored);
          }
        }
      }
    } catch (error) {
      console.error('Failed to load events from localStorage:', error);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    const serializable = events.map(e => ({ ...e, date: e.date.toISOString() }));
    localStorage.setItem('events', JSON.stringify(serializable));
  }, [events, isLoaded]);

  const addEvent = (e: EventItem) => {
    setEvents(prev => [e, ...prev]);
  };

  const updateEvent = (e: EventItem) => {
    setEvents(prev => prev.map(ev => ev.id === e.id ? e : ev));
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  return (
    <AppContext.Provider value={{ events, setEvents, addEvent, updateEvent, deleteEvent }}>
      {children}
    </AppContext.Provider>
  );
};
