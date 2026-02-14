import React, { useEffect, useRef } from 'react';

interface TimePickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
}

export const TimePicker: React.FC<TimePickerProps> = ({ value = new Date(), onChange }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  const currentHour = value.getHours();
  const currentMinute = value.getMinutes();
  
  const hourContainerRef = useRef<HTMLDivElement>(null);
  const minuteContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to current time on mount
  useEffect(() => {
    if (hourContainerRef.current) {
        const selectedHour = hourContainerRef.current.querySelector(`[data-hour="${currentHour}"]`);
        if (selectedHour) {
            selectedHour.scrollIntoView({ block: 'center' });
        }
    }
    if (minuteContainerRef.current) {
        const selectedMinute = minuteContainerRef.current.querySelector(`[data-minute="${currentMinute}"]`);
        if (selectedMinute) {
            selectedMinute.scrollIntoView({ block: 'center' });
        }
    }
  }, [currentHour, currentMinute]); // Update on time change too if needed, but primarily on mount/value update

  const handleHourClick = (h: number) => {
    if (!onChange) return;
    const newDate = new Date(value);
    newDate.setHours(h);
    onChange(newDate);
    
    // Smooth scroll to center
    if (hourContainerRef.current) {
        const el = hourContainerRef.current.querySelector(`[data-hour="${h}"]`);
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleMinuteClick = (m: number) => {
    if (!onChange) return;
    const newDate = new Date(value);
    newDate.setMinutes(m);
    onChange(newDate);

    if (minuteContainerRef.current) {
        const el = minuteContainerRef.current.querySelector(`[data-minute="${m}"]`);
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="relative h-40 flex justify-center text-center overflow-hidden bg-surface-light dark:bg-surface-dark rounded-b-xl select-none">
      {/* Selection Highlight */}
      <div className="absolute top-1/2 left-0 right-0 h-10 -mt-5 bg-gray-200 dark:bg-gray-700/50 rounded mx-4 z-0 pointer-events-none"></div>
      
      {/* Hours */}
      <div 
        ref={hourContainerRef}
        className="w-1/2 z-10 overflow-auto no-scrollbar relative py-[calc(5rem-1.25rem)]"
      >
        {hours.map((h) => (
          <div 
            key={h} 
            data-hour={h}
            onClick={() => handleHourClick(h)}
            className={`h-10 flex items-center justify-center font-medium cursor-pointer transition-all duration-200 ${
                h === currentHour 
                ? 'text-gray-900 dark:text-white text-2xl font-bold' 
                : 'text-gray-400 dark:text-gray-500 text-xl hover:text-gray-600 dark:hover:text-gray-300'
            }`}
          >
             {h.toString().padStart(2, '0')}
          </div>
        ))}
      </div>

      {/* Separator */}
      <div className="z-10 flex items-center justify-center pb-1">
          <span className="text-xl font-bold text-gray-900 dark:text-white">:</span>
      </div>

      {/* Minutes */}
      <div 
        ref={minuteContainerRef}
        className="w-1/2 z-10 overflow-auto no-scrollbar relative py-[calc(5rem-1.25rem)]"
      >
        {minutes.map((m) => (
          <div 
            key={m} 
            data-minute={m}
            onClick={() => handleMinuteClick(m)}
            className={`h-10 flex items-center justify-center font-medium cursor-pointer transition-all duration-200 ${
                m === currentMinute 
                ? 'text-gray-900 dark:text-white text-2xl font-bold' 
                : 'text-gray-400 dark:text-gray-500 text-xl hover:text-gray-600 dark:hover:text-gray-300'
            }`}
          >
             {m.toString().padStart(2, '0')}
          </div>
        ))}
      </div>

      {/* Gradients */}
      <div className="absolute inset-0 time-picker-mask z-20 pointer-events-none"></div>
    </div>
  );
};
