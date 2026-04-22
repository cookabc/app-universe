import type { SkillData } from "../../data/skills";

export type LayoutMode = "compact" | "standard" | "tutorial" | "encyclopedic";

interface LayoutConfig {
  mode: LayoutMode;
  maxWidth: string;
  showSidebar: boolean;
  showTOC: boolean;
  showCodePanel: boolean;
  columns: number;
}

export function determineLayoutMode(skill: SkillData): LayoutMode {
  const { lineCount, complexityLabel } = skill.stats;
  const sections = (skill.content.match(/^## /gm) || []).length;
  const codeBlocks = (skill.content.match(/```/g) || []).length / 2;

  // Encyclopedic: Very large documents with many sections
  if (
    lineCount > 400 ||
    complexityLabel.includes("Complex") ||
    complexityLabel.includes("Expert") ||
    sections > 10
  ) {
    return {
      mode: "encyclopedic",
      maxWidth: "90ch",
      showSidebar: true,
      showTOC: true,
      showCodePanel: codeBlocks > 8,
      columns: 2,
    };
  }

  // Tutorial: Medium complexity with code examples
  if (lineCount >= 200 || complexityLabel === "Moderate" || codeBlocks > 5) {
    return {
      mode: "tutorial",
      maxWidth: "85ch",
      showSidebar: true,
      showTOC: false,
      showCodePanel: codeBlocks > 3,
      columns: 1,
    };
  }

  // Standard: Normal skills with good content
  if (
    lineCount >= 80 ||
    complexityLabel === "Simple" ||
    complexityLabel === "Basic" ||
    sections >= 4
  ) {
    return {
      mode: "standard",
      maxWidth: "75ch",
      showSidebar: true,
      showTOC: false,
      showCodePanel: false,
      columns: 1,
    };
  }

  // Compact: Very small/trivial skills
  return {
    mode: "compact",
    maxWidth: "65ch",
    showSidebar: false,
    showTOC: false,
    showCodePanel: false,
    columns: 1,
  };
}

export function getLayoutDescription(mode: LayoutMode): string {
  switch (mode) {
    case "compact":
      return "Quick Reference";
    case "standard":
      return "One-Pager";
    case "tutorial":
      return "Tutorial";
    case "encyclopedic":
      return "Full Documentation";
    default:
      return "";
  }
}
