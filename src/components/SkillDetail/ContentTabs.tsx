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

export default function ContentTabs({ skill }: Props) {
  const [tab, setTab] = useState<TK>("overview");

  return (
    <div style={{ marginBottom: "32px", maxWidth: "65ch", margin: "0 auto" }}>
      {/* Tab bar - kami refined */}
      <div 
        role="tablist" 
        aria-label="Content tabs"
        style={{
          display: "flex",
          gap: "0",
          borderBottom: "1px solid var(--border-soft)",
          overflowX: "auto",
          marginBottom: "20px",
        }}
      >
        {TABS.map((t) => (
          <button
            key={t.k}
            role="tab"
            aria-selected={tab === t.k}
            onClick={() => setTab(t.k)}
            style={{
              padding: "10px 16px",
              border: "none",
              background: "none",
              color: tab === t.k ? "var(--text-primary)" : "var(--stone)",
              fontSize: "12px",
              fontWeight: 500,
              cursor: "pointer",
              borderBottom: tab === t.k ? "2px solid var(--brand)" : "2px solid transparent",
              transition: "color .15s ease, border-bottom-color .15s ease",
              whiteSpace: "nowrap",
              letterSpacing: "0.3px",
              fontFamily: "var(--font-sans)",
            }}
            onMouseDown={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "scale(0.96)";
            }}
            onMouseUp={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "scale(1)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "scale(1)";
            }}
          >
            {t.l}
          </button>
        ))}
      </div>
      <div style={{ animation: "fadeInUp .3s ease", padding: "0 4px" }}>
        {tab === "overview" && <Overview skill={skill} />}
        {tab === "doc" && (
          <div style={{ textAlign: "left" }}>
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "22px",
                fontWeight: 500,
                marginBottom: "12px",
                color: "var(--text-primary)",
                textWrap: "balance",
              }}
            >
              {skill.name}
            </h2>
            <p
              style={{
                color: "var(--text-secondary)",
                lineHeight: 1.5,
                fontSize: "14px",
                marginBottom: "24px",
                textWrap: "pretty",
              }}
            >
              {skill.description}
            </p>
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
      <h3 
        style={{ 
          fontFamily: "var(--font-serif)",
          fontSize: "16px", 
          fontWeight: 500, 
          marginBottom: "16px",
          textWrap: "balance",
        }}
      >
        What is this?
      </h3>
      <p
        style={{
          color: "var(--text-secondary)",
          lineHeight: 1.5,
          fontSize: "14px",
          marginBottom: "24px",
          textWrap: "pretty",
        }}
      >
        {skill.description || "No description provided."}
      </p>
      {skill.keyFeatures.length > 0 && (
        <>
          <h3 
            style={{ 
              fontFamily: "var(--font-serif)",
              fontSize: "14px", 
              fontWeight: 500, 
              marginBottom: "12px",
              color: "var(--brand)",
            }}
          >
            Key Features
          </h3>
          <ul
            style={{
              listStyle: "none",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "8px",
              marginBottom: "24px",
            }}
          >
            {skill.keyFeatures.map((f, i) => (
              <li
                key={i}
                style={{
                  padding: "10px 14px",
                  borderRadius: "3px",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-soft)",
                  fontSize: "12px",
                  color: "var(--text-secondary)",
                  lineHeight: 1.4,
                  transition: "border-color .15s ease",
                }}
              >
                {f}
              </li>
            ))}
          </ul>
        </>
      )}
      {skill.useCases.length > 0 && (
        <>
          <h3 
            style={{ 
              fontFamily: "var(--font-serif)",
              fontSize: "14px", 
              fontWeight: 500, 
              marginBottom: "12px",
              color: "var(--brand)",
            }}
          >
            Use Cases
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "24px" }}
          >
            {skill.useCases.map((uc, i) => (
              <div
                key={i}
                style={{
                  padding: "10px 14px",
                  borderRadius: "3px",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-soft)",
                  display: "flex",
                  alignItems: "baseline",
                  gap: "10px",
                  transition: "border-color .15s ease",
                }}
              >
                <span style={{ fontSize: "14px", flexShrink: 0 }}>{uc.icon}</span>
                <div>
                    <div style={{ fontWeight: 600, fontSize: "13px", color: "var(--text-primary)" }}>{uc.title}</div>
                    {uc.description !== uc.title && (
                      <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
                        {uc.description}
                      </div>
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
      <p style={{ color: "var(--text-secondary)", fontSize: "13px", marginBottom: "16px" }}>
        Found {blocks.length} code example{blocks.length !== 1 ? "s" : ""}
      </p>
      {blocks.map((b, i) => (
        <div
          key={i}
          style={{
            marginBottom: "16px",
            borderRadius: "var(--radius-sm)",
            background: "var(--bg-card)",
            border: "1px solid var(--border-soft)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "6px 14px",
              background: "var(--bg-secondary)",
              fontSize: "12px",
              fontFamily: "var(--font-mono)",
              color: "var(--text-secondary)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              letterSpacing: "0.3px",
            }}
          >
            <span>{b.language || "code"}</span>
            <span>#{i + 1}</span>
          </div>
          <pre
            style={{
              margin: 0,
              padding: "14px",
              overflowX: "auto",
              fontSize: "12px",
              fontFamily: "var(--font-mono)",
              lineHeight: 1.6,
              fontVariantNumeric: "tabular-nums",
            }}
          >
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
            <span style={{ color: "var(--stone)" }}>{open ? "▾" : "▸"}</span>
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
        <span style={{ visibility: "hidden", width: "10px" }}>▸</span>
        <span>{node.name}</span>
        {node.size != null ? (
          <span style={{ marginLeft: "auto", color: "var(--text-secondary)", fontVariantNumeric: "tabular-nums", fontSize: "11px" }}>
            {(node.size / 1024).toFixed(1)}KB
          </span>
        ) : null}
      </div>
    );
  }
  return (
    <div
      style={{
        borderRadius: "var(--radius-sm)",
        background: "var(--bg-card)",
        border: "1px solid var(--border-soft)",
        padding: "14px",
        fontFamily: "var(--font-mono)",
        fontSize: "12px",
      }}
    >
      <div style={{ marginBottom: "8px", fontWeight: 600, color: "var(--brand)", fontSize: "12px" }}>
        {tree?.name || skill.id}/
      </div>
      {tree?.children?.map((c: any, i: number) => <FileNode key={i} node={c} depth={0} />) || (
        <div style={{ color: "var(--text-secondary)" }}>No files found</div>
      )}
    </div>
  );
}
