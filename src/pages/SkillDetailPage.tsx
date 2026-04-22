import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getSkillById } from "../data/skills";
import SkillHeroBanner from "../components/SkillDetail/SkillHeroBanner";
import LiveDemoSection from "../components/Demos/LiveDemoSection";
import RelatedSkills from "../components/SkillDetail/RelatedSkills";
import CompactLayout from "../components/SkillDetail/layouts/CompactLayout";
import StandardLayout from "../components/SkillDetail/layouts/StandardLayout";
import TutorialLayout from "../components/SkillDetail/layouts/TutorialLayout";
import EncyclopedicLayout from "../components/SkillDetail/layouts/EncyclopedicLayout";
import {
  determineLayoutMode,
  getLayoutDescription,
} from "../utils/SkillLayoutEngine";
import type { SkillData } from "../data/skills";

export default function SkillDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [skill, setSkill] = useState<SkillData | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    getSkillById(decodeURIComponent(id))
      .then((s) => {
        setSkill(s);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "80px 24px" }}>
        <p style={{ color: "var(--text-secondary)" }}>Loading skill...</p>
      </div>
    );
  }

  if (!skill) {
    return (
      <div style={{ textAlign: "center", padding: "80px 24px" }}>
        <h2
          style={{
            fontSize: "24px",
            fontFamily: "var(--font-serif)",
            fontWeight: 500,
            marginBottom: "8px",
          }}
        >
          Skill not found
        </h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "16px" }}>
          No skill found with ID: "{id}"
        </p>
        <Link
          to="/"
          style={{
            color: "var(--brand)",
            textDecoration: "none",
            fontSize: "14px",
          }}
        >
          ← Back to gallery
        </Link>
      </div>
    );
  }

  // Determine the best layout for this skill
  const layoutConfig = determineLayoutMode(skill);
  const layoutDescription = getLayoutDescription(layoutConfig.mode);

  return (
    <div>
      {/* Hero banner - shown for all skills */}
      <section
        style={{
          maxWidth:
            layoutConfig.maxWidth === "90ch" ? "100ch" : layoutConfig.maxWidth,
          margin: "0 auto",
          padding: "20px 20px 0",
        }}
      >
        <SkillHeroBanner skill={skill} />

        {/* Layout mode indicator - subtle badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "8px",
            marginTop: "-12px",
            marginBottom: "8px",
            paddingRight: "4px",
          }}
        >
          <span
            style={{
              fontSize: "10px",
              color: "var(--olive)",
              fontFamily: "var(--font-mono)",
            }}
          >
            {layoutDescription}
          </span>
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background:
                layoutConfig.mode === "compact"
                  ? "#10b981"
                  : layoutConfig.mode === "standard"
                    ? "#3b82f6"
                    : layoutConfig.mode === "tutorial"
                      ? "#f59e0b"
                      : "#ef4444",
              display: "inline-block",
            }}
          />
        </div>
      </section>

      {/* Dynamic layout based on skill characteristics */}
      <main>
        {layoutConfig.mode === "compact" && <CompactLayout skill={skill} />}
        {layoutConfig.mode === "standard" && <StandardLayout skill={skill} />}
        {layoutConfig.mode === "tutorial" && <TutorialLayout skill={skill} />}
        {layoutConfig.mode === "encyclopedic" && (
          <EncyclopedicLayout skill={skill} />
        )}
      </main>

      {/* Live demo section (if applicable) */}
      {skill.installCommand && layoutConfig.mode !== "compact" && (
        <section
          style={{
            maxWidth: layoutConfig.maxWidth,
            margin: "40px auto 0",
            padding: "0 20px",
          }}
        >
          <LiveDemoSection skill={skill} />
        </section>
      )}

      {/* Related skills - shown for all */}
      <section
        style={{
          maxWidth:
            layoutConfig.mode === "encyclopedic"
              ? "100ch"
              : layoutConfig.maxWidth,
          margin: "48px auto 0",
          padding: "0 20px 60px",
        }}
      >
        <RelatedSkills currentId={skill.id} />
      </section>
    </div>
  );
}
