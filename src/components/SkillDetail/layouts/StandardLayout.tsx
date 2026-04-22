import MarkdownRenderer from "../../common/MarkdownRenderer";
import type { SkillData } from "../../../data/skills";

interface Props {
  skill: SkillData;
}

export default function StandardLayout({ skill }: Props) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 240px",
        gap: "40px",
        maxWidth: "85ch",
        margin: "0 auto",
        padding: "24px 20px 48px",
        alignItems: "start",
      }}
    >
      {/* Main content area */}
      <main>
        {/* Document header with editorial styling */}
        <header
          style={{
            marginBottom: "36px",
            paddingBottom: "24px",
            borderBottom: "3px double var(--border)",
          }}
        >
          {/* Category badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 12px",
              borderRadius: "2px",
              background: "var(--brand)",
              color: "white",
              fontSize: "10px",
              fontWeight: 600,
              letterSpacing: "0.8px",
              textTransform: "uppercase",
              marginBottom: "14px",
              fontFamily: "var(--font-sans)",
            }}
          >
            {skill.category.icon} {skill.category.label}
          </div>

          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(28px, 5vw, 38px)",
              fontWeight: 500,
              lineHeight: 1.15,
              color: "var(--text-primary)",
              marginBottom: "12px",
              textWrap: "balance",
            }}
          >
            {skill.name}
          </h1>

          {/* Quote block - kami standard: 2pt brand left + olive text */}
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: 1.5,
              color: "var(--olive)",
              maxWidth: "55ch",
              textWrap: "pretty",
              borderLeft: "2px solid var(--brand)",
              paddingLeft: "12px",
              marginLeft: "4px",
            }}
          >
            {skill.description}
          </p>
        </header>

        {/* Content sections */}
        <section style={{ marginBottom: "32px" }}>
          <MarkdownRenderer content={skill.content} />
        </section>

        {/* Use cases with kami editorial cards */}
        {skill.useCases.length > 0 && (
          <section
            style={{
              marginTop: "40px",
              paddingTop: "28px",
              borderTop: "0.5px dashed var(--border-warm)",
            }}
          >
            {/* Section Title - kami: serif 500 + 2.5pt (3.33px) brand left bar */}
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "18px",
                fontWeight: 500,
                marginBottom: "18px",
                color: "var(--text-primary)",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                lineHeight: 1.2,
                textWrap: "balance",
              }}
            >
              <span
                style={{
                  width: "3px",
                  height: "20px",
                  background: "var(--brand)",
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
              Use Cases
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "12px",
              }}
            >
              {skill.useCases.map((uc, i) => (
                <article
                  key={i}
                  style={{
                    padding: "14px 16px",
                    borderRadius: "8px",
                    background: "var(--ivory)",
                    border: "0.5px solid var(--border-warm)",
                    borderLeft: "3px solid var(--brand)",
                    boxShadow: "var(--shadow-whisper)",
                    transition: "box-shadow .15s ease",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: "8px",
                      marginBottom: "4px",
                    }}
                  >
                    <span style={{ fontSize: "16px", flexShrink: 0 }}>
                      {uc.icon}
                    </span>
                    <strong
                      style={{
                        fontSize: "13px",
                        color: "var(--text-primary)",
                        fontWeight: 600,
                      }}
                    >
                      {uc.title}
                    </strong>
                  </div>
                  {uc.description !== uc.title && (
                    <p
                      style={{
                        fontSize: "12px",
                        color: "var(--text-secondary)",
                        lineHeight: 1.45,
                        marginTop: "4px",
                      }}
                    >
                      {uc.description}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Key features as numbered list */}
        {skill.keyFeatures.length > 0 && (
          <section
            style={{
              marginTop: "36px",
              paddingTop: "28px",
              borderTop: "0.5px dashed var(--border-warm)",
            }}
          >
            {/* Section Title */}
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "18px",
                fontWeight: 500,
                marginBottom: "18px",
                color: "var(--text-primary)",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                lineHeight: 1.2,
                textWrap: "balance",
              }}
            >
              <span
                style={{
                  width: "3px",
                  height: "20px",
                  background: "var(--brand)",
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
              Key Features
            </h2>

            <ol
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                counterReset: "feature-counter",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              {skill.keyFeatures.map((feature, i) => (
                <li
                  key={i}
                  style={{
                    counterIncrement: "feature-counter",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    padding: "10px 14px",
                    borderRadius: "6px",
                    background: i % 2 === 0 ? "transparent" : "var(--ivory)",
                    transition: "background .15s ease",
                  }}
                >
                  <span
                    style={{
                      flexShrink: 0,
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      background: "var(--brand)",
                      color: "white",
                      fontSize: "11px",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    style={{
                      fontSize: "13px",
                      lineHeight: 1.45,
                      color: "var(--text-secondary)",
                    }}
                  >
                    {feature}
                  </span>
                </li>
              ))}
            </ol>
          </section>
        )}
      </main>

      {/* Sidebar - Metadata panel with ring shadow */}
      <aside
        style={{
          position: "sticky",
          top: "24px",
          padding: "20px",
          borderRadius: "8px",
          background: "var(--ivory)",
          border: "0.5px solid var(--border-warm)",
          boxShadow: "var(--shadow-ring)",
          fontSize: "13px",
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "12px",
            fontWeight: 500,
            color: "var(--brand)",
            textTransform: "uppercase",
            letterSpacing: "0.8px",
            marginBottom: "16px",
            paddingBottom: "10px",
            borderBottom: "0.5px solid var(--border-warm)",
            lineHeight: 1.3,
          }}
        >
          Document Info
        </h3>

        {/* Stats grid - Metric card: serif number + sans label */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
            marginBottom: "20px",
          }}
        >
          {[
            [String(skill.stats.lineCount), "Lines"],
            [String(skill.fileInfo.totalFiles), "Files"],
            [skill.stats.complexityLabel, "Level"],
            [skill.stats.readTime, "Read Time"],
          ].map(([value, label], i) => (
            <div key={i}>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: 500,
                  color: "var(--brand)",
                  fontFamily: "var(--font-serif)",
                  fontVariantNumeric: "tabular-nums",
                  lineHeight: 1.2,
                }}
              >
                {value}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "var(--stone)",
                  marginTop: "2px",
                  fontFamily: "var(--font-sans)",
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Install command - Code Block: ivory bg + 0.5pt border + 6pt radius */}
        {skill.installCommand && (
          <div style={{ marginBottom: "20px" }}>
            <h4
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "var(--stone)",
                textTransform: "uppercase",
                letterSpacing: "0.6px",
                marginBottom: "8px",
                fontFamily: "var(--font-sans)",
              }}
            >
              Install
            </h4>
            <code
              style={{
                display: "block",
                padding: "10px 12px",
                borderRadius: "6px",
                background: "var(--ivory)",
                border: "0.5px solid var(--border-warm)",
                color: "var(--near-black)",
                fontSize: "11px",
                fontFamily: "var(--font-mono)",
                overflowX: "auto",
                whiteSpace: "nowrap",
              }}
            >
              {skill.installCommand}
            </code>
          </div>
        )}

        {/* Trigger phrases - solid hex tags */}
        {skill.triggerPhrases.length > 0 && (
          <div>
            <h4
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "var(--stone)",
                textTransform: "uppercase",
                letterSpacing: "0.6px",
                marginBottom: "8px",
                fontFamily: "var(--font-sans)",
              }}
            >
              Triggers
            </h4>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "4px" }}
            >
              {skill.triggerPhrases.map((phrase, i) => (
                <code
                  key={i}
                  style={{
                    padding: "4px 8px",
                    borderRadius: "3px",
                    background: "var(--tag-bg-default)",
                    fontSize: "10px",
                    fontFamily: "var(--font-mono)",
                    color: "var(--text-secondary)",
                    display: "block",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
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
