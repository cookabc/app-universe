import { motion } from 'framer-motion'
import Link from 'next/link'

export const HeroSection = () => {
    return (
        <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-center justify-center">
            <div className="relative z-10 text-center p-6 sm:px-8 max-w-5xl mx-auto">
                <motion.div
                    className="space-y-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                >
                    <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white">
                        Build Your Digital World
                        <span className="block mt-4 text-2xl sm:text-3xl md:text-4xl font-normal">
                            One App at a Time
                        </span>
                    </h2>

                    <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
                        Explore our curated collection of innovative tools designed to streamline your workflow and
                        boost productivity.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-12">
                        <motion.button
                            className="button-primary px-8 py-4 text-lg w-full sm:w-auto"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link href="/tool-navigation">Get Started</Link>
                        </motion.button>

                        <motion.button
                            className="button-secondary px-8 py-4 text-lg w-full sm:w-auto"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link href="/docs">Learn More</Link>
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
