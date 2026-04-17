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
        borderRadius: "var(--radius-lg)",
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        padding: "20px 24px",
        marginBottom: "24px",
        display: "flex",
        gap: "12px",
        alignItems: "flex-start",
      }}
    >
      <span style={{ fontSize: "20px", flexShrink: 0 }}>🤖</span>
      <div>
        <div
          style={{
            fontSize: "12px",
            color: "var(--accent)",
            fontWeight: 600,
            marginBottom: "6px",
            textTransform: "uppercase",
            letterSpacing: ".5px",
          }}
        >
          TL;DR Summary
        </div>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
          {summary}
        </p>
        <div
          style={{
            marginTop: "8px",
            fontSize: "11px",
            color: "var(--text-secondary)",
            opacity: 0.6,
          }}
        >
          Auto-generated from SKILL.md · {skill.stats.readTime} read time
        </div>
      </div>
    </div>
  );
}
