'use client'

import { motion } from 'framer-motion'
import { Menu } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { AppIcon } from '@/components/AppIcon'
import apps from '@/data/apps'
import { AppMenu } from './AppMenu'

export const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <>
            <motion.header
                className="sticky top-0 w-full z-50 backdrop-blur-md border-b border-white/10"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <Link href="/" className="flex items-center space-x-3 group">
                        <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.3 }}>
                            <AppIcon />
                        </motion.div>
                        <span className="text-xl font-semibold tracking-tight group-hover:text-purple-300 transition-colors">
                            App Universe
                        </span>
                    </Link>

                    <nav className="hidden md:flex items-center space-x-8">
                        <Link href="/features" className="text-white/70 hover:text-white transition-colors">
                            Features
                        </Link>
                        <Link href="/docs" className="text-white/70 hover:text-white transition-colors">
                            Docs
                        </Link>
                        <motion.button
                            className="button-primary"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsMenuOpen(true)}
                        >
                            Explore Apps
                        </motion.button>
                    </nav>

                    <button
                        type="button"
                        className="md:hidden text-white hover:text-purple-300 transition-colors"
                        onClick={() => setIsMenuOpen(true)}
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                </div>
            </motion.header>
            {isMenuOpen && <AppMenu setIsMenuOpen={setIsMenuOpen} apps={apps} />}
        </>
    )
}
