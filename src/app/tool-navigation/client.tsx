'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { AppErrorBoundary } from '@/components/optimized/error-boundary'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import { Header } from './components/header'
import { ToolList } from './components/tool-list'
import { FloatingButtons } from './components/floating-buttons'
import { useToolState } from './hooks/useToolState'
import { initialTools } from './constants'
import type { Tool } from './types'

export default function ToolNavigationClient() {
    const [searchTerm, setSearchTerm] = useState('')
    const [darkMode, setDarkMode] = useState(false)
    const [showScrollTop, setShowScrollTop] = useState(false)
    const searchInputRef = useRef<HTMLInputElement>(null)

    const { tools, favorites, recentlyUsed, toggleFavorite, addToRecentlyUsed, handleVote } = useToolState(initialTools)

    const categories = Array.from(new Set(tools.map((tool) => tool.category)))

    const navigationStats = useMemo(
        () => ({
            totalTools: tools.length,
            totalCategories: categories.length,
            favoriteCount: favorites.length,
            recentCount: recentlyUsed.length,
            averageRating:
                tools.length > 0
                    ? (tools.reduce((acc, tool) => acc + tool.rating, 0) / tools.length).toFixed(1)
                    : '0.0',
            topCategory: categories.reduce(
                (a, b) =>
                    tools.filter((t) => t.category === a).length > tools.filter((t) => t.category === b).length ? a : b,
                categories[0] || '',
            ),
        }),
        [tools, categories, favorites.length, recentlyUsed.length],
    )

    const filteredTools = useMemo(
        () =>
            tools.filter(
                (tool) =>
                    tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    tool.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    tool.description.toLowerCase().includes(searchTerm.toLowerCase()),
            ),
        [tools, searchTerm],
    )

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === '/' && event.target !== searchInputRef.current) {
                event.preventDefault()
                searchInputRef.current?.focus()
            }
        }
        const handleScroll = () => {
            setShowScrollTop(window.pageYOffset > 300)
        }
        window.addEventListener('keydown', handleKeyPress)
        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('keydown', handleKeyPress)
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleToolClick = (tool: Tool) => {
        window.open(tool.url, '_blank')
        addToRecentlyUsed(tool.id)
    }

    return (
        <AppErrorBoundary>
            <div
                className={`min-h-screen transition-colors duration-300 ${
                    darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-purple-100 to-indigo-200'
                }`}
            >
                <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
                    <Header
                        navigationStats={navigationStats}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        searchInputRef={searchInputRef}
                    />

                    <div className="mb-8">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" className="lg:hidden mb-4">
                                    <Menu className="mr-2 h-4 w-4" /> 分类
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left">
                                <nav className="flex flex-col space-y-4">
                                    {categories.map((category) => (
                                        <Button
                                            key={category}
                                            variant="ghost"
                                            onClick={() => {
                                                const element = document.getElementById(category)
                                                if (element) {
                                                    element.scrollIntoView({ behavior: 'smooth' })
                                                }
                                            }}
                                        >
                                            {category}
                                        </Button>
                                    ))}
                                </nav>
                            </SheetContent>
                        </Sheet>
                        <ToolList
                            categories={categories}
                            filteredTools={filteredTools}
                            tools={tools}
                            favorites={favorites}
                            recentlyUsed={recentlyUsed}
                            handleToolClick={handleToolClick}
                            toggleFavorite={toggleFavorite}
                            handleVote={handleVote}
                        />
                    </div>
                </div>

                <FloatingButtons
                    showScrollTop={showScrollTop}
                    scrollToTop={scrollToTop}
                    darkMode={darkMode}
                    setDarkMode={setDarkMode}
                />
            </div>
        </AppErrorBoundary>
    )
}
