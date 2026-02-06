import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EventCard } from './EventCard';
import { MOCK_EVENTS } from '../constants';
import { SettingsView } from './SettingsView';
import { CalendarView } from './CalendarView';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="h-screen flex flex-col relative overflow-hidden bg-background-light dark:bg-background-dark shadow-2xl transition-colors duration-200">
      
      {/* Content Area */}
      <div className="flex-1 h-full overflow-hidden relative">
        {activeTab === 'home' && <HomeContent navigate={navigate} />}
        {activeTab === 'calendar' && <CalendarView />}
        {activeTab === 'settings' && <SettingsView />}
      </div>

      {/* Bottom Nav */}
      <nav className="absolute bottom-0 w-full bg-surface-light/85 dark:bg-[#1C1C1E]/85 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-800/50 pb-6 pt-2 z-40">
        <ul className="flex justify-around items-center">
          <li>
            <button 
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center p-2 transition-colors duration-200 ${activeTab === 'home' ? 'text-primary' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
            >
              <span className="material-icons-round text-[28px]">{activeTab === 'home' ? 'dashboard' : 'dashboard'}</span>
              <span className="text-[10px] font-medium mt-0.5">Home</span>
            </button>
          </li>
          <li>
            <button 
              onClick={() => setActiveTab('calendar')}
              className={`flex flex-col items-center p-2 transition-colors duration-200 ${activeTab === 'calendar' ? 'text-primary' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
            >
              <span className="material-icons-round text-[28px]">{activeTab === 'calendar' ? 'calendar_month' : 'calendar_today'}</span>
              <span className="text-[10px] font-medium mt-0.5">Calendar</span>
            </button>
          </li>
          <li>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`flex flex-col items-center p-2 transition-colors duration-200 ${activeTab === 'settings' ? 'text-primary' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
            >
              <span className="material-icons-round text-[28px]">{activeTab === 'settings' ? 'settings' : 'settings'}</span>
              <span className="text-[10px] font-medium mt-0.5">Settings</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

const HomeContent: React.FC<{navigate: any}> = ({ navigate }) => {
    const [filter, setFilter] = useState<'all' | 'past' | 'future'>('all');
    
    const filteredEvents = MOCK_EVENTS.filter(event => {
        if (filter === 'all') return true;
        return event.type === filter;
    });

    const todayStr = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="flex flex-col h-full">
            <header className="pt-14 pb-2 px-5 flex flex-col bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md sticky top-0 z-20">
                <div className="text-sm font-semibold text-ios-gray uppercase tracking-wide mb-1">
                {todayStr}
                </div>
                <div className="flex justify-between items-center">
                    <h1 className="text-[34px] leading-tight font-bold tracking-tight text-gray-900 dark:text-white">Countdown</h1>
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden border border-gray-300 dark:border-gray-700">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Profile" className="w-full h-full" />
                    </div>
                </div>
            </header>

            {/* iOS Segmented Control */}
            <div className="px-5 py-2 pb-4 z-10">
                <div className="bg-gray-200/80 dark:bg-[#1C1C1E] p-0.5 rounded-[9px] flex relative h-9">
                    <div 
                        className="absolute top-0.5 bottom-0.5 bg-white dark:bg-[#636366] rounded-[7px] shadow-sm transition-all duration-300 ease-in-out"
                        style={{
                            left: filter === 'all' ? '2px' : filter === 'past' ? '33.33%' : '66.66%',
                            width: 'calc(33.33% - 4px)'
                        }}
                    />
                    
                    <button onClick={() => setFilter('all')} className={`flex-1 relative z-10 text-[13px] font-semibold text-center leading-8 transition-colors duration-200 ${filter === 'all' ? 'text-black dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>All</button>
                    <button onClick={() => setFilter('past')} className={`flex-1 relative z-10 text-[13px] font-semibold text-center leading-8 transition-colors duration-200 ${filter === 'past' ? 'text-black dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>Past</button>
                    <button onClick={() => setFilter('future')} className={`flex-1 relative z-10 text-[13px] font-semibold text-center leading-8 transition-colors duration-200 ${filter === 'future' ? 'text-black dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>Future</button>
                </div>
            </div>

            <main className="flex-1 overflow-y-auto px-5 pb-28 space-y-4 no-scrollbar">
                {filteredEvents.map(event => (
                <EventCard key={event.id} event={event} />
                ))}
                {filteredEvents.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 opacity-50">
                    <span className="material-icons-round text-6xl mb-4 text-gray-300 dark:text-gray-600">event_busy</span>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">No events found</p>
                </div>
                )}
            </main>

            <div className="absolute bottom-24 right-5 z-30">
                <button 
                onClick={() => navigate('/add')}
                className="bg-primary hover:bg-blue-600 text-white w-14 h-14 rounded-full shadow-glow flex items-center justify-center transition-transform transform hover:scale-105 active:scale-95 border border-white/10"
                >
                <span className="material-icons-round text-3xl">add</span>
                </button>
            </div>
        </div>
    );
};