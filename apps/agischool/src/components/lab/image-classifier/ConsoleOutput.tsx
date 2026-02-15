import { PlayCircle, RotateCcw } from 'lucide-react'

export function ConsoleOutput() {
  return (
    <>
      <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-5 flex flex-col gap-4">
        <button className="w-full py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-bold text-lg shadow-lg shadow-primary/30 flex items-center justify-center gap-2 transition-transform active:scale-[0.98]">
          <PlayCircle className="w-6 h-6" />
          Start Training
        </button>
        <button className="w-full py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center gap-2 transition-colors">
          <RotateCcw className="w-5 h-5" />
          Reset Model
        </button>
      </div>

      <div className="flex-1 bg-gray-900 rounded-xl shadow-sm border border-gray-800 overflow-hidden flex flex-col min-h-[200px]">
        <div className="px-4 py-2 border-b border-gray-800 bg-gray-950 flex justify-between items-center">
          <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">System Log</span>
          <div className="flex gap-1.5">
            <div className="size-2 rounded-full bg-red-500/50"></div>
            <div className="size-2 rounded-full bg-yellow-500/50"></div>
            <div className="size-2 rounded-full bg-green-500/50"></div>
          </div>
        </div>
        <div className="p-4 font-mono text-xs text-gray-300 space-y-2 overflow-y-auto max-h-[200px] custom-scrollbar">
          <p className="text-gray-500">To start training, please add at least 10 images per class.</p>
          <p><span className="text-green-400">➜</span> System ready.</p>
          <p><span className="text-blue-400">➜</span> Loading MobileNet v2...</p>
          <p><span className="text-green-400">➜</span> Model loaded successfully.</p>
          <p><span className="text-yellow-400">➜</span> Images added to Class 1 (12).</p>
          <p><span className="text-yellow-400">➜</span> Images added to Class 2 (10).</p>
          <p className="animate-pulse"><span className="text-primary">➜</span> Waiting for user input...</p>
        </div>
      </div>
    </>
  )
}
