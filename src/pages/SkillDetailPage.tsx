import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getSkillById } from "../data/skills";
import SkillHeroBanner from "../components/SkillDetail/SkillHeroBanner";
import AISummaryCard from "../components/SkillDetail/AISummaryCard";
import StatsDashboard from "../components/SkillDetail/StatsDashboard";
import TriggerPhraseCloud from "../components/SkillDetail/TriggerPhraseCloud";
import LiveDemoSection from "../components/Demos/LiveDemoSection";
import ContentTabs from "../components/SkillDetail/ContentTabs";
import RelatedSkills from "../components/SkillDetail/RelatedSkills";
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
        <h2 style={{ fontSize: "24px", marginBottom: "8px" }}>Skill not found</h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "16px" }}>
          No skill found with ID: "{id}"
        </p>
        <Link to="/" style={{ color: "var(--accent)" }}>
          &#8592; Back to gallery
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-in" style={{ maxWidth: "60ch", margin: "0 auto", padding: "20px" }}>
      <SkillHeroBanner skill={skill} />
      <h2 style={{ fontSize: "20px", fontWeight: 600, margin: "24px 0 16px" }}>Skill Details</h2>
      <AISummaryCard skill={skill} />
      <StatsDashboard skill={skill} />
      <TriggerPhraseCloud phrases={skill.triggerPhrases} />
      <LiveDemoSection skill={skill} />
      <ContentTabs skill={skill} />
      <RelatedSkills currentId={skill.id} />
    </div>
  );
}
