import React, { useEffect, useMemo, useState } from 'react';

type CalendarPickerProps = {
  selectedDate?: Date;
  onChange?: (date: Date) => void;
};

export const CalendarPicker: React.FC<CalendarPickerProps> = ({ selectedDate, onChange }) => {
  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const [internalSelected, setInternalSelected] = useState<Date>(() => selectedDate ?? new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
    const base = selectedDate ?? new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  useEffect(() => {
    if (!selectedDate) return;
    setInternalSelected(selectedDate);
    setCurrentMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
  }, [selectedDate]);

  const daysInMonth = useMemo(() => {
    return new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  }, [currentMonth]);

  const leadingEmptyDays = useMemo(() => {
    return new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  }, [currentMonth]);

  const monthLabel = useMemo(() => {
    return currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }, [currentMonth]);

  const handleSelect = (day: number) => {
    const next = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setInternalSelected(next);
    onChange?.(next);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-4 shadow-ios transition-colors duration-200">
      <div className="flex items-center justify-between mb-4">
        <button className="text-base font-semibold flex items-center hover:opacity-70 text-gray-900 dark:text-white transition-colors">
          {monthLabel}
          <span className="material-symbols-outlined text-sm ml-1">chevron_right</span>
        </button>
        <div className="flex space-x-4 text-gray-400 dark:text-gray-500">
          <button onClick={handlePrevMonth} className="hover:text-gray-900 dark:hover:text-white transition-colors"><span className="material-symbols-outlined">chevron_left</span></button>
          <button onClick={handleNextMonth} className="hover:text-gray-900 dark:hover:text-white transition-colors"><span className="material-symbols-outlined">chevron_right</span></button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-y-4 text-center text-sm mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-gray-400 dark:text-gray-500 text-xs font-medium">{day}</div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-y-2 text-center text-lg text-gray-900 dark:text-white">
        {Array.from({ length: leadingEmptyDays }).map((_, index) => (
          <div key={`empty-${index}`} className="w-8 h-8 mx-auto" />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
          const isSelected =
            internalSelected.getFullYear() === currentMonth.getFullYear() &&
            internalSelected.getMonth() === currentMonth.getMonth() &&
            internalSelected.getDate() === day;
          return (
            <button
              key={day}
              onClick={() => handleSelect(day)}
              className={`py-1 rounded-full w-8 h-8 mx-auto flex items-center justify-center transition-colors
              ${isSelected 
                ? 'text-black bg-primary dark:bg-accent font-semibold shadow-sm' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
};
