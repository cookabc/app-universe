import React, { useState } from 'react';

export const SettingsView: React.FC = () => {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('duekeep-theme');
    const shouldBeDark = stored ? stored === 'dark' : document.documentElement.classList.contains('dark');
    // Side effect to sync DOM
    document.documentElement.classList.toggle('dark', shouldBeDark);
    return shouldBeDark;
  });

  const toggleDarkMode = () => {
    const next = !isDark;
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('duekeep-theme', next ? 'dark' : 'light');
    setIsDark(next);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background-light dark:bg-background-dark">
      <header className="pt-14 pb-2 px-5 sticky top-0 z-20 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md">
        <h1 className="text-[34px] leading-tight font-bold tracking-tight text-gray-900 dark:text-white">Settings</h1>
      </header>
      
      <main className="flex-1 overflow-y-auto px-4 pt-2 pb-28 space-y-8 no-scrollbar">
        {/* Profile Section */}
        <div className="flex items-center space-x-4 px-2 mt-2">
            <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden border-2 border-white dark:border-gray-700 shadow-md">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Profile" className="w-full h-full" />
            </div>
            <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Felix User</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">felix@example.com</p>
            </div>
        </div>

        {/* Appearance Section */}
        <section>
          <h2 className="ml-4 mb-2 text-[13px] text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">Appearance</h2>
          <div className="bg-surface-light dark:bg-surface-dark rounded-[10px] overflow-hidden shadow-sm">
             <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-[#1C1C1E]">
                <div className="flex items-center space-x-3">
                   <div className="w-7 h-7 rounded-md bg-blue-500 flex items-center justify-center text-white">
                      <span className="material-icons-round text-lg">dark_mode</span>
                   </div>
                   <span className="text-[17px] font-medium text-gray-900 dark:text-white">Dark Mode</span>
                </div>
                <div 
                  onClick={toggleDarkMode}
                  className={`w-[51px] h-[31px] rounded-full p-[2px] cursor-pointer transition-colors duration-200 ${isDark ? 'bg-[#34C759]' : 'bg-[#E9E9EA] dark:bg-[#39393D]'}`}
                >
                  <div className={`w-[27px] h-[27px] bg-white rounded-full shadow-sm transition-transform duration-200 ${isDark ? 'translate-x-[20px]' : 'translate-x-0'}`} />
                </div>
             </div>
          </div>
        </section>

        {/* General Section */}
        <section>
          <h2 className="ml-4 mb-2 text-[13px] text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">General</h2>
          <div className="bg-surface-light dark:bg-surface-dark rounded-[10px] overflow-hidden shadow-sm divide-y divide-gray-200 dark:divide-gray-800">
             <SettingsItem icon="notifications" iconColor="bg-red-500" label="Notifications" />
             <SettingsItem icon="language" iconColor="bg-orange-500" label="Language" value="English" />
             <SettingsItem icon="lock" iconColor="bg-gray-500" label="Privacy" />
          </div>
        </section>
        
         <section>
          <h2 className="ml-4 mb-2 text-[13px] text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">About</h2>
          <div className="bg-surface-light dark:bg-surface-dark rounded-[10px] overflow-hidden shadow-sm divide-y divide-gray-200 dark:divide-gray-800">
             <SettingsItem icon="info" iconColor="bg-blue-500" label="Version" value="1.0.0" />
             <SettingsItem icon="help" iconColor="bg-green-500" label="Help & Support" />
          </div>
        </section>
        
        <div className="pt-4 pb-8">
            <button className="w-full py-3 rounded-xl bg-surface-light dark:bg-surface-dark text-red-500 text-[17px] font-medium shadow-sm active:bg-gray-100 dark:active:bg-gray-800 transition-colors">
                Log Out
            </button>
        </div>
      </main>
    </div>
  );
};

type SettingsItemProps = {
  icon: string;
  iconColor: string;
  label: string;
  value?: string;
};

const SettingsItem: React.FC<SettingsItemProps> = ({ icon, iconColor, label, value }) => (
  <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-[#1C1C1E] active:bg-gray-100 dark:active:bg-[#2C2C2E] transition-colors cursor-pointer">
    <div className="flex items-center space-x-3">
        <div className={`w-7 h-7 rounded-md ${iconColor} flex items-center justify-center text-white`}>
            <span className="material-icons-round text-lg">{icon}</span>
        </div>
        <span className="text-[17px] font-medium text-gray-900 dark:text-white">{label}</span>
    </div>
    <div className="flex items-center space-x-2">
        {value && <span className="text-[17px] text-gray-500 dark:text-gray-400">{value}</span>}
        <span className="material-icons-round text-gray-300 dark:text-gray-600 text-sm">arrow_forward_ios</span>
    </div>
  </div>
);
