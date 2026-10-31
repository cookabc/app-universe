'use client'

import type { Tool } from '@/data/tools'
import { useI18nReady } from '@/hooks/useI18nReady'
import type { Language } from '@/lib/curator-note'
import { labelOf } from '@/lib/drawers'

/** The three label rows — For, Replaces, Caution — with the habit struck through. */
export function LabelRows({ tool, lang }: { tool: Tool; lang: Language }) {
    const { t } = useI18nReady()
    const label = labelOf(tool, lang)
    if (!label) {
        const note = tool.note?.[lang] ?? tool.note?.en
        return note ? <p className="label-rows pt-3">{note}</p> : null
    }
    return (
        <dl className="label-rows">
            <div className="label-row">
                <dt className="caps">{t('counter.for')}</dt>
                <dd>{label.when}</dd>
            </div>
            <div className="label-row">
                <dt className="caps">{t('counter.replaces')}</dt>
                <dd>
                    <s className="strike">{label.replaces}</s>
                </dd>
            </div>
            <div className="label-row label-row--caution">
                <dt className="caps">{t('counter.caution')}</dt>
                <dd>{label.caveat}</dd>
            </div>
        </dl>
    )
}
