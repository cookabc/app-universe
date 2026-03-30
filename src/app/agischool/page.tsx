"use client";

import React from "react";
import "./globals.css";
import { FeatureMatrix } from "./components/landing/FeatureMatrix";
import { FinalCTA } from "./components/landing/FinalCTA";
import { GamifiedJourney } from "./components/landing/GamifiedJourney";
import { Hero } from "./components/landing/Hero";
import { StudentWork } from "./components/landing/StudentWork";
import { TrustSection } from "./components/landing/TrustSection";

export default function AGISchoolPlusPage() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <Hero />
      <TrustSection />
      <FeatureMatrix />
      <GamifiedJourney />
      <StudentWork />
      <FinalCTA />
    </div>
  );
}
