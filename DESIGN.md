---
name: Wayseeker
description: A dispensary for creative work — every tool filed in a labelled drawer against the habit it replaces.
colors:
  paper: "#e8ebe3"
  paper-hi: "#f5f5ef"
  ink: "#16201b"
  ink-2: "#4a564f"
  seal: "#b8321d"
  lacquer: "#1b3a31"
  lacquer-deep: "#142d26"
  lacquer-ink: "#e9eadf"
  lacquer-ink-2: "#a9b9ae"
  brass: "#c9a35a"
  dark-paper: "#0d1714"
  dark-paper-hi: "#16201b"
  dark-ink: "#e4e6dc"
  dark-ink-2: "#a3ada5"
  dark-seal: "#e66a4e"
  dark-lacquer: "#163027"
typography:
  display:
    fontFamily: "Archivo (wdth 68), Noto Serif SC, Songti SC, serif"
    fontWeight: 800
    lineHeight: 0.95
    textTransform: uppercase
  body:
    fontFamily: "Archivo, PingFang SC, sans-serif"
    fontSize: "1rem"
    lineHeight: 1.6
  caps:
    fontFamily: "Archivo (wdth 85)"
    fontSize: "0.75rem"
    fontWeight: 600
    letterSpacing: "0.08em"
  code:
    fontFamily: "Fragment Mono"
    fontSize: "0.75rem"
rounded:
  slip: "2px"
  control: "3px"
  cabinet: "4px"
  pill: "999px"
---

**English** · [简体中文](DESIGN.zh-CN.md)

# Design System: Wayseeker

## North star: "The dispensary"

Wayseeker is an apothecary cabinet (百子柜) for creative work. Every tool is a drawer, coded by column and row; every drawer carries a paper label that says when to use it, the habit it replaces, and the caution. The site opens on the habits, not the tools: a visitor recognises what they are settling for, sees it struck out in seal red, and reads the label that answers it.

Content drives every structure:

- **Columns = workflow stages.** A–E are the five stages in `workflow.ts`. A drawer code like `C4` means stage C, fourth on that route. Codes are derived in `src/lib/drawers.ts`, never hand-written.
- **Labels = curator notes.** The three moves parsed by `curator-note.ts` become three ruled rows: For / Replaces / Caution.
- **Habits = the "Replaces" move.** `habitOf()` turns it into a running phrase for the first viewport.
- **Prescription = the plan generator.** One drawer per column, a seal pressed when written, exportable as Markdown.

## Colour

Two materials, one signal.

- **Rice paper** (`paper`, `paper-hi`) carries reading: the habit field, the dispensed slip, the prescription, label pages.
- **Green lacquer** (`lacquer`, `lacquer-deep`) carries the cabinet: the counter tray, the cabinet section, shelves, footer. Lacquer regions own whole bands of the page; they are never a small accent.
- **Brass** (`brass`) is hardware only: label frames, drawer pulls, column letters, the visit button on lacquer.
- **Seal red** (`seal`) has exactly two jobs: striking a habit out, and the stamp/anchor on the prescription (plus the caution label and focus ring). Never decorative fills.

Dark mode keeps the same materials at night: paper becomes deep green-black, the seal brightens to `#e66a4e` for contrast. All text pairs meet WCAG AA (body ≥ 4.5:1; measured in the build).

## Typography

- **Display:** Archivo at width 68, weight 800, uppercase — the voice of stencilled drawer labels. Chinese display falls to Noto Serif SC / Songti at 700, sentence case.
- **Body and controls:** Archivo at normal width.
- **Caps:** Archivo width 85, 600, tracked 0.08em — label row names, stage tabs, buttons.
- **Code:** Fragment Mono — drawer codes, prescription numbers, domains. Data only, never decoration.

## Components

- **Habit field** (`Dispensary`): every habit as a button, separated by slashes inside the button so no line starts with one. The current habit gets a seal strike drawn left to right (background-size transition) and its drawer code in seal red. Stage tabs dim habits from other columns.
- **Counter**: a lacquer tray, sticky on desktop. The slip slides up out of the slot on every change (`slip-out`, 620ms expo-out). Keys: ←/→ within a column, ↑/↓ across columns, Home/End.
- **Drawer front** (`DrawerFront`): lacquer face, mono code, a glazed window showing the real tool screenshot (no tint), paper label framed by a 2px brass ring, brass pull. Current drawer lifts and gains a seal ring. Empty slots keep the cabinet rectangular on desktop and are hidden on phones.
- **Label rows** (`LabelRows`): 1px ink rule on top, hairline rules between rows, Replaces struck through, Caution in seal.
- **Prescription slip**: perforated top edge (CSS mask), Rx mark, plan number = seed, five lettered lines with "instead of ~~habit~~", a two-character seal 寻路 pressed on write.
- **Label page** (`/t/[id]`): the big label (brass inset frame), the screenshot on a lacquer tray, and two shelves: same column, shares a tag.

## Motion and material effects

One grammar: exponential ease-out (`cubic-bezier(0.16, 1, 0.3, 1)`). Every effect is a property of a cabinet material, not decoration:

- **Paper:** title words rise out of the page (staggered, blurred in); the slip slides out of the slot, its screenshot develops in from a blur, its rows land in sequence and the habit is struck through live.
- **Lacquer:** a soft specular sheen follows the pointer across the counter tray and cabinet face (`pointer-fx.ts` writes `--mx/--my`; no React renders).
- **Glass and brass:** drawers tilt toward the pointer like hinged fronts, a glint band crosses the window, the brass pull catches light; the chosen drawer's seal ring pulses once.
- **Peek:** hovering a habit floats the remedy's screenshot beside the cursor (eased rAF trail, placed above the phrase so it stays readable).
- **Ink:** below-fold sections settle in once; cabinet drawers open in a diagonal wave; prescription lines are written in order; the seal leaves an ink bloom; ink and brass buttons carry a sweep of light.

Content is visible by default. Pointer effects are off on touch; `prefers-reduced-motion` turns all of it off.

## Don'ts

- Don't put tools in a card grid; every listing of tools is drawers or label rows.
- Don't use seal red for anything but strikes, stamps, caution and focus.
- Don't lay texture or tint over tool screenshots.
- Don't hand-number drawers; codes come from workflow order.
- Don't add eyebrow labels above headings.
