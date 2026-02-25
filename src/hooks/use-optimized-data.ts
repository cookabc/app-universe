'use client'

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react'

// Enhanced data fetching hook with React 19 features
export function useOptimizedData<T>(
    fetcher: () => Promise<T>,
    options: {
        key?: string
        revalidateOnFocus?: boolean
        revalidateOnReconnect?: boolean
        dedupingInterval?: number
        errorRetryCount?: number
        errorRetryInterval?: number
    } = {},
) {
    const {
        key,
        revalidateOnFocus = true,
        revalidateOnReconnect = true,
        dedupingInterval = 2000,
        errorRetryCount = 3,
        errorRetryInterval = 1000,
    } = options

    const [data, setData] = useState<T | null>(null)
    const [error, setError] = useState<Error | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isValidating, setIsValidating] = useState(false)
    const [isPending, startTransition] = useTransition()

    const retryCountRef = useRef(0)
    const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    // Memoize the cache key
    const _cacheKey = useMemo(() => key || fetcher.toString(), [key, fetcher])

    // Clear timeout on unmount
    useEffect(() => {
        return () => {
            if (retryTimeoutRef.current) {
                clearTimeout(retryTimeoutRef.current)
            }
        }
    }, [])

    // Enhanced fetch function with error handling and retries
    const fetchData = useCallback(
        async (isRevalidation = false) => {
            // Clear any pending retry when starting a new fetch
            if (retryTimeoutRef.current) {
                clearTimeout(retryTimeoutRef.current)
                retryTimeoutRef.current = null
            }

            if (isRevalidation) {
                setIsValidating(true)
            } else {
                setIsLoading(true)
            }

            try {
                const result = await fetcher()

                // Use startTransition for non-blocking state updates
                startTransition(() => {
                    setData(result)
                    setError(null)
                    retryCountRef.current = 0
                })
            } catch (err) {
                const error = err instanceof Error ? err : new Error('Unknown error')

                if (retryCountRef.current < errorRetryCount) {
                    const nextRetryCount = retryCountRef.current
                    const delay = errorRetryInterval * 2 ** nextRetryCount

                    retryTimeoutRef.current = setTimeout(
                        () => {
                            retryCountRef.current += 1
                            fetchData(isRevalidation)
                        },
                        delay,
                    ) // Exponential backoff
                } else {
                    startTransition(() => {
                        setError(error)
                    })
                }
            } finally {
                startTransition(() => {
                    setIsLoading(false)
                    setIsValidating(false)
                })
            }
        },
        [fetcher, errorRetryCount, errorRetryInterval],
    )

    // Initial data fetch
    useEffect(() => {
        fetchData()
    }, [fetchData])

    // Revalidate on focus
    useEffect(() => {
        if (!revalidateOnFocus) return

        const handleFocus = () => {
            if (data && !isValidating) {
                fetchData(true)
            }
        }

        window.addEventListener('focus', handleFocus)
        return () => window.removeEventListener('focus', handleFocus)
    }, [revalidateOnFocus, data, isValidating, fetchData])

    // Revalidate on reconnect
    useEffect(() => {
        if (!revalidateOnReconnect) return

        const handleOnline = () => {
            if (data && !isValidating) {
                fetchData(true)
            }
        }

        window.addEventListener('online', handleOnline)
        return () => window.removeEventListener('online', handleOnline)
    }, [revalidateOnReconnect, data, isValidating, fetchData])

    // Manual revalidation function
    const mutate = useCallback(
        (newData?: T) => {
            if (newData !== undefined) {
                startTransition(() => {
                    setData(newData)
                })
            } else {
                fetchData(true)
            }
        },
        [fetchData],
    )

    return {
        data,
        error,
        isLoading,
        isValidating,
        isPending,
        mutate,
        retry: () => fetchData(true),
    }
}
