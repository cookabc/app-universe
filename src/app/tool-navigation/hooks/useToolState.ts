import { useState, useEffect, useCallback, useTransition } from 'react'
import type { Tool } from '../types'

export function useToolState(initialTools: Tool[]) {
    const [tools, setTools] = useState<Tool[]>(initialTools)
    const [favorites, setFavorites] = useState<number[]>([])
    const [recentlyUsed, setRecentlyUsed] = useState<number[]>([])
    const [isPending, startTransition] = useTransition()

    useEffect(() => {
        const storedFavorites = localStorage.getItem('favorites')
        if (storedFavorites) {
            setFavorites(JSON.parse(storedFavorites))
        }
        const storedRecentlyUsed = localStorage.getItem('recentlyUsed')
        if (storedRecentlyUsed) {
            setRecentlyUsed(JSON.parse(storedRecentlyUsed))
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites))
    }, [favorites])

    useEffect(() => {
        localStorage.setItem('recentlyUsed', JSON.stringify(recentlyUsed))
    }, [recentlyUsed])

    const toggleFavorite = useCallback((id: number) => {
        setFavorites((prev) => (prev.includes(id) ? prev.filter((fId) => fId !== id) : [...prev, id]))
    }, [])

    const addToRecentlyUsed = useCallback((id: number) => {
        setRecentlyUsed((prev) => [id, ...prev.filter((rId) => rId !== id)].slice(0, 5))
    }, [])

    const handleVote = useCallback((toolId: number, isUpvote: boolean) => {
        startTransition(() => {
            setTools((prevTools) =>
                prevTools.map((tool) =>
                    tool.id === toolId
                        ? {
                              ...tool,
                              rating: (tool.rating * tool.votes + (isUpvote ? 5 : 1)) / (tool.votes + 1),
                              votes: tool.votes + 1,
                          }
                        : tool,
                ),
            )
        })
    }, [])

    return {
        tools,
        favorites,
        recentlyUsed,
        toggleFavorite,
        addToRecentlyUsed,
        handleVote,
        isPending,
    }
}
