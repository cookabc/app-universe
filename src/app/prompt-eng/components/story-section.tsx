import { motion, AnimatePresence } from 'framer-motion'
import { Progress } from '@/components/ui/progress'

interface StorySectionProps {
    showStory: boolean
    progress: number
}

export function StorySection({ showStory, progress }: StorySectionProps) {
    return (
        <AnimatePresence>
            {showStory && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-card p-6 rounded-lg shadow-lg mb-12"
                >
                    <h2 className="text-2xl font-bold mb-4 text-foreground">你的AI冒险即将开始！</h2>
                    <p className="text-muted-foreground">
                        在不久的未来，人工智能已经成为日常生活中不可或缺的一部分。然而，只有掌握了Prompt工程技能的人才能真正驾驭AI的力量。你被选加入了一个精英训练营，目标是成为顶尖的Prompt工程师。在这里，你将学习如何引导AI，解决复杂问题，创造令人惊叹的内容。准备好接受挑战，开启你的AI冒险之旅了吗？
                    </p>
                    <div className="mt-4">
                        <Progress value={progress} className="w-full" />
                        <p className="text-sm text-muted-foreground mt-2">加载训练模块中...{progress}%</p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
