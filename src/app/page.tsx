"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import TradingViewChart from "@/components/TradingViewChart";
import PortfolioSidebar from "@/components/PortfolioSidebar";

interface TreeNode {
  dentryId: number;
  inodeId: number;
  parentId: number | null;
  name: string;
  type: "folder" | "stock" | "markdown";
  symbol?: string;
  ticker?: string;
  description?: string;
  exchange?: string;
  stockType?: string;
  children?: TreeNode[];
}

const desktopBreakpoint = 1200;
const splitterWidth = 12;
const defaultPanelWidths = { left: 332, right: 368 };
const minLeftPanelWidth = 260;
const minCenterPanelWidth = 520;
const minRightPanelWidth = 300;

const timeframes = [
  { label: "1分", resolution: "1" },
  { label: "5分", resolution: "5" },
  { label: "15分", resolution: "15" },
  { label: "30分", resolution: "30" },
  { label: "1小时", resolution: "60" },
  { label: "4小时", resolution: "240" },
  { label: "日K", resolution: "1D" },
  { label: "周K", resolution: "1W" },
  { label: "月K", resolution: "1M" },
];

function formatPercent(value: number | null): string {
  if (value === null || !Number.isFinite(value)) return "--";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

function getTrendClass(value: number | null): string {
  return value !== null && Number.isFinite(value) && value < 0 ? "down" : "up";
}

function getShortSymbol(item: TreeNode | null): string {
  if (!item) return "AAPL";
  const ticker = item.ticker || item.symbol || "";
  return ticker.split(":").pop()?.split(".")[0] || ticker || "--";
}

function inferMarketLabel(item: TreeNode | null): string {
  if (!item) return "美股";
  const type = item.stockType || "";
  const symbol = item.symbol || "";
  if (type === "stocks-us" || type === "stocks_us" || symbol.endsWith(".US"))
    return "美股";
  if (type === "stocks-hk" || type === "stocks_hk" || symbol.endsWith(".HK"))
    return "港股";
  if (
    type === "stocks-cn" ||
    type === "stocks_cn" ||
    symbol.endsWith(".SH") ||
    symbol.endsWith(".SZ") ||
    symbol.endsWith(".SS")
  )
    return "A股";
  if (type === "crypto" || symbol?.includes("BTC") || symbol?.includes("ETH"))
    return "加密";
  if (type === "fx") return "外汇";
  return "美股";
}

function formatLargeNumber(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return "--";
  const abs = Math.abs(value);
  if (abs >= 1e12) return (value / 1e12).toFixed(2) + " 万亿";
  if (abs >= 1e8) return (value / 1e8).toFixed(2) + " 亿";
  if (abs >= 1e4) return (value / 1e4).toFixed(2) + " 万";
  return String(value);
}

function formatStatValue(value: number | string | null): string {
  if (value == null) return "--";
  const num = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(num)) return String(value);
  const abs = Math.abs(num);
  if (abs >= 100) return num.toFixed(2);
  if (abs >= 1) return num.toFixed(3);
  return num.toFixed(4);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function clampPanelWidths(
  containerWidth: number,
  leftWidth: number,
  rightWidth: number
) {
  const availableWidth = containerWidth - splitterWidth * 2;
  const maxLeftWidth = Math.max(
    minLeftPanelWidth,
    availableWidth - rightWidth - minCenterPanelWidth
  );
  const nextLeftWidth = clamp(leftWidth, minLeftPanelWidth, maxLeftWidth);
  const maxRightWidth = Math.max(
    minRightPanelWidth,
    availableWidth - nextLeftWidth - minCenterPanelWidth
  );
  const nextRightWidth = clamp(rightWidth, minRightPanelWidth, maxRightWidth);
  const finalMaxLeftWidth = Math.max(
    minLeftPanelWidth,
    availableWidth - nextRightWidth - minCenterPanelWidth
  );
  return {
    left: clamp(nextLeftWidth, minLeftPanelWidth, finalMaxLeftWidth),
    right: nextRightWidth,
  };
}

export default function Home() {
  const shellRef = useRef<HTMLElement>(null);
  const dragStateRef = useRef<{
    type: "left" | "right";
    startX: number;
    startLeft: number;
    startRight: number;
  } | null>(null);

  const [panelWidths, setPanelWidths] = useState(defaultPanelWidths);
  const [activeTimeframe, setActiveTimeframe] = useState("日K");
  const [selectedStock, setSelectedStock] = useState<TreeNode | null>(null);

  const [chartSnapshot, setChartSnapshot] = useState({
    status: "loading" as "loading" | "ready" | "error",
    latest: null as { close: number } | null,
    changePercent: null as number | null,
  });

  const [stockInfo, setStockInfo] = useState({
    open: 0,
    high: 0,
    low: 0,
    close: 0,
    volume: 0,
    marketCap: 0,
    pe: 0,
    eps: 0,
  });

  const [indices, setIndices] = useState({
    dow: { symbol: "^DJI", name: "道琼斯", price: 0, change: 0, changePercent: 0 },
    nasdaq: { symbol: "^IXIC", name: "纳斯达克", price: 0, change: 0, changePercent: 0 },
    sp500: { symbol: "^GSPC", name: "标普500", price: 0, change: 0, changePercent: 0 },
  });

  const [clock, setClock] = useState("");

  const activeResolution =
    timeframes.find((item) => item.label === activeTimeframe)?.resolution ?? "1D";
  const activeSymbol = selectedStock?.symbol || "AAPL";
  const activeDescription =
    selectedStock?.description || selectedStock?.name || "Apple Inc.";
  const activeShortSymbol = getShortSymbol(selectedStock);
  const activeExchange = selectedStock?.exchange || "NASDAQ";
  const activeMarketLabel = inferMarketLabel(selectedStock);
  const chartChangeTone = getTrendClass(chartSnapshot.changePercent);

  const shellStyle = {
    "--left-panel-width": `${panelWidths.left}px`,
    "--right-panel-width": `${panelWidths.right}px`,
  } as React.CSSProperties;

  // Clock
  useEffect(() => {
    function updateClock() {
      const now = new Date();
      setClock(
        `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}/${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`
      );
    }
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch stock quote info
  useEffect(() => {
    let cancelled = false;

    async function fetchStockInfo() {
      try {
        const response = await fetch(`/api/quote?symbols=${activeSymbol}`);
        if (!response.ok) return;
        const data = await response.json();
        const quote = data[activeSymbol];
        if (!quote || cancelled) return;

        setStockInfo({
          open: quote.open || 0,
          high: quote.high || 0,
          low: quote.low || 0,
          close: quote.latestPrice || 0,
          volume: quote.volume || 0,
          marketCap: quote.marketCap || 0,
          pe: quote.pe || 0,
          eps: quote.eps || 0,
        });

        setChartSnapshot({
          status: "ready",
          latest: { close: quote.latestPrice || 0 },
          changePercent: quote.changePercent ?? null,
        });
      } catch (error) {
        console.error("Failed to fetch stock info:", error);
      }
    }

    fetchStockInfo();
    const interval = setInterval(fetchStockInfo, 10000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [activeSymbol]);

  // Fetch indices
  useEffect(() => {
    let cancelled = false;

    async function fetchIndices() {
      try {
        const response = await fetch(`/api/quote?symbols=^DJI,^IXIC,^GSPC`);
        if (!response.ok) return;
        const data = await response.json();
        if (cancelled) return;

        setIndices({
          dow: {
            symbol: "^DJI",
            name: "道琼斯",
            price: data["^DJI"]?.latestPrice || 0,
            change: data["^DJI"]?.change || 0,
            changePercent: data["^DJI"]?.changePercent || 0,
          },
          nasdaq: {
            symbol: "^IXIC",
            name: "纳斯达克",
            price: data["^IXIC"]?.latestPrice || 0,
            change: data["^IXIC"]?.change || 0,
            changePercent: data["^IXIC"]?.changePercent || 0,
          },
          sp500: {
            symbol: "^GSPC",
            name: "标普500",
            price: data["^GSPC"]?.latestPrice || 0,
            change: data["^GSPC"]?.change || 0,
            changePercent: data["^GSPC"]?.changePercent || 0,
          },
        });
      } catch (error) {
        console.error("Failed to fetch indices:", error);
      }
    }

    fetchIndices();
    const interval = setInterval(fetchIndices, 15000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  // Panel resize sync
  useEffect(() => {
    function syncPanelWidths() {
      const shell = shellRef.current;
      if (!shell || window.innerWidth <= desktopBreakpoint) return;
      setPanelWidths((current) => {
        const next = clampPanelWidths(
          shell.clientWidth,
          current.left,
          current.right
        );
        return next.left === current.left && next.right === current.right
          ? current
          : next;
      });
    }
    syncPanelWidths();
    window.addEventListener("resize", syncPanelWidths);
    return () => window.removeEventListener("resize", syncPanelWidths);
  }, []);

  // Drag handlers
  useEffect(() => {
    function stopDragging() {
      if (!dragStateRef.current) return;
      dragStateRef.current = null;
      document.body.classList.remove("is-resizing-columns");
    }

    function handlePointerMove(event: PointerEvent) {
      const dragState = dragStateRef.current;
      const shell = shellRef.current;
      if (!dragState || !shell || window.innerWidth <= desktopBreakpoint) return;
      const deltaX = event.clientX - dragState.startX;
      setPanelWidths(() => {
        if (dragState.type === "left") {
          return clampPanelWidths(
            shell.clientWidth,
            dragState.startLeft + deltaX,
            dragState.startRight
          );
        }
        return clampPanelWidths(
          shell.clientWidth,
          dragState.startLeft,
          dragState.startRight - deltaX
        );
      });
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", stopDragging);
    window.addEventListener("pointercancel", stopDragging);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", stopDragging);
      window.removeEventListener("pointercancel", stopDragging);
      document.body.classList.remove("is-resizing-columns");
    };
  }, []);

  function handleResizeStart(type: "left" | "right", event: React.PointerEvent) {
    if (window.innerWidth <= desktopBreakpoint) return;
    event.preventDefault();
    dragStateRef.current = {
      type,
      startX: event.clientX,
      startLeft: panelWidths.left,
      startRight: panelWidths.right,
    };
    document.body.classList.add("is-resizing-columns");
  }

  function resetPanelWidths() {
    const shell = shellRef.current;
    if (!shell) return;
    setPanelWidths(
      clampPanelWidths(
        shell.clientWidth,
        defaultPanelWidths.left,
        defaultPanelWidths.right
      )
    );
  }

  function handleSelectStockNode(node: TreeNode) {
    if (node.type === "stock" && node.symbol) {
      setSelectedStock({
        ...node,
        exchange: node.exchange || "NASDAQ",
        stockType: node.stockType || "",
      });
    }
  }

  function handleChartSymbolChange(info: { symbol: string; description?: string; exchange?: string }) {
    if (!info?.symbol) return;
    if (info.symbol === activeSymbol) return;
    setSelectedStock({
      dentryId: 0,
      inodeId: 0,
      parentId: null,
      name: info.description || info.symbol,
      type: "stock",
      symbol: info.symbol,
      ticker: info.symbol,
      description: info.description || info.symbol,
      exchange: info.exchange || "NASDAQ",
      stockType: "",
    });
  }

  // Mock data toggle
  const [useMockData, setUseMockData] = useState(true);

  function toggleMockData() {
    setUseMockData(prev => !prev);
    // Reload page to apply changes (API routes read env at request time)
    window.location.reload();
  }

  return (
    <main className="terminal-page">
      {/* Mock data toggle badge */}
      <div style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 12px',
        borderRadius: '8px',
        background: useMockData ? 'rgba(245, 158, 11, 0.2)' : 'rgba(34, 197, 94, 0.2)',
        border: `1px solid ${useMockData ? 'rgba(245, 158, 11, 0.4)' : 'rgba(34, 197, 94, 0.4)'}`,
        fontSize: '12px',
        cursor: 'pointer',
        userSelect: 'none',
      }} onClick={toggleMockData} title="点击切换 mock/real 数据">
        <span style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: useMockData ? '#f59e0b' : '#22c55e',
          display: 'inline-block',
        }} />
        <span style={{ color: useMockData ? '#fbbf24' : '#4ade80' }}>
          {useMockData ? 'Mock 数据' : 'Real 数据'}
        </span>
      </div>

      <section ref={shellRef} className="terminal-shell" style={shellStyle}>
        {/* Left Panel - Watchlist */}
        <PortfolioSidebar
          selectedStockDentryId={selectedStock?.dentryId ?? null}
          onSelectStock={handleSelectStockNode}
        />

        {/* Left Splitter */}
        <div
          role="separator"
          tabIndex={0}
          aria-label="调整左侧列宽"
          aria-orientation="vertical"
          className="panel-splitter"
          onDoubleClick={resetPanelWidths}
          onPointerDown={(e) => handleResizeStart("left", e)}
        />

        {/* Center Panel - Chart */}
        <section className="chart-panel">
          <header className="chart-header">
            <div className="symbol-line">
              <strong>{activeShortSymbol}</strong>
              <span className="after-hours">{activeExchange} · UDF</span>
              <span className={chartChangeTone}>
                {formatPercent(chartSnapshot.changePercent)}
              </span>
              <span
                className="chart-subline"
                title={`${activeDescription} · ${activeMarketLabel} · ${activeTimeframe}`}
              >
                {activeDescription} · {activeMarketLabel} · {activeTimeframe}
              </span>
            </div>
          </header>

          <div className="chart-stage">
            <div className="chart-surface">
              <div className="price-chart">
                <TradingViewChart
                  symbol={activeSymbol}
                  resolution={activeResolution}
                  onSymbolChange={handleChartSymbolChange}
                />
              </div>
            </div>
          </div>

          <footer className="chart-footer">
            <div className="timeframes">
              {timeframes.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className={`timeframe ${item.label === activeTimeframe ? "active" : ""}`}
                  onClick={() => setActiveTimeframe(item.label)}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="chart-footnote">
              /api/udf · OHLCV · {activeSymbol}
            </div>
          </footer>
        </section>

        {/* Right Splitter */}
        <div
          role="separator"
          tabIndex={0}
          aria-label="调整右侧列宽"
          aria-orientation="vertical"
          className="panel-splitter"
          onDoubleClick={resetPanelWidths}
          onPointerDown={(e) => handleResizeStart("right", e)}
        />

        {/* Right Panel - Details */}
        <aside className="detail-panel">
          <section className="company-info-card panel-card">
            <header className="company-info-header">
              <div>
                <p className="panel-kicker">股票信息</p>
                <h2>{activeShortSymbol}</h2>
                <span className="company-info-sub">
                  {activeDescription}
                  {activeExchange ? ` · ${activeExchange}` : ""}
                </span>
              </div>
              <span className="market-badge">USD</span>
            </header>
            <div className="company-info-grid">
              <div className="company-info-item">
                <span className="company-info-label">最新价</span>
                <span className="company-info-value">
                  {stockInfo.close ? stockInfo.close.toFixed(2) : "--"}
                </span>
              </div>
              <div className="company-info-item">
                <span className="company-info-label">涨跌幅</span>
                <span className={`company-info-value ${chartChangeTone}`}>
                  {formatPercent(chartSnapshot.changePercent)}
                </span>
              </div>
              <div className="company-info-item">
                <span className="company-info-label">开盘</span>
                <span className="company-info-value">
                  {stockInfo.open ? stockInfo.open.toFixed(2) : "--"}
                </span>
              </div>
              <div className="company-info-item">
                <span className="company-info-label">最高</span>
                <span className="company-info-value">
                  {stockInfo.high ? stockInfo.high.toFixed(2) : "--"}
                </span>
              </div>
              <div className="company-info-item">
                <span className="company-info-label">最低</span>
                <span className="company-info-value">
                  {stockInfo.low ? stockInfo.low.toFixed(2) : "--"}
                </span>
              </div>
              <div className="company-info-item">
                <span className="company-info-label">昨收</span>
                <span className="company-info-value">
                  {stockInfo.close && chartSnapshot.changePercent
                    ? (stockInfo.close * (1 - (chartSnapshot.changePercent / 100))).toFixed(2)
                    : "--"}
                </span>
              </div>
              <div className="company-info-item">
                <span className="company-info-label">成交量</span>
                <span className="company-info-value">
                  {formatLargeNumber(stockInfo.volume)}
                </span>
              </div>
              <div className="company-info-item">
                <span className="company-info-label">市值</span>
                <span className="company-info-value">
                  {formatLargeNumber(stockInfo.marketCap)}
                </span>
              </div>
              <div className="company-info-item">
                <span className="company-info-label">市盈率</span>
                <span className="company-info-value">
                  {formatStatValue(stockInfo.pe)}
                </span>
              </div>
              <div className="company-info-item">
                <span className="company-info-label">每股收益</span>
                <span className="company-info-value">
                  {formatStatValue(stockInfo.eps)}
                </span>
              </div>
            </div>
          </section>
        </aside>
      </section>

      {/* Footer */}
      <footer className="terminal-footer">
        <div className="footer-indexes">
          {Object.values(indices).map((index) => (
            <article key={index.symbol} className="footer-index">
              <span>{index.name}</span>
              <strong>{index.price ? index.price.toFixed(2) : "--"}</strong>
              <em className={getTrendClass(index.changePercent)}>
                {index.change >= 0 ? "+" : ""}
                {index.change ? index.change.toFixed(2) : "0.00"} (
                {formatPercent(index.changePercent)})
              </em>
            </article>
          ))}
        </div>
        <div className="system-clock">{clock}</div>
      </footer>
    </main>
  );
}
