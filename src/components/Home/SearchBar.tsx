interface Props {
  value: string;
  onChange: (v: string) => void;
}

const searchStyles = {
  wrapper: {
    position: "relative" as const,
    maxWidth: "380px",
    width: "100%",
  },
  input: {
    width: "100%",
    padding: "10px 16px 10px 40px",
    borderRadius: "var(--radius-md)",
    background: "var(--bg-surface)",
    border: "1px solid var(--border)",
    color: "var(--text-primary)",
    fontSize: "14px",
    fontFamily: "var(--font-sans)",
    transition:
      "border-color var(--duration-normal) var(--ease-out), box-shadow var(--duration-normal) var(--ease-out)",
    outline: "none",
  },
  icon: {
    position: "absolute" as const,
    left: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    width: "15px",
    height: "15px",
    color: "var(--text-muted)",
    pointerEvents: "none" as const,
  },
};

export default function SearchBar({ value, onChange }: Props) {
  return (
    <div style={searchStyles.wrapper}>
      <label htmlFor="skill-search" style={{ position: "absolute", left: "-9999px" }}>
        Search skills
      </label>
      <svg
        style={searchStyles.icon}
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <input
        id="skill-search"
        type="search"
        name="q"
        placeholder="Search skills…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
        spellCheck={false}
        style={searchStyles.input}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "var(--brand)";
          e.currentTarget.style.boxShadow = "0 0 0 3px var(--brand-subtle)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "var(--border)";
          e.currentTarget.style.boxShadow = "none";
        }}
      />
    </div>
  );
}
