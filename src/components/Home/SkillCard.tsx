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
          borderRadius: "var(--radius-lg)",
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          overflow: "hidden",
          cursor: "pointer",
          animation: `fadeInUp .5s ease ${index * 0.05}s both`,
          transition: "border-color .2s ease,transform .2s ease,box-shadow .2s ease",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = cat.color;
          el.style.transform = "translateY(-4px)";
          el.style.boxShadow = `0 8px 32px ${cat.color}20`;
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = "var(--border)";
          el.style.transform = "translateY(0)";
          el.style.boxShadow = "none";
        }}
      >
        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: cat.color,
                opacity: 0.7,
                fontFamily: "var(--font-mono)",
              }}
            >
              {num}
            </span>
            <span
              style={{
                fontSize: "11px",
                padding: "2px 8px",
                borderRadius: "10px",
                background: cat.color + "18",
                color: cat.color,
                fontWeight: 500,
              }}
            >
              {cat.label}
            </span>
          </div>
          <h3 style={{ fontSize: "15px", fontWeight: 600, lineHeight: 1.3 }}>{skill.name}</h3>
          <p
            style={{
              fontSize: "13px",
              color: "var(--text-secondary)",
              lineHeight: 1.5,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {skill.description || "No description available"}
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginTop: "4px",
              fontSize: "11px",
              color: "var(--text-secondary)",
              fontFamily: "var(--font-mono)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            <span>{skill.stats.lineCount} lines</span>
            <span>·</span>
            <span>{skill.fileInfo.totalFiles} files</span>
            <span>·</span>
            <span>{skill.stats.complexityLabel}</span>
          </div>
        </div>
        <div
          style={{
            height: "2px",
            background: `linear-gradient(90deg,${cat.color},transparent)`,
            opacity: 0.5,
          }}
        />
      </article>
    </Link>
  );
}
