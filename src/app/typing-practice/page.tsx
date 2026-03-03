import { Metadata } from 'next'
import TypingPracticeClient from './client'

export const metadata: Metadata = {
    title: 'Typing Practice',
    description: 'Improve your typing speed and accuracy with our interactive typing practice tool. Track your WPM and progress.',
    keywords: ['typing practice', 'WPM test', 'typing speed', 'keyboard skills', 'learn typing'],
}

export default function TypingPracticePage() {
    return <TypingPracticeClient />
}
