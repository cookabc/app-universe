import { useState } from "react";
import MarkdownRenderer from "../common/MarkdownRenderer";
import type { SkillData } from "../../data/skills";
import { extractCodeBlocks } from "../../utils/markdownParser";

interface Props {
  skill: SkillData;
}

const TABS = [
  { k: "overview", l: "Overview" },
  { k: "doc", l: "Full Doc" },
  { k: "examples", l: "Code Examples" },
  { k: "files", l: "Files" },
] as const;

type TK = (typeof TABS)[number]["k"];

const tabStyles = {
  wrapper: { marginBottom: "32px", maxWidth: "65ch", margin: "0 auto" },
  tabBar: {
    display: "flex",
    gap: "0",
    borderBottom: "1px solid var(--border-soft)",
    overflowX: "auto",
    marginBottom: "24px",
  },
  tabBtn: {
    padding: "10px 18px",
    border: "none",
    background: "none",
    color: "var(--text-muted)",
    fontSize: "12px",
    fontWeight: 500,
    cursor: "pointer",
    borderBottom: "2px solid transparent",
    transition:
      "color var(--duration-fast) var(--ease-out), border-color var(--duration-fast) var(--ease-out), transform var(--duration-fast) var(--ease-out)",
    whiteSpace: "nowrap" as const,
    letterSpacing: "0.3px",
    fontFamily: "var(--font-sans)",
    outline: "none",
  },
  contentArea: {
    opacity: 1,
    transform: "translateY(0)",
    transition:
      "opacity var(--duration-normal) var(--ease-out), transform var(--duration-normal) var(--ease-out)",
    padding: "0 4px",
  },
  sectionTitle: {
    fontFamily: "var(--font-display)",
    fontSize: "18px",
    fontWeight: 400,
    marginBottom: "16px",
    textWrap: "balance" as const,
    letterSpacing: "-0.01em",
  },
  subTitle: {
    fontFamily: "var(--font-display)",
    fontSize: "15px",
    fontWeight: 400,
    marginBottom: "12px",
    color: "var(--brand)",
    textWrap: "balance" as const,
  },
  bodyText: {
    color: "var(--text-secondary)",
    lineHeight: 1.6,
    fontSize: "14px",
    marginBottom: "24px",
    textWrap: "pretty" as const,
  },
  featureGrid: {
    listStyle: "none",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "8px",
    marginBottom: "24px",
  },
  featureItem: {
    padding: "10px 14px",
    borderRadius: "var(--radius-sm)",
    background: "var(--bg-surface)",
    border: "1px solid var(--border-soft)",
    fontSize: "13px",
    color: "var(--text-secondary)",
    lineHeight: 1.4,
    transition: "border-color var(--duration-fast) var(--ease-out)",
  },
  useCaseList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "8px",
    marginBottom: "24px",
  },
  useCaseItem: {
    padding: "12px 16px",
    borderRadius: "var(--radius-sm)",
    background: "var(--bg-surface)",
    border: "1px solid var(--border-soft)",
    display: "flex",
    alignItems: "baseline",
    gap: "12px",
    transition: "border-color var(--duration-fast) var(--ease-out)",
  },
  useCaseBullet: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "var(--brand)",
    flexShrink: 0,
    marginTop: "6px",
  },
  useCaseTitle: {
    fontWeight: 600,
    fontSize: "13px",
    color: "var(--text-primary)",
  },
  useCaseDesc: {
    fontSize: "12px",
    color: "var(--text-secondary)",
    marginTop: "2px",
  },
  codeBlockWrap: {
    marginBottom: "16px",
    borderRadius: "var(--radius-md)",
    background: "var(--bg-card)",
    border: "1px solid var(--border-soft)",
    overflow: "hidden",
  },
  codeHeader: {
    padding: "8px 16px",
    background: "var(--bg-secondary)",
    fontSize: "11px",
    fontFamily: "var(--font-mono)",
    color: "var(--text-secondary)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    letterSpacing: "0.3px",
  },
  codePre: {
    margin: 0,
    padding: "16px",
    overflowX: "auto",
    fontSize: "12px",
    fontFamily: "var(--font-mono)",
    lineHeight: 1.65,
    fontVariantNumeric: "tabular-nums" as const,
  },
  fileTree: {
    borderRadius: "var(--radius-md)",
    background: "var(--bg-card)",
    border: "1px solid var(--border-soft)",
    padding: "16px",
    fontFamily: "var(--font-mono)",
    fontSize: "12px",
  },
  fileTreeHeader: {
    marginBottom: "10px",
    fontWeight: 600,
    color: "var(--brand)",
    fontSize: "12px",
  },
};

