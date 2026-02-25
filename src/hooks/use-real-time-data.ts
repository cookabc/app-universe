'use client'

import { useCallback, useEffect, useRef, useState, useTransition } from 'react'

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
