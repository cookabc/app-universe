import { formatTag } from '@/data/tools'
import { useI18nReady } from '@/hooks/useI18nReady'

/**
 * Resolve a tag's display label: the localized `tags.*` translation when
 * available, otherwise the formatted tag name.
 */
export function useTagLabel() {
    const { t, isReady } = useI18nReady()

    return (tag: string) => {
        if (isReady) {
            const key = `tags.${tag}`
            const translated = t(key)
            if (translated !== key) return translated
        }
        return formatTag(tag)
    }
}
