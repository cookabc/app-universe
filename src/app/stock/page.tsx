'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import PortfolioSidebar from './components/PortfolioSidebar'
import TradingViewChart from './components/TradingViewChart'

interface TreeNode {
    dentryId: number
    inodeId: number
    parentId: number | null
    name: string
    type: 'folder' | 'stock' | 'markdown'
    symbol?: string
    ticker?: string
    description?: string
    exchange?: string
    stockType?: string
    children?: TreeNode[]
}

const desktopBreakpoint = 980
const splitterWidth = 12
const defaultPanelWidths = { left: 280, right: 390 }
const minLeftPanelWidth = 220
const minCenterPanelWidth = 500
const minRightPanelWidth = 320

const timeframes = [
    { label: '1分', resolution: '1' },
    { label: '5分', resolution: '5' },
    { label: '15分', resolution: '15' },
    { label: '30分', resolution: '30' },
    { label: '1小时', resolution: '60' },
    { label: '4小时', resolution: '240' },
    { label: '日K', resolution: '1D' },
    { label: '周K', resolution: '1W' },
    { label: '月K', resolution: '1M' },
]

const chartTabs = [
    { id: 'kline', label: '图表' },
    { id: 'time', label: '分时' },
    { id: 'options', label: '期权' },
    { id: 'finance', label: '财务' },
    { id: 'analysis', label: '分析' },
    { id: 'news', label: '新闻' },
    { id: 'announcement', label: '公告' },
    { id: 'profile', label: '简介' },
]

const railItems = ['自', '交', '资', '图', '告', '账']

const quickTools = ['MA', 'EMA', 'BOLL', 'VOL', 'MACD', 'RSI', 'KDJ', 'WR']

const defaultStock: TreeNode = {
    dentryId: 0,
    inodeId: 0,
    parentId: null,
    name: 'Alphabet Inc - Class C',
    type: 'stock',
    symbol: 'GOOGL',
    ticker: 'GOOG',
    description: 'Alphabet Inc - Class C',
    exchange: 'NASDAQ',
    stockType: 'stocks-us',
}

function formatPercent(value: number | null): string {
    if (value === null || !Number.isFinite(value)) return '--'
    const sign = value > 0 ? '+' : ''
    return `${sign}${value.toFixed(2)}%`
}

function getTrendClass(value: number | null): string {
    return value !== null && Number.isFinite(value) && value < 0 ? 'down' : 'up'
}

function getShortSymbol(item: TreeNode | null): string {
    if (!item) return defaultStock.ticker || 'GOOG'
    const ticker = item.ticker || item.symbol || ''
    return ticker.split(':').pop()?.split('.')[0] || ticker || '--'
}

function inferMarketLabel(item: TreeNode | null): string {
    if (!item) return '美股'
    const type = item.stockType || ''
    const symbol = item.symbol || ''
    if (type === 'stocks-us' || type === 'stocks_us' || symbol.endsWith('.US')) return '美股'
    if (type === 'stocks-hk' || type === 'stocks_hk' || symbol.endsWith('.HK')) return '港股'
    if (
        type === 'stocks-cn' ||
        type === 'stocks_cn' ||
        symbol.endsWith('.SH') ||
        symbol.endsWith('.SZ') ||
        symbol.endsWith('.SS')
    )
        return 'A股'
    if (type === 'crypto' || symbol?.includes('BTC') || symbol?.includes('ETH')) return '加密'
    if (type === 'fx') return '外汇'
    return '美股'
}

function formatLargeNumber(value: number | null): string {
    if (value == null || !Number.isFinite(value)) return '--'
    const abs = Math.abs(value)
    if (abs >= 1e12) return `${(value / 1e12).toFixed(2)} 万亿`
    if (abs >= 1e8) return `${(value / 1e8).toFixed(2)} 亿`
    if (abs >= 1e4) return `${(value / 1e4).toFixed(2)} 万`
    return String(value)
}

function formatStatValue(value: number | string | null): string {
    if (value == null) return '--'
    const num = typeof value === 'number' ? value : Number(value)
    if (!Number.isFinite(num)) return String(value)
    const abs = Math.abs(num)
    if (abs >= 100) return num.toFixed(2)
    if (abs >= 1) return num.toFixed(3)
    return num.toFixed(4)
}

