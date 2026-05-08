import type { SkillData } from "../../data/skills";
import { buildSkillShowcaseModel } from "../../utils/skillShowcase";

interface Props {
  skill: SkillData;
}

export default function SkillPreview({ skill }: Props) {
  const id = skill.id;
  const model = buildSkillShowcaseModel(skill);

  if (model.assetUrls.length > 0) return <AssetPreview skill={skill} urls={model.assetUrls} />;

  if (id === "app-icon-minimalist") return <AppIconPreview />;
  if (id === "blueprinter") return <BlueprintPreview />;
  if (id === "design-system") return <DesignSystemPreview />;
  if (id === "editorial-card-screenshot") return <EditorialCardPreview />;

  if (id === "opc-methodology") return <OpcCollectionPreview />;
  if (id === "impeccable-style") return <ImpeccableCollectionPreview />;
  if (id === "markdown-viewer-skills") return <MarkdownViewerCollectionPreview />;
  if (id === "khazix-skills") return <KhazixCollectionPreview />;

  return <GeneratedShowcase skill={skill} />;
}

function AssetPreview({ skill, urls }: { skill: SkillData; urls: string[] }) {
  return (
    <div className="asset-preview-board">
      <div className="asset-preview-header">
        <span>{skill.category.label}</span>
        <strong>{skill.name}</strong>
      </div>
      <div className="asset-preview-grid">
        {urls.slice(0, 6).map((url, index) => (
          <figure key={url} className="asset-preview-tile">
            <img src={url} alt={`${skill.name} example ${index + 1}`} loading="lazy" />
          </figure>
        ))}
      </div>
    </div>
  );
}

