'use client'

import { useState } from 'react'
import { type Language, parseVerdict } from '@/lib/curator-note'

interface VerdictCardProps {
    /** The curator note text. */
    note: string
    /** Which language the markers are in. */
    language: Language
    /** Label for the whole note, shown on the closed face. */
    label: string
    /** The three move labels, in order: when / replaces / caveat. */
    labels: { when: string; replaces: string; caveat: string }
    /** Cue shown on the closed face, inviting the reader to turn it over. */
    flipCue?: string
    /** Cue shown on the open face. */
    backCue?: string
    /**
     * 'flip' turns the card over on tap. 'open' shows the three moves
     * straight away — used in the dossier view, where the point is to read
     * many verdicts in a row rather than open one at a time.
     */
    variant?: 'flip' | 'open'
}

/**
 * The curator's note, as a card that turns over.
 *
 * The note is the site's whole reason to exist — it is the only place the
 * curator says *when* to reach for the tool, what it takes the place of, and
 * what the catch is. Flat on the page, that is one grey paragraph of prose,
 * and the three separate claims inside it blur together.
 *
 * Turned over, it is three labelled moves: the situation, the replacement,
 * the caveat. Nothing is reworded and nothing is dropped — the same
 * sentences, separated by the markers they already carry.
 *
 * The flip is a real button so it works with a keyboard and a screen reader;
 * the hidden face is kept in the DOM and revealed by a class rather than by
 * being mounted, so the text stays findable with in-page search.
 */
export function VerdictCard({ note, language, label, labels, flipCue, backCue, variant = 'flip' }: VerdictCardProps) {
    const [flipped, setFlipped] = useState(false)
    const parsed = parseVerdict(note, language)

    /* The marker that separated the moves is already the label above each
       one, so it is not printed a second time inside the sentence. */
    const displayText = (key: 'when' | 'replaces' | 'caveat', text: string) => {
        const markers =
            language === 'zh'
                ? ['注意：', '注意:']
                : key === 'when'
                  ? ['When ', 'when ']
                  : key === 'replaces'
                    ? ['Replaces ', 'replaces ']
                    : ['Caveat:']
        for (const m of markers) {
            if (text.startsWith(m)) return text.slice(m.length).trim()
        }
        return text
    }

    if (!parsed) {
        // A note that does not carry the three markers is shown whole. There
        // is nothing to separate, so there is nothing to turn over.
        return (
            <div className="verdict verdict--flat">
                <p className="verdict__label index-label index-label--signal">{label}</p>
                <p className="verdict__text">{note}</p>
            </div>
        )
    }

    const moves = [
        { key: 'when' as const, text: displayText('when', parsed.when) },
        { key: 'replaces' as const, text: displayText('replaces', parsed.replaces) },
        { key: 'caveat' as const, text: displayText('caveat', parsed.caveat) },
    ]

    const movesBlock = (list: typeof moves) => (
        <span className="verdict__moves">
            {list.map((move) => (
                <span className="verdict__move" key={move.key}>
                    <span className="verdict__move-label index-label">{labels[move.key]}</span>
                    <span className="verdict__move-text">{move.text}</span>
                </span>
            ))}
        </span>
    )

    // The open variant is not a control, so it is not a button: a reader
    // scanning a column of dossiers should not be walking through buttons.
    // It also drops the card title: three salmon move labels already say
    // what the block is, one more heading would be noise on every row.
    if (variant === 'open') {
        return <div className="verdict verdict--open">{movesBlock(moves)}</div>
    }

    return (
        <button
            type="button"
            className={`verdict${flipped ? ' is-flipped' : ''}`}
            aria-expanded={flipped}
            onClick={() => setFlipped((value) => !value)}
        >
            {/* The front carries the situation; the back carries the two moves
                that follow it. Repeating the situation on both faces would
                say the same thing twice for the reader's attention. */}
            <span className="verdict__face verdict__face--front">
                <span className="verdict__label index-label index-label--signal">{label}</span>
                <span className="verdict__text">{parsed.when}</span>
                <span className="verdict__cue index-label">{flipCue}</span>
            </span>

            <span className="verdict__face verdict__face--back" aria-hidden={!flipped}>
                <span className="verdict__label index-label index-label--signal">{label}</span>
                {movesBlock(moves.slice(1))}
                <span className="verdict__cue index-label">{backCue}</span>
            </span>
        </button>
    )
}
