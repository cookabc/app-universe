import { motion } from 'framer-motion'

interface GameOverScreenProps {
    handleReset: () => void
}

export function GameOverScreen({ handleReset }: GameOverScreenProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/50"
        >
            <div className="text-center text-white">
                <h2 className="text-4xl font-bold mb-4">Game Over</h2>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleReset}
                    className="px-6 py-3 bg-primary text-primary-foreground rounded-full text-lg font-semibold hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-opacity-50 transition-colors duration-200"
                >
                    Restart
                </motion.button>
            </div>
        </motion.div>
    )
}
