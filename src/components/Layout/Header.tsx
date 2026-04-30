import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const loc = useLocation();
  return (
    <header className="site-header">
      <Link to="/" className="site-logo" aria-label="Capability Atlas home">
        <span className="site-logo-mark" aria-hidden="true">
          <img src="/logo.svg" alt="" className="site-logo-icon" />
        </span>
        <span className="site-logo-text">Capability Atlas</span>
      </Link>
      <nav className="site-nav" aria-label="Primary">
        {loc.pathname === "/" && (
          <>
            <a href="#resources" className="site-nav-link">
              Resources
            </a>
            <a href="#skills" className="site-nav-link">
              Capabilities
            </a>
          </>
        )}
        {loc.pathname !== "/" && (
          <Link to="/" className="site-nav-link">
            Back to Gallery
          </Link>
        )}
      </nav>
    </header>
  );
}
