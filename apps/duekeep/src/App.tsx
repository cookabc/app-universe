import React from 'react';
import { HashRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Dashboard } from './components/Dashboard';
import { AddEvent } from './components/AddEvent';
import { IOSStatusBar, IOSHomeIndicator } from './components/IOSChrome';
import { EventItem } from './types';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AppProvider, useAppContext } from './context/AppContext';

const AppContent: React.FC = () => {
  const { events, addEvent, updateEvent, deleteEvent } = useAppContext();
  const navigate = useNavigate();
  // Location is used by router but not here directly, removing unused var
  useLocation();

  const handleAddEvent = (e: EventItem) => {
    addEvent(e);
    navigate('/');
  };

  const handleUpdateEvent = (e: EventItem) => {
    updateEvent(e);
    navigate('/');
  };

  return (
    <ErrorBoundary>
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-black py-0 sm:py-10">
        <div className="w-full max-w-md h-screen sm:h-[844px] bg-background-light dark:bg-background-dark sm:rounded-[40px] shadow-2xl relative overflow-hidden ring-8 ring-black">
          <IOSStatusBar />
          <Routes>
            <Route path="/" element={<Dashboard events={events} onDelete={deleteEvent} onEdit={(e) => navigate('/edit', { state: { event: e } })} />} />
            <Route path="/add" element={<AddEvent events={events} addEvent={handleAddEvent} />} />
            <Route path="/edit" element={<AddEvent events={events} addEvent={handleAddEvent} updateEvent={handleUpdateEvent} isEditing />} />
          </Routes>
          <IOSHomeIndicator />
        </div>
      </div>
    </ErrorBoundary>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </Router>
  );
};

export default App;
