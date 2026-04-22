import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAllSkills, type SkillData } from "../../data/skills";

interface Props {
  currentId: string;
}

export default function RelatedSkills({ currentId }: Props) {
  const [rel, setRel] = useState<SkillData[]>([]);
  const [cl, setCl] = useState("");

  useEffect(() => {
    getAllSkills().then((all) => {
      const cur = all.find((s) => s.id === currentId);
      if (!cur) return;
      setCl(cur.category.label);
      const f = all
        .filter(
          (s) => s.id !== currentId && s.category.key === cur.category.key,
        )
        .slice(0, 4);
      setRel(f);
    });
  }, [currentId]);

  if (!rel.length) return null;

  return (
    <div
      style={{
        marginTop: "40px",
        padding: "24px 16px",
        borderTop: "0.5px dashed var(--border-warm)",
        maxWidth: "65ch",
        margin: "0 auto",
      }}
    >
      {/* Section Title - kami standard */}
      <h3
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "14px",
          fontWeight: 500,
          color: "var(--brand)",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          lineHeight: 1.2,
        }}
      >
        <span
          style={{
            width: "3px",
            height: "16px",
            background: "var(--brand)",
            display: "inline-block",
            flexShrink: 0,
          }}
        />
        Related Skills ({cl})
      </h3>
      <div
        style={{
          display: "flex",
          gap: "12px",
          overflowX: "auto",
          paddingBottom: "8px",
        }}
      >
        {rel.map((s) => (
          <Link
            key={s.id}
            to={`/skill/${s.id}`}
            style={{
              textDecoration: "none" as const,
              flexShrink: 0,
              minWidth: "180px",
              padding: "14px 18px",
              borderRadius: "8px",
              background: "var(--ivory)",
              border: "0.5px solid var(--border-warm)",
              boxShadow: "var(--shadow-whisper)",
              transition: "border-color .2s ease, box-shadow .2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor =
                "var(--brand)";
              (e.currentTarget as HTMLElement).style.boxShadow =
                "var(--shadow-ring)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor =
                "var(--border-warm)";
              (e.currentTarget as HTMLElement).style.boxShadow =
                "var(--shadow-whisper)";
            }}
          >
            <div
              style={{
                fontSize: "13px",
                fontWeight: 500,
                marginBottom: "4px",
                color: "var(--text-primary)",
                fontFamily: "var(--font-serif)",
              }}
            >
              {s.name}
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "var(--stone)",
                fontFamily: "var(--font-sans)",
              }}
            >
              {s.category.icon} {s.category.label}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
