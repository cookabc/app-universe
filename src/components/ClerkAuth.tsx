'use client'

import { Button } from '@/components/ui/button'
import { useClerkEnabled } from './ClerkProvider'
import React from 'react'

// Dynamic import of Clerk components
function ClerkAuthInner() {
    const { SignedOut, SignedIn, SignInButton, SignUpButton, UserButton } = React.useMemo(
        () => require('@clerk/nextjs'),
        []
    )

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
    const { isEnabled } = useClerkEnabled()

    if (!isEnabled) {
        return null
    }

    return <ClerkAuthInner />
}
