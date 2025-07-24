import React from 'react'
// Server Component - no 'use client' needed
export const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear()
    return (
        <footer className="mt-20 py-8 text-center text-gray-400">
            <p>&copy; {currentYear} App Universe. All rights reserved.</p>
            <div className="mt-2 text-sm text-gray-500">
                <p>Built with Next.js 15 & React 19</p>
            </div>
        </footer>
    )
}
