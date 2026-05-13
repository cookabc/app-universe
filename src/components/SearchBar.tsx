"use client";

import { Search, X } from "lucide-react";
import { useI18nReady } from "@/hooks/useI18nReady";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  const { t, isReady } = useI18nReady();

  return (
    <div className="relative w-full max-w-lg mx-auto">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={
          isReady
            ? t("toolsWall.searchPlaceholder")
            : "Search tools by name, category, or keyword..."
        }
        className="w-full rounded-[var(--radius)] border-2 border-slate-800 bg-card pl-10 pr-10 py-2.5 text-sm shadow-[var(--box-shadow)] outline-none transition-all duration-200 placeholder:text-muted-foreground focus:-translate-y-0.5 focus:shadow-[calc(var(--box-shadow)_+_2px)]"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
