import type { Metadata } from 'next'
import HomePage from './client-page'

export const metadata: Metadata = {
    title: 'Real-time Fund Tracker',
    description: 'Track your mutual funds and asset management in real-time. Calculate profits and manage your portfolio.',
    keywords: ['fund tracker', 'mutual funds', 'portfolio management', 'real-time finance', 'asset tracking'],
}

export default function Page() {
    return <HomePage />
}