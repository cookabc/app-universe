import { useState } from "react";
import { useSkills, useSearch } from "../hooks/useSkills";
import HeroSection from "../components/Home/HeroSection";
import SearchBar from "../components/Home/SearchBar";
import CategoryFilter from "../components/Home/CategoryFilter";
import SkillGrid from "../components/Home/SkillGrid";

export default function HomePage() {
  const { skills, loading } = useSkills();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const filtered = useSearch(skills, q, cat);

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
          </div>
        </div>
        <CategoryFilter active={cat} onChange={setCat} />
        <h2 style={{ fontSize: "20px", fontWeight: 600, marginTop: "8px" }}>
          Available Skills
        </h2>
        <SkillGrid skills={filtered} />
      </div>
    </>
  );
}
