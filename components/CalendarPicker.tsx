import React from 'react';

export const CalendarPicker: React.FC = () => {
  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const days = Array.from({ length: 28 }, (_, i) => i + 1);

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-4 shadow-ios transition-colors duration-200">
      <div className="flex items-center justify-between mb-4">
        <button className="text-base font-semibold flex items-center hover:opacity-70 text-gray-900 dark:text-white transition-colors">
          February 2026 
          <span className="material-symbols-outlined text-sm ml-1">chevron_right</span>
        </button>
        <div className="flex space-x-4 text-gray-400 dark:text-gray-500">
          <button className="hover:text-gray-900 dark:hover:text-white transition-colors"><span className="material-symbols-outlined">chevron_left</span></button>
          <button className="hover:text-gray-900 dark:hover:text-white transition-colors"><span className="material-symbols-outlined">chevron_right</span></button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-y-4 text-center text-sm mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-gray-400 dark:text-gray-500 text-xs font-medium">{day}</div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-y-2 text-center text-lg text-gray-900 dark:text-white">
        {days.map(day => (
          <div 
            key={day} 
            className={`py-1 cursor-pointer rounded-full w-8 h-8 mx-auto flex items-center justify-center transition-colors
              ${day === 18 
                ? 'text-black bg-primary dark:bg-accent font-semibold shadow-sm' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
};