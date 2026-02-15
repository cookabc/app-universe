import { Link } from '@tanstack/react-router'
import { School, LayoutDashboard, BookOpen, FolderOpen, Users, Settings, Plus } from 'lucide-react'

export function StudentSidebar() {
  const navItems = [
    { icon: LayoutDashboard, label: 'My Space', to: '/dashboard' },
    { icon: BookOpen, label: 'My Courses', to: '/learning' },
    { icon: FolderOpen, label: 'Projects', to: '/creation' },
    { icon: Users, label: 'Community', to: '/community' },
  ]

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col h-full bg-surface-light dark:bg-surface-dark border-r border-gray-200 dark:border-gray-800 z-20 hidden md:flex">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-primary/10 rounded-lg p-2 flex items-center justify-center text-primary">
          <School className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-lg font-bold leading-none text-gray-900 dark:text-white">AGISchool</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Student Portal</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 gap-2 flex flex-col overflow-y-auto no-scrollbar">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white font-medium"
            activeProps={{
              className: 'bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/10 dark:hover:text-primary'
            }}
          >
            <item.icon className="w-5 h-5 group-[.active]:fill-current" />
            <span className="text-sm leading-normal">{item.label}</span>
          </Link>
        ))}
        
        <div className="h-px bg-gray-200 dark:bg-gray-800 my-2 mx-2"></div>
        
        <Link
          to="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <Settings className="w-5 h-5" />
          <span className="text-sm leading-normal">Settings</span>
        </Link>
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <Link 
          to="/creation"
          className="w-full flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-primary hover:bg-primary/90 transition-colors text-white text-sm font-bold shadow-sm"
        >
          <Plus className="w-5 h-5" />
          <span className="truncate">New Project</span>
        </Link>
      </div>
    </aside>
  )
}
