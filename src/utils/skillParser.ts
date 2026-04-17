export interface ParsedGitHubUrl {
  owner: string;
  repo: string;
  branch: string;
  rawUrl: string;
}

const GITHUB_PATTERNS = [
  /^https?:\/\/github\.com\/([^/]+)\/([^/]+)(?:\/tree\/([^/]+))?/,
  /^https?:\/\/raw\.githubusercontent\.com\/([^/]+)\/([^/]+)\/([^/]+)/,
  /^([^/]+)\/([^/]+)$/,
];

export function parseGithubUrl(input: string): ParsedGitHubUrl | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  for (const pattern of GITHUB_PATTERNS) {
    const m = trimmed.match(pattern);
    if (m) {
      return {
        owner: m[1],
        repo: m[2],
        branch: m[3] || "main",
        rawUrl:
          "https://raw.githubusercontent.com/" +
          m[1] +
          "/" +
          m[2] +
          "/" +
          (m[3] || "main") +
          "/SKILL.md",
      };
    }
  }
  return null;
}

export async function fetchSkillFromUrl(rawUrl: string): Promise<string> {
  const resp = await fetch(rawUrl, { headers: { Accept: "text/plain" } });
  if (!resp.ok) throw new Error("Failed to fetch SKILL.md: " + resp.status + " " + resp.statusText);
  return resp.text();
}

export function buildSkillId(owner: string, repo: string): string {
  return "custom-" + owner.toLowerCase() + "-" + repo.toLowerCase().replace(/[^a-z0-9-]/g, "-");
}
