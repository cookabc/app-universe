import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAllSkills, type SkillData } from "../../data/skills";

interface Props {
  currentId: string;
}

export default function RelatedSkills({ currentId }: Props) {
  const [related, setRelated] = useState<SkillData[]>([]);
  const [catLabel, setCatLabel] = useState("");

  useEffect(() => {
    getAllSkills().then((all) => {
      const cur = all.find((s) => s.id === currentId);
      if (!cur) return;
      setCatLabel(cur.category.label);
      const rel = all
        .filter((s) => s.id !== currentId && s.category.key === cur.category.key)
        .slice(0, 4);
      setRelated(rel);
    });
  }, [currentId]);

  if (!related.length) return null;

  return (
    <div style={{ marginTop: "40px", paddingTop: "24px", borderTop: "1px solid var(--border)" }}>
      <h3 style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "16px" }}>
        &#128279; Related Skills ({catLabel})
      </h3>
      <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "8px" }}>
        {related.map((s) => (
          <Link
            key={s.id}
            to={`/skill/${s.id}`}
            style={{
              textDecoration: "none",
              flexShrink: 0,
              minWidth: "180px",
              padding: "14px 18px",
              borderRadius: "var(--radius-md)",
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              transition: "all .2s",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = s.category.color)}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--border)")}
          >
            <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "4px" }}>{s.name}</div>
            <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
              {s.category.icon} {s.category.label}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
