import { motion } from 'framer-motion'

interface WordListProps {
    remainingWords: string[]
}

export function WordList({ remainingWords }: WordListProps) {
    return (
        <div>
            <h3 className="text-xl font-semibold mb-2">剩余单词：</h3>
            <div className="flex flex-wrap gap-2">
                {remainingWords.map((word) => (
                    <motion.span
                        key={word}
                        className="px-3 py-1 bg-white/30 rounded-full text-lg"
                        whileHover={{ scale: 1.05 }}
                    >
                        {word}
                    </motion.span>
                ))}
            </div>
        </div>
    )
}
