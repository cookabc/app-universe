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
        .filter((s) => s.id !== currentId && s.category.key === cur.category.key)
        .slice(0, 4);
      setRel(f);
    });
  }, [currentId]);

  if (!rel.length) return null;

  return (
    <div className="related-skills">
      <h3 className="related-skills-title">
        <span aria-hidden="true" />
        Related Skills ({cl})
      </h3>
      <div className="related-skills-row">
        {rel.map((s) => (
          <Link key={s.id} to={`/skill/${s.id}`} className="related-skill-card">
            <div>{s.name}</div>
            <span>{s.category.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
