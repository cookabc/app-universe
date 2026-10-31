import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

/**
 * Exposes the i18next instance plus an `isReady` flag. Resources are bundled
 * and initialised synchronously, so `t` is safe to call on the first render.
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
