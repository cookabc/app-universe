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
      const f = all.filter((s) =>
        s.id !== currentId && s.category.key === cur.category.key
      ).slice(0, 4);
      setRel(f);
    });
  }, [currentId]);

  if (!rel.length) return null;

  const cardStyle = {
    textDecoration: "none" as const,
    flexShrink: 0,
    minWidth: "180px",
    padding: "14px 18px",
    borderRadius: "var(--radius-md)",
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    transition: "border-color .2s ease, background-color .2s ease",
  };

  return (
    <div style={{ marginTop: "40px", paddingTop: "24px", borderTop: "1px solid var(--border)" }}>
      <h3 style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "16px" }}>
        🔗 Related Skills ({cl})
      </h3>
      <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "8px" }}>
        {rel.map((s) => (
          <Link key={s.id} to={`/skill/${s.id}`} style={cardStyle}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = s.category.color; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; }}
          >
            <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "4px" }}>{s.name}</div>
            <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>{s.category.icon} {s.category.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
