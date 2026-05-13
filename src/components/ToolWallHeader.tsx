"use client";

import { useI18nReady } from "@/hooks/useI18nReady";

export function ToolWallHeader() {
  const { t, isReady } = useI18nReady();

  return (
    <div className="flex flex-col items-center text-center gap-2 py-4 sm:py-6">
      <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-foreground">
        App Universe
      </h1>
      <p className="text-sm text-muted-foreground max-w-md">
        {isReady
          ? t("toolsWall.subtitle")
          : "A curated collection of tools I use and build"}
      </p>
    </div>
  );
}