function GeneratedShowcase({ skill }: { skill: SkillData }) {
  const model = buildSkillShowcaseModel(skill);
  const title =
    model.kind === "generated-flow"
      ? "Workflow board"
      : model.kind === "generated-prompt"
        ? "Prompt board"
        : "Output board";

  return (
    <div className="generated-preview-board">
      <div className="generated-preview-top">
        <span>{title}</span>
        <code>{model.primaryTrigger}</code>
      </div>
      <div className="generated-preview-main">
        <div className="generated-preview-card generated-preview-card-large">
          <span>Intent</span>
          <p>{skill.description || model.outputSummary}</p>
        </div>
        <div className="generated-flow-row">
          {model.workflowSteps.map((step, index) => (
            <div key={step} className="generated-flow-node">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{step}</p>
            </div>
          ))}
        </div>
        <div className="generated-output-row">
          {(skill.keyFeatures.length ? skill.keyFeatures : model.workflowSteps)
            .slice(0, 3)
            .map((item) => (
              <div key={item} className="generated-preview-card">
                <span>Output</span>
                <p>{item.replace(/^#+\s*/, "")}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────
   1. App Icon Minimalist
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
        background: "var(--bg-surface)",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--border-soft)",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "24px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {[
          { bg: "#1B365D", svg: <SvgGridIcon /> },
          { bg: "#E74C3C", svg: <SvgFaceIcon /> },
          { bg: "#27AE60", svg: <SvgCheckIcon /> },
          { bg: "#F39C12", svg: <SvgUserIcon /> },
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
                boxShadow: "var(--shadow-sm)",
                transition: "transform .15s ease",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1)")}
            >
              {icon.svg}
            </div>
            <span
              style={{
                fontSize: "10px",
                color: "var(--text-muted)",
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
          color: "var(--text-secondary)",
          fontFamily: "var(--font-display)",
          textAlign: "center",
          maxWidth: "40ch",
          lineHeight: 1.45,
          borderLeft: "2px solid var(--brand)",
          paddingLeft: "10px",
        }}
      >
        Minimalist icons generated from natural language prompts. No design tools needed.
      </div>
    </div>
  );
}

function SvgGridIcon() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      <rect width="56" height="56" rx="14" fill="#1B365D" />
      <path d="M18 18h8v8h-8zM30 18h8v8h-8zM18 30h8v8h-8z" fill="white" opacity={0.9} />
      <rect x="30" y="30" width="8" height="8" rx="2" fill="white" opacity={0.5} />
    </svg>
  );
}

function SvgFaceIcon() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      <circle cx="28" cy="28" r="28" fill="#E74C3C" />
      <path
        d="M20 28c0-4.4 3.6-8 8-8s8 3.6 8 8"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="36" cy="38" r="2.5" fill="white" />
    </svg>
  );
}

function SvgCheckIcon() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      <rect width="56" height="56" rx="16" fill="#27AE60" />
      <path
        d="M16 32l8 8 16-16"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SvgUserIcon() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      <rect width="56" height="56" rx="14" fill="#F39C12" />
      <circle cx="28" cy="22" r="7" fill="white" opacity={0.9} />
      <path
        d="M17 40c0-6 5-11 11-11s11 5 11 11"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

/* ──────────────────────────────────────
   2. Blueprinter — dark adapted
   ────────────────────────────────────── */
function BlueprintPreview() {
  const cellBg = "var(--bg-card)";
  const gridLine = "var(--border-strong)";
  const textDim = "var(--text-muted)";
  const accent = "#7b9cf0";

  return (
    <div
      style={{
        padding: "28px",
        background: "var(--bg-surface)",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--border-soft)",
        fontFamily: "var(--font-mono)",
        fontSize: "11px",
        color: "var(--text-primary)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          borderBottom: `2px solid ${accent}`,
          paddingBottom: "10px",
          marginBottom: "16px",
        }}
      >
        <span
          style={{
            fontWeight: 600,
            color: accent,
            fontSize: "13px",
            fontFamily: "var(--font-display)",
          }}
        >
          SYSTEM ARCHITECTURE
        </span>
        <span style={{ color: textDim, fontSize: "9px" }}>REV 2.1 · 2026-04</span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "200px 1fr 180px",
          gap: "1px",
          background: gridLine,
          border: `1px solid ${gridLine}`,
        }}
      >
        <div style={{ background: cellBg, padding: "14px" }}>
          <div
            style={{
              fontWeight: 600,
              marginBottom: 10,
              color: accent,
              fontSize: "10px",
              letterSpacing: "0.5px",
            }}
          >
            MODULES
          </div>
          {["Client Layer", "API Gateway", "Auth Service", "Data Store"].map((m, i) => (
            <div
              key={i}
              style={{
                padding: "5px 8px",
                margin: "2px 0",
                background: i % 2 ? "var(--bg-elevated)" : cellBg,
                borderLeft: `2px solid ${i === 0 ? accent : gridLine}`,
              }}
            >
              {m}
            </div>
          ))}
        </div>

        <div style={{ background: cellBg, padding: "14px", position: "relative" }}>
          <div
            style={{
              fontWeight: 600,
              marginBottom: 10,
              color: accent,
              fontSize: "10px",
              letterSpacing: "0.5px",
            }}
          >
            DATA FLOW
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[1, 2, 3].map((n) => (
              <div key={n} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div
                  style={{
                    width: "28px",
                    height: "18px",
                    borderRadius: "2px",
                    background: `${accent}33`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "9",
                    color: accent,
                    fontWeight: 600,
                  }}
                >
                  REQ
                </div>
                <div style={{ flex: 1, height: "1px", background: gridLine }} />
                <div
                  style={{
                    width: "40px",
                    height: "18px",
                    borderRadius: "2px",
                    background: "var(--bg-elevated)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "9",
                    color: textDim,
                  }}
                >
                  {n}ms
                </div>
              </div>
            ))}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginLeft: "auto",
                marginRight: "36px",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "18px",
                  borderRadius: "2px",
                  background: `${accent}22`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "9",
                  color: accent,
                  fontWeight: 600,
                }}
              >
                RES
              </div>
              <div
                style={{
                  flex: 1,
                  height: "1px",
                  background: accent,
                  opacity: 0.3,
                }}
              />
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              padding: "4px 10px",
              background: cellBg,
              border: `1px solid ${accent}`,
              borderRadius: "3px",
              fontSize: "9px",
              color: accent,
              fontWeight: 600,
            }}
          >
            ↕ async
          </div>
        </div>

        <div style={{ background: cellBg, padding: "14px" }}>
          <div
            style={{
              fontWeight: 600,
              marginBottom: 10,
              color: accent,
              fontSize: "10px",
              letterSpacing: "0.5px",
            }}
          >
            SPECS
          </div>
          {[
            ["Protocol", "HTTP/2"],
            ["Format", "JSON"],
            ["Cache", "Redis"],
            ["Status", "Active"],
          ].map(([k, v], i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "4px 6px",
                margin: "2px 0",
                borderBottom: "1px solid var(--border)",
                fontSize: "10px",
              }}
            >
              <span style={{ color: textDim }}>{k}</span>
              <span style={{ fontWeight: 500 }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          marginTop: "12px",
          borderTop: `1px dashed ${gridLine}`,
          paddingTop: "8px",
          display: "flex",
          justifyContent: "space-between",
          fontSize: "9px",
          color: textDim,
        }}
      >
        <span>Generated by blueprinter</span>
        <span>Grid: 1px | No shadows | Monospace only</span>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────
   3. Design System — dark adapted
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
        background: "var(--bg-surface)",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--border-soft)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "14px",
            fontWeight: 500,
            color: "var(--text-primary)",
          }}
        >
          Design System Tokens
        </span>
        <span
          style={{
            fontSize: "10px",
            color: "var(--text-muted)",
            fontFamily: "var(--font-mono)",
          }}
        >
          3 of 11 systems
        </span>
      </div>

      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        {systems.map((sys, i) => (
          <div
            key={i}
            style={{
              flex: "1 1 160px",
              padding: "16px",
              borderRadius: sys.radius as string,
              background: "var(--bg-card)",
              border: "1px solid var(--border-soft)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "var(--text-primary)",
                }}
              >
                {sys.name}
              </span>
              <span
                style={{
                  fontSize: "9px",
                  color: "var(--text-secondary)",
                  fontFamily: "var(--font-mono)",
                  padding: "2px 6px",
                  background: "var(--brand-subtle)",
                  borderRadius: "2px",
                }}
              >
                r:{sys.radius}
              </span>
            </div>
            <div style={{ display: "flex", gap: "4px", marginBottom: "12px" }}>
              {sys.colors.map((color, j) => (
                <div
                  key={j}
                  style={{
                    width: "100%",
                    aspectRatio: "1",
                    borderRadius: sys.radius === "0px" ? "0px" : "50%",
                    background: color,
                    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)",
                  }}
                  title={color}
                />
              ))}
            </div>
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

      <div
        style={{
          fontSize: "10px",
          color: "var(--text-secondary)",
          fontFamily: "var(--font-mono)",
          padding: "8px 12px",
          background: "var(--bg-card)",
          borderRadius: "4px",
          border: "1px solid var(--border-soft)",
        }}
      >
        &rarr; Exports: CSS variables · Tailwind config · JSON tokens
      </div>
    </div>
  );
}

