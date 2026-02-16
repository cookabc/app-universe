import { Info, Play, Sliders, Square } from 'lucide-react'

interface HyperparametersProps {
    isTraining: boolean
    onStartTraining: () => void
    onStopTraining: () => void
}

export function Hyperparameters({ isTraining, onStartTraining, onStopTraining }: HyperparametersProps) {
    return (
        <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30">
                <div className="flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-gray-400" />
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white uppercase tracking-wider">
                        Configuration
                    </h3>
                </div>
            </div>

            <div className="p-5 flex flex-col gap-6">
                {/* Epochs */}
                <div className="group">
                    <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                            Epochs
                            <Info className="w-4 h-4 text-gray-400 cursor-help" />
                        </label>
                        <span className="text-sm font-mono text-primary font-bold bg-primary/10 px-1.5 rounded">
                            50
                        </span>
                    </div>
                    <input
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                        max="100"
                        min="10"
                        type="range"
                        defaultValue="50"
                        disabled={isTraining}
                    />
                </div>

                {/* Learning Rate */}
                <div className="group">
                    <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                            Learning Rate
                            <Info className="w-4 h-4 text-gray-400 cursor-help" />
                        </label>
                        <span className="text-sm font-mono text-primary font-bold bg-primary/10 px-1.5 rounded">
                            0.001
                        </span>
                    </div>
                    <input
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                        max="100"
                        min="1"
                        type="range"
                        defaultValue="30"
                        disabled={isTraining}
                    />
                    <div className="flex justify-between mt-1">
                        <span className="text-[10px] text-gray-400">Slow</span>
                        <span className="text-[10px] text-gray-400">Fast</span>
                    </div>
                </div>

                {/* Batch Size */}
                <div className="group">
                    <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                            Batch Size
                            <Info className="w-4 h-4 text-gray-400 cursor-help" />
                        </label>
                        <span className="text-sm font-mono text-primary font-bold bg-primary/10 px-1.5 rounded">
                            16
                        </span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                        {[8, 16, 32, 64].map((size) => (
                            <button
                                key={size}
                                disabled={isTraining}
                                className={`py-1.5 text-xs font-medium rounded border transition-colors ${
                                    size === 16
                                        ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary'
                                        : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-primary hover:text-primary'
                                } ${isTraining ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Action Button */}
                <div className="pt-2">
                    {!isTraining ? (
                        <button
                            onClick={onStartTraining}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold transition-all shadow-lg shadow-primary/20 active:scale-[0.98]"
                        >
                            <Play className="w-5 h-5 fill-current" />
                            Start Training
                        </button>
                    ) : (
                        <button
                            onClick={onStopTraining}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-all shadow-lg shadow-red-500/20 active:scale-[0.98]"
                        >
                            <Square className="w-5 h-5 fill-current" />
                            Stop Training
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
