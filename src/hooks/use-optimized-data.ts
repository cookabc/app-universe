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

// Optimistic mutations hook
export function useOptimisticMutation<T, U>(
    mutationFn: (data: U) => Promise<T>,
    options: {
        onSuccess?: (data: T) => void
        onError?: (error: Error) => void
        optimisticUpdate?: (data: U) => T
    } = {},
) {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<Error | null>(null)

    const mutate = useCallback(
        async (data: U) => {
            setError(null)

            // Optimistic update if provided
            if (options.optimisticUpdate) {
                const optimisticResult = options.optimisticUpdate(data)
                options.onSuccess?.(optimisticResult)
            }

            try {
                const result = await mutationFn(data)

                startTransition(() => {
                    options.onSuccess?.(result)
                })

                return result
            } catch (err) {
                const error = err instanceof Error ? err : new Error('Mutation failed')

                startTransition(() => {
                    setError(error)
                    options.onError?.(error)
                })

                throw error
            }
        },
        [mutationFn, options],
    )

    return {
        mutate,
        isPending,
        error,
    }
}

// Real-time data hook with WebSocket support
export function useRealTimeData<T>(
    url: string,
    options: {
        initialData?: T
        reconnectInterval?: number
        maxReconnectAttempts?: number
    } = {},
) {
    const { initialData, reconnectInterval = 3000, maxReconnectAttempts = 5 } = options

    const [data, setData] = useState<T | null>(initialData || null)
    const [isConnected, setIsConnected] = useState(false)
    const [error, setError] = useState<Error | null>(null)
    const [reconnectAttempts, setReconnectAttempts] = useState(0)
    // New state to trigger reconnection via dependency
    const [reconnectTrigger, setReconnectTrigger] = useState(0)
    const [isPending, startTransition] = useTransition()

    // Internal refs to avoid dependency loops and stale closures
    const reconnectCountRef = useRef(0)
    const wsRef = useRef<WebSocket | null>(null)
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        let isCurrent = true

        const connect = () => {
            try {
                // Ensure previous connection is closed
                if (wsRef.current) {
                    wsRef.current.close()
                }

                wsRef.current = new WebSocket(url)
                const ws = wsRef.current

                ws.onopen = () => {
                    if (!isCurrent) {
                        ws.close()
                        return
                    }
                    startTransition(() => {
                        setIsConnected(true)
                        setError(null)
                        setReconnectAttempts(0)
                    })
                    reconnectCountRef.current = 0
                }

                ws.onmessage = (event) => {
                    if (!isCurrent) return
                    try {
                        const newData = JSON.parse(event.data)
                        startTransition(() => {
                            setData(newData)
                        })
                    } catch (err) {
                        console.error('Failed to parse WebSocket message:', err)
                    }
                }

                ws.onclose = () => {
                    if (!isCurrent) return

                    startTransition(() => {
                        setIsConnected(false)
                    })

                    // Attempt to reconnect using effect dependency
                    if (reconnectCountRef.current < maxReconnectAttempts) {
                        reconnectTimeoutRef.current = setTimeout(() => {
                            if (!isCurrent) return

                            reconnectCountRef.current += 1
                            startTransition(() => {
                                setReconnectAttempts(reconnectCountRef.current)
                                // Trigger effect re-run for reconnection
                                setReconnectTrigger((prev) => prev + 1)
                            })
                        }, reconnectInterval)
                    }
                }

                ws.onerror = (_err) => {
                    if (!isCurrent) return
                    startTransition(() => {
                        setError(new Error('WebSocket connection error'))
                    })
                }
            } catch (err) {
                if (!isCurrent) return
                startTransition(() => {
                    setError(err instanceof Error ? err : new Error('Connection failed'))
                })
            }
        }

        connect()

        return () => {
            isCurrent = false
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current)
            }
            if (wsRef.current) {
                wsRef.current.close()
            }
        }
    }, [url, reconnectInterval, maxReconnectAttempts, reconnectTrigger])

    const sendMessage = useCallback((message: any) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(message))
        }
    }, [])

    return {
        data,
        isConnected,
        error,
        isPending,
        sendMessage,
        reconnectAttempts,
    }
}
