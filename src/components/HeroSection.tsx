import { motion } from 'framer-motion'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { TypewriterText } from '@/components/typewriter-text'

// Constants
const ANIMATION_CONFIG = {
    TYPING_SPEED: 120,
    DELETING_SPEED: 100,
    PAUSE_TIME: 1500,
    WORDS: ['World', 'Dream', 'Life'] as const,
} as const

// Animation variants
const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
} as const

export const HeroSection = () => {
    const [currentWordIndex, setCurrentWordIndex] = useState(0)
    const [currentText, setCurrentText] = useState('')
    const [isDeleting, setIsDeleting] = useState(false)

    const animateText = useCallback(() => {
        const currentWord = ANIMATION_CONFIG.WORDS[currentWordIndex]

        if (!isDeleting) {
            if (currentText !== currentWord) {
                return {
                    newText: currentWord.slice(0, currentText.length + 1),
                    delay: ANIMATION_CONFIG.TYPING_SPEED,
                }
            }
            return {
                newText: currentText,
                delay: ANIMATION_CONFIG.PAUSE_TIME,
                shouldDelete: true,
            }
        }

        if (currentText !== '') {
            return {
                newText: currentText.slice(0, currentText.length - 1),
                delay: ANIMATION_CONFIG.DELETING_SPEED,
            }
        }

        return {
            newText: currentText,
            nextWord: true,
        }
    }, [currentText, currentWordIndex, isDeleting])

    useEffect(() => {
        let timeout: NodeJS.Timeout

        const updateText = () => {
            const result = animateText()

            if (result.shouldDelete) {
                timeout = setTimeout(() => setIsDeleting(true), result.delay)
            } else if (result.nextWord) {
                setIsDeleting(false)
                setCurrentWordIndex((prev) => (prev + 1) % ANIMATION_CONFIG.WORDS.length)
            } else {
                timeout = setTimeout(() => setCurrentText(result.newText), result.delay)
            }
        }

        updateText()

        return () => clearTimeout(timeout)
    }, [animateText])

    return (
        <section className="min-h-[50vh] w-full my-20 p-10 md:p-16 flex items-center justify-center text-center z-10">
            <motion.div
                className="space-y-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            >
                <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white">
                    Build Your Digital <TypewriterText text={currentText} />{' '}
                    <span className="block mt-4 text-2xl sm:text-3xl md:text-4xl font-normal">One App at a Time</span>
                </h2>
                <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
                    Explore our curated collection of innovative tools designed to streamline your workflow and boost
                    productivity.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-12">
                    <motion.button className="button-primary px-8 py-4 text-lg w-full sm:w-auto" {...buttonVariants}>
                        <Link href="/tool-navigation">Get Started</Link>
                    </motion.button>
                    <motion.button className="button-secondary px-8 py-4 text-lg w-full sm:w-auto" {...buttonVariants}>
                        <Link href="/docs">Learn More</Link>
                    </motion.button>
                </div>
            </motion.div>
        </section>
    )
}
