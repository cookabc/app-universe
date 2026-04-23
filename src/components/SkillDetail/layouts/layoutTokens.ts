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

export const metaSummary = {
  container: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "6px 14px",
    marginTop: 14,
    paddingTop: 12,
    borderTop: "0.5px solid var(--border-warm)",
  } as React.CSSProperties,
  item: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    fontSize: 11,
    color: "var(--text-secondary)",
    fontFamily: "var(--font-sans)",
    fontVariantNumeric: "tabular-nums" as const,
  } as React.CSSProperties,
  itemValue: {
    color: "var(--text-primary)",
    fontWeight: 500,
  } as React.CSSProperties,
  separator: {
    color: "var(--border-warm)",
    fontSize: 10,
  } as React.CSSProperties,
};

export const cta = {
  group: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "8px",
    marginTop: 18,
  } as React.CSSProperties,
  primary: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 18px",
    borderRadius: "2px",
    background: "var(--brand)",
    color: "white",
    fontSize: 12,
    fontWeight: 600,
    fontFamily: "var(--font-sans)",
    border: "none",
    cursor: "pointer",
    letterSpacing: "0.3px",
    transition: "all .15s ease",
  } as React.CSSProperties,
  secondary: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 18px",
    borderRadius: "2px",
    background: "transparent",
    color: "var(--text-primary)",
    fontSize: 12,
    fontWeight: 500,
    fontFamily: "var(--font-sans)",
    border: "0.5px solid var(--border-warm)",
    cursor: "pointer",
    letterSpacing: "0.3px",
    transition: "all .15s ease",
  } as React.CSSProperties,
};

export const preview = {
  card: {
    padding: "20px 24px",
    marginBottom: 32,
    borderRadius: 6,
    background: "var(--ivory)",
    border: "0.5px solid var(--border-warm)",
    boxShadow: "var(--shadow-ring)",
  } as React.CSSProperties,
  label: {
    fontSize: 11,
    fontWeight: 600,
    color: "var(--brand)",
    textTransform: "uppercase" as const,
    letterSpacing: "0.8px",
    marginBottom: 14,
    fontFamily: "var(--font-sans)",
    display: "flex",
    alignItems: "center",
    gap: "6px",
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
  metaRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "6px 0",
    fontSize: 11,
    borderBottom: "0.5px solid rgba(0,0,0,.04)",
  } as React.CSSProperties,
  metaLabel: {
    color: "var(--text-secondary)",
    fontFamily: "var(--font-sans)",
    fontSize: 10,
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
  } as React.CSSProperties,
  metaValue: {
    color: "var(--text-primary)",
    fontWeight: 500,
    fontVariantNumeric: "tabular-nums" as const,
    fontSize: 11,
  } as React.CSSProperties,
  sectionGap: {
    marginTop: 14,
    paddingTop: 10,
    borderTop: "0.5px solid var(--border-warm)",
  } as React.CSSProperties,
};
