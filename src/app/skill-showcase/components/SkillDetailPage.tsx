"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getSkillById } from "../data/skills";
import LiveDemoSection from "./Demos/LiveDemoSection";
import RelatedSkills from "./SkillDetail/RelatedSkills";
import RelatedResources from "./SkillDetail/RelatedResources";
import UnifiedLayout from "./SkillDetail/layouts/UnifiedLayout";
import type { SkillData } from "../data/skills";

export default function SkillDetailPage({ id }: { id: string }) {
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
      <div style={{ textAlign: "center", padding: "80px 24px" }}>
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
          Loading skill…
        </p>
      </div>
    );
  }

  if (!skill) {
    return (
      <div style={{ textAlign: "center", padding: "80px 24px" }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "26px",
            fontWeight: 400,
            marginBottom: "8px",
          }}
        >
          {error ? "Skill data unavailable" : "Skill not found"}
        </h1>
        <p
          style={{
            color: "var(--text-secondary)",
            marginBottom: "20px",
            fontSize: "14px",
          }}
        >
          {error || `No skill found with ID: "${id}".`}
        </p>
        <Link
          href="/skill-showcase"
          style={{
            color: "var(--brand)",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
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
