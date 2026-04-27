"use client";

import { useEffect, useRef } from "react";

interface TradingViewChartProps {
  symbol: string;
  resolution?: string;
  onSymbolChange?: (info: {
    symbol: string;
    description?: string;
    exchange?: string;
  }) => void;
}

export default function TradingViewChart({
  symbol,
  resolution = "1D",
  onSymbolChange,
}: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);
  const scriptLoadedRef = useRef(false);

  // Initialize chart
  useEffect(() => {
    if (!containerRef.current) return;

    const initChart = () => {
      if (!window.TradingView?.widget || !containerRef.current) {
        console.error("TradingView widget not found or container is null");
        return;
      }

      // Use any type to bypass TypeScript strict checking
      const widgetOptions: any = {
        container: containerRef.current,
        autosize: true,
        symbol: symbol,
        interval: resolution,
        datafeed: {
          onReady: (callback: any) => {
            callback({
              supported_resolutions: [
                "1",
                "5",
                "15",
                "30",
                "60",
                "240",
                "1D",
                "1W",
                "1M",
              ],
              supports_group_request: false,
              supports_marks: false,
              supports_search: true,
              supports_time: true,
              supports_timescale_marks: false,
            });
          },
          searchSymbols: (
            userInput: string,
            exchange: string,
            symbolType: string,
            onResult: any,
          ) => {
            fetch(`/api/udf/search?query=${userInput}&limit=10`)
              .then((response) => response.json())
              .then((data) => {
                onResult(
                  data.map((item: any) => ({
                    symbol: item.symbol || item.name,
                    full_name: item.full_name || item.symbol || item.name,
                    description: item.description || item.symbol || item.name,
                    exchange: item.exchange || "",
                    ticker: item.ticker || item.symbol || item.name,
                    type: item.type || "stock",
                  })),
                );
              })
              .catch(() => onResult([]));
          },
          resolveSymbol: (symbolName: string, onResolve: any, onError: any) => {
            fetch(`/api/udf/symbols?symbol=${symbolName}`)
              .then((response) => response.json())
              .then((data) => {
                onResolve({
                  name: data.name || data.symbol,
                  ticker: data.name || data.symbol || data.ticker,
                  full_name: data.full_name || data.symbol || data.name,
                  description: data.description || data.symbol || data.name,
                  type: data.type || "stock",
                  session: data.session || "24x7",
                  exchange: data.exchange || "",
                  listed_exchange: data.exchange || "",
                  timezone: data.timezone || "Etc/UTC",
                  minmov: data.minmov ?? 1,
                  pricescale: data.pricescale ?? 100,
                  format: "price",
                  has_intraday: data.has_intraday !== false,
                  has_daily: data.has_daily !== false,
                  has_weekly_and_monthly: data.has_weekly_and_monthly !== false,
                  has_no_volume: false,
                  supported_resolutions: [
                    "1",
                    "5",
                    "15",
                    "30",
                    "60",
                    "240",
                    "1D",
                    "1W",
                    "1M",
                  ],
                });
              })
              .catch(() => onError("Cannot resolve symbol"));
          },
          getBars: (
            symbolInfo: any,
            resolution: string,
            periodParams: any,
            onResult: any,
            onError: any,
          ) => {
            const { from, to, countBack } = periodParams;
            const url = new URL("/api/udf/history", window.location.origin);
            url.searchParams.set(
              "symbol",
              symbolInfo.name || symbolInfo.symbol,
            );
            url.searchParams.set("resolution", resolution);
            url.searchParams.set("from", String(from));
            url.searchParams.set("to", String(to));
            if (countBack) {
              url.searchParams.set("countback", String(countBack));
            }

            fetch(url.toString())
              .then((response) => response.json())
              .then((data) => {
                if (data.s === "no_data") {
                  onResult([], { noData: true });
                  return;
                }

                if (data.s === "error") {
                  onError(data.errmsg);
                  return;
                }

                const bars = data.t.map((time: number, i: number) => ({
                  time: time * 1000,
                  open: data.o[i],
                  high: data.h[i],
                  low: data.l[i],
                  close: data.c[i],
                  volume: data.v[i],
                }));

                onResult(bars, { noData: false });
              })
              .catch(() => onError("Failed to fetch history"));
          },
          subscribeBars: () => {},
          unsubscribeBars: () => {},
          getServerTime: (callback: any) => {
            callback(Math.floor(Date.now() / 1000));
          },
        },
        library_path: "/charting_library/",
        locale: "zh",
        timezone: "Etc/UTC",
        theme: "dark",
        hide_top_toolbar: false,
        hide_legend: false,
        withdateranges: true,
        allow_symbol_change: true,
        disabled_features: [
          "header_compare",
          "header_screenshot",
          "header_undo_redo",
          "display_market_status",
          "study_templates",
        ],
        enabled_features: [],
        overrides: {
          "paneProperties.background": "#0a0a0a",
          "paneProperties.vertGridProperties.color": "#1f2937",
          "paneProperties.horzGridProperties.color": "#1f2937",
          "scalesProperties.textColor": "#9ca3af",
          "mainSeriesProperties.candleStyle.upColor": "#22c55e",
          "mainSeriesProperties.candleStyle.downColor": "#ef4444",
          "mainSeriesProperties.candleStyle.wickUpColor": "#22c55e",
          "mainSeriesProperties.candleStyle.wickDownColor": "#ef4444",
          "mainSeriesProperties.candleStyle.borderUpColor": "#22c55e",
          "mainSeriesProperties.candleStyle.borderDownColor": "#ef4444",
        },
      };

      const widget = new window.TradingView.widget(widgetOptions);
      widgetRef.current = widget;

      // Subscribe to symbol change events if callback provided
      if (onSymbolChange) {
        (widget as any).onChartReady(() => {
          (widget as any).subscribe("onSymbolChange", (event: any) => {
            onSymbolChange({
              symbol: event.symbol || event.ticker || "",
              description: event.description,
              exchange: event.exchange,
            });
          });
        });
      }
    };

    // Check if script is already loaded
    if (window.TradingView?.widget && scriptLoadedRef.current) {
      initChart();
      return;
    }

    // Load TradingView Charting Library
    const script = document.createElement("script");
    script.src = "/charting_library/charting_library.js";
    script.async = true;
    script.onload = () => {
      scriptLoadedRef.current = true;
      initChart();
    };

    document.head.appendChild(script);

    return () => {
      if (widgetRef.current) {
        widgetRef.current.remove();
        widgetRef.current = null;
      }
      if (script.parentNode) {
        script.remove();
      }
    };
  }, []);

  // Update symbol/resolution when they change
  useEffect(() => {
    if (widgetRef.current) {
      try {
        widgetRef.current.setSymbol(symbol, resolution, () => {});
      } catch (error) {
        console.error("Failed to set symbol:", error);
      }
    }
  }, [symbol, resolution]);

  return (
    <div
      ref={containerRef}
      className="tv-chart-container"
      style={{ width: "100%", height: "100%" }}
    />
  );
}
