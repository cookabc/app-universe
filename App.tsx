import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Dashboard } from './components/Dashboard';
import { AddEvent } from './components/AddEvent';
import { IOSStatusBar, IOSHomeIndicator } from './components/IOSChrome';
import { MOCK_EVENTS } from './constants';
import { EventItem } from './types';

const App: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem('events');
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as (Omit<EventItem, 'date'> & { date: string })[];
        const restored = parsed.map(e => ({ ...e, date: new Date(e.date) })) as EventItem[];
        setEvents(restored.length > 0 ? restored : MOCK_EVENTS);
        setHasLoaded(true);
        return;
      } catch {}
    }
    setEvents(MOCK_EVENTS);
    setHasLoaded(true);
  }, []);

  useEffect(() => {
    if (!hasLoaded) return;
    const serializable = events.map(e => ({ ...e, date: e.date.toISOString() }));
    localStorage.setItem('events', JSON.stringify(serializable));
  }, [events, hasLoaded]);

  const addEvent = (e: EventItem) => {
    setEvents(prev => [e, ...prev]);
  };

  return (
    <Router>
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-black py-0 sm:py-10">
        <div className="w-full max-w-md h-screen sm:h-[844px] bg-background-light dark:bg-background-dark sm:rounded-[40px] shadow-2xl relative overflow-hidden ring-8 ring-black">
          <IOSStatusBar />
          <Routes>
            <Route path="/" element={<Dashboard events={events} />} />
            <Route path="/add" element={<AddEvent events={events} addEvent={addEvent} />} />
          </Routes>
          <IOSHomeIndicator />
        </div>
      </div>
    </Router>
  );
};

export default App;
