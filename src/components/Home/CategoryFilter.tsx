import { CATEGORIES } from "../../data/categories";

interface Props {
  active: string;
  onChange: (v: string) => void;
  availableKeys?: string[];
}

const filterStyles = {
  row: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap" as const,
    padding: "4px 0 20px",
  },
  chip: {
    padding: "6px 14px",
    borderRadius: "var(--radius-full)",
    border: "1px solid transparent",
    background: "transparent",
    color: "var(--text-muted)",
    fontSize: "12px",
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "var(--font-sans)",
    whiteSpace: "nowrap" as const,
    transition:
      "background var(--duration-fast) var(--ease-out), color var(--duration-fast) var(--ease-out), border-color var(--duration-fast) var(--ease-out), box-shadow var(--duration-fast) var(--ease-out)",
  },
};

export default function CategoryFilter({ active, onChange, availableKeys }: Props) {
  const cats = availableKeys ? CATEGORIES.filter((c) => availableKeys.includes(c.key)) : CATEGORIES;

  return (
    <div style={filterStyles.row} role="tablist" aria-label="Filter by category">
      <Chip label="All" active={active === "all"} onClick={() => onChange("all")} />
      {cats.map((c) => (
        <Chip
          key={c.key}
          label={c.label}
          catKey={c.key}
          active={active === c.key}
          onClick={() => onChange(c.key)}
        />
      ))}
    </div>
  );
}

function Chip({
  label,
  catKey,
  active,
  onClick,
}: {
  label: string;
  catKey?: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={onClick}
      onMouseDown={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "scale(0.97)";
      }}
      onMouseUp={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "scale(1)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "scale(1)";
      }}
      style={{
        ...filterStyles.chip,
        ...(active
          ? {
              background: catKey
                ? `color-mix(in srgb, var(--cat-${catKey}) 14%, transparent)`
                : "var(--brand-soft)",
              color: catKey ? `var(--cat-${catKey})` : "var(--brand)",
              borderColor: catKey
                ? `color-mix(in srgb, var(--cat-${catKey}) 25%, transparent)`
                : "var(--border-strong)",
            }
          : {}),
      }}
    >
      {label}
    </button>
  );
}
