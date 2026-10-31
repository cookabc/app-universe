import TOOLS, { type Tool } from '../data/tools.ts'
import { WORKFLOWS } from '../data/workflow.ts'
import { type Language, parseVerdict } from './curator-note.ts'

/**
 * The cabinet: every tool filed in a drawer.
 *
 * The five workflow stages are the cabinet's columns, read left to right
 * (A–E), and a tool's place on its route is the row. A drawer code such as
 * "C4" therefore carries real information — the stage and the position on it
 * — the way an apothecary cabinet labels its drawers by column and row.
 */
export interface Drawer {
    tool: Tool
    /** Column letter + 1-based row, e.g. "C4". */
    code: string
    /** 0-based workflow index (the column). */
    stage: number
    /** 0-based position on the route (the row). */
    row: number
}

const COLUMN_LETTERS = 'ABCDEFGH'

export function stageLetter(stage: number): string {
    return COLUMN_LETTERS[stage] ?? '?'
}

export const DRAWERS: Drawer[] = WORKFLOWS.flatMap((flow, stage) =>
    flow.toolIds.flatMap((id, row) => {
        const tool = TOOLS.find((entry) => entry.id === id)
        return tool ? [{ tool, code: `${stageLetter(stage)}${row + 1}`, stage, row }] : []
    }),
)

/** Tallest column — the cabinet's row count. */
export const CABINET_ROWS = Math.max(...WORKFLOWS.map((flow) => flow.toolIds.length))

export function drawerOf(id: string): Drawer | undefined {
    return DRAWERS.find((drawer) => drawer.tool.id === id)
}

export function drawersInStage(stage: number): Drawer[] {
    return DRAWERS.filter((drawer) => drawer.stage === stage)
}

/** The three moves of a note, with their spoken markers removed for a labelled layout. */
export interface Label {
    when: string
    replaces: string
    caveat: string
}

function capitalise(text: string): string {
    return text ? text.charAt(0).toUpperCase() + text.slice(1) : text
}

/**
 * A note laid out as a label. The situation keeps its full sentence (it reads
 * in the first person and needs its opening word); "Replaces" and "Caveat:" /
 * 能替代 and 注意 are dropped because the label row names them.
 */
export function labelOf(tool: Tool, lang: Language): Label | null {
    const note = tool.note?.[lang] ?? tool.note?.en
    if (!note) return null
    const parsed = parseVerdict(note, lang)
    if (!parsed) return null
    if (lang === 'zh') {
        return {
            when: `${parsed.when}。`,
            replaces: `${parsed.replaces.replace(/^(能)?替代/, '')}。`,
            caveat: `${parsed.caveat.replace(/^注意[：:]\s*/, '')}。`,
        }
    }
    return {
        when: parsed.when,
        replaces: capitalise(parsed.replaces.replace(/^Replaces\s+/, '')),
        caveat: capitalise(parsed.caveat.replace(/^Caveat:\s*/, '')),
    }
}

/**
 * The habit a tool replaces, as a short lowercase phrase that can sit in a
 * running list: "guessing cubic-bezier values", 「瞎猜 cubic-bezier」.
 */
export function habitOf(tool: Tool, lang: Language): string {
    const note = tool.note?.[lang] ?? tool.note?.en ?? ''
    const parsed = parseVerdict(note, lang)
    if (!parsed) return tool.description[lang]
    if (lang === 'zh') return parsed.replaces.replace(/^(能)?替代/, '').replace(/。$/, '')
    return parsed.replaces.replace(/^Replaces\s+/, '').replace(/\.$/, '')
}
