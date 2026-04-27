import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAllSkills, type SkillData } from "../../data/skills";

interface Props {
  currentId: string;
}

const rsStyles = {
  wrapper: {
    marginTop: "40px",
    padding: "24px 16px",
    borderTop: "0.5px dashed var(--border)",
    maxWidth: "65ch",
    margin: "0 auto",
  },
  title: {
    fontFamily: "var(--font-display)",
    fontSize: "14px",
    fontWeight: 500,
    color: "var(--brand)",
    marginBottom: "16px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    lineHeight: 1.2,
  },
  accentBar: {
    width: "3px",
    height: "16px",
    background: "var(--brand)",
    display: "inline-block",
    flexShrink: 0,
  },
  row: {
    display: "flex",
    gap: "12px",
    overflowX: "auto",
    paddingBottom: "8px",
  },
  card: {
    textDecoration: "none" as const,
    flexShrink: 0,
    minWidth: "180px",
    padding: "14px 18px",
    borderRadius: "var(--radius-sm)",
    background: "var(--bg-surface)",
    border: "1px solid var(--border-soft)",
    boxShadow: "var(--shadow-sm)",
    transition:
      "border-color var(--duration-normal) var(--ease-out), box-shadow var(--duration-normal) var(--ease-out), transform var(--duration-fast) var(--ease-out)",
    display: "block",
  },
  name: {
    fontSize: "13px",
    fontWeight: 500,
    marginBottom: "4px",
    color: "var(--text-primary)",
    fontFamily: "var(--font-display)",
  },
  meta: {
    fontSize: "11px",
    color: "var(--text-muted)",
    fontFamily: "var(--font-sans)",
  },
};

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
    <div style={rsStyles.wrapper}>
      <h3 style={rsStyles.title}>
        <span style={rsStyles.accentBar} />
        Related Skills ({cl})
      </h3>
      <div style={rsStyles.row}>
        {rel.map((s) => (
          <Link
            key={s.id}
            to={`/skill/${s.id}`}
            style={rsStyles.card}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.borderColor = "var(--border-strong)";
              el.style.boxShadow = "var(--shadow-md)";
              el.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.borderColor = "var(--border-soft)";
              el.style.boxShadow = "var(--shadow-sm)";
              el.style.transform = "translateY(0)";
            }}
          >
            <div style={rsStyles.name}>{s.name}</div>
            <div style={rsStyles.meta}>{s.category.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
