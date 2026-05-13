"use client";

import { Sparkles } from "lucide-react";
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
          <Sparkles className="h-4 w-4 text-primary" />
          {isReady ? t("app.name") : "App Universe"}
        </Link>

        <div className="flex items-center gap-1.5">
          <LanguageSwitcher />
          <ThemeSwitch width={44} height={22} className="scale-85" />
        </div>
      </div>
    </header>
  );
};
