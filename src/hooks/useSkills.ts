import { useState, useEffect, useMemo, useCallback } from "react";
import {
  getAllSkills,
  registerCustomSkill,
  subscribeToSkillsChange,
  type SkillData,
} from "../data/skills";
import { CATEGORIES } from "../data/categories";

export function useSkills() {
  const [s, setS] = useState<SkillData[]>([]);
  const [l, setL] = useState(true);

  useEffect(() => {
    let mounted = true;
    getAllSkills()
      .then((data) => {
        if (mounted) {
          setS(data);
          setL(false);
        }
      })
      .catch(() => {
        if (mounted) setL(false);
      });

    const unsub = subscribeToSkillsChange((data) => {
      if (mounted) setS([...data]);
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
    return r;
  }, [sk, q, cf]);
}

export { CATEGORIES };
