'use client'

import { LogIn, User } from 'lucide-react'
import type React from 'react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useI18nReady } from '@/hooks/useI18nReady'
import { useClerkEnabled } from './ClerkProvider'

function ClerkAuthInner() {
    const [components, setComponents] = useState<Record<string, React.ComponentType<any>> | null>(null)
    const { t, isReady } = useI18nReady()

    useEffect(() => {
        import('@clerk/nextjs').then((mod) => {
            setComponents({
                SignedOut: mod.SignedOut as React.ComponentType<{
                    children: React.ReactNode
                }>,
                SignedIn: mod.SignedIn as React.ComponentType<{
                    children: React.ReactNode
                }>,
                SignInButton: mod.SignInButton as React.ComponentType<any>,
                UserButton: mod.UserButton as React.ComponentType<any>,
            })
        })
    }, [])

    if (!components) {
        return null
    }

    const { SignedOut, SignedIn, SignInButton, UserButton } = components

    return (
        <div className="flex items-center">
            <SignedOut>
                <SignInButton mode="modal">
                    <Button
                        asChild
                        className="transition-all duration-300 hover:shadow-md hover:shadow-primary/20 flex items-center space-x-2"
                    >
                        <span className="flex items-center space-x-2">
                            <LogIn className="w-4 h-4" />
                            <span>{isReady ? t('navigation.login') : 'Login'}</span>
                        </span>
                    </Button>
                </SignInButton>
            </SignedOut>
            <SignedIn>
                <UserButton afterSignOutUrl="/" className="transition-all duration-300" userProfileMode="modal">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full transition-all duration-300 hover:bg-muted"
                    >
                        <span>
                            <User className="w-5 h-5" />
                        </span>
                    </Button>
                </UserButton>
            </SignedIn>
        </div>
    )
}

export function ClerkAuth() {
    const { isEnabled, isLoaded } = useClerkEnabled()

    if (!isEnabled || !isLoaded) {
        return null
    }

    return <ClerkAuthInner />
}
