import type { IconName } from '@/lib/icon-map'

type LocaleText = { en: string; zh: string }

export interface Tool {
    id: string
    type: 'link'
    name: LocaleText
    description: LocaleText
    tags: string[]
    url: string
    icon: IconName
    color: string
    githubUrl?: string
    note?: LocaleText
    /** Pinned in the featured strip on the home wall. */
    featured?: boolean
}

const TOOLS: Tool[] = [
    {
        id: 'open-design',
        type: 'link',
        name: { en: 'Open Design', zh: 'Open Design' },
        description: {
            en: 'Open-source design studio with 31 skills and 72 design systems',
            zh: '开源设计工作室，31 个可组合技能与 72 个品牌级设计系统',
        },
        tags: ['ai-design', 'design-system'],
        url: 'https://open-design.ai/',
        icon: 'Palette',
        color: '#6366f1',
        featured: true,
        note: {
            en: 'When an agent needs a real design system — not another “make it pretty” prompt — I start here. Replaces generic UI kits. Caveat: pick one system and stick with it.',
            zh: '当 Agent 需要真正的设计系统、而不是「做漂亮一点」的空提示时，我从这里起手。能替代通用 UI 套件。注意：先选定一套系统并坚持用完。',
        },
    },
    {
        id: 'zhongguo-colors',
        type: 'link',
        name: { en: '中国传统配色', zh: '中国传统配色' },
        description: {
            en: '742 traditional Chinese color swatches with HEX, RGB, CMYK values',
            zh: '742 张高清中国传统色卡，含色名、HEX、RGB、CMYK 与配色推荐',
        },
        tags: ['color', 'inspiration'],
        url: 'https://nevertoday.github.io/zhongguo-traditional-colors/',
        icon: 'Palette',
        color: '#c0392b',
        note: {
            en: 'Best free reference when a Chinese palette needs names and print-ready values.',
            zh: '做中国风配色时最好的免费参考：有色名和印刷可用数值。',
        },
        githubUrl: 'https://github.com/nevertoday/zhongguo-traditional-colors',
    },
    {
        id: 'paper-shaders',
        type: 'link',
        name: { en: 'Paper Shaders', zh: 'Paper Shaders' },
        description: {
            en: 'Ultra-fast zero-dependency shaders for designs',
            zh: '超快速零依赖的设计用着色器库',
        },
        tags: ['color', 'inspiration'],
        url: 'https://shaders.paper.design/',
        icon: 'Sparkles',
        color: '#8b5cf6',
        note: {
            en: 'Drop-in shaders that look expensive without dragging a heavy creative stack.',
            zh: '几乎零依赖就能上质感的着色器，轻量却很出片。',
        },
    },
    {
        id: 'designprompts',
        type: 'link',
        name: { en: 'Design Prompts', zh: 'Design Prompts' },
        description: {
            en: 'AI design style explorer with 31+ rendered styles',
            zh: 'AI 驱动的设计风格探索器，31+ 种风格提示词',
        },
        tags: ['ai-design', 'prompts'],
        url: 'https://www.designprompts.dev/',
        icon: 'Wand',
        color: '#404040',
        note: {
            en: 'Fast taste calibration — browse styles before writing a long design prompt.',
            zh: '写长设计提示词前先扫一圈风格，校准审美很快。',
        },
    },
    {
        id: 'motionsites',
        type: 'link',
        name: { en: 'MotionSites', zh: 'MotionSites' },
        description: {
            en: 'Ready-to-use AI prompt library for beautiful landing pages',
            zh: 'AI 驱动的落地页提示词库，复制即用的精美网站模板',
        },
        tags: ['ai-design', 'prompts'],
        url: 'https://motionsites.ai/',
        icon: 'Rocket',
        color: '#8b5cf6',
        note: {
            en: 'Landing-page prompt library I steal structure from, then rewrite in my voice.',
            zh: '落地页提示词库：先借结构，再改成自己的语气。',
        },
    },
    {
        id: 'impeccable',
        type: 'link',
        name: { en: 'Impeccable', zh: 'Impeccable' },
        description: {
            en: 'AI design intelligence with 23 commands for frontend design',
            zh: 'AI 设计智能工具，23 个命令覆盖排版、色彩、动效与交互',
        },
        tags: ['ai-design', 'frontend'],
        url: 'https://impeccable.style/',
        icon: 'Sparkles',
        color: '#6366f1',
        featured: true,
        note: {
            en: 'When a generated page looks “off” but I can’t name why, I run these commands. Replaces vague redesign chats. Caveat: it critiques taste — you still choose the fix.',
            zh: '当生成页面「哪里不对」却说不清时，我跑这套命令。能替代含糊的「重做一版」对话。注意：它帮你挑审美问题，拍板还是你。',
        },
    },
    {
        id: 'yeguozi',
        type: 'link',
        name: { en: 'Yeguozi', zh: '野果子' },
        description: {
            en: 'Curated film stills for home color and décor inspiration',
            zh: '精选电影截图，为家居配色与装饰氛围提供灵感参考',
        },
        tags: ['color', 'inspiration'],
        url: 'https://www.yeguozi.com/',
        icon: 'Film',
        color: '#b45309',
        note: {
            en: 'Film stills for moodboards when stock photos feel too clean.',
            zh: '情绪板需要电影感时用，比干净的图库更有氛围。',
        },
    },
    {
        id: 'magic-slide',
        type: 'link',
        name: { en: 'Magic Slide', zh: 'Magic Slide' },
        description: {
            en: 'AI-powered HTML presentations with Magic Move transitions and browser editing',
            zh: 'AI 驱动的 HTML 演示工具，支持 Magic Move 过渡与浏览器编辑',
        },
        tags: ['presentation', 'document'],
        url: 'https://www.magicslide.show/',
        icon: 'Presentation',
        color: '#a855f7',
        note: {
            en: 'HTML decks with Magic Move — better than fighting Keynote for agent workflows.',
            zh: 'HTML 演示 + Magic Move，比和 Keynote 较劲更适合 Agent 流程。',
        },
    },
    {
        id: 'kami',
        type: 'link',
        name: { en: 'Kami', zh: 'Kami' },
        description: {
            en: 'Warm parchment design system for AI-assisted documents',
            zh: 'AI 代理的文档设计系统，温暖的羊皮纸风格排版',
        },
        tags: ['document', 'design-system'],
        url: 'https://kami.tw93.fun/',
        icon: 'Pencil',
        color: '#8b7355',
        note: {
            en: 'Warm document aesthetic when Markdown previews look too cold and default.',
            zh: 'Markdown 预览太冷太默认时，用这套羊皮纸文档气质。',
        },
    },
    {
        id: 'taste-skill',
        type: 'link',
        name: { en: 'Taste Skill', zh: 'Taste Skill' },
        description: {
            en: 'Anti-slop SKILL.md files that give AI coding agents better design taste',
            zh: '为 AI 编码 Agent 提供设计审美的 SKILL.md 技能文件，告别模板感界面',
        },
        tags: ['ai-design', 'ai-agent'],
        url: 'https://www.tasteskill.dev/',
        icon: 'Sparkles',
        color: '#ec4899',
        featured: true,
        note: {
            en: 'When I bootstrap a coding agent for UI work, I drop these SKILL.md files in first. Replaces hoping the model “has taste.” Caveat: still needs a real reference layout.',
            zh: '给做 UI 的编码 Agent 开工前，我先塞进这些 SKILL.md。比指望模型「自己有审美」靠谱。注意：仍要配真实参考布局。',
        },
    },
    {
        id: 'getdesign-md',
        type: 'link',
        name: { en: 'getdesign.md', zh: 'getdesign.md' },
        description: {
            en: 'DESIGN.md collection for AI coding agents',
            zh: 'AI 编码助手设计系统集合，生成高质量 UI',
        },
        tags: ['ai-design', 'design-system', 'ai-agent'],
        url: 'https://getdesign.md/',
        icon: 'BookOpen',
        color: '#1b365d',
        note: {
            en: 'Collect DESIGN.md files so agents inherit a coherent system.',
            zh: '收集 DESIGN.md，让 Agent 继承一致的设计系统。',
        },
    },
    {
        id: 'designmd-sh',
        type: 'link',
        name: { en: 'designmd.sh', zh: 'designmd.sh' },
        description: {
            en: 'Public DESIGN.md registry for AI coding and design agents',
            zh: '公共 DESIGN.md 注册表，为 AI 编码与设计代理提供设计系统',
        },
        tags: ['ai-design', 'ai-agent'],
        url: 'https://designmd.sh/',
        icon: 'FileCode',
        color: '#10b981',
        note: {
            en: 'Public registry of design systems for agent-readable specs.',
            zh: '公开的设计系统注册表，方便 Agent 读规格。',
        },
    },
    {
        id: 'docu-md',
        type: 'link',
        name: { en: 'Docu.md', zh: 'Docu.md' },
        description: {
            en: 'One-click Markdown to Word with Mermaid, LaTeX, and charts',
            zh: '一键将 Markdown 转换为完美 Word 文档',
        },
        tags: ['markdown', 'document'],
        url: 'https://docu.md/',
        icon: 'BookOpen',
        color: '#10b981',
        note: {
            en: 'One-click MD → Word when stakeholders still live in .docx.',
            zh: '干系人只要 Word 时，一键 Markdown 转 docx。',
        },
    },
    {
        id: 'markmark',
        type: 'link',
        name: { en: 'MarkMark', zh: 'MarkMark' },
        description: {
            en: 'Native macOS Markdown reader with annotation and AI revision workflow',
            zh: '原生 macOS Markdown 阅读器，支持批注标注并一键交给 AI 修订',
        },
        tags: ['markdown', 'document'],
        url: 'https://markmark.ft07.com/',
        icon: 'BookOpen',
        color: '#3b82f6',
        note: {
            en: 'Native macOS reader for annotating Markdown before handing it to AI.',
            zh: '原生 macOS 阅读器：先批注 Markdown，再丢给 AI。',
        },
        githubUrl: 'https://github.com/easychen/markmark',
    },
    {
        id: 'pmframe',
        type: 'link',
        name: { en: 'PMFrame', zh: 'PMFrame' },
        description: {
            en: 'Product management framework with 100 principles',
            zh: '产品管理方法论框架，100 个原则涵盖用户研究与设计思维',
        },
        tags: ['productivity', 'business'],
        url: 'https://pmframe.works/',
        icon: 'Lightbulb',
        color: '#f59e0b',
        note: {
            en: 'Compact PM principles when I need a checklist, not a course.',
            zh: '需要清单而不是课程时的紧凑产品方法论。',
        },
    },
    {
        id: 'opc-skills',
        type: 'link',
        name: { en: 'OPC Skills', zh: '一人企业技能' },
        description: {
            en: '9 Agent Skills for building a lightweight personal business',
            zh: '可执行的一人企业方法论，9 个技能构建个人业务系统',
        },
        tags: ['productivity', 'business'],
        url: 'https://opc-skills.ft07.com/',
        icon: 'Briefcase',
        color: '#78716c',
        note: {
            en: 'One-person-company skills — practical when shipping alone.',
            zh: '一人公司技能：一个人交付时很实用。',
        },
    },
    {
        id: 'browse-sh',
        type: 'link',
        name: { en: 'browse.sh', zh: 'browse.sh' },
        description: {
            en: 'Browser CLI for AI agents with open web skill catalog',
            zh: 'AI 代理浏览器 CLI，开放网页技能目录与自动化原语',
        },
        tags: ['ai-agent'],
        url: 'https://browse.sh/',
        icon: 'Globe',
        color: '#3b82f6',
        note: {
            en: 'Browser CLI primitives for agents that need the open web.',
            zh: 'Agent 需要打开网页时的浏览器 CLI 原语。',
        },
    },
    {
        id: 'neal-fun',
        type: 'link',
        name: { en: 'Neal.fun', zh: 'Neal.fun' },
        description: {
            en: 'Games, visualizations, interactives and weird stuff',
            zh: '有趣的游戏、可视化、交互实验和奇怪的东西',
        },
        tags: ['games', 'fun'],
        url: 'https://neal.fun/',
        icon: 'Sparkles',
        color: '#f43f5e',
        note: {
            en: 'Interaction inspiration when product demos need a spark of play.',
            zh: '产品演示需要一点玩心时的交互灵感来源。',
        },
    },
    {
        id: 'astrocade',
        type: 'link',
        name: { en: 'Astrocade', zh: 'Astrocade' },
        description: {
            en: 'Play casual and arcade-style games online',
            zh: '在线游玩休闲与街机风格游戏的平台',
        },
        tags: ['games', 'fun'],
        url: 'https://www.astrocade.com/',
        icon: 'Gamepad',
        color: '#f97316',
        note: {
            en: 'Casual game loops to study for short-session design.',
            zh: '研究短局游戏循环时的休闲游戏参考。',
        },
    },
    {
        id: 'kenney',
        type: 'link',
        name: { en: 'Kenney', zh: 'Kenney' },
        description: {
            en: 'Thousands of completely free game assets including sprites, 3D models, audio and tools',
            zh: '数千个完全免费的游戏素材，涵盖精灵图、3D 模型、音效及工具',
        },
        tags: ['games', 'assets'],
        url: 'https://kenney.nl/',
        icon: 'Gamepad',
        color: '#22c55e',
        note: {
            en: 'Free game assets I trust when prototyping without art budget.',
            zh: '没美术预算做原型时，可信赖的免费游戏素材。',
        },
    },
    {
        id: 'timing',
        type: 'link',
        name: { en: 'Timing', zh: 'Timing' },
        description: {
            en: 'Translate motion timing and springs across design and code platforms',
            zh: '跨平台动效 timing 转换工具，打通设计稿与代码的弹簧/贝塞尔参数',
        },
        tags: ['animation', 'frontend'],
        url: 'https://timing.xiaolin.work/',
        icon: 'Zap',
        color: '#14b8a6',
        featured: true,
        note: {
            en: 'When Figma springs and CSS never match, I translate here once. Replaces guessing cubic-bezier values. Caveat: still verify on the target device.',
            zh: 'Figma 弹簧和 CSS 对不上时，我来这里转一次参数。能替代瞎猜 cubic-bezier。注意：还是要在真机上过一眼。',
        },
    },
    {
        id: 'craftwork-websites',
        type: 'link',
        name: { en: 'Craftwork Websites', zh: 'Craftwork Websites' },
        description: {
            en: 'Curated website design inspiration from the Curated.design community',
            zh: '来自 Curated.design 社区精选的网站设计灵感库',
        },
        tags: ['inspiration', 'frontend'],
        url: 'https://craftwork.design/curated/websites/',
        icon: 'Globe',
        color: '#4f46e5',
        note: {
            en: 'Curated site gallery for layout patterns that still feel current.',
            zh: '精选站酷画廊，找仍然不过时的版式模式。',
        },
    },
    {
        id: 'onepagelove',
        type: 'link',
        name: { en: 'One Page Love', zh: 'One Page Love' },
        description: {
            en: 'One-page website inspiration gallery since 2008',
            zh: '始于 2008 年的单页网站灵感画廊',
        },
        tags: ['inspiration', 'frontend'],
        url: 'https://onepagelove.com/',
        icon: 'Star',
        color: '#e11d48',
        note: {
            en: 'Long-running one-pager archive — good for single-screen storytelling.',
            zh: '长寿的单页网站档案，适合单屏叙事。',
        },
    },
    {
        id: 'component-gallery',
        type: 'link',
        name: { en: 'Component Gallery', zh: 'Component Gallery' },
        description: {
            en: 'Up-to-date repository of UI components from real design systems',
            zh: '基于真实设计系统的最新 UI 组件参考库',
        },
        tags: ['design-system', 'frontend'],
        url: 'https://component.gallery/',
        icon: 'LayoutGrid',
        color: '#059669',
        featured: true,
        note: {
            en: 'When I need how real design systems name a pattern, I open this — not Dribbble. Replaces inventing component vocabulary. Caveat: it’s reference, not a kit to copy wholesale.',
            zh: '需要看真实设计系统怎么命名某个模式时，我打开这里，而不是 Dribbble。能替代自己发明组件黑话。注意：是参考，不是整库照搬。',
        },
    },
    {
        id: 'mobbin',
        type: 'link',
        name: { en: 'Mobbin', zh: 'Mobbin' },
        description: {
            en: 'Real-world app and web UI screens, flows and patterns',
            zh: '真实 App 与 Web 界面截图、流程与模式库',
        },
        tags: ['inspiration', 'frontend'],
        url: 'https://mobbin.com/discover/apps/web/popular',
        icon: 'LayoutGrid',
        color: '#2563eb',
        note: {
            en: 'Production app UI flows when I need “how did they structure onboarding?”',
            zh: '需要「别人怎么做引导」时看的真实 App 流程。',
        },
    },
    {
        id: 'rebrand-gallery',
        type: 'link',
        name: { en: 'Rebrand Gallery', zh: 'Rebrand Gallery' },
        description: {
            en: 'Curated gallery of rebrands and visual identity launches',
            zh: '品牌重塑与视觉识别发布的精选画廊',
        },
        tags: ['inspiration', 'branding'],
        url: 'https://www.rebrand.gallery/',
        icon: 'Sparkles',
        color: '#d97706',
        note: {
            en: 'Rebrand case studies for logo + identity before/after thinking.',
            zh: '品牌重塑案例，做 logo/识别前后对比时有用。',
        },
    },
    {
        id: '60fps',
        type: 'link',
        name: { en: '60fps', zh: '60fps' },
        description: {
            en: 'Collection of delightful UI animation details from best-in-class apps',
            zh: '来自一流 App 的精致 UI 动效细节合集',
        },
        tags: ['animation', 'inspiration'],
        url: 'https://60fps.design/',
        icon: 'Zap',
        color: '#ea580c',
        note: {
            en: 'Micro-interaction references that raise the bar for “delight”.',
            zh: '微交互参考，把「delight」的标准拉高一点。',
        },
    },
    {
        id: 'before-click',
        type: 'link',
        name: { en: 'before.click', zh: 'before.click' },
        description: {
            en: 'Curated App Store screenshots, paywalls and onboarding flows',
            zh: '精选的 App Store 截图、付费墙与新手引导流程参考',
        },
        tags: ['inspiration', 'frontend'],
        url: 'https://before.click/',
        icon: 'Globe',
        color: '#0891b2',
        note: {
            en: 'App Store screenshots and paywalls — study conversion framing.',
            zh: 'App Store 截图与付费墙，研究转化话术。',
        },
    },
    {
        id: 'feralui',
        type: 'link',
        name: { en: 'FeralUI', zh: 'FeralUI' },
        description: {
            en: 'Playful, physics-driven React elements that move like real things',
            zh: '有趣的物理驱动 React 元素，像真实物体一样运动',
        },
        tags: ['animation', 'frontend'],
        url: 'https://feralui.dev/',
        icon: 'Zap',
        color: '#06b6d4',
        note: {
            en: 'Physics-y React bits when a page needs to feel alive, not rigid.',
            zh: '页面需要「活着」而不是僵硬时，用这套物理感 React 零件。',
        },
    },
    {
        id: 'namethatui',
        type: 'link',
        name: { en: 'NameThatUI', zh: 'NameThatUI' },
        description: {
            en: 'Visual dictionary of UI elements: learn the real name and prompt your coding agent with precision',
            zh: 'UI 元素视觉词典，学会准确名称并用精确提示词驱动编码 Agent',
        },
        tags: ['frontend', 'ai-agent'],
        url: 'https://namethatui.com/',
        icon: 'BookOpen',
        color: '#4ea1ff',
        featured: true,
        note: {
            en: 'When I’d otherwise write “that little grey control,” I look up the real name first. Replaces fuzzy agent prompts. Caveat: names vary slightly by system — still better than “thing.”',
            zh: '否则我会写「那个灰色小控件」时，我先来查标准名字。能替代含糊的 Agent 提示。注意：各系统叫法略有差别，但总比「那个玩意儿」强。',
        },
    },
]

export function getAllTags(tools: Tool[]): string[] {
    const set = new Set<string>()
    for (const tool of tools) {
        for (const tag of tool.tags) {
            set.add(tag)
        }
    }
    return Array.from(set).sort()
}

const TAG_ACRONYMS = new Set(['ai', 'ui', 'pm', 'cli', 'api', 'md'])

export function formatTag(tag: string): string {
    return tag
        .split('-')
        .map((word) => {
            if (TAG_ACRONYMS.has(word.toLowerCase())) {
                return word.toUpperCase()
            }
            return word.charAt(0).toUpperCase() + word.slice(1)
        })
        .join(' ')
}

export default TOOLS
