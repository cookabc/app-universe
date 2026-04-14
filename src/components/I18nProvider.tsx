"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import enTranslations from "@/../public/locales/en/common.json";
import zhTranslations from "@/../public/locales/zh/common.json";

const resources = {
  en: { common: enTranslations },
  zh: { common: zhTranslations },
};

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      lng: "en",
      fallbackLng: "en",
      ns: ["common"],
      defaultNS: "common",
      detection: {
        order: ["path", "cookie", "localStorage", "navigator", "htmlTag"],
        caches: ["cookie"],
      },
      interpolation: {
        escapeValue: true,
      },
    });
}

interface I18nProviderProps {
  children: React.ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const router = useRouter();
  const { i18n } = useTranslation();

  useEffect(() => {
    // Sync language with URL
    const handleLanguageChange = (lng: string) => {
      const url = new URL(window.location.href);
      if (url.pathname.startsWith(`/${i18n.language}/`)) {
        url.pathname = url.pathname.replace(`/${i18n.language}/`, `/${lng}/`);
        router.push(url.toString());
      }
    };

    i18n.on("languageChanged", handleLanguageChange);
    return () => i18n.off("languageChanged", handleLanguageChange);
  }, [i18n, router]);

  return <>{children}</>;
}
