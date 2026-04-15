import { useEffect, useRef, useState } from 'react'

interface UsePollingOptions<T> {
    fn: () => Promise<T>
    interval: number
    enabled?: boolean
    onSuccess?: (data: T) => void
    onError?: (error: Error) => void
    immediate?: boolean
}

interface UsePollingResult<T> {
    data: T | null
    loading: boolean
    error: Error | null
    start: () => void
    stop: () => void
    refetch: () => Promise<void>
}

export function usePolling<T>({
    fn,
    interval,
    enabled = true,
    onSuccess,
    onError,
    immediate = true,
}: UsePollingOptions<T>): UsePollingResult<T> {
    const [data, setData] = useState<T | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)
    const [isActive, setIsActive] = useState(enabled && immediate)

    const intervalRef = useRef<NodeJS.Timeout | null>(null)
    const isMountedRef = useRef(true)

    const fetchData = async () => {
        if (!isMountedRef.current) return

        setLoading(true)
        setError(null)

        try {
            const result = await fn()

            if (isMountedRef.current) {
                setData(result)
                onSuccess?.(result)
            }
        } catch (err) {
            if (isMountedRef.current) {
                const error = err instanceof Error ? err : new Error('Unknown error')
                setError(error)
                onError?.(error)
            }
        } finally {
            if (isMountedRef.current) {
                setLoading(false)
            }
        }
    }

    const start = () => {
        if (isActive) return

        setIsActive(true)
    }

    const stop = () => {
        setIsActive(false)
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
        }
    }

    const refetch = async () => {
        await fetchData()
    }

    useEffect(() => {
        isMountedRef.current = true

        return () => {
            isMountedRef.current = false
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }
    }, [])

    const fnRef = useRef(fn)
    fnRef.current = fn

    useEffect(() => {
        if (!isActive) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
                intervalRef.current = null
            }
            return
        }

        if (immediate) {
            fetchData()
        }

        intervalRef.current = setInterval(() => {
            fnRef.current()
        }, interval)

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
                intervalRef.current = null
            }
        }
    }, [isActive, interval, immediate])

    return {
        data,
        loading,
        error,
        start,
        stop,
        refetch,
    }
}

// Simplified version for basic polling needs
interface UseSimplePollingOptions<T> {
    fn: () => Promise<T>
    interval: number
    enabled?: boolean
}

function useSimplePolling<T>({ fn, interval, enabled = true }: UseSimplePollingOptions<T>): T | null {
    const [data, setData] = useState<T | null>(null)

    useEffect(() => {
        if (!enabled) return

        let isMounted = true

        const fetchData = async () => {
            try {
                const result = await fn()
                if (isMounted) {
                    setData(result)
                }
            } catch (error) {
                console.error('Polling error:', error)
            }
        }

        // Initial fetch
        fetchData()

        const intervalId = setInterval(fetchData, interval)

        return () => {
            isMounted = false
            clearInterval(intervalId)
        }
    }, [fn, interval, enabled])

    return data
}
