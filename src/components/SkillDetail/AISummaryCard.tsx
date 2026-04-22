import type { SkillData } from "../../data/skills";

interface Props {
  skill: SkillData;
}

function getSummary(s: SkillData): string {
  const secs = s.stats.sectionCount;
  const cbs = s.stats.codeBlockCount;
  return `${secs} sections${cbs > 0 ? `, ${cbs} code example${cbs !== 1 ? "s" : ""}` : ""}${s.stats.complexityScore >= 5 ? ", moderate+ complexity" : ""}. Covers ${s.keyFeatures.slice(0, 3).join(", ") || "general usage patterns"}.`;
}

export default function AISummaryCard({ skill }: Props) {
  const summary = getSummary(skill);
  return (
    <div
      style={{
        borderRadius: "var(--radius-md)",
        background: "var(--bg-card)",
        border: "0.5px solid var(--border-cream)",
        padding: "18px 20px",
        marginBottom: "24px",
        maxWidth: "65ch",
        margin: "0 auto 24px",
        borderRadius: "8px",
        background: "var(--ivory)",
        boxShadow: "var(--shadow-whisper)",
        opacity: 1,
        transform: "translateY(0)",
        transition: "opacity .4s ease .1s, transform .4s ease .1s",
      }}
    >
      <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
        <span style={{ fontSize: "16px", flexShrink: 0 }}>🤖</span>
        <div>
          <div
            style={{
              fontSize: "10px",
              color: "var(--brand)",
              fontWeight: 600,
              marginBottom: "4px",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            AI Summary
          </div>
          <p
            style={{
              fontSize: "13px",
              color: "var(--text-secondary)",
              lineHeight: 1.5,
              textWrap: "pretty",
            }}
          >
            {summary}
          </p>
          <div
            style={{
              marginTop: "6px",
              fontSize: "11px",
              color: "var(--stone)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            Auto-generated from SKILL.md · {skill.stats.readTime} read time
          </div>
        </div>
      </div>
    </div>
  );
}
