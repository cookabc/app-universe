import { CATEGORIES } from "../../data/categories";
interface Props {
  active: string;
  onChange: (v: string) => void;
}
export default function CategoryFilter({ active, onChange }: Props) {
  return (
    <div
      style={{ display: "flex", gap: "8px", flexWrap: "wrap", padding: "4px 0" }}
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
  color,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  color?: string;
}) {
  return (
    <button
      onClick={onClick}
      role="tab"
      aria-selected={active}
      style={{
        padding: "6px 14px",
        borderRadius: "20px",
        border: "1px solid",
        borderColor: active ? color || "var(--accent)" : "var(--border)",
        background: active ? (color || "var(--accent)") + "20" : "transparent",
        color: active ? color || "var(--accent)" : "var(--text-secondary)",
        fontSize: "12px",
        fontWeight: 500,
        cursor: "pointer",
        transition: "border-color .15s ease,background-color .15s ease,color .15s ease,transform .15s ease",
        whiteSpace: "nowrap",
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = "scale(0.96)";
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      {label}
    </button>
  );
}
