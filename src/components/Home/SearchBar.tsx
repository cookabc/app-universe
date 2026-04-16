interface Props { value: string; onChange: (v: string) => void }
export default function SearchBar({ value, onChange }: Props) {
  return (
    <div style={{ position: "relative", maxWidth: "400px", width: "100%" }}>
      <label htmlFor="skill-search" style={{ position: "absolute", left: "-9999px" }}>Search skills</label>
      <input
        id="skill-search"
        type="search"
        name="q"
        placeholder="Search skills…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
        spellCheck={false}
        style={{
          width: "100%", padding: "10px 16px 10px 38px",
          borderRadius: "var(--radius-md)", background: "var(--bg-card)",
          border: "1px solid var(--border)", color: "var(--text-primary)",
          fontSize: "14px", transition: "border-color .2s ease",
        }}
      />
      <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)", fontSize: "16px", pointerEvents: "none" }} aria-hidden="true">🔍</span>
    </div>
  );
}
