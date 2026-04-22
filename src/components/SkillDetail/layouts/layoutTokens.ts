export const header = {
  h1: {
    fontFamily: "var(--font-serif)",
    fontSize: "clamp(28px, 4.5vw, 36px)",
    fontWeight: 500,
    lineHeight: 1.15,
    color: "var(--text-primary)",
  } as React.CSSProperties,
  desc: {
    fontFamily: "var(--font-serif)",
    fontSize: 16,
    fontWeight: 400,
    lineHeight: 1.5,
    color: "var(--olive)",
    textWrap: "pretty" as const,
  } as React.CSSProperties,
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    padding: "4px 12px",
    borderRadius: "2px",
    background: "var(--brand)",
    color: "white",
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: "0.8px",
    textTransform: "uppercase" as const,
    fontFamily: "var(--font-sans)",
  } as React.CSSProperties,
  borderStyle: {
    borderBottom: "3px double var(--border)",
  } as React.CSSProperties,
};

export const preview = {
  section: {
    marginBottom: 32,
    paddingTop: 20,
    borderTop: "0.5px dashed var(--border-warm)",
  } as React.CSSProperties,
  label: {
    fontSize: 11,
    fontWeight: 600,
    color: "var(--brand)",
    textTransform: "uppercase" as const,
    letterSpacing: "0.8px",
    marginBottom: 14,
    fontFamily: "var(--font-sans)",
  } as React.CSSProperties,
};

export const content = {
  section: {
    marginBottom: 24,
  } as React.CSSProperties,
  bodyText: {
    fontSize: 14,
    lineHeight: 1.7,
    color: "var(--text-secondary)",
    textWrap: "pretty" as const,
  } as React.CSSProperties,
};

export const sidebar = {
  container: {
    position: "sticky" as const,
    top: 24,
    padding: 16,
    borderRadius: 8,
    background: "var(--ivory)",
    border: "0.5px solid var(--border-warm)",
    boxShadow: "var(--shadow-ring)",
    fontSize: 12,
  } as React.CSSProperties,
  title: {
    fontFamily: "var(--font-serif)",
    fontSize: 11,
    fontWeight: 600,
    color: "var(--brand)",
    textTransform: "uppercase" as const,
    letterSpacing: "0.8px",
    marginBottom: 12,
    paddingBottom: 8,
    borderBottom: "0.5px solid var(--border-warm)",
    lineHeight: 1.3,
  } as React.CSSProperties,
};
