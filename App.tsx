import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Dashboard } from './components/Dashboard';
import { AddEvent } from './components/AddEvent';
import { IOSStatusBar, IOSHomeIndicator } from './components/IOSChrome';

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-black py-0 sm:py-10">
        <div className="w-full max-w-md h-screen sm:h-[844px] bg-background-light dark:bg-background-dark sm:rounded-[40px] shadow-2xl relative overflow-hidden ring-8 ring-black">
          <IOSStatusBar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add" element={<AddEvent />} />
          </Routes>
          <IOSHomeIndicator />
        </div>
      </div>
    </Router>
  );
};

export default App;