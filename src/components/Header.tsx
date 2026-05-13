"use client";

import Link from "next/link";
import { ThemeSwitch } from "@/components/theme-switch";
import { useI18nReady } from "@/hooks/useI18nReady";
import { LanguageSwitcher } from "./LanguageSwitcher";

export const Header = () => {
  const { t, isReady } = useI18nReady();

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60 transition-all duration-300">
      <div className="container max-w-7xl mx-auto px-4 h-12 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm font-black font-heading tracking-tight text-foreground hover:text-primary transition-colors"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 125 125"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="62.5"
              cy="62.5"
              r="58"
              stroke="currentColor"
              strokeWidth="8"
            />
            <circle
              cx="62.5"
              cy="62.5"
              r="32"
              stroke="currentColor"
              strokeWidth="8"
            />
            <circle cx="62.5" cy="62.5" r="10" fill="currentColor" />
          </svg>
          {isReady ? t("app.name") : "App Universe"}
        </Link>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeSwitch width={44} height={22} className="scale-85" />
        </div>
      </div>
    </header>
  );
};