export default function ContentTabs({ skill }: Props) {
  const [tab, setTab] = useState<TK>("overview");

  return (
    <div style={tabStyles.wrapper}>
      <div role="tablist" aria-label="Content tabs" style={tabStyles.tabBar}>
        {TABS.map((t) => (
          <button
            key={t.k}
            role="tab"
            aria-selected={tab === t.k}
            onClick={() => setTab(t.k)}
            onMouseDown={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "scale(0.98)";
            }}
            onMouseUp={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "scale(1)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "scale(1)";
            }}
            style={{
              ...tabStyles.tabBtn,
              color: tab === t.k ? "var(--text-primary)" : "var(--text-muted)",
              borderBottomColor: tab === t.k ? "var(--brand)" : "transparent",
            }}
          >
            {t.l}
          </button>
        ))}
      </div>

      <div style={tabStyles.contentArea}>
        {tab === "overview" && <Overview skill={skill} />}
        {tab === "doc" && (
          <div style={{ textAlign: "left" }}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "22px",
                fontWeight: 400,
                marginBottom: "12px",
                color: "var(--text-primary)",
                textWrap: "balance",
                letterSpacing: "-0.02em",
              }}
            >
              {skill.name}
            </h2>
            <p style={tabStyles.bodyText}>{skill.description}</p>
            <MarkdownRenderer content={skill.content} />
          </div>
        )}
        {tab === "examples" && <Examples skill={skill} />}
        {tab === "files" && <Files skill={skill} />}
      </div>
    </div>
  );
}

function Overview({ skill }: Props) {
  return (
    <div style={{ padding: "8px 0" }}>
      <h3 style={tabStyles.sectionTitle}>What is this?</h3>
      <p style={tabStyles.bodyText}>
        {skill.description || "No description provided."}
      </p>
      {skill.keyFeatures.length > 0 && (
        <>
          <h3 style={tabStyles.subTitle}>Key Features</h3>
          <ul style={tabStyles.featureGrid}>
            {skill.keyFeatures.map((f, i) => (
              <li key={i} style={tabStyles.featureItem}>
                {f}
              </li>
            ))}
          </ul>
        </>
      )}
      {skill.useCases.length > 0 && (
        <>
          <h3 style={tabStyles.subTitle}>Use Cases</h3>
          <div style={tabStyles.useCaseList}>
            {skill.useCases.map((uc, i) => (
              <div key={i} style={tabStyles.useCaseItem}>
                <span style={tabStyles.useCaseBullet} />
                <div>
                  <div style={tabStyles.useCaseTitle}>{uc.title}</div>
                  {uc.description !== uc.title && (
                    <div style={tabStyles.useCaseDesc}>{uc.description}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function Examples({ skill }: Props) {
  const blocks = extractCodeBlocks(skill.content);
  return (
    <div>
      <p style={{ ...tabStyles.bodyText, marginBottom: "16px" }}>
        Found {blocks.length} code example{blocks.length !== 1 ? "s" : ""}
      </p>
      {blocks.map((b, i) => (
        <div key={i} style={tabStyles.codeBlockWrap}>
          <div style={tabStyles.codeHeader}>
            <span>{b.language || "code"}</span>
            <span>#{i + 1}</span>
          </div>
          <pre style={tabStyles.codePre}>
            <code>{b.code}</code>
          </pre>
        </div>
      ))}
    </div>
  );
}

function Files({ skill }: Props) {
  const tree = skill.fileInfo.tree;

  function FileNode({ node, depth }: { node: any; depth: number }) {
    const [open, setOpen] = useState(depth < 1);

    if (node.type === "dir")
      return (
        <div>
          <button
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "3px 0",
              marginLeft: depth * 16,
              background: "none",
              border: "none",
              color: "var(--text-primary)",
              cursor: "pointer",
              fontSize: "12px",
              width: "100%",
              textAlign: "left",
              fontFamily: "var(--font-mono)",
            }}
          >
            <span style={{ color: "var(--text-muted)" }}>
              {open ? "\u25BE" : "\u25B8"}
            </span>
            <span>{node.name}/</span>
          </button>
          {open &&
            node.children?.map((c: any, j: number) => (
              <FileNode key={j} node={c} depth={depth + 1} />
            ))}
        </div>
      );

    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "3px 0",
          marginLeft: depth * 16,
          fontSize: "12px",
          color: "var(--text-secondary)",
          fontFamily: "var(--font-mono)",
        }}
      >
        <span style={{ visibility: "hidden", width: "10px" }}>&#x25B8;</span>
        <span>{node.name}</span>
        {node.size != null ? (
          <span
            style={{
              marginLeft: "auto",
              color: "var(--text-muted)",
              fontVariantNumeric: "tabular-nums",
              fontSize: "11px",
            }}
          >
            {(node.size / 1024).toFixed(1)}KB
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <div style={tabStyles.fileTree}>
      <div style={tabStyles.fileTreeHeader}>{tree?.name || skill.id}/</div>
      {tree?.children?.map((c: any, i: number) => (
        <FileNode key={i} node={c} depth={0} />
      )) || (
        <div style={{ color: "var(--text-secondary)" }}>No files found</div>
      )}
    </div>
  );
}
