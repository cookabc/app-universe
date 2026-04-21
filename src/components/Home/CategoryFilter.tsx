import { CATEGORIES } from "../../data/categories";

interface Props {
  active: string;
  onChange: (v: string) => void;
}

export default function CategoryFilter({ active, onChange }: Props) {
  return (
    <div
      style={{
        display: "flex",
        gap: "6px",
        flexWrap: "wrap",
        padding: "8px 0",
      }}
      role="tablist"
      aria-label="Filter by category"
    >
      <Chip label="All" active={active === "all"} onClick={() => onChange("all")} />
      {CATEGORIES.map((c) => (
        <Chip
          key={c.key}
          label={`${c.icon} ${c.label}`}
          active={active === c.key}
          onClick={() => onChange(c.key)}
        />
      ))}
    </div>
  );
}

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      role="tab"
      aria-selected={active}
      style={{
        padding: "5px 12px",
        borderRadius: "3px",
        border: active ? "1px solid var(--brand)" : "1px solid var(--border-soft)",
        background: active ? "var(--tag-bg)" : "transparent",
        color: active ? "var(--brand)" : "var(--text-secondary)",
        fontSize: "11px",
        fontWeight: 500,
        letterSpacing: "0.3px",
        cursor: "pointer",
        transition: "all .15s ease",
        whiteSpace: "nowrap",
        fontFamily: "var(--font-sans)",
      }}
      onMouseDown={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "scale(0.96)";
      }}
      onMouseUp={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "scale(1)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "scale(1)";
      }}
    >
      {label}
    </button>
  );
}
