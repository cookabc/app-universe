import { useState } from "react";
import type { SkillData } from "../../data/skills";

interface Props {
  skill: SkillData;
}

export default function SkillHeroBanner({ skill }: Props) {
  const [copied, setCopied] = useState(false);
  const cat = skill.category;

  const handleCopy = async () => {
    if (skill.installCommand) {
      await navigator.clipboard.writeText(skill.installCommand);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <article
      style={{
        marginBottom: "32px",
        padding: "32px 20px",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
        <span
          style={{
            display: "inline-block",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            padding: "8px 12px",
            borderRadius: "6px",
            background: cat.color + "14",
            color: cat.color,
            border: `1px solid ${cat.color}30`,
          }}
        >
          {cat.label}
        </span>
      </div>

      <h1
        style={{
          fontSize: "clamp(24px, 4vw, 36px)",
          fontWeight: 700,
          color: "var(--text-primary)",
          lineHeight: 1.2,
          textWrap: "balance",
          letterSpacing: "-0.02em",
          marginBottom: "12px",
        }}
      >
        {skill.name}
      </h1>

      <p
        style={{
          color: "var(--text-secondary)",
          fontSize: "15px",
          lineHeight: 1.7,
          maxWidth: "65ch",
          margin: "0 auto 20px",
          textAlign: "center",
        }}
      >
        {skill.description || "No description available."}
      </p>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          flexWrap: "wrap",
          fontSize: "13px",
          fontFamily: "var(--font-mono)",
        }}
      >
        <div style={{ display: "flex", gap: "20px", color: "var(--text-secondary)" }}>
          <span>{skill.stats.lineCount} lines</span>
          <span>{skill.fileInfo.totalFiles} files</span>
          <span>{skill.stats.complexityLabel}</span>
        </div>

        {skill.installCommand && (
          <button
            onClick={handleCopy}
            style={{
              marginLeft: "auto",
              padding: "6px 14px",
              borderRadius: "6px",
              border: "1px solid var(--border)",
              background: "transparent",
              color: copied ? "var(--success)" : "var(--text-secondary)",
              fontSize: "12px",
              fontFamily: "var(--font-mono)",
              cursor: "pointer",
              transition: "border-color .15s ease, color .15s ease",
            }}
          >
            {copied ? "Copied" : "Copy install cmd"}
          </button>
        )}
      </div>
    </article>
  );
}
