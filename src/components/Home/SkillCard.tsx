import { Link } from "react-router-dom";
import type { CSSProperties } from "react";
import type { SkillData } from "../../data/skills";

interface Props {
  skill: SkillData;
  index: number;
  visible?: boolean;
}

export default function SkillCard({ skill, index, visible = false }: Props) {
  const cat = skill.category;
  const num = String(index + 1).padStart(2, "0");
  const delay = Math.min(index * 60, 420);
  const firstTrigger = skill.triggerPhrases[0] || skill.id;

  return (
    <Link
      to={`/skill/${skill.id}`}
      className="skill-card-link"
      style={
        {
          "--card-color": `var(--cat-${cat.key})`,
          "--card-delay": `${delay}ms`,
        } as CSSProperties
      }
    >
      <article className="skill-card" data-visible={visible ? "true" : "false"}>
        <div className="skill-card-topline" aria-hidden="true" />

        <div className="skill-card-header">
          <span className="skill-card-index">{num}</span>
          <span className="skill-card-category">
            <span className="skill-card-category-dot" aria-hidden="true" />
            {cat.label}
          </span>
        </div>

        <h3 className="skill-card-title">{skill.name}</h3>

        <p className="skill-card-description">{skill.description || "No description available"}</p>

        <div className="skill-card-trigger">
          <span className="skill-card-trigger-label">Trigger</span>
          <code>{firstTrigger}</code>
        </div>

        <div className="skill-card-meta">
          <div className="skill-card-meta-item">
            <span className="skill-card-meta-value">{skill.stats.lineCount}</span>
            <span className="skill-card-meta-label">lines</span>
          </div>
          <div className="skill-card-meta-item">
            <span className="skill-card-meta-value">{skill.fileInfo.totalFiles}</span>
            <span className="skill-card-meta-label">files</span>
          </div>
          <div className="skill-card-meta-item">
            <span className="skill-card-meta-value">{skill.keyFeatures.length}</span>
            <span className="skill-card-meta-label">features</span>
          </div>
          <span className="skill-card-complexity">{skill.stats.complexityLabel}</span>
        </div>
      </article>
    </Link>
  );
}
