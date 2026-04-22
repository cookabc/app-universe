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
        marginBottom: "36px",
        paddingBottom: "28px",
        borderBottom: "3px double var(--border)",
        opacity: 1,
        transform: "translateY(0)",
        transition: "opacity .3s ease, transform .3s ease",
      }}
    >
      {/* Top row: category tag + layout badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}
      >
        {/* Category - kami tag solid hex */}
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            padding: "3px 10px",
            borderRadius: "2px",
            background: "var(--brand)",
            color: "white",
            fontSize: "9px",
            fontWeight: 600,
            letterSpacing: "0.6px",
            textTransform: "uppercase",
            fontFamily: "var(--font-sans)",
          }}
        >
          {cat.icon} {cat.label}
        </span>

        {/* Layout type indicator */}
        <span
          style={{
            padding: "2px 8px",
            borderRadius: "2px",
            background: "var(--tag-bg-light)",
            fontSize: "9px",
            fontWeight: 600,
            color: "var(--olive)",
            letterSpacing: "0.4px",
            textTransform: "uppercase",
            fontFamily: "var(--font-mono)",
          }}
        >
          {skill.stats.complexityLabel}
        </span>
      </div>

      {/* Title — H1 Section size */}
      <h1
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "clamp(28px, 5vw, 40px)",
          fontWeight: 500,
          lineHeight: 1.15,
          color: "var(--text-primary)",
          marginBottom: "12px",
          textWrap: "balance",
          letterSpacing: "-0.01em",
        }}
      >
        {skill.name}
      </h1>

      {/* Description — Quote block: olive + 2pt brand left */}
      <p
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "16px",
          fontWeight: 400,
          lineHeight: 1.5,
          color: "var(--olive)",
          maxWidth: "55ch",
          marginTop: "14px",
          marginBottom: "24px",
          textWrap: "pretty",
          borderLeft: "2px solid var(--brand)",
          paddingLeft: "12px",
          marginLeft: "2px",
        }}
      >
        {skill.description || "No description available."}
      </p>

      {/* Metric cards row + copy button */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          flexWrap: "wrap",
        }}
      >
        {/* Metric cards */}
        {[
          [String(skill.stats.lineCount), "Lines"],
          [String(skill.fileInfo.totalFiles), "Files"],
          [skill.stats.readTime, "Read"],
        ].map(([value, label], i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "5px",
              padding: "7px 14px",
              borderRadius: "6px",
              background: "var(--ivory)",
              border: "0.5px solid var(--border-cream)",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "17px",
                fontWeight: 500,
                color: "var(--brand)",
                fontVariantNumeric: "tabular-nums",
                lineHeight: 1.15,
              }}
            >
              {value}
            </span>
            <span
              style={{
                fontSize: "10px",
                color: "var(--olive)",
                fontFamily: "var(--font-sans)",
                fontWeight: 500,
              }}
            >
              {label}
            </span>
          </div>
        ))}

        {/* Copy button — kami Secondary button style */}
        {skill.installCommand && (
          <button
            onClick={handleCopy}
            style={{
              marginLeft: "auto",
              padding: "7px 16px",
              borderRadius: "8px",
              border: "none",
              background: copied ? "var(--tag-bg-default)" : "var(--warm-sand)",
              color: copied ? "var(--brand)" : "var(--charcoal)",
              fontSize: "11px",
              fontWeight: 600,
              fontFamily: "var(--font-sans)",
              cursor: "pointer",
              boxShadow: copied ? "var(--shadow-ring)" : "var(--shadow-ring)",
              transition:
                "background .15s ease, color .15s ease, box-shadow .15s ease, transform .15s ease",
              letterSpacing: "0.3px",
              textTransform: "uppercase",
            }}
            onMouseDown={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "scale(0.98)";
            }}
            onMouseUp={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "scale(1)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "scale(1)";
            }}
          >
            {copied ? "✓ Copied" : "Copy Install"}
          </button>
        )}
      </div>
    </article>
  );
}
