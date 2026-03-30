export default function HoldingsContribution({ holdings }) {
  if (!Array.isArray(holdings) || !holdings.length) return null;
  const contributions = holdings
    .filter((h) => typeof h.change === "number" && h.weight)
    .map((h) => {
      const w = parseFloat(h.weight) || 0;
      return {
        name: h.name,
        contribution: (h.change * w) / 100,
        change: h.change,
        weight: w,
      };
    })
    .sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));
  if (!contributions.length) return null;
  const maxAbs =
    Math.max(...contributions.map((c) => Math.abs(c.contribution))) || 1;
  return (
    <div style={{ marginTop: 4, marginBottom: 8 }}>
      <div className="muted" style={{ fontSize: "11px", marginBottom: 6 }}>
        持仓贡献度
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {contributions.slice(0, 5).map((c, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: "12px",
            }}
          >
            <span
              style={{
                width: 56,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {c.name}
            </span>
            <div
              style={{
                flex: 1,
                height: 4,
                background: "rgba(0,0,0,0.04)",
                borderRadius: 2,
                overflow: "hidden",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: c.contribution >= 0 ? "50%" : undefined,
                  right: c.contribution < 0 ? "50%" : undefined,
                  width: `${(Math.abs(c.contribution) / maxAbs) * 50}%`,
                  height: "100%",
                  background:
                    c.contribution > 0 ? "var(--danger)" : "var(--success)",
                  borderRadius: 2,
                }}
              />
            </div>
            <span
              className={
                c.contribution > 0 ? "up" : c.contribution < 0 ? "down" : ""
              }
              style={{
                width: 48,
                textAlign: "right",
                flexShrink: 0,
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
              }}
            >
              {c.contribution > 0 ? "+" : ""}
              {c.contribution.toFixed(3)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
