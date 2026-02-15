import { Users, BookOpen, Clock, TrendingUp } from 'lucide-react'

const stats = [
  {
    name: 'Total Students',
    value: '156',
    change: '+12%',
    changeType: 'positive',
    icon: Users,
    color: 'text-blue-600',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
  },
  {
    name: 'Course Completion',
    value: '84%',
    change: '+5.4%',
    changeType: 'positive',
    icon: BookOpen,
    color: 'text-green-600',
    bg: 'bg-green-50 dark:bg-green-900/20',
  },
  {
    name: 'Avg. Study Time',
    value: '4.2h',
    change: '-2%',
    changeType: 'negative',
    icon: Clock,
    color: 'text-orange-600',
    bg: 'bg-orange-50 dark:bg-orange-900/20',
  },
  {
    name: 'Engagement Rate',
    value: '92%',
    change: '+18%',
    changeType: 'positive',
    icon: TrendingUp,
    color: 'text-purple-600',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
  },
]

export function StatsGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="bg-surface-light dark:bg-surface-dark overflow-hidden rounded-xl border border-[#e8e8f3] dark:border-gray-800 p-6 shadow-sm transition-all hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div className={`rounded-lg p-3 ${stat.bg}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} aria-hidden="true" />
            </div>
            <span
              className={`inline-flex items-baseline rounded-full px-2.5 py-0.5 text-sm font-medium md:mt-2 lg:mt-0 ${
                stat.changeType === 'positive'
                  ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                  : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
              }`}
            >
              {stat.change}
            </span>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{stat.name}</p>
            <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
