export interface UseCase {
  icon: string;
  title: string;
  description: string;
}

export interface AnalysisResult {
  triggerPhrases: string[];
  useCases: UseCase[];
  keyFeatures: string[];
}

export function analyzeContent(
  description: string,
  content: string,
): AnalysisResult {
  const triggerPhrases: string[] = [];
  const quoted = description.match(/"([^"]+)"/g);
  if (quoted) {
    for (const q of quoted) {
      const t = q.replace(/"/g, "").trim();
      if (t.length > 1 && t.length < 80) triggerPhrases.push(t);
    }
  }
  if (!triggerPhrases.length && description.split(" ").length > 2) {
    triggerPhrases.push(description.split(" ").slice(0, 6).join(" "));
  }

  const useCases: UseCase[] = [];
  const whenM = content.match(/##\s*When\s+to\s+Use\s*\n(.*?)(?=\n##|$)/is);
  if (whenM) {
    for (const line of whenM[1].trim().split("\n")) {
      const l = line.trim().replace(/^[-*]\s*/, "");
      if (l.length > 3 && l.length < 200)
        useCases.push({ icon: "✅", title: l.slice(0, 60), description: l });
    }
  }
  if (!useCases.length) {
    const m = description.match(/Use when[^.]*/i);
    if (m)
      useCases.push({
        icon: "❌",
        title: "Primary Use Case",
        description: m[0],
      });
  }
  if (!useCases.length) {
    const keywords = [
      "diagram",
      "design",
      "chart",
      "image",
      "screenshot",
      "security",
      "workflow",
      "course",
    ];
    keywords.forEach((k) => {
      if (description.toLowerCase().includes(k) && useCases.length < 6) {
        useCases.push({
          icon: "✅",
          title: k[0].toUpperCase() + k.slice(1),
          description: `Supports ${k} operations`,
        });
      }
    });
  }

  const features: string[] = [];
  const skip = new Set([
    "install source",
    "output",
    "when to use",
    "usage examples",
    "data source",
    "screenshots",
  ]);
  for (const h of content.match(/^#{2,3}\s+(.+)$/gm) || []) {
    const t = h.trim();
    if (!skip.has(t.toLowerCase())) features.push(t);
  }

  return {
    triggerPhrases: triggerPhrases.slice(0, 12),
    useCases: useCases.slice(0, 8),
    keyFeatures: features.slice(0, 15),
  };
}
