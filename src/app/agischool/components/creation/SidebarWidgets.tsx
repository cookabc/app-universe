import { Medal, Check, Lock, Play, Flame, Lightbulb } from 'lucide-react'

export function GamificationCard() {
  return (
    <div className="bg-gradient-to-br from-indigo-900 to-primary rounded-xl p-5 text-white shadow-lg relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 opacity-20 transform translate-x-1/3 -translate-y-1/3">
        <Medal className="w-40 h-40" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase opacity-80">Your Progress</span>
          <Medal className="text-amber-300 w-6 h-6" />
        </div>
        
        <h3 className="text-2xl font-black mb-1">Level 5 Scholar</h3>
        <p className="text-sm opacity-80 mb-4">Next reward: AI Prompt Pack</p>
        
        {/* XP Bar */}
        <div className="w-full bg-black/20 rounded-full h-2.5 mb-2">
          <div className="bg-amber-400 h-2.5 rounded-full" style={{ width: '75%' }}></div>
        </div>
        
        <div className="flex justify-between text-xs font-medium opacity-70">
          <span>1,250 XP</span>
          <span>2,000 XP</span>
        </div>
      </div>
    </div>
  )
}

export function ActiveMissionCard() {
  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-[#e8e8f3] dark:border-gray-800 overflow-hidden">
      <div className="bg-gray-50 dark:bg-gray-900/50 px-5 py-4 border-b border-[#e8e8f3] dark:border-gray-800 flex justify-between items-center">
        <h3 className="font-bold text-gray-900 dark:text-white">Active Mission</h3>
        <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">In Progress</span>
      </div>
      
      <div className="p-5">
        <div className="flex items-start gap-3 mb-5">
          <div 
            className="size-12 rounded-lg bg-cover bg-center shrink-0 shadow-sm" 
            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA3ZKaaVRUwZhVsM6CYqV6Wrx3e8rF1cuxOfvwElvvSbsg42qEnHxgeoL4QeBfYz8FT1iSXIWdMkDVMYAzNFQ4mJVFdZIDUBDLFQBW0LOnpsubM6_73XdhYMRPLWjfTzLlGmr3W-z1ZuPiBrpYuZ3hFVauBDANltX3llhaExAetfUvk5p0ez9Q-pAJbzFglBaneks_vui95uouGaB935ReZJi8IL6OF90x-C3aUMNUULKzvo3UKU20kT0mpbJFhbSOEXagu3RWkvCM")' }}
          ></div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white text-sm">AI Symphony Composer</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Design a 30s loop for a game.</p>
          </div>
        </div>

        {/* Stepper / Task List */}
        <div className="relative pl-2">
          {/* Vertical Line */}
          <div className="absolute left-[11px] top-2 bottom-6 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
          
          {/* Step 1: Done */}
          <div className="relative flex items-start gap-4 mb-6">
            <div className="z-10 relative bg-green-500 text-white rounded-full size-6 flex items-center justify-center shrink-0 border-2 border-white dark:border-surface-dark shadow-sm">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <div className="flex-1 pt-0.5">
              <p className="text-sm font-bold text-gray-500 line-through decoration-2">Learn Music Theory</p>
            </div>
          </div>

          {/* Step 2: Active */}
          <div className="relative flex items-start gap-4 mb-6 group cursor-pointer">
            <div className="z-10 relative bg-primary text-white rounded-full size-6 flex items-center justify-center shrink-0 ring-4 ring-primary/20 border-2 border-white dark:border-surface-dark">
              <span className="text-[10px] font-bold">2</span>
            </div>
            <div className="flex-1 pt-0.5">
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm font-bold text-primary">Generate Melody</p>
                <span className="text-[10px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded">Current</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Use the prompt builder to create a basic melody in C Major.</p>
              
              {/* Achievement Feedback Placeholder */}
              <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 rounded p-2 flex items-center gap-2">
                <Lightbulb className="text-indigo-500 w-4 h-4" />
                <span className="text-[11px] text-indigo-700 dark:text-indigo-300 font-medium">Tip: Try adding "upbeat" to style.</span>
              </div>
            </div>
          </div>

          {/* Step 3: Pending */}
          <div className="relative flex items-start gap-4">
            <div className="z-10 relative bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 rounded-full size-6 flex items-center justify-center shrink-0 border-2 border-white dark:border-surface-dark">
              <Lock className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 pt-0.5">
              <p className="text-sm font-medium text-gray-400 dark:text-gray-600">Refine & Export</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-2.5 rounded-lg shadow-lg shadow-primary/20 transition-all flex justify-center items-center gap-2">
            Continue Mission
            <Play className="w-4 h-4 fill-current" />
          </button>
        </div>
      </div>
    </div>
  )
}

export function DailyChallengeCard() {
  return (
    <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl p-4 text-white shadow-md flex items-center gap-4">
      <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
        <Flame className="w-5 h-5 text-white" />
      </div>
      <div>
        <h4 className="font-bold text-sm">Daily Streak: 12 Days!</h4>
        <p className="text-xs text-pink-100">Complete one task today to keep it.</p>
      </div>
    </div>
  )
}
