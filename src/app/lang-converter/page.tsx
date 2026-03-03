import { Metadata } from 'next'
import LangConverterClient from './client'

export const metadata: Metadata = {
    title: 'Language Converter',
    description: 'Convert between different languages and scripts easily with our AI-powered language converter tool.',
    keywords: ['language converter', 'translation', 'script converter', 'AI translation'],
}

export default function LangConverterPage() {
    return <LangConverterClient />
}
