// @ts-nocheck
'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import {
    AddFundSection,
    AddFundToGroupModal,
    AddResultModal,
    Announcement,
    ConfirmModal,
    DonateModal,
    FeedbackModal,
    FilterBar,
    FundList,
    GroupManageModal,
    GroupModal,
    GroupSummary,
    Header,
    HoldingActionModal,
    HoldingEditModal,
    HoldingsContribution,
    MarketBar,
    SettingsModal,
    SuccessModal,
    TradeModal,
} from './components/features'
import { PlusIcon } from './components/icons'
import './globals.css'

interface FundData {
    code: string
    name: string
    dwjz?: string
    gsz?: string
    gztime?: string
    jzrq?: string
    gszzl?: string | number
    estGszzl?: number
    estGsz?: number
    estPricedCoverage?: number
    zzl?: number
    holdings?: FundHolding[]
}

interface MarketIndex {
    name: string
    price: string
    change: number
}

interface Group {
    id: string
    name: string
    codes: string[]
}

interface FundGzResponse {
    fundcode: string
    name: string
    dwjz: string
    gsz: string
    gztime: string
    jzrq: string
    gszzl: string | number
}

interface TencentFundData {
    dwjz: string
    zzl: number
    jzrq: string
}

interface FundHolding {
    code: string
    name: string
    weight: string
    change: number | null
}

interface ApidataContent {
    content?: string
}

declare global {
    interface Window {
        apidata?: ApidataContent
        [key: string]: unknown
    }
}

