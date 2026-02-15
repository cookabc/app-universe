import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarPicker } from './CalendarPicker';
import { TimePicker } from './TimePicker';
import { EVENT_COLORS, EventItem, EVENT_CATEGORIES, REPEAT_OPTIONS, EventCategory, RepeatOption, EventColor } from '../types';

interface AddEventProps {
  events: EventItem[];
  addEvent: (e: EventItem) => void;
  updateEvent?: (e: EventItem) => void;
  isEditing?: boolean;
  initialEvent?: EventItem;
}

export const AddEvent: React.FC<AddEventProps> = ({ events, addEvent, updateEvent, isEditing, initialEvent }) => {
  const router = useRouter();
  const [eventName, setEventName] = useState(initialEvent?.name || '');
  const [eventType, setEventType] = useState<'past' | 'future'>(initialEvent?.type || 'future');
  const [allDay, setAllDay] = useState(initialEvent?.isAllDay || false);
  const [selectedDate, setSelectedDate] = useState<Date>(initialEvent?.date || new Date());
  const [category, setCategory] = useState<EventCategory>(initialEvent?.category || 'General');
  const [alertEnabled, setAlertEnabled] = useState(initialEvent?.alertEnabled ?? true);
  const [repeatOption, setRepeatOption] = useState<RepeatOption>(initialEvent?.repeatOption || 'Never');
  const [selectedColor, setSelectedColor] = useState<EventColor>(() => {
    const found = EVENT_COLORS.find(c => c.bg === initialEvent?.color);
    return (found as EventColor) ?? EVENT_COLORS[0];
  });

  const [expandedSection, setExpandedSection] = useState<'category' | 'repeat' | null>(null);
  const [errors, setErrors] = useState<{ name?: string }>({});

  // Use events prop to check for duplicates if needed in future
  // currently used just to conform to interface
  void events; 

  const canSave = eventName.trim().length > 0;

  const validate = (): boolean => {
    const newErrors: { name?: string } = {};
    if (!eventName.trim()) {
      newErrors.name = 'Event name is required';
    } else if (eventName.trim().length < 2) {
      newErrors.name = 'Event name must be at least 2 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      return;
    }
    const eventDate = new Date(selectedDate);
    if (allDay) {
      eventDate.setHours(0, 0, 0, 0);
    }
    
    const eventData: EventItem = {
      id: initialEvent?.id || (typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`),
      name: eventName.trim(),
      date: eventDate,
      isAllDay: allDay,
      type: eventType,
      category,
      alertEnabled,
      repeatOption,
      color: selectedColor.bg,
      textColor: selectedColor.text
    };
    
    if (isEditing && updateEvent) {
      updateEvent(eventData);
    } else {
      addEvent(eventData);
    }
    router.push('/');
  };

  return (
    <div className="h-full min-h-0 bg-background-light dark:bg-background-dark text-gray-900 dark:text-white flex flex-col transition-colors duration-200">
      <header className="flex items-center justify-between px-4 pt-12 pb-4 bg-background-light dark:bg-background-dark sticky top-0 z-30 transition-colors duration-200">
        <button 
          onClick={() => router.push('/')}
          className="text-blue-500 text-lg font-normal hover:opacity-70 transition-opacity"
        >
          Cancel
        </button>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
          {isEditing ? 'Edit Event' : 'Add Event'}
        </h1>
        <button
          onClick={handleSave}
          disabled={!canSave}
          className={`text-accent text-lg font-bold transition-opacity ${canSave ? 'hover:opacity-70' : 'opacity-40 cursor-not-allowed'}`}
        >
          Save
        </button>
      </header>

      <main className="flex-1 min-h-0 px-4 pb-10 space-y-6 overflow-y-auto">
        <section>
          <h2 className="ml-4 mb-2 text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">Pick an event name</h2>
          <div className="relative">
            <input 
              className={`w-full bg-accent text-gray-900 placeholder-gray-700 px-4 py-4 rounded-xl border-none focus:ring-2 focus:ring-offset-2 focus:ring-accent dark:focus:ring-offset-background-dark text-lg font-medium shadow-sm transition-colors duration-200 ${errors.name ? 'ring-2 ring-red-500' : ''}`}
              placeholder="Event Name" 
              type="text" 
              value={eventName}
              onChange={(e) => {
                setEventName(e.target.value);
                if (errors.name) setErrors({});
              }}
            />
          </div>
          {errors.name && (
            <p className="ml-4 mt-1 text-sm text-red-500">{errors.name}</p>
          )}
        </section>

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

        <section>
          <h2 className="ml-4 mb-2 text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">Pick a date</h2>
          <CalendarPicker selectedDate={selectedDate} onChange={setSelectedDate} />
        </section>

        <section>
          <h2 className="ml-4 mb-2 text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">Pick a time</h2>
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl overflow-hidden shadow-ios transition-colors duration-200">
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-divider-light dark:border-divider-dark">
              <span className="text-base font-medium text-gray-900 dark:text-white">All-day</span>
              <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                <input
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-transparent appearance-none cursor-pointer translate-x-0 transition-transform duration-200 ease-in-out z-10"
                  id="toggle"
                  name="toggle"
                  type="checkbox"
                  checked={allDay}
                  onChange={() => setAllDay(!allDay)}
                />
                <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 dark:bg-gray-600 cursor-pointer transition-colors" htmlFor="toggle"></label>
              </div>
            </div>
            {!allDay && <TimePicker value={selectedDate} onChange={setSelectedDate} />}
          </div>
        </section>

        <section>
          <h2 className="ml-4 mb-2 text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">Pick a color</h2>
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-4 shadow-ios transition-colors duration-200 overflow-x-auto">
            <div className="flex space-x-3 min-w-max">
              {EVENT_COLORS.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c)}
                  className={`w-10 h-10 rounded-full border-2 transition-all duration-200 ${selectedColor.name === c.name ? 'scale-110 border-gray-900 dark:border-white' : 'border-transparent hover:scale-105'}`}
                  style={{ backgroundColor: c.bg }}
                  aria-label={c.name}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="pb-8">
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl overflow-hidden shadow-ios transition-colors duration-200">
            <div className="flex flex-col active:bg-gray-100 dark:active:bg-gray-800 transition-colors cursor-pointer group">
              <div 
                className="flex items-center justify-between px-4 py-3.5"
                onClick={() => setExpandedSection(expandedSection === 'category' ? null : 'category')}
              >
                <div className="flex items-center space-x-3">
                  <span className="material-symbols-outlined text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">list</span>
                  <span className="text-base font-medium text-gray-900 dark:text-white">Category</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-gray-500 dark:text-gray-400 text-base">{category}</span>
                  <span className={`material-symbols-outlined text-gray-400 dark:text-gray-600 text-sm transition-transform ${expandedSection === 'category' ? 'rotate-90' : ''}`}>chevron_right</span>
                </div>
              </div>
              
              {expandedSection === 'category' && (
                <div className="px-4 pb-3.5 grid grid-cols-2 gap-2 animate-fadeIn">
                  {EVENT_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setCategory(cat);
                        setExpandedSection(null);
                      }}
                      className={`px-3 py-2 rounded-lg text-sm font-medium text-left transition-colors ${category === cat ? 'bg-accent text-black' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="h-px bg-divider-light dark:bg-divider-dark ml-12"></div>

            <div 
              className="flex items-center justify-between px-4 py-3.5 active:bg-gray-100 dark:active:bg-gray-800 transition-colors cursor-pointer group"
              onClick={() => setAlertEnabled(!alertEnabled)}
            >
              <div className="flex items-center space-x-3">
                <span className="material-symbols-outlined text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">notifications_none</span>
                <span className="text-base font-medium text-gray-900 dark:text-white">Alert</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-gray-500 dark:text-gray-400 text-base">{alertEnabled ? 'On' : 'Off'}</span>
                <div className={`w-10 h-6 ml-2 rounded-full relative transition-colors ${alertEnabled ? 'bg-accent' : 'bg-gray-300 dark:bg-gray-600'}`}>
                    <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${alertEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
                </div>
              </div>
            </div>

            <div className="h-px bg-divider-light dark:bg-divider-dark ml-12"></div>

            <div className="flex flex-col active:bg-gray-100 dark:active:bg-gray-800 transition-colors cursor-pointer group">
              <div 
                className="flex items-center justify-between px-4 py-3.5"
                onClick={() => setExpandedSection(expandedSection === 'repeat' ? null : 'repeat')}
              >
                <div className="flex items-center space-x-3">
                  <span className="material-symbols-outlined text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">cached</span>
                  <span className="text-base font-medium text-gray-900 dark:text-white">Repeat</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-gray-500 dark:text-gray-400 text-base">{repeatOption}</span>
                  <span className={`material-symbols-outlined text-gray-400 dark:text-gray-600 text-sm transition-transform ${expandedSection === 'repeat' ? 'rotate-90' : ''}`}>chevron_right</span>
                </div>
              </div>

              {expandedSection === 'repeat' && (
                <div className="px-4 pb-3.5 grid grid-cols-2 gap-2 animate-fadeIn">
                  {REPEAT_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setRepeatOption(opt);
                        setExpandedSection(null);
                      }}
                      className={`px-3 py-2 rounded-lg text-sm font-medium text-left transition-colors ${repeatOption === opt ? 'bg-accent text-black' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
