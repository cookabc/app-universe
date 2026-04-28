import { useState } from "react";
import type { SkillData } from "../../data/skills";

interface Props {
  skill: SkillData;
}

const bannerStyles = {
  article: {
    marginBottom: "40px",
    paddingBottom: "32px",
    borderBottom: "1px solid var(--border-soft)",
  },
  metaRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "20px",
    flexWrap: "wrap" as const,
  },
  categoryTag: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "4px 12px",
    borderRadius: "var(--radius-full)",
    background: "var(--brand-soft)",
    color: "var(--brand)",
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "0.5px",
    textTransform: "uppercase" as const,
    fontFamily: "var(--font-sans)",
  },
  categoryDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "var(--brand)",
  },
  badge: {
    padding: "4px 10px",
    borderRadius: "var(--radius-xs)",
    background: "var(--bg-elevated)",
    fontSize: "10px",
    fontWeight: 600,
    color: "var(--text-muted)",
    letterSpacing: "0.4px",
    textTransform: "uppercase" as const,
    fontFamily: "var(--font-mono)",
  },
  title: {
    fontFamily: "var(--font-display)",
    fontSize: "clamp(32px, 5vw, 48px)",
    fontWeight: 400,
    lineHeight: 1.1,
    color: "var(--text-primary)",
    marginBottom: "16px",
    textWrap: "balance" as const,
    letterSpacing: "-0.025em",
  },
  description: {
    fontFamily: "var(--font-sans)",
    fontSize: "16px",
    fontWeight: 400,
    lineHeight: 1.6,
    color: "var(--text-secondary)",
    maxWidth: "58ch",
    marginTop: "0",
    marginBottom: "28px",
    textWrap: "pretty" as const,
  },
  metricsRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap" as const,
  },
  metricPill: {
    display: "inline-flex",
    alignItems: "baseline",
    gap: "5px",
    padding: "8px 14px",
    borderRadius: "var(--radius-full)",
    background: "var(--bg-surface)",
    border: "1px solid var(--border)",
  },
  metricValue: {
    fontFamily: "var(--font-sans)",
    fontSize: "15px",
    fontWeight: 600,
    color: "var(--text-primary)",
    fontVariantNumeric: "tabular-nums" as const,
  },
  metricLabel: {
    fontSize: "10px",
    color: "var(--text-muted)",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
    fontWeight: 500,
  },
  copyBtn: {
    marginLeft: "auto",
    padding: "8px 18px",
    borderRadius: "var(--radius-full)",
    border: "1px solid var(--border-strong)",
    background: "transparent",
    color: "var(--text-secondary)",
    fontSize: "12px",
    fontWeight: 600,
    fontFamily: "var(--font-sans)",
    cursor: "pointer",
    transition:
      "background var(--duration-fast) var(--ease-out), color var(--duration-fast) var(--ease-out), border-color var(--duration-fast) var(--ease-out), transform var(--duration-fast) var(--ease-out)",
    letterSpacing: "0.2px",
  },
};

export default function SkillHeroBanner({ skill }: Props) {
  const [copied, setCopied] = useState(false);
  const cat = skill.category;

  const handleCopy = async () => {
    if (skill.installCommand) {
      await navigator.clipboard.writeText(skill.installCommand);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <article style={bannerStyles.article}>
      <div style={bannerStyles.metaRow}>
        <span
          style={{
            ...bannerStyles.categoryTag,
            color: `var(--cat-${cat.key})`,
            background: `color-mix(in srgb, var(--cat-${cat.key}) 10%, transparent)`,
          }}
        >
          <span
            style={{
              ...bannerStyles.categoryDot,
              background: `var(--cat-${cat.key})`,
            }}
          />
          {cat.label}
        </span>
        <span style={bannerStyles.badge}>{skill.stats.complexityLabel}</span>
      </div>

      <h1 style={bannerStyles.title}>{skill.name}</h1>

      <p style={bannerStyles.description}>{skill.description || "No description available."}</p>

      <div style={bannerStyles.metricsRow}>
        {[
          [String(skill.stats.lineCount), "Lines"],
          [String(skill.fileInfo.totalFiles), "Files"],
          [skill.stats.readTime, "Read"],
        ].map(([value, label], i) => (
          <div key={i} style={bannerStyles.metricPill}>
            <span style={bannerStyles.metricValue}>{value}</span>
            <span style={bannerStyles.metricLabel}>{label}</span>
          </div>
        ))}

        {skill.installCommand && (
          <button
            onClick={handleCopy}
            style={{
              ...bannerStyles.copyBtn,
              ...(copied
                ? {
                    background: "var(--brand-soft)",
                    color: "var(--brand)",
                    borderColor: `color-mix(in srgb, var(--brand) 30%, transparent)`,
                  }
                : {}),
            }}
            onMouseDown={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "scale(0.97)";
            }}
            onMouseUp={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "scale(1)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "scale(1)";
            }}
          >
            {copied ? "Copied" : "Copy Install Cmd"}
          </button>
        )}
      </div>
    </article>
  );
}
