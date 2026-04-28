import { useState, useEffect, useMemo } from "react";
import MarkdownRenderer from "../../common/MarkdownRenderer";
import SkillPreview from "../../Demos/SkillPreview";
import { stripLeadingH1 } from "../../../utils/markdownParser";
import { header, metaSummary, cta, preview, content } from "./layoutTokens";
import type { SkillData } from "../../../data/skills";

interface Props {
  skill: SkillData;
}

interface AnchorItem {
  id: string;
  title: string;
  level: number;
}

export default function UnifiedLayout({ skill }: Props) {
  const [showAnchorNav, setShowAnchorNav] = useState(false);

  const scrollToPreview = () => {
    const el = document.getElementById("preview-section");
    if (el) el.scrollTop = 0; // or window.scrollTo for parent
    el?.scrollIntoView?.({ behavior: "smooth", block: "start" });
  };

  const anchorItems = useMemo(() => {
    const items: AnchorItem[] = [];
    const lines = stripLeadingH1(skill.content).split("\n");

    lines.forEach((line, i) => {
      const match = line.match(/^(#{2})\s+(.+)$/);
      if (match) {
        const title = match[2].trim();
        items.push({
          id: `${title
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")}-${i}`,
          title,
          level: 2,
        });
      }
    });

    return items;
  }, [skill.content]);

  useEffect(() => {
    setShowAnchorNav(anchorItems.length >= 5);
  }, [anchorItems.length]);

  return (
    <div style={{ maxWidth: "72ch", margin: "0 auto", padding: "24px 20px 60px" }}>
      {showAnchorNav && (
        <nav
          style={{
            position: "sticky" as const,
            top: 0,
            zIndex: 100,
            background: "var(--bg-primary)",
            borderBottom: "1px solid var(--border-soft)",
            padding: "8px 4px",
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 4,
            overflowX: "auto",
            msOverflowStyle: "none" as const,
            scrollbarWidth: "none",
          }}
        >
          {anchorItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById(item.id);
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              style={{
                whiteSpace: "nowrap",
                fontSize: 10,
                fontWeight: 500,
                color: "var(--text-muted)",
                fontFamily: "var(--font-sans)",
                textTransform: "uppercase" as const,
                letterSpacing: "0.5px",
                padding: "4px 10px",
                borderRadius: "var(--radius-xs)",
                textDecoration: "none",
                transition:
                  "color var(--duration-fast) var(--ease-out), background var(--duration-fast) var(--ease-out)",
                borderLeft: "2px solid transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--brand)";
                e.currentTarget.style.borderLeftColor = "var(--brand)";
                e.currentTarget.style.background = "var(--brand-subtle)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--text-muted)";
                e.currentTarget.style.borderLeftColor = "transparent";
                e.currentTarget.style.background = "transparent";
              }}
            >
              {item.title}
            </a>
          ))}
        </nav>
      )}

      <header style={{ marginBottom: 28, paddingBottom: 20, ...header.borderStyle }}>
        <div style={{ ...header.badge, marginBottom: 10 }}>{skill.category.label}</div>

        <h1
          style={{
            ...header.h1,
            marginBottom: 12,
            textWrap: "balance" as const,
          }}
        >
          {skill.name}
        </h1>

        <p
          style={{
            ...header.desc,
            maxWidth: "55ch",
          }}
        >
          {skill.description}
        </p>

        <div style={metaSummary.container}>
          <span style={metaSummary.item}>
            <span style={metaSummary.itemValue}>{skill.stats.readTime}</span>
          </span>
          <span style={metaSummary.separator}>/</span>
          <span style={metaSummary.item}>
            <span style={metaSummary.itemValue}>{skill.stats.lineCount}</span> lines
          </span>
          <span style={metaSummary.separator}>/</span>
          <span style={metaSummary.item}>
            <span style={metaSummary.itemValue}>{skill.stats.sectionCount}</span> sections
          </span>
          <span style={metaSummary.separator}>/</span>
          <span style={metaSummary.item}>
            <span style={metaSummary.itemValue}>{skill.stats.complexityLabel}</span>
          </span>
        </div>

        <div style={cta.group}>
          <button style={cta.primary} onClick={scrollToPreview}>
            View Preview
          </button>
          <button style={cta.secondary}>{skill.keyFeatures.length} Features</button>
        </div>
      </header>

      <section id="preview-section" style={preview.card}>
        <div style={preview.label}>Generated Output Preview</div>
        <SkillPreview skill={skill} />
      </section>

      <section style={content.section}>
        <MarkdownRenderer content={stripLeadingH1(skill.content)} />
      </section>
    </div>
  );
}
