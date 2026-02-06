import React from 'react';

export const TimePicker: React.FC = () => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  // We duplicate the arrays to create an infinite scroll illusion or at least enough padding
  // For simplicity in this demo, we just render a simple list that snaps
  
  return (
    <div className="relative h-40 flex justify-center text-center overflow-hidden bg-surface-light dark:bg-surface-dark rounded-b-xl">
      {/* Selection Highlight */}
      <div className="absolute top-1/2 left-0 right-0 h-8 -mt-4 bg-gray-200 dark:bg-gray-700/50 rounded mx-4 z-0 pointer-events-none"></div>
      
      {/* Hours */}
      <div className="w-1/2 z-10 overflow-auto no-scrollbar relative snap-y snap-mandatory py-[calc(5rem-1rem)]">
        {hours.map((h) => (
          <div key={h} className="snap-center h-8 flex items-center justify-center text-xl text-gray-400 dark:text-gray-500 font-medium data-[active=true]:text-gray-900 data-[active=true]:dark:text-white data-[active=true]:text-2xl transition-all">
             {h.toString().padStart(2, '0')}
          </div>
        ))}
      </div>

      {/* Minutes */}
      <div className="w-1/2 z-10 overflow-auto no-scrollbar relative snap-y snap-mandatory py-[calc(5rem-1rem)]">
        {minutes.map((m) => (
          <div key={m} className="snap-center h-8 flex items-center justify-center text-xl text-gray-400 dark:text-gray-500 font-medium data-[active=true]:text-gray-900 data-[active=true]:dark:text-white data-[active=true]:text-2xl transition-all">
             {m.toString().padStart(2, '0')}
          </div>
        ))}
      </div>

      {/* Gradients */}
      <div className="absolute inset-0 time-picker-mask z-20"></div>
    </div>
  );
};