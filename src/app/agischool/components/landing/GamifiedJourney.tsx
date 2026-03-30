"use client";

import { Flag, Map, Trophy, Star, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

export function GamifiedJourney() {
  const { t } = useTranslation();
  const journeySteps = t("agischool.journey.steps", {
    returnObjects: true,
  }) as Array<{ title: string; desc: string }>;
  const steps = [
    {
      icon: Flag,
      title: journeySteps[0]?.title || "",
      desc: journeySteps[0]?.desc || "",
      status: "completed",
    },
    {
      icon: Map,
      title: journeySteps[1]?.title || "",
      desc: journeySteps[1]?.desc || "",
      status: "current",
    },
    {
      icon: Star,
      title: journeySteps[2]?.title || "",
      desc: journeySteps[2]?.desc || "",
      status: "locked",
    },
    {
      icon: Trophy,
      title: journeySteps[3]?.title || "",
      desc: journeySteps[3]?.desc || "",
      status: "locked",
    },
  ];

  return (
    <section className="w-full bg-muted/30 py-24 px-4 overflow-hidden">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-black text-foreground">
            {t("agischool.journey.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("agischool.journey.subtitle")}
          </p>
        </div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-border -translate-y-1/2 hidden md:block" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center group"
              >
                <div
                  className={`
                                        w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 relative
                                        ${step.status === "completed" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" : ""}
                                        ${step.status === "current" ? "bg-background border-2 border-primary text-primary shadow-[0_0_20px_rgba(37,99,235,0.3)] scale-110" : ""}
                                        ${step.status === "locked" ? "bg-muted text-muted-foreground border border-border" : ""}
                                    `}
                >
                  <step.icon className="w-8 h-8" />
                  {step.status === "completed" && (
                    <div className="absolute -right-2 -top-2 bg-green-500 text-white rounded-full p-1 border-2 border-background">
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  )}
                </div>
                <h3
                  className={`text-lg font-bold mb-2 ${step.status === "locked" ? "text-muted-foreground" : "text-foreground"}`}
                >
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
