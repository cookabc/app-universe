type LocaleText = { en: string; zh: string };

export interface ToolCategory {
  key: string;
  label: LocaleText;
  color: string;
  icon: string;
}

export interface Tool {
  id: string;
  type: "link";
  name: LocaleText;
  description: LocaleText;
  category: string;
  tags: string[];
  url: string;
  icon: string;
  color: string;
  githubUrl?: string;
  note?: LocaleText;
}

export const TOOL_CATEGORIES: ToolCategory[] = [
  {
    key: "all",
    label: { en: "All", zh: "全部" },
    color: "#6366f1",
    icon: "LayoutGrid",
  },
  {
    key: "finance",
    label: { en: "Finance", zh: "金融理财" },
    color: "#ef4444",
    icon: "TrendingUp",
  },
  {
    key: "design",
    label: { en: "Design", zh: "设计灵感" },
    color: "#ec4899",
    icon: "Palette",
  },
  {
    key: "productivity",
    label: { en: "Productivity", zh: "效率办公" },
    color: "#f97316",
    icon: "Zap",
  },
  {
    key: "resources",
    label: { en: "Resources", zh: "资源集合" },
    color: "#eab308",
    icon: "BookOpen",
  },
];

const TOOLS: Tool[] = [
  {
    id: "getdesign-md",
    type: "link",
    name: { en: "getdesign.md", zh: "getdesign.md" },
    description: {
      en: "DESIGN.md collection for AI coding agents",
      zh: "AI 编码助手设计系统集合，生成高质量 UI",
    },
    category: "design",
    tags: ["design", "ai", "coding", "design-system", "ui"],
    url: "https://getdesign.md/",
    icon: "BookOpen",
    color: "#1b365d",
  },
  {
    id: "open-design",
    type: "link",
    name: { en: "Open Design", zh: "Open Design" },
    description: {
      en: "Open-source design studio with 31 skills and 72 design systems",
      zh: "开源设计工作室，31 个可组合技能与 72 个品牌级设计系统",
    },
    category: "design",
    tags: ["design", "open-source", "ai", "skills", "studio"],
    url: "https://open-design.ai/",
    icon: "Palette",
    color: "#6366f1",
  },
  {
    id: "designprompts",
    type: "link",
    name: { en: "Design Prompts", zh: "Design Prompts" },
    description: {
      en: "AI design style explorer with 31+ rendered styles",
      zh: "AI 驱动的设计风格探索器，31+ 种风格提示词",
    },
    category: "design",
    tags: ["design", "ai", "prompts", "style", "explorer"],
    url: "https://www.designprompts.dev/",
    icon: "Wand",
    color: "#0a0a0a",
  },
  {
    id: "impeccable",
    type: "link",
    name: { en: "Impeccable", zh: "Impeccable" },
    description: {
      en: "AI design intelligence with 23 commands for frontend design",
      zh: "AI设计智能工具，23 个命令覆盖排版、色彩、动效与交互",
    },
    category: "design",
    tags: ["design", "ai", "commands", "frontend", "typography"],
    url: "https://impeccable.style/",
    icon: "Sparkles",
    color: "#6366f1",
  },
  {
    id: "kami",
    type: "link",
    name: { en: "Kami", zh: "Kami" },
    description: {
      en: "Warm parchment design system for AI-assisted documents",
      zh: "AI 代理的文档设计系统，温暖的羊皮纸风格排版",
    },
    category: "productivity",
    tags: ["document", "design-system", "ai", "pdf", "typeset"],
    url: "https://kami.tw93.fun/",
    icon: "Pencil",
    color: "#8b7355",
  },
  {
    id: "opc-skills",
    type: "link",
    name: { en: "OPC Skills", zh: "一人企业技能" },
    description: {
      en: "9 Agent Skills for building a lightweight personal business",
      zh: "可执行的一人企业方法论，9 个技能构建个人业务系统",
    },
    category: "productivity",
    tags: ["business", "methodology", "skills", "agent", "one-person"],
    url: "https://opc-skills.ft07.com/",
    icon: "Briefcase",
    color: "#78716c",
  },
  {
    id: "docu-md",
    type: "link",
    name: { en: "Docu.md", zh: "Docu.md" },
    description: {
      en: "One-click Markdown to Word with Mermaid, LaTeX, and charts",
      zh: "一键将 Markdown 转换为完美 Word 文档",
    },
    category: "productivity",
    tags: ["markdown", "word", "document", "converter", "mermaid"],
    url: "https://docu.md/",
    icon: "BookOpen",
    color: "#10b981",
  },
  {
    id: "pmframe",
    type: "link",
    name: { en: "PMFrame", zh: "PMFrame" },
    description: {
      en: "Product management framework with 100 principles",
      zh: "产品管理方法论框架，100 个原则涵盖用户研究与设计思维",
    },
    category: "productivity",
    tags: ["product", "management", "framework", "methodology", "principles"],
    url: "https://pmframe.works/",
    icon: "Lightbulb",
    color: "#f59e0b",
  },
  {
    id: "k2ai",
    type: "link",
    name: { en: "K2AI", zh: "K2AI" },
    description: {
      en: "AI civilization market system and investment terminal",
      zh: "AI文明市场系统及投资终端，追踪算力与产业链信号",
    },
    category: "finance",
    tags: ["ai", "investment", "market", "analysis", "compute"],
    url: "https://app.k2ai.dev/",
    icon: "Brain",
    color: "#8b5cf6",
  },
  {
    id: "fund-cccd",
    type: "link",
    name: { en: "基估宝", zh: "基估宝" },
    description: {
      en: "Fund tracking and portfolio management tool",
      zh: "基金追踪和投资组合管理工具",
    },
    category: "finance",
    tags: ["fund", "investment", "portfolio", "tracking"],
    url: "https://fund.cc.cd/",
    icon: "BarChart3",
    color: "#3b82f6",
  },
  {
    id: "neal-fun",
    type: "link",
    name: { en: "Neal.fun", zh: "Neal.fun" },
    description: {
      en: "Games, visualizations, interactives and weird stuff",
      zh: "有趣的游戏、可视化、交互实验和奇怪的东西",
    },
    category: "resources",
    tags: ["games", "interactive", "fun", "visualization", "creative"],
    url: "https://neal.fun/",
    icon: "Sparkles",
    color: "#f43f5e",
  },
];

export default TOOLS;
