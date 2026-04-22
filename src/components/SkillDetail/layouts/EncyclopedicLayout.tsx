import { useState, useEffect, useMemo } from "react";
import MarkdownRenderer from "../../common/MarkdownRenderer";
import SkillPreview from "../../Demos/SkillPreview";
import { stripLeadingH1 } from "../../../utils/markdownParser";
import { header, preview, content, sidebar } from "./layoutTokens";
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

  const tocItems = useMemo(() => {
    const items: TOCItem[] = [];
    const lines = stripLeadingH1(skill.content).split("\n");

    lines.forEach((line, i) => {
      const match = line.match(/^(#{2,3})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const title = match[2].trim();
        const id = `${title
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")}-${i}`;

        if (level <= 3) {
          items.push({ id, title, level });
        }
      }
    });

    return items;
  }, [skill.content]);

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

  const renderContentWithSections = () => {
    const sections: {
      heading: string;
      content: string;
      level: number;
      id: string;
    }[] = [];
    let currentSection = { heading: "", content: "", level: 0, id: "" };
    const lines = stripLeadingH1(skill.content).split("\n");

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
      <section key={i} id={section.id} style={{ marginBottom: content.section.marginBottom, scrollMarginTop: "80px" }}>
        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: section.level === 2 ? "22px" : "18px",
            fontWeight: 500,
            lineHeight: 1.25,
            color: "var(--text-primary)",
            marginBottom: 14,
            textWrap: "balance" as const,
            paddingBottom: 8,
            borderBottom: activeSection === section.id ? "2px solid var(--brand)" : "2px solid transparent",
            transition: "border-color .2s ease",
            display: "flex",
            alignItems: "baseline",
            gap: "10px",
          }}
        >
          {activeSection === section.id && (
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--brand)", flexShrink: 0 }} />
          )}
          {section.heading}
        </h2>
        <div style={content.bodyText}>
          <MarkdownRenderer content={section.content.trim()} />
        </div>
      </section>
    ));
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: showTOC ? "200px 1fr" : "1fr",
        gap: "36px",
        maxWidth: "100ch",
        margin: "0 auto",
        padding: "24px 20px 48px",
        alignItems: "start",
      }}
    >
      {/* Table of Contents sidebar */}
      {showTOC && (
        <aside style={{ ...sidebar.container, position: "sticky" as const, top: 28, maxHeight: "calc(100vh - 56px)", overflowY: "auto" }}>
          <button onClick={() => setShowTOC(false)} style={{ position: "absolute", top: 8, right: 8, background: "none", border: "none", fontSize: 14, cursor: "pointer", color: "var(--text-secondary)", padding: 4, lineHeight: 1 }}>
            ✕
          </button>

          <h3 style={{ ...sidebar.title, paddingRight: 20 }}>
            📑 Contents ({tocItems.length})
          </h3>

          <nav>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "2px" }}>
              {tocItems.map((item, idx) => (
                <li key={idx}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      const element = document.getElementById(item.id);
                      if (element) {
                        element.scrollIntoView({ behavior: "smooth", block: "start" });
                        setActiveSection(item.id);
                      }
                    }}
                    style={{
                      display: "block",
                      padding: "5px 8px",
                      borderRadius: 3,
                      fontSize: item.level === 2 ? "11px" : "10px",
                      fontWeight: activeSection === item.id ? 500 : 400,
                      color: activeSection === item.id ? "var(--brand)" : "var(--text-secondary)",
                      background: activeSection === item.id ? "var(--tag-bg-light)" : "transparent",
                      textDecoration: "none",
                      paddingLeft: item.level === 3 ? "16px" : "8px",
                      transition: "all .15s ease",
                      borderLeft: activeSection === item.id ? "2px solid var(--brand)" : "2px solid transparent",
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
        </aside>
      )}

      {!showTOC && (
        <button
          onClick={() => setShowTOC(true)}
          style={{
            position: "fixed",
            left: 20,
            top: 120,
            padding: "8px 14px",
            borderRadius: "var(--radius-sm)",
            background: "var(--ivory)",
            border: "0.5px solid var(--border-warm)",
            boxShadow: "var(--shadow-ring)",
            fontSize: 12,
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

      <main>
        <header style={{ marginBottom: 28, paddingBottom: 20, borderBottom: "2px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: 12 }}>
            <span style={header.badge}>{skill.category.icon} {skill.category.label}</span>
            <span style={{ fontSize: 10, color: "var(--text-secondary)", fontFamily: "var(--font-sans)" }}>{skill.stats.readTime} · {skill.stats.lineCount} lines</span>
          </div>

          <h1 style={{ ...header.h1, marginBottom: 10, textWrap: "balance" as const }}>{skill.name}</h1>

          <p style={{ ...header.desc, maxWidth: "60ch", borderLeft: "2px solid var(--brand)", paddingLeft: 12, marginLeft: 4 }}>{skill.description}</p>
        </header>

        <section style={preview.section}>
          <div style={preview.label}>Generated Output Preview</div>
          <SkillPreview skill={skill} />
        </section>

        {renderContentWithSections()}
      </main>
    </div>
  );
}