function formatNullablePrice(value: number | null): string {
    return value != null && Number.isFinite(value) ? value.toFixed(2) : '--'
}

function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max)
}

function clampPanelWidths(containerWidth: number, leftWidth: number, rightWidth: number) {
    const availableWidth = containerWidth - splitterWidth * 2
    const maxLeftWidth = Math.max(minLeftPanelWidth, availableWidth - rightWidth - minCenterPanelWidth)
    const nextLeftWidth = clamp(leftWidth, minLeftPanelWidth, maxLeftWidth)
    const maxRightWidth = Math.max(minRightPanelWidth, availableWidth - nextLeftWidth - minCenterPanelWidth)
    const nextRightWidth = clamp(rightWidth, minRightPanelWidth, maxRightWidth)
    const finalMaxLeftWidth = Math.max(minLeftPanelWidth, availableWidth - nextRightWidth - minCenterPanelWidth)
    return {
        left: clamp(nextLeftWidth, minLeftPanelWidth, finalMaxLeftWidth),
        right: nextRightWidth,
    }
}

export default function Home() {
    const shellRef = useRef<HTMLElement>(null)
    const dragStateRef = useRef<{
        type: 'left' | 'right'
        startX: number
        startLeft: number
        startRight: number
    } | null>(null)

    const [panelWidths, setPanelWidths] = useState(defaultPanelWidths)
    const [activeTimeframe, setActiveTimeframe] = useState('日K')
    const [activeChartTab, setActiveChartTab] = useState('kline')
    const [selectedStock, setSelectedStock] = useState<TreeNode | null>(null)

    const [chartSnapshot, setChartSnapshot] = useState({
        status: 'loading' as 'loading' | 'ready' | 'error',
        latest: null as { close: number } | null,
        changePercent: null as number | null,
    })

    const [stockInfo, setStockInfo] = useState<{
        open: number | null
        high: number | null
        low: number | null
        close: number | null
        volume: number | null
        marketCap: number | null
        pe: number | null
        eps: number | null
        pb: number | null
        ps: number | null
        dividendYield: number | null
        roe: number | null
        debtEquity: number | null
        fiftyTwoWeekHigh: number | null
        fiftyTwoWeekLow: number | null
    }>({
        open: null,
        high: null,
        low: null,
        close: null,
        volume: null,
        marketCap: null,
        pe: null,
        eps: null,
        pb: null,
        ps: null,
        dividendYield: null,
        roe: null,
        debtEquity: null,
        fiftyTwoWeekHigh: null,
        fiftyTwoWeekLow: null,
    })

    const [indices, setIndices] = useState({
        dow: {
            symbol: '^DJI',
            name: '道琼斯',
            price: 0,
            change: 0,
            changePercent: 0,
        },
        nasdaq: {
            symbol: '^IXIC',
            name: '纳斯达克',
            price: 0,
            change: 0,
            changePercent: 0,
        },
        sp500: {
            symbol: '^GSPC',
            name: '标普500',
            price: 0,
            change: 0,
            changePercent: 0,
        },
    })

    const [portfolioValue] = useState({
        total: 47916657,
        change: -28643,
        changePercent: -0.06,
    })

    const [clock, setClock] = useState('')
    const [dataMode, setDataMode] = useState<'mock' | 'real'>('mock')

    const activeResolution = timeframes.find((item) => item.label === activeTimeframe)?.resolution ?? '1D'
    const currentStock = selectedStock || defaultStock
    const activeSymbol = currentStock.symbol || defaultStock.symbol || 'GOOGL'
    const activeDescription = currentStock.description || currentStock.name || 'Alphabet Inc - Class C'
    const activeShortSymbol = getShortSymbol(currentStock)
    const activeDisplaySymbol =
        activeShortSymbol.includes('.') || activeShortSymbol.includes('-')
            ? activeShortSymbol
            : `${activeShortSymbol}.US`
    const activeExchange = currentStock.exchange || 'NASDAQ'
    const activeMarketLabel = inferMarketLabel(currentStock)
    const chartChangeTone = getTrendClass(chartSnapshot.changePercent)
    const quoteApiSuffix = `mock=${dataMode === 'mock' ? 'true' : 'false'}`

    const shellStyle = {
        '--left-panel-width': `${panelWidths.left}px`,
        '--right-panel-width': `${panelWidths.right}px`,
    } as React.CSSProperties

    // Clock
    useEffect(() => {
        function updateClock() {
            const now = new Date()
            setClock(
                `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
            )
        }
        updateClock()
        const timer = setInterval(updateClock, 1000)
        return () => clearInterval(timer)
    }, [])

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const mockParam = params.get('mock')
        if (mockParam === 'false') setDataMode('real')
        if (mockParam === 'true') setDataMode('mock')
    }, [])

    // Fetch stock quote info
    useEffect(() => {
        let cancelled = false

        async function fetchStockInfo() {
            try {
                setChartSnapshot((current) => ({ ...current, status: 'loading' }))
                const response = await fetch(
                    `/api/stock/quote?symbols=${encodeURIComponent(activeSymbol)}&${quoteApiSuffix}`,
                )
                if (!response.ok) return
                const data = await response.json()
                const quote = data[activeSymbol]
                if (!quote || cancelled) return

                setStockInfo({
                    open: quote.open ?? null,
                    high: quote.high ?? null,
                    low: quote.low ?? null,
                    close: quote.latestPrice ?? null,
                    volume: quote.volume ?? null,
                    marketCap: quote.marketCap ?? null,
                    pe: quote.pe ?? null,
                    eps: quote.eps ?? null,
                    pb: quote.pb ?? null,
                    ps: quote.ps ?? null,
                    dividendYield: quote.dividendYield ?? null,
                    roe: quote.roe ?? null,
                    debtEquity: quote.debtEquity ?? null,
                    fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh ?? null,
                    fiftyTwoWeekLow: quote.fiftyTwoWeekLow ?? null,
                })

                setChartSnapshot({
                    status: 'ready',
                    latest: quote.latestPrice != null ? { close: quote.latestPrice } : null,
                    changePercent: quote.changePercent ?? null,
                })
            } catch (error) {
                console.error('Failed to fetch stock info', error)
                if (!cancelled) {
                    setChartSnapshot((current) => ({ ...current, status: 'error' }))
                }
            }
        }

        fetchStockInfo()
        const interval = setInterval(fetchStockInfo, 10000)
        return () => {
            cancelled = true
            clearInterval(interval)
        }
    }, [activeSymbol, quoteApiSuffix])

    // Fetch indices
    useEffect(() => {
        let cancelled = false

        async function fetchIndices() {
            try {
                const response = await fetch(`/api/stock/quote?symbols=^DJI,^IXIC,^GSPC&${quoteApiSuffix}`)
                if (!response.ok) return
                const data = await response.json()
                if (cancelled) return

                setIndices({
                    dow: {
                        symbol: '^DJI',
                        name: '道琼斯',
                        price: data['^DJI']?.latestPrice || 0,
                        change: data['^DJI']?.change || 0,
                        changePercent: data['^DJI']?.changePercent || 0,
                    },
                    nasdaq: {
                        symbol: '^IXIC',
                        name: '纳斯达克',
                        price: data['^IXIC']?.latestPrice || 0,
                        change: data['^IXIC']?.change || 0,
                        changePercent: data['^IXIC']?.changePercent || 0,
                    },
                    sp500: {
                        symbol: '^GSPC',
                        name: '标普500',
                        price: data['^GSPC']?.latestPrice || 0,
                        change: data['^GSPC']?.change || 0,
                        changePercent: data['^GSPC']?.changePercent || 0,
                    },
                })
            } catch (error) {
                console.error('Failed to fetch indices', error)
            }
        }

        fetchIndices()
        const interval = setInterval(fetchIndices, 15000)
        return () => {
            cancelled = true
            clearInterval(interval)
        }
    }, [quoteApiSuffix])

    // Panel resize sync
    useEffect(() => {
        function syncPanelWidths() {
            const shell = shellRef.current
            if (!shell || window.innerWidth <= desktopBreakpoint) return
            setPanelWidths((current) => {
                const next = clampPanelWidths(shell.clientWidth, current.left, current.right)
                return next.left === current.left && next.right === current.right ? current : next
            })
        }
        syncPanelWidths()
        window.addEventListener('resize', syncPanelWidths)
        return () => window.removeEventListener('resize', syncPanelWidths)
    }, [])

    // Drag handlers
    useEffect(() => {
        function stopDragging() {
            if (!dragStateRef.current) return
            dragStateRef.current = null
            document.body.classList.remove('is-resizing-columns')
        }

        function handlePointerMove(event: PointerEvent) {
            const dragState = dragStateRef.current
            const shell = shellRef.current
            if (!dragState || !shell || window.innerWidth <= desktopBreakpoint) return
            const deltaX = event.clientX - dragState.startX
            setPanelWidths(() => {
                if (dragState.type === 'left') {
                    return clampPanelWidths(shell.clientWidth, dragState.startLeft + deltaX, dragState.startRight)
                }
                return clampPanelWidths(shell.clientWidth, dragState.startLeft, dragState.startRight - deltaX)
            })
        }

        window.addEventListener('pointermove', handlePointerMove)
        window.addEventListener('pointerup', stopDragging)
        window.addEventListener('pointercancel', stopDragging)

        return () => {
            window.removeEventListener('pointermove', handlePointerMove)
            window.removeEventListener('pointerup', stopDragging)
            window.removeEventListener('pointercancel', stopDragging)
            document.body.classList.remove('is-resizing-columns')
        }
    }, [])

    function handleResizeStart(type: 'left' | 'right', event: React.PointerEvent) {
        if (window.innerWidth <= desktopBreakpoint) return
        event.preventDefault()
        dragStateRef.current = {
            type,
            startX: event.clientX,
            startLeft: panelWidths.left,
            startRight: panelWidths.right,
        }
        document.body.classList.add('is-resizing-columns')
    }

    function resetPanelWidths() {
        const shell = shellRef.current
        if (!shell) return
        setPanelWidths(clampPanelWidths(shell.clientWidth, defaultPanelWidths.left, defaultPanelWidths.right))
    }

    function handleSelectStockNode(node: TreeNode) {
        if (node.type === 'stock' && node.symbol) {
            setSelectedStock({
                ...node,
                exchange: node.exchange || 'NASDAQ',
                stockType: node.stockType || '',
            })
        }
    }

    const handleChartSymbolChange = useCallback(
        (info: { symbol: string; description?: string; exchange?: string }) => {
            if (!info?.symbol) return
            if (info.symbol === activeSymbol) return
            setSelectedStock({
                dentryId: 0,
                inodeId: 0,
                parentId: null,
                name: info.description || info.symbol,
                type: 'stock',
                symbol: info.symbol,
                ticker: info.symbol,
                description: info.description || info.symbol,
                exchange: info.exchange || 'NASDAQ',
                stockType: '',
            })
        },
        [activeSymbol],
    )

    function toggleMockData() {
        setDataMode((current) => {
            const next = current === 'mock' ? 'real' : 'mock'
            const url = new URL(window.location.href)
            url.searchParams.set('mock', next === 'mock' ? 'true' : 'false')
            window.history.replaceState(null, '', url)
            return next
        })
    }

    return (
        <main className="terminal-page">
            <aside className="terminal-rail" aria-label="主导航">
                <div className="rail-logo">V</div>
                <nav className="rail-nav">
                    {railItems.map((item, index) => (
                        <button
                            key={item}
                            type="button"
                            className={`rail-button ${index === 0 ? 'active' : ''}`}
                            title={item}
                        >
                            {item}
                        </button>
                    ))}
                </nav>
                <button type="button" className="rail-button rail-bottom" title="设置">
                    ⚙
                </button>
            </aside>

            <section className="terminal-workspace">
                <header className="terminal-topbar">
                    <div className="search-box">
                        <span>⌕</span>
                        <input
                            aria-label="搜索股票、ETF、指数、新闻、功能"
                            placeholder="搜索股票、ETF、指数、新闻、功能..."
                        />
                    </div>
                    <div className="topbar-markets">
                        {Object.values(indices).map((index) => (
                            <article key={index.symbol} className="topbar-index">
                                <span>{index.name}</span>
                                <strong className="tabular-nums">{index.price ? index.price.toFixed(2) : '--'}</strong>
                                <em className={getTrendClass(index.changePercent)}>
                                    {formatPercent(index.changePercent)}
                                </em>
                            </article>
                        ))}
                    </div>
                    <button
                        type="button"
                        className={`data-mode-toggle ${dataMode}`}
                        onClick={toggleMockData}
                        title="点击切换 mock/real 数据"
                    >
                        {dataMode === 'mock' ? 'Mock' : 'Real'}
                    </button>
                </header>

                <section ref={shellRef} className="terminal-shell" style={shellStyle}>
                    {/* Left Panel - Watchlist */}
                    <PortfolioSidebar
                        selectedStockDentryId={selectedStock?.dentryId ?? defaultStock.dentryId}
                        selectedStockSymbol={activeSymbol}
                        quoteApiSuffix={quoteApiSuffix}
                        onSelectStock={handleSelectStockNode}
                    />

                    {/* Left Splitter */}
                    <div
                        role="separator"
                        tabIndex={0}
                        aria-label="调整左侧列宽"
                        aria-valuenow={50}
                        aria-orientation="vertical"
                        className="panel-splitter"
                        onDoubleClick={resetPanelWidths}
                        onPointerDown={(e) => handleResizeStart('left', e)}
                    />

                    {/* Center Panel - Chart */}
                    <section className="chart-panel">
                        <header className="chart-header">
                            <div className="symbol-stack">
                                <div className="symbol-line">
                                    <strong>{activeDisplaySymbol}</strong>
                                    <span className="after-hours">
                                        {activeDescription} · {activeMarketLabel}
                                    </span>
                                </div>
                                <div className="quote-line">
                                    <span className={`quote-price tabular-nums ${chartChangeTone}`}>
                                        {formatNullablePrice(stockInfo.close)}
                                    </span>
                                    <span className={`quote-change tabular-nums ${chartChangeTone}`}>
                                        {chartSnapshot.changePercent != null &&
                                            stockInfo.close != null &&
                                            `${chartSnapshot.changePercent >= 0 ? '+' : ''}${((stockInfo.close * chartSnapshot.changePercent) / 100).toFixed(2)} `}
                                        ({formatPercent(chartSnapshot.changePercent)})
                                    </span>
                                    <span className="chart-subline">
                                        最后 {formatNullablePrice(stockInfo.close)} · {clock || '同步中'}
                                    </span>
                                </div>
                                <div className="ohlc-line">
                                    <span>
                                        开 <b>{formatNullablePrice(stockInfo.open)}</b>
                                    </span>
                                    <span>
                                        高 <b>{formatNullablePrice(stockInfo.high)}</b>
                                    </span>
                                    <span>
                                        低 <b>{formatNullablePrice(stockInfo.low)}</b>
                                    </span>
                                    <span>
                                        收 <b>{formatNullablePrice(stockInfo.close)}</b>
                                    </span>
                                </div>
                            </div>
                            <div className="chart-actions">
                                <button type="button" className="trade-action watched">
                                    已关注
                                </button>
                                <button type="button" className="trade-action ghost">
                                    提醒
                                </button>
                                <button type="button" className="trade-action primary">
                                    交易
                                </button>
                            </div>
                        </header>

                        {/* Chart Tabs */}
                        <div className="chart-tabs">
                            {chartTabs.map((tab) => (
                                <button
                                    type="button"
                                    key={tab.id}
                                    className={`chart-tab ${activeChartTab === tab.id ? 'active' : ''}`}
                                    onClick={() => setActiveChartTab(tab.id)}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="chart-toolbar">
                            <div className="timeframes">
                                {timeframes.map((item) => (
                                    <button
                                        key={item.label}
                                        type="button"
                                        className={`timeframe ${item.label === activeTimeframe ? 'active' : ''}`}
                                        onClick={() => setActiveTimeframe(item.label)}
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                            <div className="chart-tool-icons" role="toolbar" aria-label="图表工具">
                                <button type="button" title="指标">
                                    ƒx
                                </button>
                                <button type="button" title="画线">
                                    ⌁
                                </button>
                                <button type="button" title="设置">
                                    ⚙
                                </button>
                                <button type="button" title="全屏">
                                    □
                                </button>
                            </div>
                        </div>

                        <div className="chart-stage">
                            <div className="chart-surface">
                                <div className="price-chart">
                                    <TradingViewChart
                                        symbol={activeSymbol}
                                        resolution={activeResolution}
                                        dataApiSuffix={quoteApiSuffix}
                                        onSymbolChange={handleChartSymbolChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <footer className="chart-footer">
                            <div className="indicator-tabs">
                                {quickTools.map((tool) => (
                                    <button key={tool} type="button" className={tool === 'RSI' ? 'active' : ''}>
                                        {tool}
                                    </button>
                                ))}
                            </div>
                            <div className="chart-footnote">/api/udf · OHLCV · {activeSymbol}</div>
                        </footer>
                    </section>

                    {/* Right Splitter */}
                    <div
                        role="separator"
                        tabIndex={0}
                        aria-label="调整右侧列宽"
                        aria-valuenow={50}
                        aria-orientation="vertical"
                        className="panel-splitter"
                        onDoubleClick={resetPanelWidths}
                        onPointerDown={(e) => handleResizeStart('right', e)}
                    />

                    {/* Right Panel - Details */}
                    <aside className="detail-panel">
                        {/* Company Info Card */}
                        <section className="company-info-card panel-card">
                            <header className="company-info-header">
                                <div>
                                    <p className="panel-kicker">{activeExchange} · 证券代码</p>
                                    <h2>
                                        {activeDescription} ({activeDisplaySymbol})
                                    </h2>
                                    <span className="company-info-sub">{activeMarketLabel} · USD</span>
                                </div>
                                <span className="market-badge">USD</span>
                            </header>
                            <div className="company-info-grid">
                                <div className="company-info-item">
                                    <span className="company-info-label">最新价</span>
                                    <span className="company-info-value tabular-nums">
                                        {formatNullablePrice(stockInfo.close)}
                                    </span>
                                </div>
                                <div className="company-info-item">
                                    <span className="company-info-label">涨跌幅</span>
                                    <span className={`company-info-value tabular-nums ${chartChangeTone}`}>
                                        {formatPercent(chartSnapshot.changePercent)}
                                    </span>
                                </div>
                                <div className="company-info-item">
                                    <span className="company-info-label">开盘</span>
                                    <span className="company-info-value tabular-nums">
                                        {formatNullablePrice(stockInfo.open)}
                                    </span>
                                </div>
                                <div className="company-info-item">
                                    <span className="company-info-label">最高</span>
                                    <span className="company-info-value tabular-nums">
                                        {formatNullablePrice(stockInfo.high)}
                                    </span>
                                </div>
                                <div className="company-info-item">
                                    <span className="company-info-label">最低</span>
                                    <span className="company-info-value tabular-nums">
                                        {formatNullablePrice(stockInfo.low)}
                                    </span>
                                </div>
                                <div className="company-info-item">
                                    <span className="company-info-label">成交量</span>
                                    <span className="company-info-value tabular-nums">
                                        {formatLargeNumber(stockInfo.volume)}
                                    </span>
                                </div>
                                <div className="company-info-item">
                                    <span className="company-info-label">市值</span>
                                    <span className="company-info-value tabular-nums">
                                        {formatLargeNumber(stockInfo.marketCap)}
                                    </span>
                                </div>
                                <div className="company-info-item">
                                    <span className="company-info-label">市盈率</span>
                                    <span className="company-info-value tabular-nums">
                                        {formatStatValue(stockInfo.pe)}
                                    </span>
                                </div>
                            </div>
                            <div className="company-tags">
                                <span>互联网服务</span>
                                <span>大盘股</span>
                                <span>科技</span>
                                <span>FAANG</span>
                                <span>纳斯达克100</span>
                            </div>
                            <div className="company-info-section compact">
                                <span className="company-info-value">
                                    Alphabet
                                    公司在美国、欧洲、中东、非洲、亚太地区、加拿大和拉丁美洲提供搜索、广告、云计算、软件、硬件和人工智能服务。
                                </span>
                            </div>
                        </section>

                        {/* Fundamentals Card */}
                        <section className="company-info-card panel-card">
                            <header className="company-info-header">
                                <p className="panel-kicker">基本面</p>
                            </header>
                            <div className="company-info-grid">
                                <div className="company-info-item">
                                    <span className="company-info-label">每股收益</span>
                                    <span className="company-info-value tabular-nums">
                                        {formatStatValue(stockInfo.eps)}
                                    </span>
                                </div>
                                <div className="company-info-item">
                                    <span className="company-info-label">市净率</span>
                                    <span className="company-info-value tabular-nums">
                                        {formatStatValue(stockInfo.pb)}
                                    </span>
                                </div>
                                <div className="company-info-item">
                                    <span className="company-info-label">市销率</span>
                                    <span className="company-info-value tabular-nums">
                                        {formatStatValue(stockInfo.ps)}
                                    </span>
                                </div>
                                <div className="company-info-item">
                                    <span className="company-info-label">股息率</span>
                                    <span className="company-info-value tabular-nums">
                                        {formatPercent(stockInfo.dividendYield)}
                                    </span>
                                </div>
                                <div className="company-info-item">
                                    <span className="company-info-label">净资产收益率</span>
                                    <span className="company-info-value tabular-nums">
                                        {formatPercent(stockInfo.roe)}
                                    </span>
                                </div>
                                <div className="company-info-item">
                                    <span className="company-info-label">资产负债率</span>
                                    <span className="company-info-value tabular-nums">
                                        {formatPercent(stockInfo.debtEquity)}
                                    </span>
                                </div>
                                <div className="company-info-item">
                                    <span className="company-info-label">52周最高</span>
                                    <span className="company-info-value tabular-nums">
                                        {formatNullablePrice(stockInfo.fiftyTwoWeekHigh)}
                                    </span>
                                </div>
                                <div className="company-info-item">
                                    <span className="company-info-label">52周最低</span>
                                    <span className="company-info-value tabular-nums">
                                        {formatNullablePrice(stockInfo.fiftyTwoWeekLow)}
                                    </span>
                                </div>
                            </div>
                        </section>

                        {/* Fund Flow Card */}
                        <section className="company-info-card panel-card">
                            <header className="company-info-header">
                                <p className="panel-kicker">实时资金流向</p>
                            </header>
                            <div className="fund-flow-container">
                                <div className="fund-flow-donut">
                                    <svg
                                        viewBox="0 0 100 100"
                                        className="donut-chart"
                                        role="img"
                                        aria-label="资金流向图"
                                    >
                                        <circle
                                            cx="50"
                                            cy="50"
                                            r="40"
                                            fill="none"
                                            stroke="rgba(255,255,255,0.05)"
                                            strokeWidth="12"
                                        />
                                        <circle
                                            cx="50"
                                            cy="50"
                                            r="40"
                                            fill="none"
                                            stroke="#22c55e"
                                            strokeWidth="12"
                                            strokeDasharray={`${40 * Math.PI * 2 * 0.35} ${40 * Math.PI * 2}`}
                                            strokeDashoffset={40 * Math.PI * 2 * 0.15}
                                            transform="rotate(-90 50 50)"
                                        />
                                        <circle
                                            cx="50"
                                            cy="50"
                                            r="40"
                                            fill="none"
                                            stroke="#ef4444"
                                            strokeWidth="12"
                                            strokeDasharray={`${40 * Math.PI * 2 * 0.3} ${40 * Math.PI * 2}`}
                                            strokeDashoffset={40 * Math.PI * 2 * 0.15 - 40 * Math.PI * 2 * 0.35}
                                            transform="rotate(-90 50 50)"
                                        />
                                        <circle
                                            cx="50"
                                            cy="50"
                                            r="40"
                                            fill="none"
                                            stroke="#4ade80"
                                            strokeWidth="12"
                                            strokeDasharray={`${40 * Math.PI * 2 * 0.2} ${40 * Math.PI * 2}`}
                                            strokeDashoffset={
                                                40 * Math.PI * 2 * 0.15 -
                                                40 * Math.PI * 2 * 0.35 -
                                                40 * Math.PI * 2 * 0.3
                                            }
                                            transform="rotate(-90 50 50)"
                                        />
                                    </svg>
                                    <div className="donut-center">
                                        <span className="donut-value down">-2.31亿</span>
                                        <span className="donut-label">净流入</span>
                                    </div>
                                </div>
                                <div className="fund-flow-legend">
                                    <div className="legend-item">
                                        <span className="legend-color" style={{ background: '#22c55e' }}></span>
                                        <span className="legend-text">大单流入</span>
                                        <span className="legend-value">3.54亿</span>
                                    </div>
                                    <div className="legend-item">
                                        <span className="legend-color" style={{ background: '#ef4444' }}></span>
                                        <span className="legend-text">大单流出</span>
                                        <span className="legend-value">5.85亿</span>
                                    </div>
                                    <div className="legend-item">
                                        <span className="legend-color" style={{ background: '#4ade80' }}></span>
                                        <span className="legend-text">中单流入</span>
                                        <span className="legend-value">2.14亿</span>
                                    </div>
                                    <div className="legend-item">
                                        <span className="legend-color" style={{ background: '#fca5a5' }}></span>
                                        <span className="legend-text">中单流出</span>
                                        <span className="legend-value">1.42亿</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Rating Card */}
                        <section className="company-info-card panel-card">
                            <header className="company-info-header">
                                <p className="panel-kicker">机构评级</p>
                                <span
                                    className="market-badge"
                                    style={{
                                        background: 'rgba(34, 197, 94, 0.15)',
                                        color: '#4ade80',
                                    }}
                                >
                                    强力买入
                                </span>
                            </header>
                            <div className="rating-bars">
                                <div className="rating-bar-item">
                                    <span className="rating-label">买入</span>
                                    <div className="rating-bar-container">
                                        <div
                                            className="rating-bar"
                                            style={{ width: '65%', background: '#22c55e' }}
                                        ></div>
                                    </div>
                                    <span className="rating-count">32</span>
                                </div>
                                <div className="rating-bar-item">
                                    <span className="rating-label">增持</span>
                                    <div className="rating-bar-container">
                                        <div
                                            className="rating-bar"
                                            style={{ width: '22%', background: '#4ade80' }}
                                        ></div>
                                    </div>
                                    <span className="rating-count">11</span>
                                </div>
                                <div className="rating-bar-item">
                                    <span className="rating-label">中性</span>
                                    <div className="rating-bar-container">
                                        <div
                                            className="rating-bar"
                                            style={{ width: '10%', background: '#fbbf24' }}
                                        ></div>
                                    </div>
                                    <span className="rating-count">5</span>
                                </div>
                                <div className="rating-bar-item">
                                    <span className="rating-label">减持</span>
                                    <div className="rating-bar-container">
                                        <div
                                            className="rating-bar"
                                            style={{ width: '3%', background: '#f97316' }}
                                        ></div>
                                    </div>
                                    <span className="rating-count">2</span>
                                </div>
                            </div>
                            <div className="target-price-section">
                                <span className="target-price-label">目标价中位数</span>
                                <span className="target-price-value">382.50 USD</span>
                                <span className="target-price-change up">+9.60%</span>
                            </div>
                        </section>

                        {/* Business Overview */}
                        <section className="company-info-card panel-card">
                            <header className="company-info-header">
                                <p className="panel-kicker">公司简介</p>
                            </header>
                            <div className="company-info-section">
                                <span className="company-info-value" style={{ display: '-webkit-box' }}>
                                    Alphabet
                                    Inc.是一家跨国科技公司，专注于搜索引擎、云计算、软件、硬件和人工智能等领域。公司通过Google
                                    Search、YouTube、Google Cloud、Waymo等业务部门运营。
                                </span>
                            </div>
                        </section>
                    </aside>
                </section>

                {/* Footer */}
                <footer className="terminal-footer">
                    <div className="portfolio-summary">
                        <div className="portfolio-item">
                            <span className="portfolio-label">总市值</span>
                            <span className="portfolio-value">{formatLargeNumber(portfolioValue.total)}</span>
                        </div>
                        <div className="portfolio-item">
                            <span className="portfolio-label">今日收益</span>
                            <span className={`portfolio-value ${getTrendClass(portfolioValue.changePercent)}`}>
                                {portfolioValue.change >= 0 ? '+' : ''}
                                {formatLargeNumber(portfolioValue.change)}
                                <span style={{ marginLeft: '6px' }}>
                                    ({formatPercent(portfolioValue.changePercent)})
                                </span>
                            </span>
                        </div>
                    </div>
                    <div className="footer-indexes">
                        {Object.values(indices).map((index) => (
                            <article key={index.symbol} className="footer-index">
                                <span>{index.name}</span>
                                <strong className="tabular-nums">{index.price ? index.price.toFixed(2) : '--'}</strong>
                                <em className={getTrendClass(index.changePercent)}>
                                    {index.change >= 0 ? '+' : ''}
                                    {index.change ? index.change.toFixed(2) : '0.00'} (
                                    {formatPercent(index.changePercent)})
                                </em>
                            </article>
                        ))}
                    </div>
                    <div className="system-clock">{clock}</div>
                </footer>
            </section>
        </main>
    )
}
