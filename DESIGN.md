---
name: Wayseeker
description: A navigable workflow guide for choosing the next useful tool.
colors:
  workbench: "#111927"
  panel: "#1c2534"
  ink: "#eeeeec"
  muted: "#b5b3ad"
  line: "#363a3f"
  current: "#eac561"
  light-workbench: "#f4f4f2"
  light-panel: "#fdfdfc"
  light-ink: "#21201c"
  light-muted: "#63635e"
  light-line: "#dad9d6"
  light-current: "#ab6400"
  felt-dark: "rgba(0,0,0,0.09 peak)"
  felt-light: "rgba(255,255,255,0.085 peak)"
typography:
  display:
    fontFamily: "Georgia, Songti SC, STSong, serif"
    fontSize: "clamp(2.5rem, 5vw, 5rem)"
    fontWeight: 500
    lineHeight: 1.08
    letterSpacing: "-0.04em"
  body:
    fontFamily: "IBM Plex Sans, PingFang SC, sans-serif"
    fontSize: "1rem"
    lineHeight: 1.65
  scene-title:
    fontFamily: "Georgia, Songti SC, STSong, serif"
    fontSize: "clamp(1.75rem, 2.6vw, 2.5rem)"
    fontWeight: 500
    lineHeight: 1.12
    letterSpacing: "-0.035em"
  label:
    fontFamily: "IBM Plex Mono, monospace"
    fontSize: "0.75rem"
    lineHeight: 1.5
rounded:
  preview: "8px"
  thumbnail: "4px"
  neighbor: "5px"
  control: "50%"
components:
  workflow-stop:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
  tool-preview:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.preview}"
  scene-control:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    size: "44px"
---

# Design System: Wayseeker

## Overview

**Creative North Star: "A navigable workflow atlas"**

Wayseeker is a workflow map that helps you finish the task in front of you. It is not a tool directory sorted by popularity. The workflow, the real preview and the curation note change together inside one rotatable tool scene. The light workbench carries tools on paper-like layers; the dark workbench uses the real preview as its main light source. Both emphasise route, position and choice rather than wrapping another magazine cover or card wall around the catalog.

The workbench surface is covered in medical wool felt: two layers of tileable noise (dark fibres in `multiply`, bright fibres in `screen`, each peaking at roughly 9% alpha) over a 1600px soft gradient wash. The recipe comes from kaze.build and applies only to the workbench and the header/footer; tool previews and cards stay clean.

**Key Characteristics:**
- Organised by task chain, not by commercial labels such as AI or UI.
- Large real previews with readable curatorial evidence beside them.
- Hairlines, nodes and a restrained ochre mark the current position.
- Mobile keeps the same exploration logic: swipe the route, read the preview, read the judgement.

## Colors

The site has exactly one accent colour, ochre gold, sourced from the favicon; the danger meaning keeps red-11 to itself. Tomato red, lemon green, sage green and ochre previously coexisted as four accent systems, and that is what made the page look messy.

### Primary
- **Workbench Blue-black** `#111927`: the shared background for the dark page and for the header/footer.
- **Paper Workbench** `#f4f4f2`: the paper surface of the light page.
- **Ink**: warm white `#eeeeec` in the dark theme, near-black `#21201c` in the light theme.

### Secondary
- **Current Gold** `#eac561`: the current node, focus and key annotation in the dark theme.
- **Current Ochre** `#ab6400`: the same role in the light theme, 4.69:1 against white text.
- **Panel Navy / Paper**: the surface behind loading images and the control beds.

### Neutral
- **Muted Sand / Slate**: secondary explanation.
- **Quiet Line**: links, dividers and focus rings, always 0.5px.

## Typography

Two voices, never a third:

**Display Font:** Georgia / system Songti serif (`--font-display`), used for the page title, scene titles, tool names and curatorial quotes. Weight 500; hierarchy comes from size and negative tracking, not from heavier weights.
**Body Font:** IBM Plex Sans, falling back to the system sans for Chinese. Controls, prose and buttons all use it.
**Label/Mono Font:** IBM Plex Mono, used only for progress, seed and numeric records.

A self-hosted Manrope family and a second Plus Jakarta display face were previously declared, but both were bypassed by fallbacks in practice (every computed style resolved to IBM Plex Sans). Both have been removed.

Headlines only pose the task; they never cover the tool content. Workflow stops and tool names use natural sentence case with explicit weights, avoiding decorated all-caps labels.

## Layout

The desktop first screen is one task question, five workflow stops and a large real preview. The curation note for the current tool sits beside the preview; related tools sit at the lower edge of the preview without covering the screenshot content.

Mobile does not shrink the whole map. It reorders to: swipe the task route → full preview → tool name → curation note.

## Elevation & Depth

The workbench stays flat; previews use a soft offset shadow to create space. Do not add heavy borders and shadows to every region at once. Related tools sit on solid workbench colour, never behind a frosted glass layer that hides the real screenshot.

## Shapes

Previews use 8px corner radius, thumbnails 4px, neighbouring tools 5px; step and visit buttons are 44px circular touch targets, and workflow nodes are small dots. Do not use uniform rounded cards, coloured left rails or decorative tracks.

## Components

### Workflow Rail
Five task nodes joined by hairlines. The current node has a solid ochre dot, its label and `aria-pressed`, and draws a 2px current line along its lower edge. It scrolls horizontally on small screens.

### Atlas
The central tool fills the main scene with its real preview; the tools before and after it are offered as orbital thumbnails, giving a clickable spatial route. Flipping shows the curation note on the same object. Desktop keeps the spatial perspective; mobile keeps only the essential previous/next relationship, and the back face grows with its content.

### Explorer Navigation
Left and right arrows move between tools, up and down move between workflow stops, Home / End go to the ends. The theme switch covers the home page, header/footer, thumbnails, curation note and controls.

### Curator Judgment
Always keeps the three parts — when, replaces, caveat — with the label separated from the text. Long Chinese and English copy expands naturally.

### Index and Shuffle
The index can return to the correct workflow from any tool; a random seed restores both the tool and the task route, and allows copying the link and returning to the curated route.

## Do's and Don'ts

### Do:
- **Do** organise new pages by task, not by tool count.
- **Do** keep the real preview, the curation note and the current tool in sync.
- **Do** verify exploration and visiting on desktop, mobile, both languages and with reduced motion.

### Don't:
- **Don't** revert Wayseeker to a big headline plus a grid of tool cards.
- **Don't** introduce a second accent colour; ochre gold is already the only signal colour.
- **Don't** lay felt or noise over tool previews — it dirties the real screenshot.
- **Don't** copy reference sites' palettes, glowing borders or marketing hero sections.

---

中文版见 [DESIGN.zh-CN.md](DESIGN.zh-CN.md)。
