import { TrendingUp, TrendingDown } from "lucide-react";

export default function MarketBar({ indices }) {
  if (!indices || indices.length === 0) return null;

  return (
    <div className="market-index-grid">
      {indices.map((idx, i) => {
        const isUp = idx.change > 0;
        const isDown = idx.change < 0;
        const accentColor = isUp ? "#22c55e" : isDown ? "#ef4444" : "#94a3b8";

        return (
          <div
            key={i}
            className="relative overflow-hidden rounded-lg bg-card border-2 border-slate-800 shadow-[var(--box-shadow)] p-4 hover:-translate-x-0.5 hover:-translate-y-0.5 transition-transform group"
            style={{ borderLeftColor: accentColor, borderLeftWidth: 4 }}
          >
            {/* Background icon */}
            <div
              className={`absolute -right-3 -bottom-3 opacity-5 transition-opacity group-hover:opacity-10 ${isUp ? "text-green-500" : "text-red-500"}`}
            >
              {isUp ? (
                <TrendingUp className="w-20 h-20" />
              ) : (
                <TrendingDown className="w-20 h-20" />
              )}
            </div>

            <div className="relative z-10 min-w-0">
              {/* Index Name */}
              <p className="text-xs font-semibold text-muted-foreground mb-2 truncate">
                {idx.name}
              </p>
              {/* Price - full value, no truncation */}
              <p className="text-xl font-black font-mono tracking-tight text-foreground leading-none mb-1.5">
                {typeof idx.price === "number"
                  ? idx.price.toLocaleString("zh-CN")
                  : String(idx.price)
                      .replace(/\..+$/, "")
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </p>
              {/* Change badge */}
              <span
                className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: `${accentColor}20`,
                  color: accentColor,
                }}
              >
                {isUp ? (
                  <TrendingUp className="w-3 h-3" />
                ) : isDown ? (
                  <TrendingDown className="w-3 h-3" />
                ) : null}
                {idx.change > 0 ? "+" : ""}
                {idx.change}%
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
