import { Menu } from 'lucide-react'
import { type ReactNode, useState } from 'react'
import { StudentSidebar } from './Sidebar'

interface DashboardLayoutProps {
    children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    return (
        <div className="flex h-screen bg-[#f6f6f8] dark:bg-[#121121] transition-colors duration-200 font-sans overflow-hidden">
            <StudentSidebar />

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
            )}

            {/* Mobile Sidebar (reusing StudentSidebar structure but absolute) */}
            <div
                className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-surface-dark z-40 transform transition-transform duration-300 md:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <StudentSidebar />
            </div>

            <div className="flex-1 flex flex-col min-w-0 h-full relative">
                {/* Mobile Header */}
                <div className="md:hidden h-16 bg-white dark:bg-surface-dark border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 z-10 flex-shrink-0">
                    <span className="font-bold text-lg text-gray-900 dark:text-white">AGISchool</span>
                    <button
                        className="p-2 text-gray-500 dark:text-gray-400"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>

                <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 scroll-smooth">
                    <div className="max-w-7xl mx-auto flex flex-col gap-8">{children}</div>
                </main>
            </div>
        </div>
    )
}
