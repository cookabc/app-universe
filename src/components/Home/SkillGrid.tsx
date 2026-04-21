import SkillCard from "./SkillCard";
import type { SkillData } from "../../data/skills";

interface Props {
  skills: SkillData[];
}

export default function SkillGrid({ skills }: Props) {
  if (!skills.length)
    return (
      <div style={{ textAlign: "center", padding: "60px 24px", color: "var(--stone)" }}>
        <p style={{ fontSize: "18px", fontFamily: "var(--font-serif)", marginBottom: "8px" }}>No skills found</p>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>Try adjusting your filters</p>
      </div>
    );

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "20px",
      }}
    >
      {skills.map((s, i) => (
        <SkillCard key={s.id} skill={s} index={i} />
      ))}
    </div>
  );
}
