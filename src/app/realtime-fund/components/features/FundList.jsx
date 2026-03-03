import { AnimatePresence, motion } from 'framer-motion'
import { ChevronIcon, ExitIcon, SettingsIcon, StarIcon, TrashIcon } from '../icons'
import { Sparkline, Stat } from '../ui'
import HoldingsContribution from './HoldingsContribution'
import { TrendingUp, TrendingDown, Clock, BarChart2 } from 'lucide-react'

export default function FundList({
    viewMode,
    funds,
    currentTab,
    favorites,
    onToggleFavorite,
    onRemoveFromGroup,
    onRemoveFund,
    todayStr,
    isTradingDay,
    navHistory,
    holdings,
    getHoldingProfit,
    onOpenHoldingModal,
    onOpenActionModal,
    percentModes,
    onTogglePercentMode,
    collapsedCodes,
    onToggleCollapse,
}) {
    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={viewMode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={viewMode === 'card' ? 'fund-card-grid' : 'rounded-xl border border-border bg-card overflow-hidden shadow-sm'}
            >
                {viewMode === 'list' && (
                    <div className="grid grid-cols-12 gap-4 p-4 border-b border-border bg-muted/30 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        <div className="col-span-4">Fund Name / Code</div>
                        <div className="col-span-2 text-right">Net Worth</div>
                        <div className="col-span-2 text-right">Change</div>
                        <div className="col-span-3 text-right">Update Time</div>
                        <div className="col-span-1 text-center">Actions</div>
                    </div>
                )}

                <AnimatePresence mode="popLayout">
                    {funds.map((f) => (
                        <motion.div
                            layout="position"
                            key={f.code}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className={viewMode === 'list' ? 'border-b border-border/50 last:border-0 hover:bg-muted/10 transition-colors' : ''}
                        >
                            <div className={viewMode === 'card' ? 'rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-all h-full flex flex-col' : 'grid grid-cols-12 gap-4 p-4 items-center'}>
                                {viewMode === 'list' ? (
                                    <>
                                        {/* List View Row */}
                                        <div className="col-span-4 flex items-center gap-3">
                                            <button
                                                className={`p-1.5 rounded-full hover:bg-muted transition-colors ${favorites.has(f.code) ? 'text-yellow-500' : 'text-muted-foreground'}`}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    onToggleFavorite(f.code)
                                                }}
                                            >
                                                <StarIcon width="16" height="16" filled={favorites.has(f.code)} />
                                            </button>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-foreground text-sm truncate max-w-[200px]">{f.name}</span>
                                                <span className="text-xs font-mono text-muted-foreground">#{f.code}</span>
                                            </div>
                                        </div>

                                        {(() => {
                                            const now = new Date()
                                            const isAfter9 = now.getHours() >= 9
                                            const hasTodayData = f.jzrq === todayStr
                                            const shouldHideChange = isTradingDay && isAfter9 && !hasTodayData

                                            // Logic for displaying values
                                            const displayNav = shouldHideChange
                                                ? (f.estPricedCoverage > 0.05 ? f.estGsz.toFixed(4) : (f.gsz ?? '—'))
                                                : (f.dwjz ?? '—')

                                            const changeValue = shouldHideChange
                                                ? (f.estPricedCoverage > 0.05 ? f.estGszzl : Number(f.gszzl))
                                                : (f.zzl ?? Number(f.gszzl) ?? 0)

                                            const validChangeValue = typeof changeValue === 'number' && !isNaN(changeValue) ? changeValue : null
                                            const changePercent = validChangeValue !== null
                                                ? `${validChangeValue > 0 ? '+' : ''}${validChangeValue.toFixed(2)}%`
                                                : '--'

                                            const isUp = validChangeValue !== null && validChangeValue > 0
                                            const isDown = validChangeValue !== null && validChangeValue < 0

                                            return (
                                                <>
                                                    <div className="col-span-2 text-right font-mono font-medium">
                                                        {displayNav}
                                                    </div>
                                                    <div className="col-span-2 text-right">
                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${isUp ? 'bg-red-500/10 text-red-500' : isDown ? 'bg-green-500/10 text-green-500' : 'bg-muted text-muted-foreground'}`}>
                                                            {changePercent}
                                                        </span>
                                                    </div>
                                                </>
                                            )
                                        })()}

                                        <div className="col-span-3 text-right text-xs text-muted-foreground font-mono">
                                            {f.gztime || f.time || '-'}
                                        </div>

                                        <div className="col-span-1 flex justify-center">
                                            <button
                                                className="p-1.5 rounded-full hover:bg-red-500/10 hover:text-red-500 text-muted-foreground transition-colors"
                                                onClick={() => onRemoveFund(f.code)}
                                            >
                                                <TrashIcon width="14" height="14" />
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {/* Card View Content */}
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                <div className="flex flex-col min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-bold text-lg truncate" title={f.name}>{f.name}</h3>
                                                        {f.jzrq === todayStr && (
                                                            <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" title="Updated today" />
                                                        )}
                                                    </div>
                                                    <span className="text-xs font-mono text-muted-foreground">#{f.code}</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-1">
                                                <button
                                                    className={`p-2 rounded-full hover:bg-muted transition-colors ${favorites.has(f.code) ? 'text-yellow-500' : 'text-muted-foreground'}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        onToggleFavorite(f.code)
                                                    }}
                                                >
                                                    <StarIcon width="18" height="18" filled={favorites.has(f.code)} />
                                                </button>
                                                <button
                                                    className="p-2 rounded-full hover:bg-red-500/10 hover:text-red-500 text-muted-foreground transition-colors"
                                                    onClick={() => onRemoveFund(f.code)}
                                                >
                                                    <TrashIcon width="18" height="18" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            {(() => {
                                                const now = new Date()
                                                const isAfter9 = now.getHours() >= 9
                                                const hasTodayData = f.jzrq === todayStr
                                                const shouldHideChange = isTradingDay && isAfter9 && !hasTodayData

                                                const displayNav = shouldHideChange
                                                    ? (f.estPricedCoverage > 0.05 ? f.estGsz.toFixed(4) : (f.gsz ?? '—'))
                                                    : (f.dwjz ?? '—')

                                                const changeValue = shouldHideChange
                                                    ? (f.estPricedCoverage > 0.05 ? f.estGszzl : Number(f.gszzl))
                                                    : (f.zzl ?? Number(f.gszzl) ?? 0)

                                                const validChangeValue = typeof changeValue === 'number' && !isNaN(changeValue) ? changeValue : null
                                                const isUp = validChangeValue !== null && validChangeValue > 0
                                                const isDown = validChangeValue !== null && validChangeValue < 0

                                                return (
                                                    <>
                                                        <div className="flex flex-col">
                                                            <span className="text-xs text-muted-foreground mb-1">Net Worth</span>
                                                            <span className="text-2xl font-bold font-mono tracking-tight">{displayNav}</span>
                                                        </div>
                                                        <div className="flex flex-col items-end">
                                                            <span className="text-xs text-muted-foreground mb-1">Growth</span>
                                                            <div className={`flex items-center gap-1 font-bold text-lg ${isUp ? 'text-red-500' : isDown ? 'text-green-500' : 'text-muted-foreground'}`}>
                                                                {isUp ? <TrendingUp className="w-4 h-4" /> : isDown ? <TrendingDown className="w-4 h-4" /> : null}
                                                                {validChangeValue !== null ? `${Math.abs(validChangeValue).toFixed(2)}%` : '--'}
                                                            </div>
                                                        </div>
                                                    </>
                                                )
                                            })()}
                                        </div>

                                        {/* Sparkline & Holdings Section */}
                                        <div className="mt-auto pt-4 border-t border-border/50">
                                            {navHistory[f.code] && (
                                                <div className="mb-4">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                            <ActivityIcon className="w-3 h-3" /> 30-Day Trend
                                                        </span>
                                                    </div>
                                                    <Sparkline data={navHistory[f.code]} width={200} height={32} color="var(--primary)" />
                                                </div>
                                            )}

                                            <button
                                                onClick={() => onToggleCollapse(f.code)}
                                                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors group"
                                            >
                                                <span className="text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors">
                                                    Top Holdings
                                                </span>
                                                <ChevronIcon
                                                    width="14"
                                                    height="14"
                                                    className={`text-muted-foreground transition-transform duration-200 ${collapsedCodes.has(f.code) ? '-rotate-90' : ''}`}
                                                />
                                            </button>

                                            <AnimatePresence>
                                                {!collapsedCodes.has(f.code) && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="pt-2 space-y-2">
                                                            {Array.isArray(f.holdings) && f.holdings.slice(0, 5).map((h, idx) => (
                                                                <div key={idx} className="flex justify-between text-xs">
                                                                    <span className="text-foreground/80 truncate max-w-[120px]">{h.name}</span>
                                                                    <div className="flex gap-3 font-mono">
                                                                        <span className={h.change > 0 ? 'text-red-500' : 'text-green-500'}>
                                                                            {h.change > 0 ? '+' : ''}{h.change?.toFixed(2)}%
                                                                        </span>
                                                                        <span className="text-muted-foreground">{h.weight}</span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
        </AnimatePresence>
    )
}

function ActivityIcon({ className }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
    )
}
