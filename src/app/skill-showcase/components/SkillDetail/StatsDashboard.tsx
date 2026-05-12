import type { SkillData } from '../../data/skills'

interface Props {
    skill: SkillData
}

export default function StatsDashboard({ skill }: Props) {
    const { stats, fileInfo } = skill

    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
                gap: '16px',
                marginBottom: '24px',
                maxWidth: '65ch',
                margin: '0 auto',
            }}
        >
            {[
                {
                    t: 'Content',
                    i: [
                        { l: 'Lines', v: String(stats.lineCount) },
                        {
                            l: 'Chars',
                            v:
                                stats.charCount >= 10000
                                    ? (stats.charCount / 1000).toFixed(1) + 'K'
                                    : String(stats.charCount),
                        },
                        { l: 'Sections', v: String(stats.sectionCount) },
                        { l: 'Code Blocks', v: String(stats.codeBlockCount) },
                    ],
                },
                {
                    t: 'Files',
                    i: [
                        { l: 'Total Files', v: String(fileInfo.totalFiles) },
                        { l: 'Size', v: fileInfo.totalSizeStr },
                        { l: 'Complexity', v: stats.complexityLabel },
                        { l: 'Read Time', v: stats.readTime },
                    ],
                },
                {
                    t: 'Meta',
                    i: [
                        { l: 'Category', v: skill.category.label },
                        { l: 'ID', v: skill.id },
                        { l: 'Updated', v: skill.lastUpdated || '-' },
                        { l: 'Triggers', v: String(skill.triggerPhrases.length) },
                    ],
                },
            ].map((card) => (
                <div
                    key={card.t}
                    style={{
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        padding: '20px 24px',
                    }}
                >
                    <div
                        style={{
                            fontSize: '12px',
                            fontWeight: 600,
                            marginBottom: '14px',
                            color: 'var(--text-primary)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                        }}
                    >
                        {card.t}
                    </div>
                    <div style={{ display: 'grid', gap: '8px' }}>
                        {card.i.map((item) => (
                            <div
                                key={item.l}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'baseline',
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: '12px',
                                        color: 'var(--text-secondary)',
                                        fontWeight: 400,
                                    }}
                                >
                                    {item.l}
                                </span>
                                <span
                                    style={{
                                        fontSize: '13px',
                                        fontWeight: 500,
                                        fontFamily: 'var(--font-mono)',
                                        color: 'var(--text-primary)',
                                    }}
                                >
                                    {item.v}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}
