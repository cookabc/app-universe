"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSkills, useSearch } from "../hooks/useSkills";
import HeroSection from "./Home/HeroSection";
import SearchBar from "./Home/SearchBar";
import CategoryFilter from "./Home/CategoryFilter";
import SkillGrid from "./Home/SkillGrid";
import FeaturedResources from "./Home/FeaturedResources";
import TweaksPanel, { useTweaks, applyTweaks } from "./common/TweaksPanel";

export default function HomePage() {
  const { skills, loading, error } = useSkills();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { tweaks, setTweak } = useTweaks();
  const q = searchParams.get("q") || "";
  const cat = searchParams.get("cat") || "all";

  useEffect(() => {
    applyTweaks(tweaks);
  }, [tweaks]);

  const updateQueryState = (next: { q?: string; cat?: string }) => {
    const params = new URLSearchParams(searchParams.toString());
    if (next.q !== undefined) {
      if (next.q.trim()) params.set("q", next.q);
      else params.delete("q");
    }
    if (next.cat !== undefined) {
      if (next.cat && next.cat !== "all") params.set("cat", next.cat);
      else params.delete("cat");
    }
    router.replace(`/skill-showcase?${params.toString()}`);
  };

  const filtered = useSearch(skills, q, cat);
  const activeCategoryKeys = [...new Set(skills.map((s) => s.category.key))];

  if (loading) {
    return (
      <div className="home-loading" role="status" aria-live="polite">
        <span>Loading skills…</span>
      </div>
    );
  }

  if (error) {
    return (
      <section className="app-error-state" aria-labelledby="skills-load-error">
        <p className="app-error-kicker">Data unavailable</p>
        <h1 id="skills-load-error">Skill data could not be loaded.</h1>
        <p>{error}</p>
      </section>
    );
  }

  return (
    <>
      <HeroSection />
      <FeaturedResources />
      <section
        id="skills"
        className="skills-workbench"
        aria-labelledby="skills-heading"
      >
        <div className="workbench-header">
          <div>
            <p className="workbench-kicker">Explore</p>
            <h2 id="skills-heading" className="workbench-title">
              Available Skills
            </h2>
          </div>
          <div className="workbench-actions">
            <span className="result-count" aria-live="polite">
              {filtered.length} results
            </span>
          </div>
        </div>

        <div className="workbench-controls">
          <SearchBar
            value={q}
            onChange={(value) => updateQueryState({ q: value })}
          />
          <CategoryFilter
            active={cat}
            onChange={(value) => updateQueryState({ cat: value })}
            availableKeys={activeCategoryKeys}
          />
        </div>

        <SkillGrid skills={filtered} />
      </section>

      <TweaksPanel tweaks={tweaks} onChange={setTweak} />
    </>
  );
}
