"use client";

import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

interface LanguageOption {
  value: string;
  label: string;
  flag: string;
}

const languages: LanguageOption[] = [
  { value: "en", label: "EN", flag: "🇺🇸" },
  { value: "zh", label: "中文", flag: "🇨🇳" },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
  };

  return (
    <div
      className="flex items-center space-x-2"
      role="group"
      aria-label="Language selection"
    >
      {languages.map((lang) => (
        <Button
          key={lang.value}
          variant={i18n.language === lang.value ? "default" : "outline"}
          size="sm"
          onClick={() => handleLanguageChange(lang.value)}
          className={`transition-all duration-300 ${i18n.language === lang.value ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
          aria-pressed={i18n.language === lang.value}
          aria-label={`Switch to ${lang.label}`}
        >
          <span className="flex items-center space-x-1">
            <span aria-hidden="true">{lang.flag}</span>
            <span>{lang.label}</span>
          </span>
        </Button>
      ))}
    </div>
  );
}
