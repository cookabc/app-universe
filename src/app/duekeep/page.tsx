import type { Metadata } from 'next'
import DueKeepPage from './client-page'

export const metadata: Metadata = {
    title: 'DueKeep',
    description: 'Track and manage your subscription renewals, bill due dates, and routine tasks in one simple dashboard.',
    keywords: ['subscription tracker', 'due dates', 'renewal reminder', 'bill tracker', 'task management'],
}

export default function Page() {
    return <DueKeepPage />
}