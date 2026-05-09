"use client";

import dynamic from "next/dynamic";

const HomePage = dynamic(() => import("./components/HomePage"), {
  ssr: false,
  loading: () => (
    <div className="home-loading" role="status" aria-live="polite">
      <span>Loading skills…</span>
    </div>
  ),
});

export default function SkillShowcasePage() {
  return <HomePage />;
}
