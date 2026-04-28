import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getSkillById } from "../data/skills";
import LiveDemoSection from "../components/Demos/LiveDemoSection";
import RelatedSkills from "../components/SkillDetail/RelatedSkills";
import UnifiedLayout from "../components/SkillDetail/layouts/UnifiedLayout";
import CollectionLayout from "../components/SkillDetail/layouts/CollectionLayout";
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
      <div style={pageStyles.loading}>
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Loading skill…</p>
      </div>
    );
  }

  if (!skill) {
    return (
      <div style={pageStyles.notFound}>
        <h2 style={pageStyles.notFoundTitle}>Skill not found</h2>
        <p style={pageStyles.notFoundDesc}>No skill found with ID: &quot;{id}&quot;</p>
        <Link to="/" style={pageStyles.backLink}>
          Back to gallery
        </Link>
      </div>
    );
  }

  const isCollection =
    skill.type === "collection" ||
    [
      "app-icon-minimalist",
      "blueprinter",
      "design-system",
      "editorial-card-screenshot",
      "infographic-creation",
    ].includes(skill.id);

  return (
    <div className="skill-page-shell">
      <main className="skill-page-main">
        {isCollection ? <CollectionLayout skill={skill} /> : <UnifiedLayout skill={skill} />}
      </main>

      {!isCollection && skill.installCommand && (
        <section className="skill-live-demo-section">
          <LiveDemoSection skill={skill} />
        </section>
      )}

      <section className={isCollection ? "skill-related-section wide" : "skill-related-section"}>
        <RelatedSkills currentId={skill.id} />
      </section>
    </div>
  );
}
