import { Link, useLocation } from "react-router-dom";

const headerStyles = {
  outer: {
    position: "sticky" as const,
    top: 0,
    zIndex: 100,
    background: "color-mix(in srgb, var(--bg-primary) 82%, transparent)",
    backdropFilter: "blur(16px) saturate(1.2)",
    WebkitBackdropFilter: "blur(16px) saturate(1.2)",
    borderBottom: "1px solid var(--border-soft)",
    padding: "0 32px",
    height: "64px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    fontSize: "15px",
    fontWeight: 700,
    color: "var(--text-primary)",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    letterSpacing: "-0.02em",
  },
  mark: {
    width: "20px",
    height: "20px",
    borderRadius: "6px",
    background: "linear-gradient(135deg, var(--brand) 0%, #e8a84c 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "10px",
    fontWeight: 800,
    color: "var(--bg-primary)",
  },
  nav: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
    fontSize: "13px",
  },
  navLink: {
    color: "var(--text-secondary)",
    textDecoration: "none",
    transition: "color var(--duration-fast) var(--ease-out)",
    fontWeight: 500,
  },
};

export default function Header() {
  const loc = useLocation();
  return (
    <header style={headerStyles.outer}>
      <Link to="/" style={headerStyles.logo}>
        <span style={headerStyles.mark}>S</span>
        <span>Skill Gallery</span>
      </Link>
      <nav style={headerStyles.nav}>
        {loc.pathname !== "/" && (
          <Link to="/" style={headerStyles.navLink}>
            Back to Gallery
          </Link>
        )}
      </nav>
    </header>
  );
}
