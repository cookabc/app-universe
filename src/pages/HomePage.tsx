import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useSkills, useSearch } from "../hooks/useSkills";
import HeroSection from "../components/Home/HeroSection";
import SearchBar from "../components/Home/SearchBar";
import CategoryFilter from "../components/Home/CategoryFilter";
import SkillGrid from "../components/Home/SkillGrid";
import FeaturedResources from "../components/Home/FeaturedResources";
import TweaksPanel, { useTweaks, applyTweaks } from "../components/common/TweaksPanel";

export default function HomePage() {
  const { skills, loading } = useSkills();
  const [searchParams, setSearchParams] = useSearchParams();
  const { tweaks, setTweak } = useTweaks();
  const q = searchParams.get("q") || "";
  const cat = searchParams.get("cat") || "all";

  useEffect(() => {
    applyTweaks(tweaks);
  }, [tweaks]);

  const updateQueryState = (next: { q?: string; cat?: string }) => {
    const params = new URLSearchParams(searchParams);
    if (next.q !== undefined) {
      if (next.q.trim()) params.set("q", next.q);
      else params.delete("q");
    }
    if (next.cat !== undefined) {
      if (next.cat && next.cat !== "all") params.set("cat", next.cat);
      else params.delete("cat");
    }
    setSearchParams(params, { replace: true });
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

  return (
    <>
      <HeroSection />
      <FeaturedResources />
      <section id="skills" className="skills-workbench" aria-labelledby="skills-heading">
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
          <SearchBar value={q} onChange={(value) => updateQueryState({ q: value })} />
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
