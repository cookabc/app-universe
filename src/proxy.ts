import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default async function middleware(request: NextRequest) {
    // Check if Clerk is configured
    const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
    
    if (!publishableKey) {
        // Clerk not configured, just pass through
        return NextResponse.next()
    }
    
    // Clerk is configured, use clerkMiddleware
    const { clerkMiddleware } = await import('@clerk/nextjs/server')
    const handler = clerkMiddleware()
    return handler(request, {} as any)
}

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
}
