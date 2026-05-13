"use client";

import { useTranslation } from "react-i18next";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const isZh = i18n.language === "zh";

  return (
    <button
      type="button"
      onClick={() => i18n.changeLanguage(isZh ? "en" : "zh")}
      className="text-xs text-muted-foreground hover:text-foreground transition-colors tabular-nums"
      aria-label={isZh ? "Switch to English" : "切换到中文"}
    >
      {isZh ? "EN" : "中文"}
    </button>
  );
}
