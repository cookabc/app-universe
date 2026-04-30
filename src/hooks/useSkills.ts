import { useState, useEffect, useMemo, useCallback } from "react";
import {
  getAllSkills,
  registerCustomSkill,
  subscribeToSkillsChange,
  type SkillData,
} from "../data/skills";
import { CATEGORIES } from "../data/categories";

const SKILL_DISPLAY_ORDER = [
  "opc-methodology",
  "khazix-skills",
  "gpt-image-2",
  "kami",
  "impeccable-style",
  "ui-ux-pro-max",
  "web-design-engineer",
  "markdown-viewer-skills",
  "editorial-card-screenshot",
  "blueprinter",
  "design-system",
  "app-icon-minimalist",
];

function sortSkillsForGallery(skills: SkillData[]): SkillData[] {
  return [...skills].sort((a, b) => {
    const ai = SKILL_DISPLAY_ORDER.indexOf(a.id);
    const bi = SKILL_DISPLAY_ORDER.indexOf(b.id);
    const ar = ai === -1 ? Number.MAX_SAFE_INTEGER : ai;
    const br = bi === -1 ? Number.MAX_SAFE_INTEGER : bi;
    if (ar !== br) return ar - br;
    return a.name.localeCompare(b.name);
  });
}

export function useSkills() {
  const [s, setS] = useState<SkillData[]>([]);
  const [l, setL] = useState(true);

  useEffect(() => {
    let mounted = true;
    getAllSkills()
      .then((data) => {
        if (mounted) {
          setS(sortSkillsForGallery(data));
          setL(false);
        }
      })
      .catch(() => {
        if (mounted) setL(false);
      });

    const unsub = subscribeToSkillsChange((data) => {
      if (mounted) setS(sortSkillsForGallery(data));
    });

    return () => {
      mounted = false;
      unsub();
    };
  }, []);

  const addSkill = useCallback((skill: SkillData) => {
    registerCustomSkill(skill);
  }, []);

  return { skills: s, loading: l, total: s.length, addSkill };
}

export function useSearch(sk: SkillData[], q: string, cf: string) {
  return useMemo(() => {
    let r = [...sk];
    if (cf && cf !== "all") r = r.filter((s) => s.category.key === cf);
    if (q.trim()) {
      const ql = q.toLowerCase();
      r = r.filter(
        (s) =>
          s.name.toLowerCase().includes(ql) ||
          s.description.toLowerCase().includes(ql) ||
          s.id.toLowerCase().includes(ql),
      );
    }
    return sortSkillsForGallery(r);
  }, [sk, q, cf]);
}

export { CATEGORIES };
