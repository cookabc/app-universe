import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getSkillById } from "../data/skills";
import LiveDemoSection from "../components/Demos/LiveDemoSection";
import RelatedSkills from "../components/SkillDetail/RelatedSkills";
import RelatedResources from "../components/SkillDetail/RelatedResources";
import UnifiedLayout from "../components/SkillDetail/layouts/UnifiedLayout";
import type { SkillData } from "../data/skills";

const pageStyles = {
  loading: {
    textAlign: "center" as const,
    padding: "80px 24px",
  },
  notFound: {
    textAlign: "center" as const,
    padding: "80px 24px",
  },
  notFoundTitle: {
    fontFamily: "var(--font-display)",
    fontSize: "26px",
    fontWeight: 400,
    marginBottom: "8px",
  },
  notFoundDesc: {
    color: "var(--text-secondary)",
    marginBottom: "20px",
    fontSize: "14px",
  },
  backLink: {
    color: "var(--brand)",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: 500,
  },
};

export default function SkillDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [skill, setSkill] = useState<SkillData | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    getSkillById(decodeURIComponent(id))
      .then((s) => {
        setSkill(s);
        setError(null);
        setLoading(false);
      })
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : "Failed to load skill.");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div style={pageStyles.loading}>
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Loading skill…</p>
      </div>
    );
  }

  if (!skill) {
    return (
      <div style={pageStyles.notFound}>
        <h1 style={pageStyles.notFoundTitle}>
          {error ? "Skill data unavailable" : "Skill not found"}
        </h1>
        <p style={pageStyles.notFoundDesc}>{error || `No skill found with ID: "${id}".`}</p>
        <Link to="/" style={pageStyles.backLink}>
          Back to gallery
        </Link>
      </div>
    );
  }

  return (
    <div className="skill-page-shell">
      <div className="skill-page-main">
        <UnifiedLayout skill={skill} />
      </div>

      {skill.installCommand && (
        <section className="skill-live-demo-section">
          <LiveDemoSection skill={skill} />
        </section>
      )}

      <section className="skill-related-section">
        <RelatedResources skillId={skill.id} />
      </section>

      <section className="skill-related-section">
        <RelatedSkills currentId={skill.id} />
      </section>
    </div>
  );
}
