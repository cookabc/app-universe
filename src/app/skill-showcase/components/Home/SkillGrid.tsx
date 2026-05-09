import { useEffect, useRef, useState, useCallback } from "react";
import SkillCard from "./SkillCard";
import type { SkillData } from "../../data/skills";

interface Props {
  skills: SkillData[];
}

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
      <div className="skill-empty-state">
        <p className="skill-empty-title">No Skills Found</p>
        <p className="skill-empty-desc">
          Try a broader search or clear the active category.
        </p>
      </div>
    );

  return (
    <div ref={ref} className="skill-grid">
      {skills.map((s, i) => (
        <SkillCard key={s.id} skill={s} index={i} visible={visible} />
      ))}
    </div>
  );
}
