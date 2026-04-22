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
        padding: "4px 0 16px",
      }}
      role="tablist"
      aria-label="Filter by category"
    >
      <Chip
        label="All"
        active={active === "all"}
        onClick={() => onChange("all")}
      />
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
        padding: "3px 10px",
        borderRadius: "2px",
        border: "none",
        background: active ? "var(--tag-bg-default)" : "transparent",
        color: active ? "var(--brand)" : "var(--stone)",
        fontSize: "10px",
        fontWeight: 600,
        letterSpacing: "0.4px",
        textTransform: "uppercase",
        cursor: "pointer",
        fontFamily: "var(--font-sans)",
        whiteSpace: "nowrap",
        transition:
          "background .15s ease, color .15s ease, box-shadow .15s ease, transform .15s ease",
        boxShadow: active ? "var(--shadow-ring)" : "none",
      }}
      onMouseDown={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "scale(0.98)";
      }}
      onMouseUp={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "scale(1)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "scale(1)";
      }}
      onMouseEnter={(e) => {
        if (!active) {
          (e.currentTarget as HTMLElement).style.background =
            "var(--tag-bg-light)";
          (e.currentTarget as HTMLElement).style.color = "var(--olive)";
        }
      }}
      onMouseOut={(e) => {
        if (!active) {
          (e.currentTarget as HTMLElement).style.background = "transparent";
          (e.currentTarget as HTMLElement).style.color = "var(--stone)";
        }
      }}
    >
      {label}
    </button>
  );
}
