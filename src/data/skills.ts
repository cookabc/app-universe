import type { SkillData } from "./skills.types";

export type { SkillData };

let _cache: SkillData[] | null = null;
let _promise: Promise<SkillData[]> | null = null;
const _customListeners: Array<(skills: SkillData[]) => void> = [];
const skillsDataUrl = `${import.meta.env.BASE_URL}skills-data.json`;

export async function loadSkillsData(): Promise<SkillData[]> {
  if (_cache) return _cache;
  if (_promise) return _promise;

  _promise = fetch(skillsDataUrl)
    .then((r) => {
      if (!r.ok) throw new Error("Failed to load skills data: " + r.status);
      return r.json();
    })
    .then((data: SkillData[]) => {
      _cache = data;
      return data;
    });

  return _promise;
}

export async function getAllSkills(): Promise<SkillData[]> {
  return loadSkillsData();
}

export async function getSkillById(id: string): Promise<SkillData | undefined> {
  const skills = await loadSkillsData();
  return skills.find((s) => s.id === id);
}

export function registerCustomSkill(skill: SkillData): void {
  loadSkillsData().then((data) => {
    const existing = data.findIndex((s) => s.id === skill.id);
    if (existing >= 0) {
      data[existing] = skill;
    } else {
      data.push(skill);
    }
    _notifyListeners(data);
  });
}

export function removeCustomSkill(id: string): void {
  if (_cache) {
    _cache = _cache.filter((s) => s.id !== id && !s.id.startsWith("custom-"));
    _notifyListeners(_cache);
  }
}

export function subscribeToSkillsChange(cb: (skills: SkillData[]) => void): () => void {
  _customListeners.push(cb);
  return () => {
    const idx = _customListeners.indexOf(cb);
    if (idx >= 0) _customListeners.splice(idx, 1);
  };
}

function _notifyListeners(skills: SkillData[]): void {
  for (const cb of _customListeners) {
    try {
      cb(skills);
    } catch (e) {
      console.warn("Skill listener error", e);
    }
  }
}
