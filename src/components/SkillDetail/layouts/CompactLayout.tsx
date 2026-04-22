import MarkdownRenderer from "../../common/MarkdownRenderer";
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
      {/* Minimal header */}
      <header
        style={{
          marginBottom: "28px",
          paddingBottom: "20px",
          borderBottom: "2px solid var(--brand)",
        }}
      >
        <div
          style={{
            fontSize: "11px",
            fontWeight: 600,
            color: "var(--brand)",
            letterSpacing: "1px",
            textTransform: "uppercase",
            marginBottom: "8px",
            fontFamily: "var(--font-sans)",
          }}
        >
          {skill.category.icon} {skill.category.label} · Quick Reference
        </div>

        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(26px, 4vw, 32px)",
            fontWeight: 500,
            lineHeight: 1.15,
            color: "var(--text-primary)",
            marginBottom: "10px",
            textWrap: "balance",
          }}
        >
          {skill.name}
        </h1>

        <p
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "15px",
            lineHeight: 1.5,
            color: "var(--olive)",
            textWrap: "pretty",
            borderLeft: "2px solid var(--brand)",
            paddingLeft: "10px",
            marginLeft: "4px",
          }}
        >
          {skill.description}
        </p>
      </header>

      {/* Single column content flow */}
      <section style={{ marginBottom: "32px" }}>
        <MarkdownRenderer content={skill.content} />
      </section>

      {/* Use cases - compact list */}
      {skill.useCases.length > 0 && (
        <section
          style={{
            marginTop: "36px",
            paddingTop: "24px",
            borderTop: "1px solid var(--border-soft)",
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "14px",
              fontWeight: 500,
              marginBottom: "12px",
              color: "var(--brand)",
              textTransform: "uppercase",
              letterSpacing: "0.8px",
            }}
          >
            When to Use
          </h3>
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
            {skill.useCases.slice(0, 5).map((uc, i) => (
              <li
                key={i}
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "8px",
                  fontSize: "13px",
                  lineHeight: 1.45,
                  color: "var(--text-secondary)",
                }}
              >
                <span style={{ flexShrink: 0 }}>{uc.icon}</span>
                <span>{uc.title}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Trigger phrases inline */}
      {skill.triggerPhrases.length > 0 && (
        <section
          style={{
            marginTop: "24px",
            paddingTop: "20px",
            borderTop: "1px solid var(--border-soft)",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "var(--text-secondary)",
              marginBottom: "10px",
              textTransform: "uppercase",
              letterSpacing: "0.6px",
            }}
          >
            Trigger Phrases
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {skill.triggerPhrases.map((phrase, i) => (
              <code
                key={i}
                style={{
                  padding: "3px 8px",
                  borderRadius: "3px",
                  background: "var(--tag-bg-light)",
                  border: "none",
                  fontSize: "11px",
                  fontFamily: "var(--font-mono)",
                  color: "var(--text-secondary)",
                }}
              >
                {phrase}
              </code>
            ))}
          </div>
        </section>
      )}

      {/* Footer stats */}
      <footer
        style={{
          marginTop: "40px",
          paddingTop: "20px",
          borderTop: "1px solid var(--border-soft)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "12px",
          color: "var(--text-secondary)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        <span>
          {skill.stats.lineCount} lines · {skill.fileInfo.totalFiles} files
        </span>
        <span>{skill.stats.readTime}</span>
      </footer>
    </article>
  );
}
