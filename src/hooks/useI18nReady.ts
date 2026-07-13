import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

/**
 * Exposes the i18next instance plus an `isReady` flag.
 *
 * `isReady` is seeded from `i18n.isInitialized` via a lazy initializer so the
 * first client render already reflects the real state, avoiding a spurious
 * `false → true` flip that would flash hardcoded fallback strings. The effect
 * only fires if initialization completes *after* mount.
 */
export function useI18nReady() {
    const { t, i18n } = useTranslation()
    const [isReady, setIsReady] = useState(() => i18n.isInitialized)

    useEffect(() => {
        if (!isReady && i18n.isInitialized) {
            setIsReady(true)
        }
    }, [isReady, i18n.isInitialized])

    return { t, i18n, isReady }
}
