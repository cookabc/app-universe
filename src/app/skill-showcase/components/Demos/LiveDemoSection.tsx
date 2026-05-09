import React from "react";
import type { SkillData } from "../../data/skills.types";
import ImageGallery from "./ImageGallery";
import ColorPalette, { extractThemeColors } from "./ColorPalette";
import TerminalWindow from "./TerminalWindow";
import DeviceFrame from "./DeviceFrame";
import CodePlayground from "./CodePlayground";

interface Props {
  skill: SkillData;
}

const ASSETS_BASE = "/skill-showcase/skills-assets";

const INK_LINES = [
  { text: "$ ink init my-app", type: "input" as const },
  { text: "Creating new ink project: my-app", type: "info" as const },
  { text: "  + src/App.ink", type: "output" as const },
  { text: "  + src/components/", type: "output" as const },
  { text: "  + ink.config.json", type: "output" as const },
  { text: "", type: "output" as const },
  { text: "Done! Run 'ink dev' to start.", type: "success" as const },
];

const GIT_LINES = [
  { text: "$ git-author-replace --repo ./my-project", type: "input" as const },
  { text: "Scanning commit history...", type: "info" as const },
  {
    text: "Found 42 commits by Old Name <old@email.com>",
    type: "output" as const,
  },
  { text: "Replacing with: New Name <new@email.com>", type: "output" as const },
  { text: "", type: "output" as const },
  { text: "Rewritten 42 commits across 8 branches.", type: "success" as const },
  { text: "Run 'git push --force' to update remote.", type: "info" as const },
];

const SECURITY_LINES = [
  {
    text: "> Reviewing skill: example-mcp-tool v1.2.0",
    type: "input" as const,
  },
  { text: "[SCAN] Analyzing package manifest...", type: "info" as const },
  { text: "[SCAN] Checking dependency chain...", type: "info" as const },
  {
    text: "[WARN] Dependency 'request' has known CVE-2023-28158",
    type: "error" as const,
  },
  { text: "[PASS] No secrets found in source code", type: "success" as const },
  { text: "[PASS] Input sanitization verified", type: "success" as const },
  { text: "[INFO] Risk Score: Medium (6/10)", type: "info" as const },
];

const GRILL_LINES = [
  {
    text: "> I want to build a real-time chat app with WebSockets",
    type: "input" as const,
  },
  { text: "", type: "output" as const },
  { text: "[HOT] Let us grill this plan!", type: "error" as const },
  { text: "", type: "output" as const },
  {
    text: "Q1: What happens if WebSocket connection drops?",
    type: "info" as const,
  },
  {
    text: "   - You mention auto-reconnect but no backoff strategy",
    type: "output" as const,
  },
  {
    text: "   - How do you handle message ordering after reconnect?",
    type: "output" as const,
  },
  { text: "", type: "output" as const },
  {
    text: "Q2: Horizontal scaling with multiple server instances?",
    type: "info" as const,
  },
  {
    text: "   - Your plan uses in-memory state. Will not work at scale.",
    type: "output" as const,
  },
  {
    text: "   - Consider Redis pub/sub or a message broker.",
    type: "output" as const,
  },
  { text: "", type: "output" as const },
  { text: "Q3: Authentication for WS connections?", type: "info" as const },
  {
    text: "   - Token validation on upgrade is missing.",
    type: "error" as const,
  },
];

const COURSE_LINES = [
  {
    text: "$ codebase-to-course ./src --output ./course",
    type: "input" as const,
  },
  { text: "Analyzing codebase structure...", type: "info" as const },
  { text: "  Found 24 modules across 8 directories", type: "output" as const },
  {
    text: "  Detected patterns: React hooks, REST API, State management",
    type: "output" as const,
  },
  { text: "Generating interactive course...", type: "info" as const },
  {
    text: "  + Module 1: Project Architecture Overview",
    type: "success" as const,
  },
  { text: "  + Module 2: Core Components Deep Dive", type: "success" as const },
  {
    text: "  + Module 3: Data Flow and State Management",
    type: "success" as const,
  },
  { text: "  + Module 4: API Integration Patterns", type: "success" as const },
  { text: "", type: "output" as const },
  { text: "Course ready! Open ./course/index.html", type: "success" as const },
];

