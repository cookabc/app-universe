'use client'

import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ThemeSwitch } from '@/components/theme-switch'

export const Header = () => {
    return (
        <header className="container mx-auto px-4 py-6 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-foreground">
                AI Universe
            </Link>
            <div className="hidden md:flex items-center space-x-4">
                <ThemeSwitch width={56} height={28} className="scale-75" />
                <SignedOut>
                    <SignInButton mode="modal">
                        <Button variant="outline">Login</Button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                        <Button>Sign Up</Button>
                    </SignUpButton>
                </SignedOut>
                <SignedIn>
                    <UserButton afterSignOutUrl="/" />
                </SignedIn>
            </div>
        </header>
    )
}
