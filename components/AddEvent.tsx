import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarPicker } from './CalendarPicker';
import { TimePicker } from './TimePicker';

export const AddEvent: React.FC = () => {
  const navigate = useNavigate();
  const [eventName, setEventName] = useState('Event Name');
  const [eventType, setEventType] = useState<'past' | 'future'>('past');

  const handleSave = () => {
    // In a real app, this would save to context/store
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-gray-900 dark:text-white flex flex-col transition-colors duration-200">
      {/* Sticky Header */}
      <header className="flex items-center justify-between px-4 pt-12 pb-4 bg-background-light dark:bg-background-dark sticky top-0 z-30 transition-colors duration-200">
        <button 
          onClick={() => navigate('/')}
          className="text-blue-500 text-lg font-normal hover:opacity-70 transition-opacity"
        >
          Cancel
        </button>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
          Add Event
        </h1>
        <button 
          onClick={handleSave}
          className="text-blue-500 dark:text-accent text-lg font-bold hover:opacity-70 transition-opacity"
        >
          Save
        </button>
      </header>

      <main className="flex-1 px-4 pb-10 space-y-6 overflow-y-auto">
        
        {/* Event Name */}
        <section>
          <h2 className="ml-4 mb-2 text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">Pick an event name</h2>
          <div className="relative">
            <input 
              className="w-full bg-accent dark:bg-surface-dark text-gray-900 dark:text-white placeholder-gray-700 dark:placeholder-gray-500 px-4 py-4 rounded-xl border-none focus:ring-2 focus:ring-offset-2 focus:ring-accent dark:focus:ring-accent dark:focus:ring-offset-background-dark text-lg font-medium shadow-sm transition-colors duration-200" 
              placeholder="Event Name" 
              type="text" 
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
            />
          </div>
        </section>

        {/* Event Type */}
        <section>
          <h2 className="ml-4 mb-2 text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">Pick event type</h2>
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl overflow-hidden shadow-ios transition-colors duration-200">
            <label 
              className="flex items-center justify-between px-4 py-3.5 cursor-pointer active:bg-gray-100 dark:active:bg-gray-800 transition-colors"
              onClick={() => setEventType('past')}
            >
              <div className="flex items-center space-x-3">
                <div className="relative flex items-center justify-center w-5 h-5">
                  <div className={`w-5 h-5 rounded-full border-2 transition-colors ${eventType === 'past' ? 'border-accent' : 'border-gray-400 dark:border-gray-500'}`}></div>
                  {eventType === 'past' && <div className="absolute w-2.5 h-2.5 rounded-full bg-accent"></div>}
                </div>
                <span className="text-base font-medium text-gray-900 dark:text-white">Past event</span>
              </div>
            </label>
            <div className="h-px bg-divider-light dark:bg-divider-dark ml-12"></div>
            <label 
              className="flex items-center justify-between px-4 py-3.5 cursor-pointer active:bg-gray-100 dark:active:bg-gray-800 transition-colors"
              onClick={() => setEventType('future')}
            >
              <div className="flex items-center space-x-3">
                <div className="relative flex items-center justify-center w-5 h-5">
                  <div className={`w-5 h-5 rounded-full border-2 transition-colors ${eventType === 'future' ? 'border-accent' : 'border-gray-400 dark:border-gray-500'}`}></div>
                  {eventType === 'future' && <div className="absolute w-2.5 h-2.5 rounded-full bg-accent"></div>}
                </div>
                <span className="text-base font-medium text-gray-900 dark:text-white">Future event</span>
              </div>
            </label>
          </div>
        </section>

        {/* Date Picker */}
        <section>
          <h2 className="ml-4 mb-2 text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">Pick a date</h2>
          <CalendarPicker />
        </section>

        {/* Time Picker */}
        <section>
          <h2 className="ml-4 mb-2 text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">Pick a time</h2>
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl overflow-hidden shadow-ios transition-colors duration-200">
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-divider-light dark:border-divider-dark">
              <span className="text-base font-medium text-gray-900 dark:text-white">All-day</span>
              <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                <input className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-transparent appearance-none cursor-pointer translate-x-0 transition-transform duration-200 ease-in-out z-10" id="toggle" name="toggle" type="checkbox"/>
                <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 dark:bg-gray-600 cursor-pointer transition-colors" htmlFor="toggle"></label>
              </div>
            </div>
            <TimePicker />
          </div>
        </section>

        {/* Settings List */}
        <section className="pb-8">
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl overflow-hidden shadow-ios transition-colors duration-200">
            <div className="flex items-center justify-between px-4 py-3.5 active:bg-gray-100 dark:active:bg-gray-800 transition-colors cursor-pointer group">
              <div className="flex items-center space-x-3">
                <span className="material-symbols-outlined text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">list</span>
                <span className="text-base font-medium text-gray-900 dark:text-white">Category</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-gray-500 dark:text-gray-400 text-base">Birthday</span>
                <span className="material-symbols-outlined text-gray-400 dark:text-gray-600 text-sm">chevron_right</span>
              </div>
            </div>
            <div className="h-px bg-divider-light dark:bg-divider-dark ml-12"></div>
            <div className="flex items-center justify-between px-4 py-3.5 active:bg-gray-100 dark:active:bg-gray-800 transition-colors cursor-pointer group">
              <div className="flex items-center space-x-3">
                <span className="material-symbols-outlined text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">notifications_none</span>
                <span className="text-base font-medium text-gray-900 dark:text-white">Alert</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-gray-500 dark:text-gray-400 text-base">Opened</span>
                <span className="material-symbols-outlined text-gray-400 dark:text-gray-600 text-sm">chevron_right</span>
              </div>
            </div>
            <div className="h-px bg-divider-light dark:bg-divider-dark ml-12"></div>
            <div className="flex items-center justify-between px-4 py-3.5 active:bg-gray-100 dark:active:bg-gray-800 transition-colors cursor-pointer group">
              <div className="flex items-center space-x-3">
                <span className="material-symbols-outlined text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">cached</span>
                <span className="text-base font-medium text-gray-900 dark:text-white">Repeat</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-gray-500 dark:text-gray-400 text-base">Daily</span>
                <span className="material-symbols-outlined text-gray-400 dark:text-gray-600 text-sm">chevron_right</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};