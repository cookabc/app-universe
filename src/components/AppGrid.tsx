'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import apps from '@/data/apps'

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
}

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
}

export function AppGrid() {
    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto"
        >
            {apps.map((app) => (
                <motion.div key={app.path} variants={item}>
                    <Link href={app.path} className="group block h-full">
                        <div className="relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:shadow-2xl hover:shadow-primary/5 dark:border-gray-800 dark:bg-gray-900/50 dark:hover:border-gray-700 dark:hover:bg-gray-800/50">
                            {/* Glow Effect */}
                            <div
                                className="absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-20"
                                style={{ backgroundColor: app.color }}
                            />

                            <div className="relative flex flex-col h-full gap-6">
                                {/* Icon */}
                                <div className="flex items-center justify-between">
                                    <div
                                        className="flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                                        style={{
                                            backgroundColor: app.color,
                                            boxShadow: `0 8px 32px -8px ${app.color}66`,
                                        }}
                                    >
                                        <app.icon className="h-8 w-8" strokeWidth={2} />
                                    </div>
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-muted-foreground transition-all duration-300 group-hover:border-primary/20 group-hover:bg-primary/10 group-hover:text-primary">
                                        <ArrowRight className="h-5 w-5 -rotate-45 transition-transform duration-300 group-hover:rotate-0" />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="space-y-3">
                                    <h3 className="text-2xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                                        {app.name}
                                    </h3>
                                    <p className="text-base leading-relaxed text-muted-foreground line-clamp-2">
                                        {app.description}
                                    </p>
                                </div>

                                {/* Learn More Link */}
                                <div className="mt-auto flex items-center text-sm font-medium text-primary opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                                    Launch App <ArrowRight className="ml-1 h-4 w-4" />
                                </div>
                            </div>
                        </div>
                    </Link>
                </motion.div>
            ))}
        </motion.div>
    )
}
