import SkillCard from "./SkillCard";
import type { SkillData } from "../../data/skills";
interface Props {
  skills: SkillData[];
}
export default function SkillGrid({ skills }: Props) {
  if (!skills.length)
    return (
      <div style={{ textAlign: "center", padding: "60px 24px", color: "var(--text-secondary)" }}>
        <p style={{ fontSize: "18px" }}>No skills found</p>
        <p style={{ marginTop: "8px", fontSize: "14px" }}>Try adjusting your filters</p>
      </div>
    );
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))",
        gap: "16px",
      }}
    >
      {skills.map((s, i) => (
        <SkillCard key={s.id} skill={s} index={i} />
      ))}
    </div>
  );
}
