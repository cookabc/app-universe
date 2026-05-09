"use client";

import dynamic from "next/dynamic";
import "./category-colors.css";

const HomePage = dynamic(() => import("./components/HomePage"), {
  ssr: false,
  loading: () => (
    <div
      className="flex min-h-[60vh] items-center justify-center"
      role="status"
      aria-live="polite"
    >
      <span className="text-muted-foreground text-sm">Loading skills...</span>
    </div>
  ),
});

export default function SkillShowcasePage() {
  return <HomePage />;
}
