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
      className="block group"
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <article
        style={{
          borderRadius: "14px",
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          overflow: "hidden",
          cursor: "pointer",
          animation: `fadeInUp .5s ease ${index * 0.06}s both`,
          transition: "border-color .2s ease, transform .2s ease, box-shadow .2s ease",
          height: "100%",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = "var(--brand)";
          el.style.transform = "translateY(-4px)";
          el.style.boxShadow = "0 8px 32px rgba(27, 54, 93, 0.12)";
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          const el = e.currentTarget as HTMLElement;
          el.style.transform = "translateY(-4px) scale(0.96)";
        }}
        onMouseUp={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.transform = "translateY(-4px)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = "var(--border)";
          el.style.transform = "translateY(0)";
          el.style.boxShadow = "none";
        }}
      >
        <div style={{ padding: "20px" }}>
          {/* Number and category tag */}
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "12px" }}>
            <span
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "var(--brand)",
                fontFamily: "var(--font-mono)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {num}
            </span>
            <span
              style={{
                fontSize: "10px",
                padding: "3px 8px",
                borderRadius: "3px",
                background: "var(--tag-bg)",
                color: "var(--brand)",
                fontWeight: 500,
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              {cat.label}
            </span>
          </div>

          {/* Title - serif font */}
          <h3
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "16px",
              fontWeight: 500,
              marginBottom: "8px",
              lineHeight: 1.3,
              color: "var(--text-primary)",
              textWrap: "balance",
            }}
          >
            {skill.name}
          </h3>

          {/* Description */}
          <p
            style={{
              fontSize: "13px",
              color: "var(--text-secondary)",
              lineHeight: 1.5,
              marginBottom: "16px",
              textWrap: "pretty",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {skill.description || "No description available"}
          </p>

          {/* Stats */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "8px",
              fontSize: "11px",
              color: "var(--stone)",
              fontFamily: "var(--font-mono)",
              fontVariantNumeric: "tabular-nums",
              borderTop: "1px solid var(--border-soft)",
              paddingTop: "12px",
            }}
          >
            <span>{skill.stats.lineCount} lines</span>
            <span>·</span>
            <span>{skill.fileInfo.totalFiles} files</span>
            <span>·</span>
            <span>{skill.stats.complexityLabel}</span>
          </div>
        </div>

        {/* Bottom accent line */}
        <div
          style={{
            height: "2px",
            background: "linear-gradient(90deg, var(--brand), transparent)",
            opacity: 0,
            transition: "opacity .2s ease",
          }}
          className="skill-card-accent"
        />
      </article>
    </Link>
  );
}
