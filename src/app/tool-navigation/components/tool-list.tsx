import { motion, AnimatePresence } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ToolCard } from './tool-card'
import type { Tool } from '../types'

interface ToolListProps {
    categories: string[]
    filteredTools: Tool[]
    tools: Tool[]
    favorites: number[]
    recentlyUsed: number[]
    handleToolClick: (tool: Tool) => void
    toggleFavorite: (id: number) => void
    handleVote: (toolId: number, isUpvote: boolean) => void
}

export function ToolList({
    categories,
    filteredTools,
    tools,
    favorites,
    recentlyUsed,
    handleToolClick,
    toggleFavorite,
    handleVote,
}: ToolListProps) {
    return (
        <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
                <TabsTrigger value="all">全部</TabsTrigger>
                <TabsTrigger value="favorites">收藏夹</TabsTrigger>
                <TabsTrigger value="recent">最近使用</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
                <AnimatePresence>
                    {categories.map((category) => (
                        <motion.div
                            key={category}
                            id={category}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="mb-12"
                        >
                            <h2 className="text-2xl sm:text-3xl font-semibold mb-6 pl-2 border-l-4 border-primary">
                                {category}
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredTools
                                    .filter((tool) => tool.category === category)
                                    .map((tool) => (
                                        <ToolCard
                                            key={tool.id}
                                            tool={tool}
                                            isFavorite={favorites.includes(tool.id)}
                                            onToolClick={handleToolClick}
                                            onToggleFavorite={toggleFavorite}
                                            onVote={handleVote}
                                        />
                                    ))}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </TabsContent>
            <TabsContent value="favorites">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tools
                        .filter((tool) => favorites.includes(tool.id))
                        .map((tool) => (
                            <ToolCard
                                key={tool.id}
                                tool={tool}
                                isFavorite={favorites.includes(tool.id)}
                                onToolClick={handleToolClick}
                                onToggleFavorite={toggleFavorite}
                                onVote={handleVote}
                            />
                        ))}
                </div>
            </TabsContent>
            <TabsContent value="recent">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tools
                        .filter((tool) => recentlyUsed.includes(tool.id))
                        .map((tool) => (
                            <ToolCard
                                key={tool.id}
                                tool={tool}
                                isFavorite={favorites.includes(tool.id)}
                                onToolClick={handleToolClick}
                                onToggleFavorite={toggleFavorite}
                                onVote={handleVote}
                            />
                        ))}
                </div>
            </TabsContent>
        </Tabs>
    )
}
