export type ResourceKind = "frameworks" | "design-system" | "style-prompts";

export interface DesignResource {
  id: string;
  name: string;
  url: string;
  kind: ResourceKind;
  eyebrow: string;
  description: string;
  bestFor: string[];
  tags: string[];
  relatedSkillIds: string[];
  featured: boolean;
  accent: string;
}
