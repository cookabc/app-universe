'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import ContextMenu from './ContextMenu'

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

interface QuoteData {
    latestPrice: number | null
    changePercent: number | null
    trend: 'up' | 'down'
}

interface ContextMenuState {
    visible: boolean
    x: number
    y: number
    node: TreeNode | null
    targetType: 'folder' | 'stock' | null
}

interface PortfolioSidebarProps {
    selectedStockDentryId?: number | null
    selectedStockSymbol?: string | null
    quoteApiSuffix?: string
    onSelectStock: (node: TreeNode) => void
}

const quotePollingIntervalMs = 5000

const categories = [
    { id: 'my', name: '我的组合' },
    { id: 'mag7', name: 'MAG7' },
    { id: 'etf', name: 'ETF' },
    { id: 'ai', name: 'AI 应用' },
    { id: 'data', name: '数据中心' },
    { id: 'l2', name: 'L2 策略' },
]

const symbolGlyphs = ['G', '✦', '⌁', '◆', '▣', '◩', '△', '◇']

function formatPrice(value: number | null): string {
    return value != null && Number.isFinite(value) ? value.toFixed(3) : '--'
}

function formatPercent(value: number | null): string {
    if (value == null || !Number.isFinite(value)) return '--'
    const sign = value > 0 ? '+' : ''
    return `${sign}${value.toFixed(2)}%`
}

function toneOf(value: number | null): 'up' | 'down' {
    return value != null && Number.isFinite(value) && value < 0 ? 'down' : 'up'
}

function displayTicker(node: TreeNode): string {
    const ticker = node.ticker || node.symbol || '--'
    if (ticker === 'GOOGL') return 'GOOG.US'
    if (ticker.includes('-')) return ticker
    if (ticker.includes('.')) return ticker
    return `${ticker}.US`
}

function glyphForSymbol(symbol: string | undefined): string {
    if (!symbol) return '•'
    if (symbol === 'GOOGL') return 'G'
    const seed = Array.from(symbol).reduce((sum, char) => sum + char.charCodeAt(0), 0)
    return symbolGlyphs[seed % symbolGlyphs.length]
}

function flattenStocks(nodes: TreeNode[]): TreeNode[] {
    const result: TreeNode[] = []
    for (const node of nodes) {
        if (node.type === 'stock' && node.symbol) {
            result.push(node)
        }
        if (node.children?.length) {
            result.push(...flattenStocks(node.children))
        }
    }
    return result
}

