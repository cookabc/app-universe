import { Link } from '@tanstack/react-router'
import { School, LayoutDashboard, BookOpen, Users, ClipboardCheck, BarChart3, Settings, HelpCircle } from 'lucide-react'

export function TeacherSidebar() {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', to: '/teacher/dashboard' },
    { icon: BookOpen, label: 'Course Management', to: '/teacher/courses' },
    { icon: Users, label: 'Student Roster', to: '/teacher/students' },
    { icon: ClipboardCheck, label: 'Grading', to: '/teacher/grading' },
    { icon: BarChart3, label: 'Reports', to: '/teacher/reports' },
  ]

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col justify-between bg-surface-light dark:bg-surface-dark border-r border-[#e8e8f3] dark:border-gray-800 p-4 transition-colors duration-200">
      <div className="flex flex-col gap-8">
        {/* Branding */}
        <div className="flex gap-3 items-center px-2">
          <div className="bg-primary/10 flex items-center justify-center rounded-lg size-10 text-primary">
            <School className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-gray-900 dark:text-white text-base font-bold leading-normal">AGISchool</h1>
            <p className="text-gray-500 dark:text-gray-400 text-xs font-normal leading-normal">Teacher Portal</p>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium"
              activeProps={{
                className: 'bg-primary/10 text-primary font-semibold hover:bg-primary/10 dark:hover:bg-primary/10'
              }}
            >
              <item.icon className="w-5 h-5 group-[.active]:fill-current" />
              <span className="text-sm leading-normal">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Bottom Settings */}
      <div className="flex flex-col gap-2">
        <Link to="/teacher/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
          <Settings className="w-5 h-5" />
          <span className="text-sm font-medium leading-normal">Settings</span>
        </Link>
        <Link to="/teacher/support" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
          <HelpCircle className="w-5 h-5" />
          <span className="text-sm font-medium leading-normal">Support</span>
        </Link>
      </div>
    </aside>
  )
}
