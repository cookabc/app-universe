type LocaleText = { en: string; zh: string }

export interface ToolCategory {
    key: string
    label: LocaleText
    color: string
    icon: string
}

export interface Tool {
    id: string
    type: 'link'
    name: LocaleText
    description: LocaleText
    category: string
    tags: string[]
    url: string
    icon: string
    color: string
    githubUrl?: string
    note?: LocaleText
}

export const TOOL_CATEGORIES: ToolCategory[] = [
    {
        key: 'all',
        label: { en: 'All', zh: '全部' },
        color: '#6366f1',
        icon: 'LayoutGrid',
    },
    {
        key: 'ai-design',
        label: { en: 'AI Design', zh: 'AI 设计' },
        color: '#8b5cf6',
        icon: 'Sparkles',
    },
    {
        key: 'design',
        label: { en: 'Design', zh: '设计灵感' },
        color: '#ec4899',
        icon: 'Palette',
    },
    {
        key: 'documents',
        label: { en: 'Documents', zh: '文档演示' },
        color: '#10b981',
        icon: 'FileText',
    },
    {
        key: 'productivity',
        label: { en: 'Productivity', zh: '效率工具' },
        color: '#f97316',
        icon: 'Zap',
    },
    {
        key: 'finance',
        label: { en: 'Finance', zh: '金融理财' },
        color: '#ef4444',
        icon: 'TrendingUp',
    },
    {
        key: 'resources',
        label: { en: 'Resources', zh: '资源集合' },
        color: '#eab308',
        icon: 'BookOpen',
    },
]

