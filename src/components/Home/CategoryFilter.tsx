import { CATEGORIES } from "../../data/categories";
import { Button } from "@/components/ui/button";

interface Props {
  active: string;
  onChange: (v: string) => void;
}

export default function CategoryFilter({ active, onChange }: Props) {
  return (
    <div className="flex gap-2 flex-wrap py-1" role="tablist" aria-label="Filter by category">
      <Button 
        variant={active === "all" ? "default" : "ghost"} 
        size="sm"
        onClick={() => onChange("all")}
        className="rounded-full px-4"
      >
        All
      </Button>
      {CATEGORIES.map((c) => (
        <Button
          key={c.key}
          variant={active === c.key ? "default" : "ghost"}
          size="sm"
          onClick={() => onChange(c.key)}
          className="rounded-full px-4"
        >
          {c.icon} {c.label}
        </Button>
      ))}
    </div>
  );
}
