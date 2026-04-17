import { useState } from "react";
import type { SkillData } from "../data/skills.types";

interface Props {
  onAdd: (skill: SkillData) => void;
  onClose: () => void;
}

function parseGithubUrl(
  input: string,
): { owner: string; repo: string; branch: string; rawUrl: string } | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  const m1 = trimmed.match(/^https?:\/\/github\.com\/([^/]+)\/([^/]+)(?:\/tree\/([^/]+))?/);
  if (m1)
    return {
      owner: m1[1],
      repo: m1[2],
      branch: m1[3] || "main",
      rawUrl:
        "https://raw.githubusercontent.com/" +
        m1[1] +
        "/" +
        m1[2] +
        "/" +
        (m1[3] || "main") +
        "/SKILL.md",
    };
  const m2 = trimmed.match(/^https?:\/\/raw\.githubusercontent\.com\/([^/]+)\/([^/]+)\/([^/]+)/);
  if (m2) return { owner: m2[1], repo: m2[2], branch: m2[3], rawUrl: trimmed };
  const m3 = trimmed.match(/^([^/]+)\/([^/]+)$/);
  if (m3)
    return {
      owner: m3[1],
      repo: m3[2],
      branch: "main",
      rawUrl: "https://raw.githubusercontent.com/" + m3[1] + "/" + m3[2] + "/main/SKILL.md",
    };
  return null;
}

async function fetchSkillFromUrl(rawUrl: string): Promise<string> {
  const resp = await fetch(rawUrl, { headers: { Accept: "text/plain" } });
  if (!resp.ok) throw new Error("Failed to fetch SKILL.md: " + resp.status + " " + resp.statusText);
  return resp.text();
}

function buildSkillId(owner: string, repo: string): string {
  return "custom-" + owner.toLowerCase() + "-" + repo.toLowerCase().replace(/[^a-z0-9-]/g, "-");
}

export default function AddSkillDialog({ onAdd, onClose }: Props) {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "preview">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [preview, setPreview] = useState<SkillData | null>(null);

  const handleParse = async () => {
    const parsed = parseGithubUrl(url);
    if (!parsed) {
      setStatus("error");
      setErrorMsg("Invalid GitHub URL. Use format: owner/repo or https://github.com/owner/repo");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      const raw = await fetchSkillFromUrl(parsed.rawUrl);
      const fm = extractFrontmatter(raw);
      const body = extractBody(raw);
      const title = extractTitle(body) || fm.name || parsed.repo;
      const desc = (fm.description || "").slice(0, 300);
      const skill: SkillData = {
        id: buildSkillId(parsed.owner, parsed.repo),
        name: title,
        description: desc,
        category: {
          key: "devtools",
          label: "Custom",
          color: "#8b5cf6",
          gradient: "linear-gradient(135deg,#8b5cf6,#6366f1)",
          icon: "✨",
        },
        stats: analyzeStats(body),
        triggerPhrases: extractTriggers(desc),
        useCases: [],
        keyFeatures: extractFeatures(body),
        installCommand: extractInstall(body),
        content: body,
        fileInfo: { totalFiles: 0, totalSizeStr: "Remote", tree: { name: "remote", type: "dir" } },
        lastUpdated: new Date().toISOString().split("T")[0],
        assets: { screenshots: [], samples: [] },
      };
      setPreview(skill);
      setStatus("preview");
    } catch (e: any) {
      setStatus("error");
      setErrorMsg(e.message || "Failed to load SKILL.md.");
    }
  };

  const handleAdd = () => {
    if (preview) {
      onAdd(preview);
      onClose();
    }
  };

  return (
    <div
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Add skill from GitHub"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        overscrollBehavior: "contain",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 560,
          borderRadius: 16,
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: "16px", fontWeight: 700 }}>➕ Add Skill from GitHub</span>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            style={{
              background: "none",
              border: "none",
              color: "var(--text-secondary)",
              cursor: "pointer",
              fontSize: 20,
              padding: 4,
            }}
          >
            ✕
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleParse();
          }}
          style={{ padding: "20px" }}
        >
          <div style={{ marginBottom: 12 }}>
            <label
              htmlFor="github-url"
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: 600,
                marginBottom: 6,
                color: "var(--text-primary)",
              }}
            >
              GitHub Repository URL
            </label>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                id="github-url"
                type="url"
                name="github-url"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (status !== "idle") {
                    setStatus("idle");
                    setErrorMsg("");
                    setPreview(null);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleParse();
                }}
                placeholder="owner/repo or https://github.com/owner/repo"
                autoComplete="off"
                spellCheck={false}
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  borderRadius: 8,
                  border: "1px solid var(--border)",
                  background: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  fontSize: "14px",
                  transition: "border-color .2s ease",
                }}
              />
              <button
                type="submit"
                disabled={status === "loading" || !url.trim()}
                style={{
                  padding: "10px 18px",
                  borderRadius: 8,
                  border: "none",
                  background: status === "loading" ? "var(--text-secondary)" : "var(--accent)",
                  color: "#fff",
                  cursor: status === "loading" ? "not-allowed" : "pointer",
                  fontWeight: 600,
                  fontSize: "13px",
                  whiteSpace: "nowrap",
                  transition: "background-color .15s ease",
                }}
              >
                {status === "loading" ? "Loading…" : "Fetch"}
              </button>
            </div>
          </div>
          {status === "error" && (
            <div
              role="alert"
              style={{
                padding: "10px 14px",
                borderRadius: 8,
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.3)",
                color: "#fca5a5",
                fontSize: "13px",
                marginBottom: 12,
              }}
            >
              {errorMsg}
            </div>
          )}
          {status === "preview" && preview && (
            <div
              style={{
                marginTop: 12,
                borderRadius: 12,
                background: "var(--bg-secondary)",
                border: "1px solid var(--border)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "12px 16px",
                  borderBottom: "1px solid var(--border)",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                }}
              >
                📝 Preview
              </div>
              <div style={{ padding: "16px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: 4 }}>
                  {preview.name}
                </h3>
                <p
                  style={{
                    fontSize: "13px",
                    color: "var(--text-secondary)",
                    marginBottom: 12,
                    lineHeight: 1.5,
                  }}
                >
                  {preview.description || "No description available."}
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    flexWrap: "wrap",
                    fontSize: "12px",
                    color: "var(--text-secondary)",
                  }}
                >
                  <span>📄 {preview.stats.lineCount} lines</span>
                  <span>📑 {preview.stats.sectionCount} sections</span>
                  <span>⚡ {preview.stats.complexityLabel}</span>
                  <span>⏱️ {preview.stats.readTime}</span>
                </div>
              </div>
              <div
                style={{
                  padding: "12px 16px",
                  borderTop: "1px solid var(--border)",
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 8,
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setStatus("idle");
                    setPreview(null);
                    setUrl("");
                  }}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                    background: "transparent",
                    color: "var(--text-secondary)",
                    cursor: "pointer",
                    fontSize: "13px",
                    transition: "background-color .15s ease",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAdd}
                  style={{
                    padding: "8px 20px",
                    borderRadius: 8,
                    border: "none",
                    background: "var(--accent)",
                    color: "#fff",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: "13px",
                    transition: "background-color .15s ease",
                  }}
                >
                  ✅ Add to Gallery
                </button>
              </div>
            </div>
          )}
          {status === "idle" && !url && (
            <div style={{ marginTop: 12, fontSize: "12px", color: "var(--text-secondary)" }}>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Try these:</div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                  fontFamily: "var(--font-mono)",
                }}
              >
                <button
                  type="button"
                  onClick={() => setUrl("yizhiyanhua-ai/fireworks-tech-graph")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--text-secondary)",
                    cursor: "pointer",
                    textAlign: "left",
                    font: "inherit",
                    padding: "2px 0",
                    opacity: 0.7,
                    transition: "opacity .15s ease",
                  }}
                >
                  yizhiyanhua-ai/fireworks-tech-graph
                </button>
                <button
                  type="button"
                  onClick={() => setUrl("https://github.com/example/skill-repo")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--text-secondary)",
                    cursor: "pointer",
                    textAlign: "left",
                    font: "inherit",
                    padding: "2px 0",
                    opacity: 0.7,
                    transition: "opacity .15s ease",
                  }}
                >
                  https://github.com/example/skill-repo
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

