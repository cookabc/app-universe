import type { ReactNode } from 'react'

interface CuratorNoteProps {
    /** Curator note text — the quotable payload. */
    note: string
    /** Small uppercase label above the quote, e.g. "Why I use it". */
    label: string
    /** Attribution line rendered after the quote. */
    attribution?: string
    /** Optional action rendered top-right (e.g. a copy button). */
    action?: ReactNode
}

/**
 * Editorial quote card for curator notes — designed to read well both on the
 * page and cropped into a screenshot: signal-coral bar, oversized quote mark,
 * mono attribution.
 */
export function CuratorNote({ note, label, attribution, action }: CuratorNoteProps) {
    return (
        <figure className="curator-note relative border-2 border-foreground bg-card p-6 sm:p-7">
            <span
                aria-hidden="true"
                className="display-heading absolute -top-4 left-5 -rotate-3 border-2 border-foreground bg-[hsl(var(--signal))] px-2.5 py-1 text-2xl leading-none text-white shadow-[2px_2px_0_hsl(var(--foreground))]"
            >
                ”
            </span>
            <div className="flex items-start justify-between gap-4">
                <figcaption className="index-label index-label--signal pt-1">{label}</figcaption>
                {action}
            </div>
            <blockquote className="mt-4 text-lg leading-relaxed text-foreground text-pretty sm:text-xl sm:leading-relaxed">
                {note}
            </blockquote>
            {attribution ? (
                <p className="index-label mt-5 border-t border-border pt-4 text-muted-foreground">{attribution}</p>
            ) : null}
        </figure>
    )
}
