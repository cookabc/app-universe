import type { SkillData } from "../data/skills";

export type ShowcaseKind = "image" | "generated-flow" | "generated-output" | "generated-prompt";

export interface SkillResourceLink {
  label: string;
  url: string;
  kind: "skills" | "github" | "website";
}

export interface SkillShowcaseModel {
  primaryTrigger: string;
  assetUrls: string[];
  kind: ShowcaseKind;
  updateCommand: string | null;
  resourceLinks: SkillResourceLink[];
  workflowSteps: string[];
  outputSummary: string;
  topUseCases: SkillData["useCases"];
}

const FLOW_WORDS = [
  "workflow",
  "pipeline",
  "process",
  "diagram",
  "flow",
  "course",
  "security",
  "review",
  "agent",
  "orchestrate",
];

const PROMPT_WORDS = ["prompt", "image", "screenshot", "style", "design", "icon", "generate"];

function toPublicAssetUrl(skill: SkillData, path: string): string {
  if (/^https?:\/\//.test(path) || path.startsWith("/")) return path;
  return `${import.meta.env.BASE_URL}skills-assets/${skill.id}/${path}`;
}

function titleCase(text: string): string {
  return text
    .replace(/^#+\s*/, "")
    .replace(/[-_]/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function inferKind(skill: SkillData, assetUrls: string[]): ShowcaseKind {
  if (assetUrls.length > 0) return "image";
  const haystack =
    `${skill.id} ${skill.name} ${skill.description} ${skill.keyFeatures.join(" ")}`.toLowerCase();
  if (FLOW_WORDS.some((word) => haystack.includes(word))) return "generated-flow";
  if (PROMPT_WORDS.some((word) => haystack.includes(word))) return "generated-prompt";
  return "generated-output";
}

function deriveWorkflowSteps(skill: SkillData): string[] {
  const fromFeatures = skill.keyFeatures
    .map(titleCase)
    .filter((feature) => feature.length > 2 && feature.length < 72)
    .slice(0, 4);

  if (fromFeatures.length >= 3) return fromFeatures;

  const fallback = [
    `Invoke with ${skill.triggerPhrases[0] || skill.id}`,
    "Provide the task context and constraints",
    "Let the skill produce the working artifact",
    "Review, iterate, and ship the result",
  ];

  return [...fromFeatures, ...fallback].slice(0, 4);
}

function deriveOutputSummary(skill: SkillData): string {
  if (skill.children?.length) {
    return `${skill.children.length} coordinated modules packaged as a reusable capability bundle.`;
  }
  if (skill.assets.screenshots.length || skill.assets.samples.length) {
    return "A visual case study with source examples and reusable output references.";
  }
  if (skill.description) return skill.description;
  return "A structured operating workflow for applying this skill in agent work.";
}

export function getSkillUpdateCommand(skill: SkillData): string | null {
  if (skill.localOnly) return null;
  if (skill.updateCommand) return skill.updateCommand;
  if (skill.installCommand) return skill.installCommand;
  if (skill.sourceUrl?.startsWith("https://github.com/"))
    return `npx skills add ${skill.sourceUrl}`;
  return `npx skills add ${skill.id}`;
}

function getGithubUrl(skill: SkillData): string | null {
  if (skill.githubUrl) return skill.githubUrl;
  if (skill.sourceUrl?.startsWith("https://github.com/")) return skill.sourceUrl;

  const fromGithubUrl = skill.installCommand?.match(/https:\/\/github\.com\/[^\s]+/)?.[0];
  if (fromGithubUrl) return fromGithubUrl.replace(/\/skills\/.+$/, "");

  const fromOwnerRepo = skill.installCommand?.match(
    /\bnpx\s+skills\s+add\s+([\w.-]+\/[\w.-]+)/,
  )?.[1];
  if (fromOwnerRepo) return `https://github.com/${fromOwnerRepo}`;

  return null;
}

function getSkillsShUrl(skill: SkillData): string | null {
  if (skill.localOnly) return null;
  if (skill.skillsShUrl) return skill.skillsShUrl;
  if (skill.sourceUrl?.startsWith("https://skills.sh/")) return skill.sourceUrl;

  const githubUrl = getGithubUrl(skill);
  const skillFlag = skill.installCommand?.match(/\s--skill\s+([^\s]+)/)?.[1];
  if (githubUrl && skillFlag) {
    const path = githubUrl.replace("https://github.com/", "");
    return `https://skills.sh/${path}/${skillFlag}`;
  }

  return null;
}

function getWebsiteUrl(skill: SkillData): string | null {
  if (skill.websiteUrl) return skill.websiteUrl;
  if (
    skill.sourceUrl &&
    !skill.sourceUrl.startsWith("https://github.com/") &&
    !skill.sourceUrl.startsWith("https://skills.sh/")
  ) {
    return skill.sourceUrl;
  }
  return null;
}

function getResourceLinks(skill: SkillData): SkillResourceLink[] {
  const links: SkillResourceLink[] = [];
  const skillsShUrl = getSkillsShUrl(skill);
  const githubUrl = getGithubUrl(skill);
  const websiteUrl = getWebsiteUrl(skill);

  if (skillsShUrl) links.push({ label: "Skills.sh", url: skillsShUrl, kind: "skills" });
  if (githubUrl) links.push({ label: "GitHub", url: githubUrl, kind: "github" });
  if (websiteUrl) links.push({ label: "Website", url: websiteUrl, kind: "website" });

  return links;
}

export function buildSkillShowcaseModel(skill: SkillData): SkillShowcaseModel {
  const assetUrls = [...skill.assets.screenshots, ...skill.assets.samples]
    .filter(Boolean)
    .slice(0, 8)
    .map((path) => toPublicAssetUrl(skill, path));

  return {
    primaryTrigger: skill.triggerPhrases[0] || skill.id,
    assetUrls,
    kind: inferKind(skill, assetUrls),
    updateCommand: getSkillUpdateCommand(skill),
    resourceLinks: getResourceLinks(skill),
    workflowSteps: deriveWorkflowSteps(skill),
    outputSummary: deriveOutputSummary(skill),
    topUseCases: skill.useCases.slice(0, 4),
  };
}
