import MarkdownRenderer from "../../common/MarkdownRenderer";
import SkillPreview from "../../Demos/SkillPreview";
import { stripLeadingH1 } from "../../../utils/markdownParser";
import { header, preview, content } from "./layoutTokens";
import type { SkillData } from "../../../data/skills";

interface Props {
  skill: SkillData;
}

export default function CompactLayout({ skill }: Props) {
  return (
    <article
      style={{
        maxWidth: "65ch",
        margin: "0 auto",
        padding: "24px 20px 48px",
      }}
    >
      <header
        style={{
          marginBottom: 28,
          paddingBottom: 20,
          borderBottom: "2px solid var(--brand)",
        }}
      >
        <div style={{ ...header.badge, marginBottom: 8 }}>
          {skill.category.icon} {skill.category.label}
        </div>

        <h1 style={{ ...header.h1, marginBottom: 10, textWrap: "balance" as const }}>
          {skill.name}
        </h1>

        <p
          style={{
            ...header.desc,
            borderLeft: "2px solid var(--brand)",
            paddingLeft: 10,
            marginLeft: 4,
          }}
        >
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

      <footer
        style={{
          marginTop: 32,
          paddingTop: 16,
          borderTop: "1px solid var(--border-soft)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 11,
          color: "var(--text-secondary)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        <span>{skill.stats.lineCount} lines · {skill.stats.readTime}</span>
      </footer>
    </article>
  );
}
