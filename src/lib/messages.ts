import en from '@/../public/locales/en/common.json'
import zh from '@/../public/locales/zh/common.json'
import type { Locale } from '@/lib/locale'

const MESSAGES = { en, zh }

export function getMessages(locale: Locale) {
    return MESSAGES[locale]
}
