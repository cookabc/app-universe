import { useState } from "react";
import MarkdownRenderer from "../../common/MarkdownRenderer";
import SkillPreview from "../../Demos/SkillPreview";
import { stripLeadingH1 } from "../../../utils/markdownParser";
import { header, preview, content } from "./layoutTokens";
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
      <header style={{ marginBottom: 28, paddingBottom: 20, ...header.borderStyle }}>
        <nav style={{ fontSize: 11, color: "var(--stone)", marginBottom: 10, fontFamily: "var(--font-sans)", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ color: "var(--brand)" }}>{skill.category.icon}</span>
          <span>{skill.category.label}</span>
          <span style={{ color: "var(--olive)" }}>›</span>
          <span style={{ fontWeight: 500, color: "var(--text-primary)" }}>Tutorial</span>
        </nav>

        <h1 style={{ ...header.h1, marginBottom: 12, textWrap: "balance" as const }}>{skill.name}</h1>

        <p style={{ ...header.desc, maxWidth: "60ch", borderLeft: "2px solid var(--brand)", paddingLeft: 12 }}>{skill.description}</p>
      </header>

      <section style={preview.section}>
        <div style={preview.label}>Generated Output</div>
        <SkillPreview skill={skill} />
      </section>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: activeTab === "content" ? "1fr" : "1fr 400px",
          gap: "28px",
          alignItems: "start",
        }}
      >
        <main>
          <section
            style={{
              background: "white",
              padding: "24px 28px",
              borderRadius: 8,
              border: "0.5px solid var(--border-warm)",
              boxShadow: "var(--shadow-whisper)",
            }}
          >
            <MarkdownRenderer content={stripLeadingH1(skill.content)} />
          </section>
        </main>

        {activeTab === "examples" && codeBlocks.length > 0 && (
          <aside style={{ position: "sticky" as const, top: 24, maxHeight: "calc(100vh - 48px)", overflowY: "auto" }}>
            <div style={{ padding: 20, borderRadius: 8, background: "var(--near-black)", border: "0.5px solid var(--dark-surface)", boxShadow: "var(--shadow-ring)" }}>
              <h3 style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 500, color: "#e5e5e5", marginBottom: 16, paddingBottom: 10, borderBottom: "0.5px solid #444", display: "flex", alignItems: "center", justifyContent: "space-between", lineHeight: 1.3 }}>
                <span>💻 Code Examples ({codeBlocks.length})</span>
                <button onClick={() => setActiveTab("content")} style={{ background: "none", border: "0.5px solid #555", color: "#aaa", padding: "4px 10px", borderRadius: 3, fontSize: 11, cursor: "pointer", fontFamily: "var(--font-sans)" }}>
                  ✕ Close
                </button>
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {codeBlocks.map((block, i) => (
                  <div key={i}>
                    <div style={{ fontSize: 10, color: "#888", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 6, fontFamily: "var(--font-sans)" }}>
                      Example {i + 1} · {block.language || "code"}
                    </div>
                    <pre style={{ margin: 0, padding: 14, borderRadius: 6, background: "#252526", overflowX: "auto", fontSize: 11, fontFamily: "var(--font-mono)", lineHeight: 1.6, border: "0.5px solid #333" }}>
                      <code style={{ color: "#d4d4d4" }}>{block.code}</code>
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        )}
      </div>

      {codeBlocks.length > 0 && activeTab !== "examples" && (
        <button
          onClick={() => setActiveTab("examples")}
          style={{
            position: "fixed",
            bottom: 32,
            right: 32,
            padding: "12px 20px",
            borderRadius: 8,
            background: "var(--brand)",
            color: "white",
            border: "none",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "var(--shadow-whisper)",
            transition: "transform .15s ease, box-shadow .15s ease",
            zIndex: 100,
            fontFamily: "var(--font-sans)",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
          onMouseDown={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(0.98)"; }}
          onMouseUp={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
        >
          💻 View Examples ({codeBlocks.length})
        </button>
      )}
    </div>
  );
}
