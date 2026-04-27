import { useEffect, useRef, useState, useCallback } from "react";
import SkillCard from "./SkillCard";
import type { SkillData } from "../../data/skills";

interface Props {
  skills: SkillData[];
}

const gridStyles = {
  empty: {
    textAlign: "center" as const,
    padding: "80px 24px",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: "12px",
  },
  emptyTitle: {
    fontFamily: "var(--font-display)",
    fontSize: "20px",
    fontWeight: 400,
    color: "var(--text-secondary)",
  },
  emptyDesc: {
    fontSize: "14px",
    color: "var(--text-muted)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
  },
};

export default function SkillGrid({ skills }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  const onIntersect = useCallback((entries: IntersectionObserverEntry[]) => {
    if (entries[0]?.isIntersecting) setVisible(true);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || !skills.length) return;
    const obs = new IntersectionObserver(onIntersect, { threshold: 0.08 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [skills.length, onIntersect]);

  if (!skills.length)
    return (
      <div style={gridStyles.empty}>
        <p style={gridStyles.emptyTitle}>No skills found</p>
        <p style={gridStyles.emptyDesc}>Try adjusting your search or filters</p>
      </div>
    );

  return (
    <div ref={ref} style={gridStyles.grid}>
      {skills.map((s, i) => (
        <SkillCard key={s.id} skill={s} index={i} visible={visible} />
      ))}
    </div>
  );
}