const BUILDER_LINES = [
  { text: "$ follow-builders --digest weekly", type: "input" as const },
  {
    text: "Fetching latest posts from configured sources...",
    type: "info" as const,
  },
  { text: "", type: "output" as const },
  { text: "[DIGEST] This Week's Builder Digest:", type: "success" as const },
  { text: "", type: "output" as const },
  {
    text: "[Evan You] What is next for Vite+ and Rolldown",
    type: "output" as const,
  },
  {
    text: "  -> Key insight: Unified toolchain reduces config by 70%",
    type: "info" as const,
  },
  { text: "", type: "output" as const },
  {
    text: "[tbl] Oxc: Blazing fast JS tools written in Rust",
    type: "output" as const,
  },
  {
    text: "  -> Key insight: 100x faster than ESLint for large repos",
    type: "info" as const,
  },
  { text: "", type: "output" as const },
  {
    text: "[Anthony Fu] TanStack Start: Full-stack React done right",
    type: "output" as const,
  },
  {
    text: "  -> Key insight: Type-safe from server to client",
    type: "info" as const,
  },
];

export default function LiveDemoSection({ skill }: Props) {
  const demos = getDemosForSkill(skill);
  if (!demos.length) return null;

  return (
    <div style={{ marginTop: "32px", maxWidth: "65ch", padding: "12px 16px" }}>
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "18px",
          fontWeight: 400,
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          color: "var(--text-primary)",
        }}
      >
        <span
          style={{
            width: "3px",
            height: "18px",
            background: "var(--brand)",
            borderRadius: "1.5px",
            display: "inline-block",
          }}
        />
        Live Demo
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {demos.map((demo, i) => (
          <div key={i}>{demo}</div>
        ))}
      </div>
    </div>
  );
}

