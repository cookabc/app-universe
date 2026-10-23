---
name: "App Universe"
description: "Extracted visual system for the tool preview desk"
colors:
  slate-1: "#fcfcfd"
  slate-12: "#1c2024"
  slate-2: "#f9f9fb"
  indigo-11: "#3a5bc7"
  indigo-1: "#fdfdfe"
  slate-3: "#f0f0f3"
  slate-11: "#60646c"
  indigo-3: "#edf2fe"
  indigo-12: "#1f2d5c"
  slate-6: "#d9d9e0"
  slate-7: "#cdced6"
  indigo-8: "#8da4ef"
  red-11: "#ce2c31"
  grass-11: "#2a7e3b"
  indigo-5: "#d2deff"
  indigo-9: "#3e63dd"
  indigo-4: "#e1e9ff"
  slate-1-dark: "#111113"
  slate-12-dark: "#edeef0"
  slate-2-dark: "#18191b"
  indigo-11-dark: "#9eb1ff"
  indigo-1-dark: "#11131f"
  slate-3-dark: "#212225"
  slate-11-dark: "#b0b4ba"
  indigo-3-dark: "#182449"
  indigo-12-dark: "#d6e1ff"
  slate-6-dark: "#363a3f"
  slate-7-dark: "#43484e"
  indigo-8-dark: "#435db1"
  red-11-dark: "#ff9592"
  grass-11-dark: "#71d083"
  indigo-5-dark: "#253974"
  indigo-9-dark: "#3e63dd"
  indigo-4-dark: "#1d2e62"
typography:
  display:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "48px"
  title:
    fontFamily: "IBM Plex Sans, sans-serif"
    fontSize: "24px"
  body:
    fontFamily: "IBM Plex Sans, sans-serif"
    fontSize: "16px"
  label:
    fontFamily: "IBM Plex Sans, sans-serif"
    fontSize: "12px"
rounded:
  tag: "3px"
  action: "4px"
  control: "6px"
spacing:
  space-8: "8px"
  space-12: "12px"
  space-16: "16px"
  space-20: "20px"
  space-24: "24px"
  space-28: "28px"
  space-32: "32px"
components:
  explorer-actions:
    typography: "{typography.label}"
  explorer-search:
    typography: "{typography.label}"
  explorer-categories:
    typography: "{typography.label}"
  explorer-item:
    backgroundColor: "transparent"
    textColor: "{colors.slate-12}"
    padding: "10px"
    height: "72px"
  explorer-tags:
    typography: "{typography.label}"
---

# Design System: App Universe

## Overview

**Creative North Star: "The Tool Preview Desk"**

A quiet preview desk makes the selected tool the center of attention. Compact collection rows and visible filters support one persistent preview. Indigo identifies selection and actions; original screenshots retain their own visual identities.

This code-led scan uses src/explorer.css as the final override layer, with inherited rules from src/app/globals.css. Local review captures provide visual evidence; there is no separate visual comp.

**Key Characteristics:**

- Semantic Radix colors
- Four-size hierarchy
- Flat working surfaces
- Original imagery

## Colors

### Primary

Indigo identifies the main task, selection, and actions.

### Secondary

Original screenshots provide content colors; they are not secondary UI tokens.

### Neutral

Slate steps 1–3 distinguish page, surfaces, and controls. Steps 6–8 mark boundaries; steps 11–12 supply ink.

**The Semantic Step Rule.** Use exact Radix values at their implemented semantic role; original raster content is outside the authored UI palette.

Dark-suffixed tokens are exact counterparts in the local Radix file. Runtime CSS variables select the theme. Fixed light text on filled actions intentionally stays light.

## Typography

The frontmatter records the four-size hierarchy. Mobile headings reuse an existing size; weights and spacing distinguish roles without adding sizes. Minimum authored text is 12px. IBM Plex Mono supports metadata; existing editorial and footer rules also use Georgia/Songti serif text without adding a new size. Font declarations are in src/app/layout.tsx. Original raster typography is outside this scale.

## Layout

A container capped at 1440px has 32px side padding. A 280px collection sits beside the preview. At 900px, gutters become 20px, the collection becomes 220px, and actions flow into a row. At 600px, 200px collection items form a horizontal strip above the preview. The contain-fit image frame changes from 16:10 to 4:3. Standalone puzzles in public/puzzles keep their own compact geometry and 12/16/32px type; their narrow grids use min-width: 0, line-height: 1, and 16px cells. Their black/white neutral styling is separate from the directory surface.

## Elevation & Depth

Flat surfaces use tonal steps, rules, and whitespace. Final overrides remove decorative shadows and backdrop blur. The sidecar shadow vocabulary is empty. State motion is limited to 250ms ease-out where needed, including the inherited cubic-bezier easing recorded in the sidecar. Reduced-motion disables transitions and animation.

## Shapes

3px tag corners, 4px actions, and the 6px shared control radius. Main working regions stay rectangular. Authored boundaries use 0.5px strokes; visible keyboard focus is a distinct 2px outline, not a decorative border.

## Components

### Working surface

Search, category, tags, deterministic shuffle, and selection are real state. Keep visible selection synchronized with the shareable URL. Open-website and read-the-notes links remain distinct. Tags are functional filters.

### Reusable controls

The sidecar contains a small set of source-derived actions, navigation, fields, and signature surfaces. Snippets preserve implemented states and CSS variable references; they illustrate appearance rather than application engines or full route behavior.

### Evidence and provenance

Sources: src/explorer.css, src/app/globals.css, and src/radix.css. Desktop and mobile review captures were inspected, including the dark capture. .impeccable/asset-provenance.json records original repository assets with source commit/path and SHA256, plus relevant licenses. Existing screenshots, icons, and game faces were preserved without recoloring. No new AI raster assets were introduced. Radix MIT attribution is adjacent to radix.css. These local observations make no live-deployment claim.

## Do's and Don'ts

### Do:

- Do use Radix steps 1–2 for backgrounds, 3–5 for interactive surfaces, 6–8 for boundaries, 9–10 for solid fills, and 11–12 for readable ink.
- Do preserve original assets and consult .impeccable/asset-provenance.json before changing imagery.
- Do keep at most four authored text sizes and preserve visible keyboard focus.
- Do remove nonessential motion when prefers-reduced-motion is active.

### Don't:

- Don't add decorative shadows, middle-dot separators, or redundant explanatory UI copy.
- Don't treat screenshot colors or embedded text as UI design tokens.
