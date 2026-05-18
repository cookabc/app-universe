import { motion } from 'framer-motion'
import { ChevronDown, Menu, X } from 'lucide-react'
import type React from 'react'
import { useState } from 'react'
import { cn } from '../../../lib/utils'

interface DropdownItem {
    label: string
    href: string
}
interface NavigationItem {
    label: string
    href?: string
    dropdown?: DropdownItem[]
}
interface HeaderProps {
    className?: string
}
const Header: React.FC<HeaderProps> = ({ className }) => {
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const navigationItems: NavigationItem[] = [
        {
            label: 'Solutions',
            dropdown: [
                {
                    label: 'Analytics',
                    href: '/analytics',
                },
                {
                    label: 'Growth Tools',
                    href: '/growth-tools',
                },
                {
                    label: 'Automation',
                    href: '/automation',
                },
                {
                    label: 'Integrations',
                    href: '/integrations',
                },
            ],
        },
        {
            label: 'Features',
            href: '/features',
        },
        {
            label: 'Pricing',
            href: '/pricing',
        },
        {
            label: 'Resources',
            dropdown: [
                {
                    label: 'Documentation',
                    href: '/docs',
                },
                {
                    label: 'Blog',
                    href: '/blog',
                },
                {
                    label: 'Case Studies',
                    href: '/case-studies',
                },
                {
                    label: 'Help Center',
                    href: '/help',
                },
            ],
        },
        {
            label: 'Company',
            href: '/company',
        },
    ]
    const handleDropdownToggle = (itemLabel: string) => {
        setActiveDropdown(activeDropdown === itemLabel ? null : itemLabel)
    }
    return (
        <header
            className={cn(
                'border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50',
                className,
            )}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                            <span className="text-sm font-bold text-primary-foreground">N</span>
                        </div>
                        <span className="ml-2 text-xl font-semibold text-foreground">Nice UI</span>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {navigationItems.map((item) => (
                            <div
                                key={item.label}
                                className="relative"
                                onMouseEnter={() => item.dropdown && setActiveDropdown(item.label)}
                                onMouseLeave={() => setActiveDropdown(null)}
                            >
                                {item.href ? (
                                    <a
                                        href={item.href}
                                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {item.label}
                                    </a>
                                ) : (
                                    <button className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                                        {item.label}
                                        {item.dropdown && <ChevronDown className="ml-1 h-4 w-4" />}
                                    </button>
                                )}

                                {item.dropdown && activeDropdown === item.label && (
                                    <motion.div
                                        initial={{
                                            opacity: 0,
                                            y: -10,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                        }}
                                        exit={{
                                            opacity: 0,
                                            y: -10,
                                        }}
                                        className="absolute top-full left-0 mt-2 w-48 rounded-md bg-popover border border-border shadow-lg"
                                    >
                                        <div className="py-2">
                                            {item.dropdown.map((dropdownItem) => (
                                                <a
                                                    key={dropdownItem.label}
                                                    href={dropdownItem.href}
                                                    className="block px-4 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                                                >
                                                    {dropdownItem.label}
                                                </a>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        ))}
                    </nav>

                    {/* Desktop Auth Buttons */}
                    <div className="hidden md:flex items-center space-x-4">
                        <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            Access Account
                        </button>
                        <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                            Join Now
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-muted-foreground hover:text-foreground"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle mobile menu"
                    >
                        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <motion.div
                        initial={{
                            opacity: 0,
                            height: 0,
                        }}
                        animate={{
                            opacity: 1,
                            height: 'auto',
                        }}
                        exit={{
                            opacity: 0,
                            height: 0,
                        }}
                        className="md:hidden border-t border-border"
                    >
                        <div className="py-4 space-y-4">
                            {navigationItems.map((item) => (
                                <div key={item.label}>
                                    {item.href ? (
                                        <a
                                            href={item.href}
                                            className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {item.label}
                                        </a>
                                    ) : (
                                        <button
                                            onClick={() => handleDropdownToggle(item.label)}
                                            className="flex items-center justify-between w-full text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {item.label}
                                            {item.dropdown && (
                                                <ChevronDown
                                                    className={cn(
                                                        'h-4 w-4 transition-transform',
                                                        activeDropdown === item.label && 'rotate-180',
                                                    )}
                                                />
                                            )}
                                        </button>
                                    )}

                                    {item.dropdown && activeDropdown === item.label && (
                                        <motion.div
                                            initial={{
                                                opacity: 0,
                                                height: 0,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                height: 'auto',
                                            }}
                                            exit={{
                                                opacity: 0,
                                                height: 0,
                                            }}
                                            className="mt-2 ml-4 space-y-2"
                                        >
                                            {item.dropdown.map((dropdownItem) => (
                                                <a
                                                    key={dropdownItem.label}
                                                    href={dropdownItem.href}
                                                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                                                >
                                                    {dropdownItem.label}
                                                </a>
                                            ))}
                                        </motion.div>
                                    )}
                                </div>
                            ))}

                            {/* Mobile Auth Buttons */}
                            <div className="pt-4 border-t border-border space-y-3">
                                <button className="block w-full text-left text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                                    Access Account
                                </button>
                                <button className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                                    Join Now
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </header>
    )
}
export default Header
