import type { Metadata } from 'next'
import AGISchoolPlusPage from './client-page'

export const metadata: Metadata = {
    title: 'AGI School',
    description: 'Learn about Artificial General Intelligence, prompt engineering, and modern AI development at AGI School.',
    keywords: ['AGI', 'AI education', 'prompt engineering', 'artificial intelligence', 'learning'],
}

export default function Page() {
    return <AGISchoolPlusPage />
}