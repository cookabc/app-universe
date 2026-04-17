export interface SkillFrontmatter {
  name?: string;
  description?: string;
  [key: string]: any;
}

export interface ParsedSkill {
  frontmatter: SkillFrontmatter;
  content: string;
  rawContent: string;
}

const FRONTMATTER_REGEX = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

export function parseSkillMarkdown(raw: string): ParsedSkill {
  const match = raw.match(FRONTMATTER_REGEX);
  if (!match) return { frontmatter: {}, content: raw.trim(), rawContent: raw };

  const yamlStr = match[1];
  const frontmatter: SkillFrontmatter = {};

  yamlStr.split("\n").forEach((line) => {
    const ci = line.indexOf(":");
    if (ci === -1) return;
    const key = line.slice(0, ci).trim();
    let val = line.slice(ci + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'")))
      val = val.slice(1, -1);
    frontmatter[key] = val;
  });

  const content = raw.slice(match[0].length).trim();
  return { frontmatter, content, rawContent: raw };
}

export function extractTitle(content: string): string {
  const m = content.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : "";
}

export function extractInstallCommand(content: string): string | null {
  const m = content.match(/npx\s+skills\s+add\s+[\w\-/.@]+/);
  return m ? m[0] : null;
}

export function extractHeadings(content: string): { level: number; text: string; id: string }[] {
  const heads: { level: number; text: string; id: string }[] = [];
  const re = /^(#{1,4})\s+(.+)$/gm;
  let m: RegExpExecArray | null;
  while ((m = re.exec(content)) !== null)
    heads.push({
      level: m[1].length,
      text: m[2].trim(),
      id: m[2]
        .trim()
        .toLowerCase()
        .replace(/[^\w]+/g, "-"),
    });
  return heads;
}

export function extractCodeBlocks(content: string): { language: string; code: string }[] {
  const blocks: { language: string; code: string }[] = [];
  const re = /\x60\x60\x60(\w*)\n([\s\S]*?)\x60\x60\x60/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(content)) !== null) blocks.push({ language: m[1] || "text", code: m[2] });
  return blocks;
}
