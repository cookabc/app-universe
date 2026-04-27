import { useState, useEffect } from "react";
import { useSkills, useSearch } from "../hooks/useSkills";
import HeroSection from "../components/Home/HeroSection";
import SearchBar from "../components/Home/SearchBar";
import CategoryFilter from "../components/Home/CategoryFilter";
import SkillGrid from "../components/Home/SkillGrid";
import TweaksPanel, {
  useTweaks,
  applyTweaks,
} from "../components/common/TweaksPanel";

const pageStyles = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "24px",
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap" as const,
    justifyContent: "space-between",
  },
  resultCount: {
    fontSize: "12px",
    color: "var(--text-muted)",
    fontFamily: "var(--font-mono)",
    fontVariantNumeric: "tabular-nums" as const,
  },
  sectionTitle: {
    fontFamily: "var(--font-display)",
    fontSize: "22px",
    fontWeight: 400,
    color: "var(--text-primary)",
    marginTop: "8px",
    letterSpacing: "-0.02em",
  },
};

export default function HomePage() {
  const { skills, loading } = useSkills();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const { tweaks, setTweak } = useTweaks();

  useEffect(() => {
    applyTweaks(tweaks);
  }, [tweaks]);

  const filtered = useSearch(skills, q, cat);
  const activeCategoryKeys = [...new Set(skills.map((s) => s.category.key))];

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
        }}
      >
        <span style={{ color: "var(--text-muted)", fontSize: "14px" }}>
          Loading skills…
        </span>
      </div>
    );
  }

  return (
    <>
      <HeroSection />
      <div style={pageStyles.container}>
        <div style={pageStyles.toolbar}>
          <SearchBar value={q} onChange={setQ} />
          <span style={pageStyles.resultCount}>{filtered.length} results</span>
        </div>
        <CategoryFilter
          active={cat}
          onChange={setCat}
          availableKeys={activeCategoryKeys}
        />
        <h2 style={pageStyles.sectionTitle}>Available Skills</h2>
        <SkillGrid skills={filtered} />
      </div>

      <TweaksPanel tweaks={tweaks} onChange={setTweak} />
    </>
  );
}
