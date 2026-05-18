import { motion } from 'framer-motion'
import { ChevronDown, Star } from 'lucide-react'
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
const LandingPageHero: React.FC = () => {
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState('')
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
            ],
        },
        {
            label: 'Company',
            href: '/company',
        },
    ]
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }
    const handleEmailSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) {
            setEmailError('Email is required')
            return
        }
        if (!validateEmail(email)) {
            setEmailError('Please enter a valid email address')
            return
        }
        setEmailError('')
        // Handle form submission
        console.log('Email submitted:', email)
    }
    const userAvatars = [
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
    ]
    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                                <span className="text-sm font-bold text-primary-foreground">N</span>
                            </div>
                            <span className="ml-2 text-xl font-semibold text-foreground">Nice UI</span>
                        </div>

                        {/* Navigation */}
                        <nav className="hidden md:flex items-center space-x-8">
                            {navigationItems.map((item) => (
                                <div
                                    key={item.label}
                                    className="relative"
                                    onMouseEnter={() => item.dropdown && setActiveDropdown(item.label)}
                                    onMouseLeave={() => setActiveDropdown(null)}
                                >
                                    <button className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                                        {item.label}
                                        {item.dropdown && <ChevronDown className="ml-1 h-4 w-4" />}
                                    </button>

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
                                            className="absolute top-full left-0 mt-2 w-48 rounded-md bg-popover border border-border shadow-lg z-50"
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

                        {/* Auth Buttons */}
                        <div className="flex items-center space-x-4">
                            <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                                Access Account
                            </button>
                            <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                                Join Now
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center py-16 lg:py-24">
                    {/* Left Content */}
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                                People who care about your growth
                            </h1>
                            <p className="text-lg text-muted-foreground max-w-lg">
                                Powerful, self-serve product and growth analytics to help you convert, engage, and
                                retain more.
                            </p>
                        </div>

                        {/* Email Form */}
                        <form onSubmit={handleEmailSubmit} className="space-y-4">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="flex-1">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value)
                                            setEmailError('')
                                        }}
                                        placeholder="Enter your email"
                                        className={cn(
                                            'w-full px-4 py-3 rounded-md border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors',
                                            emailError ? 'border-destructive' : 'border-input',
                                        )}
                                    />
                                    {emailError && <p className="mt-1 text-sm text-destructive">{emailError}</p>}
                                </div>
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors whitespace-nowrap"
                                >
                                    Get started
                                </button>
                            </div>
                        </form>

                        <p className="text-sm text-muted-foreground">
                            We care about your data in our{' '}
                            <a href="/privacy" className="text-primary hover:underline">
                                privacy policy
                            </a>
                            .
                        </p>

                        {/* Social Proof */}
                        <div className="flex items-center space-x-4">
                            <div className="flex -space-x-2">
                                {userAvatars.map((avatar, index) => (
                                    <img
                                        key={index}
                                        src={avatar}
                                        alt={`User ${index + 1}`}
                                        className="h-10 w-10 rounded-full border-2 border-background"
                                    />
                                ))}
                            </div>
                            <div className="flex items-center space-x-1">
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <span className="text-sm font-medium text-foreground">5.0</span>
                            </div>
                            <span className="text-sm text-muted-foreground">from 200+ reviews</span>
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="relative">
                        <div className="aspect-square rounded-2xl overflow-hidden">
                            <img
                                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=600&fit=crop&crop=face"
                                alt="Professional woman working on laptop with warm lighting"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
export default LandingPageHero
