import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ChevronUp, Moon, Sun } from 'lucide-react'

interface FloatingButtonsProps {
    showScrollTop: boolean
    scrollToTop: () => void
    darkMode: boolean
    setDarkMode: (value: boolean) => void
}

export function FloatingButtons({ showScrollTop, scrollToTop, darkMode, setDarkMode }: FloatingButtonsProps) {
    return (
        <motion.div
            className="fixed bottom-8 right-8 flex flex-col gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <AnimatePresence>
                {showScrollTop && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>
                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full p-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-transform duration-300 hover:scale-110"
                            onClick={scrollToTop}
                            aria-label="回到顶部"
                        >
                            <ChevronUp className="h-6 w-6" />
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
            <Button
                variant="outline"
                size="icon"
                className={`rounded-full p-2 ${darkMode ? 'bg-yellow-500 text-gray-900' : 'bg-gray-800 text-white'} transition-transform duration-300 hover:scale-110`}
                onClick={() => setDarkMode(!darkMode)}
                aria-label={darkMode ? '切换到浅色主题' : '切换到深色主题'}
            >
                {darkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
            </Button>
        </motion.div>
    )
}
