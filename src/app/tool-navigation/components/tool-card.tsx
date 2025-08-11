import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ExternalLink, Star, ThumbsDown, ThumbsUp } from 'lucide-react'
import type { Tool } from '../types'

interface ToolCardProps {
    tool: Tool
    isFavorite: boolean
    onToolClick: (tool: Tool) => void
    onToggleFavorite: (id: number) => void
    onVote: (toolId: number, isUpvote: boolean) => void
}

export function ToolCard({ tool, isFavorite, onToolClick, onToggleFavorite, onVote }: ToolCardProps) {
    const [ref, inView] = useInView({
        triggerOnce: true,
        rootMargin: '-50px 0px',
    })

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="group"
        >
            <div className="relative w-full h-full flex flex-col items-start justify-between p-6 rounded-xl shadow-lg transition-all duration-300 overflow-hidden bg-card hover:bg-card/80 transform hover:scale-105 hover:-rotate-1">
                <div className="z-10 w-full">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                            <span className="text-3xl mr-3 transition-transform duration-300 group-hover:scale-125">
                                {tool.icon}
                            </span>
                            <h3 className="text-xl font-semibold">{tool.name}</h3>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-yellow-500 hover:text-yellow-600 transition-transform duration-300 hover:scale-110"
                            onClick={(e) => {
                                e.stopPropagation()
                                onToggleFavorite(tool.id)
                            }}
                        >
                            <Star className={isFavorite ? 'fill-current' : ''} />
                        </Button>
                    </div>
                    <p className="text-sm mb-4 text-muted-foreground">{tool.description}</p>
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center">
                            <span className="text-lg font-semibold mr-2">{tool.rating.toFixed(1)}</span>
                            <span className="text-sm text-muted-foreground">({tool.votes} 票)</span>
                        </div>
                        <div className="flex space-x-2">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="transition-transform duration-300 hover:scale-110"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                onVote(tool.id, true)
                                            }}
                                        >
                                            <ThumbsUp className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>好评</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="transition-transform duration-300 hover:scale-110"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                onVote(tool.id, false)
                                            }}
                                        >
                                            <ThumbsDown className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>差评</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        className="w-full justify-center transition-colors duration-300 hover:bg-primary hover:text-primary-foreground"
                        onClick={() => onToolClick(tool)}
                    >
                        访问网站 <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                </div>
                <div className="absolute -right-12 -bottom-12 w-24 h-24 bg-primary rounded-full opacity-10 transition-transform duration-300 transform group-hover:scale-150" />
            </div>
        </motion.div>
    )
}
