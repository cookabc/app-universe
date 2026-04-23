import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getSkillById } from "../data/skills";
import LiveDemoSection from "../components/Demos/LiveDemoSection";
import RelatedSkills from "../components/SkillDetail/RelatedSkills";
import UnifiedLayout from "../components/SkillDetail/layouts/UnifiedLayout";
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

  return (
    <div>
      <main>
        <UnifiedLayout skill={skill} />
      </main>

      {skill.installCommand && (
        <section
          style={{
            maxWidth: "72ch",
            margin: "40px auto 0",
            padding: "0 20px",
          }}
        >
          <LiveDemoSection skill={skill} />
        </section>
      )}

      <section
        style={{
          maxWidth: "72ch",
          margin: "48px auto 0",
          padding: "0 20px 60px",
        }}
      >
        <RelatedSkills currentId={skill.id} />
      </section>
    </div>
  );
}
