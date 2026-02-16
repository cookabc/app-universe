import { Brain, Medal, Sparkles, Terminal } from 'lucide-react'

export function BadgeWall() {
    return (
        <section className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200/60 dark:border-gray-800 p-6 flex flex-col gap-4 col-span-1 lg:col-span-2">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">My Badge Wall</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Collect badges by completing milestones</p>
                </div>
                <button className="text-primary text-sm font-bold hover:underline">View All</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-2">
                {/* Badge 1 */}
                <div className="flex flex-col items-center gap-2 group cursor-pointer">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/40 dark:to-orange-900/40 flex items-center justify-center border-4 border-white dark:border-surface-dark shadow-sm group-hover:scale-105 transition-transform">
                        <Medal className="w-10 h-10 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <span className="text-sm font-semibold text-center text-gray-900 dark:text-gray-200">
                        First Project
                    </span>
                </div>
                {/* Badge 2 */}
                <div className="flex flex-col items-center gap-2 group cursor-pointer">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 flex items-center justify-center border-4 border-white dark:border-surface-dark shadow-sm group-hover:scale-105 transition-transform">
                        <Brain className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-sm font-semibold text-center text-gray-900 dark:text-gray-200">
                        Logic Master
                    </span>
                </div>
                {/* Badge 3 */}
                <div className="flex flex-col items-center gap-2 group cursor-pointer">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 flex items-center justify-center border-4 border-white dark:border-surface-dark shadow-sm group-hover:scale-105 transition-transform">
                        <Sparkles className="w-10 h-10 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-sm font-semibold text-center text-gray-900 dark:text-gray-200">
                        AI Artist
                    </span>
                </div>
                {/* Badge 4 (Locked) */}
                <div className="flex flex-col items-center gap-2 opacity-60">
                    <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center border-4 border-white dark:border-surface-dark grayscale">
                        <Terminal className="w-10 h-10 text-gray-400" />
                    </div>
                    <span className="text-sm font-medium text-center text-gray-500">Coder Level 2</span>
                </div>
            </div>
        </section>
    )
}
