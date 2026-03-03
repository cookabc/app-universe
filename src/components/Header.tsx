'use client'

import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, useClerk } from '@clerk/nextjs'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ThemeSwitch } from '@/components/theme-switch'

const AuthButtons = () => {
    try {
        useClerk()
        return (
            <>
                <SignedOut>
                    <SignInButton mode="modal">
                        <Button variant="outline" asChild>
                            <span>Login</span>
                        </Button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                        <Button asChild>
                            <span>Sign Up</span>
                        </Button>
                    </SignUpButton>
                </SignedOut>
                <SignedIn>
                    <UserButton afterSignOutUrl="/" />
                </SignedIn>
            </>
        )
    } catch {
        return null
    }
}

export const Header = () => {
    return (
        <header className="sticky top-0 z-50 w-full bg-background border-b-2 border-slate-800 shadow-[var(--box-shadow)]">
            <div className="container mx-auto px-4 h-16 flex justify-between items-center">
                <Link href="/" className="text-2xl font-black font-heading tracking-tight text-foreground hover:text-primary transition-colors">
                    App Universe
                </Link>
                <div className="hidden md:flex items-center space-x-4">
                    <ThemeSwitch width={56} height={28} className="scale-75" />
                    <AuthButtons />
                </div>
            </div>
        </header>
    )
}
