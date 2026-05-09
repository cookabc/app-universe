import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { SkillData } from "../../../data/skills";
import { stripLeadingH1 } from "../../../utils/markdownParser";
import { buildSkillShowcaseModel } from "../../../utils/skillShowcase";
import MarkdownRenderer, { slugHeading } from "../../common/MarkdownRenderer";
import SkillPreview from "../../Demos/SkillPreview";

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
    <Button variant="outline" size="sm" onClick={copy}>
      {copied ? "Copied" : label}
    </Button>
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
            skill.description ||
            "Apply this skill when its operating workflow matches the task.",
        },
      ];

  const catColor = skill.category.color || "var(--color-primary)";

  return (
    <article
      className="grid gap-6"
      style={{ "--detail-color": catColor } as CSSProperties}
    >
      {/* Hero */}
      <header className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 lg:gap-12 items-stretch p-6 md:p-10 lg:p-12 rounded-[var(--radius)] border-2 border-slate-800 bg-card shadow-[var(--box-shadow)]">
        <div className="flex flex-col justify-center min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap mb-5">
            <Badge
              className="font-mono text-[11px] font-bold uppercase"
              style={{
                color: "var(--detail-color)",
                background:
                  "color-mix(in srgb, var(--detail-color) 12%, transparent)",
              }}
            >
              {skill.category.label}
            </Badge>
            <Badge
              variant="outline"
              className="font-mono text-[11px] font-bold max-w-[34ch] truncate"
            >
              {skill.id}
            </Badge>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-foreground leading-[0.95]">
            {skill.name}
          </h1>
          <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl">
            {skill.description || "No description available."}
          </p>
          <div className="flex items-center gap-2.5 flex-wrap mt-6 p-2.5 rounded-lg border border-border bg-muted">
            <span className="text-[10px] font-bold uppercase text-muted-foreground">
              Trigger
            </span>
            <code className="flex-1 min-w-0 overflow-hidden text-xs font-mono text-foreground truncate">
              {model.primaryTrigger}
            </code>
            <CopyButton value={model.primaryTrigger} label="Copy" />
          </div>
        </div>

        <aside
          className="self-start grid gap-3"
          aria-label="Skill quick actions"
        >
          <div className="grid gap-2 p-4 rounded-lg border border-border bg-background/70">
            <span className="text-[10px] font-bold uppercase text-muted-foreground">
              Case Type
            </span>
            <strong className="text-lg capitalize text-foreground">
              {model.kind.replace("generated-", "Generated ")}
            </strong>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              [skill.stats.readTime, "Read"],
              [skill.fileInfo.totalFiles, "Files"],
              [skill.keyFeatures.length, "Features"],
              [
                children.length || skill.triggerPhrases.length,
                children.length ? "Modules" : "Triggers",
              ],
            ].map(([value, label], i) => (
              <div
                key={i}
                className="grid gap-1.5 p-3 rounded-lg border border-border bg-background/70"
              >
                <strong className="text-lg text-foreground tabular-nums">
                  {value}
                </strong>
                <span className="text-[10px] font-bold uppercase text-muted-foreground">
                  {label}
                </span>
              </div>
            ))}
          </div>
          {model.updateCommand && (
            <div className="grid gap-2 p-4 rounded-lg border border-border bg-background/70">
              <span className="text-[10px] font-bold uppercase text-muted-foreground">
                Keep Updated
              </span>
              <code className="text-xs font-mono text-primary truncate">
                {model.updateCommand}
              </code>
              <CopyButton value={model.updateCommand} label="Copy update" />
            </div>
          )}
          {model.resourceLinks.length > 0 && (
            <div className="grid gap-2 p-4 rounded-lg border border-border bg-background/70">
              <span className="text-[10px] font-bold uppercase text-muted-foreground">
                Links
              </span>
              <div className="flex flex-wrap gap-2">
                {model.resourceLinks.map((link) => (
                  <a
                    key={`${link.kind}-${link.url}`}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center px-2.5 py-1.5 border border-border rounded-md text-xs font-bold text-foreground no-underline hover:border-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </aside>
      </header>

      {/* Page body: sidebar + main */}
      <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-5 items-start">
        <aside
          className="hidden lg:grid gap-3 sticky top-24 p-3.5 rounded-lg border border-border bg-muted/50"
          aria-label="Skill page navigation"
        >
          <span className="text-[10px] font-bold uppercase text-muted-foreground font-mono">
            On this page
          </span>
          <nav className="grid gap-1">
            {anchorItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="flex items-center min-h-[34px] px-2 rounded-md text-xs font-medium text-muted-foreground no-underline hover:text-foreground hover:bg-muted transition-colors"
              >
                {item.title}
              </a>
            ))}
          </nav>
        </aside>

        <div className="grid gap-5 min-w-0">
          {/* Showcase */}
          <section
            id="case-showcase"
            className="p-5 md:p-7 rounded-[var(--radius)] border-2 border-slate-800 bg-card shadow-[var(--box-shadow)]"
          >
            <div className="grid gap-1.5 mb-5">
              <span
                className="text-[11px] font-bold uppercase font-mono"
                style={{ color: "var(--detail-color)" }}
              >
                Showcase
              </span>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-foreground leading-tight">
                What this skill can make
              </h2>
            </div>
            <div className="p-3 md:p-5 rounded-lg border border-border bg-muted/50 overflow-hidden">
              <SkillPreview skill={skill} />
            </div>
          </section>

          {/* Workflow */}
          <section
            id="case-workflow"
            className="p-5 md:p-7 rounded-[var(--radius)] border-2 border-slate-800 bg-card shadow-[var(--box-shadow)]"
          >
            <div className="grid gap-1.5 mb-5">
              <span
                className="text-[11px] font-bold uppercase font-mono"
                style={{ color: "var(--detail-color)" }}
              >
                Recipe
              </span>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-foreground leading-tight">
                How the workflow moves
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {model.workflowSteps.map((step, index) => (
                <article
                  key={step}
                  className="grid grid-rows-[auto_1fr] gap-2 min-h-[140px] p-4 rounded-lg border border-border bg-muted"
                >
                  <span
                    className="text-xs font-bold font-mono"
                    style={{ color: "var(--detail-color)" }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="text-[13px] font-semibold text-foreground leading-snug">
                    {step}
                  </p>
                </article>
              ))}
            </div>
          </section>

          {/* Outputs */}
          <section
            id="case-outputs"
            className="p-5 md:p-7 rounded-[var(--radius)] border-2 border-slate-800 bg-card shadow-[var(--box-shadow)]"
          >
            <div className="grid gap-1.5 mb-5">
              <span
                className="text-[11px] font-bold uppercase font-mono"
                style={{ color: "var(--detail-color)" }}
              >
                Outputs
              </span>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-foreground leading-tight">
                Expected result
              </h2>
            </div>
            <div className="grid gap-4">
              <p className="max-w-3xl text-muted-foreground text-[15px] leading-relaxed">
                {model.outputSummary}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {useCases.map((useCase, index) => (
                  <article
                    key={`${useCase.title}-${index}`}
                    className="min-h-[150px] p-4 rounded-lg border border-border bg-muted"
                  >
                    <span
                      className="text-xs font-bold font-mono"
                      style={{ color: "var(--detail-color)" }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-3 text-sm font-bold text-foreground">
                      {useCase.title}
                    </h3>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                      {useCase.description}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* Children modules */}
          {children.length > 0 && (
            <section className="p-5 md:p-7 rounded-[var(--radius)] border-2 border-slate-800 bg-card shadow-[var(--box-shadow)]">
              <div className="grid gap-1.5 mb-5">
                <span
                  className="text-[11px] font-bold uppercase font-mono"
                  style={{ color: "var(--detail-color)" }}
                >
                  Collection
                </span>
                <h2 className="text-2xl md:text-3xl font-black tracking-tight text-foreground leading-tight">
                  Included modules
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {children.map((child, index) => (
                  <article
                    key={child.id}
                    className="grid grid-cols-[34px_1fr] gap-3 p-4 rounded-lg border border-border bg-muted"
                  >
                    <span
                      className="text-xl font-bold font-mono leading-none"
                      style={{ color: "var(--detail-color)" }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-foreground">
                        {child.name}
                      </h3>
                      <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                        {child.description}
                      </p>
                      {child.tag && (
                        <small
                          className="inline-block mt-2.5 text-[11px] font-bold"
                          style={{ color: "var(--detail-color)" }}
                        >
                          {child.tag}
                        </small>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* Manual / Documentation */}
          <section
            className="p-5 md:p-7 rounded-[var(--radius)] border-2 border-slate-800 bg-card shadow-[var(--box-shadow)]"
            aria-labelledby="skill-doc-heading"
          >
            <div className="grid gap-1.5 mb-5">
              <span
                className="text-[11px] font-bold uppercase font-mono"
                style={{ color: "var(--detail-color)" }}
              >
                Manual
              </span>
              <h2
                id="skill-doc-heading"
                className="text-2xl md:text-3xl font-black tracking-tight text-foreground leading-tight"
              >
                Full skill documentation
              </h2>
            </div>
            <MarkdownRenderer content={body} />
          </section>
        </div>
      </div>
    </article>
  );
}