export default function PortfolioSidebar({
    selectedStockDentryId,
    selectedStockSymbol,
    quoteApiSuffix = '',
    onSelectStock,
}: PortfolioSidebarProps) {
    const [activeTab, setActiveTab] = useState<'watchlist' | 'monitor'>('watchlist')
    const [activeCategory, setActiveCategory] = useState<string>('my')
    const [treeState, setTreeState] = useState<{
        status: 'loading' | 'ready' | 'error'
        roots: TreeNode[]
        error: string
    }>({
        status: 'loading',
        roots: [],
        error: '',
    })

    const [quoteSnapshots, setQuoteSnapshots] = useState<Record<string, QuoteData>>({})
    const [contextMenu, setContextMenu] = useState<ContextMenuState>({
        visible: false,
        x: 0,
        y: 0,
        node: null,
        targetType: null,
    })

    const loadTree = useCallback(async () => {
        setTreeState((current) => ({
            ...current,
            status: current.status === 'ready' ? 'ready' : 'loading',
            error: '',
        }))
        try {
            const response = await fetch('/api/portfolio/tree')
            if (!response.ok) {
                throw new Error(`Request failed: ${response.status}`)
            }
            const roots = await response.json()
            setTreeState({
                status: 'ready',
                roots: Array.isArray(roots) ? roots : [],
                error: '',
            })
        } catch (error) {
            console.error('[PortfolioSidebar] load tree failed', error)
            setTreeState({
                status: 'error',
                roots: [],
                error: (error as Error).message || '加载自选树失败。',
            })
        }
    }, [])

    useEffect(() => {
        loadTree()
    }, [loadTree])

    // Get all stock symbols for quote polling
    const allStocks = useMemo(() => flattenStocks(treeState.roots), [treeState.roots])
    const allSymbols = useMemo(() => allStocks.map((s) => s.symbol).filter(Boolean) as string[], [allStocks])
    const allSymbolsKey = allSymbols.join(',')

    // Quote polling for all stocks
    useEffect(() => {
        if (!allSymbolsKey) return undefined
        let cancelled = false

        async function loadQuotes() {
            try {
                const response = await fetch(
                    `/api/quote?symbols=${encodeURIComponent(allSymbolsKey)}${
                        quoteApiSuffix ? `&${quoteApiSuffix}` : ''
                    }`,
                )
                if (!response.ok) {
                    throw new Error(`Request failed: ${response.status}`)
                }
                const quoteData = await response.json()

                if (cancelled) return
                const entries = Object.entries(quoteData).map(([symbol, data]: [string, any]) => {
                    const latestPrice = data?.latestPrice ?? null
                    const changePercent = data?.changePercent ?? null
                    return [
                        symbol,
                        {
                            latestPrice: Number.isFinite(latestPrice) ? latestPrice : null,
                            changePercent: Number.isFinite(changePercent) ? changePercent : null,
                            trend: toneOf(changePercent),
                        } as QuoteData,
                    ]
                })
                setQuoteSnapshots((current) => ({
                    ...current,
                    ...Object.fromEntries(entries),
                }))
            } catch (error) {
                console.error('Failed to load quotes', error)
            }
        }

        loadQuotes()
        const timerId = window.setInterval(loadQuotes, quotePollingIntervalMs)
        return () => {
            cancelled = true
            window.clearInterval(timerId)
        }
    }, [allSymbolsKey, quoteApiSuffix])

    // Context menu handler
    function handleContextMenu(node: TreeNode, e: React.MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        setContextMenu({
            visible: true,
            x: e.clientX,
            y: e.clientY,
            node: node,
            targetType: node.type === 'folder' ? 'folder' : node.type === 'stock' ? 'stock' : null,
        })
    }

    function handleCloseContextMenu() {
        setContextMenu({
            visible: false,
            x: 0,
            y: 0,
            node: null,
            targetType: null,
        })
    }

    function handleAddFolder() {
        console.log('Add folder to', contextMenu.node?.name || 'root')
        handleCloseContextMenu()
    }

    function handleAddStock() {
        console.log('Add stock to', contextMenu.node?.name || 'root')
        handleCloseContextMenu()
    }

    function handleRename() {
        console.log('Rename', contextMenu.node?.name)
        handleCloseContextMenu()
    }

    function handleDelete() {
        console.log('Delete', contextMenu.node?.name)
        handleCloseContextMenu()
    }

    const totalStockCount = allStocks.length

    return (
        <aside className="watchlist-panel">
            <div className="watchlist-table">
                {/* 标签页 */}
                <div className="sidebar-tabs">
                    <button
                        className={`sidebar-tab ${activeTab === 'watchlist' ? 'active' : ''}`}
                        onClick={() => setActiveTab('watchlist')}
                    >
                        自选
                    </button>
                    <button
                        className={`sidebar-tab ${activeTab === 'monitor' ? 'active' : ''}`}
                        onClick={() => setActiveTab('monitor')}
                    >
                        监控
                    </button>
                </div>

                <div className="watchlist-create-row">
                    <button type="button" className="create-group-button">
                        + 新建分组
                    </button>
                    <button type="button" className="icon-button" title="搜索自选">
                        ⌕
                    </button>
                    <button type="button" className="icon-button" title="同步">
                        ↻
                    </button>
                </div>

                {/* 分组快捷入口 */}
                <div className="sidebar-categories" aria-label="自选分组">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            className={`category-item ${activeCategory === category.id ? 'active' : ''}`}
                            onClick={() => setActiveCategory(category.id)}
                            title={category.name}
                        >
                            <span className="category-caret">⌄</span>
                            <span className="category-name">{category.name}</span>
                        </button>
                    ))}
                </div>

                {/* Header */}
                <div className="panel-title-row">
                    <div>
                        <h1>自选树</h1>
                    </div>
                    <div className="panel-title-actions">
                        <button type="button" className="tiny-action ghost" onClick={() => loadTree()} title="刷新">
                            ↻
                        </button>
                    </div>
                </div>

                {/* Column Headers */}
                <div className="watchlist-head">
                    <span>名称</span>
                    <span>价格</span>
                    <span>涨跌幅</span>
                </div>

                {/* Rows */}
                <div className="watchlist-rows">
                    {treeState.status === 'loading' ? (
                        <div className="p-4 text-center" style={{ color: 'var(--text-dim)' }}>
                            加载中...
                        </div>
                    ) : treeState.status === 'error' ? (
                        <div className="p-4 text-center" style={{ color: 'var(--text-dim)' }}>
                            <strong
                                style={{
                                    color: 'var(--text-main)',
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                }}
                            >
                                加载失败
                            </strong>
                            <span>{treeState.error}</span>
                            <button type="button" className="tiny-action ghost mt-2" onClick={() => loadTree()}>
                                重试
                            </button>
                        </div>
                    ) : treeState.roots.length === 0 ? (
                        <div className="p-4 text-center" style={{ color: 'var(--text-dim)' }}>
                            <strong
                                style={{
                                    color: 'var(--text-main)',
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                }}
                            >
                                还没有任何节点
                            </strong>
                            <span>请添加股票或文件夹。</span>
                        </div>
                    ) : (
                        <WatchlistRows
                            nodes={treeState.roots}
                            selectedDentryId={selectedStockDentryId}
                            selectedSymbol={selectedStockSymbol}
                            onSelectStock={onSelectStock}
                            quoteSnapshots={quoteSnapshots}
                            onContextMenu={handleContextMenu}
                        />
                    )}
                </div>

                {/* Footnote */}
                <p className="watchlist-footnote">股票总数 {totalStockCount}</p>
            </div>

            {contextMenu.visible && (
                <ContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    nodeType={contextMenu.targetType}
                    onAddFolder={handleAddFolder}
                    onAddStock={handleAddStock}
                    onRename={handleRename}
                    onDelete={handleDelete}
                    onClose={handleCloseContextMenu}
                />
            )}
        </aside>
    )
}

