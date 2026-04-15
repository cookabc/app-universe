"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useI18nReady } from "@/hooks/useI18nReady";
import { Trans } from "react-i18next";
import { Button } from "@/components/ui/button";

export const HeroSection = () => {
  const { t, isReady } = useI18nReady();
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative w-full py-20 md:py-32 flex items-center justify-center text-center overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-primary/10 rounded-full blur-[120px] opacity-50 animate-pulse" />
        <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-blue-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[600px] bg-purple-500/5 rounded-full blur-[100px]" />
      </div>

      <motion.div
        className="container relative z-10 px-4 space-y-8 max-w-5xl mx-auto"
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.8, ease: [0.23, 1, 0.32, 1] }}
      >
        {/* Pill Badge */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: shouldReduceMotion ? 0 : 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-sm font-medium text-muted-foreground"
          role="status"
          aria-label="Welcome badge"
        >
          <Sparkles className="w-4 h-4 text-primary" aria-hidden="true" />
          <span>
            {isReady ? t("hero.badge") : "Welcome to the Future of Apps"}
          </span>
          <ArrowRight className="w-3 h-3 ml-1" aria-hidden="true" />
        </motion.div>

        {/* Main Heading */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground leading-[1.1] whitespace-pre-line">
          {isReady ? (
            <Trans
              i18nKey="hero.title"
              components={{
                span: (
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-blue-500" />
                ),
              }}
            />
          ) : (
            <>
              All the{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-blue-500">
                AI Tools
              </span>
              {"\n"}You Need in One Place.
            </>
          )}
        </h1>

        {/* Subheading */}
        <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
          {isReady
            ? t("hero.subtitle")
            : "Experience a curated collection of next-generation applications. From generative art to intelligent automation, power your workflow with cutting-edge AI."}
        </p>

        {/* CTA Buttons */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: shouldReduceMotion ? 0 : 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
        >
          <Button asChild size="lg" className="w-full sm:w-auto px-8 py-4 text-lg font-semibold">
            <Link href="#explore" className="gap-2">
              {isReady ? t("hero.cta") : "Get Started"}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto px-8 py-4 text-lg font-semibold">
            <Link
              href={process.env.NEXT_PUBLIC_GITHUB_URL ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
            >
              {isReady ? t("hero.viewSource") : "View Source"}
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
};
