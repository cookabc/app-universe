import type { SkillData } from "../../data/skills";

interface Props {
  skill: SkillData;
}

export default function SkillPreview({ skill }: Props) {
  const id = skill.id;

  if (id === "app-icon-minimalist") return <AppIconPreview />;
  if (id === "blueprinter") return <BlueprintPreview />;
  if (id === "design-system") return <DesignSystemPreview />;
  if (id === "editorial-card-screenshot") return <EditorialCardPreview />;
  if (id === "infographic-creation") return <InfographicPreview />;

  return null;
}

/* ──────────────────────────────────────
   1. App Icon Minimalist — 极简应用图标
   ────────────────────────────────────── */
function AppIconPreview() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
        padding: "32px 24px",
        background: "var(--ivory)",
        borderRadius: "12px",
        border: "0.5px solid var(--border-cream)",
      }}
    >
      {/* Icon grid */}
      <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", justifyContent: "center" }}>
        {[
          {
            bg: "#1B365D",
            shape: (
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                <rect width="56" height="56" rx="14" fill="#1B365D" />
                <path
                  d="M18 18h8v8h-8zM30 18h8v8h-8zM18 30h8v8h-8z"
                  fill="white"
                  opacity={0.9}
                />
                <rect x="30" y="30" width="8" height="8" rx="2" fill="white" opacity={0.5} />
              </svg>
            ),
          },
          {
            bg: "#E74C3C",
            shape: (
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                <circle cx="28" cy="28" r="28" fill="#E74C3C" />
                <path d="M20 28c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="white" strokeWidth="4" strokeLinecap="round" />
                <circle cx="36" cy="38" r="2.5" fill="white" />
              </svg>
            ),
          },
          {
            bg: "#27AE60",
            shape: (
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                <rect width="56" height="56" rx="16" fill="#27AE60" />
                <path d="M16 32l8 8 16-16" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ),
          },
          {
            bg: "#F39C12",
            shape: (
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                <rect width="56" height="56" rx="14" fill="#F39C12" />
                <circle cx="28" cy="22" r="7" fill="white" opacity={0.9} />
                <path d="M17 40c0-6 5-11 11-11s11 5 11 11" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" />
              </svg>
            ),
          },
        ].map((icon, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div
              style={{
                borderRadius: "14px",
                boxShadow: "var(--shadow-whisper)",
                transition: "transform .15s ease",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1.05)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1)")}
            >
              {icon.shape}
            </div>
            <span
              style={{
                fontSize: "10px",
                color: "var(--stone)",
                fontFamily: "var(--font-mono)",
              }}
            >
              1024×1024
            </span>
          </div>
        ))}
      </div>

      <div
        style={{
          fontSize: "11px",
          color: "var(--olive)",
          fontFamily: "var(--font-serif)",
          textAlign: "center",
          maxWidth: "40ch",
          lineHeight: 1.45,
          borderLeft: "2px solid var(--brand)",
          paddingLeft: "10px",
        }}
      >
        Minimalist icons generated from natural language prompts.
        No design tools needed.
      </div>
    </div>
  );
}

/* ──────────────────────────────────────
   2. Blueprinter — 技术蓝图
   ────────────────────────────────────── */
