'use client'

import { useEffect, useRef } from 'react'

interface TradingViewChartProps {
    symbol: string
    resolution?: string
    dataApiSuffix?: string
    onSymbolChange?: (info: { symbol: string; description?: string; exchange?: string }) => void
}

export default function TradingViewChart({
    symbol,
    resolution = '1D',
    dataApiSuffix = '',
    onSymbolChange,
}: TradingViewChartProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    // biome-ignore lint/suspicious/noExplicitAny: TradingView widget lacks type definitions
    const widgetRef = useRef<any>(null)
    const initialSymbolRef = useRef(symbol)
    const initialResolutionRef = useRef(resolution)
    const dataApiSuffixRef = useRef(dataApiSuffix)
    const onSymbolChangeRef = useRef(onSymbolChange)

    useEffect(() => {
        onSymbolChangeRef.current = onSymbolChange
    }, [onSymbolChange])

    useEffect(() => {
        dataApiSuffixRef.current = dataApiSuffix
    }, [dataApiSuffix])

    // Initialize chart
    useEffect(() => {
        if (!containerRef.current) return

        const initChart = () => {
            if (!window.TradingView?.widget || !containerRef.current) {
                console.error('TradingView widget not found or container is null')
                return
            }

            // biome-ignore lint/suspicious/noExplicitAny: TradingView widget options lack type definitions
            const widgetOptions: any = {
                container: containerRef.current,
                autosize: true,
                symbol: initialSymbolRef.current,
                interval: initialResolutionRef.current,
                datafeed: {
                    // biome-ignore lint/suspicious/noExplicitAny: TV datafeed callbacks are untyped
                    onReady: (callback: any) => {
                        setTimeout(() => {
                            callback({
                                supported_resolutions: ['1', '5', '15', '30', '60', '240', '1D', '1W', '1M'],
                                supports_group_request: false,
                                supports_marks: false,
                                supports_search: true,
                                supports_time: true,
                                supports_timescale_marks: false,
                            })
                        }, 0)
                    },
                    // biome-ignore lint/suspicious/noExplicitAny: TV datafeed callbacks are untyped
                    searchSymbols: (userInput: string, _exchange: string, _symbolType: string, onResult: any) => {
                        fetch(`/api/udf/search?query=${encodeURIComponent(userInput)}&limit=10`)
                            .then((response) => response.json())
                            .then((data) => {
                                onResult(
                                    (
                                        data as {
                                            symbol: string
                                            name: string
                                            full_name?: string
                                            description?: string
                                            exchange?: string
                                            ticker?: string
                                            type?: string
                                        }[]
                                    ).map((item) => ({
                                        symbol: item.symbol || item.name,
                                        full_name: item.full_name || item.symbol || item.name,
                                        description: item.description || item.symbol || item.name,
                                        exchange: item.exchange || '',
                                        ticker: item.ticker || item.symbol || item.name,
                                        type: item.type || 'stock',
                                    })),
                                )
                            })
                            .catch(() => onResult([]))
                    },
                    // biome-ignore lint/suspicious/noExplicitAny: TV datafeed callbacks are untyped
                    resolveSymbol: (symbolName: string, onResolve: any, onError: any) => {
                        fetch(`/api/udf/symbols?symbol=${encodeURIComponent(symbolName)}`)
                            .then((response) => response.json())
                            .then((data) => {
                                onResolve({
                                    name: data.name || data.symbol,
                                    ticker: data.name || data.symbol || data.ticker,
                                    full_name: data.full_name || data.symbol || data.name,
                                    description: data.description || data.symbol || data.name,
                                    type: data.type || 'stock',
                                    session: data.session || '24x7',
                                    exchange: data.exchange || '',
                                    listed_exchange: data.exchange || '',
                                    timezone: data.timezone || 'Etc/UTC',
                                    minmov: data.minmov ?? 1,
                                    pricescale: data.pricescale ?? 100,
                                    format: 'price',
                                    has_intraday: data.has_intraday !== false,
                                    has_daily: data.has_daily !== false,
                                    has_weekly_and_monthly: data.has_weekly_and_monthly !== false,
                                    has_no_volume: false,
                                    supported_resolutions: ['1', '5', '15', '30', '60', '240', '1D', '1W', '1M'],
                                })
                            })
                            .catch(() => onError('Cannot resolve symbol'))
                    },
                    // biome-ignore lint/suspicious/noExplicitAny: TV datafeed callbacks are untyped
                    getBars: (symbolInfo: any, resolution: string, periodParams: any, onResult: any, onError: any) => {
                        const { from, to, countBack } = periodParams as {
                            from: number
                            to: number
                            countBack: number
                        }
                        const url = new URL('/api/udf/history', window.location.origin)
                        const info = symbolInfo as { name?: string; symbol?: string }
                        url.searchParams.set('symbol', info.name || info.symbol || '')
                        url.searchParams.set('resolution', resolution)
                        url.searchParams.set('from', String(from))
                        url.searchParams.set('to', String(to))
                        if (countBack) {
                            url.searchParams.set('countback', String(countBack))
                        }
                        const suffix = dataApiSuffixRef.current
                        if (suffix) {
                            const suffixParams = new URLSearchParams(suffix)
                            suffixParams.forEach((value, key) => {
                                url.searchParams.set(key, value)
                            })
                        }

                        fetch(url.toString())
                            .then((response) => response.json())
                            .then((data) => {
                                if (data.s === 'no_data') {
                                    onResult([], { noData: true })
                                    return
                                }

                                if (data.s === 'error') {
                                    onError(data.errmsg)
                                    return
                                }

                                const bars = data.t.map((time: number, i: number) => ({
                                    time: time * 1000,
                                    open: data.o[i],
                                    high: data.h[i],
                                    low: data.l[i],
                                    close: data.c[i],
                                    volume: data.v[i],
                                }))

                                onResult(bars, { noData: false })
                            })
                            .catch(() => onError('Failed to fetch history'))
                    },
                    subscribeBars: () => {},
                    unsubscribeBars: () => {},
                    // biome-ignore lint/suspicious/noExplicitAny: TV datafeed callbacks are untyped
                    getServerTime: (callback: any) => {
                        callback(Math.floor(Date.now() / 1000))
                    },
                },
                library_path: '/charting_library/',
                locale: 'zh',
                timezone: 'Etc/UTC',
                theme: 'dark',
                hide_top_toolbar: false,
                hide_legend: false,
                withdateranges: true,
                allow_symbol_change: true,
                disabled_features: [
                    'header_compare',
                    'header_screenshot',
                    'header_undo_redo',
                    'display_market_status',
                    'study_templates',
                ],
                enabled_features: [],
                overrides: {
                    'paneProperties.background': '#0a0a0a',
                    'paneProperties.vertGridProperties.color': '#1f2937',
                    'paneProperties.horzGridProperties.color': '#1f2937',
                    'scalesProperties.textColor': '#9ca3af',
                    'mainSeriesProperties.candleStyle.upColor': '#22c55e',
                    'mainSeriesProperties.candleStyle.downColor': '#ef4444',
                    'mainSeriesProperties.candleStyle.wickUpColor': '#22c55e',
                    'mainSeriesProperties.candleStyle.wickDownColor': '#ef4444',
                    'mainSeriesProperties.candleStyle.borderUpColor': '#22c55e',
                    'mainSeriesProperties.candleStyle.borderDownColor': '#ef4444',
                },
            }

            const widget = new window.TradingView.widget(widgetOptions)
            widgetRef.current = widget

            // Subscribe to symbol change events if callback provided
            if (onSymbolChangeRef.current) {
                // biome-ignore lint/suspicious/noExplicitAny: TV widget API is untyped
                ;(widget as any).onChartReady(() => {
                    // biome-ignore lint/suspicious/noExplicitAny: TV widget API is untyped
                    ;(widget as any).subscribe(
                        'onSymbolChange',
                        (event: { symbol?: string; ticker?: string; description?: string; exchange?: string }) => {
                            onSymbolChangeRef.current?.({
                                symbol: event.symbol || event.ticker || '',
                                description: event.description,
                                exchange: event.exchange,
                            })
                        },
                    )
                })
            }
        }

        // Check if script is already loaded
        if (window.TradingView?.widget) {
            initChart()
            return
        }

        const existingScript = document.querySelector<HTMLScriptElement>(
            'script[src="/charting_library/charting_library.js"]',
        )
        if (existingScript) {
            existingScript.addEventListener('load', initChart, { once: true })
            return () => {
                existingScript.removeEventListener('load', initChart)
            }
        }

        // Load TradingView Charting Library
        const script = document.createElement('script')
        script.src = '/charting_library/charting_library.js'
        script.async = true
        script.onload = initChart

        document.head.appendChild(script)

        return () => {
            if (widgetRef.current) {
                widgetRef.current.remove()
                widgetRef.current = null
            }
        }
    }, [])

    // Update symbol/resolution when they change
    useEffect(() => {
        if (widgetRef.current) {
            try {
                widgetRef.current.setSymbol(symbol, resolution, () => {})
            } catch (error) {
                console.error('Failed to set symbol:', error)
            }
        }
    }, [symbol, resolution])

    return <div ref={containerRef} className="tv-chart-container" style={{ width: '100%', height: '100%' }} />
}
