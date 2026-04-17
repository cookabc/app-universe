export interface Category {
  key: string;
  label: string;
  color: string;
  gradient: string;
  icon: string;
}
export const CATEGORIES: Category[] = [
  {
    key: "diagram",
    label: "Diagram",
    color: "#6366f1",
    gradient: "linear-gradient(135deg,#6366f1,#8b5cf6)",
    icon: "📊",
  },
  {
    key: "design",
    label: "Design",
    color: "#ec4899",
    gradient: "linear-gradient(135deg,#ec4899,#f97316)",
    icon: "🎨",
  },
  {
    key: "screenshot",
    label: "Screenshot",
    color: "#f97316",
    gradient: "linear-gradient(135deg,#f97316,#eab308)",
    icon: "📷",
  },
  {
    key: "course",
    label: "Course",
    color: "#3b82f6",
    gradient: "linear-gradient(135deg,#3b82f6,#6366f1)",
    icon: "📚",
  },
  {
    key: "devtools",
    label: "DevTools",
    color: "#10b981",
    gradient: "linear-gradient(135deg,#10b981,#22c55e)",
    icon: "🗡️",
  },
  {
    key: "security",
    label: "Security",
    color: "#ef4444",
    gradient: "linear-gradient(135deg,#ef4444,#f97316)",
    icon: "🔒",
  },
  {
    key: "workflow",
    label: "Workflow",
    color: "#8b5cf6",
    gradient: "linear-gradient(135deg,#8b5cf6,#ec4899)",
    icon: "⚙️",
  },
  {
    key: "macos",
    label: "macOS",
    color: "#3b82f6",
    gradient: "linear-gradient(135deg,#3b82f6,#6366f1)",
    icon: "💻",
  },
  {
    key: "web",
    label: "Web",
    color: "#eab308",
    gradient: "linear-gradient(135deg,#eab308,#f97316)",
    icon: "🌐",
  },
];
export const MAP: Record<string, string> = {
  "fireworks-tech-graph": "diagram",
  blueprinter: "diagram",
  "infographic-creation": "diagram",
  "design-system": "design",
  "ai-style-copycat": "design",
  "editorial-card-screenshot": "design",
  "app-store-screenshots": "screenshot",
  "asc-screenshots": "screenshot",
  "app-icon-minimalist": "screenshot",
  "codebase-to-course": "course",
  "deep-domain-learning": "course",
  ink: "devtools",
  "git-author-replacement": "devtools",
  "find-skills": "devtools",
  "asc-cli-usage": "devtools",
  "slowmist-agent-security": "security",
  "follow-builders": "workflow",
  "grill-me": "workflow",
  "user-story-review": "workflow",
  "macos-menubar-tuist-app": "macos",
  "macos-design-guidelines": "macos",
  "web-design-guidelines": "web",
};
export function getCategory(id: string) {
  const k = MAP[id] || "devtools";
  return CATEGORIES.find((c) => c.key === k) || CATEGORIES[4];
}
