import { Link } from "react-router-dom";
import type { CSSProperties } from "react";
import type { SkillData } from "../../data/skills";
import { buildSkillShowcaseModel } from "../../utils/skillShowcase";

interface Props {
  skill: SkillData;
  index: number;
  visible?: boolean;
}

export default function SkillCard({ skill, index, visible = false }: Props) {
  const cat = skill.category;
  const num = String(index + 1).padStart(2, "0");
  const delay = Math.min(index * 60, 420);
  const model = buildSkillShowcaseModel(skill);
  const previewLabel =
    model.kind === "image"
      ? `${model.assetUrls.length} visual reference${model.assetUrls.length === 1 ? "" : "s"}`
      : model.kind === "generated-flow"
        ? "Generated workflow board"
        : model.kind === "generated-prompt"
          ? "Generated prompt board"
          : "Generated output board";

  return (
    <Link
      to={`/skill/${skill.id}`}
      className="skill-card-link"
      style={
        {
          "--card-color": `var(--cat-${cat.key}, ${cat.color || "var(--brand)"})`,
          "--card-delay": `${delay}ms`,
        } as CSSProperties
      }
    >
      <article className="skill-card" data-visible={visible ? "true" : "false"}>
        <div className="skill-card-header">
          <span className="skill-card-index">{num}</span>
          <span className="skill-card-category">
            <span className="skill-card-category-dot" aria-hidden="true" />
            {cat.label}
          </span>
        </div>

        <h3 className="skill-card-title">{skill.name}</h3>

        <p className="skill-card-description">{skill.description || "No description available"}</p>

        <div className="skill-card-preview-hint" aria-hidden="true">
          <span>{previewLabel}</span>
          <div>
            {model.workflowSteps.slice(0, 3).map((step) => (
              <i key={step} />
            ))}
          </div>
        </div>

        <div className="skill-card-trigger">
          <span className="skill-card-trigger-label">Trigger</span>
          <code>{model.primaryTrigger}</code>
        </div>

        <div className="skill-card-meta">
          <div className="skill-card-meta-item">
            <span className="skill-card-meta-value">{skill.fileInfo.totalFiles}</span>
            <span className="skill-card-meta-label">files</span>
          </div>
          <div className="skill-card-meta-item">
            <span className="skill-card-meta-value">{skill.keyFeatures.length}</span>
            <span className="skill-card-meta-label">features</span>
          </div>
          <span className="skill-card-complexity">{skill.stats.readTime}</span>
        </div>
      </article>
    </Link>
  );
}
