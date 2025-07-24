import { Suspense } from 'react'
import { OptimizedErrorBoundary } from './error-boundary'
import { OptimizedLoading } from './loading'

interface OptimizedLayoutProps {
    children: React.ReactNode
    header?: React.ReactNode
    sidebar?: React.ReactNode
    footer?: React.ReactNode
    className?: string
}

// Enhanced layout component for Next.js 15 with streaming support
export function OptimizedLayout({ children, header, sidebar, footer, className = '' }: OptimizedLayoutProps) {
    return (
        <div className={`min-h-screen flex flex-col ${className}`}>
            {header && (
                <OptimizedErrorBoundary>
                    <Suspense fallback={<HeaderSkeleton />}>
                        <header className="sticky top-0 z-50 bg-white shadow-sm">{header}</header>
                    </Suspense>
                </OptimizedErrorBoundary>
            )}

            <div className="flex-1 flex">
                {sidebar && (
                    <OptimizedErrorBoundary>
                        <Suspense fallback={<SidebarSkeleton />}>
                            <aside className="w-64 bg-gray-50 border-r">{sidebar}</aside>
                        </Suspense>
                    </OptimizedErrorBoundary>
                )}

                <main className="flex-1 overflow-auto">
                    <OptimizedErrorBoundary>
                        <OptimizedLoading>{children}</OptimizedLoading>
                    </OptimizedErrorBoundary>
                </main>
            </div>

            {footer && (
                <OptimizedErrorBoundary>
                    <Suspense fallback={<FooterSkeleton />}>
                        <footer className="bg-gray-100 border-t">{footer}</footer>
                    </Suspense>
                </OptimizedErrorBoundary>
            )}
        </div>
    )
}

// Skeleton components for loading states
function HeaderSkeleton() {
    return (
        <div className="h-16 bg-white border-b animate-pulse">
            <div className="flex items-center justify-between h-full px-6">
                <div className="h-8 w-32 bg-gray-200 rounded"></div>
                <div className="flex space-x-4">
                    <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                </div>
            </div>
        </div>
    )
}

function SidebarSkeleton() {
    return (
        <div className="w-64 bg-gray-50 border-r animate-pulse">
            <div className="p-4 space-y-4">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-10 bg-gray-200 rounded"></div>
                ))}
            </div>
        </div>
    )
}

function FooterSkeleton() {
    return (
        <div className="h-20 bg-gray-100 border-t animate-pulse">
            <div className="flex items-center justify-center h-full">
                <div className="h-4 w-48 bg-gray-200 rounded"></div>
            </div>
        </div>
    )
}

// Specialized layouts for different page types
export function AppPageLayout({ children }: { children: React.ReactNode }) {
    return (
        <OptimizedLayout className="bg-gradient-to-br from-gray-900 to-gray-700 text-white">
            <div className="container mx-auto px-4 py-8">{children}</div>
        </OptimizedLayout>
    )
}

export function GameLayout({ children }: { children: React.ReactNode }) {
    return (
        <OptimizedLayout className="bg-black text-white">
            <div className="flex items-center justify-center min-h-screen p-4">{children}</div>
        </OptimizedLayout>
    )
}

export function ToolLayout({
    children,
    title,
    description,
}: {
    children: React.ReactNode
    title: string
    description?: string
}) {
    return (
        <OptimizedLayout>
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
                    {description && <p className="text-gray-600">{description}</p>}
                </div>
                {children}
            </div>
        </OptimizedLayout>
    )
}
