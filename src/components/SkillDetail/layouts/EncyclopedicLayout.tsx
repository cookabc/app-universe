import { useState, useEffect, useMemo } from "react";
import MarkdownRenderer from "../../common/MarkdownRenderer";
import type { SkillData } from "../../../data/skills";

interface Props {
  skill: SkillData;
}

interface TOCItem {
  id: string;
  title: string;
  level: number;
}

export default function EncyclopedicLayout({ skill }: Props) {
  const [activeSection, setActiveSection] = useState<string>("");
  const [showTOC, setShowTOC] = useState(true);

  // Extract table of contents from markdown headings
  const tocItems = useMemo(() => {
    const items: TOCItem[] = [];
    const lines = skill.content.split("\n");

    lines.forEach((line, i) => {
      const match = line.match(/^(#{2,3})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const title = match[2].trim();
        const id = title
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-");

        if (level <= 3) {
          // Only include ## and ### headings
          items.push({ id, title, level });
        }
      }
    });

    return items;
  }, [skill.content]);

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section[id^='section-']");

      for (const section of Array.from(sections).reverse()) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 150) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Render content with section IDs
  const renderContentWithSections = () => {
    const sections: {
      heading: string;
      content: string;
      level: number;
      id: string;
    }[] = [];
    let currentSection = { heading: "", content: "", level: 0, id: "" };
    const lines = skill.content.split("\n");

    lines.forEach((line, i) => {
      const match = line.match(/^(#{2,3})\s+(.+)$/);
      if (match && match[1].length <= 3) {
        if (currentSection.heading) {
          sections.push({ ...currentSection });
        }
        const title = match[2].trim();
        currentSection = {
          heading: title,
          content: "",
          level: match[1].length,
          id: `section-${i}-${title
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")}`,
        };
      } else {
        currentSection.content += line + "\n";
      }
    });

    if (currentSection.heading) {
      sections.push({ ...currentSection });
    }

    return sections.map((section, i) => (
      <section
        key={i}
        id={section.id}
        style={{
          marginBottom: "40px",
          scrollMarginTop: "80px",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: section.level === 2 ? "24px" : "19px",
            fontWeight: 500,
            lineHeight: 1.25,
            color: "var(--text-primary)",
            marginBottom: "16px",
            textWrap: "balance",
            paddingBottom: "10px",
            borderBottom:
              activeSection === section.id
                ? "2px solid var(--brand)"
                : "2px solid transparent",
            transition: "border-color .2s ease",
            display: "flex",
            alignItems: "baseline",
            gap: "12px",
          }}
        >
          {activeSection === section.id && (
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "var(--brand)",
                flexShrink: 0,
              }}
            />
          )}
          {section.heading}
        </h2>
        <div
          style={{
            fontSize: "14px",
            lineHeight: 1.7,
            color: "var(--text-secondary)",
            textWrap: "pretty",
          }}
        >
          <MarkdownRenderer content={section.content.trim()} />
        </div>
      </section>
    ));
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: showTOC ? "240px 1fr" : "1fr",
        gap: "48px",
        maxWidth: "100ch",
        margin: "0 auto",
        padding: "24px 20px 60px",
        alignItems: "start",
      }}
    >
      {/* Table of Contents sidebar */}
      {showTOC && (
        <aside
          style={{
            position: "sticky",
            top: "28px",
            maxHeight: "calc(100vh - 56px)",
            overflowY: "auto",
            padding: "20px",
            borderRadius: "8px",
            background: "var(--ivory)",
            border: "0.5px solid var(--border-warm)",
            boxShadow: "var(--shadow-ring)",
          }}
        >
          {/* Close button */}
          <button
            onClick={() => setShowTOC(false)}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              background: "none",
              border: "none",
              fontSize: "16px",
              cursor: "pointer",
              color: "var(--text-secondary)",
              padding: "4px",
              lineHeight: 1,
            }}
          >
            ✕
          </button>

          <h3
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "11px",
              fontWeight: 600,
              color: "var(--brand)",
              textTransform: "uppercase",
              letterSpacing: "0.8px",
              marginBottom: "16px",
              paddingRight: "24px",
            }}
          >
            📑 Contents ({tocItems.length} sections)
          </h3>

          <nav>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              {tocItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      const element = document.getElementById(item.id);
                      if (element) {
                        element.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                        setActiveSection(item.id);
                      }
                    }}
                    style={{
                      display: "block",
                      padding: "6px 10px",
                      borderRadius: "3px",
                      fontSize: item.level === 2 ? "12px" : "11px",
                      fontWeight: activeSection === item.id ? 500 : 400,
                      color:
                        activeSection === item.id
                          ? "var(--brand)"
                          : "var(--text-secondary)",
                      background:
                        activeSection === item.id
                          ? "var(--tag-bg-light)"
                          : "transparent",
                      textDecoration: "none",
                      paddingLeft: item.level === 3 ? "20px" : "10px",
                      transition: "all .15s ease",
                      borderLeft:
                        activeSection === item.id
                          ? "2px solid var(--brand)"
                          : "2px solid transparent",
                      fontFamily: "var(--font-sans)",
                      lineHeight: 1.4,
                    }}
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Document metadata */}
          <div
            style={{
              marginTop: "24px",
              paddingTop: "16px",
              borderTop: "1px solid var(--border-soft)",
              fontSize: "11px",
              color: "var(--text-secondary)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            <div style={{ marginBottom: "6px" }}>
              <strong style={{ color: "var(--text-primary)" }}>
                {skill.stats.lineCount}
              </strong>{" "}
              lines
            </div>
            <div style={{ marginBottom: "6px" }}>
              <strong style={{ color: "var(--text-primary)" }}>
                {skill.stats.readTime}
              </strong>{" "}
              read time
            </div>
            <div>
              <strong style={{ color: "var(--text-primary)" }}>
                {tocItems.length}
              </strong>{" "}
              sections
            </div>
          </div>
        </aside>
      )}

      {/* Show TOC button when hidden */}
      {!showTOC && (
        <button
          onClick={() => setShowTOC(true)}
          style={{
            position: "fixed",
            left: "20px",
            top: "120px",
            padding: "8px 14px",
            borderRadius: "var(--radius-sm)",
            background: "var(--ivory)",
            border: "0.5px solid var(--border-warm)",
            boxShadow: "var(--shadow-ring)",
            fontSize: "12px",
            cursor: "pointer",
            zIndex: 100,
            fontFamily: "var(--font-sans)",
            color: "var(--text-secondary)",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          📑 Show Contents
        </button>
      )}

      {/* Main content area */}
      <main>
        {/* Document header */}
        <header
          style={{
            marginBottom: "44px",
            paddingBottom: "32px",
            borderBottom: "3px double var(--border)",
          }}
        >
          {/* Category and type badges */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "18px",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "5px 12px",
                borderRadius: "2px",
                background: "var(--brand)",
                color: "white",
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.7px",
                textTransform: "uppercase",
                fontFamily: "var(--font-sans)",
              }}
            >
              {skill.category.icon} {skill.category.label}
            </span>
            <span
              style={{
                padding: "5px 12px",
                borderRadius: "2px",
                background: "var(--bg-card)",
                border: "1px solid var(--border-soft)",
                fontSize: "10px",
                fontWeight: 600,
                color: "var(--text-secondary)",
                letterSpacing: "0.7px",
                textTransform: "uppercase",
                fontFamily: "var(--font-sans)",
              }}
            >
              📖 Full Documentation
            </span>
            <span
              style={{
                padding: "5px 12px",
                borderRadius: "2px",
                background: "#fef3c7",
                border: "1px solid #fbbf24",
                fontSize: "10px",
                fontWeight: 600,
                color: "#92400e",
                letterSpacing: "0.7px",
                textTransform: "uppercase",
                fontFamily: "var(--font-sans)",
              }}
            >
              ⚠️ {skill.stats.complexityLabel}
            </span>
          </div>

          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(34px, 6vw, 48px)",
              fontWeight: 500,
              lineHeight: 1.1,
              color: "var(--text-primary)",
              marginBottom: "16px",
              textWrap: "balance",
            }}
          >
            {skill.name}
          </h1>

          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "18px",
              lineHeight: 1.55,
              color: "var(--olive)",
              maxWidth: "65ch",
              textWrap: "pretty",
              borderLeft: "3px solid var(--brand)",
              paddingLeft: "12px",
              marginLeft: "4px",
            }}
          >
            {skill.description}
          </p>

          {/* Quick stats bar */}
          <div
            style={{
              marginTop: "24px",
              display: "flex",
              gap: "24px",
              flexWrap: "wrap",
              padding: "16px 20px",
              background: "var(--bg-card)",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border-soft)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {[
              [String(skill.stats.lineCount), "Lines", "📄"],
              [String(skill.fileInfo.totalFiles), "Files", "📁"],
              [skill.stats.readTime, "Read Time", "⏱"],
              [String(tocItems.length), "Sections", "📑"],
              [
                String((skill.content.match(/```/g) || []).length / 2),
                "Code Blocks",
                "💻",
              ],
            ].map(([value, label, icon], i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "22px",
                    fontWeight: 600,
                    color: "var(--brand)",
                    fontFamily: "var(--font-sans)",
                    lineHeight: 1.2,
                  }}
                >
                  {icon} {value}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--text-secondary)",
                    marginTop: "2px",
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        </header>

        {/* Content sections with IDs */}
        {renderContentWithSections()}

        {/* Use cases */}
        {skill.useCases.length > 0 && (
          <section
            style={{
              marginTop: "48px",
              paddingTop: "36px",
              borderTop: "3px double var(--border)",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "24px",
                fontWeight: 500,
                marginBottom: "24px",
                color: "var(--text-primary)",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <span
                style={{
                  width: "5px",
                  height: "28px",
                  background: "var(--brand)",
                  borderRadius: "2px",
                }}
              />
              Practical Applications
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "14px",
              }}
            >
              {skill.useCases.map((uc, i) => (
                <article
                  key={i}
                  style={{
                    padding: "18px 20px",
                    borderRadius: "var(--radius-sm)",
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-soft)",
                    borderLeft: "4px solid var(--brand)",
                    transition: "transform .15s ease, box-shadow .15s ease",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: "10px",
                      marginBottom: "6px",
                    }}
                  >
                    <span style={{ fontSize: "20px", flexShrink: 0 }}>
                      {uc.icon}
                    </span>
                    <strong
                      style={{
                        fontSize: "14px",
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
                        fontSize: "13px",
                        color: "var(--text-secondary)",
                        lineHeight: 1.45,
                        marginLeft: "30px",
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

        {/* Key features summary */}
        {skill.keyFeatures.length > 0 && (
          <section
            style={{
              marginTop: "40px",
              padding: "24px 28px",
              background:
                "linear-gradient(135deg, var(--bg-card), transparent)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-soft)",
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "16px",
                fontWeight: 500,
                marginBottom: "16px",
                color: "var(--brand)",
                textTransform: "uppercase",
                letterSpacing: "0.8px",
              }}
            >
              ✨ Key Features Summary
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                gap: "8px",
              }}
            >
              {skill.keyFeatures.map((feature, i) => (
                <div
                  key={i}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "3px",
                    background: "white",
                    border: "1px solid var(--border-soft)",
                    fontSize: "12px",
                    color: "var(--text-secondary)",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "var(--brand)",
                      flexShrink: 0,
                    }}
                  />
                  {feature}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Trigger phrases */}
        {skill.triggerPhrases.length > 0 && (
          <section
            style={{
              marginTop: "32px",
              paddingTop: "24px",
              borderTop: "1px solid var(--border-soft)",
            }}
          >
            <h4
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "var(--text-secondary)",
                textTransform: "uppercase",
                letterSpacing: "0.6px",
                marginBottom: "12px",
              }}
            >
              🔑 Trigger Phrases
            </h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {skill.triggerPhrases.map((phrase, i) => (
                <code
                  key={i}
                  style={{
                    padding: "4px 10px",
                    borderRadius: "3px",
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-soft)",
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
      </main>
    </div>
  );
}
