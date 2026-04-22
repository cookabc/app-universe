import { Link } from "react-router-dom";
import type { SkillData } from "../../data/skills";

interface Props {
  skill: SkillData;
  index: number;
}

export default function SkillCard({ skill, index }: Props) {
  const cat = skill.category;
  const num = String(index + 1).padStart(2, "0");

  return (
    <Link
      to={`/skill/${skill.id}`}
      style={{ textDecoration: "none", color: "inherit", display: "block" }}
    >
      <article
        style={{
          borderRadius: "16px",
          background: "var(--ivory)",
          border: "0.5px solid var(--border-cream)",
          borderLeft: "3px solid transparent",
          padding: "20px 22px",
          cursor: "pointer",
          boxShadow: "var(--shadow-whisper)",
          transition:
            "border-left-color .2s ease, box-shadow .2s ease, transform .15s ease",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderLeftColor = "var(--brand)";
          el.style.boxShadow = "var(--shadow-ring), var(--shadow-whisper)";
        }}
        onMouseDown={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.transform = "scale(0.98)";
        }}
        onMouseUp={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.transform = "scale(1)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderLeftColor = "transparent";
          el.style.boxShadow = "var(--shadow-whisper)";
          el.style.transform = "scale(1)";
        }}
      >
        {/* Top row: number + category tag */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "12px",
          }}
        >
          {/* Number - mono, brand color */}
          <span
            style={{
              fontSize: "12px",
              fontWeight: 500,
              color: "var(--brand)",
              fontFamily: "var(--font-mono)",
              fontVariantNumeric: "tabular-nums",
              opacity: 0.7,
            }}
          >
            {num}
          </span>

          {/* Category tag - kami solid hex style */}
          <span
            style={{
              fontSize: "9px",
              fontWeight: 600,
              color: "var(--brand)",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              fontFamily: "var(--font-sans)",
              padding: "2px 8px",
              borderRadius: "2px",
              background: "var(--tag-bg-light)",
            }}
          >
            {cat.label}
          </span>
        </div>

        {/* Title — serif 500 */}
        <h3
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "17px",
            fontWeight: 500,
            lineHeight: 1.2,
            color: "var(--text-primary)",
            marginBottom: "8px",
            textWrap: "balance",
          }}
        >
          {skill.name}
        </h3>

        {/* Description — olive body text */}
        <p
          style={{
            fontSize: "13px",
            lineHeight: 1.5,
            color: "var(--olive)",
            marginBottom: "16px",
            flex: 1,
            textWrap: "pretty",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {skill.description || "No description available"}
        </p>

        {/* Metrics row — serif number + sans label */}
        <div
          style={{
            borderTop: "0.5px solid var(--border-cream)",
            paddingTop: "12px",
            display: "flex",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          {[
            [String(skill.stats.lineCount), "lines"],
            [String(skill.fileInfo.totalFiles), "files"],
          ].map(([value, label], i) => (
            <div
              key={i}
              style={{ display: "flex", alignItems: "baseline", gap: "4px" }}
            >
              <span
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "var(--brand)",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {value}
              </span>
              <span
                style={{
                  fontSize: "10px",
                  color: "var(--stone)",
                  fontFamily: "var(--font-sans)",
                }}
              >
                {label}
              </span>
            </div>
          ))}
          <span
            style={{
              fontSize: "10px",
              color: "var(--stone)",
              fontFamily: "var(--font-sans)",
              marginLeft: "auto",
              padding: "2px 7px",
              borderRadius: "2px",
              background: "var(--tag-bg-light)",
            }}
          >
            {skill.stats.complexityLabel}
          </span>
        </div>
      </article>
    </Link>
  );
}