function extractFrontmatter(raw: string): Record<string, string> {
  const fm: Record<string, string> = {};
  if (!raw.startsWith("---")) return fm;
  const parts = raw.split("---", 3);
  if (parts.length < 3) return fm;
  for (const line of parts[1].trim().split("\n")) {
    const ci = line.indexOf(":");
    if (ci === -1) continue;
    const key = line.slice(0, ci).trim();
    let val = line.slice(ci + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'")))
      val = val.slice(1, -1);
    if (val.startsWith(">") || val.startsWith("|")) continue;
    fm[key] = val;
  }
  return fm;
}
function extractBody(raw: string): string {
  if (!raw.startsWith("---")) return raw.trim();
  const p = raw.split("---", 3);
  return p.length >= 3 ? p[2].trim() : "";
}
function extractTitle(body: string): string {
  const m = body.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : "";
}
function extractTriggers(desc: string): string[] {
  const t: string[] = [];
  const q = desc.match(/"([^"]+)"/g);
  if (q)
    for (const x of q) {
      const v = x.replace(/"/g, "").trim();
      if (v.length > 1 && v.length < 80) t.push(v);
    }
  if (!t.length && desc.split(" ").length > 2) t.push(desc.split(" ").slice(0, 6).join(" "));
  return t.slice(0, 8);
}
function analyzeStats(body: string): SkillData["stats"] {
  const lines = body.split("\n").length;
  const chars = body.length;
  const secs = (body.match(/^#{2,4}\s/gm) || []).length;
  const cbs = (body.match(/```/g) || []).length / 2;
  const sc = Math.min(10, Math.max(1, Math.round((secs * 1.5 + cbs + lines / 100) / 10)));
  const lb: Record<number, string> = {
    1: "Trivial",
    2: "Simple",
    3: "Basic",
    4: "Basic+",
    5: "Moderate",
    6: "Moderate+",
    7: "Complex",
    8: "Complex+",
    9: "Advanced",
    10: "Expert",
  };
  return {
    lineCount: lines,
    charCount: chars,
    sectionCount: secs,
    codeBlockCount: cbs,
    complexityScore: sc,
    complexityLabel: lb[sc] || "Moderate",
    readTime: Math.max(1, Math.round(lines / 50)) + " min",
  };
}
function extractFeatures(body: string): string[] {
  const f: string[] = [];
  const skip = [
    "install source",
    "output",
    "when to use",
    "usage examples",
    "data source",
    "screenshots",
  ];
  for (const h of body.match(/^#{2,3}\s+(.+)$/gm) || []) {
    const t = h.trim();
    if (!skip.includes(t.toLowerCase())) f.push(t);
  }
  return f.slice(0, 10);
}
function extractInstall(body: string): string | null {
  const m = body.match(/npx\s+skills\s+add\s+[\w\-./@]+/);
  return m ? m[0] : null;
}
