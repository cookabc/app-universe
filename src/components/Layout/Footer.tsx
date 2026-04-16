export default function Footer() {
  return (
    <footer style={{ textAlign: "center", padding: "32px 24px", borderTop: "1px solid var(--border)", color: "var(--text-secondary)", fontSize: "13px" }}>
      <p>Skill Showcase — Built with React+Vite</p>
      <p style={{ marginTop: "4px", opacity: .6 }}>Data source: ~/.claude/skills/</p>
    </footer>
  );
}