function WatchlistRows({
    nodes,
    selectedDentryId,
    selectedSymbol,
    onSelectStock,
    quoteSnapshots,
    onContextMenu,
    depth = 0,
}: {
    nodes: TreeNode[]
    selectedDentryId?: number | null
    selectedSymbol?: string | null
    onSelectStock: (node: TreeNode) => void
    quoteSnapshots: Record<string, QuoteData>
    onContextMenu: (node: TreeNode, e: React.MouseEvent) => void
    depth?: number
}) {
    const [expanded, setExpanded] = useState<Set<number>>(new Set())

    // Auto-expand first level folders
    useEffect(() => {
        if (depth === 0) {
            const firstFolders = nodes.filter((n) => n.type === 'folder')
            if (firstFolders.length > 0 && expanded.size === 0) {
                setExpanded(new Set(firstFolders.map((n) => n.dentryId)))
            }
        }
    }, [nodes, depth, expanded.size])

    function toggleExpand(dentryId: number, e: React.MouseEvent) {
        e.stopPropagation()
        setExpanded((current) => {
            const next = new Set(current)
            if (next.has(dentryId)) next.delete(dentryId)
            else next.add(dentryId)
            return next
        })
    }

    // Sort: folders first, then stocks
    const sortedNodes = useMemo(() => {
        return [...nodes].sort((a, b) => {
            const aFolder = a.type === 'folder' ? 0 : 1
            const bFolder = b.type === 'folder' ? 0 : 1
            if (aFolder !== bFolder) return aFolder - bFolder
            return 0
        })
    }, [nodes])

    return (
        <>
            {sortedNodes.map((node) => {
                const isFolder = node.type === 'folder'
                const isStock = node.type === 'stock'
                const isExpanded = expanded.has(node.dentryId)
                const isSelected =
                    selectedDentryId === node.dentryId ||
                    (!!selectedSymbol && isStock && node.symbol === selectedSymbol)
                const quote = isStock && node.symbol ? quoteSnapshots[node.symbol] : null
                const hasChildren = (node.children?.length ?? 0) > 0

                if (isFolder && hasChildren) {
                    return (
                        <div key={node.dentryId}>
                            {/* Folder Header Row */}
                            <div
                                className="watchlist-row folder-row"
                                style={{
                                    paddingLeft: `${14 + depth * 12}px`,
                                    cursor: 'pointer',
                                }}
                                onClick={(e) => toggleExpand(node.dentryId, e)}
                                onContextMenu={(e) => onContextMenu(node, e)}
                            >
                                <div
                                    className="watchlist-name"
                                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                                >
                                    <span style={{ fontSize: '10px', color: 'var(--text-dim)' }}>
                                        {isExpanded ? '▾' : '▸'}
                                    </span>
                                    <strong>{node.name}</strong>
                                </div>
                                <span></span>
                                <span></span>
                            </div>

                            {/* Folder Children */}
                            {isExpanded && (
                                <WatchlistRows
                                    nodes={node.children || []}
                                    selectedDentryId={selectedDentryId}
                                    selectedSymbol={selectedSymbol}
                                    onSelectStock={onSelectStock}
                                    quoteSnapshots={quoteSnapshots}
                                    onContextMenu={onContextMenu}
                                    depth={depth + 1}
                                />
                            )}
                        </div>
                    )
                }

                // Stock row
                return (
                    <div
                        key={node.dentryId}
                        className={`watchlist-row ${isSelected ? 'active' : ''}`}
                        style={{
                            paddingLeft: `${14 + depth * 12}px`,
                        }}
                        onClick={() => isStock && onSelectStock(node)}
                        onContextMenu={(e) => onContextMenu(node, e)}
                        data-portfolio-symbol={node.symbol}
                    >
                        <span className="watchlist-symbol-icon">{glyphForSymbol(node.symbol)}</span>
                        <div className="watchlist-name">
                            <strong>{displayTicker(node)}</strong>
                            <span>{node.name || node.description || ''}</span>
                        </div>
                        <span className="watchlist-spark" aria-hidden="true" />
                        <span className="watchlist-quote-stack">
                            <span className="watchlist-price">{quote ? formatPrice(quote.latestPrice) : '--'}</span>
                            <span className={`watchlist-change ${quote ? toneOf(quote.changePercent) : ''}`}>
                                {quote ? formatPercent(quote.changePercent) : '--'}
                            </span>
                        </span>
                    </div>
                )
            })}
        </>
    )
}