/* ──────────────────────────────────────
   4. Editorial Card — dark adapted
   ────────────────────────────────────── */
function EditorialCardPreview() {
  return (
    <div
      style={{
        maxWidth: "480px",
        background: "var(--bg-card)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        boxShadow: "var(--shadow-md)",
        border: "1px solid var(--border-soft)",
        fontVariantNumeric: "tabular-nums",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 16px",
          background: "var(--bg-secondary)",
          borderBottom: "1px solid var(--border-soft)",
          fontSize: "9px",
          color: "var(--text-muted)",
          fontFamily: "var(--font-mono)",
        }}
      >
        <span>EDITORIAL CARD v2</span>
        <span>680 × 340</span>
      </div>

      <div style={{ padding: "24px 28px 20px" }}>
        <div
          style={{
            fontSize: "9px",
            fontWeight: 600,
            color: "var(--brand)",
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            marginBottom: "10px",
            fontFamily: "var(--font-sans)",
          }}
        >
          Design System · Q1 2026
        </div>

        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "22px",
            fontWeight: 400,
            lineHeight: 1.15,
            color: "var(--text-primary)",
            marginBottom: "6px",
            textWrap: "balance",
          }}
        >
          Building Design Tokens That Scale Across 11 Themes
        </h3>

        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "13px",
            lineHeight: 1.5,
            color: "var(--text-secondary)",
            marginBottom: "18px",
            textWrap: "pretty",
            paddingLeft: "12px",
            borderLeft: "2px solid var(--brand)",
          }}
        >
          A unified approach to color, spacing, and typography that maintains editorial rhythm at
          any viewport.
        </p>

        <div
          style={{
            display: "flex",
            gap: "16px",
            marginBottom: "18px",
            paddingBottom: "16px",
            borderBottom: "2px double var(--border)",
          }}
        >
          {[
            ["11", "Themes"],
            ["240+", "Tokens"],
            ["99.8%", "Coverage"],
          ].map(([value, label], i) => (
            <div key={i}>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "20px",
                  fontWeight: 400,
                  color: "var(--brand)",
                  lineHeight: 1.15,
                }}
              >
                {value}
              </div>
              <div
                style={{
                  fontSize: "9px",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>

        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          {[
            "Dark ink surface with amber-gold accent",
            "Serif headlines at weight 400, never bold",
            "Three line-height bands: tight / dense / reading",
            "CSS custom properties for full theming",
          ].map((item, i) => (
            <li
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "8px",
                fontSize: "11px",
                lineHeight: 1.45,
                color: "var(--text-secondary)",
                fontFamily: "var(--font-sans)",
              }}
            >
              <span style={{ color: "var(--brand)", flexShrink: 0 }}>—</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 20px",
          background: "var(--bg-surface)",
          borderTop: "1px solid var(--border-soft)",
          fontSize: "9px",
          color: "var(--text-muted)",
        }}
      >
        <span style={{ fontFamily: "var(--font-mono)" }}>Midnight Atelier Style</span>
        <span>High density · 65ch max</span>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────
   5. OPC Collection — dark adapted
   ────────────────────────────────────── */
function OpcCollectionPreview() {
  const stages = [
    { n: "00", name: "总编排", tag: "编排层" },
    { n: "01", name: "资源盘点", tag: "线性阶段" },
    { n: "02", name: "利基定位", tag: "线性阶段" },
    { n: "03", name: "价值主张", tag: "线性阶段" },
    { n: "04", name: "商业模式", tag: "线性阶段" },
    { n: "06", name: "MVP 设计", tag: "线性阶段" },
    { n: "07", name: "转化闭环", tag: "线性阶段" },
    { n: "08", name: "资产沉淀", tag: "条件触发" },
    { n: "09", name: "经营复盘", tag: "条件触发" },
  ];
  return (
    <div
      style={{
        padding: "24px",
        background: "var(--bg-surface)",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--border-soft)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 16,
        }}
      >
        <span
          style={{
            minWidth: "34px",
            height: "24px",
            padding: "0 6px",
            borderRadius: "6px",
            background: "var(--brand)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            fontWeight: 700,
            color: "var(--bg-primary)",
            lineHeight: 1,
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          OPC
        </span>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "15px",
            fontWeight: 400,
            color: "var(--text-primary)",
          }}
        >
          OPC Methodology — 9 Skills
        </span>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 8,
        }}
      >
        {stages.map((s) => (
          <div
            key={s.n}
            style={{
              padding: "8px 12px",
              background: "var(--bg-card)",
              borderRadius: "var(--radius-xs)",
              border: "1px solid var(--border-soft)",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
                fontWeight: 700,
                color: "var(--brand)",
                minWidth: 22,
              }}
            >
              {s.n}
            </span>
            <span
              style={{
                fontSize: "11px",
                color: "var(--text-primary)",
                flex: 1,
              }}
            >
              {s.name}
            </span>
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: 14,
          textAlign: "center",
          fontSize: "10px",
          color: "var(--text-secondary)",
          fontFamily: "var(--font-mono)",
        }}
      >
        01 → 07 Linear execution · 08/09 On-demand trigger
      </div>
    </div>
  );
}

