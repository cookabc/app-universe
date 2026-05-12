import type { SkillData } from '../../data/skills.types'
import { buildSkillShowcaseModel } from '../../utils/skillShowcase'

interface Props {
    skill: SkillData
}

const _ASSETS_BASE = '/skill-showcase/skills-assets'

export default function SkillPreview({ skill }: Props) {
    const id = skill.id
    const model = buildSkillShowcaseModel(skill)

    if (model.assetUrls.length > 0) return <AssetPreview skill={skill} urls={model.assetUrls} />

    if (id === 'app-icon-minimalist') return <AppIconPreview />
    if (id === 'blueprinter') return <BlueprintPreview />
    if (id === 'design-system') return <DesignSystemPreview />
    if (id === 'editorial-card-screenshot') return <EditorialCardPreview />

    if (id === 'opc-methodology') return <OpcCollectionPreview />
    if (id === 'impeccable-style') return <ImpeccableCollectionPreview />
    if (id === 'markdown-viewer-skills') return <MarkdownViewerCollectionPreview />
    if (id === 'khazix-skills') return <KhazixCollectionPreview />

    return <GeneratedShowcase skill={skill} />
}

function AssetPreview({ skill, urls }: { skill: SkillData; urls: string[] }) {
    return (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between gap-4 px-4 py-3.5 border-b border-border">
                <span className="text-primary font-mono text-[11px] font-bold uppercase">{skill.category.label}</span>
                <strong className="text-foreground text-sm truncate">{skill.name}</strong>
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-2.5 p-3">
                {urls.slice(0, 6).map((url, index) => (
                    <figure key={url} className="aspect-[4/3] rounded-lg border border-border bg-muted overflow-hidden">
                        <img
                            src={url}
                            alt={`${skill.name} example ${index + 1}`}
                            loading="lazy"
                            className="w-full h-full object-cover"
                        />
                    </figure>
                ))}
            </div>
        </div>
    )
}

