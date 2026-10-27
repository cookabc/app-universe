import { notFound } from 'next/navigation'
import { isLocale, type Locale } from '@/lib/locale'

export async function requireLocale(params: Promise<{ locale: string }>): Promise<Locale> {
    const { locale } = await params
    if (!isLocale(locale)) notFound()
    return locale
}