export default function HomePage() {
    const [funds, setFunds] = useState<FundData[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
    const refreshingRef = useRef(false)

    const [refreshMs, setRefreshMs] = useState(30000)
    const [settingsOpen, setSettingsOpen] = useState(false)

    const [refreshing, setRefreshing] = useState(false)

    const [collapsedCodes, setCollapsedCodes] = useState(new Set<string>())

    const [favorites, setFavorites] = useState(new Set<string>())
    const [groups, setGroups] = useState<Group[]>([])
    const [currentTab, setCurrentTab] = useState('all')
    const [groupModalOpen, setGroupModalOpen] = useState(false)
    const [groupManageOpen, setGroupManageOpen] = useState(false)
    const [addFundToGroupOpen, setAddFundToGroupOpen] = useState(false)

    const [sortBy, setSortBy] = useState('default')

    const [viewMode, setViewMode] = useState('card')

    const [feedbackOpen, setFeedbackOpen] = useState(false)
    const [feedbackNonce, setFeedbackNonce] = useState(0)

    const [searchTerm, setSearchTerm] = useState('')
    const [searchResults, setSearchResults] = useState<FundData[]>([])
    const [selectedFunds, setSelectedFunds] = useState<FundData[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const [showDropdown, setShowDropdown] = useState(false)
    const [addResultOpen, setAddResultOpen] = useState(false)
    const [addFailures, setAddFailures] = useState<Array<{ code: string; name: string }>>([])
    const [holdingModal, setHoldingModal] = useState<{ open: boolean; fund: FundData | null }>({
        open: false,
        fund: null,
    })
    const [actionModal, setActionModal] = useState<{ open: boolean; fund: FundData | null }>({
        open: false,
        fund: null,
    })
    const [tradeModal, setTradeModal] = useState<{ open: boolean; fund: FundData | null; type: string }>({
        open: false,
        fund: null,
        type: 'buy',
    })
    const [clearConfirm, setClearConfirm] = useState<{ fund: FundData } | null>(null)
    const [donateOpen, setDonateOpen] = useState(false)
    const [holdings, setHoldings] = useState<Record<string, { share: number; cost: number }>>({})
    const [percentModes, setPercentModes] = useState<Record<string, boolean>>({})
    const [isTradingDay, setIsTradingDay] = useState(true)
    const [marketIndices, setMarketIndices] = useState<MarketIndex[]>([])
    const [navHistory, setNavHistory] = useState<Record<string, Array<{ date: string; value: number }>>>({})
    const navHistoryFetchedRef = useRef(new Set())

    const today = new Date()
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

    const checkTradingDay = () => {
        const now = new Date()
        const isWeekend = now.getDay() === 0 || now.getDay() === 6

        if (isWeekend) {
            setIsTradingDay(false)
            return
        }

        const script = document.createElement('script')
        script.src = `https://qt.gtimg.cn/q=sh000001&_t=${Date.now()}`
        script.onload = () => {
            const data = window.v_sh000001
            if (data) {
                const parts = data.split('~')
                if (parts.length > 30 && parts[30]) {
                    const dateStr = parts[30].slice(0, 8)
                    const currentStr = todayStr.replace(/-/g, '')

                    if (dateStr === currentStr) {
                        setIsTradingDay(true)
                    } else {
                        const minutes = now.getHours() * 60 + now.getMinutes()
                        if (minutes >= 9 * 60 + 30) {
                            setIsTradingDay(false)
                        } else {
                            setIsTradingDay(true)
                        }
                    }
                }
            }
            document.body.removeChild(script)
        }
        script.onerror = () => {
            document.body.removeChild(script)
            setIsTradingDay(!isWeekend)
        }
        document.body.appendChild(script)
    }

    const fetchMarketIndices = () => {
        const script = document.createElement('script')
        script.src = `https://qt.gtimg.cn/q=s_sh000001,s_sz399001,s_sz399006&_t=${Date.now()}`
        script.onload = () => {
            const indices: Array<{ name: string; price: string; change: number }> = []
            const mapping = [
                { key: 'v_s_sh000001', name: '上证' },
                { key: 'v_s_sz399001', name: '深证' },
                { key: 'v_s_sz399006', name: '创业板' },
            ]
            mapping.forEach(({ key, name }) => {
                const data = window[key as keyof Window] as string | undefined
                if (data && typeof data === 'string') {
                    const parts = data.split('~')
                    if (parts.length > 5) {
                        indices.push({ name, price: parts[3]!, change: parseFloat(parts[5]!) })
                    }
                }
            })
            if (indices.length) setMarketIndices(indices)
            if (document.body.contains(script)) document.body.removeChild(script)
        }
        script.onerror = () => {
            if (document.body.contains(script)) document.body.removeChild(script)
        }
        document.body.appendChild(script)
    }

    const fetchNavHistory = (code: string) => {
        if (navHistoryFetchedRef.current.has(code)) return
        navHistoryFetchedRef.current.add(code)
        const script = document.createElement('script')
        script.src = `https://fund.eastmoney.com/pingzhongdata/${code}.js?v=${Date.now()}`
        script.onload = () => {
            const trend = window.Data_netWorthTrend
            if (Array.isArray(trend) && trend.length > 0) {
                const last30 = trend.slice(-30)
                setNavHistory((prev) => ({ ...prev, [code]: last30 }))
            }
            window.Data_netWorthTrend = undefined
            window.Data_ACWorthTrend = undefined
            window.Data_grandTotal = undefined
            window.Data_rateInSimilarType = undefined
            window.Data_rateInSimilarPersent = undefined
            window.Data_fundSharesPositions = undefined
            if (document.body.contains(script)) document.body.removeChild(script)
        }
        script.onerror = () => {
            if (document.body.contains(script)) document.body.removeChild(script)
        }
        document.body.appendChild(script)
    }

    useEffect(() => {
        checkTradingDay()
        fetchMarketIndices()
        const timer = setInterval(checkTradingDay, 60000)
        return () => clearInterval(timer)
    }, [])

    const displayFunds = funds
        .filter((f) => {
            if (currentTab === 'all') return true
            if (currentTab === 'fav') return favorites.has(f.code)
            const group = groups.find((g) => g.id === currentTab)
            return group ? group.codes.includes(f.code) : true
        })
        .sort((a, b) => {
            if (sortBy === 'yield') {
                const valA = typeof a.estGszzl === 'number' ? a.estGszzl : Number(a.gszzl) || 0
                const valB = typeof b.estGszzl === 'number' ? b.estGszzl : Number(b.gszzl) || 0
                return valB - valA
            }
            if (sortBy === 'name') return a.name.localeCompare(b.name, 'zh-CN')
            if (sortBy === 'code') return a.code.localeCompare(b.code)
            return 0
        })

    const getHoldingProfit = (fund: FundData, holding: { share: number; cost?: number } | null) => {
        if (!holding || typeof holding.share !== 'number') return null

        const now = new Date()
        const isAfter9 = now.getHours() >= 9
        const hasTodayData = fund.jzrq === todayStr

        const useValuation = isTradingDay && isAfter9 && !hasTodayData

        let currentNav: number
        let profitToday: number

        if (!useValuation) {
            currentNav = Number(fund.dwjz)
            if (!currentNav) return null

            const amount = holding.share * currentNav
            const rate = typeof fund.gszzl === 'number' ? fund.gszzl : Number(fund.gszzl) || 0
            profitToday = amount - amount / (1 + rate / 100)
        } else {
            currentNav =
                fund.estPricedCoverage && fund.estPricedCoverage > 0.05
                    ? fund.estGsz || Number(fund.dwjz)
                    : typeof fund.gsz === 'number'
                      ? fund.gsz
                      : Number(fund.dwjz)

            if (!currentNav) return null

            const amount = holding.share * currentNav
            const gzChange = (fund.estPricedCoverage ?? 0) > 0.05 ? (fund.estGszzl ?? 0) : Number(fund.gszzl) || 0
            profitToday = amount - amount / (1 + gzChange / 100)
        }

        const amount = holding.share * currentNav

        const profitTotal = typeof holding.cost === 'number' ? (currentNav - holding.cost) * holding.share : null

        return {
            amount,
            profitToday,
            profitTotal,
        }
    }

    const handleSaveHolding = (code: string, data: { share: number | null; cost: number | null }) => {
        setHoldings((prev) => {
            const next = { ...prev }
            if (data.share === null && data.cost === null) {
                delete next[code]
            } else if (data.share !== null) {
                next[code] = { share: data.share, cost: data.cost ?? 0 }
            }
            localStorage.setItem('holdings', JSON.stringify(next))
            return next
        })
        setHoldingModal({ open: false, fund: null })
    }

    const handleAction = (type: string, fund: FundData | null) => {
        setActionModal({ open: false, fund: null })
        if (type === 'edit' && fund) {
            setHoldingModal({ open: true, fund })
        } else if (type === 'clear' && fund) {
            setClearConfirm({ fund })
        } else if ((type === 'buy' || type === 'sell') && fund) {
            setTradeModal({ open: true, fund, type })
        }
    }

    const handleClearConfirm = () => {
        if (clearConfirm?.fund) {
            handleSaveHolding(clearConfirm.fund.code, { share: null, cost: null })
        }
        setClearConfirm(null)
    }

    const handleTrade = (fund: FundData, data: { share: number; price?: number; totalCost?: number }) => {
        const current = holdings[fund.code] || { share: 0, cost: 0 }
        const isBuy = tradeModal.type === 'buy'

        let newShare: number
        let newCost: number

        if (isBuy) {
            newShare = current.share + data.share
            const buyCost = data.totalCost !== undefined ? data.totalCost : (data.price || 0) * data.share
            newCost = (current.cost * current.share + buyCost) / newShare
        } else {
            newShare = Math.max(0, current.share - data.share)
            newCost = current.cost
            if (newShare === 0) newCost = 0
        }

        handleSaveHolding(fund.code, { share: newShare, cost: newCost })
        setTradeModal({ open: false, fund: null, type: 'buy' })
    }

    const [successModal, setSuccessModal] = useState({ open: false, message: '' })

    const toggleFavorite = (code: string) => {
        setFavorites((prev) => {
            const next = new Set(prev)
            if (next.has(code)) {
                next.delete(code)
            } else {
                next.add(code)
            }
            localStorage.setItem('favorites', JSON.stringify(Array.from(next)))
            if (next.size === 0) setCurrentTab('all')
            return next
        })
    }

    const toggleCollapse = (code: string) => {
        setCollapsedCodes((prev) => {
            const next = new Set(prev)
            if (next.has(code)) {
                next.delete(code)
            } else {
                next.add(code)
            }
            localStorage.setItem('collapsedCodes', JSON.stringify(Array.from(next)))
            return next
        })
    }

    const handleAddGroup = (name: string) => {
        const newGroup: Group = {
            id: `group_${Date.now()}`,
            name,
            codes: [],
        }
        const next = [...groups, newGroup]
        setGroups(next)
        localStorage.setItem('groups', JSON.stringify(next))
        setCurrentTab(newGroup.id)
        setGroupModalOpen(false)
    }

    const handleUpdateGroups = (newGroups: Group[]) => {
        setGroups(newGroups)
        localStorage.setItem('groups', JSON.stringify(newGroups))
        if (currentTab !== 'all' && currentTab !== 'fav' && !newGroups.find((g) => g.id === currentTab)) {
            setCurrentTab('all')
        }
    }

    const handleAddFundsToGroup = (codes: string[]) => {
        if (!codes || codes.length === 0) return
        const next = groups.map((g) => {
            if (g.id === currentTab) {
                return {
                    ...g,
                    codes: Array.from(new Set([...g.codes, ...codes])),
                }
            }
            return g
        })
        setGroups(next)
        localStorage.setItem('groups', JSON.stringify(next))
        setAddFundToGroupOpen(false)
        setSuccessModal({ open: true, message: `成功添加 ${codes.length} 支基金` })
    }

    const removeFundFromCurrentGroup = (code: string) => {
        const next = groups.map((g) => {
            if (g.id === currentTab) {
                return {
                    ...g,
                    codes: g.codes.filter((c) => c !== code),
                }
            }
            return g
        })
        setGroups(next)
        localStorage.setItem('groups', JSON.stringify(next))
    }

    const dedupeByCode = (list: FundData[]) => {
        const seen = new Set<string>()
        return list.filter((f) => {
            const c = f?.code
            if (!c || seen.has(c)) return false
            seen.add(c)
            return true
        })
    }

    useEffect(() => {
        try {
            const saved = JSON.parse(localStorage.getItem('funds') || '[]')
            if (Array.isArray(saved) && saved.length) {
                const deduped = dedupeByCode(saved)
                setFunds(deduped)
                localStorage.setItem('funds', JSON.stringify(deduped))
                const codes = Array.from(new Set(deduped.map((f) => f.code)))
                if (codes.length) refreshAll(codes)
                codes.forEach((c) => fetchNavHistory(c))
            }
            const savedMs = parseInt(localStorage.getItem('refreshMs') || '30000', 10)
            if (Number.isFinite(savedMs) && savedMs >= 5000) {
                setRefreshMs(savedMs)
            }
            const savedCollapsed = JSON.parse(localStorage.getItem('collapsedCodes') || '[]')
            if (Array.isArray(savedCollapsed)) {
                setCollapsedCodes(new Set(savedCollapsed))
            }
            const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]')
            if (Array.isArray(savedFavorites)) {
                setFavorites(new Set(savedFavorites))
            }
            const savedGroups = JSON.parse(localStorage.getItem('groups') || '[]')
            if (Array.isArray(savedGroups)) {
                setGroups(savedGroups)
            }
            const savedViewMode = localStorage.getItem('viewMode')
            if (savedViewMode === 'card' || savedViewMode === 'list') {
                setViewMode(savedViewMode)
            }
            const savedHoldings = JSON.parse(localStorage.getItem('holdings') || '{}')
            if (savedHoldings && typeof savedHoldings === 'object') {
                setHoldings(savedHoldings)
            }
        } catch {
            // Silent fail for localStorage read - data may be corrupted or storage unavailable
        }
    }, [])

    useEffect(() => {
        if (timerRef.current) clearInterval(timerRef.current)
        timerRef.current = setInterval(() => {
            const codes = Array.from(new Set(funds.map((f) => f.code)))
            if (codes.length) refreshAll(codes)
            fetchMarketIndices()
        }, refreshMs)
        return () => {
            if (timerRef.current) clearInterval(timerRef.current)
        }
    }, [funds, refreshMs])

    const loadScript = (url: string) => {
        return new Promise<void>((resolve, reject) => {
            const script = document.createElement('script')
            script.src = url
            script.async = true
            script.onload = () => {
                document.body.removeChild(script)
                resolve()
            }
            script.onerror = () => {
                document.body.removeChild(script)
                reject(new Error('数据加载失败'))
            }
            document.body.appendChild(script)
        })
    }

    const fetchFundData = async (c: string) => {
        return new Promise<FundData>(async (resolve, reject) => {
            const getTencentPrefix = (code: string) => {
                if (code.startsWith('6') || code.startsWith('9')) return 'sh'
                if (code.startsWith('0') || code.startsWith('3')) return 'sz'
                if (code.startsWith('4') || code.startsWith('8')) return 'bj'
                return 'sz'
            }

            const gzUrl = `https://fundgz.1234567.com.cn/js/${c}.js?rt=${Date.now()}`
            const currentCallback = `jsonpgz_${c}_${Math.random().toString(36).slice(2, 7)}`
            const scriptGz = document.createElement('script')
            scriptGz.src = gzUrl

            const originalJsonpgz = window.jsonpgz
            window.jsonpgz = (json: unknown) => {
                window.jsonpgz = originalJsonpgz
                if (!json || typeof json !== 'object') {
                    reject(new Error('未获取到基金估值数据'))
                    return
                }
                const jsonObj = json as FundGzResponse
                const gszzlNum = Number(jsonObj.gszzl)
                const gzData: FundData = {
                    code: jsonObj.fundcode,
                    name: jsonObj.name,
                    dwjz: jsonObj.dwjz,
                    gsz: jsonObj.gsz,
                    gztime: jsonObj.gztime,
                    jzrq: jsonObj.jzrq,
                    gszzl: Number.isFinite(gszzlNum) ? gszzlNum : jsonObj.gszzl,
                }

                const tencentPromise = new Promise<TencentFundData | null>((resolveT) => {
                    const tUrl = `https://qt.gtimg.cn/q=jj${c}`
                    const tScript = document.createElement('script')
                    tScript.src = tUrl
                    tScript.onload = () => {
                        const v = window[`v_jj${c}`] as string | undefined
                        if (v) {
                            const p = v.split('~')
                            resolveT({
                                dwjz: p[5]!,
                                zzl: parseFloat(p[7]!),
                                jzrq: p[8] ? p[8].slice(0, 10) : '',
                            })
                        } else {
                            resolveT(null)
                        }
                        if (document.body.contains(tScript)) document.body.removeChild(tScript)
                    }
                    tScript.onerror = () => {
                        if (document.body.contains(tScript)) document.body.removeChild(tScript)
                        resolveT(null)
                    }
                    document.body.appendChild(tScript)
                })

                const holdingsPromise = new Promise<FundHolding[]>((resolveH) => {
                    const holdingsUrl = `https://fundf10.eastmoney.com/FundArchivesDatas.aspx?type=jjcc&code=${c}&topline=10&year=&month=&rt=${Date.now()}`
                    loadScript(holdingsUrl)
                        .then(async () => {
                            let holdings: FundHolding[] = []
                            const html = window.apidata?.content ?? ''
                            const rows = html.match(/<tr[\s\S]*?<\/tr>/gi) || []
                            for (const r of rows) {
                                const cells = (r.match(/<td[\s\S]*?>([\s\S]*?)<\/td>/gi) || []).map((td: string) =>
                                    td.replace(/<[^>]*>/g, '').trim(),
                                )
                                const codeIdx = cells.findIndex((txt: string) => /^\d{6}$/.test(txt))
                                const weightIdx = cells.findIndex((txt: string) => /\d+(?:\.\d+)?\s*%/.test(txt))
                                if (codeIdx >= 0 && weightIdx >= 0) {
                                    holdings.push({
                                        code: cells[codeIdx]!,
                                        name: cells[codeIdx + 1] ?? '',
                                        weight: cells[weightIdx]!,
                                        change: null,
                                    })
                                }
                            }

                            holdings = holdings.slice(0, 10)

                            if (holdings.length) {
                                try {
                                    const tencentCodes = holdings
                                        .map((h) => `s_${getTencentPrefix(h.code)}${h.code}`)
                                        .join(',')
                                    const quoteUrl = `https://qt.gtimg.cn/q=${tencentCodes}`

                                    await new Promise<void>((resQuote) => {
                                        const scriptQuote = document.createElement('script')
                                        scriptQuote.src = quoteUrl
                                        scriptQuote.onload = () => {
                                            holdings.forEach((h) => {
                                                const varName = `v_s_${getTencentPrefix(h.code)}${h.code}`
                                                const dataStr = window[varName] as string | undefined
                                                if (dataStr && typeof dataStr === 'string') {
                                                    const parts = dataStr.split('~')
                                                    if (parts.length > 5) {
                                                        h.change = parseFloat(parts[5]!)
                                                    }
                                                }
                                            })
                                            if (document.body.contains(scriptQuote))
                                                document.body.removeChild(scriptQuote)
                                            resQuote()
                                        }
                                        scriptQuote.onerror = () => {
                                            if (document.body.contains(scriptQuote))
                                                document.body.removeChild(scriptQuote)
                                            resQuote()
                                        }
                                        document.body.appendChild(scriptQuote)
                                    })
                                } catch (e) {
                                    console.error('获取股票涨跌幅失败', e)
                                }
                            }
                            resolveH(holdings)
                        })
                        .catch(() => resolveH([]))
                })

                Promise.all([tencentPromise, holdingsPromise]).then(([tData, holdings]) => {
                    if (tData) {
                        if (tData.jzrq && (!gzData.jzrq || tData.jzrq >= gzData.jzrq)) {
                            gzData.dwjz = tData.dwjz
                            gzData.jzrq = tData.jzrq
                            gzData.zzl = tData.zzl
                        }
                    }
                    resolve({ ...gzData, holdings })
                })
            }

            scriptGz.onerror = () => {
                window.jsonpgz = originalJsonpgz
                if (document.body.contains(scriptGz)) document.body.removeChild(scriptGz)
                reject(new Error('基金数据加载失败'))
            }

            document.body.appendChild(scriptGz)
            setTimeout(() => {
                if (document.body.contains(scriptGz)) document.body.removeChild(scriptGz)
            }, 5000)
        })
    }

    const performSearch = async (val: string) => {
        if (!val.trim()) {
            setSearchResults([])
            return
        }
        setIsSearching(true)
        const callbackName = `SuggestData_${Date.now()}`
        const url = `https://fundsuggest.eastmoney.com/FundSearch/api/FundSearchAPI.ashx?m=1&key=${encodeURIComponent(val)}&callback=${callbackName}&_=${Date.now()}`

        try {
            await new Promise<void>((resolve, reject) => {
                window[callbackName] = (data: unknown) => {
                    if (data && typeof data === 'object' && 'Datas' in data) {
                        const dataObj = data as {
                            Datas: Array<{
                                CATEGORY: number | string
                                CATEGORYDESC: string
                                CODE: string
                                NAME: string
                            }>
                        }
                        if (dataObj.Datas) {
                            const fundsOnly = dataObj.Datas.filter(
                                (d) => d.CATEGORY === 700 || d.CATEGORY === '700' || d.CATEGORYDESC === '基金',
                            )
                            const mappedResults: FundData[] = fundsOnly.map((d) => ({
                                code: d.CODE,
                                name: d.NAME,
                            }))
                            setSearchResults(mappedResults)
                        }
                    }
                    delete window[callbackName]
                    resolve()
                }

                const script = document.createElement('script')
                script.src = url
                script.async = true
                script.onload = () => {
                    if (document.body.contains(script)) document.body.removeChild(script)
                }
                script.onerror = () => {
                    if (document.body.contains(script)) document.body.removeChild(script)
                    delete window[callbackName]
                    reject(new Error('搜索请求失败'))
                }
                document.body.appendChild(script)
            })
        } catch (e) {
            console.error('搜索失败', e)
        } finally {
            setIsSearching(false)
        }
    }

    const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setSearchTerm(val)
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
        searchTimeoutRef.current = setTimeout(() => performSearch(val), 300)
    }

    interface SearchFundResult {
        CODE: string
        NAME: string
        [key: string]: unknown
    }

    const toggleSelectFund = (fund: SearchFundResult) => {
        const fundData: FundData = { code: fund.CODE, name: fund.NAME }
        setSelectedFunds((prev) => {
            const exists = prev.find((f) => f.code === fundData.code)
            if (exists) {
                return prev.filter((f) => f.code !== fundData.code)
            }
            return [...prev, fundData]
        })
    }

    const refreshAll = async (codes: string[]) => {
        if (refreshingRef.current) return
        refreshingRef.current = true
        setRefreshing(true)
        const uniqueCodes = Array.from(new Set(codes))
        try {
            const updated: FundData[] = []
            for (const c of uniqueCodes) {
                try {
                    const data = await fetchFundData(c)
                    updated.push(data)
                } catch (e) {
                    console.error(`刷新基金 ${c} 失败`, e)
                    setFunds((prev) => {
                        const old = prev.find((f) => f.code === c)
                        if (old) updated.push(old)
                        return prev
                    })
                }
            }

            if (updated.length > 0) {
                setFunds((prev) => {
                    const merged = [...prev]
                    updated.forEach((u) => {
                        const idx = merged.findIndex((f) => f.code === u.code)
                        if (idx > -1) {
                            merged[idx] = u
                        } else {
                            merged.push(u)
                        }
                    })
                    const deduped = dedupeByCode(merged)
                    localStorage.setItem('funds', JSON.stringify(deduped))
                    return deduped
                })
            }
        } catch (e) {
            console.error(e)
        } finally {
            refreshingRef.current = false
            setRefreshing(false)
        }
    }

    const addFund = async (e?: React.FormEvent) => {
        e?.preventDefault?.()
        setError('')
        const manualTokens = String(searchTerm || '')
            .split(/[^0-9A-Za-z]+/)
            .map((t) => t.trim())
            .filter((t) => t.length > 0)
        const selectedCodes = Array.from(
            new Set([...selectedFunds.map((f) => f.code), ...manualTokens.filter((t) => /^\d{6}$/.test(t))]),
        )
        if (selectedCodes.length === 0) {
            setError('请输入或选择基金代码')
            return
        }
        setLoading(true)
        try {
            const newFunds: FundData[] = []
            const failures: Array<{ code: string; name: string }> = []
            const nameMap: Record<string, string> = {}
            selectedFunds.forEach((f) => {
                nameMap[f.code] = f.name
            })
            for (const c of selectedCodes) {
                if (funds.some((f) => f.code === c)) continue
                try {
                    const data = await fetchFundData(c)
                    newFunds.push(data)
                } catch (err) {
                    failures.push({ code: c, name: nameMap[c] ?? '' })
                }
            }
            if (newFunds.length === 0) {
                setError('未添加任何新基金')
            } else {
                const next = dedupeByCode([...newFunds, ...funds])
                setFunds(next)
                localStorage.setItem('funds', JSON.stringify(next))
                newFunds.forEach((f) => fetchNavHistory(f.code))
            }
            setSearchTerm('')
            setSelectedFunds([])
            setShowDropdown(false)
            if (failures.length > 0) {
                setAddFailures(failures)
                setAddResultOpen(true)
            }
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : '添加失败'
            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    const removeFund = (removeCode: string) => {
        const next = funds.filter((f) => f.code !== removeCode)
        setFunds(next)
        localStorage.setItem('funds', JSON.stringify(next))

        const nextGroups = groups.map((g) => ({
            ...g,
            codes: g.codes.filter((c) => c !== removeCode),
        }))
        setGroups(nextGroups)
        localStorage.setItem('groups', JSON.stringify(nextGroups))

        setCollapsedCodes((prev) => {
            if (!prev.has(removeCode)) return prev
            const nextSet = new Set(prev)
            nextSet.delete(removeCode)
            localStorage.setItem('collapsedCodes', JSON.stringify(Array.from(nextSet)))
            return nextSet
        })

        setFavorites((prev) => {
            if (!prev.has(removeCode)) return prev
            const nextSet = new Set(prev)
            nextSet.delete(removeCode)
            localStorage.setItem('favorites', JSON.stringify(Array.from(nextSet)))
            if (nextSet.size === 0) setCurrentTab('all')
            return nextSet
        })

        setHoldings((prev) => {
            if (!prev[removeCode]) return prev
            const next = { ...prev }
            delete next[removeCode]
            localStorage.setItem('holdings', JSON.stringify(next))
            return next
        })
    }

    const manualRefresh = async () => {
        if (refreshingRef.current) return
        const codes = Array.from(new Set(funds.map((f) => f.code)))
        if (!codes.length) return
        await refreshAll(codes)
    }

    const saveSettings = (ms) => {
        setRefreshMs(ms)
        localStorage.setItem('refreshMs', String(ms))
        setSettingsOpen(false)
    }

    const [importMsg, setImportMsg] = useState('')

    const exportLocalData = async () => {
        try {
            const payload = {
                version: 1,
                funds: JSON.parse(localStorage.getItem('funds') || '[]'),
                favorites: JSON.parse(localStorage.getItem('favorites') || '[]'),
                groups: JSON.parse(localStorage.getItem('groups') || '[]'),
                collapsedCodes: JSON.parse(localStorage.getItem('collapsedCodes') || '[]'),
                refreshMs: parseInt(localStorage.getItem('refreshMs') || '30000', 10),
                viewMode: localStorage.getItem('viewMode') || 'card',
                holdings: JSON.parse(localStorage.getItem('holdings') || '{}'),
                exportedAt: new Date().toISOString(),
            }
            const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
            if (window.showSaveFilePicker) {
                const handle = await window.showSaveFilePicker({
                    suggestedName: `realtime-fund-config-${Date.now()}.json`,
                    types: [{ description: 'JSON', accept: { 'application/json': ['.json'] } }],
                })
                const writable = await handle.createWritable()
                await writable.write(blob)
                await writable.close()
                setSuccessModal({ open: true, message: '导出成功' })
                setSettingsOpen(false)
                return
            }
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `realtime-fund-config-${Date.now()}.json`
            let done = false
            const finish = () => {
                if (done) return
                done = true
                URL.revokeObjectURL(url)
                setSuccessModal({ open: true, message: '导出成功' })
                setSettingsOpen(false)
            }
            const onVisibility = () => {
                if (document.visibilityState === 'hidden') return
                finish()
                document.removeEventListener('visibilitychange', onVisibility)
            }
            document.addEventListener('visibilitychange', onVisibility, { once: true })
            a.click()
            setTimeout(finish, 3000)
        } catch (err) {
            console.error('Export error:', err)
        }
    }

    const handleImportFile = async (file) => {
        try {
            if (!file) return
            const text = await file.text()
            const data = JSON.parse(text)
            if (data && typeof data === 'object') {
                const currentFunds = JSON.parse(localStorage.getItem('funds') || '[]')
                const currentFavorites = JSON.parse(localStorage.getItem('favorites') || '[]')
                const currentGroups = JSON.parse(localStorage.getItem('groups') || '[]')
                const currentCollapsed = JSON.parse(localStorage.getItem('collapsedCodes') || '[]')

                let mergedFunds = currentFunds
                let appendedCodes = []

                if (Array.isArray(data.funds)) {
                    const incomingFunds = dedupeByCode(data.funds)
                    const existingCodes = new Set(currentFunds.map((f) => f.code))
                    const newItems = incomingFunds.filter((f) => f && f.code && !existingCodes.has(f.code))
                    appendedCodes = newItems.map((f) => f.code)
                    mergedFunds = [...currentFunds, ...newItems]
                    setFunds(mergedFunds)
                    localStorage.setItem('funds', JSON.stringify(mergedFunds))
                }

                if (Array.isArray(data.favorites)) {
                    const mergedFav = Array.from(new Set([...currentFavorites, ...data.favorites]))
                    setFavorites(new Set(mergedFav))
                    localStorage.setItem('favorites', JSON.stringify(mergedFav))
                }

                if (Array.isArray(data.groups)) {
                    const mergedGroups = [...currentGroups]
                    data.groups.forEach((incomingGroup) => {
                        const existingIdx = mergedGroups.findIndex((g) => g.id === incomingGroup.id)
                        if (existingIdx > -1) {
                            mergedGroups[existingIdx] = {
                                ...mergedGroups[existingIdx],
                                codes: Array.from(
                                    new Set([...mergedGroups[existingIdx].codes, ...(incomingGroup.codes || [])]),
                                ),
                            }
                        } else {
                            mergedGroups.push(incomingGroup)
                        }
                    })
                    setGroups(mergedGroups)
                    localStorage.setItem('groups', JSON.stringify(mergedGroups))
                }

                if (Array.isArray(data.collapsedCodes)) {
                    const mergedCollapsed = Array.from(new Set([...currentCollapsed, ...data.collapsedCodes]))
                    setCollapsedCodes(new Set(mergedCollapsed))
                    localStorage.setItem('collapsedCodes', JSON.stringify(mergedCollapsed))
                }

                if (typeof data.refreshMs === 'number' && data.refreshMs >= 5000) {
                    setRefreshMs(data.refreshMs)
                    localStorage.setItem('refreshMs', String(data.refreshMs))
                }
                if (data.viewMode === 'card' || data.viewMode === 'list') {
                    setViewMode(data.viewMode)
                    localStorage.setItem('viewMode', data.viewMode)
                }

                if (data.holdings && typeof data.holdings === 'object') {
                    const mergedHoldings = { ...JSON.parse(localStorage.getItem('holdings') || '{}'), ...data.holdings }
                    setHoldings(mergedHoldings)
                    localStorage.setItem('holdings', JSON.stringify(mergedHoldings))
                }

                if (appendedCodes.length) {
                    const allCodes = mergedFunds.map((f) => f.code)
                    await refreshAll(allCodes)
                }

                setSuccessModal({ open: true, message: '导入成功' })
                setSettingsOpen(false)
            }
        } catch (err) {
            console.error('Import error:', err)
            setImportMsg('导入失败，请检查文件格式')
            setTimeout(() => setImportMsg(''), 4000)
        }
    }

    useEffect(() => {
        const isAnyModalOpen =
            settingsOpen ||
            feedbackOpen ||
            addResultOpen ||
            addFundToGroupOpen ||
            groupManageOpen ||
            groupModalOpen ||
            successModal.open ||
            holdingModal.open ||
            actionModal.open ||
            tradeModal.open ||
            !!clearConfirm ||
            donateOpen

        if (isAnyModalOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }

        return () => {
            document.body.style.overflow = ''
        }
    }, [
        settingsOpen,
        feedbackOpen,
        addResultOpen,
        addFundToGroupOpen,
        groupManageOpen,
        groupModalOpen,
        successModal.open,
        holdingModal.open,
        actionModal.open,
        tradeModal.open,
        clearConfirm,
        donateOpen,
    ])

    useEffect(() => {
        const onKey = (ev) => {
            if (ev.key === 'Escape' && settingsOpen) setSettingsOpen(false)
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [settingsOpen])

    const getGroupName = () => {
        if (currentTab === 'all') return '全部资产'
        if (currentTab === 'fav') return '自选资产'
        const group = groups.find((g) => g.id === currentTab)
        return group ? `${group.name}资产` : '分组资产'
    }

    return (
        <div className="container content">
            <Announcement />
            <Header
                refreshing={refreshing}
                refreshMs={refreshMs}
                onRefresh={manualRefresh}
                onOpenSettings={() => setSettingsOpen(true)}
                fundCount={funds.length}
            />

            <MarketBar indices={marketIndices} />

            <div className="grid">
                <div className="col-12">
                    <AddFundSection
                        onAddFund={addFund}
                        selectedFunds={selectedFunds}
                        onToggleSelectFund={toggleSelectFund}
                        searchTerm={searchTerm}
                        onSearchInput={handleSearchInput}
                        isSearching={isSearching}
                        showDropdown={showDropdown}
                        setShowDropdown={setShowDropdown}
                        searchResults={searchResults}
                        loading={loading}
                        error={error}
                        existingFunds={funds}
                    />
                </div>

                <div className="col-12">
                    <FilterBar
                        currentTab={currentTab}
                        funds={funds}
                        favorites={favorites}
                        groups={groups}
                        onTabChange={setCurrentTab}
                        onManageGroups={() => setGroupManageOpen(true)}
                        onAddGroup={() => setGroupModalOpen(true)}
                        viewMode={viewMode}
                        onViewModeChange={(mode) => {
                            setViewMode(mode)
                            localStorage.setItem('viewMode', mode)
                        }}
                        sortBy={sortBy}
                        onSortByChange={setSortBy}
                    />

                    {displayFunds.length === 0 ? (
                        <div
                            className="glass card empty"
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '60px 20px',
                            }}
                        >
                            <div style={{ fontSize: '48px', marginBottom: 16, opacity: 0.5 }}>📂</div>
                            <div className="muted" style={{ marginBottom: 20 }}>
                                {funds.length === 0 ? '尚未添加基金' : '该分组下暂无数据'}
                            </div>
                            {currentTab !== 'all' && currentTab !== 'fav' && funds.length > 0 && (
                                <button className="button" onClick={() => setAddFundToGroupOpen(true)}>
                                    添加基金到此分组
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            <GroupSummary
                                funds={displayFunds}
                                holdings={holdings}
                                groupName={getGroupName()}
                                getProfit={getHoldingProfit}
                            />

                            {currentTab !== 'all' && currentTab !== 'fav' && (
                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="button-dashed"
                                    onClick={() => setAddFundToGroupOpen(true)}
                                    style={{
                                        width: '100%',
                                        height: '48px',
                                        border: '2px dashed rgba(0,0,0,0.06)',
                                        background: 'transparent',
                                        borderRadius: '12px',
                                        color: 'var(--muted)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        marginBottom: '16px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        fontSize: '14px',
                                        fontWeight: 500,
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--primary)'
                                        e.currentTarget.style.color = 'var(--primary)'
                                        e.currentTarget.style.background = 'rgba(255,136,0,0.05)'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)'
                                        e.currentTarget.style.color = 'var(--muted)'
                                        e.currentTarget.style.background = 'transparent'
                                    }}
                                >
                                    <PlusIcon width="18" height="18" />
                                    <span>添加基金到此分组</span>
                                </motion.button>
                            )}

                            <FundList
                                viewMode={viewMode}
                                funds={displayFunds}
                                currentTab={currentTab}
                                favorites={favorites}
                                onToggleFavorite={toggleFavorite}
                                onRemoveFromGroup={removeFundFromCurrentGroup}
                                onRemoveFund={removeFund}
                                todayStr={todayStr}
                                isTradingDay={isTradingDay}
                                navHistory={navHistory}
                                holdings={holdings}
                                getHoldingProfit={getHoldingProfit}
                                onOpenHoldingModal={(fund) => setHoldingModal({ open: true, fund })}
                                onOpenActionModal={(fund) => setActionModal({ open: true, fund })}
                                percentModes={percentModes}
                                onTogglePercentMode={(code) =>
                                    setPercentModes((prev) => ({ ...prev, [code]: !prev[code] }))
                                }
                                collapsedCodes={collapsedCodes}
                                onToggleCollapse={toggleCollapse}
                            />
                        </>
                    )}
                </div>
            </div>

            <div className="footer">
                <p style={{ marginBottom: 8 }}>
                    数据源：实时估值与重仓直连东方财富，仅供个人学习及参考使用。数据可能存在延迟，不作为任何投资建议
                </p>
                <p style={{ marginBottom: 12 }}>注：估算数据与真实结算数据会有1%左右误差，非股票型基金误差较大</p>
                <div
                    style={{
                        marginTop: 12,
                        opacity: 0.8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 8,
                    }}
                >
                    <p style={{ margin: 0 }}>
                        遇到任何问题或需求建议可
                        <button
                            className="link-button"
                            onClick={() => {
                                setFeedbackNonce((n) => n + 1)
                                setFeedbackOpen(true)
                            }}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--primary)',
                                cursor: 'pointer',
                                padding: '0 4px',
                                textDecoration: 'underline',
                                fontSize: 'inherit',
                                fontWeight: 600,
                            }}
                        >
                            点此提交反馈
                        </button>
                    </p>
                    <button
                        onClick={() => setDonateOpen(true)}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--muted)',
                            fontSize: '12px',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            padding: '4px 8px',
                            borderRadius: '6px',
                            transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.color = 'var(--primary)'
                            e.currentTarget.style.background = 'rgba(0,0,0,0.04)'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.color = 'var(--muted)'
                            e.currentTarget.style.background = 'transparent'
                        }}
                    >
                        <span>☕</span>
                        <span>请作者喝杯咖啡</span>
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {settingsOpen && (
                    <SettingsModal
                        isOpen={settingsOpen}
                        onClose={() => setSettingsOpen(false)}
                        refreshMs={refreshMs}
                        onSaveSettings={saveSettings}
                        onExport={exportLocalData}
                        onImport={handleImportFile}
                        importMsg={importMsg}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {feedbackOpen && <FeedbackModal key={feedbackNonce} onClose={() => setFeedbackOpen(false)} />}
            </AnimatePresence>
            <AnimatePresence>
                {addResultOpen && <AddResultModal failures={addFailures} onClose={() => setAddResultOpen(false)} />}
            </AnimatePresence>

            <AnimatePresence>
                {addFundToGroupOpen && (
                    <AddFundToGroupModal
                        allFunds={funds}
                        currentGroupCodes={groups.find((g) => g.id === currentTab)?.codes || []}
                        onClose={() => setAddFundToGroupOpen(false)}
                        onAdd={handleAddFundsToGroup}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {actionModal.open && (
                    <HoldingActionModal
                        fund={actionModal.fund}
                        onClose={() => setActionModal({ open: false, fund: null })}
                        onAction={(type) => handleAction(type, actionModal.fund)}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {tradeModal.open && (
                    <TradeModal
                        type={tradeModal.type}
                        fund={tradeModal.fund}
                        onClose={() => setTradeModal({ open: false, fund: null, type: 'buy' })}
                        onConfirm={(data) => handleTrade(tradeModal.fund, data)}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {clearConfirm && (
                    <ConfirmModal
                        title="清空持仓"
                        message={`确定要清空“${clearConfirm.fund?.name}”的所有持仓记录吗？此操作不可恢复。`}
                        onConfirm={handleClearConfirm}
                        onCancel={() => setClearConfirm(null)}
                        confirmText="确认清空"
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {holdingModal.open && (
                    <HoldingEditModal
                        fund={holdingModal.fund}
                        holding={holdings[holdingModal.fund?.code]}
                        onClose={() => setHoldingModal({ open: false, fund: null })}
                        onSave={(data) => handleSaveHolding(holdingModal.fund?.code, data)}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {donateOpen && <DonateModal isOpen={donateOpen} onClose={() => setDonateOpen(false)} />}
            </AnimatePresence>

            <AnimatePresence>
                {groupManageOpen && (
                    <GroupManageModal
                        groups={groups}
                        onClose={() => setGroupManageOpen(false)}
                        onSave={handleUpdateGroups}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {groupModalOpen && <GroupModal onClose={() => setGroupModalOpen(false)} onConfirm={handleAddGroup} />}
            </AnimatePresence>

            <AnimatePresence>
                {successModal.open && (
                    <SuccessModal
                        message={successModal.message}
                        onClose={() => setSuccessModal({ open: false, message: '' })}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}
