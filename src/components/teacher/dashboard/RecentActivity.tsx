import { CheckCircle2, AlertCircle, PlayCircle, Trophy } from 'lucide-react'

const activity = [
  {
    id: 1,
    type: 'completion',
    student: 'Alex Chen',
    action: 'completed module',
    target: 'Introduction to AI',
    time: '5m ago',
    icon: CheckCircle2,
    iconBg: 'bg-green-100 dark:bg-green-900/30',
    iconColor: 'text-green-600 dark:text-green-400',
  },
  {
    id: 2,
    type: 'achievement',
    student: 'Sarah Miller',
    action: 'earned badge',
    target: 'Python Pioneer',
    time: '12m ago',
    icon: Trophy,
    iconBg: 'bg-yellow-100 dark:bg-yellow-900/30',
    iconColor: 'text-yellow-600 dark:text-yellow-400',
  },
  {
    id: 3,
    type: 'alert',
    student: 'Mike Johnson',
    action: 'needs help with',
    target: 'Neural Networks Basics',
    time: '25m ago',
    icon: AlertCircle,
    iconBg: 'bg-red-100 dark:bg-red-900/30',
    iconColor: 'text-red-600 dark:text-red-400',
  },
  {
    id: 4,
    type: 'start',
    student: 'Emily Davis',
    action: 'started quiz',
    target: 'Machine Learning 101',
    time: '1h ago',
    icon: PlayCircle,
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
]

export function RecentActivity() {
  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-[#e8e8f3] dark:border-gray-800 shadow-sm">
      <div className="p-6 border-b border-[#e8e8f3] dark:border-gray-800 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
        <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
          View all
        </button>
      </div>
      <div className="p-6">
        <div className="flow-root">
          <ul className="-mb-8">
            {activity.map((item, itemIdx) => (
              <li key={item.id}>
                <div className="relative pb-8">
                  {itemIdx !== activity.length - 1 ? (
                    <span
                      className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"
                      aria-hidden="true"
                    />
                  ) : null}
                  <div className="relative flex space-x-3">
                    <div>
                      <span
                        className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-gray-900 ${item.iconBg}`}
                      >
                        <item.icon className={`h-5 w-5 ${item.iconColor}`} aria-hidden="true" />
                      </span>
                    </div>
                    <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-medium text-gray-900 dark:text-white">{item.student}</span>{' '}
                          {item.action}{' '}
                          <span className="font-medium text-gray-900 dark:text-white">{item.target}</span>
                        </p>
                      </div>
                      <div className="whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400">
                        {item.time}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
