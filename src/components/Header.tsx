"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeSwitch } from "@/components/theme-switch";
import { ClerkAuth } from "./ClerkAuth";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useClerkEnabled } from "./ClerkProvider";
import { useState, useRef, useEffect } from "react";
import { useI18nReady } from "@/hooks/useI18nReady";
import { Menu, X } from "lucide-react";

export const Header = () => {
  const { isEnabled } = useClerkEnabled();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, isReady } = useI18nReady();
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Focus management: trap focus in mobile menu when open
  useEffect(() => {
    if (mobileMenuOpen && menuRef.current) {
      // Focus the first focusable element in the menu
      const focusableElements = menuRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      }
    }
  }, [mobileMenuOpen]);

  // Handle escape key to close menu
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
        // Return focus to menu button
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 h-20 flex justify-between items-center">
        <Link
          href="/"
          className="text-xl md:text-2xl font-black font-heading tracking-tight text-foreground hover:text-primary transition-all duration-300 transform hover:scale-105"
        >
          {isReady ? t("app.name") : "App Universe"}
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4">
          <LanguageSwitcher />
          <ThemeSwitch width={56} height={28} className="scale-90" />
          {isEnabled ? <ClerkAuth /> : null}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center space-x-3">
          <ThemeSwitch width={44} height={22} className="scale-80" />
          <Button
            ref={menuButtonRef}
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="relative rounded-full p-2 transition-all duration-300 hover:bg-muted"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 transition-transform duration-300" />
            ) : (
              <Menu className="w-6 h-6 transition-transform duration-300" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        ref={menuRef}
        id="mobile-menu"
        role="navigation"
        aria-label="Mobile navigation"
        aria-hidden={!mobileMenuOpen}
        className={`md:hidden border-t border-border bg-background transition-all duration-300 ease-in-out overflow-hidden ${mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="container mx-auto px-4 py-6 flex flex-col items-center space-y-6">
          <LanguageSwitcher />
          {isEnabled ? <ClerkAuth /> : null}
        </div>
      </div>
    </header>
  );
};
