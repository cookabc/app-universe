"use client";

import { ExternalLink } from "lucide-react";
import type { Tool } from "@/data/tools";
import { TOOL_CATEGORIES } from "@/data/tools";
import { useI18nReady } from "@/hooks/useI18nReady";
import { getIcon } from "@/lib/icon-map";

interface ToolCardProps {
  tool: Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
  const { i18n, t, isReady } = useI18nReady();
  const lang = i18n.language as "en" | "zh";
  const Icon = getIcon(tool.icon);
  const category = TOOL_CATEGORIES.find((c) => c.key === tool.category);

  const name = tool.name[lang] || tool.name.en;
  const desc = tool.description[lang] || tool.description.en;
  const note = tool.note?.[lang] || tool.note?.en;

  return (
    <a
      href={tool.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block h-full"
    >
      <div className="relative h-full overflow-hidden rounded-[var(--radius)] border-2 border-slate-800 bg-card p-3 sm:p-4 transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 shadow-[var(--box-shadow)] hover:shadow-[calc(var(--box-shadow)_+_4px)]">
        <div className="flex flex-row items-start gap-3">
          <div
            className="flex-shrink-0 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg text-white"
            style={{ backgroundColor: tool.color }}
          >
            <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm sm:text-base font-bold text-foreground truncate">
                {name}
              </h3>
              <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0" />
            </div>
            <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
              {desc}
            </p>
            {note && (
              <p className="text-xs text-muted-foreground/70 italic line-clamp-1 mt-1">
                {isReady ? `${t("toolsWall.curatorNote")}: ` : "Note: "}
                {note}
              </p>
            )}
          </div>

          {category && category.key !== "all" && (
            <span
              className="flex-shrink-0 px-1.5 py-0.5 rounded text-[10px] font-medium whitespace-nowrap hidden sm:inline-block"
              style={{
                backgroundColor: `${category.color}15`,
                color: category.color,
              }}
            >
              {category.label[lang] || category.label.en}
            </span>
          )}
        </div>
      </div>
    </a>
  );
}