const TOOLS: Tool[] = [
    // ── AI Design ──
    // Design studios & frameworks
    {
        id: 'open-design',
        type: 'link',
        name: { en: 'Open Design', zh: 'Open Design' },
        description: {
            en: 'Open-source design studio with 31 skills and 72 design systems',
            zh: '开源设计工作室，31 个可组合技能与 72 个品牌级设计系统',
        },
        category: 'ai-design',
        tags: ['design', 'open-source', 'ai', 'skills', 'studio'],
        url: 'https://open-design.ai/',
        icon: 'Palette',
        color: '#6366f1',
    },
    // AI design rules & taste
    {
        id: 'impeccable',
        type: 'link',
        name: { en: 'Impeccable', zh: 'Impeccable' },
        description: {
            en: 'AI design intelligence with 23 commands for frontend design',
            zh: 'AI设计智能工具，23 个命令覆盖排版、色彩、动效与交互',
        },
        category: 'ai-design',
        tags: ['design', 'ai', 'commands', 'frontend', 'typography'],
        url: 'https://impeccable.style/',
        icon: 'Sparkles',
        color: '#6366f1',
    },
    {
        id: 'taste-skill',
        type: 'link',
        name: { en: 'Taste Skill', zh: 'Taste Skill' },
        description: {
            en: 'Anti-slop SKILL.md files that give AI coding agents better design taste',
            zh: '为 AI 编码 Agent 提供设计审美的 SKILL.md 技能文件，告别模板感界面',
        },
        category: 'ai-design',
        tags: ['design', 'ai', 'coding', 'skill', 'frontend'],
        url: 'https://www.tasteskill.dev/',
        icon: 'Sparkles',
        color: '#ec4899',
    },
    // DESIGN.md series
    {
        id: 'getdesign-md',
        type: 'link',
        name: { en: 'getdesign.md', zh: 'getdesign.md' },
        description: {
            en: 'DESIGN.md collection for AI coding agents',
            zh: 'AI 编码助手设计系统集合，生成高质量 UI',
        },
        category: 'ai-design',
        tags: ['design', 'ai', 'coding', 'design-system', 'ui'],
        url: 'https://getdesign.md/',
        icon: 'BookOpen',
        color: '#1b365d',
    },
    {
        id: 'designmd-sh',
        type: 'link',
        name: { en: 'designmd.sh', zh: 'designmd.sh' },
        description: {
            en: 'Public DESIGN.md registry for AI coding and design agents',
            zh: '公共 DESIGN.md 注册表，为 AI 编码与设计代理提供设计系统',
        },
        category: 'ai-design',
        tags: ['design', 'ai', 'coding', 'design-system', 'registry'],
        url: 'https://designmd.sh/',
        icon: 'FileCode',
        color: '#10b981',
    },
    {
        id: 'designmd-supply',
        type: 'link',
        name: { en: 'designmd.supply', zh: 'designmd.supply' },
        description: {
            en: 'Generate DESIGN.md style guides from any public domain',
            zh: '输入任意公开域名，自动生成 Google DESIGN.md 风格指南',
        },
        category: 'ai-design',
        tags: ['design', 'ai', 'design-system', 'style-guide', 'generator'],
        url: 'https://www.designmd.supply/',
        icon: 'FileText',
        color: '#f59e0b',
    },
    // ── Design ──
    // Prompts & templates
    {
        id: 'designprompts',
        type: 'link',
        name: { en: 'Design Prompts', zh: 'Design Prompts' },
        description: {
            en: 'AI design style explorer with 31+ rendered styles',
            zh: 'AI 驱动的设计风格探索器，31+ 种风格提示词',
        },
        category: 'design',
        tags: ['design', 'ai', 'prompts', 'style', 'explorer'],
        url: 'https://www.designprompts.dev/',
        icon: 'Wand',
        color: '#0a0a0a',
    },
    {
        id: 'motionsites',
        type: 'link',
        name: { en: 'MotionSites', zh: 'MotionSites' },
        description: {
            en: 'Ready-to-use AI prompt library for beautiful landing pages',
            zh: 'AI 驱动的落地页提示词库，复制即用的精美网站模板',
        },
        category: 'design',
        tags: ['design', 'ai', 'prompts', 'landing-page', 'templates'],
        url: 'https://motionsites.ai/',
        icon: 'Rocket',
        color: '#8b5cf6',
    },
    // Color resources
    {
        id: 'zhongguo-colors',
        type: 'link',
        name: { en: '中国传统配色', zh: '中国传统配色' },
        description: {
            en: '742 traditional Chinese color swatches with HEX, RGB, CMYK values',
            zh: '742 张高清中国传统色卡，含色名、HEX、RGB、CMYK 与配色推荐',
        },
        category: 'design',
        tags: ['color', 'chinese', 'traditional', 'palette', 'swatches'],
        url: 'https://nevertoday.github.io/zhongguo-traditional-colors/',
        icon: 'Palette',
        color: '#c0392b',
        githubUrl: 'https://github.com/nevertoday/zhongguo-traditional-colors',
    },
    // ── Documents ──
    {
        id: 'docu-md',
        type: 'link',
        name: { en: 'Docu.md', zh: 'Docu.md' },
        description: {
            en: 'One-click Markdown to Word with Mermaid, LaTeX, and charts',
            zh: '一键将 Markdown 转换为完美 Word 文档',
        },
        category: 'documents',
        tags: ['markdown', 'word', 'document', 'converter', 'mermaid'],
        url: 'https://docu.md/',
        icon: 'BookOpen',
        color: '#10b981',
    },
    {
        id: 'kami',
        type: 'link',
        name: { en: 'Kami', zh: 'Kami' },
        description: {
            en: 'Warm parchment design system for AI-assisted documents',
            zh: 'AI 代理的文档设计系统，温暖的羊皮纸风格排版',
        },
        category: 'documents',
        tags: ['document', 'design-system', 'ai', 'pdf', 'typeset'],
        url: 'https://kami.tw93.fun/',
        icon: 'Pencil',
        color: '#8b7355',
    },
    {
        id: 'markmark',
        type: 'link',
        name: { en: 'MarkMark', zh: 'MarkMark' },
        description: {
            en: 'Native macOS Markdown reader with annotation and AI revision workflow',
            zh: '原生 macOS Markdown 阅读器，支持批注标注并一键交给 AI 修订',
        },
        category: 'documents',
        tags: ['markdown', 'reader', 'annotation', 'ai', 'macos'],
        url: 'https://markmark.ft07.com/',
        icon: 'BookOpen',
        color: '#3b82f6',
        githubUrl: 'https://github.com/easychen/markmark',
    },
    {
        id: 'magic-slide',
        type: 'link',
        name: { en: 'Magic Slide', zh: 'Magic Slide' },
        description: {
            en: 'AI-powered HTML presentations with Magic Move transitions and browser editing',
            zh: 'AI 驱动的 HTML 演示工具，支持 Magic Move 过渡与浏览器编辑',
        },
        category: 'documents',
        tags: ['presentation', 'html', 'ai', 'slides', 'magic-move'],
        url: 'https://www.magicslide.show/',
        icon: 'Presentation',
        color: '#a855f7',
    },
    // ── Productivity ──
    {
        id: 'pmframe',
        type: 'link',
        name: { en: 'PMFrame', zh: 'PMFrame' },
        description: {
            en: 'Product management framework with 100 principles',
            zh: '产品管理方法论框架，100 个原则涵盖用户研究与设计思维',
        },
        category: 'productivity',
        tags: ['product', 'management', 'framework', 'methodology', 'principles'],
        url: 'https://pmframe.works/',
        icon: 'Lightbulb',
        color: '#f59e0b',
    },
    {
        id: 'opc-skills',
        type: 'link',
        name: { en: 'OPC Skills', zh: '一人企业技能' },
        description: {
            en: '9 Agent Skills for building a lightweight personal business',
            zh: '可执行的一人企业方法论，9 个技能构建个人业务系统',
        },
        category: 'productivity',
        tags: ['business', 'methodology', 'skills', 'agent', 'one-person'],
        url: 'https://opc-skills.ft07.com/',
        icon: 'Briefcase',
        color: '#78716c',
    },
    {
        id: 'browse-sh',
        type: 'link',
        name: { en: 'browse.sh', zh: 'browse.sh' },
        description: {
            en: 'Browser CLI for AI agents with open web skill catalog',
            zh: 'AI 代理浏览器 CLI，开放网页技能目录与自动化原语',
        },
        category: 'productivity',
        tags: ['browser', 'cli', 'ai-agent', 'automation', 'skills'],
        url: 'https://browse.sh/',
        icon: 'Globe',
        color: '#3b82f6',
    },
    // ── Finance ──
    {
        id: 'k2ai',
        type: 'link',
        name: { en: 'K2AI', zh: 'K2AI' },
        description: {
            en: 'AI civilization market system and investment terminal',
            zh: 'AI文明市场系统及投资终端，追踪算力与产业链信号',
        },
        category: 'finance',
        tags: ['ai', 'investment', 'market', 'analysis', 'compute'],
        url: 'https://app.k2ai.dev/',
        icon: 'Brain',
        color: '#8b5cf6',
    },
    {
        id: 'fund-cccd',
        type: 'link',
        name: { en: '基估宝', zh: '基估宝' },
        description: {
            en: 'Fund tracking and portfolio management tool',
            zh: '基金追踪和投资组合管理工具',
        },
        category: 'finance',
        tags: ['fund', 'investment', 'portfolio', 'tracking'],
        url: 'https://fund.cc.cd/',
        icon: 'BarChart3',
        color: '#3b82f6',
    },
    // ── Resources ──
    {
        id: 'neal-fun',
        type: 'link',
        name: { en: 'Neal.fun', zh: 'Neal.fun' },
        description: {
            en: 'Games, visualizations, interactives and weird stuff',
            zh: '有趣的游戏、可视化、交互实验和奇怪的东西',
        },
        category: 'resources',
        tags: ['games', 'interactive', 'fun', 'visualization', 'creative'],
        url: 'https://neal.fun/',
        icon: 'Sparkles',
        color: '#f43f5e',
    },
    {
        id: 'astrocade',
        type: 'link',
        name: { en: 'Astrocade', zh: 'Astrocade' },
        description: {
            en: 'Play casual and arcade-style games online',
            zh: '在线游玩休闲与街机风格游戏的平台',
        },
        category: 'resources',
        tags: ['games', 'arcade', 'casual', 'online', 'gaming'],
        url: 'https://www.astrocade.com/',
        icon: 'Gamepad',
        color: '#f97316',
    },
]

export default TOOLS
