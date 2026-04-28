import { useMemo } from "react";
import type { CSSProperties } from "react";
import MarkdownRenderer, { slugHeading } from "../../common/MarkdownRenderer";
import SkillPreview from "../../Demos/SkillPreview";
import { stripLeadingH1 } from "../../../utils/markdownParser";
import type { SkillData } from "../../../data/skills";

interface Props {
  skill: SkillData;
}

interface AnchorItem {
  id: string;
  title: string;
}

const PREVIEW_SKILL_IDS = new Set([
  "app-icon-minimalist",
  "blueprinter",
  "design-system",
  "editorial-card-screenshot",
  "infographic-creation",
  "opc-methodology",
  "impeccable-style",
  "markdown-viewer-skills",
  "khazix-skills",
]);

export default function UnifiedLayout({ skill }: Props) {
  const body = stripLeadingH1(skill.content);
  const hasPreview = PREVIEW_SKILL_IDS.has(skill.id);
  const anchorItems = useMemo<AnchorItem[]>(() => {
    return body
      .split("\n")
      .map((line) => line.match(/^##\s+(.+)$/)?.[1]?.trim())
      .filter((title): title is string => Boolean(title))
      .slice(0, 8)
      .map((title) => ({ id: slugHeading(title), title }));
  }, [body]);
  const firstTrigger = skill.triggerPhrases[0] || skill.id;

  return (
    <article
      className="skill-detail"
      style={
        {
          "--detail-color": `var(--cat-${skill.category.key})`,
        } as CSSProperties
      }
    >
      <header className="skill-detail-hero">
        <div className="skill-detail-hero-copy">
          <div className="skill-detail-meta-line">
            <span className="skill-detail-category">
              <span aria-hidden="true" />
              {skill.category.label}
            </span>
            <span className="skill-detail-id">{skill.id}</span>
          </div>

          <h1 className="skill-detail-title">{skill.name}</h1>
          <p className="skill-detail-description">
            {skill.description || "No description available."}
          </p>

          <div className="skill-detail-metrics" aria-label="Skill metrics">
            {[
              [skill.stats.readTime, "Read"],
              [String(skill.stats.lineCount), "Lines"],
              [String(skill.fileInfo.totalFiles), "Files"],
              [skill.stats.complexityLabel, "Complexity"],
            ].map(([value, label]) => (
              <div key={label} className="skill-detail-metric">
                <span>{value}</span>
                <small>{label}</small>
              </div>
            ))}
          </div>
        </div>

        <aside className="skill-command-panel" aria-label="Skill quick facts">
          <div className="skill-command-panel-header">
            <span>Activation</span>
            <span>Ready</span>
          </div>
          <div className="skill-command-trigger">
            <span>Trigger Phrase</span>
            <code>{firstTrigger}</code>
          </div>
          <div className="skill-command-grid">
            <div>
              <span>{skill.keyFeatures.length}</span>
              <small>Features</small>
            </div>
            <div>
              <span>{skill.triggerPhrases.length}</span>
              <small>Triggers</small>
            </div>
          </div>
          {skill.installCommand && (
            <div className="skill-install-snippet">
              <span>Install Command</span>
              <code>{skill.installCommand}</code>
            </div>
          )}
        </aside>
      </header>

      <div className="skill-detail-body">
        <aside className="skill-detail-sidebar" aria-label="Skill page navigation">
          <div className="skill-sidebar-section">
            <h2>Contents</h2>
            {anchorItems.length ? (
              <nav className="skill-anchor-list">
                {anchorItems.map((item) => (
                  <a key={item.id} href={`#${item.id}`}>
                    {item.title}
                  </a>
                ))}
              </nav>
            ) : (
              <p>No document sections detected.</p>
            )}
          </div>

          <div className="skill-sidebar-section">
            <h2>Features</h2>
            <ul className="skill-feature-list">
              {skill.keyFeatures.slice(0, 5).map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>
        </aside>

        <main className="skill-detail-main">
          {hasPreview && (
            <section className="skill-preview-panel" aria-labelledby="skill-preview-heading">
              <div className="skill-section-heading">
                <span>Generated Output</span>
                <h2 id="skill-preview-heading">Preview</h2>
              </div>
              <SkillPreview skill={skill} />
            </section>
          )}

          <section className="skill-doc-panel" aria-labelledby="skill-doc-heading">
            <div className="skill-section-heading">
              <span>Documentation</span>
              <h2 id="skill-doc-heading">Skill Manual</h2>
            </div>
            <MarkdownRenderer content={body} />
          </section>
        </main>
      </div>
    </article>
  );
}
