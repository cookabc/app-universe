import type { SkillData } from "../../data/skills";
import MarkdownRenderer from "../common/MarkdownRenderer";

interface Props {
  skill: SkillData;
}

export default function OnePageLayout({ skill }: Props) {
  return (
    <article
      style={{
        maxWidth: "65ch",
        margin: "0 auto",
        padding: "0 20px 40px",
      }}
    >
      {/* Section Divider — Context */}
      <section style={{ marginBottom: "36px" }}>
        <div
          style={{
            fontSize: "11px",
            fontWeight: 600,
            color: "var(--brand)",
            letterSpacing: "1.2px",
            textTransform: "uppercase",
            marginBottom: "12px",
            fontFamily: "var(--font-sans)",
          }}
        >
          Context
        </div>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(22px, 3vw, 28px)",
            fontWeight: 500,
            lineHeight: 1.2,
            color: "var(--text-primary)",
            marginBottom: "12px",
            textWrap: "balance",
          }}
        >
          {skill.name}
        </h2>
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "15px",
            lineHeight: 1.5,
            color: "var(--text-secondary)",
            marginBottom: "16px",
            textWrap: "pretty",
          }}
        >
          {skill.description || "No description available."}
        </p>

        {/* Key metrics row */}
        <div
          style={{
            display: "flex",
            gap: "24px",
            flexWrap: "wrap",
            padding: "14px 0",
            borderTop: "1px solid var(--border-soft)",
            borderBottom: "1px solid var(--border-soft)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {[
            [String(skill.stats.lineCount), "lines of code"],
            [String(skill.fileInfo.totalFiles), "source files"],
            [skill.stats.complexityLabel, "complexity"],
          ].map(([value, label], i) => (
            <div key={i}>
              <span
                style={{
                  display: "block",
                  fontSize: "18px",
                  fontWeight: 600,
                  color: "var(--brand)",
                  fontFamily: "var(--font-sans)",
                }}
              >
                {value}
              </span>
              <span
                style={{
                  fontSize: "12px",
                  color: "var(--text-secondary)",
                  marginTop: "2px",
                }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Section Divider — Approach */}
      {skill.keyFeatures.length > 0 && (
        <section style={{ marginBottom: "36px" }}>
          <div
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "var(--brand)",
              letterSpacing: "1.2px",
              textTransform: "uppercase",
              marginBottom: "12px",
              fontFamily: "var(--font-sans)",
            }}
          >
            Approach
          </div>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "18px",
              fontWeight: 500,
              lineHeight: 1.25,
              color: "var(--text-primary)",
              marginBottom: "16px",
              textWrap: "balance",
            }}
          >
            Key Features
          </h3>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {skill.keyFeatures.map((feature, i) => (
              <li
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                  padding: "10px 14px",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-soft)",
                  fontSize: "13px",
                  lineHeight: 1.45,
                  color: "var(--text-secondary)",
                  transition: "border-color .15s ease",
                }}
              >
                <span
                  style={{
                    color: "var(--brand)",
                    fontWeight: 600,
                    flexShrink: 0,
                    fontFamily: "var(--font-mono)",
                    fontSize: "12px",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Full documentation content */}
      {skill.content && (
        <section style={{ marginBottom: "36px" }}>
          <div
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "var(--brand)",
              letterSpacing: "1.2px",
              textTransform: "uppercase",
              marginBottom: "12px",
              fontFamily: "var(--font-sans)",
            }}
          >
            Documentation
          </div>
          <MarkdownRenderer content={skill.content} />
        </section>
      )}

      {/* Section Divider — Outcome / Use Cases */}
      {skill.useCases.length > 0 && (
        <section style={{ marginBottom: "36px" }}>
          <div
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "var(--brand)",
              letterSpacing: "1.2px",
              textTransform: "uppercase",
              marginBottom: "12px",
              fontFamily: "var(--font-sans)",
            }}
          >
            Outcome
          </div>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "18px",
              fontWeight: 500,
              lineHeight: 1.25,
              color: "var(--text-primary)",
              marginBottom: "16px",
              textWrap: "balance",
            }}
          >
            Use Cases
          </h3>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {skill.useCases.map((uc, i) => (
              <div
                key={i}
                style={{
                  padding: "12px 16px",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-soft)",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  transition: "border-color .15s ease",
                }}
              >
                <span
                  style={{
                    fontSize: "18px",
                    flexShrink: 0,
                    lineHeight: 1,
                  }}
                >
                  {uc.icon}
                </span>
                <div>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: "13px",
                      color: "var(--text-primary)",
                      marginBottom: "2px",
                    }}
                  >
                    {uc.title}
                  </div>
                  {uc.description !== uc.title && (
                    <div
                      style={{
                        fontSize: "12px",
                        color: "var(--text-secondary)",
                        lineHeight: 1.4,
                      }}
                    >
                      {uc.description}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Trigger phrases */}
      {skill.triggerPhrases.length > 0 && (
        <section style={{ marginBottom: "36px" }}>
          <div
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "var(--brand)",
              letterSpacing: "1.2px",
              textTransform: "uppercase",
              marginBottom: "12px",
              fontFamily: "var(--font-sans)",
            }}
          >
            Trigger Phrases
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "6px",
            }}
          >
            {skill.triggerPhrases.map((phrase, i) => (
              <span
                key={i}
                style={{
                  padding: "4px 10px",
                  borderRadius: "3px",
                  background: "var(--tag-bg)",
                  border: "1px solid var(--border-soft)",
                  fontSize: "12px",
                  color: "var(--text-secondary)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {phrase}
              </span>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
