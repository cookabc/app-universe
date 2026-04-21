import { useState } from "react";
import type { SkillData } from "../../data/skills";

interface Props {
  skill: SkillData;
}

export default function SkillHeroBanner({ skill }: Props) {
  const [copied, setCopied] = useState(false);
  const cat = skill.category;
  const isSimple = skill.stats.complexityLabel === "Simple";

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
        animation: "fadeInUp .4s ease",
      }}
    >
      {/* Eyebrow - kami style */}
      <div
        style={{
          fontSize: "10px",
          color: "var(--brand)",
          letterSpacing: "1.5px",
          textTransform: "uppercase",
          marginBottom: "8px",
          fontWeight: 500,
        }}
      >
        {cat.icon} {cat.label} · {isSimple ? "One-Pager" : "Long Doc"}
      </div>

      {/* Title with subtle weight */}
      <h1
        style={{
          fontSize: "clamp(24px, 4vw, 36px)",
          fontWeight: 500,
          fontFamily: "var(--font-serif)",
          color: "var(--text-primary)",
          lineHeight: 1.15,
          textWrap: "balance",
          marginBottom: "12px",
        }}
      >
        {skill.name}
      </h1>

      {/* Subtitle */}
      <p
        style={{
          fontFamily: "var(--font-serif)",
          color: "var(--text-secondary)",
          fontSize: "clamp(15px, 2vw, 18px)",
          lineHeight: 1.5,
          textWrap: "pretty",
          marginBottom: "20px",
          marginLeft: "19px",
          maxWidth: "55ch",
        }}
      >
        {skill.description || "No description available."}
      </p>

      {/* Stats row */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: "16px",
          flexWrap: "wrap",
          marginLeft: "19px",
        }}
      >
        <div style={{ display: "flex", gap: "14px", fontVariantNumeric: "tabular-nums" }}>
          {[
            [skill.stats.lineCount, "lines"],
            [skill.fileInfo.totalFiles, "files"],
          ].map(([v, l], i) => (
            <span key={i} style={{ fontSize: "13px" }}>
              <strong style={{ color: "var(--brand)", fontWeight: 600, fontSize: "16px" }}>{v}</strong>
              <span style={{ color: "var(--stone)", marginLeft: "4px" }}>{l}</span>
            </span>
          ))}
          <span style={{ fontSize: "13px", color: "var(--olive)" }}>{skill.stats.complexityLabel}</span>
        </div>

        {skill.installCommand && (
          <button
            onClick={handleCopy}
            style={{
              marginLeft: "auto",
              padding: "6px 14px",
              borderRadius: "3px",
              border: copied ? "1px solid var(--success)" : "1px solid var(--border-soft)",
              background: copied ? "rgba(34,197,94,0.08)" : "transparent",
              color: copied ? "var(--success)" : "var(--text-secondary)",
              fontSize: "11px",
              fontFamily: "var(--font-mono)",
              cursor: "pointer",
              transition: "all .15s ease",
              letterSpacing: "0.3px",
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
            {copied ? "Copied" : "Copy install cmd"}
          </button>
        )}
      </div>
    </article>
  );
}
