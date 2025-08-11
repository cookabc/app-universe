import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface HeaderProps {
    navigationStats: any
    searchTerm: string
    setSearchTerm: (value: string) => void
    searchInputRef: React.RefObject<HTMLInputElement | null>
}

export function Header({ navigationStats, searchTerm, setSearchTerm, searchInputRef }: HeaderProps) {
    return (
        <motion.header
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
        >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">
                工具导航
            </h1>
            <p className="text-lg sm:text-xl mb-4 opacity-75">发现并访问最佳在线工具</p>
            <div className="text-sm text-muted-foreground mb-8">
                {navigationStats.totalTools} 个工具 | {navigationStats.totalCategories} 个分类 | 平均评分:{' '}
                {navigationStats.averageRating} | 热门分类: {navigationStats.topCategory}
            </div>
            <motion.div
                className="relative max-w-2xl mx-auto"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                <Input
                    type="text"
                    placeholder="搜索工具... (按 '/' 快速搜索)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 sm:py-4 rounded-full text-base sm:text-lg shadow-lg bg-card text-foreground"
                    ref={searchInputRef}
                />
                <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={24}
                    aria-hidden="true"
                />
                <span className="sr-only">搜索工具</span>
            </motion.div>
        </motion.header>
    )
}
