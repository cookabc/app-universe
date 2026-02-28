'use client'

import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ThemeSwitch } from '@/components/theme-switch'

export const Header = () => {
    return (
        <header className="sticky top-0 z-50 w-full glass border-b-0 border-x-0 rounded-none bg-background/60 backdrop-blur-xl">
            <div className="container mx-auto px-4 h-16 flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold font-heading text-gradient tracking-tight">
                    App Universe
                </Link>
                <div className="hidden md:flex items-center space-x-4">
                    <ThemeSwitch width={56} height={28} className="scale-75" />
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
                </div>
            </div>
        </header>
    )
}
