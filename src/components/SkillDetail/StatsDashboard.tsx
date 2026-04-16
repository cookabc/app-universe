import type { SkillData } from "../../data/skills";

interface Props {
  skill: SkillData;
}

export default function StatsDashboard({ skill }: Props) {
  const { stats, fileInfo } = skill;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "16px", marginBottom: "24px" }}>
      {[
        { t: "📊 Content", i: [
          { l: "Lines", v: String(stats.lineCount) },
          { l: "Chars", v: stats.charCount >= 10000 ? (stats.charCount / 1000).toFixed(1) + "K" : String(stats.charCount) },
          { l: "Sections", v: String(stats.sectionCount) },
          { l: "Code Blocks", v: String(stats.codeBlockCount) },
        ]},
        { t: "📁 Files", i: [
          { l: "Total Files", v: String(fileInfo.totalFiles) },
          { l: "Size", v: fileInfo.totalSizeStr },
          { l: "Complexity", v: stats.complexityLabel },
          { l: "Read Time", v: stats.readTime },
        ]},
        { t: "🏷️ Meta", i: [
          { l: "Category", v: skill.category.label },
          { l: "ID", v: skill.id },
          { l: "Updated", v: skill.lastUpdated || "-" },
          { l: "Triggers", v: String(skill.triggerPhrases.length) },
        ]},
      ].map((card) => (
        <div key={card.t} style={{ borderRadius: "var(--radius-md)", background: "var(--bg-card)", border: "1px solid var(--border)", padding: "16px 20px" }}>
          <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "12px", color: "var(--text-primary)" }}>{card.t}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 16px" }}>
            {card.i.map((item) => (
              <div key={item.l} style={{ display: "contents" }}>
                <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>{item.l}</span>
                <span style={{ fontSize: "13px", fontWeight: 500, fontFamily: "var(--font-mono)", textAlign: "right" }}>{item.v}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
