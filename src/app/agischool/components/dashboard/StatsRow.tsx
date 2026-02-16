import { Clock, Flame, FolderOpen, Wrench } from 'lucide-react'

export function StatsRow() {
    const stats = [
        {
            icon: Clock,
            value: '42 Hours',
            label: 'Learning Duration',
            color: 'blue',
            bgClass: 'bg-blue-100 dark:bg-blue-900/30',
            textClass: 'text-blue-600 dark:text-blue-400',
        },
        {
            icon: FolderOpen,
            value: '15 Projects',
            label: 'Completed',
            color: 'purple',
            bgClass: 'bg-purple-100 dark:bg-purple-900/30',
            textClass: 'text-purple-600 dark:text-purple-400',
        },
        {
            icon: Wrench,
            value: '8 Tools',
            label: 'AI Tools Mastered',
            color: 'indigo',
            bgClass: 'bg-indigo-100 dark:bg-indigo-900/30',
            textClass: 'text-indigo-600 dark:text-indigo-400',
        },
        {
            icon: Flame,
            value: '5 Days',
            label: 'Current Streak',
            color: 'orange',
            bgClass: 'bg-orange-100 dark:bg-orange-900/30',
            textClass: 'text-orange-600 dark:text-orange-400',
        },
    ]

    return (
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
                <div
                    key={index}
                    className="bg-white dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-gray-200/60 dark:border-gray-800 flex flex-col gap-1"
                >
                    <div
                        className={`h-8 w-8 rounded-full ${stat.bgClass} ${stat.textClass} flex items-center justify-center mb-2`}
                    >
                        <stat.icon className="w-5 h-5" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                </div>
            ))}
        </section>
    )
}
