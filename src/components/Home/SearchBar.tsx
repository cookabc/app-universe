interface Props { value: string; onChange: (v: string) => void }
export default function SearchBar({ value, onChange }: Props) {
  return (
    <div style={{ position: "relative", maxWidth: "400px", width: "100%" }}>
      <input
        type="text"
        placeholder="Search skills..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%", padding: "10px 16px 10px 38px",
          borderRadius: "var(--radius-md)", background: "var(--bg-card)",
          border: "1px solid var(--border)", color: "var(--text-primary)",
          fontSize: "14px", outline: "none", transition: "border-color .2s",
        }}
        onFocus={(e) => (e.target as HTMLElement).style.borderColor = "var(--accent)"}
        onBlur={(e) => (e.target as HTMLElement).style.borderColor = "var(--border)"}
      />
      <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)", fontSize: "16px" }}>🔍</span>
    </div>
  );
}
