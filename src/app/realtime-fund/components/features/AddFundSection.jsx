import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { CloseIcon, PlusIcon } from '../icons'

export default function AddFundSection({
    onAddFund,
    selectedFunds,
    onToggleSelectFund,
    searchTerm,
    onSearchInput,
    isSearching,
    showDropdown,
    setShowDropdown,
    searchResults,
    loading,
    error,
    existingFunds,
}) {
    const dropdownRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [setShowDropdown])

    return (
        <div className="glass card add-fund-section" role="region" aria-label="添加基金">
            <div className="title" style={{ marginBottom: 12 }}>
                <PlusIcon width="20" height="20" />
                <span>添加基金</span>
                <span className="muted">搜索并选择基金（支持名称或代码）</span>
            </div>

            <div className="search-container" ref={dropdownRef}>
                <form className="form" onSubmit={onAddFund}>
                    <div
                        className="search-input-wrapper"
                        style={{ flex: 1, gap: 8, alignItems: 'center', flexWrap: 'wrap' }}
                    >
                        {selectedFunds.length > 0 && (
                            <div className="selected-inline-chips">
                                {selectedFunds.map((fund) => (
                                    <div key={fund.code} className="fund-chip">
                                        <span>{fund.name}</span>
                                        <button
                                            type="button"
                                            onClick={() => onToggleSelectFund(fund)}
                                            className="remove-chip"
                                        >
                                            <CloseIcon width="14" height="14" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <input
                            className="input"
                            placeholder="搜索基金名称或代码..."
                            value={searchTerm}
                            onChange={onSearchInput}
                            onFocus={() => setShowDropdown(true)}
                        />
                        {isSearching && <div className="search-spinner" />}
                    </div>
                    <button className="button" type="submit" disabled={loading}>
                        {loading ? '添加中…' : '添加'}
                    </button>
                </form>

                <AnimatePresence>
                    {showDropdown && (searchTerm.trim() || searchResults.length > 0) && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute mt-2 left-0 right-0 max-h-[320px] overflow-y-auto z-50 p-2 bg-background rounded-xl shadow-xl border border-border"
                        >
                            {searchResults.length > 0 ? (
                                <div className="flex flex-col gap-1">
                                    {searchResults.map((fund, index) => {
                                        const isSelected = selectedFunds.some((f) => f.code === fund.code)
                                        const isAlreadyAdded = existingFunds.some((f) => f.code === fund.code)
                                        return (
                                            <div
                                                key={`${fund.code}-${index}`}
                                                className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-primary/10 border-primary/30 border' : 'hover:bg-muted'} ${isAlreadyAdded ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                onClick={() => {
                                                    if (isAlreadyAdded) return
                                                    onToggleSelectFund(fund)
                                                }}
                                            >
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-sm font-semibold text-foreground">{fund.name}</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        #{fund.code}
                                                    </span>
                                                </div>
                                                {isAlreadyAdded ? (
                                                    <span className="text-[11px] px-2 py-0.5 bg-muted rounded text-muted-foreground">已添加</span>
                                                ) : (
                                                    <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${isSelected ? 'bg-primary border-primary' : 'bg-background border-border border-2'}`}>
                                                        {isSelected && <div className="w-2.5 h-1.5 border-b-2 border-l-2 border-white -rotate-45 -translate-y-[1px]" />}
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            ) : searchTerm.trim() && !isSearching ? (
                                <div className="p-5 text-center text-sm text-muted-foreground">未找到相关基金</div>
                            ) : null}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {error && (
                <div className="mt-2 text-sm text-destructive">
                    {error}
                </div>
            )}
        </div>
    )
}
