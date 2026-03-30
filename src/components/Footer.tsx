"use client";

import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

export const Footer = () => {
  const year = new Date().getFullYear();
  const { t, i18n } = useTranslation();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(i18n.isInitialized);
  }, [i18n.isInitialized]);

  return (
    <footer className="w-full mt-auto py-8 border-t border-slate-200 dark:border-slate-800 transition-all duration-300">
      <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
        <p>
          &copy; {year} {isReady ? t("app.name") : "App Universe"}.{" "}
          {isReady ? t("footer.copyright") : "All rights reserved."}
        </p>
      </div>
    </footer>
  );
};