/* ──────────────────────────────────────
   7. Impeccable Collection — already dark OK
   ────────────────────────────────────── */
function ImpeccableCollectionPreview() {
  const cmds = [
    "/create",
    "/evaluate",
    "/refine",
    "/simplify",
    "/harden",
    "/system",
    "/audit",
    "/polish",
    "/bolder",
    "/distill",
    "/critique",
    "/typeset",
    "/layout",
    "/shape",
    "/craft",
    "/teach",
    "/extract",
    "/impeccable",
  ];
  return (
    <div
      style={{
        padding: "24px",
        background: "linear-gradient(135deg,#1a1a2e 0%,#16213e 100%)",
        borderRadius: "var(--radius-md)",
        color: "#fff",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <span style={{ fontSize: "20px", letterSpacing: "3px", color: "#D4AF37" }}>
          &#9670; IMPECCABLE
        </span>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
          justifyContent: "center",
        }}
      >
        {cmds.map((c, i) => (
          <span
            key={i}
            style={{
              padding: "4px 10px",
              borderRadius: "4px",
              background: "rgba(255,255,255,0.08)",
              fontSize: "11px",
              fontFamily: "var(--font-mono)",
              fontWeight: 600,
              color: i === cmds.length - 1 ? "#D4AF37" : "#cbd5e1",
              border:
                i === cmds.length - 1 ? "1px solid rgba(212,175,55,0.3)" : "1px solid transparent",
            }}
          >
            {c}
          </span>
        ))}
      </div>
      <div
        style={{
          marginTop: 14,
          textAlign: "center",
          fontSize: "10px",
          color: "rgba(212,175,55,0.7)",
        }}
      >
        18 Commands · 7 Dimensions · 25 Anti-pattern Rules
      </div>
    </div>
  );
}

