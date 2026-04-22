import MarkdownRenderer from "../../common/MarkdownRenderer";
import SkillPreview from "../../Demos/SkillPreview";
import { stripLeadingH1 } from "../../../utils/markdownParser";
import { header, preview, content, sidebar } from "./layoutTokens";
import type { SkillData } from "../../../data/skills";

interface Props {
  skill: SkillData;
}

export default function StandardLayout({ skill }: Props) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 220px",
        gap: "36px",
        maxWidth: "85ch",
        margin: "0 auto",
        padding: "24px 20px 48px",
        alignItems: "start",
      }}
    >
      <main>
        <header style={{ marginBottom: 28, paddingBottom: 20, ...header.borderStyle }}>
          <div style={{ ...header.badge, marginBottom: 14 }}>
            {skill.category.icon} {skill.category.label}
          </div>

          <h1 style={{ ...header.h1, marginBottom: 12, textWrap: "balance" as const }}>
            {skill.name}
          </h1>

          <p style={{ ...header.desc, maxWidth: "55ch", borderLeft: "2px solid var(--brand)", paddingLeft: 12, marginLeft: 4 }}>
            {skill.description}
          </p>
        </header>

        <section style={preview.section}>
          <div style={preview.label}>Generated Output</div>
          <SkillPreview skill={skill} />
        </section>

        <section style={content.section}>
          <MarkdownRenderer content={stripLeadingH1(skill.content)} />
        </section>
      </main>

      <aside style={sidebar.container}>
        <h3 style={sidebar.title}>Info</h3>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            fontSize: 11,
            color: "var(--text-secondary)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          <div>
            <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>{skill.stats.lineCount}</span> lines
          </div>
          <div>
            <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>{skill.stats.readTime}</span> read
          </div>
          <div>
            <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>{skill.stats.complexityLabel}</span>
          </div>
        </div>

        {skill.triggerPhrases.length > 0 && (
          <div style={{ marginTop: 16, paddingTop: 12, borderTop: "0.5px solid var(--border-warm)" }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: "var(--stone)", textTransform: "uppercase" as const, letterSpacing: "0.6px", marginBottom: 6, fontFamily: "var(--font-sans)" }}>
              Triggers
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
              {skill.triggerPhrases.slice(0, 4).map((phrase, i) => (
                <code key={i} style={{ padding: "3px 6px", borderRadius: 3, background: "var(--tag-bg-default)", fontSize: 9, fontFamily: "var(--font-mono)", color: "var(--text-secondary)", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {phrase}
                </code>
              ))}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