function getDemosForSkill(skill: SkillData): React.ReactNode[] {
  const el: React.ReactNode[] = [];
  const id = skill.id;
  const assets = skill.assets as Record<string, any> | undefined;
  const content = skill.content;

  switch (id) {
    case "design-system": {
      let themes = assets?.themes || [];
      if (!themes.length && assets?.systemJson) {
        themes = extractThemeColors(assets.systemJson);
      }
      if (themes.length)
        el.push(
          <ColorPalette key="cp" themes={themes} title="11 Design Systems" />,
        );
      const screenshots = (assets?.screenshots || []).map((s: string) => ({
        url: `${ASSETS_BASE}/${id}/${s}`,
        title: s.replace(".png", ""),
        caption: s.replace(".png", "").replace(/-/g, " "),
      }));
      if (screenshots.length)
        el.push(
          <ImageGallery
            key="ig"
            images={screenshots}
            title="Theme Screenshots"
            height="300px"
          />,
        );
      break;
    }
    case "fireworks-tech-graph": {
      const samples = (assets?.samples || []).map((s: string) => ({
        url: `${ASSETS_BASE}/${id}/${s}`,
        title: s.replace("sample-", "").replace(".png", ""),
        caption: s
          .replace("sample-", "")
          .replace(".png", "")
          .replace(/-/g, " "),
      }));
      if (samples.length)
        el.push(
          <ImageGallery
            key="ig"
            images={samples}
            title="Diagram Styles"
            height="340px"
          />,
        );
      const codeExamples = extractCodeBlocksLimited(content, 3);
      if (codeExamples.length)
        el.push(
          <CodePlayground
            key="cp"
            examples={codeExamples}
            title="SVG Generation Examples"
          />,
        );
      break;
    }
    case "asc-screenshots":
    case "app-store-screenshots": {
      const devices = (assets?.screenshots || []).map((s: string) => ({
        url: `${ASSETS_BASE}/${id}/${s}`,
        device: inferDevice(s),
        label: makeLabel(s),
      }));
      if (devices.length)
        el.push(
          <DeviceFrame
            key="df"
            screenshots={devices}
            title="App Store Screenshots"
          />,
        );
      break;
    }
    case "editorial-card-screenshot": {
      const codeExamples = extractCodeBlocksLimited(content, 4);
      if (codeExamples.length)
        el.push(
          <CodePlayground
            key="cp"
            examples={codeExamples}
            title="Card Template Examples"
          />,
        );
      break;
    }
    case "ink":
      el.push(
        <TerminalWindow
          key="tw"
          lines={INK_LINES}
          title="Ink Terminal UI"
          height="200px"
        />,
      );
      break;
    case "blueprinter": {
      const codeExamples = extractCodeBlocksLimited(content, 3);
      if (codeExamples.length)
        el.push(
          <CodePlayground
            key="cp"
            examples={codeExamples}
            title={`${skill.name} Examples`}
          />,
        );
      break;
    }
    case "git-author-replacement":
      el.push(
        <TerminalWindow
          key="tw"
          lines={GIT_LINES}
          title="Git Author Replacement"
          height="220px"
        />,
      );
      break;
    case "slowmist-agent-security":
      el.push(
        <TerminalWindow
          key="tw"
          lines={SECURITY_LINES}
          title="Security Audit Report"
          height="240px"
        />,
      );
      break;
    case "grill-me":
      el.push(
        <TerminalWindow
          key="tw"
          lines={GRILL_LINES}
          title="Grill Me - Plan Review"
          height="320px"
        />,
      );
      break;
    case "codebase-to-course":
      el.push(
        <TerminalWindow
          key="tw"
          lines={COURSE_LINES}
          title="Codebase to Course Generator"
          height="280px"
        />,
      );
      break;
    case "follow-builders":
      el.push(
        <TerminalWindow
          key="tw"
          lines={BUILDER_LINES}
          title="Follow Builders Digest"
          height="290px"
        />,
      );
      break;
    case "find-skills":
    case "asc-cli-usage":
    case "macos-menubar-tuist-app":
    case "user-story-review":
    case "deep-domain-learning":
    case "web-design-guidelines":
    case "macos-design-guidelines":
    case "ai-style-copycat":
    case "app-icon-minimalist": {
      const codeExamples = extractCodeBlocksLimited(content, 4);
      if (codeExamples.length)
        el.push(
          <CodePlayground
            key="cp"
            examples={codeExamples}
            title={`${skill.name} Examples`}
          />,
        );
      break;
    }
    default:
      break;
  }

  return el;
}

function makeLabel(s: string): string {
  return s.replace(/[-.]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function inferDevice(filename: string): string {
  const lower = filename.toLowerCase();
  if (lower.includes("iphone") && lower.includes("pro-max"))
    return "iphone-pro-max";
  if (lower.includes("iphone")) return "iphone-pro";
  if (lower.includes("ipad-pro-13")) return "ipad-pro-13";
  if (lower.includes("ipad")) return "ipad-pro-11";
  return "iphone-pro";
}

function extractCodeBlocksLimited(
  content: string,
  max: number,
): { language: string; code: string; title?: string; description?: string }[] {
  const re = /\x60\x60\x60(\w*)\n([\s\S]*?)\x60\x60\x60/g;
  const results: {
    language: string;
    code: string;
    title?: string;
    description?: string;
  }[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(content)) !== null && results.length < max) {
    const code = m[2].trim();
    if (code.length > 20 && code.length < 5000) {
      let lang = m[1] || "text";
      // Map common aliases
      const langMap: Record<string, string> = {
        js: "javascript",
        py: "python",
        sh: "bash",
        rb: "ruby",
        md: "markdown",
      };
      lang = langMap[lang] || lang;
      results.push({ language: lang, code: stripHljs(code) });
    }
  }
  return results;
}

function stripHljs(code: string): string {
  return code
    .replace(/<\/?span[^>]*>/gi, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}
