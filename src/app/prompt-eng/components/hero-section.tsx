import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

export function HeroSection() {
    return (
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
        >
            <h1 className="text-4xl font-bold text-foreground mb-4">欢迎来到Prompt训练营</h1>
            <p className="text-xl text-muted-foreground mb-8">
                帮助中小学生成为Prompt工程师，通过学习和游戏提升他们的知识和技能
            </p>
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}>
                <Button className="px-8 py-3 text-lg" onClick={() => console.log('开始训练')}>
                    开始训练
                </Button>
            </motion.div>
        </motion.div>
    )
}
