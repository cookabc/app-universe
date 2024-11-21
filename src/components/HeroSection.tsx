import { motion } from 'framer-motion'
import Link from 'next/link'

const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
}

export const HeroSection = () => (
    <section className="min-h-[50vh] w-full my-20 p-10 md:p-16 flex items-center justify-center text-center z-10">
        <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
        >
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white">
                Build Your Digital World
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
