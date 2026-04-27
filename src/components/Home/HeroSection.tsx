import { useSkills } from "../../hooks/useSkills";

const heroStyles = {
  section: {
    padding: "96px 24px 72px",
    maxWidth: "90ch",
    margin: "0 auto",
    position: "relative" as const,
  },
  eyebrowRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: "36px",
  },
  eyebrow: {
    fontSize: "11px",
    fontWeight: 600,
    color: "var(--brand)",
    letterSpacing: "1.5px",
    textTransform: "uppercase" as const,
    fontFamily: "var(--font-sans)",
  },
  version: {
    fontSize: "11px",
    color: "var(--text-dim)",
    fontFamily: "var(--font-mono)",
    fontVariantNumeric: "tabular-nums" as const,
  },
  title: {
    fontFamily: "var(--font-display)",
    fontSize: "clamp(48px, 8vw, 80px)",
    fontWeight: 400,
    lineHeight: 1.02,
    color: "var(--text-primary)",
    marginBottom: "12px",
    textWrap: "balance" as const,
    letterSpacing: "-0.03em",
  },
  titleAccent: {
    color: "var(--brand)",
    fontStyle: "italic",
  },
  description: {
    fontFamily: "var(--font-sans)",
    fontSize: "17px",
    fontWeight: 400,
    lineHeight: 1.6,
    color: "var(--text-secondary)",
    maxWidth: "52ch",
    marginTop: "24px",
    marginBottom: "48px",
    textWrap: "pretty" as const,
  },
  metricsRow: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap" as const,
  },
  metricPill: {
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    padding: "14px 22px",
    borderRadius: "var(--radius-full)",
    background: "var(--bg-surface)",
    border: "1px solid var(--border)",
    transition:
      "border-color var(--duration-normal) var(--ease-out), box-shadow var(--duration-normal) var(--ease-out)",
  },
  metricValue: {
    fontFamily: "var(--font-display)",
    fontSize: "24px",
    fontWeight: 400,
    color: "var(--brand)",
    fontVariantNumeric: "tabular-nums" as const,
    lineHeight: 1.1,
  },
  metricLabel: {
    fontSize: "11px",
    color: "var(--text-muted)",
    fontFamily: "var(--font-sans)",
    fontWeight: 500,
    textTransform: "uppercase" as const,
    letterSpacing: "0.8px",
  },
};

export default function HeroSection() {
  const { total, skills } = useSkills();
  const catCount = new Set(skills.map((s) => s.category.key)).size;

  return (
    <section style={heroStyles.section}>
      <div style={heroStyles.eyebrowRow}>
        <span style={heroStyles.eyebrow}>Agent Skills Collection</span>
        <span style={heroStyles.version}>v1.0</span>
      </div>

      <h1 style={heroStyles.title}>
        Skill <span style={heroStyles.titleAccent}>Gallery</span>
      </h1>

      <p style={heroStyles.description}>
        A curated collection of agent skills — from diagram generation and
        design systems to security review and workflow automation.
      </p>

      <div style={heroStyles.metricsRow}>
        {[
          [String(total), "Skills"],
          [String(catCount), "Categories"],
        ].map(([value, label], i) => (
          <div key={i} style={heroStyles.metricPill}>
            <span style={heroStyles.metricValue}>{value}</span>
            <span style={heroStyles.metricLabel}>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
