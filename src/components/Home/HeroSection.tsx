import { useSkills } from "../../hooks/useSkills";

export default function HeroSection() {
  const { total } = useSkills();
  return (
    <section
      style={{
        padding: "60px 0 48px",
        animation: "fadeInUp .5s ease",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      {/* Eyebrow label - kami style */}
      <div
        style={{
          fontSize: "11px",
          color: "var(--brand)",
          letterSpacing: "1.5px",
          textTransform: "uppercase",
          marginBottom: "12px",
          fontWeight: 500,
        }}
      >
        Selected Skills 2024–2026
      </div>

      {/* Main title with subtle accent */}
      <h1
        style={{
          fontSize: "clamp(32px, 5vw, 52px)",
          fontWeight: 500,
          fontFamily: "var(--font-serif)",
          color: "var(--text-primary)",
          marginBottom: "16px",
          lineHeight: 1.1,
          textWrap: "balance",
        }}
      >
        Agent Skills
        <br />
        Gallery
      </h1>

      {/* Subtitle */}
      <p
        style={{
          fontFamily: "var(--font-serif)",
          color: "var(--text-secondary)",
          fontSize: "clamp(16px, 2vw, 20px)",
          lineHeight: 1.5,
          maxWidth: "600px",
          marginLeft: "19px",
          textWrap: "pretty",
        }}
      >
        Explore all available Agent Skills — interactive demos, documentation & more.
      </p>

      {/* Stats row - kami style */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          marginTop: "28px",
          marginLeft: "19px",
          flexWrap: "wrap",
        }}
      >
        {[
          ["Skills", String(total)],
          ["Categories", "9"],
          ["Type", "Showcase"],
        ].map(([l, v], i) => (
          <span
            key={i}
            style={{
              display: "inline-flex",
              alignItems: "baseline",
              gap: "6px",
              fontSize: "13px",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            <strong style={{ color: "var(--brand)", fontWeight: 600, fontSize: "18px" }}>{v}</strong>
            <span style={{ color: "var(--stone)" }}>{l}</span>
          </span>
        ))}
      </div>
    </section>
  );
}
