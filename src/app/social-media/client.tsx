'use client'

import { useMemo, useState } from 'react'
import { AppErrorBoundary } from '@/components/optimized/error-boundary'
import { LoginDialog } from '@/components/sm/LoginDialog'
import { PostDetailDialog } from '@/components/sm/PostDetailDialog'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { BottomNav } from './components/bottom-nav'
import { PostList } from './components/post-list'
import { SearchBar } from './components/search-bar'
import { useAuth } from './hooks/useAuth'
import { usePosts } from './hooks/usePosts'
import type { Post } from './types'

export default function SocialMediaClient() {
    const [activeTab, setActiveTab] = useState<'x' | 'weibo'>('x')
    const { isXAuthenticated, isWeiboAuthenticated, setIsXAuthenticated, setIsWeiboAuthenticated, handleLogin } = useAuth(
        activeTab,
    )
    const isAuthenticated = activeTab === 'x' ? isXAuthenticated : isWeiboAuthenticated
    const { posts, isLoading, loadMoreRef } = usePosts(activeTab, isAuthenticated)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedPost, setSelectedPost] = useState<Post | null>(null)

    const socialStats = useMemo(() => {
        const currentPosts = posts
        return {
            totalPosts: currentPosts.length,
            averageLikes:
                currentPosts.length > 0
                    ? Math.round(currentPosts.reduce((acc, post) => acc + post.likes, 0) / currentPosts.length)
                    : 0,
            totalEngagement: currentPosts.reduce(
                (acc, post) => acc + post.likes + (post.retweets ?? 0) + (post.comments ?? 0),
                0,
            ),
            platform: activeTab === 'x' ? 'X' : 'Weibo',
            isAuthenticated,
        }
    }, [posts, activeTab, isAuthenticated])

    const filteredPosts = useMemo(() => {
        return posts.filter(
            (post) =>
                post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.user.username.toLowerCase().includes(searchQuery.toLowerCase()),
        )
    }, [posts, searchQuery])

    return (
        <AppErrorBoundary>
            <div className="flex flex-col h-screen bg-background text-foreground">
                <main className="flex-1 p-6 overflow-auto lg:ml-16 pb-24">
                    <div className="max-w-4xl mx-auto space-y-6">
                        <div className="bg-card rounded-lg p-4 mb-4">
                            <div className="flex justify-between items-center text-sm">
                                <span>Platform: {socialStats.platform}</span>
                                <span>Posts: {socialStats.totalPosts}</span>
                                <span>Avg Likes: {socialStats.averageLikes}</span>
                                <span>Total Engagement: {socialStats.totalEngagement}</span>
                            </div>
                        </div>

                        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

                        {!isAuthenticated ? (
                            <LoginDialog platform={activeTab} onSubmit={handleLogin} />
                        ) : (
                            <PostList
                                posts={filteredPosts}
                                platform={activeTab}
                                setSelectedPost={setSelectedPost}
                                isLoading={isLoading}
                                loadMoreRef={loadMoreRef}
                            />
                        )}
                    </div>
                </main>

                <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

                <div className="fixed bottom-20 right-4 bg-card p-2 rounded-lg shadow-md">
                    <div className="flex items-center space-x-2">
                        <Label htmlFor="auth-toggle" className="text-sm font-medium">
                            Simulate Login Status
                        </Label>
                        <Switch
                            id="auth-toggle"
                            checked={isAuthenticated}
                            onCheckedChange={(checked) => {
                                if (activeTab === 'x') {
                                    setIsXAuthenticated(checked)
                                } else {
                                    setIsWeiboAuthenticated(checked)
                                }
                            }}
                            aria-label="Toggle Login Status"
                        />
                    </div>
                </div>

                {selectedPost && (
                    <PostDetailDialog post={selectedPost} platform={activeTab} onClose={() => setSelectedPost(null)} />
                )}
            </div>
        </AppErrorBoundary>
    )
}
