import { createFileRoute } from '@tanstack/react-router'
import { StatsGrid } from '../../components/teacher/dashboard/StatsGrid'
import { RecentActivity } from '../../components/teacher/dashboard/RecentActivity'

export const Route = createFileRoute('/teacher/dashboard')({
  component: Dashboard,
})

function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h2>
        <p className="text-gray-500 dark:text-gray-400">Welcome back, Professor Anderson. Here's what's happening today.</p>
      </div>

      <StatsGrid />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
           {/* Placeholder for a chart or main content area */}
           <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-[#e8e8f3] dark:border-gray-800 shadow-sm p-6 h-[400px] flex items-center justify-center">
              <p className="text-gray-400">Student Progress Chart (Coming Soon)</p>
           </div>
        </div>
        <div className="lg:col-span-1">
          <RecentActivity />
        </div>
      </div>
    </div>
  )
}
