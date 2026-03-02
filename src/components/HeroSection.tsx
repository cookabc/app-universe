'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'

export const HeroSection = () => {
    return (
        <section className="relative w-full py-20 md:py-32 flex items-center justify-center text-center overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-primary/10 rounded-full blur-[120px] opacity-50 animate-pulse" />
                <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-blue-500/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-[800px] h-[600px] bg-purple-500/5 rounded-full blur-[100px]" />
            </div>

            <motion.div
                className="container relative z-10 px-4 space-y-8 max-w-5xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            >
                {/* Pill Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-sm font-medium text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors cursor-pointer"
                >
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span>Welcome to the Future of Apps</span>
                    <ArrowRight className="w-3 h-3 ml-1" />
                </motion.div>

                {/* Main Heading */}
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground leading-[1.1]">
                    All the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-blue-500">AI Tools</span>
                    <br /> You Need in One Place.
                </h1>

                {/* Subheading */}
                <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
                    Experience a curated collection of next-generation applications.
                    From generative art to intelligent automation, power your workflow with cutting-edge AI.
                </p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
                >
                    <Link href="#explore" className="group w-full sm:w-auto">
                        <div className="px-8 py-4 rounded-[var(--radius)] bg-primary border-2 border-slate-800 text-primary-foreground font-semibold text-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-[var(--box-shadow)] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[calc(var(--box-shadow)_+_4px)]">
                            Get Started
                            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </div>
                    </Link>
                    <Link href={process.env.NEXT_PUBLIC_GITHUB_URL ?? '#'} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                        <div className="px-8 py-4 rounded-[var(--radius)] bg-background border-2 border-slate-800 shadow-[var(--box-shadow)] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[calc(var(--box-shadow)_+_4px)] hover:bg-muted text-foreground font-semibold text-lg transition-all flex items-center justify-center gap-2">
                            View Source
                        </div>
                    </Link>
                </motion.div>
            </motion.div>
        </section>
    )
}