function GeneratedShowcase({ skill }: { skill: SkillData }) {
    const model = buildSkillShowcaseModel(skill)
    const title =
        model.kind === 'generated-flow'
            ? 'Workflow board'
            : model.kind === 'generated-prompt'
              ? 'Prompt board'
              : 'Output board'

    return (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between gap-4 px-4 py-3.5 border-b border-border">
                <span className="text-primary font-mono text-[11px] font-bold uppercase">{title}</span>
                <code className="text-primary text-[11px] font-mono truncate">{model.primaryTrigger}</code>
            </div>
            <div className="grid gap-3 p-3.5">
                <div className="p-3.5 rounded-lg border border-border bg-muted bg-gradient-to-br from-primary/5 to-transparent">
                    <span className="text-muted-foreground text-[10px] font-bold uppercase">Intent</span>
                    <p className="mt-2 text-foreground text-[13px] leading-relaxed">
                        {skill.description || model.outputSummary}
                    </p>
                </div>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(130px,1fr))] gap-2.5">
                    {model.workflowSteps.map((step, index) => (
                        <div key={step} className="grid gap-2.5 p-3.5 rounded-lg border border-primary/20 bg-primary/5">
                            <span className="text-primary font-mono text-[11px] font-bold">
                                {String(index + 1).padStart(2, '0')}
                            </span>
                            <p className="text-foreground text-xs font-semibold leading-snug">{step}</p>
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(130px,1fr))] gap-2.5">
                    {(skill.keyFeatures.length ? skill.keyFeatures : model.workflowSteps).slice(0, 3).map((item) => (
                        <div key={item} className="p-3.5 rounded-lg border border-border bg-muted">
                            <span className="text-muted-foreground text-[10px] font-bold uppercase">Output</span>
                            <p className="mt-2 text-foreground text-[13px] leading-relaxed">
                                {item.replace(/^#+\s*/, '')}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

/* ──────────────────────────────────────
   1. App Icon Minimalist
   ────────────────────────────────────── */
function AppIconPreview() {
    return (
        <div className="flex flex-col items-center gap-5 p-8 bg-muted rounded-lg border border-border">
            <div className="flex gap-6 flex-wrap justify-center">
                {[
                    { bg: '#1B365D', svg: <SvgGridIcon /> },
                    { bg: '#E74C3C', svg: <SvgFaceIcon /> },
                    { bg: '#27AE60', svg: <SvgCheckIcon /> },
                    { bg: '#F39C12', svg: <SvgUserIcon /> },
                ].map((icon, i) => (
                    <div key={i} className="flex flex-col items-center gap-2.5">
                        <div className="rounded-[14px] shadow-sm hover:scale-105 transition-transform">{icon.svg}</div>
                        <span className="text-[10px] text-muted-foreground font-mono">1024×1024</span>
                    </div>
                ))}
            </div>

            <div className="text-[11px] text-muted-foreground text-center max-w-[40ch] leading-snug border-l-2 border-primary pl-2.5">
                Minimalist icons generated from natural language prompts. No design tools needed.
            </div>
        </div>
    )
}

function SvgGridIcon() {
    return (
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
            <rect width="56" height="56" rx="14" fill="#1B365D" />
            <path d="M18 18h8v8h-8zM30 18h8v8h-8zM18 30h8v8h-8z" fill="white" opacity={0.9} />
            <rect x="30" y="30" width="8" height="8" rx="2" fill="white" opacity={0.5} />
        </svg>
    )
}

function SvgFaceIcon() {
    return (
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
            <circle cx="28" cy="28" r="28" fill="#E74C3C" />
            <path d="M20 28c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="white" strokeWidth="4" strokeLinecap="round" />
            <circle cx="36" cy="38" r="2.5" fill="white" />
        </svg>
    )
}

function SvgCheckIcon() {
    return (
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
            <rect width="56" height="56" rx="16" fill="#27AE60" />
            <path d="M16 32l8 8 16-16" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

function SvgUserIcon() {
    return (
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
            <rect width="56" height="56" rx="14" fill="#F39C12" />
            <circle cx="28" cy="22" r="7" fill="white" opacity={0.9} />
            <path
                d="M17 40c0-6 5-11 11-11s11 5 11 11"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
            />
        </svg>
    )
}

/* ──────────────────────────────────────
   2. Blueprinter
   ────────────────────────────────────── */
function BlueprintPreview() {
    const cellBg = 'var(--color-card)'
    const gridLine = 'var(--color-border)'
    const textDim = 'var(--color-muted-foreground)'
    const accent = '#7b9cf0'

    return (
        <div
            style={{
                padding: '28px',
                background: 'var(--color-muted)',
                borderRadius: '8px',
                border: '1px solid var(--color-border)',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--color-foreground)',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    borderBottom: `2px solid ${accent}`,
                    paddingBottom: '10px',
                    marginBottom: '16px',
                }}
            >
                <span style={{ fontWeight: 600, color: accent, fontSize: '13px' }}>SYSTEM ARCHITECTURE</span>
                <span style={{ color: textDim, fontSize: '9px' }}>REV 2.1 · 2026-04</span>
            </div>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '200px 1fr 180px',
                    gap: '1px',
                    background: gridLine,
                    border: `1px solid ${gridLine}`,
                }}
            >
                <div style={{ background: cellBg, padding: '14px' }}>
                    <div
                        style={{
                            fontWeight: 600,
                            marginBottom: 10,
                            color: accent,
                            fontSize: '10px',
                            letterSpacing: '0.5px',
                        }}
                    >
                        MODULES
                    </div>
                    {['Client Layer', 'API Gateway', 'Auth Service', 'Data Store'].map((m, i) => (
                        <div
                            key={i}
                            style={{
                                padding: '5px 8px',
                                margin: '2px 0',
                                background: i % 2 ? 'var(--color-muted)' : cellBg,
                                borderLeft: `2px solid ${i === 0 ? accent : gridLine}`,
                            }}
                        >
                            {m}
                        </div>
                    ))}
                </div>

                <div style={{ background: cellBg, padding: '14px', position: 'relative' }}>
                    <div
                        style={{
                            fontWeight: 600,
                            marginBottom: 10,
                            color: accent,
                            fontSize: '10px',
                            letterSpacing: '0.5px',
                        }}
                    >
                        DATA FLOW
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {[1, 2, 3].map((n) => (
                            <div key={n} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div
                                    style={{
                                        width: '28px',
                                        height: '18px',
                                        borderRadius: '2px',
                                        background: `${accent}33`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '9',
                                        color: accent,
                                        fontWeight: 600,
                                    }}
                                >
                                    REQ
                                </div>
                                <div style={{ flex: 1, height: '1px', background: gridLine }} />
                                <div
                                    style={{
                                        width: '40px',
                                        height: '18px',
                                        borderRadius: '2px',
                                        background: 'var(--color-muted)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '9',
                                        color: textDim,
                                    }}
                                >
                                    {n}ms
                                </div>
                            </div>
                        ))}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                marginLeft: 'auto',
                                marginRight: '36px',
                            }}
                        >
                            <div
                                style={{
                                    width: '36px',
                                    height: '18px',
                                    borderRadius: '2px',
                                    background: `${accent}22`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '9',
                                    color: accent,
                                    fontWeight: 600,
                                }}
                            >
                                RES
                            </div>
                            <div
                                style={{
                                    flex: 1,
                                    height: '1px',
                                    background: accent,
                                    opacity: 0.3,
                                }}
                            />
                        </div>
                    </div>
                    <div
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            padding: '4px 10px',
                            background: cellBg,
                            border: `1px solid ${accent}`,
                            borderRadius: '3px',
                            fontSize: '9px',
                            color: accent,
                            fontWeight: 600,
                        }}
                    >
                        ↕ async
                    </div>
                </div>

                <div style={{ background: cellBg, padding: '14px' }}>
                    <div
                        style={{
                            fontWeight: 600,
                            marginBottom: 10,
                            color: accent,
                            fontSize: '10px',
                            letterSpacing: '0.5px',
                        }}
                    >
                        SPECS
                    </div>
                    {[
                        ['Protocol', 'HTTP/2'],
                        ['Format', 'JSON'],
                        ['Cache', 'Redis'],
                        ['Status', 'Active'],
                    ].map(([k, v], i) => (
                        <div
                            key={i}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '4px 6px',
                                margin: '2px 0',
                                borderBottom: '1px solid var(--color-border)',
                                fontSize: '10px',
                            }}
                        >
                            <span style={{ color: textDim }}>{k}</span>
                            <span style={{ fontWeight: 500 }}>{v}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div
                style={{
                    marginTop: '12px',
                    borderTop: `1px dashed ${gridLine}`,
                    paddingTop: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '9px',
                    color: textDim,
                }}
            >
                <span>Generated by blueprinter</span>
                <span>Grid: 1px | No shadows | Monospace only</span>
            </div>
        </div>
    )
}

/* ──────────────────────────────────────
   3. Design System
   ────────────────────────────────────── */
function DesignSystemPreview() {
    const systems = [
        {
            name: 'Bauhaus',
            colors: ['#E63946', '#F1FAEE', '#A8DADC', '#457B9D', '#1D3557'],
            radius: '0px',
        },
        {
            name: 'Kinetic',
            colors: ['#FF006E', '#FB5607', '#FFBE0B', '#8338EC', '#3A86FF'],
            radius: '20px',
        },
        {
            name: 'Luxury',
            colors: ['#1A1A2E', '#16213E', '#0F3460', '#E94560', '#F5CB5C'],
            radius: '4px',
        },
    ]

    return (
        <div className="flex flex-col gap-5 p-6 bg-muted rounded-lg border border-border">
            <div className="flex justify-between items-baseline">
                <span className="text-sm font-medium text-foreground">Design System Tokens</span>
                <span className="text-[10px] text-muted-foreground font-mono">3 of 11 systems</span>
            </div>

            <div className="flex gap-4 flex-wrap">
                {systems.map((sys, i) => (
                    <div
                        key={i}
                        className="flex-[1_1_160px] p-4 bg-card border border-border rounded-lg shadow-sm"
                        style={{ borderRadius: sys.radius }}
                    >
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-[13px] font-medium text-foreground">{sys.name}</span>
                            <span className="text-[9px] text-muted-foreground font-mono px-1.5 py-0.5 bg-primary/10 rounded-sm">
                                r:{sys.radius}
                            </span>
                        </div>
                        <div className="flex gap-1 mb-3">
                            {sys.colors.map((color, j) => (
                                <div
                                    key={j}
                                    className="w-full aspect-square shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
                                    style={{
                                        borderRadius: sys.radius === '0px' ? '0px' : '50%',
                                        background: color,
                                    }}
                                    title={color}
                                />
                            ))}
                        </div>
                        <div
                            className="px-3 py-2.5 text-[11px] font-mono"
                            style={{
                                borderRadius: sys.radius,
                                background: sys.colors[0] || '#333',
                                color: sys.colors[4] || '#fff',
                            }}
                        >
                            --primary: {sys.colors[0]}
                            <br />
                            --accent: {sys.colors[2]}
                        </div>
                    </div>
                ))}
            </div>

            <div className="text-[10px] text-muted-foreground font-mono px-3 py-2 bg-card rounded border border-border">
                &rarr; Exports: CSS variables · Tailwind config · JSON tokens
            </div>
        </div>
    )
}

/* ──────────────────────────────────────
   4. Editorial Card
   ────────────────────────────────────── */
function EditorialCardPreview() {
    return (
        <div className="max-w-[480px] bg-card rounded-lg overflow-hidden shadow-md border border-border tabular-nums">
            <div className="flex justify-between items-center px-4 py-2 bg-muted border-b border-border text-[9px] text-muted-foreground font-mono">
                <span>EDITORIAL CARD v2</span>
                <span>680 × 340</span>
            </div>

            <div className="px-7 py-6 pb-5">
                <div className="text-[9px] font-semibold text-primary tracking-[1.5px] uppercase mb-2.5">
                    Design System · Q1 2026
                </div>

                <h3 className="text-[22px] font-normal leading-[1.15] text-foreground mb-1.5 text-wrap-balance">
                    Building Design Tokens That Scale Across 11 Themes
                </h3>

                <p className="text-[13px] leading-relaxed text-muted-foreground mb-[18px] pl-3 border-l-2 border-primary text-wrap-pretty">
                    A unified approach to color, spacing, and typography that maintains editorial rhythm at any
                    viewport.
                </p>

                <div className="flex gap-4 mb-[18px] pb-4 border-b-2 border-border">
                    {[
                        ['11', 'Themes'],
                        ['240+', 'Tokens'],
                        ['99.8%', 'Coverage'],
                    ].map(([value, label], i) => (
                        <div key={i}>
                            <div className="text-xl font-normal text-primary leading-[1.15]">{value}</div>
                            <div className="text-[9px] text-muted-foreground uppercase tracking-wide">{label}</div>
                        </div>
                    ))}
                </div>

                <ul className="list-none p-0 m-0 flex flex-col gap-1.5">
                    {[
                        'Dark ink surface with amber-gold accent',
                        'Serif headlines at weight 400, never bold',
                        'Three line-height bands: tight / dense / reading',
                        'CSS custom properties for full theming',
                    ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-[11px] leading-snug text-muted-foreground">
                            <span className="text-primary shrink-0">—</span>
                            {item}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="flex justify-between items-center px-5 py-2.5 bg-muted border-t border-border text-[9px] text-muted-foreground">
                <span className="font-mono">Midnight Atelier Style</span>
                <span>High density · 65ch max</span>
            </div>
        </div>
    )
}

/* ──────────────────────────────────────
   5. OPC Collection
   ────────────────────────────────────── */
function OpcCollectionPreview() {
    const stages = [
        { n: '00', name: '总编排', tag: '编排层' },
        { n: '01', name: '资源盘点', tag: '线性阶段' },
        { n: '02', name: '利基定位', tag: '线性阶段' },
        { n: '03', name: '价值主张', tag: '线性阶段' },
        { n: '04', name: '商业模式', tag: '线性阶段' },
        { n: '06', name: 'MVP 设计', tag: '线性阶段' },
        { n: '07', name: '转化闭环', tag: '线性阶段' },
        { n: '08', name: '资产沉淀', tag: '条件触发' },
        { n: '09', name: '经营复盘', tag: '条件触发' },
    ]
    return (
        <div className="p-6 bg-muted rounded-lg border border-border">
            <div className="flex items-center gap-2.5 mb-4">
                <span className="min-w-[34px] h-6 px-1.5 rounded-md bg-primary flex items-center justify-center font-mono text-[10px] font-bold text-primary-foreground leading-none whitespace-nowrap shrink-0">
                    OPC
                </span>
                <span className="text-[15px] text-foreground">OPC Methodology — 9 Skills</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
                {stages.map((s) => (
                    <div
                        key={s.n}
                        className="px-3 py-2 bg-card rounded-sm border border-border flex items-center gap-2"
                    >
                        <span className="font-mono text-xs font-bold text-primary min-w-[22px]">{s.n}</span>
                        <span className="text-[11px] text-foreground flex-1">{s.name}</span>
                    </div>
                ))}
            </div>
            <div className="mt-3.5 text-center text-[10px] text-muted-foreground font-mono">
                01 → 07 Linear execution · 08/09 On-demand trigger
            </div>
        </div>
    )
}

/* ──────────────────────────────────────
   7. Impeccable Collection
   ────────────────────────────────────── */
function ImpeccableCollectionPreview() {
    const cmds = [
        '/create',
        '/evaluate',
        '/refine',
        '/simplify',
        '/harden',
        '/system',
        '/audit',
        '/polish',
        '/bolder',
        '/distill',
        '/critique',
        '/typeset',
        '/layout',
        '/shape',
        '/craft',
        '/teach',
        '/extract',
        '/impeccable',
    ]
    return (
        <div
            style={{
                padding: '24px',
                background: 'linear-gradient(135deg,#1a1a2e 0%,#16213e 100%)',
                borderRadius: '8px',
                color: '#fff',
            }}
        >
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <span style={{ fontSize: '20px', letterSpacing: '3px', color: '#D4AF37' }}>&#9670; IMPECCABLE</span>
            </div>
            <div className="flex flex-wrap gap-1.5 justify-center">
                {cmds.map((c, i) => (
                    <span
                        key={i}
                        className="px-2.5 py-1 rounded text-[11px] font-mono font-semibold"
                        style={{
                            background: 'rgba(255,255,255,0.08)',
                            color: i === cmds.length - 1 ? '#D4AF37' : '#cbd5e1',
                            border: i === cmds.length - 1 ? '1px solid rgba(212,175,55,0.3)' : '1px solid transparent',
                        }}
                    >
                        {c}
                    </span>
                ))}
            </div>
            <div
                style={{
                    marginTop: 14,
                    textAlign: 'center',
                    fontSize: '10px',
                    color: 'rgba(212,175,55,0.7)',
                }}
            >
                18 Commands · 7 Dimensions · 25 Anti-pattern Rules
            </div>
        </div>
    )
}

/* ──────────────────────────────────────
   8. Markdown Viewer
   ────────────────────────────────────── */
function MarkdownViewerCollectionPreview() {
    return (
        <div className="p-6 bg-gradient-to-br from-muted to-muted rounded-lg border border-border">
            <div className="text-center mb-4">
                <span className="text-[13px] font-semibold text-[#9b8af2] tracking-wide">14 SKILLS · 5 ENGINES</span>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
                {[
                    {
                        label: 'Standalone',
                        items: ['vega', 'infographic', 'canvas'],
                        bg: 'rgba(99, 102, 241, 0.12)',
                        color: '#9b8af2',
                    },
                    {
                        label: 'HTML/CSS',
                        items: ['architecture', 'infocard'],
                        bg: 'rgba(236, 72, 153, 0.12)',
                        color: '#e88e8e',
                    },
                    {
                        label: 'PlantUML (9)',
                        items: ['uml', 'cloud', 'network', '...'],
                        bg: 'rgba(20, 184, 166, 0.12)',
                        color: '#5ecf8a',
                    },
                ].map((g, gi) => (
                    <div key={gi} className="p-3 rounded-lg text-center" style={{ background: g.bg }}>
                        <div className="text-[11px] font-bold mb-2" style={{ color: g.color }}>
                            {g.label}
                        </div>
                        {g.items.map((item, ii) => (
                            <div key={ii} className="text-[11px] text-muted-foreground py-0.5">
                                {item}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <div className="mt-3.5 text-center text-[10px] text-muted-foreground font-mono">
                npx skills add markdown-viewer/skills
            </div>
        </div>
    )
}

/* ──────────────────────────────────────
   9. Khazix
   ────────────────────────────────────── */
function KhazixCollectionPreview() {
    return (
        <div className="p-6 rounded-lg border border-[color-mix(in_srgb,#d4a853_25%,transparent)] bg-gradient-to-br from-muted to-[color-mix(in_srgb,#d4a853_8%,transparent)]">
            <div className="text-center mb-4">
                <span className="text-[13px] font-bold text-primary tracking-wide">Khazix Skills</span>
            </div>
            <div className="flex gap-3.5">
                {[
                    {
                        abbr: 'HV',
                        name: 'hv-analysis',
                        desc: '横纵分析法深度研究',
                        gradient: 'linear-gradient(135deg,#667eea,#764ba2)',
                    },
                    {
                        abbr: 'KW',
                        name: 'khazix-writer',
                        desc: '公众号长文写作',
                        gradient: 'linear-gradient(135deg,#d4a853,#e88e8e)',
                    },
                ].map((tool, i) => (
                    <div key={i} className="flex-1 p-4 bg-card rounded-[10px] border border-border text-center">
                        <div
                            className="w-11 h-11 rounded-xl mx-auto mb-2.5 flex items-center justify-center text-sm font-extrabold text-white"
                            style={{ background: tool.gradient }}
                        >
                            {tool.abbr}
                        </div>
                        <div className="text-xs font-semibold text-foreground mb-1">{tool.name}</div>
                        <div className="text-[10px] text-muted-foreground">{tool.desc}</div>
                    </div>
                ))}
            </div>
            <div className="mt-3.5 text-center text-[10px] text-muted-foreground font-mono">
                MIT License · Open Source
            </div>
        </div>
    )
}
