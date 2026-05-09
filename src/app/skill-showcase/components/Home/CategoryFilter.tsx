import type { CSSProperties } from "react";
import { CATEGORIES } from "../../data/categories";

interface Props {
  active: string;
  onChange: (v: string) => void;
  availableKeys?: string[];
}

export default function CategoryFilter({
  active,
  onChange,
  availableKeys,
}: Props) {
  const cats = availableKeys
    ? CATEGORIES.filter((c) => availableKeys.includes(c.key))
    : CATEGORIES;

  return (
    <div
      className="category-filter"
      role="tablist"
      aria-label="Filter by category"
    >
      <Chip
        label="All"
        active={active === "all"}
        onClick={() => onChange("all")}
      />
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
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className="category-chip"
      data-active={active ? "true" : "false"}
      style={
        catKey
          ? ({
              "--chip-color": `var(--cat-${catKey}, var(--brand))`,
            } as CSSProperties)
          : undefined
      }
    >
      <span className="category-chip-dot" aria-hidden="true" />
      {label}
    </button>
  );
}
