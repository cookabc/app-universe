'use client'

import { motion } from 'framer-motion'
import { Suspense } from 'react'

// Next.js 15 optimized loading component with React 19 features
export function OptimizedLoading({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
    return <Suspense fallback={fallback || <DefaultLoadingSpinner />}>{children}</Suspense>
}

// Enhanced loading spinner with React 19 optimizations
export function LoadingSpinner({
    size = 'md',
    color = 'blue',
}: {
    size?: 'sm' | 'md' | 'lg'
    color?: 'blue' | 'white' | 'gray'
}) {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
    }

    const colorClasses = {
        blue: 'border-t-blue-600',
        white: 'border-t-white',
        gray: 'border-t-gray-400',
    }

    return (
        <motion.div
            className={`animate-spin rounded-full border-2 border-gray-300/30 ${colorClasses[color]} ${sizeClasses[size]}`}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
    )
}

function DefaultLoadingSpinner() {
    return (
        <div className="flex items-center justify-center p-8">
            <LoadingSpinner />
        </div>
    )
}

// Enhanced loading states for different components with dark theme support
export function AppGridLoading() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                    key={i}
                    className="h-48 bg-gradient-to-br from-gray-800/50 to-gray-700/30 rounded-xl overflow-hidden relative"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                >
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    />
                    <div className="p-6 space-y-3">
                        <div className="h-6 bg-gray-600/50 rounded w-3/4 animate-pulse" />
                        <div className="h-4 bg-gray-600/30 rounded w-full animate-pulse" />
                        <div className="h-4 bg-gray-600/30 rounded w-2/3 animate-pulse" />
                    </div>
                </motion.div>
            ))}
        </div>
    )
}

export function GameLoading({ gameName }: { gameName?: string }) {
    return (
        <motion.div
            className="flex flex-col items-center justify-center min-h-[400px] space-y-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
        >
            <div className="relative">
                <LoadingSpinner size="lg" color="white" />
                <motion.div
                    className="absolute inset-0 rounded-full border-2 border-white/20"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
            </div>
            <div className="text-center space-y-2">
                <p className="text-xl font-semibold text-white">Loading {gameName || 'Game'}...</p>
                <p className="text-sm text-gray-300">Preparing your experience</p>
            </div>
            <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
            </div>
        </motion.div>
    )
}

// New: Page loading component
export function PageLoading({ title }: { title?: string }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
            <motion.div
                className="text-center space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <LoadingSpinner size="lg" color="white" />
                {title && <p className="text-lg text-white">{title}</p>}
            </motion.div>
        </div>
    )
}

// New: Streaming content loader
export function StreamingLoader({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
    return <Suspense fallback={fallback || <LoadingSpinner />}>{children}</Suspense>
}
