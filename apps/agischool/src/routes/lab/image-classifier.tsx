import { createFileRoute, Link } from '@tanstack/react-router'
import { ChevronRight, HelpCircle, FlaskConical, Rocket, BrainCircuit } from 'lucide-react'
import { LabHeader } from '../../components/lab/image-classifier/layout/LabHeader'
import { DataCollection } from '../../components/lab/image-classifier/DataCollection'
import { TrainingPerformance, TrainingDataPoint } from '../../components/lab/image-classifier/TrainingPerformance'
import { Hyperparameters } from '../../components/lab/image-classifier/Hyperparameters'
import { ConsoleOutput } from '../../components/lab/image-classifier/ConsoleOutput'
import { useState, useRef, useEffect } from 'react'

export const Route = createFileRoute('/lab/image-classifier')({
  component: ImageClassifierLab,
})

function ImageClassifierLab() {
  const [isTraining, setIsTraining] = useState(false)
  const [trainingData, setTrainingData] = useState<TrainingDataPoint[]>([])
  const trainingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const [epoch, setEpoch] = useState(0)

  const TOTAL_EPOCHS = 50

  const startTraining = () => {
    setIsTraining(true)
    setEpoch(0)
    setTrainingData([]) // Clear previous data
    
    // Initial point
    setTrainingData([{ epoch: 0, accuracy: 0.1, loss: 2.0 }])

    let currentEpoch = 0
    
    trainingIntervalRef.current = setInterval(() => {
      currentEpoch += 1
      setEpoch(currentEpoch)

      // Simulate realistic looking curves
      // Accuracy goes up (logarithmic/sigmoid-ish)
      // Loss goes down (exponential decay)
      
      const progress = currentEpoch / TOTAL_EPOCHS
      const accuracy = 0.1 + (0.85 * (1 - Math.exp(-5 * progress))) + (Math.random() * 0.05 - 0.025)
      const loss = 2.0 * Math.exp(-4 * progress) + (Math.random() * 0.1 - 0.05)

      setTrainingData(prev => [...prev, {
        epoch: currentEpoch,
        accuracy: Math.min(Math.max(accuracy, 0), 1),
        loss: Math.max(loss, 0)
      }])

      if (currentEpoch >= TOTAL_EPOCHS) {
        stopTraining()
      }
    }, 200) // Update every 200ms -> 10 seconds total for 50 epochs
  }

  const stopTraining = () => {
    setIsTraining(false)
    if (trainingIntervalRef.current) {
      clearInterval(trainingIntervalRef.current)
      trainingIntervalRef.current = null
    }
  }

  useEffect(() => {
    return () => {
      if (trainingIntervalRef.current) {
        clearInterval(trainingIntervalRef.current)
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#f6f6f8] dark:bg-[#121121] transition-colors duration-200 font-sans flex flex-col">
      <LabHeader />
      
      <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-6">
        {/* Breadcrumbs & Heading */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Link to="/learning" className="hover:text-primary transition-colors">Learning</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="hover:text-primary transition-colors cursor-pointer">Computer Vision</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 dark:text-white font-medium">Image Classifier</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">Image Classifier: Cat vs. Dog</h1>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
                Teach the computer to recognize animals using your webcam or uploaded photos. Follow the steps below to train your own AI model.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm">
                <HelpCircle className="w-5 h-5" />
                Tutorial
              </button>
            </div>
          </div>
        </div>

        {/* Mode Tabs */}
        <div className="w-full border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-8">
            <button className="group flex items-center gap-2 pb-3 border-b-[3px] border-transparent hover:border-gray-300 transition-all text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <FlaskConical className="w-5 h-5" />
              <span className="font-medium">Experience</span>
            </button>
            <button className="group flex items-center gap-2 pb-3 border-b-[3px] border-primary text-primary">
              <BrainCircuit className="w-5 h-5 fill-current" />
              <span className="font-bold">Train Mode</span>
            </button>
            <button className="group flex items-center gap-2 pb-3 border-b-[3px] border-transparent hover:border-gray-300 transition-all text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <Rocket className="w-5 h-5" />
              <span className="font-medium">Apply</span>
            </button>
          </div>
        </div>

        {/* Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full pb-10">
          {/* LEFT COLUMN: Workspace (Data & Viz) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <DataCollection />
            <TrainingPerformance 
              data={trainingData} 
              currentEpoch={epoch} 
              totalEpochs={TOTAL_EPOCHS} 
            />
          </div>

          {/* RIGHT COLUMN: Sidebar Controls */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <Hyperparameters 
              isTraining={isTraining}
              onStartTraining={startTraining}
              onStopTraining={stopTraining}
            />
            <ConsoleOutput />
          </div>
        </div>
      </main>
    </div>
  )
}
