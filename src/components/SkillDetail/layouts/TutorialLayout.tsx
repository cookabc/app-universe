import { useState } from "react";
import MarkdownRenderer from "../../common/MarkdownRenderer";
import type { SkillData } from "../../../data/skills";
import { extractCodeBlocks } from "../../../utils/markdownParser";

interface Props {
  skill: SkillData;
}

export default function TutorialLayout({ skill }: Props) {
  const [activeTab, setActiveTab] = useState<"content" | "examples">("content");
  const codeBlocks = extractCodeBlocks(skill.content);

  return (
    <div
      style={{
        maxWidth: "90ch",
        margin: "0 auto",
        padding: "24px 20px 48px",
      }}
    >
      {/* Tutorial header */}
      <header
        style={{
          marginBottom: "36px",
          paddingBottom: "28px",
          borderBottom: "3px double var(--border)",
          background: "var(--ivory)",
          padding: "28px 24px",
          borderRadius: "12px",
          border: "0.5px solid var(--border-warm)",
          boxShadow: "var(--shadow-whisper)",
        }}
      >
        {/* Breadcrumb-style category */}
        <nav
          style={{
            fontSize: "11px",
            color: "var(--stone)",
            marginBottom: "12px",
            fontFamily: "var(--font-sans)",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span style={{ color: "var(--brand)" }}>{skill.category.icon}</span>
          <span>{skill.category.label}</span>
          <span style={{ color: "var(--olive)" }}>›</span>
          <span style={{ fontWeight: 500, color: "var(--text-primary)" }}>
            Tutorial
          </span>
        </nav>

        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(30px, 5vw, 42px)",
            fontWeight: 500,
            lineHeight: 1.15,
            color: "var(--text-primary)",
            marginBottom: "14px",
            textWrap: "balance",
          }}
        >
          {skill.name}
        </h1>

        {/* Quote block */}
        <p
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "17px",
            fontWeight: 400,
            lineHeight: 1.5,
            color: "var(--olive)",
            maxWidth: "60ch",
            textWrap: "pretty",
            borderLeft: "2px solid var(--brand)",
            paddingLeft: "12px",
          }}
        >
          {skill.description}
        </p>

        {/* Progress indicator - Metric cards */}
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            alignItems: "center",
            gap: "20px",
            fontSize: "11px",
            color: "var(--stone)",
            fontVariantNumeric: "tabular-nums",
            fontFamily: "var(--font-sans)",
          }}
        >
          <span>⏱ {skill.stats.readTime}</span>
          <span style={{ color: "var(--border-warm)" }}>·</span>
          <span>{skill.stats.lineCount} lines</span>
          <span style={{ color: "var(--border-warm)" }}>·</span>
          <span>{codeBlocks.length} examples</span>
        </div>
      </header>

      {/* Two-column layout for tutorial content */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: activeTab === "content" ? "1fr" : "1fr 400px",
          gap: "32px",
          alignItems: "start",
        }}
      >
        {/* Main content area */}
        <main>
          <section
            style={{
              background: "white",
              padding: "28px 32px",
              borderRadius: "8px",
              border: "0.5px solid var(--border-warm)",
              boxShadow: "var(--shadow-whisper)",
            }}
          >
            <MarkdownRenderer content={skill.content} />
          </section>

          {/* Use cases section */}
          {skill.useCases.length > 0 && (
            <section
              style={{
                marginTop: "36px",
                paddingTop: "28px",
                borderTop: "0.5px dashed var(--border-warm)",
              }}
            >
              {/* Section Title - kami standard */}
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
                Practical Applications
              </h2>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
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
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "12px",
                      boxShadow: "var(--shadow-whisper)",
                      transition: "box-shadow .15s ease",
                    }}
                  >
                    <span
                      style={{
                        flexShrink: 0,
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        background: "var(--tag-bg-default)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "14px",
                        border: "0.5px solid var(--border-warm)",
                      }}
                    >
                      {uc.icon}
                    </span>
                    <div style={{ flex: 1 }}>
                      <strong
                        style={{
                          fontSize: "13px",
                          color: "var(--text-primary)",
                          fontWeight: 600,
                          display: "block",
                          marginBottom: "3px",
                        }}
                      >
                        {uc.title}
                      </strong>
                      {uc.description !== uc.title && (
                        <p
                          style={{
                            fontSize: "12px",
                            color: "var(--text-secondary)",
                            lineHeight: 1.45,
                            margin: 0,
                          }}
                        >
                          {uc.description}
                        </p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </main>

        {/* Code examples panel (shown when tab is active) */}
        {activeTab === "examples" && codeBlocks.length > 0 && (
          <aside
            style={{
              position: "sticky",
              top: "24px",
              maxHeight: "calc(100vh - 48px)",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                padding: "20px",
                borderRadius: "8px",
                background: "var(--near-black)",
                border: "0.5px solid var(--dark-surface)",
                boxShadow: "var(--shadow-ring)",
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "#e5e5e5",
                  marginBottom: "16px",
                  paddingBottom: "10px",
                  borderBottom: "0.5px solid #444",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  lineHeight: 1.3,
                }}
              >
                <span>💻 Code Examples ({codeBlocks.length})</span>
                <button
                  onClick={() => setActiveTab("content")}
                  style={{
                    background: "none",
                    border: "0.5px solid #555",
                    color: "#aaa",
                    padding: "4px 10px",
                    borderRadius: "3px",
                    fontSize: "11px",
                    cursor: "pointer",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  ✕ Close
                </button>
              </h3>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                {codeBlocks.map((block, i) => (
                  <div key={i}>
                    <div
                      style={{
                        fontSize: "10px",
                        color: "#888",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        marginBottom: "6px",
                        fontFamily: "var(--font-sans)",
                      }}
                    >
                      Example {i + 1} · {block.language || "code"}
                    </div>
                    <pre
                      style={{
                        margin: 0,
                        padding: "14px",
                        borderRadius: "6px",
                        background: "#252526",
                        overflowX: "auto",
                        fontSize: "11px",
                        fontFamily: "var(--font-mono)",
                        lineHeight: 1.6,
                        border: "0.5px solid #333",
                      }}
                    >
                      <code style={{ color: "#d4d4d4" }}>{block.code}</code>
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Floating action button to show/hide code examples - Ring shadow button */}
      {codeBlocks.length > 0 && activeTab !== "examples" && (
        <button
          onClick={() => setActiveTab("examples")}
          style={{
            position: "fixed",
            bottom: "32px",
            right: "32px",
            padding: "12px 20px",
            borderRadius: "8px",
            background: "var(--brand)",
            color: "white",
            border: "none",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "var(--shadow-whisper)",
            transition: "transform .15s ease, box-shadow .15s ease",
            zIndex: 100,
            fontFamily: "var(--font-sans)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
          onMouseDown={(e) => {
            (e.currentTarget as HTMLElement).style.transform = "scale(0.98)";
          }}
          onMouseUp={(e) => {
            (e.currentTarget as HTMLElement).style.transform = "scale(1)";
          }}
        >
          💻 View Examples ({codeBlocks.length})
        </button>
      )}
    </div>
  );
}
