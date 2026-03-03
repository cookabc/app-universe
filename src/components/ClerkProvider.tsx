'use client'

import type { ClerkProvider as OriginalClerkProviderType } from '@clerk/nextjs'
import { ReactNode, createContext, useContext } from 'react'

interface ClerkContextType {
    isEnabled: boolean
}

const ClerkEnabledContext = createContext<ClerkContextType>({ isEnabled: false })

export function useClerkEnabled() {
    return useContext(ClerkEnabledContext)
}

interface ClerkProviderProps {
    children: ReactNode
    publishableKey: string | undefined
}

// Dynamic import to avoid loading Clerk when not needed
function ClerkProviderInner({ children, publishableKey }: ClerkProviderProps) {
    const [ClerkProviderComponent, setClerkProvider] = React.useState<typeof OriginalClerkProviderType | null>(null)

    React.useEffect(() => {
        if (publishableKey) {
            import('@clerk/nextjs').then((mod) => {
                setClerkProvider(() => mod.ClerkProvider)
            })
        }
    }, [publishableKey])

    if (!ClerkProviderComponent) {
        return (
            <ClerkEnabledContext.Provider value={{ isEnabled: false }}>
                {children}
            </ClerkEnabledContext.Provider>
        )
    }

    return (
        <ClerkEnabledContext.Provider value={{ isEnabled: true }}>
            <ClerkProviderComponent telemetry={false} publishableKey={publishableKey}>
                {children}
            </ClerkProviderComponent>
        </ClerkEnabledContext.Provider>
    )
}

import React from 'react'

export function ClerkProvider({ children, publishableKey }: ClerkProviderProps) {
    // During SSR/build, if no key, just render children without Clerk
    if (!publishableKey) {
        return (
            <ClerkEnabledContext.Provider value={{ isEnabled: false }}>
                {children}
            </ClerkEnabledContext.Provider>
        )
    }

    // Client-side with key - use dynamic import
    return <ClerkProviderInner publishableKey={publishableKey}>{children}</ClerkProviderInner>
}
