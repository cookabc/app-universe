import { useSkills } from "../../hooks/useSkills";

export default function HeroSection() {
  const { total, skills } = useSkills();
  const catCount = new Set(skills.map((s) => s.category.key)).size;

  return (
    <section
      style={{
        padding: "80px 24px 60px",
        maxWidth: "90ch",
        margin: "0 auto",
        opacity: 1,
        transform: "translateY(0)",
        transition: "opacity .4s ease, transform .4s ease",
      }}
    >
      {/* Top row: eyebrow left, date right */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: "32px",
        }}
      >
        {/* Eyebrow - kami label style */}
        <div
          style={{
            fontSize: "10px",
            fontWeight: 600,
            color: "var(--brand)",
            letterSpacing: "1px",
            textTransform: "uppercase",
            fontFamily: "var(--font-sans)",
          }}
        >
          Selected Works · 2024–2026
        </div>

        {/* Right-aligned metadata - Portfolio style */}
        <div
          style={{
            fontSize: "10px",
            color: "var(--stone)",
            fontFamily: "var(--font-mono)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          v1.0 · Design System
        </div>
      </div>

      {/* Display title - kami Portfolio cover */}
      <h1
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "clamp(40px, 7vw, 64px)",
          fontWeight: 500,
          lineHeight: 1.1,
          color: "var(--text-primary)",
          marginBottom: "8px",
          textWrap: "balance",
          letterSpacing: "-0.02em",
        }}
      >
        Agent Skills
        <br />
        Gallery
      </h1>

      {/* Quote/description - olive + brand left bar */}
      <p
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "17px",
          fontWeight: 400,
          lineHeight: 1.5,
          color: "var(--olive)",
          maxWidth: "50ch",
          marginTop: "20px",
          marginBottom: "40px",
          textWrap: "pretty",
          borderLeft: "2px solid var(--brand)",
          paddingLeft: "14px",
          marginLeft: "2px",
        }}
      >
        Explore all available Agent Skills — interactive demos, documentation &
        more.
      </p>

      {/* Metric cards row - kami standard: serif number + sans label */}
      <div
        style={{
          display: "flex",
          gap: "28px",
          flexWrap: "wrap",
        }}
      >
        {[
          [String(total), "Skills", "📄"],
          [String(catCount), "Categories", "🏷️"],
        ].map(([value, label, icon], i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "8px",
              padding: "12px 18px",
              borderRadius: "8px",
              background: "var(--ivory)",
              border: "0.5px solid var(--border-cream)",
              boxShadow: "var(--shadow-whisper)",
            }}
          >
            <span style={{ fontSize: "14px", flexShrink: 0 }}>{icon}</span>
            <span
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "22px",
                fontWeight: 500,
                color: "var(--brand)",
                fontVariantNumeric: "tabular-nums",
                lineHeight: 1.15,
              }}
            >
              {value}
            </span>
            <span
              style={{
                fontSize: "11px",
                color: "var(--olive)",
                fontFamily: "var(--font-sans)",
                fontWeight: 500,
              }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
