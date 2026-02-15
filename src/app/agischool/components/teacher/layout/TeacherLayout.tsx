import { ReactNode } from 'react'
import { TeacherSidebar } from './Sidebar'
import { TeacherTopNav } from './TopNav'

interface TeacherLayoutProps {
  children: ReactNode
}

export function TeacherLayout({ children }: TeacherLayoutProps) {
  return (
    <div className="flex h-screen bg-[#f7f7fa] dark:bg-gray-900 transition-colors duration-200">
      <TeacherSidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <TeacherTopNav />
        
        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
