import { createFileRoute } from '@tanstack/react-router'
import { DashboardLayout } from '@/components/dashboard/layout/DashboardLayout'
import { StatsRow } from '@/components/dashboard/StatsRow'
import { KnowledgeRadar } from '@/components/dashboard/KnowledgeRadar'
import { BadgeWall } from '@/components/dashboard/BadgeWall'
import { ModelLibrary } from '@/components/dashboard/ModelLibrary'
import { Portfolio } from '@/components/dashboard/Portfolio'
import { Pencil } from 'lucide-react'

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
})

function Dashboard() {
  return (
    <DashboardLayout>
      {/* Page Heading */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight">Welcome back, Alex!</h1>
          <p className="text-gray-500 dark:text-gray-400 text-base">Ready to build the future today?</p>
        </div>
        <div className="flex items-center gap-3">
          <div 
            className="h-10 w-10 rounded-full bg-cover bg-center border-2 border-white shadow-sm" 
            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB0hRPe9q8vKROjcJxZMLniuC1hB3zH1lZRc4CJ8ZI9uT3O6G1iHSH827gGPMJtNHb5d9l5nkJs8lSsURI6A5frrSgkQqH5EBS32oefnnoQ9f-KXfYEyg723otN-WxlbkngCgz-oswcHmredHykUAzwr-Oe9gI8ILuds6eR0zh9gp05q9uKjSuV_NJ8JGrtb8KwL44e_pzfvf9yJdFU2jkkbDJE2xWqryDw6XI4wrG0ljgppIMKqEa8sGrvgOZB04-P2RaGPArrWQM")' }}
          ></div>
          <button className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <Pencil className="w-4 h-4" />
            <span className="truncate">Edit Profile</span>
          </button>
        </div>
      </header>

      {/* Stats Row */}
      <StatsRow />

      {/* Charts & Badge Wall Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <KnowledgeRadar />
        <BadgeWall />
      </div>

      {/* My Model Library */}
      <ModelLibrary />

      {/* My Portfolio */}
      <Portfolio />
    </DashboardLayout>
  )
}
