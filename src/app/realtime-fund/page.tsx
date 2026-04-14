"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
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
  HoldingActionModal,
  HoldingEditModal,
  HoldingsContribution,
  MarketBar,
  SettingsModal,
  SuccessModal,
  TradeModal,
} from "./components/features";
import { PlusIcon } from "./components/icons";
import Link from "next/link";
import "./globals.css";

interface FundData {
  code: string;
  name: string;
  dwjz?: string;
  gsz?: string;
  gztime?: string;
  jzrq?: string;
  gszzl?: string | number;
  estGszzl?: number;
  estGsz?: number;
  estPricedCoverage?: number;
  zzl?: number;
  holdings?: FundHolding[];
}

interface MarketIndex {
  name: string;
  price: string;
  change: number;
}

interface Group {
  id?: string;
  name?: string;
  codes?: string[];
}

interface FundHolding {
  code: string;
  name: string;
  weight: string;
  change: number | null;
}

export default function HomePage() {
  const { t } = useTranslation();
  const [funds, setFunds] = useState<FundData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const refreshingRef = useRef(false);

  const [refreshMs, setRefreshMs] = useState(30000);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  const [collapsedCodes, setCollapsedCodes] = useState(new Set<string>());

  const [favorites, setFavorites] = useState(new Set<string>());
  const [groups, setGroups] = useState<Group[]>([]);
  const [currentTab, setCurrentTab] = useState("all");
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [groupManageOpen, setGroupManageOpen] = useState(false);
  const [addFundToGroupOpen, setAddFundToGroupOpen] = useState(false);

  const [sortBy, setSortBy] = useState("default");

  const [viewMode, setViewMode] = useState("card");

  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackNonce, setFeedbackNonce] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<FundData[]>([]);
  const [selectedFunds, setSelectedFunds] = useState<FundData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [addResultOpen, setAddResultOpen] = useState(false);
  const [addFailures, setAddFailures] = useState<
    Array<{ code: string; name: string }>
  >([]);
  const [holdingModal, setHoldingModal] = useState<{
    open: boolean;
    fund: FundData | null;
  }>({
    open: false,
    fund: null,
  });
  const [actionModal, setActionModal] = useState<{
    open: boolean;
    fund: FundData | null;
  }>({
    open: false,
    fund: null,
  });
  const [tradeModal, setTradeModal] = useState<{
    open: boolean;
    fund: FundData | null;
    type: string;
  }>({
    open: false,
    fund: null,
    type: "buy",
  });
  const [clearConfirm, setClearConfirm] = useState<{ fund: FundData } | null>(
    null,
  );
  const [donateOpen, setDonateOpen] = useState(false);
  const [holdings, setHoldings] = useState<
    Record<string, { share: number; cost: number }>
  >({});
  const [percentModes, setPercentModes] = useState<Record<string, boolean>>({});
  const [isTradingDay, setIsTradingDay] = useState(true);
  const [marketIndices, setMarketIndices] = useState<MarketIndex[]>([]);
  const [navHistory, setNavHistory] = useState<
    Record<string, Array<{ date: string; value: number }>>
  >({});
  const navHistoryFetchedRef = useRef(new Set());

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const checkTradingDay = useCallback(async () => {
    const now = new Date();
    if (now.getDay() === 0 || now.getDay() === 6) {
      setIsTradingDay(false);
      return;
    }
    try {
      const res = await fetch("/api/market/trading-day");
      const data = (await res.json()) as { isTradingDay: boolean };
      setIsTradingDay(data.isTradingDay);
    } catch {
      setIsTradingDay(true);
    }
  }, []);

  const fetchMarketIndices = useCallback(async () => {
    try {
      const res = await fetch("/api/market/indices");
      const data = (await res.json()) as MarketIndex[];
      if (Array.isArray(data) && data.length) setMarketIndices(data);
    } catch (e) {
      console.error("Failed to fetch market indices", e);
    }
  }, []);

  const fetchNavHistory = useCallback(async (code: string) => {
    if (navHistoryFetchedRef.current.has(code)) return;
    navHistoryFetchedRef.current.add(code);
    try {
      const res = await fetch(
        `/api/market/fund-history?code=${encodeURIComponent(code)}`,
      );
      const data = (await res.json()) as Array<{ date: string; value: number }>;
      if (Array.isArray(data) && data.length) {
        setNavHistory((prev) => ({ ...prev, [code]: data }));
      }
    } catch (e) {
      console.error(`Failed to fetch NAV history for fund ${code}`, e);
    }
  }, []);

  useEffect(() => {
    checkTradingDay();
    fetchMarketIndices();
    const timer = setInterval(checkTradingDay, 60000);
    return () => clearInterval(timer);
  }, []);

  const displayFunds = useMemo(() => {
    return funds
      .filter((f) => {
        if (currentTab === "all") return true;
        if (currentTab === "fav") return favorites.has(f.code);
        const group = groups.find((g) => g.id === currentTab);
        return group?.codes ? group.codes.includes(f.code) : true;
      })
      .sort((a, b) => {
        if (sortBy === "yield") {
          const valA =
            typeof a.estGszzl === "number" ? a.estGszzl : Number(a.gszzl) || 0;
          const valB =
            typeof b.estGszzl === "number" ? b.estGszzl : Number(b.gszzl) || 0;
          return valB - valA;
        }
        if (sortBy === "name") return a.name.localeCompare(b.name, "zh-CN");
        if (sortBy === "code") return a.code.localeCompare(b.code);
        return 0;
      });
  }, [funds, currentTab, favorites, groups, sortBy]);

  const getHoldingProfit = useCallback(
    (fund: FundData, holding: { share: number; cost?: number } | null) => {
      if (!holding || typeof holding.share !== "number") return null;

      const now = new Date();
      const isAfter9 = now.getHours() >= 9;
      const hasTodayData = fund.jzrq === todayStr;

      const useValuation = isTradingDay && isAfter9 && !hasTodayData;

      let currentNav: number;
      let profitToday: number;

      if (!useValuation) {
        currentNav = Number(fund.dwjz);
        if (!currentNav) return null;

        const amount = holding.share * currentNav;
        const rate =
          typeof fund.gszzl === "number" ? fund.gszzl : Number(fund.gszzl) || 0;
        profitToday = amount - amount / (1 + rate / 100);
      } else {
        currentNav =
          fund.estPricedCoverage && fund.estPricedCoverage > 0.05
            ? fund.estGsz || Number(fund.dwjz)
            : typeof fund.gsz === "number"
              ? fund.gsz
              : Number(fund.dwjz);

        if (!currentNav) return null;

        const amount = holding.share * currentNav;
        const gzChange =
          (fund.estPricedCoverage ?? 0) > 0.05
            ? (fund.estGszzl ?? 0)
            : Number(fund.gszzl) || 0;
        profitToday = amount - amount / (1 + gzChange / 100);
      }

      const amount = holding.share * currentNav;

      const profitTotal =
        typeof holding.cost === "number"
          ? (currentNav - holding.cost) * holding.share
          : null;

      return {
        amount,
        profitToday,
        profitTotal,
      };
    },
    [isTradingDay, todayStr],
  );

  const handleSaveHolding = (
    code: string,
    data: { share: number | null; cost: number | null },
  ) => {
    setHoldings((prev) => {
      const next = { ...prev };
      if (data.share === null && data.cost === null) {
        delete next[code];
      } else if (data.share !== null) {
        next[code] = { share: data.share, cost: data.cost ?? 0 };
      }
      localStorage.setItem("holdings", JSON.stringify(next));
      return next;
    });
    setHoldingModal({ open: false, fund: null });
  };

  const handleAction = (type: string, fund: FundData | null) => {
    setActionModal({ open: false, fund: null });
    if (type === "edit" && fund) {
      setHoldingModal({ open: true, fund });
    } else if (type === "clear" && fund) {
      setClearConfirm({ fund });
    } else if ((type === "buy" || type === "sell") && fund) {
      setTradeModal({ open: true, fund, type });
    }
  };

  const handleClearConfirm = () => {
    if (clearConfirm?.fund) {
      handleSaveHolding(clearConfirm.fund.code, { share: null, cost: null });
    }
    setClearConfirm(null);
  };

  const handleTrade = (
    fund: FundData,
    data: { share: number; price?: number; totalCost?: number },
  ) => {
    const current = holdings[fund.code] || { share: 0, cost: 0 };
    const isBuy = tradeModal.type === "buy";

    let newShare: number;
    let newCost: number;

    if (isBuy) {
      newShare = current.share + data.share;
      const buyCost =
        data.totalCost !== undefined
          ? data.totalCost
          : (data.price || 0) * data.share;
      newCost = (current.cost * current.share + buyCost) / newShare;
    } else {
      newShare = Math.max(0, current.share - data.share);
      newCost = current.cost;
      if (newShare === 0) newCost = 0;
    }

    handleSaveHolding(fund.code, { share: newShare, cost: newCost });
    setTradeModal({ open: false, fund: null, type: "buy" });
  };

  const [successModal, setSuccessModal] = useState({
    open: false,
    message: "",
  });

  const toggleFavorite = (code: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(code)) {
        next.delete(code);
      } else {
        next.add(code);
      }
      localStorage.setItem("favorites", JSON.stringify(Array.from(next)));
      if (next.size === 0) setCurrentTab("all");
      return next;
    });
  };

  const toggleCollapse = (code: string) => {
    setCollapsedCodes((prev) => {
      const next = new Set(prev);
      if (next.has(code)) {
        next.delete(code);
      } else {
        next.add(code);
      }
      localStorage.setItem("collapsedCodes", JSON.stringify(Array.from(next)));
      return next;
    });
  };

  const handleAddGroup = (name: string) => {
    const newGroup: Group = {
      id: `group_${Date.now()}`,
      name,
      codes: [],
    };
    const next = [...groups, newGroup];
    setGroups(next);
    localStorage.setItem("groups", JSON.stringify(next));
    if (newGroup.id) setCurrentTab(newGroup.id);
    setGroupModalOpen(false);
  };

  const handleUpdateGroups = (newGroups: Group[]) => {
    setGroups(newGroups);
    localStorage.setItem("groups", JSON.stringify(newGroups));
    if (
      currentTab !== "all" &&
      currentTab !== "fav" &&
      !newGroups.find((g) => g.id === currentTab)
    ) {
      setCurrentTab("all");
    }
  };

  const handleAddFundsToGroup = (codes: string[]) => {
    if (!codes || codes.length === 0) return;
    const next = groups.map((g) => {
      if (g.id === currentTab) {
        return {
          ...g,
          codes: Array.from(new Set([...(g.codes || []), ...codes])),
        };
      }
      return g;
    });
    setGroups(next);
    localStorage.setItem("groups", JSON.stringify(next));
    setAddFundToGroupOpen(false);
    setSuccessModal({
      open: true,
      message: t("realtimeFund.addSuccess", { count: codes.length }),
    });
  };

  const removeFundFromCurrentGroup = (code: string) => {
    const next = groups.map((g) => {
      if (g.id === currentTab) {
        return {
          ...g,
          codes: (g.codes || []).filter((c) => c !== code),
        };
      }
      return g;
    });
    setGroups(next);
    localStorage.setItem("groups", JSON.stringify(next));
  };

  const dedupeByCode = (list: FundData[]) => {
    const seen = new Set<string>();
    return list.filter((f) => {
      const c = f?.code;
      if (!c || seen.has(c)) return false;
      seen.add(c);
      return true;
    });
  };

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("funds") || "[]");
      if (Array.isArray(saved) && saved.length) {
        const deduped = dedupeByCode(saved);
        setFunds(deduped);
        localStorage.setItem("funds", JSON.stringify(deduped));
        const codes = Array.from(new Set(deduped.map((f) => f.code)));
        if (codes.length) refreshAll(codes);
        codes.forEach((c) => fetchNavHistory(c));
      }
      const savedMs = parseInt(
        localStorage.getItem("refreshMs") || "30000",
        10,
      );
      if (Number.isFinite(savedMs) && savedMs >= 5000) {
        setRefreshMs(savedMs);
      }
      const savedCollapsed = JSON.parse(
        localStorage.getItem("collapsedCodes") || "[]",
      );
      if (Array.isArray(savedCollapsed)) {
        setCollapsedCodes(new Set(savedCollapsed));
      }
      const savedFavorites = JSON.parse(
        localStorage.getItem("favorites") || "[]",
      );
      if (Array.isArray(savedFavorites)) {
        setFavorites(new Set(savedFavorites));
      }
      const savedGroups = JSON.parse(localStorage.getItem("groups") || "[]");
      if (Array.isArray(savedGroups)) {
        setGroups(savedGroups);
      }
      const savedViewMode = localStorage.getItem("viewMode");
      if (savedViewMode === "card" || savedViewMode === "list") {
        setViewMode(savedViewMode);
      }
      const savedHoldings = JSON.parse(
        localStorage.getItem("holdings") || "{}",
      );
      if (savedHoldings && typeof savedHoldings === "object") {
        setHoldings(savedHoldings);
      }
    } catch {
      // Silent fail for localStorage read - data may be corrupted or storage unavailable
    }
  }, []);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      const codes = Array.from(new Set(funds.map((f) => f.code)));
      if (codes.length) refreshAll(codes);
      fetchMarketIndices();
    }, refreshMs);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [funds, refreshMs]);

  const fetchFundData = async (c: string): Promise<FundData> => {
    const [estimateRes, navRes, holdingsRes] = await Promise.allSettled([
      fetch(`/api/market/fund-estimate?code=${c}`),
      fetch(`/api/market/fund-nav?code=${c}`),
      fetch(`/api/market/fund-holdings?code=${c}`),
    ]);

    let fundData: FundData = { code: c, name: "" };

    if (estimateRes.status === "fulfilled" && estimateRes.value.ok) {
      const estimateResult = (await estimateRes.value.json()) as {
        success?: boolean;
        data?: FundData & { fundcode?: string };
      } & (FundData & { fundcode?: string });
      const estimate = estimateResult.data ?? estimateResult;
      if (estimate.name || estimate.fundcode) {
        const gszzlNum = Number(estimate.gszzl);
        fundData = {
          ...fundData,
          name: estimate.name ?? "",
          dwjz: estimate.dwjz ?? "",
          gsz: estimate.gsz ?? "",
          gztime: estimate.gztime ?? "",
          jzrq: estimate.jzrq ?? "",
          gszzl: Number.isFinite(gszzlNum) ? gszzlNum : (estimate.gszzl ?? 0),
        };
      }
    }

    if (navRes.status === "fulfilled" && navRes.value.ok) {
      const navResult = (await navRes.value.json()) as {
        success?: boolean;
        data?: { nav: string; changeRate: number; navDate: string };
      };
      const nav = navResult.data ?? navResult;
      const navStr = (nav as Record<string, unknown>).nav as string | undefined;
      const navDate = (nav as Record<string, unknown>).navDate as
        | string
        | undefined;
      const changeRate = (nav as Record<string, unknown>).changeRate as
        | number
        | undefined;
      if (navDate && (!fundData.jzrq || navDate >= fundData.jzrq)) {
        fundData.dwjz = navStr ?? "";
        fundData.jzrq = navDate;
        fundData.zzl = changeRate ?? 0;
      }
    }

    if (holdingsRes.status === "fulfilled" && holdingsRes.value.ok) {
      const holdingsResult = (await holdingsRes.value.json()) as {
        success?: boolean;
        data?: FundHolding[];
      } & { success?: boolean };
      const h = holdingsResult.data ?? holdingsResult;
      if (Array.isArray(h)) fundData.holdings = h as FundHolding[];
    }

    return fundData;
  };

  const performSearch = async (val: string) => {
    if (!val.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const res = await fetch(
        `/api/market/fund-search?key=${encodeURIComponent(val)}`,
      );
      const data = (await res.json()) as FundData[];
      setSearchResults(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Search failed", e);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => performSearch(val), 300);
  };

  const toggleSelectFund = (fund: FundData) => {
    const fundData: FundData = { code: fund.code, name: fund.name };
    setSelectedFunds((prev) => {
      const exists = prev.find((f) => f.code === fundData.code);
      if (exists) {
        return prev.filter((f) => f.code !== fundData.code);
      }
      return [...prev, fundData];
    });
  };

  const refreshAll = async (codes: string[]) => {
    if (refreshingRef.current) return;
    refreshingRef.current = true;
    setRefreshing(true);
    const uniqueCodes = Array.from(new Set(codes));
    try {
      const results = await Promise.allSettled(
        uniqueCodes.map((c) => fetchFundData(c)),
      );
      const updated: FundData[] = [];

      results.forEach((result, idx) => {
        if (result.status === "fulfilled") {
          updated.push(result.value);
        } else {
          const c = uniqueCodes[idx];
          console.error(`Failed to refresh fund ${c}`, result.reason);
          const old = funds.find((f) => f.code === c);
          if (old) updated.push(old);
        }
      });

      if (updated.length > 0) {
        setFunds((prev) => {
          const merged = [...prev];
          updated.forEach((u) => {
            const idx = merged.findIndex((f) => f.code === u.code);
            if (idx > -1) {
              merged[idx] = u;
            } else {
              merged.push(u);
            }
          });
          const deduped = dedupeByCode(merged);
          localStorage.setItem("funds", JSON.stringify(deduped));
          return deduped;
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      refreshingRef.current = false;
      setRefreshing(false);
    }
  };

  const addFund = async (e?: React.FormEvent) => {
    e?.preventDefault?.();
    setError("");
    const manualTokens = String(searchTerm || "")
      .split(/[^0-9A-Za-z]+/)
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    const selectedCodes = Array.from(
      new Set([
        ...selectedFunds.map((f) => f.code),
        ...manualTokens.filter((t) => /^\d{6}$/.test(t)),
      ]),
    );
    if (selectedCodes.length === 0) {
      setError(t("realtimeFund.enterFundCode"));
      return;
    }
    setLoading(true);
    try {
      const newFunds: FundData[] = [];
      const failures: Array<{ code: string; name: string }> = [];
      const nameMap: Record<string, string> = {};
      selectedFunds.forEach((f) => {
        nameMap[f.code] = f.name;
      });
      const codesToAdd = selectedCodes.filter(
        (c) => !funds.some((f) => f.code === c),
      );
      const results = await Promise.allSettled(
        codesToAdd.map((c) => fetchFundData(c)),
      );

      results.forEach((result, idx) => {
        const c = codesToAdd[idx];
        if (!c) return;
        if (result.status === "fulfilled") {
          newFunds.push(result.value);
        } else {
          const name = nameMap[c];
          if (name) failures.push({ code: c, name });
        }
      });
      if (newFunds.length === 0) {
        setError(t("realtimeFund.noNewFund"));
      } else {
        const next = dedupeByCode([...newFunds, ...funds]);
        setFunds(next);
        localStorage.setItem("funds", JSON.stringify(next));
        newFunds.forEach((f) => fetchNavHistory(f.code));
      }
      setSearchTerm("");
      setSelectedFunds([]);
      setShowDropdown(false);
      if (failures.length > 0) {
        setAddFailures(failures);
        setAddResultOpen(true);
      }
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : t("realtimeFund.addFailed");
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const removeFund = (removeCode: string) => {
    const next = funds.filter((f) => f.code !== removeCode);
    setFunds(next);
    localStorage.setItem("funds", JSON.stringify(next));

    const nextGroups = groups.map((g) => ({
      ...g,
      codes: (g.codes || []).filter((c) => c !== removeCode),
    }));
    setGroups(nextGroups);
    localStorage.setItem("groups", JSON.stringify(nextGroups));

    setCollapsedCodes((prev) => {
      if (!prev.has(removeCode)) return prev;
      const nextSet = new Set(prev);
      nextSet.delete(removeCode);
      localStorage.setItem(
        "collapsedCodes",
        JSON.stringify(Array.from(nextSet)),
      );
      return nextSet;
    });

    setFavorites((prev) => {
      if (!prev.has(removeCode)) return prev;
      const nextSet = new Set(prev);
      nextSet.delete(removeCode);
      localStorage.setItem("favorites", JSON.stringify(Array.from(nextSet)));
      if (nextSet.size === 0) setCurrentTab("all");
      return nextSet;
    });

    setHoldings((prev) => {
      if (!prev[removeCode]) return prev;
      const next = { ...prev };
      delete next[removeCode];
      localStorage.setItem("holdings", JSON.stringify(next));
      return next;
    });
  };

  const manualRefresh = async () => {
    if (refreshingRef.current) return;
    const codes = Array.from(new Set(funds.map((f) => f.code)));
    if (!codes.length) return;
    await refreshAll(codes);
  };

  const saveSettings = (ms: number) => {
    setRefreshMs(ms);
    localStorage.setItem("refreshMs", String(ms));
    setSettingsOpen(false);
  };

  const [importMsg, setImportMsg] = useState("");

  const exportLocalData = async () => {
    try {
      const payload = {
        version: 1,
        funds: JSON.parse(localStorage.getItem("funds") || "[]"),
        favorites: JSON.parse(localStorage.getItem("favorites") || "[]"),
        groups: JSON.parse(localStorage.getItem("groups") || "[]"),
        collapsedCodes: JSON.parse(
          localStorage.getItem("collapsedCodes") || "[]",
        ),
        refreshMs: parseInt(localStorage.getItem("refreshMs") || "30000", 10),
        viewMode: localStorage.getItem("viewMode") || "card",
        holdings: JSON.parse(localStorage.getItem("holdings") || "{}"),
        exportedAt: new Date().toISOString(),
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: "application/json",
      });
      const showSaveFilePicker =
        window.showSaveFilePicker as unknown as (options?: {
          suggestedName?: string;
          types?: Array<{
            description: string;
            accept: Record<string, string[]>;
          }>;
        }) => Promise<{
          createWritable: () => Promise<{
            write: (blob: Blob) => Promise<void>;
            close: () => Promise<void>;
          }>;
        }>;
      if (showSaveFilePicker) {
        const handle = await showSaveFilePicker({
          suggestedName: `realtime-fund-config-${Date.now()}.json`,
          types: [
            { description: "JSON", accept: { "application/json": [".json"] } },
          ],
        });
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        setSuccessModal({
          open: true,
          message: t("realtimeFund.exportSuccess"),
        });
        setSettingsOpen(false);
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `realtime-fund-config-${Date.now()}.json`;
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        URL.revokeObjectURL(url);
        setSuccessModal({
          open: true,
          message: t("realtimeFund.exportSuccess"),
        });
        setSettingsOpen(false);
      };
      const onVisibility = () => {
        if (document.visibilityState === "hidden") return;
        finish();
        document.removeEventListener("visibilitychange", onVisibility);
      };
      document.addEventListener("visibilitychange", onVisibility, {
        once: true,
      });
      a.click();
      setTimeout(finish, 3000);
    } catch (err) {
      console.error("Export error:", err);
    }
  };

  const handleImportFile = async (file: File | null | undefined) => {
    try {
      if (!file) return;
      const text = await file.text();
      const data = JSON.parse(text);
      if (data && typeof data === "object") {
        const currentFunds: FundData[] = JSON.parse(
          localStorage.getItem("funds") || "[]",
        );
        const currentFavorites = JSON.parse(
          localStorage.getItem("favorites") || "[]",
        ) as string[];
        const currentGroups: Group[] = JSON.parse(
          localStorage.getItem("groups") || "[]",
        );
        const currentCollapsed = JSON.parse(
          localStorage.getItem("collapsedCodes") || "[]",
        );

        let mergedFunds = currentFunds;
        let appendedCodes = [];

        if (Array.isArray(data.funds)) {
          const incomingFunds = dedupeByCode(data.funds);
          const existingCodes = new Set(currentFunds.map((f) => f.code));
          const newItems = incomingFunds.filter(
            (f) => f && f.code && !existingCodes.has(f.code),
          );
          appendedCodes = newItems.map((f) => f.code);
          mergedFunds = [...currentFunds, ...newItems];
          setFunds(mergedFunds);
          localStorage.setItem("funds", JSON.stringify(mergedFunds));
        }

        if (Array.isArray(data.favorites)) {
          const mergedFav = Array.from(
            new Set([...currentFavorites, ...data.favorites]),
          );
          setFavorites(new Set(mergedFav));
          localStorage.setItem("favorites", JSON.stringify(mergedFav));
        }

        if (Array.isArray(data.groups)) {
          const mergedGroups = [...currentGroups];
          data.groups.forEach((incomingGroup: Group) => {
            const existingIdx = mergedGroups.findIndex(
              (g) => g.id === incomingGroup.id,
            );
            if (existingIdx > -1) {
              mergedGroups[existingIdx] = {
                ...mergedGroups[existingIdx],
                codes: Array.from(
                  new Set([
                    ...(mergedGroups[existingIdx].codes || []),
                    ...(incomingGroup.codes || []),
                  ]),
                ),
              };
            } else {
              mergedGroups.push(incomingGroup);
            }
          });
          setGroups(mergedGroups);
          localStorage.setItem("groups", JSON.stringify(mergedGroups));
        }

        if (Array.isArray(data.collapsedCodes)) {
          const mergedCollapsed = Array.from(
            new Set([...currentCollapsed, ...data.collapsedCodes]),
          );
          setCollapsedCodes(new Set(mergedCollapsed));
          localStorage.setItem(
            "collapsedCodes",
            JSON.stringify(mergedCollapsed),
          );
        }

        if (typeof data.refreshMs === "number" && data.refreshMs >= 5000) {
          setRefreshMs(data.refreshMs);
          localStorage.setItem("refreshMs", String(data.refreshMs));
        }
        if (data.viewMode === "card" || data.viewMode === "list") {
          setViewMode(data.viewMode);
          localStorage.setItem("viewMode", data.viewMode);
        }

        if (data.holdings && typeof data.holdings === "object") {
          const mergedHoldings = {
            ...JSON.parse(localStorage.getItem("holdings") || "{}"),
            ...data.holdings,
          };
          setHoldings(mergedHoldings);
          localStorage.setItem("holdings", JSON.stringify(mergedHoldings));
        }

        if (appendedCodes.length) {
          const allCodes = mergedFunds.map((f) => f.code);
          await refreshAll(allCodes);
        }

        setSuccessModal({
          open: true,
          message: t("realtimeFund.importSuccess"),
        });
        setSettingsOpen(false);
      }
    } catch (err) {
      console.error("Import error:", err);
      setImportMsg(t("realtimeFund.importFailed"));
      setTimeout(() => setImportMsg(""), 4000);
    }
  };

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
      donateOpen;

    if (isAnyModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
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
  ]);

  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === "Escape" && settingsOpen) setSettingsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [settingsOpen]);

  const getGroupName = () => {
    if (currentTab === "all") return t("realtimeFund.tabAll");
    if (currentTab === "fav") return t("realtimeFund.tabFavorite");
    const group = groups.find((g) => g.id === currentTab);
    return group
      ? t("realtimeFund.tabGroupAssets", { name: group.name })
      : t("realtimeFund.tabGroupDefault");
  };

  return (
    <div className="rf-wrapper">
      <div className="container content">
        <Announcement />
      </div>
      <div className="navbar">
        <div className="brand">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="var(--primary)"
                strokeWidth="2"
              />
              <path
                d="M5 14c2-4 7-6 14-5"
                stroke="var(--primary)"
                strokeWidth="2"
              />
            </svg>
            <span>{t("realtimeFund.brandName")}</span>
          </Link>
        </div>
        <div className="actions">
          <div className="badge">
            <span>{t("realtimeFund.refreshLabel")}</span>
            <strong>
              {t("realtimeFund.refreshInterval", {
                seconds: Math.round(refreshMs / 1000),
              })}
            </strong>
          </div>
          <button
            className="icon-button"
            aria-label={t("realtimeFund.refreshNow")}
            onClick={manualRefresh}
            disabled={refreshing || funds.length === 0}
            aria-busy={refreshing}
            title={t("realtimeFund.refreshNow")}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 12a8 8 0 0 1 12.5-6.9" />
              <path d="M16 5h3v3" />
              <path d="M20 12a8 8 0 0 1-12.5 6.9" />
              <path d="M8 19H5v-3" />
            </svg>
          </button>
          <button
            className="icon-button"
            aria-label={t("realtimeFund.openSettings")}
            onClick={() => setSettingsOpen(true)}
            title={t("realtimeFund.settings")}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="container">
        <MarketBar indices={marketIndices} />
      </div>

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
            onViewModeChange={(mode: string) => {
              setViewMode(mode);
              localStorage.setItem("viewMode", mode);
            }}
            sortBy={sortBy}
            onSortByChange={setSortBy}
          />

          {displayFunds.length === 0 ? (
            <div
              className="glass card empty"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "60px 20px",
              }}
            >
              <div style={{ fontSize: "48px", marginBottom: 16, opacity: 0.5 }}>
                📂
              </div>
              <div className="muted" style={{ marginBottom: 20 }}>
                {funds.length === 0
                  ? t("realtimeFund.noFundsYet")
                  : t("realtimeFund.noDataInGroup")}
              </div>
              {currentTab !== "all" &&
                currentTab !== "fav" &&
                funds.length > 0 && (
                  <button
                    className="button"
                    onClick={() => setAddFundToGroupOpen(true)}
                  >
                    {t("realtimeFund.addFundToGroup")}
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

              {currentTab !== "all" && currentTab !== "fav" && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="button-dashed"
                  onClick={() => setAddFundToGroupOpen(true)}
                  style={{
                    width: "100%",
                    height: "48px",
                    border: "2px dashed rgba(0,0,0,0.06)",
                    background: "transparent",
                    borderRadius: "12px",
                    color: "var(--muted)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    marginBottom: "16px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--primary)";
                    e.currentTarget.style.color = "var(--primary)";
                    e.currentTarget.style.background = "rgba(255,136,0,0.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(0,0,0,0.06)";
                    e.currentTarget.style.color = "var(--muted)";
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <PlusIcon width="18" height="18" />
                  <span>{t("realtimeFund.addFundToGroup")}</span>
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
                onOpenHoldingModal={(fund: FundData) =>
                  setHoldingModal({ open: true, fund })
                }
                onOpenActionModal={(fund: FundData) =>
                  setActionModal({ open: true, fund })
                }
                percentModes={percentModes}
                onTogglePercentMode={(code: string) =>
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
        <p style={{ marginBottom: 8 }}>{t("realtimeFund.footerDisclaimer")}</p>
        <p style={{ marginBottom: 12 }}>{t("realtimeFund.footerNote")}</p>
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
        {feedbackOpen && (
          <FeedbackModal
            key={feedbackNonce}
            onClose={() => setFeedbackOpen(false)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {addResultOpen && (
          <AddResultModal
            failures={addFailures}
            onClose={() => setAddResultOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {addFundToGroupOpen && (
          <AddFundToGroupModal
            allFunds={funds}
            currentGroupCodes={
              groups.find((g) => g.id === currentTab)?.codes || []
            }
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
            onAction={(type: string) => handleAction(type, actionModal.fund)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {tradeModal.open && tradeModal.fund ? (
          <TradeModal
            type={tradeModal.type}
            fund={tradeModal.fund}
            onClose={() =>
              setTradeModal({ open: false, fund: null, type: "buy" })
            }
            onConfirm={(data: {
              share: number;
              price?: number;
              totalCost?: number;
            }) => handleTrade(tradeModal.fund!, data)}
          />
        ) : null}
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
        {holdingModal.open && holdingModal.fund?.code ? (
          <HoldingEditModal
            fund={holdingModal.fund}
            holding={holdings[holdingModal.fund.code]}
            onClose={() => setHoldingModal({ open: false, fund: null })}
            onSave={(data: { share: number | null; cost: number | null }) =>
              handleSaveHolding(holdingModal.fund!.code, data)
            }
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {donateOpen && (
          <DonateModal
            isOpen={donateOpen}
            onClose={() => setDonateOpen(false)}
          />
        )}
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
        {groupModalOpen && (
          <GroupModal
            onClose={() => setGroupModalOpen(false)}
            onConfirm={handleAddGroup}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {successModal.open && (
          <SuccessModal
            message={successModal.message}
            onClose={() => setSuccessModal({ open: false, message: "" })}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