/* ──────────────────────────────────────
   8. Markdown Viewer — dark adapted
   ────────────────────────────────────── */
function MarkdownViewerCollectionPreview() {
  return (
    <div
      style={{
        padding: "24px",
        background: "linear-gradient(135deg,var(--bg-surface) 0%,var(--bg-secondary) 100%)",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--border-soft)",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <span
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "#9b8af2",
            letterSpacing: "0.5px",
          }}
        >
          14 SKILLS · 5 ENGINES
        </span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {[
          {
            label: "Standalone",
            items: ["vega", "infographic", "canvas"],
            bg: "color-mix(in srgb, #6366f1 12%, transparent)",
            color: "#9b8af2",
          },
          {
            label: "HTML/CSS",
            items: ["architecture", "infocard"],
            bg: "color-mix(in srgb, #ec4899 12%, transparent)",
            color: "#e88e8e",
          },
          {
            label: "PlantUML (9)",
            items: ["uml", "cloud", "network", "..."],
            bg: "color-mix(in srgb, #14b8a6 12%, transparent)",
            color: "#5ecf8a",
          },
        ].map((g, gi) => (
          <div
            key={gi}
            style={{
              padding: "12px",
              background: g.bg,
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: g.color,
                marginBottom: 8,
              }}
            >
              {g.label}
            </div>
            {g.items.map((item, ii) => (
              <div
                key={ii}
                style={{
                  fontSize: "11px",
                  color: "var(--text-secondary)",
                  padding: "2px 0",
                }}
              >
                {item}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: 14,
          textAlign: "center",
          fontSize: "10px",
          color: "var(--text-secondary)",
          fontFamily: "var(--font-mono)",
        }}
      >
        npx skills add markdown-viewer/skills
      </div>
    </div>
  );
}

/* ──────────────────────────────────────
   9. Khazix — dark adapted
   ────────────────────────────────────── */
function KhazixCollectionPreview() {
  return (
    <div
      style={{
        padding: "24px",
        background:
          "linear-gradient(135deg,var(--bg-elevated) 0%,color-mix(in srgb, #d4a853 8%, var(--bg-surface)) 100%)",
        borderRadius: "var(--radius-md)",
        border: "1px solid color-mix(in srgb, #d4a853 25%, transparent)",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <span
          style={{
            fontSize: "13px",
            fontWeight: 700,
            color: "var(--brand)",
            letterSpacing: "0.5px",
          }}
        >
          Khazix Skills
        </span>
      </div>
      <div style={{ display: "flex", gap: 14 }}>
        {[
          {
            abbr: "HV",
            name: "hv-analysis",
            desc: "横纵分析法深度研究",
            gradient: "linear-gradient(135deg,#667eea,#764ba2)",
          },
          {
            abbr: "KW",
            name: "khazix-writer",
            desc: "公众号长文写作",
            gradient: "linear-gradient(135deg,#d4a853,#e88e8e)",
          },
        ].map((tool, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              padding: "16px",
              background: "var(--bg-card)",
              borderRadius: "10px",
              border: "1px solid var(--border-soft)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: tool.gradient,
                margin: "0 auto 10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                fontWeight: 800,
                color: "#fff",
              }}
            >
              {tool.abbr}
            </div>
            <div
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "var(--text-primary)",
                marginBottom: 4,
              }}
            >
              {tool.name}
            </div>
            <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>{tool.desc}</div>
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: 14,
          textAlign: "center",
          fontSize: "10px",
          color: "var(--text-muted)",
          fontFamily: "var(--font-mono)",
        }}
      >
        MIT License · Open Source
      </div>
    </div>
  );
}
