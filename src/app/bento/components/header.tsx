'use client'

import { ChevronRight, Menu } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <header className="bg-background px-4 sm:px-8 lg:px-12">
            <div className="mx-auto max-w-[1200px] rounded-b-[15px] border border-t-0 border-border px-4 sm:px-6 lg:px-8 xl:px-12">
                <nav className="flex h-16 items-center justify-between">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-md border border-border">
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M10 2L2 6V14L10 18L18 14V6L10 2Z"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                            <span className="text-xl font-semibold text-foreground">BentoML</span>
                        </Link>
                    </div>
                    <div className="hidden md:flex md:items-center md:space-x-4">
                        <Button variant="ghost" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                            Docs
                        </Button>
                        <Button variant="ghost" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                            Pricing
                        </Button>
                        <Button variant="ghost" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                            Sign In
                        </Button>
                        <Button className="rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/90 border border-border">
                            Sign Up
                            <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                    <div className="md:hidden">
                        <Button variant="ghost" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </div>
                </nav>
            </div>
            {isMenuOpen && (
                <div className="md:hidden">
                    <div className="space-y-1 px-2 pb-3 pt-2">
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-sm font-medium text-muted-foreground hover:text-foreground"
                        >
                            Docs
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-sm font-medium text-muted-foreground hover:text-foreground"
                        >
                            Pricing
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-sm font-medium text-muted-foreground hover:text-foreground"
                        >
                            Sign In
                        </Button>
                        <Button className="w-full justify-start rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/90 border border-border">
                            Sign Up
                            <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </header>
    )
}
