import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import MarkdownRenderer, { slugHeading } from "../../common/MarkdownRenderer";
import SkillPreview from "../../Demos/SkillPreview";
import { stripLeadingH1 } from "../../../utils/markdownParser";
import { buildSkillShowcaseModel } from "../../../utils/skillShowcase";
import type { SkillData } from "../../../data/skills";

interface Props {
  skill: SkillData;
}

interface AnchorItem {
  id: string;
  title: string;
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button type="button" className="skill-copy-button" onClick={copy}>
      <span>{copied ? "Copied" : label}</span>
    </button>
  );
}

export default function UnifiedLayout({ skill }: Props) {
  const body = stripLeadingH1(skill.content);
  const model = buildSkillShowcaseModel(skill);
  const children = skill.children || [];
  const anchorItems = useMemo<AnchorItem[]>(() => {
    const generated = [
      { id: "case-showcase", title: "Showcase" },
      { id: "case-workflow", title: "Workflow" },
      { id: "case-outputs", title: "Outputs" },
      { id: "skill-doc-heading", title: "Manual" },
    ];
    const manual = body
      .split("\n")
      .map((line) => line.match(/^##\s+(.+)$/)?.[1]?.trim())
      .filter((title): title is string => Boolean(title))
      .slice(0, 4)
      .map((title) => ({ id: slugHeading(title), title }));
    return [...generated, ...manual].slice(0, 8);
  }, [body]);

  const useCases = model.topUseCases.length
    ? model.topUseCases
    : [
        {
          icon: "case",
          title: "Primary Use Case",
          description:
            skill.description || "Apply this skill when its operating workflow matches the task.",
        },
      ];

  return (
    <article
      className="skill-detail case-layout"
      style={
        {
          "--detail-color": skill.category.color || "var(--brand)",
        } as CSSProperties
      }
    >
      <header className="case-hero">
        <div className="case-hero-copy">
          <div className="case-kicker-row">
            <span className="case-category">{skill.category.label}</span>
            <span className="case-id">{skill.id}</span>
          </div>
          <h1 className="case-title">{skill.name}</h1>
          <p className="case-description">{skill.description || "No description available."}</p>
          <div className="case-trigger-strip" aria-label="Primary trigger">
            <span>Trigger</span>
            <code>{model.primaryTrigger}</code>
            <CopyButton value={model.primaryTrigger} label="Copy" />
          </div>
        </div>

        <aside className="case-quick-rail" aria-label="Skill quick actions">
          <div className="case-rail-card">
            <span className="case-rail-label">Case Type</span>
            <strong>{model.kind.replace("generated-", "Generated ")}</strong>
          </div>
          <div className="case-rail-grid">
            <div>
              <strong>{skill.stats.readTime}</strong>
              <span>Read</span>
            </div>
            <div>
              <strong>{skill.fileInfo.totalFiles}</strong>
              <span>Files</span>
            </div>
            <div>
              <strong>{skill.keyFeatures.length}</strong>
              <span>Features</span>
            </div>
            <div>
              <strong>{children.length || skill.triggerPhrases.length}</strong>
              <span>{children.length ? "Modules" : "Triggers"}</span>
            </div>
          </div>
          {model.updateCommand && (
            <div className="case-install-card case-update-card">
              <span className="case-rail-label">Keep Updated</span>
              <code>{model.updateCommand}</code>
              <CopyButton value={model.updateCommand} label="Copy update" />
            </div>
          )}
          {model.resourceLinks.length > 0 && (
            <div className="case-resource-card">
              <span className="case-rail-label">Links</span>
              <div className="case-resource-links">
                {model.resourceLinks.map((link) => (
                  <a
                    key={`${link.kind}-${link.url}`}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </aside>
      </header>

      <div className="case-page-grid">
        <aside className="case-sidebar" aria-label="Skill page navigation">
          <span>On this page</span>
          <nav>
            {anchorItems.map((item) => (
              <a key={item.id} href={`#${item.id}`}>
                {item.title}
              </a>
            ))}
          </nav>
        </aside>

        <div className="case-main">
          <section id="case-showcase" className="case-section case-showcase-section">
            <div className="case-section-heading">
              <span>Showcase</span>
              <h2>What this skill can make</h2>
            </div>
            <div className="case-preview-stage">
              <SkillPreview skill={skill} />
            </div>
          </section>

          <section id="case-workflow" className="case-section">
            <div className="case-section-heading">
              <span>Recipe</span>
              <h2>How the workflow moves</h2>
            </div>
            <div className="case-workflow-list">
              {model.workflowSteps.map((step, index) => (
                <article key={step} className="case-workflow-step">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{step}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="case-outputs" className="case-section">
            <div className="case-section-heading">
              <span>Outputs</span>
              <h2>Expected result</h2>
            </div>
            <div className="case-output-panel">
              <p>{model.outputSummary}</p>
              <div className="case-use-case-grid">
                {useCases.map((useCase, index) => (
                  <article key={`${useCase.title}-${index}`} className="case-use-card">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <h3>{useCase.title}</h3>
                    <p>{useCase.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {children.length > 0 && (
            <section className="case-section">
              <div className="case-section-heading">
                <span>Collection</span>
                <h2>Included modules</h2>
              </div>
              <div className="case-module-grid">
                {children.map((child, index) => (
                  <article key={child.id} className="case-module-card">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <h3>{child.name}</h3>
                      <p>{child.description}</p>
                      {child.tag && <small>{child.tag}</small>}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          <section className="case-section case-manual-section" aria-labelledby="skill-doc-heading">
            <div className="case-section-heading">
              <span>Manual</span>
              <h2 id="skill-doc-heading">Full skill documentation</h2>
            </div>
            <MarkdownRenderer content={body} />
          </section>
        </div>
      </div>
    </article>
  );
}
