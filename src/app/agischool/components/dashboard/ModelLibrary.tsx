import { ArrowRight, Bot, Database, History, Hourglass, Image, Plus } from 'lucide-react'

export function ModelLibrary() {
    return (
        <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Model Library</h2>
                <button className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-primary transition-colors">
                    <span>Manage Models</span>
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Model Card 1 */}
                <div className="group bg-white dark:bg-surface-dark border border-gray-200/60 dark:border-gray-800 rounded-xl p-5 hover:border-primary/50 dark:hover:border-primary/50 hover:shadow-md transition-all cursor-pointer">
                    <div className="flex justify-between items-start mb-4">
                        <div className="h-12 w-12 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                            <Bot className="w-6 h-6" />
                        </div>
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            Ready
                        </span>
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1 group-hover:text-primary transition-colors">
                        ChatBot Alpha
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                        A conversational agent trained on history textbooks for homework help.
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                        <div className="flex items-center gap-1">
                            <Database className="w-3.5 h-3.5" />
                            <span>1.2MB</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <History className="w-3.5 h-3.5" />
                            <span>2 days ago</span>
                        </div>
                    </div>
                </div>
                {/* Model Card 2 */}
                <div className="group bg-white dark:bg-surface-dark border border-gray-200/60 dark:border-gray-800 rounded-xl p-5 hover:border-primary/50 dark:hover:border-primary/50 hover:shadow-md transition-all cursor-pointer">
                    <div className="flex justify-between items-start mb-4">
                        <div className="h-12 w-12 rounded-lg bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 flex items-center justify-center">
                            <Image className="w-6 h-6" />
                        </div>
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                            Training
                        </span>
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1 group-hover:text-primary transition-colors">
                        Art Style Transfer
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                        Model designed to convert photos into Van Gogh style paintings.
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                        <div className="flex items-center gap-1">
                            <Hourglass className="w-3.5 h-3.5" />
                            <span>85% Complete</span>
                        </div>
                    </div>
                </div>
                {/* Add New Model Card */}
                <div className="group border border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-5 flex flex-col items-center justify-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all cursor-pointer min-h-[180px]">
                    <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors flex items-center justify-center">
                        <Plus className="w-6 h-6" />
                    </div>
                    <span className="font-medium text-gray-500 dark:text-gray-400 group-hover:text-primary transition-colors">
                        Train New Model
                    </span>
                </div>
            </div>
        </section>
    )
}
