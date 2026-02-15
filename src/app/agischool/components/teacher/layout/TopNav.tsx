import { Search, Bell, MessageSquare, ChevronDown } from 'lucide-react'

export function TeacherTopNav() {
  return (
    <header className="flex-shrink-0 flex items-center justify-between border-b border-[#e8e8f3] dark:border-gray-800 bg-surface-light dark:bg-surface-dark px-8 py-4 z-10">
      <div className="flex items-center gap-8">
        {/* Class Selector */}
        <div className="flex items-center gap-2 text-gray-900 dark:text-white cursor-pointer group">
          <h2 className="text-xl font-bold leading-tight tracking-tight">Grade 5 - AI Basics</h2>
          <ChevronDown className="w-5 h-5 text-gray-500 group-hover:text-primary transition-colors" />
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="hidden md:flex relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input 
            type="text"
            className="block w-full rounded-lg border-0 bg-gray-100 dark:bg-gray-800 py-2 pl-10 pr-4 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary sm:text-sm sm:leading-6"
            placeholder="Search students..."
          />
        </div>
        
        {/* Actions */}
        <div className="flex gap-2">
          <button className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900"></span>
          </button>
          <button className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <MessageSquare className="w-5 h-5" />
          </button>
        </div>
        
        {/* Profile */}
        <div 
          className="h-10 w-10 rounded-full bg-cover bg-center ring-2 ring-gray-100 dark:ring-gray-700" 
          style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDGhNzbK0AcbnQu1VImduUYLqdpYHkMyk2UKuM8YVNIKFEiNTXpfsVaIbWV2Yg0vcvcFbz7P9C-yYYFAJX_RBaAQDHNrno_WRSRdMo7SWLbCoFKgydzrGLe7Sw2p4291a_qjgbfh4FSoUPibDbVccRJPUoSlg3gURLsH0tFEjDAoaOH8COsquBKXKt8gUjTv-Lfod-szeqbslimWEDZATA5VTnRIByonU8U8YldRoAGKd1cTY5EVGeyXw-qRbaWdBKdwLaExHH_GII")' }}
        ></div>
      </div>
    </header>
  )
}
