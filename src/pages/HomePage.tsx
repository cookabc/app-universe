import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useSkills, useSearch } from "../hooks/useSkills";
import HeroSection from "../components/Home/HeroSection";
import SearchBar from "../components/Home/SearchBar";
import CategoryFilter from "../components/Home/CategoryFilter";
import SkillGrid from "../components/Home/SkillGrid";
import AddSkillDialog from "../components/AddSkillDialog";
import TweaksPanel, { useTweaks, applyTweaks } from "../components/common/TweaksPanel";

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
  toolbarActions: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap" as const,
  },
  addButton: {
    padding: "10px 16px",
    borderRadius: "var(--radius-md)",
    border: "1px solid var(--border-strong)",
    background: "var(--accent)",
    color: "var(--bg-primary)",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 700,
    fontFamily: "var(--font-sans)",
    transition:
      "background-color var(--duration-fast) var(--ease-out), border-color var(--duration-fast) var(--ease-out), transform var(--duration-fast) var(--ease-out)",
  },
};

export default function HomePage() {
  const { skills, loading, addSkill } = useSkills();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showAddDialog, setShowAddDialog] = useState(false);
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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
        }}
      >
        <span style={{ color: "var(--text-muted)", fontSize: "14px" }}>Loading skills…</span>
      </div>
    );
  }

  return (
    <>
      <HeroSection />
      <div style={pageStyles.container}>
        <div style={pageStyles.toolbar}>
          <SearchBar value={q} onChange={(value) => updateQueryState({ q: value })} />
          <div style={pageStyles.toolbarActions}>
            <span style={pageStyles.resultCount}>{filtered.length} results</span>
            <button
              type="button"
              onClick={() => setShowAddDialog(true)}
              style={pageStyles.addButton}
              onMouseDown={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "scale(0.96)";
              }}
              onMouseUp={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "scale(1)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "scale(1)";
              }}
            >
              Add Skill
            </button>
          </div>
        </div>
        <CategoryFilter
          active={cat}
          onChange={(value) => updateQueryState({ cat: value })}
          availableKeys={activeCategoryKeys}
        />
        <h2 style={pageStyles.sectionTitle}>Available Skills</h2>
        <SkillGrid skills={filtered} />
      </div>

      <TweaksPanel tweaks={tweaks} onChange={setTweak} />
      {showAddDialog && (
        <AddSkillDialog
          onAdd={addSkill}
          onClose={() => {
            setShowAddDialog(false);
          }}
        />
      )}
    </>
  );
}
