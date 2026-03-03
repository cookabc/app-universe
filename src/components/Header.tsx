'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ThemeSwitch } from '@/components/theme-switch'
import { ClerkAuth } from './ClerkAuth'
import { useClerkEnabled } from './ClerkProvider'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export const Header = () => {
    const { isEnabled } = useClerkEnabled()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <header className="sticky top-0 z-50 w-full bg-background border-b-2 border-slate-800 shadow-[var(--box-shadow)]">
            <div className="container mx-auto px-4 h-16 flex justify-between items-center">
                <Link href="/" className="text-xl md:text-2xl font-black font-heading tracking-tight text-foreground hover:text-primary transition-colors">
                    App Universe
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-4">
                    <ThemeSwitch width={56} height={28} className="scale-75" />
                    {isEnabled ? <ClerkAuth /> : null}
                </div>

                {/* Mobile Menu Button */}
                <div className="flex md:hidden items-center space-x-2">
                    <ThemeSwitch width={44} height={22} className="scale-75" />
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="relative"
                    >
                        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-border bg-background">
                    <div className="container mx-auto px-4 py-4 flex flex-col items-center space-y-4">
                        {isEnabled ? <ClerkAuth /> : null}
                    </div>
                </div>
            )}
        </header>
    )
}
