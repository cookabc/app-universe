"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useI18nReady } from "@/hooks/useI18nReady";
import apps from "@/data/apps";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function AppGrid() {
  const { i18n, t, isReady } = useI18nReady();
  const currentLang = i18n.language;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto"
    >
      {apps.map((app) => (
        <motion.div key={app.path} variants={item}>
          <Link
            href={app.path}
            className="group block h-full"
            aria-label={isReady ? t("launchApp", { appName: app.name[currentLang as "en" | "zh"] || app.name.en }) : `Launch ${app.name[currentLang as "en" | "zh"] || app.name.en}`}
          >
            <div className="relative h-full overflow-hidden rounded-[var(--radius)] border-2 border-slate-800 bg-card p-8 transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 shadow-[var(--box-shadow)] hover:shadow-[calc(var(--box-shadow)_+_4px)]">
              <div
                className="absolute -right-6 -top-6 h-32 w-32 rounded-[var(--radius)] opacity-20 rotate-12 transition-transform duration-500 group-hover:rotate-45"
                style={{ backgroundColor: app.color }}
              />

              <div className="relative flex flex-col h-full gap-6">
                <div className="flex items-center justify-between">
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-[var(--radius)] text-white border-2 border-slate-800 shadow-[var(--box-shadow)] transition-transform duration-300 group-hover:-translate-y-1 group-hover:-translate-x-1"
                    style={{ backgroundColor: app.color }}
                  >
                    <app.icon className="h-8 w-8" strokeWidth={2} />
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-800 bg-background text-foreground transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground shadow-[var(--box-shadow)]">
                    <ArrowRight className="h-5 w-5 -rotate-45 transition-transform duration-300 group-hover:rotate-0" />
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-2xl font-black font-heading tracking-tight text-foreground transition-colors group-hover:text-primary">
                    {app.name[currentLang as "en" | "zh"] || app.name.en}
                  </h3>
                  <p className="text-base leading-relaxed text-muted-foreground line-clamp-2">
                    {app.description[currentLang as "en" | "zh"] ||
                      app.description.en}
                  </p>
                </div>

                <div className="mt-auto flex items-center text-sm font-bold text-primary opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                  {isReady ? t("launchApp") : "Launch App"}{" "}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
