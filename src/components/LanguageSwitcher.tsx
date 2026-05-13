"use client";

import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const isZh = i18n.language === "zh";

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => i18n.changeLanguage(isZh ? "en" : "zh")}
      className="h-7 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground"
      aria-label={isZh ? "Switch to English" : "切换到中文"}
    >
      <Languages className="h-3.5 w-3.5" />
      <span>{isZh ? "EN" : "中"}</span>
    </Button>
  );
}
