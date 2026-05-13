"use client";

import { useI18nReady } from "@/hooks/useI18nReady";

export const Footer = () => {
  const { t, isReady } = useI18nReady();

  return (
    <footer className="w-full mt-auto py-8 border-t border-slate-200 dark:border-slate-800 transition-all duration-300">
      <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
        <p>
          {isReady
            ? t("footer.copyright")
            : "© 2026 App Universe. All rights reserved."}
        </p>
      </div>
    </footer>
  );
};
