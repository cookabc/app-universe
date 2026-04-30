import { Link } from "react-router-dom";
import { useSkills } from "../../hooks/useSkills";
import { buildSkillShowcaseModel } from "../../utils/skillShowcase";

export default function HeroSection() {
  const { total, skills } = useSkills();
  const featuredIds = ["opc-methodology", "khazix-skills", "gpt-image-2", "kami"];
  const featured = featuredIds
    .map((id) => skills.find((skill) => skill.id === id))
    .filter((skill): skill is NonNullable<typeof skill> => Boolean(skill))
    .concat(skills)
    .filter((skill, index, all) => all.findIndex((item) => item.id === skill.id) === index)
    .slice(0, 4);
  const catCount = new Set(skills.map((skill) => skill.category.key)).size;
  const installable = skills.filter((skill) => skill.installCommand).length;
  const visualCases = skills.filter(
    (skill) => skill.assets.screenshots.length || skill.assets.samples.length,
  ).length;

  return (
    <section className="home-hero" aria-labelledby="home-hero-title">
      <div className="home-hero-copy">
        <div className="home-hero-eyebrow-row">
          <span className="home-hero-eyebrow">Capability Case Gallery</span>
          <span className="home-hero-version">v2.0</span>
        </div>

        <h1 id="home-hero-title" className="home-hero-title">
          Pick the right skill by seeing what it makes.
        </h1>

        <p className="home-hero-description">
          A light-first gallery for agent skills, arranged around outcomes, triggers, and example
          cases so each capability is easier to inspect before you use it.
        </p>

        <div className="home-hero-cta-row">
          <a href="#skills" className="home-primary-link">
            Browse cases
          </a>
          <a href="#skills" className="home-secondary-link">
            Search skills
          </a>
        </div>

        <div className="home-hero-actions" aria-label="Library metrics">
          {[
            [String(total), "Skills"],
            [String(catCount), "Categories"],
            [String(installable), "Installable"],
            [String(visualCases), "Visual cases"],
          ].map(([value, label]) => (
            <div key={label} className="metric-tile">
              <span className="metric-value">{value}</span>
              <span className="metric-label">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="hero-case-stack" aria-label="Featured skill cases">
        <div className="hero-case-stack-header">
          <span>Featured cases</span>
          <span>{featured.length} selected</span>
        </div>
        {featured.map((skill, index) => {
          const model = buildSkillShowcaseModel(skill);
          return (
            <Link key={skill.id} to={`/skill/${skill.id}`} className="hero-case-card">
              <span className="hero-case-number">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <span className="hero-case-category">{skill.category.label}</span>
                <h2>{skill.name}</h2>
                <p>{model.outputSummary}</p>
              </div>
              <code>{model.primaryTrigger}</code>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
