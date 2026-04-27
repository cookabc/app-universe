const footerStyles = {
  outer: {
    borderTop: "1px solid var(--border-soft)",
    padding: "32px",
    marginTop: "auto",
  },
  inner: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap" as const,
    gap: "16px",
  },
  left: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "4px",
  },
  brand: {
    fontSize: "13px",
    fontWeight: 600,
    color: "var(--text-secondary)",
    letterSpacing: "-0.01em",
  },
  meta: {
    fontSize: "11px",
    color: "var(--text-muted)",
    fontFamily: "var(--font-mono)",
  },
  right: {
    fontSize: "11px",
    color: "var(--text-dim)",
    fontFamily: "var(--font-mono)",
  },
};

export default function Footer() {
  return (
    <footer style={footerStyles.outer}>
      <div style={footerStyles.inner}>
        <div style={footerStyles.left}>
          <span style={footerStyles.brand}>Skill Gallery</span>
          <span style={footerStyles.meta}>Agent Skills Showcase</span>
        </div>
        <span style={footerStyles.right}>
          Midnight Atelier Design System v1.0
        </span>
      </div>
    </footer>
  );
}
