export interface TrainingDataPoint {
  epoch: number
  accuracy: number
  loss: number
}

interface TrainingPerformanceProps {
  data: TrainingDataPoint[]
  currentEpoch: number
  totalEpochs: number
}

export function TrainingPerformance({ data, currentEpoch, totalEpochs }: TrainingPerformanceProps) {
  // Helper to scale values to SVG coordinates
  // SVG ViewBox: 0 0 800 300
  // X axis: 0 to 800 (mapped from 0 to totalEpochs)
  // Y axis: 300 to 0 (mapped from 0 to 1 for accuracy/loss)
  // Note: Loss can be > 1, but for visualization we'll clamp or scale. Let's assume loss 0-2 maps to height.
  
  const width = 800
  const height = 300
  
  const getX = (epoch: number) => (epoch / totalEpochs) * width
  const getYAccuracy = (acc: number) => height - (acc * height) // 0-1 -> height-0
  const getYLoss = (loss: number) => height - (Math.min(loss, 2) / 2 * height) // 0-2 -> height-0

  const accuracyPath = data.length > 1 
    ? 'M' + data.map(p => `${getX(p.epoch)},${getYAccuracy(p.accuracy)}`).join(' L')
    : ''
    
  const lossPath = data.length > 1
    ? 'M' + data.map(p => `${getX(p.epoch)},${getYLoss(p.loss)}`).join(' L')
    : ''

  const lastPoint = data[data.length - 1]

  return (
    <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 flex-1 min-h-[320px]">
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/30">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center size-6 rounded-full bg-primary text-white text-xs font-bold">2</span>
          <h3 className="font-semibold text-gray-900 dark:text-white">Training Performance</h3>
        </div>
        <div className="flex gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
            <span className="size-2.5 rounded-full bg-primary"></span> Accuracy
            {lastPoint && <span className="ml-1 font-mono">{(lastPoint.accuracy * 100).toFixed(1)}%</span>}
          </div>
          <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
            <span className="size-2.5 rounded-full bg-orange-400"></span> Loss
            {lastPoint && <span className="ml-1 font-mono">{lastPoint.loss.toFixed(3)}</span>}
          </div>
          <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
            <span className="size-2.5 rounded-full bg-gray-400"></span> Epoch
            <span className="ml-1 font-mono">{currentEpoch}/{totalEpochs}</span>
          </div>
        </div>
      </div>
      
      <div className="p-6 h-[300px] w-full flex flex-col justify-end relative">
        {/* Simulated Grid Lines */}
        <div className="absolute inset-x-6 inset-y-6 flex flex-col justify-between pointer-events-none">
          <div className="w-full h-px bg-gray-100 dark:bg-gray-800"></div>
          <div className="w-full h-px bg-gray-100 dark:bg-gray-800"></div>
          <div className="w-full h-px bg-gray-100 dark:bg-gray-800"></div>
          <div className="w-full h-px bg-gray-100 dark:bg-gray-800"></div>
          <div className="w-full h-px bg-gray-100 dark:bg-gray-800"></div>
        </div>

        {/* Charts SVG */}
        <svg className="w-full h-full absolute inset-0 p-6 z-10" preserveAspectRatio="none" viewBox={`0 0 ${width} ${height}`}>
          {data.length > 1 && (
            <>
              {/* Accuracy Curve */}
              <path d={accuracyPath} fill="none" stroke="#5048e5" strokeLinecap="round" strokeWidth="3" className="transition-all duration-300 ease-linear"></path>
              <circle cx={getX(lastPoint?.epoch ?? 0)} cy={getYAccuracy(lastPoint?.accuracy ?? 0)} fill="#5048e5" r="4" className="transition-all duration-300 ease-linear"></circle>
              
              {/* Loss Curve */}
              <path d={lossPath} fill="none" stroke="#fb923c" strokeDasharray="6 4" strokeLinecap="round" strokeWidth="3" className="transition-all duration-300 ease-linear"></path>
              <circle cx={getX(lastPoint?.epoch ?? 0)} cy={getYLoss(lastPoint?.loss ?? 0)} fill="#fb923c" r="4" className="transition-all duration-300 ease-linear"></circle>
            </>
          )}
          {data.length <= 1 && (
             <text x="400" y="150" textAnchor="middle" fill="currentColor" className="text-gray-400 dark:text-gray-600 text-sm">Ready to train...</text>
          )}
        </svg>

        {/* Labels */}
        <div className="absolute bottom-1 left-6 text-xs text-gray-400 font-mono">Epoch 0</div>
        <div className="absolute bottom-1 right-6 text-xs text-gray-400 font-mono">Epoch {totalEpochs}</div>
      </div>
    </div>
  )
}
