import { useState } from "react";
import { useSkills, useSearch } from "../hooks/useSkills";
import HeroSection from "../components/Home/HeroSection";
import SearchBar from "../components/Home/SearchBar";
import CategoryFilter from "../components/Home/CategoryFilter";
import SkillGrid from "../components/Home/SkillGrid";
import AddSkillDialog from "../components/AddSkillDialog";

export default function HomePage() {
  const { skills, loading, addSkill } = useSkills();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const filtered = useSearch(skills, q, cat);

  if (loading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}
      >
        <span style={{ color: "var(--text-secondary)" }}>Loading skills…</span>
      </div>
    );
  }

  return (
    <>
      <HeroSection />
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          <SearchBar value={q} onChange={setQ} />
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span
              style={{
                color: "var(--text-secondary)",
                fontSize: "13px",
                fontFamily: "var(--font-mono)",
              }}
            >
              {filtered.length} results
            </span>
            <button
              onClick={() => setShowAdd(true)}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                border: "1px dashed var(--accent)",
                background: "transparent",
                color: "var(--accent)",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "background-color .15s ease, border-color .15s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(99,102,241,0.1)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "transparent";
              }}
            >
              ➕ Add Skill
            </button>
          </div>
        </div>
        <CategoryFilter active={cat} onChange={setCat} />
        <SkillGrid skills={filtered} />
      </div>
      {showAdd && <AddSkillDialog onAdd={addSkill} onClose={() => setShowAdd(false)} />}
    </>
  );
}
