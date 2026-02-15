import { Check, Play, Lock, School, Trophy, Home, Building2, Flag } from 'lucide-react'

export function LearningMap() {
  return (
    <div className="absolute inset-0 w-[120%] h-[120%] -left-[10%] -top-[10%] bg-[#f9f8fb] cursor-grab active:cursor-grabbing group/map">
      {/* Background Grid/Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40" 
           style={{
             backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
             backgroundSize: '40px 40px'
           }}
      />

      {/* Zone 1: Novice Village (Bottom Left) */}
      <div className="absolute bottom-[15%] left-[15%] w-64 h-64 opacity-10 pointer-events-none">
        <Home className="w-full h-full text-green-500" strokeWidth={1} />
      </div>

      {/* Zone 2: Ability Continent (Center) */}
      <div className="absolute top-[40%] left-[45%] -translate-x-1/2 -translate-y-1/2 w-96 h-96 opacity-10 pointer-events-none">
        <Building2 className="w-full h-full text-blue-500" strokeWidth={0.5} />
      </div>

      {/* Zone 3: Ultimate Challenge (Top Right) */}
      <div className="absolute top-[10%] right-[15%] w-64 h-64 opacity-10 pointer-events-none">
        <Flag className="w-full h-full text-purple-500" strokeWidth={1} />
      </div>

      {/* Connecting Path (SVG) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
        <defs>
          <linearGradient id="pathGradient" x1="0%" x2="100%" y1="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 1 }} />
            <stop offset="60%" style={{ stopColor: '#5048e5', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#cbd5e1', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        <path 
          className="drop-shadow-sm" 
          d="M 18% 82% Q 30% 82% 35% 65% T 50% 45% T 70% 30% T 85% 15%" 
          fill="none" 
          stroke="url(#pathGradient)" 
          strokeDasharray="12 0" 
          strokeLinecap="round" 
          strokeWidth="8"
        />
      </svg>

      {/* Node 1: Start (Completed) */}
      <div className="absolute left-[18%] bottom-[18%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 group cursor-pointer z-10" onClick={() => alert('Level 1 Replay')}>
        <div className="size-14 bg-emerald-500 rounded-full shadow-lg flex items-center justify-center border-4 border-white transition-transform group-hover:scale-110">
          <Check className="text-white text-2xl font-bold" />
        </div>
        <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm border border-emerald-100">
          <span className="text-xs font-bold text-emerald-700">Intro to AI</span>
        </div>
      </div>

      {/* Node 2: (Completed) */}
      <div className="absolute left-[28%] bottom-[25%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 group cursor-pointer z-10">
        <div className="size-14 bg-emerald-500 rounded-full shadow-lg flex items-center justify-center border-4 border-white transition-transform group-hover:scale-110">
          <Check className="text-white text-2xl" />
        </div>
        <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm border border-emerald-100">
          <span className="text-xs font-bold text-emerald-700">Data Basics</span>
        </div>
      </div>

      {/* Node 3: Current Mission (Active) */}
      <div className="absolute left-[35%] bottom-[35%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 z-20">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/30 rounded-full animate-ping" />
          <div className="size-20 bg-primary rounded-full shadow-glow flex items-center justify-center border-[6px] border-white cursor-pointer hover:scale-105 transition-transform">
            <Play className="text-white w-8 h-8 ml-1" fill="currentColor" />
          </div>
          {/* Tooltip */}
          <div className="absolute -right-40 top-0 bg-white p-3 rounded-xl shadow-xl border border-primary/10 w-48 animate-bounce" style={{ animationDuration: '3s' }}>
            <h4 className="text-sm font-bold text-text-main">Current Mission</h4>
            <p className="text-xs text-text-secondary mt-1">Level 5: Neural Networks</p>
            <div className="mt-2 w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-primary w-[40%] rounded-full" />
            </div>
          </div>
        </div>
        <div className="bg-primary text-white px-4 py-1.5 rounded-full shadow-lg font-bold text-sm tracking-wide mt-2">
          Start Here
        </div>
      </div>

      {/* Node 4: Locked */}
      <div className="absolute left-[50%] bottom-[55%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 opacity-80 group cursor-pointer z-10">
        <div className="size-14 bg-white rounded-full shadow-sm flex items-center justify-center border-4 border-gray-200 group-hover:border-primary/50 transition-colors">
          <Lock className="text-gray-400 text-2xl" />
        </div>
        <div className="bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
          <span className="text-xs font-medium text-gray-500">Logic Gates</span>
        </div>
      </div>

      {/* Node 5: Locked */}
      <div className="absolute left-[62%] bottom-[65%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 opacity-70 z-10">
        <div className="size-14 bg-white rounded-full shadow-sm flex items-center justify-center border-4 border-gray-200">
          <Lock className="text-gray-300 text-2xl" />
        </div>
      </div>

      {/* Node 6: Boss/Project Locked */}
      <div className="absolute left-[70%] bottom-[70%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 opacity-70 z-10">
        <div className="size-20 bg-gray-100 rounded-xl rotate-45 shadow-sm flex items-center justify-center border-4 border-gray-200">
          <School className="text-gray-300 text-3xl -rotate-45" />
        </div>
        <div className="bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm mt-4">
          <span className="text-xs font-medium text-gray-500">Mid-term Project</span>
        </div>
      </div>

      {/* Node 7: Ultimate Goal */}
      <div className="absolute left-[85%] bottom-[85%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 opacity-60 z-10">
        <div className="size-24 bg-white rounded-full shadow-none flex items-center justify-center border-dashed border-4 border-gray-300">
          <Trophy className="text-gray-300 text-4xl" />
        </div>
        <div className="bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
          <span className="text-xs font-bold text-gray-400">AGI Master</span>
        </div>
      </div>

      {/* Zone Labels */}
      <div className="absolute left-[10%] bottom-[10%] text-emerald-600/20 font-black text-6xl uppercase tracking-widest pointer-events-none select-none">
        Novice Village
      </div>
      <div className="absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 text-primary/10 font-black text-7xl uppercase tracking-widest pointer-events-none select-none text-center leading-tight">
        Ability<br/>Continent
      </div>
      <div className="absolute right-[5%] top-[5%] text-purple-600/20 font-black text-6xl uppercase tracking-widest pointer-events-none select-none text-right">
        Ultimate<br/>Challenge
      </div>
    </div>
  )
}