function BlueprintPreview() {
  return (
    <div
      style={{
        padding: "28px",
        background: "#fafafa",
        borderRadius: "8px",
        border: "1px solid #ddd",
        fontFamily: "var(--font-mono)",
        fontSize: "11px",
        color: "#333",
      }}
    >
      {/* Title block */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          borderBottom: "2px solid #1B365D",
          paddingBottom: "10px",
          marginBottom: "16px",
        }}
      >
        <span style={{ fontWeight: 600, color: "#1B365D", fontSize: "13px", fontFamily: "var(--font-serif)" }}>
          SYSTEM ARCHITECTURE
        </span>
        <span style={{ color: "#999", fontSize: "9px" }}>REV 2.1 · 2026-04</span>
      </div>

      {/* Blueprint diagram */}
      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr 180px", gap: "1px", background: "#ccc", border: "1px solid #999" }}>
        {/* Left column */}
        <div style={{ background: "#fff", padding: "14px" }}>
          <div style={{ fontWeight: 600, marginBottom: 10, color: "#1B365D", fontSize: "10px", letterSpacing: "0.5px" }}>MODULES</div>
          {["Client Layer", "API Gateway", "Auth Service", "Data Store"].map((m, i) => (
            <div key={i} style={{ padding: "5px 8px", margin: "2px 0", background: i % 2 ? "#f5f5f5" : "#fff", borderLeft: `2px solid ${i === 0 ? "#1B365D" : "#ccc"}` }}>
              {m}
            </div>
          ))}
        </div>

        {/* Center - connections */}
        <div style={{ background: "#fff", padding: "14px", position: "relative" }}>
          <div style={{ fontWeight: 600, marginBottom: 10, color: "#1B365D", fontSize: "10px", letterSpacing: "0.5px" }}>DATA FLOW</div>
          
          {/* Simplified flow lines using CSS */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[1, 2, 3].map((n) => (
              <div key={n} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "28px", height: "18px", borderRadius: "2px", background: "#E4ECF5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9", color: "#1B365D", fontWeight: 600 }}>
                  REQ
                </div>
                <div style={{ flex: 1, height: "1px", background: "#ddd" }} />
                <div style={{ width: "40px", height: "18px", borderRadius: "2px", background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9", color: "#888" }}>
                  {n}ms
                </div>
              </div>
            ))}
            
            {/* Response arrow */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto", marginRight: "36px" }}>
              <div style={{ width: "36px", height: "18px", borderRadius: "2px", background: "#EEF2F7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9", color: "#1B365D", fontWeight: 600 }}>
                RES
              </div>
              <div style={{ flex: 1, height: "1px", background: "#1B365D", opacity: 0.3 }} />
            </div>
          </div>

          {/* Center annotation */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              padding: "4px 10px",
              background: "#fff",
              border: "1px solid #1B365D",
              borderRadius: "3px",
              fontSize: "9px",
              color: "#1B365D",
              fontWeight: 600,
            }}
          >
            ↕ async
          </div>
        </div>

        {/* Right column */}
        <div style={{ background: "#fff", padding: "14px" }}>
          <div style={{ fontWeight: 600, marginBottom: 10, color: "#1B365D", fontSize: "10px", letterSpacing: "0.5px" }}>SPECS</div>
          {[
            ["Protocol", "HTTP/2"],
            ["Format", "JSON"],
            ["Cache", "Redis"],
            ["Status", "Active"],
          ].map(([k, v], i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "4px 6px", margin: "2px 0", borderBottom: "1px solid #eee", fontSize: "10px" }}>
              <span style={{ color: "#888" }}>{k}</span>
              <span style={{ fontWeight: 500 }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: "12px", borderTop: "1px dashed #ccc", paddingTop: "8px", display: "flex", justifyContent: "space-between", fontSize: "9px", color: "#aaa" }}>
        <span>Generated by blueprinter</span>
        <span>Grid: 1px | No shadows | Monospace only</span>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────
   3. Design System — 设计系统预览
   ────────────────────────────────────── */
function DesignSystemPreview() {
  const systems = [
    {
      name: "Bauhaus",
      colors: ["#E63946", "#F1FAEE", "#A8DADC", "#457B9D", "#1D3557"],
      radius: "0px",
    },
    {
      name: "Kinetic",
      colors: ["#FF006E", "#FB5607", "#FFBE0B", "#8338EC", "#3A86FF"],
      radius: "20px",
    },
    {
      name: "Luxury",
      colors: ["#1A1A2E", "#16213E", "#0F3460", "#E94560", "#F5CB5C"],
      radius: "4px",
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        padding: "24px",
        background: "var(--ivory)",
        borderRadius: "12px",
        border: "0.5px solid var(--border-cream)",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontFamily: "var(--font-serif)", fontSize: "14px", fontWeight: 500, color: "var(--text-primary)" }}>
          Design System Tokens
        </span>
        <span style={{ fontSize: "10px", color: "var(--stone)", fontFamily: "var(--font-mono)" }}>3 of 11 systems</span>
      </div>

      {/* System cards */}
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        {systems.map((sys, i) => (
          <div
            key={i}
            style={{
              flex: "1 1 160px",
              padding: "16px",
              borderRadius: sys.radius as string,
              background: "white",
              border: "0.5px solid var(--border-cream)",
              boxShadow: "var(--shadow-whisper)",
            }}
          >
            {/* Name + radius badge */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span style={{ fontFamily: "var(--font-serif)", fontSize: "13px", fontWeight: 500, color: "var(--text-primary)" }}>
                {sys.name}
              </span>
              <span style={{ fontSize: "9px", color: "var(--olive)", fontFamily: "var(--font-mono)", padding: "2px 6px", background: "var(--tag-bg-light)", borderRadius: "2px" }}>
                r:{sys.radius}
              </span>
            </div>

            {/* Color swatches */}
            <div style={{ display: "flex", gap: "4px", marginBottom: "12px" }}>
              {sys.colors.map((color, j) => (
                <div
                  key={j}
                  style={{
                    width: "100%",
                    aspectRatio: "1",
                    borderRadius: sys.radius === "0px" ? "0px" : "50%",
                    background: color,
                    boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.08)",
                  }}
                  title={color}
                />
              ))}
            </div>

            {/* Token preview */}
            <div
              style={{
                padding: "10px 12px",
                borderRadius: sys.radius as string,
                background: sys.colors[0] || "#333",
                color: sys.colors[4] || "#fff",
                fontSize: "11px",
                fontFamily: "var(--font-mono)",
              }}
            >
              --primary: {sys.colors[0]}
              <br />
              --accent: {sys.colors[2]}
            </div>
          </div>
        ))}
      </div>

      {/* CSS output hint */}
      <div
        style={{
          fontSize: "10px",
          color: "var(--olive)",
          fontFamily: "var(--font-mono)",
          padding: "8px 12px",
          background: "white",
          borderRadius: "4px",
          border: "0.5px solid var(--border-cream)",
        }}
      >
        → Exports: CSS variables · Tailwind config · JSON tokens
      </div>
    </div>
  );
}

