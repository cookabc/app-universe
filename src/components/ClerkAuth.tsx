'use client'

import { Button } from '@/components/ui/button'
import { useClerkEnabled } from './ClerkProvider'
import React, { useState, useEffect } from 'react'

// Dynamic import of Clerk components
function ClerkAuthInner() {
    const [components, setComponents] = useState<any>(null)

    useEffect(() => {
        import('@clerk/nextjs').then((mod) => {
            setComponents({
                SignedOut: mod.SignedOut,
                SignedIn: mod.SignedIn,
                SignInButton: mod.SignInButton,
                SignUpButton: mod.SignUpButton,
                UserButton: mod.UserButton,
            })
        })
    }, [])

    if (!components) {
        return null
    }

    const { SignedOut, SignedIn, SignInButton, SignUpButton, UserButton } = components

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
}

export function ClerkAuth() {
    const { isEnabled, isLoaded } = useClerkEnabled()

    // Wait until Clerk is fully loaded before rendering any Clerk components
    if (!isEnabled || !isLoaded) {
        return null
    }

    return <ClerkAuthInner />
}
