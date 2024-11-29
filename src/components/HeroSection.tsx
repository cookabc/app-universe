import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
}

const words = ['World', 'Dream', 'Life']
const TYPING_SPEED = 120
const DELETING_SPEED = 100
const PAUSE_TIME = 1500

export const HeroSection = () => {
    const [currentWordIndex, setCurrentWordIndex] = useState(0)
    const [currentText, setCurrentText] = useState('')
    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
        let timeout: NodeJS.Timeout

        const animateText = () => {
            const currentWord = words[currentWordIndex]

            if (!isDeleting) {
                if (currentText !== currentWord) {
                    timeout = setTimeout(() => {
                        setCurrentText(currentWord.slice(0, currentText.length + 1))
                    }, TYPING_SPEED)
                } else {
                    timeout = setTimeout(() => {
                        setIsDeleting(true)
                    }, PAUSE_TIME)
                }
            } else {
                if (currentText !== '') {
                    timeout = setTimeout(() => {
                        setCurrentText(currentText.slice(0, currentText.length - 1))
                    }, DELETING_SPEED)
                } else {
                    setIsDeleting(false)
                    setCurrentWordIndex((prev) => (prev + 1) % words.length)
                }
            }
        }

        animateText()

        return () => clearTimeout(timeout)
    }, [currentText, currentWordIndex, isDeleting])

    return (
        <section className="min-h-[50vh] w-full my-20 p-10 md:p-16 flex items-center justify-center text-center z-10">
            <motion.div
                className="space-y-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            >
                <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white">
                    Build Your Digital{' '}
                    <span className="relative inline-block text-blue-500 after:content-[''] after:absolute after:right-[-12px] after:top-[-4px] after:w-[8px] after:h-[120%] after:bg-blue-500 after:animate-blink">
                        <span>{currentText}</span>
                    </span>{' '}
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
