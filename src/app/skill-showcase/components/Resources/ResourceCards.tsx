import type { CSSProperties } from 'react'
import type { DesignResource } from '../../data/resources'

interface Props {
    resources: DesignResource[]
    variant?: 'featured' | 'compact'
}

export default function ResourceCards({ resources, variant = 'featured' }: Props) {
    if (!resources.length) return null

    return (
        <div
            className={
                variant === 'featured'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'
                    : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'
            }
        >
            {resources.map((resource, index) => (
                <article
                    key={resource.id}
                    className="rounded-lg border border-border bg-muted p-5 flex flex-col gap-3.5 hover:-translate-y-0.5 hover:border-foreground transition-all duration-200"
                    style={{ '--resource-color': resource.accent } as CSSProperties}
                >
                    <div className="flex items-center justify-between gap-3">
                        <span className="font-mono text-xs font-bold" style={{ color: 'var(--resource-color)' }}>
                            {String(index + 1).padStart(2, '0')}
                        </span>
                        <span
                            className="max-w-[24ch] overflow-hidden text-[10px] font-bold uppercase px-2.5 py-1.5 rounded-md truncate"
                            style={{
                                background: 'color-mix(in srgb, var(--resource-color) 10%, var(--color-muted))',
                                color: 'var(--resource-color)',
                            }}
                        >
                            {resource.eyebrow}
                        </span>
                    </div>
                    <h3 className="text-lg font-bold text-foreground leading-tight">{resource.name}</h3>
                    <p className="text-[13px] text-muted-foreground leading-relaxed">{resource.description}</p>
                    <div className="flex flex-col gap-2 p-3 rounded-lg border border-border bg-background/50">
                        {resource.bestFor.slice(0, variant === 'featured' ? 3 : 2).map((item) => (
                            <span key={item} className="text-xs font-medium text-foreground pl-3 relative">
                                <span
                                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
                                    style={{ background: 'var(--resource-color)' }}
                                />
                                {item}
                            </span>
                        ))}
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-auto">
                        <div className="flex flex-wrap gap-1.5">
                            {resource.tags.slice(0, 3).map((tag) => (
                                <span
                                    key={tag}
                                    className="text-[10px] font-medium px-2 py-0.5 border border-border rounded text-muted-foreground"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <a
                            href={resource.url}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 border rounded-full text-[11px] font-bold no-underline hover:border-foreground transition-colors"
                            style={{
                                borderColor: 'color-mix(in srgb, var(--resource-color) 36%, var(--color-border))',
                                color: 'var(--resource-color)',
                            }}
                            aria-label={`Open ${resource.name}`}
                        >
                            <span>Open</span>
                            <span aria-hidden="true">↗</span>
                        </a>
                    </div>
                </article>
            ))}
        </div>
    )
}