/* ──────────────────────────────────────
   4. Editorial Card Screenshot — 编辑信息卡
   ────────────────────────────────────── */
function EditorialCardPreview() {
  return (
    <div
      style={{
        maxWidth: "480px",
        background: "white",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "var(--shadow-whisper)",
        border: "0.5px solid var(--border-cream)",
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {/* Card header bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 16px",
          background: "#f8f8f6",
          borderBottom: "0.5px solid var(--border-cream)",
          fontSize: "9px",
          color: "var(--stone)",
          fontFamily: "var(--font-mono)",
        }}
      >
        <span>EDITORIAL CARD v2</span>
        <span>680 × 340</span>
      </div>

      {/* Card body - Swiss International Style */}
      <div style={{ padding: "24px 28px 20px" }}>
        {/* Eyebrow */}
        <div
          style={{
            fontSize: "9px",
            fontWeight: 600,
            color: "#1B365D",
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            marginBottom: "10px",
            fontFamily: "var(--font-sans)",
          }}
        >
          Design System · Q1 2026
        </div>

        {/* Headline */}
        <h3
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "22px",
            fontWeight: 500,
            lineHeight: 1.15,
            color: "var(--text-primary)",
            marginBottom: "6px",
            textWrap: "balance",
          }}
        >
          Building Design Tokens That Scale Across 11 Themes
        </h3>

        {/* Subheadline / deck */}
        <p
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "13px",
            lineHeight: 1.50,
            color: "var(--charcoal)",
            marginBottom: "18px",
            textWrap: "pretty",
            paddingLeft: "12px",
            borderLeft: "2px solid #1B365D",
          }}
        >
          A unified approach to color, spacing, and typography that maintains editorial rhythm at any viewport.
        </p>

        {/* Metrics row */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            marginBottom: "18px",
            paddingBottom: "16px",
            borderBottom: "2px double var(--border-warm)",
          }}
        >
          {[
            ["11", "Themes"],
            ["240+", "Tokens"],
            ["99.8%", "Coverage"],
          ].map(([value, label], i) => (
            <div key={i}>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: "20px", fontWeight: 500, color: "#1B365D", lineHeight: 1.15 }}>
                {value}
              </div>
              <div style={{ fontSize: "9px", color: "var(--stone)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Key points - dash list */}
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
          {[
            "Warm parchment canvas with ink-blue accent",
            "Serif headlines at weight 500, never bold",
            "Three line-height bands: tight / dense / reading",
            "Solid hex tags for print compatibility",
          ].map((item, i) => (
            <li
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "8px",
                fontSize: "11px",
                lineHeight: 1.45,
                color: "var(--charcoal)",
                fontFamily: "var(--font-sans)",
              }}
            >
              <span style={{ color: "#1B365D", flexShrink: 0 }}>—</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Card footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 20px",
          background: "var(--ivory)",
          borderTop: "0.5px solid var(--border-cream)",
          fontSize: "9px",
          color: "var(--stone)",
        }}
      >
        <span style={{ fontFamily: "var(--font-mono)" }}>Swiss International Style</span>
        <span>High density · 65ch max</span>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────
   5. Infographic Creation — 信息图表
   ────────────────────────────────────── */
function InfographicPreview() {
  return (
    <div
      style={{
        maxWidth: "520px",
        padding: "24px",
        background: "linear-gradient(135deg, #f5f4ed 0%, #eef2f7 100%)",
        borderRadius: "12px",
        border: "0.5px solid var(--border-cream)",
        boxShadow: "var(--shadow-whisper)",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <div
          style={{
            display: "inline-block",
            padding: "4px 14px",
            borderRadius: "20px",
            background: "#1B365D",
            color: "white",
            fontSize: "10px",
            fontWeight: 600,
            letterSpacing: "0.5px",
            fontFamily: "var(--font-sans)",
            marginBottom: "10px",
          }}
        >
          📊 INFOGRAPHIC PREVIEW
        </div>
        <h3
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "20px",
            fontWeight: 500,
            color: "var(--text-primary)",
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          The State of AI Skills in 2026
        </h3>
      </div>

      {/* Chart area - Bar chart simulation */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          padding: "0 8px",
        }}
      >
        {[
          { label: "Visual Design", value: 92, color: "#1B365D" },
          { label: "Code Generation", value: 78, color: "#2D5A8A" },
          { label: "Documentation", value: 85, color: "#457B9D" },
          { label: "Testing", value: 64, color: "#A8DADC" },
          { label: "Deployment", value: 71, color: "#E94560" },
        ].map((bar, i) => (
          <div key={i}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
              <span style={{ fontSize: "11px", fontWeight: 500, color: "var(--text-primary)", fontFamily: "var(--font-sans)" }}>
                {bar.label}
              </span>
              <span style={{ fontSize: "11px", fontWeight: 600, color: bar.color, fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums" }}>
                {bar.value}%
              </span>
            </div>
            <div
              style={{
                height: "8px",
                borderRadius: "4px",
                background: "var(--tag-bg-light)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${bar.value}%`,
                  borderRadius: "4px",
                  background: bar.color,
                  transition: "width .6s ease",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Stats row */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginTop: "20px",
          paddingTop: "16px",
          borderTop: "0.5px dashed var(--border-warm)",
        }}
      >
        {[
          ["5", "Skills", "📄"],
          ["19", "Categories", "🏷️"],
          ["2026", "Year", "📅"],
        ].map(([v, l, icon], i) => (
          <div
            key={i}
            style={{
              textAlign: "center",
              padding: "8px 14px",
              borderRadius: "6px",
              background: "white",
              border: "0.5px solid var(--border-cream)",
            }}
          >
            <div style={{ fontSize: "16px", marginBottom: "2px" }}>{icon}</div>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: "18px", fontWeight: 500, color: "#1B365D", lineHeight: 1.15 }}>
              {v}
            </div>
            <div style={{ fontSize: "9px", color: "var(--stone)", textTransform: "uppercase" }}>
              {l}
            </div>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <div
        style={{
          textAlign: "center",
          marginTop: "14px",
          fontSize: "9px",
          color: "var(--olive)",
          fontFamily: "var(--font-sans)",
        }}
      >
        Generated by AntV Infographic · Data-driven visual storytelling
      </div>
    </div>
  );
}
