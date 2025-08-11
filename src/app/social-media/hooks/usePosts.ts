import { useState, useCallback, useEffect, useRef, useTransition } from 'react'
import { generateMockPosts } from '../lib/mockData'
import type { Post } from '../types'

export function usePosts(activeTab: 'x' | 'weibo', isAuthenticated: boolean) {
    const [posts, setPosts] = useState<Post[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const observerRef = useRef<IntersectionObserver | null>(null)
    const loadMoreRef = useRef<HTMLDivElement>(null)
    const [isPending, startTransition] = useTransition()

    const loadMorePosts = useCallback(() => {
        startTransition(() => {
            setIsLoading(true)
            setTimeout(() => {
                const newPosts = generateMockPosts(activeTab, 10)
                setPosts((prev) => [...prev, ...newPosts])
                setIsLoading(false)
            }, 1000)
        })
    }, [activeTab])

    useEffect(() => {
        if (isAuthenticated) {
            setPosts(generateMockPosts(activeTab, 20))
        } else {
            setPosts([])
        }
    }, [isAuthenticated, activeTab])

    useEffect(() => {
        observerRef.current = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) {
                    loadMorePosts()
                }
            },
            { threshold: 1.0 },
        )

        if (loadMoreRef.current) {
            observerRef.current.observe(loadMoreRef.current)
        }

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect()
            }
        }
    }, [loadMorePosts])

    return { posts, isLoading, loadMoreRef, isPending }
}
