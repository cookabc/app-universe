import { Link } from "react-router-dom";
import type { SkillData } from "../../data/skills";

interface Props {
  skill: SkillData;
  index: number;
  visible?: boolean;
}

const cardStyles = {
  link: {
    textDecoration: "none",
    color: "inherit",
    display: "block",
    height: "100%",
  },
  card: (visible: boolean, delay: number) => ({
    borderRadius: "var(--radius-lg)",
    background: "var(--bg-card)",
    border: "1px solid var(--border-soft)",
    padding: "24px",
    cursor: "pointer",
    height: "100%",
    display: "flex",
    flexDirection: "column" as const,
    position: "relative" as const,
    overflow: "hidden",
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(20px)",
    transition: `opacity ${600}ms var(--ease-out) ${delay}ms, transform ${600}ms var(--ease-out) ${delay}ms, border-color var(--duration-normal) var(--ease-out), box-shadow var(--duration-normal) var(--ease-out), background var(--duration-normal) var(--ease-out)`,
  }),
  topBar: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    height: "2px",
    background: "transparent",
    transition: "background var(--duration-normal) var(--ease-out)",
  },
  headerRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "16px",
  },
  indexNum: {
    fontSize: "12px",
    fontWeight: 500,
    color: "var(--text-dim)",
    fontFamily: "var(--font-mono)",
    fontVariantNumeric: "tabular-nums" as const,
  },
  categoryChip: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "10px",
    fontWeight: 600,
    letterSpacing: "0.5px",
    textTransform: "uppercase" as const,
    fontFamily: "var(--font-sans)",
    padding: "4px 10px",
    borderRadius: "var(--radius-full)",
    background: "var(--brand-subtle)",
    color: "var(--brand)",
  },
  categoryDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "var(--brand)",
  },
  title: {
    fontFamily: "var(--font-display)",
    fontSize: "19px",
    fontWeight: 400,
    lineHeight: 1.2,
    color: "var(--text-primary)",
    marginBottom: "8px",
    textWrap: "balance" as const,
  },
  description: {
    fontSize: "13px",
    lineHeight: 1.55,
    color: "var(--text-secondary)",
    marginBottom: "20px",
    flex: 1,
    textWrap: "pretty" as const,
    display: "-webkit-box" as const,
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical" as const,
    overflow: "hidden",
  },
  divider: {
    height: "1px",
    background: "var(--border-soft)",
    marginBottom: "14px",
  },
  metaRow: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap" as const,
  },
  metaItem: {
    display: "flex",
    alignItems: "baseline",
    gap: "4px",
  },
  metaValue: {
    fontFamily: "var(--font-sans)",
    fontSize: "13px",
    fontWeight: 600,
    color: "var(--text-primary)",
    fontVariantNumeric: "tabular-nums" as const,
  },
  metaLabel: {
    fontSize: "11px",
    color: "var(--text-muted)",
  },
  complexityBadge: {
    fontSize: "10px",
    fontWeight: 600,
    color: "var(--text-muted)",
    fontFamily: "var(--font-mono)",
    marginLeft: "auto",
    padding: "2px 8px",
    borderRadius: "var(--radius-xs)",
    background: "var(--bg-elevated)",
    letterSpacing: "0.3px",
  },
};

export default function SkillCard({ skill, index, visible = false }: Props) {
  const cat = skill.category;
  const num = String(index + 1).padStart(2, "0");
  const delay = Math.min(index * 60, 420);

  return (
    <Link to={`/skill/${skill.id}`} style={cardStyles.link}>
      <article
        style={cardStyles.card(visible, delay)}
        onMouseEnter={(e) => {
          const el = e.currentTarget;
          el.style.borderColor = "var(--border-strong)";
          el.style.boxShadow = "var(--shadow-glow)";
          el.style.transform = "translateY(-3px)";
          el.style.background = "var(--bg-card-hover)";
          const bar = el.querySelector("[data-top-bar]") as HTMLElement;
          if (bar) bar.style.background = "linear-gradient(90deg, var(--brand), transparent)";
        }}
        onMouseDown={(e) => {
          (e.currentTarget as HTMLElement).style.transform = "scale(0.98)";
        }}
        onMouseUp={(e) => {
          (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget;
          el.style.borderColor = "var(--border-soft)";
          el.style.boxShadow = "none";
          el.style.transform = "translateY(0)";
          el.style.background = "var(--bg-card)";
          const bar = el.querySelector("[data-top-bar]") as HTMLElement;
          if (bar) bar.style.background = "transparent";
        }}
      >
        <div data-top-bar style={cardStyles.topBar} />

        <div style={cardStyles.headerRow}>
          <span style={cardStyles.indexNum}>{num}</span>
          <span
            style={{
              ...cardStyles.categoryChip,
              color: `var(--cat-${cat.key})`,
              background: `color-mix(in srgb, var(--cat-${cat.key}) 10%, transparent)`,
            }}
          >
            <span
              style={{
                ...cardStyles.categoryDot,
                background: `var(--cat-${cat.key})`,
              }}
            />
            {cat.label}
          </span>
        </div>

        <h3 style={cardStyles.title}>{skill.name}</h3>

        <p style={cardStyles.description}>{skill.description || "No description available"}</p>

        <div style={cardStyles.divider} />

        <div style={cardStyles.metaRow}>
          <div style={cardStyles.metaItem}>
            <span style={cardStyles.metaValue}>{skill.stats.lineCount}</span>
            <span style={cardStyles.metaLabel}>lines</span>
          </div>
          <div style={cardStyles.metaItem}>
            <span style={cardStyles.metaValue}>{skill.fileInfo.totalFiles}</span>
            <span style={cardStyles.metaLabel}>files</span>
          </div>
          <span style={cardStyles.complexityBadge}>{skill.stats.complexityLabel}</span>
        </div>
      </article>
    </Link>
  );
}
