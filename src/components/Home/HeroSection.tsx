import type { CSSProperties } from "react";
import { useSkills } from "../../hooks/useSkills";

export default function HeroSection() {
  const { total, skills } = useSkills();
  const categoryCounts = skills.reduce<Record<string, { label: string; count: number }>>(
    (acc, skill) => {
      const key = skill.category.key;
      acc[key] = acc[key] || { label: skill.category.label, count: 0 };
      acc[key].count += 1;
      return acc;
    },
    {},
  );
  const topCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5);
  const catCount = Object.keys(categoryCounts).length;
  const installable = skills.filter((skill) => skill.installCommand).length;
  const codeBlocks = skills.reduce((sum, skill) => sum + skill.stats.codeBlockCount, 0);

  return (
    <section className="home-hero" aria-labelledby="home-hero-title">
      <div className="home-hero-copy">
        <div className="home-hero-eyebrow-row">
          <span className="home-hero-eyebrow">Agent Capability Library</span>
          <span className="home-hero-version">v2.0</span>
        </div>

        <h1 id="home-hero-title" className="home-hero-title">
          Find the right skill for the next agent move.
        </h1>

        <p className="home-hero-description">
          A curated command surface for local agent skills: design systems, security review,
          diagrams, workflows, screenshots, and learning tools arranged for fast inspection.
        </p>

        <div className="home-hero-actions" aria-label="Library metrics">
          {[
            [String(total), "Skills"],
            [String(catCount), "Categories"],
            [String(installable), "Installable"],
            [String(codeBlocks), "Code Blocks"],
          ].map(([value, label]) => (
            <div key={label} className="metric-tile">
              <span className="metric-value">{value}</span>
              <span className="metric-label">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="capability-console" aria-label="Capability distribution">
        <div className="console-header">
          <span className="console-kicker">Live Index</span>
          <span className="console-status">Ready</span>
        </div>
        <div className="console-radar" aria-hidden="true">
          <div className="console-radar-ring" />
          <div className="console-radar-ring console-radar-ring-inner" />
          {topCategories.map(([key], index) => (
            <span key={key} className={`console-node console-node-${index + 1}`} />
          ))}
        </div>
        <div className="console-category-list">
          {topCategories.map(([key, item]) => (
            <div key={key} className="console-category-row">
              <span className="console-category-name">{item.label}</span>
              <span className="console-category-track">
                <span
                  className="console-category-fill"
                  style={
                    {
                      "--category-color": `var(--cat-${key})`,
                      "--category-share": `${Math.max((item.count / Math.max(total, 1)) * 100, 8)}%`,
                    } as CSSProperties
                  }
                />
              </span>
              <span className="console-category-count">{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
