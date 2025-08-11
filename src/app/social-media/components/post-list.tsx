import { AnimatePresence, motion } from 'framer-motion'
import { Loader } from 'lucide-react'
import { PostCard } from '@/components/sm/PostCard'
import type { Post } from '../types'

interface PostListProps {
    posts: Post[]
    platform: 'x' | 'weibo'
    setSelectedPost: (post: Post | null) => void
    isLoading: boolean
    loadMoreRef: React.RefObject<HTMLDivElement | null>
}

export function PostList({ posts, platform, setSelectedPost, isLoading, loadMoreRef }: PostListProps) {
    return (
        <div className="space-y-4">
            <AnimatePresence mode="wait">
                {posts.map((post) => (
                    <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <PostCard post={post} platform={platform} onClick={() => setSelectedPost(post)} />
                    </motion.div>
                ))}
            </AnimatePresence>
            {isLoading && (
                <div className="flex justify-center items-center py-4" role="status" aria-live="polite">
                    <Loader className="animate-spin" />
                </div>
            )}
            <div ref={loadMoreRef} />
        </div>
    )
}
