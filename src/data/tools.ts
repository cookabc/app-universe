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
            en: 'When a Chinese-inspired palette needs real names and print values, I open this first. Replaces random hex dumps from image samplers. Caveat: cultural names matter more than “close enough” RGB.',
            zh: '做中国风配色、需要色名和印刷可用数值时，我先打开这里。能替代从图片瞎吸 hex。注意：色名与语境比「差不多的 RGB」更重要。',
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
            en: 'When a surface needs expensive-looking motion without a heavy creative stack, I drop these in. Replaces custom shader experiments I will not maintain. Caveat: still check performance on low-end phones.',
            zh: '需要贵气质的动态表面、又不想背沉重创意栈时，我直接用这套。能替代自己写又不维护的 shader 实验。注意：低端机仍要看性能。',
        },
    },
    {
        id: 'designprompts',
        type: 'link',
        name: {
            en: 'Design Prompts',
            zh: 'Design Prompts',
        },
        description: {
            en: 'AI design style explorer with 31+ rendered styles',
            zh: 'AI 驱动的设计风格探索器，31+ 种风格提示词',
        },
        tags: ['ai-design', 'prompts'],
        url: 'https://www.designprompts.dev/',
        icon: 'Wand',
        color: '#404040',
        note: {
            en: 'When I am about to write a long design prompt, I browse styles here first. Replaces guessing a visual direction in pure text. Caveat: steal the direction, rewrite the prompt in your product’s voice.',
            zh: '当要写长设计提示词时，我先来这里扫风格。能替代纯文字里瞎猜视觉方向。注意：借方向可以，提示词还是要用自己产品的语气重写。',
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
            en: 'When a landing page needs structure fast, I steal a skeleton here then rewrite the copy. Replaces starting from a blank hero. Caveat: do not ship the template prose — clients smell it.',
            zh: '落地页要快速搭结构时，我先借骨架再改文案。能替代从空白 hero 硬开。注意：模板腔文案不要原样上线，客户闻得出来。',
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
            en: 'When a moodboard needs film grain instead of stock polish, I dig here. Replaces sterile Unsplash grids for home and interior refs. Caveat: rights vary — treat as inspiration, not free commercial art.',
            zh: '情绪板需要电影感而不是图库精修时，我来这里翻。能替代干干净净却没情绪的 Unsplash 拼贴。注意：版权各异，当灵感别当免费商用素材。',
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
            en: 'When a deck must live in the browser and move with Magic Move, I use this over Keynote. Replaces fighting export pipelines for agent-built slides. Caveat: design still needs hierarchy — animation will not save a bad outline.',
            zh: '演示必须待在浏览器、还要 Magic Move 时，我用它而不是 Keynote。能替代为 Agent 做幻灯片时痛苦的导出链路。注意：动效救不了烂大纲，层级还是要做。',
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
            en: 'When Markdown previews feel cold and default, I switch to this parchment system. Replaces plain GitHub-flavored dumps for reading-heavy docs. Caveat: not every stakeholder wants warm paper — ask before standardizing.',
            zh: 'Markdown 预览太冷太默认时，我换成这套羊皮纸气质。能替代 GitHub 风纯文本长文。注意：不是每个干系人都要暖纸感，先问再标准化。',
        },
    },
    {
        id: 'taste-skill',
        type: 'link',
        name: {
            en: 'Taste Skill',
            zh: 'Taste Skill',
        },
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
            zh: '当给做 UI 的编码 Agent 开工时，我先塞进这些 SKILL.md。能替代指望模型「自己有审美」。注意：仍要配真实参考布局。',
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
            en: 'When agents need a coherent DESIGN.md to inherit, I collect from here. Replaces one-off style notes scattered in chat. Caveat: prune the collection — too many systems becomes none.',
            zh: 'Agent 需要可继承的 DESIGN.md 时，我从这里收集。能替代散落在聊天里的一次性风格备注。注意：收藏要剪枝，系统太多等于没有系统。',
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
            en: 'When I need a public registry of agent-readable design systems, I look here. Replaces hunting random GitHub gists. Caveat: verify the system matches your stack before wiring it in.',
            zh: '需要公开、Agent 可读的设计系统注册表时，我看这里。能替代满世界翻 gist。注意：接进项目前先确认和你的技术栈匹配。',
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
            en: 'When stakeholders only accept .docx, I convert Markdown here in one click. Replaces hand-fixing Word after every edit. Caveat: complex Mermaid/LaTeX still needs a human pass.',
            zh: '干系人只要 Word 时，我在这里一键把 Markdown 转出去。能替代每次改完手工排 Word。注意：复杂 Mermaid/LaTeX 仍要人工过一眼。',
        },
    },
    {
        id: 'markmark',
        type: 'link',
        name: {
            en: 'MarkMark',
            zh: 'MarkMark',
        },
        description: {
            en: 'Native macOS Markdown reader with annotation and AI revision workflow',
            zh: '原生 macOS Markdown 阅读器，支持批注标注并一键交给 AI 修订',
        },
        tags: ['markdown', 'document'],
        url: 'https://markmark.ft07.com/',
        icon: 'BookOpen',
        color: '#3b82f6',
        note: {
            en: 'When I annotate Markdown on Mac before sending it to AI, I use this native reader. Replaces browser tabs full of half-read drafts. Caveat: macOS-only — not for cross-team shared editing.',
            zh: '当在 Mac 上批注 Markdown、再丢给 AI 时，我用这个原生阅读器。能替代浏览器里堆着的半读草稿。注意：仅 macOS，不适合跨团队共编。',
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
            en: 'When I need a PM checklist instead of a course, I skim the principles here. Replaces rereading long product books mid-sprint. Caveat: principles are prompts for judgment, not a process religion.',
            zh: '需要产品清单而不是一门课时，我来扫这些原则。能替代冲刺中途重读大部头。注意：原则是判断提示，不是流程宗教。',
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
            en: 'When I am shipping alone and need operator skills, not org charts, I open this. Replaces enterprise playbooks that assume a team of twelve. Caveat: still schedule rest — solo does not mean infinite capacity.',
            zh: '一个人交付、需要操作技能而不是组织架构时，我打开这里。能替代默认十二人团队的企业手册。注意：一人公司也不是无限产能，休息要排。',
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
            en: 'When an agent needs real browser primitives on the open web, I reach for this CLI. Replaces brittle custom puppeteer glue. Caveat: respect site ToS and rate limits — automation is not a free pass.',
            zh: 'Agent 需要真实浏览器原语爬开网页时，我用这套 CLI。能替代脆弱的自写 puppeteer 胶水。注意：遵守站点条款与限速，自动化不是通行证。',
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
            en: 'When a product demo needs a spark of play, I study interactions here. Replaces generic “delight” decks with no concrete reference. Caveat: fun is not a feature checklist — steal the feeling, not the gimmick.',
            zh: '产品演示需要一点玩心时，我来这里研究交互。能替代没有具体参考的「delight」空谈。注意：好玩不是功能清单，借感觉别抄噱头。',
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
            en: 'When I study short-session game loops for casual products, I play here. Replaces abstract GDD notes with muscle memory. Caveat: browser games optimize for re-entry — mobile constraints still differ.',
            zh: '研究短局休闲循环时，我来这里玩。能替代只有抽象 GDD 没有体感。注意：网页游戏偏重回访，移动端约束仍不同。',
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
            en: 'When a prototype needs art and I have zero budget, I trust Kenney first. Replaces random free packs with unclear licenses. Caveat: free assets still need consistent art direction — do not mix five packs blindly.',
            zh: '原型要美术、预算为零时，我先信 Kenney。能替代授权不清的随机免费包。注意：免费素材也要统一美术方向，别五包混用。',
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
            en: 'When I need layout patterns that still feel current, I browse this curated set. Replaces endless Awwwards tabs. Caveat: inspiration is not a clone — adapt structure to your content density.',
            zh: '需要仍然不过时的版式模式时，我看这套精选。能替代无限开 Awwwards 标签页。注意：灵感不是克隆，结构要按你的内容密度改。',
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
            en: 'When a story must fit one screen, I study this long-running one-pager archive. Replaces multi-page IA for simple offers. Caveat: one page still needs ruthless editing — length is not the goal.',
            zh: '故事必须装进单屏时，我研究这套长寿的单页档案。能替代简单 offer 却硬做多页 IA。注意：单页更要狠删，长度不是目标。',
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
            en: 'When I need “how did they structure onboarding?”, I scan real app flows here. Replaces guessing funnel steps from memory. Caveat: paid tiers exist — know what you can export before planning a research session.',
            zh: '需要「别人怎么做引导」时，我扫这里的真实 App 流程。能替代凭记忆猜漏斗步骤。注意：有付费档，研究前先搞清能导出什么。',
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
            en: 'When a logo or identity needs before/after thinking, I study rebrands here. Replaces arguing from taste alone in reviews. Caveat: context is half the story — a rebrand for a bank is not a rebrand for a game.',
            zh: 'logo/识别需要前后对比思路时，我研究这里的重塑案例。能替代评审里纯靠口味吵架。注意：语境占一半，银行重塑≠游戏重塑。',
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
            en: 'When micro-interactions feel flat, I raise the bar with references here. Replaces “add a little bounce” without a target. Caveat: 60fps on desktop is not free on mid-range Android.',
            zh: '微交互发闷时，我用这里的参考抬标准。能替代没有目标的「加一点弹跳」。注意：桌面 60fps 在中端安卓并不免费。',
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
            en: 'When store screenshots or paywalls need framing, I study this gallery. Replaces inventing conversion copy in a vacuum. Caveat: patterns age — check dates and category fit.',
            zh: '商店截图或付费墙要话术框架时，我研究这套画廊。能替代真空里发明转化文案。注意：模式会过时，看日期和品类是否合身。',
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
            en: 'When a page feels rigid and needs physics-y life, I reach for these React bits. Replaces CSS-only hover that never surprises. Caveat: motion accessibility first — honor reduced motion.',
            zh: '页面僵硬、需要物理感的「活着」时，我用这些 React 零件。能替代永远不意外的纯 CSS hover。注意：无障碍优先，尊重减少动态。',
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
            zh: '否则我会写出「那个灰色小控件」时，我先查标准名字。能替代含糊的 Agent 提示。注意：各系统叫法略有差别，但总比「那个玩意儿」强。',
        },
    },
    {
        id: 'bestdesignsonx',
        type: 'link',
        name: { en: 'BestDesignson X', zh: 'BestDesignson X' },
        description: {
            en: 'Hourly updated directory of creatives to discover and follow on X',
            zh: '按小时更新的 X 平台创意人发现与关注目录',
        },
        tags: ['inspiration'],
        url: 'https://bestdesignsonx.com/',
        icon: 'Star',
        color: '#171717',
        note: {
            en: 'When I need fresh designer references without chasing algorithm feeds, I browse this hourly digest. Replaces scrolling X hoping to stumble on good work. Caveat: profiles come and go — use it as discovery, not a permanent bookmark list.',
            zh: '当我需要新鲜的设计师参考、又不想追算法时间线时，我会翻这个小时级合集。能替代在 X 上随缘刷到好作品。注意：主页会变，把它当发现入口，不要当永久书签用。',
        },
    },
    {
        id: 'cola-skill',
        type: 'link',
        name: { en: 'Cola Skill', zh: 'Cola Skill' },
        description: {
            en: 'Curated agent skills for design, writing, marketing, and productivity workflows',
            zh: '精选 Agent 技能库，覆盖设计、写作、营销与效率工作流',
        },
        tags: ['ai-agent', 'productivity'],
        url: 'https://colaskill.com/',
        icon: 'Star',
        color: '#c2410c',
        note: {
            en: 'When I need a ready-made skill for an agent to handle a specific workflow, I browse this directory first. Replaces building prompts from scratch or keeping scattered skill files. Caveat: skills vary in quality and domain fit — pick one that matches your actual stack and verify before wiring it in.',
            zh: '当 Agent 需要处理某个具体工作流、我想找现成技能时，我先翻这个目录。能替代从零写提示词或把技能文件东放一个西放一个。注意：技能质量与领域适配度参差不齐，先选和你技术栈匹配的，接进项目前再过一遍。',
        },
    },
    {
        id: 'wenyang',
        type: 'link',
        name: { en: 'Wenyang', zh: '文样' },
        description: {
            en: 'A catalogue of Chinese traditional patterns, redrawn and open-sourced for modern design',
            zh: '中国传统纹样图鉴，为现代设计重新绘制并开源',
        },
        tags: ['inspiration', 'assets'],
        url: 'https://wenyang.net/',
        icon: 'Sparkles',
        color: '#c23a30',
        note: {
            en: 'When I need authentic Chinese pattern references for branding or illustration, I browse this catalogue first. Replaces generic pattern sites or digging through historical archives. Caveat: patterns are reinterpreted for modern use — verify cultural context if you are working on heritage or formal projects.',
            zh: '当品牌或插画需要真正的中国传统纹样参考时，我先翻这个图鉴。能替代通用素材站或翻故纸堆。注意：纹样是为现代使用做了再诠释的，如果是 heritage 或正式文化项目，先核实文化语境。',
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

export function getToolById(id: string): Tool | undefined {
    return TOOLS.find((tool) => tool.id === id)
}

export function getToolPath(id: string): string {
    return `/t/${id}`
}

/** Other tools sharing at least one tag, featured first, then by tag overlap. */
export function getRelatedTools(tool: Tool, limit = 3): Tool[] {
    const tags = new Set(tool.tags)
    return TOOLS.filter((candidate) => candidate.id !== tool.id)
        .map((candidate) => {
            const overlap = candidate.tags.filter((tag) => tags.has(tag)).length
            return { candidate, overlap, featured: candidate.featured ? 1 : 0 }
        })
        .filter((entry) => entry.overlap > 0)
        .sort(
            (a, b) => b.featured - a.featured || b.overlap - a.overlap || a.candidate.id.localeCompare(b.candidate.id),
        )
        .slice(0, limit)
        .map(({ candidate }) => candidate)
}

export default TOOLS
