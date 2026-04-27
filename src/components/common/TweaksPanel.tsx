import { useState, useEffect, useCallback } from "react";

interface TweakOption {
  label: string;
  value: string;
}

interface TweakGroup {
  key: string;
  label: string;
  type: "select" | "toggle";
  options?: TweakOption[];
  default: string | boolean;
}

const GROUPS: TweakGroup[] = [
  {
    key: "theme",
    label: "Theme",
    type: "select",
    options: [
      { label: "Dark", value: "dark" },
      { label: "Light", value: "light" },
    ],
    default: "light",
  },
  {
    key: "density",
    label: "Card Density",
    type: "select",
    options: [
      { label: "Comfortable", value: "comfortable" },
      { label: "Compact", value: "compact" },
      { label: "Spacious", value: "spacious" },
    ],
    default: "comfortable",
  },
  {
    key: "accent",
    label: "Accent Color",
    type: "select",
    options: [
      { label: "Amber Gold", value: "amber" },
      { label: "Mint Green", value: "mint" },
      { label: "Rose", value: "rose" },
      { label: "Lavender", value: "lavender" },
    ],
    default: "amber",
  },
  {
    key: "radius",
    label: "Corner Style",
    type: "select",
    options: [
      { label: "Rounded", value: "rounded" },
      { label: "Sharp", value: "sharp" },
      { label: "Pill", value: "pill" },
    ],
    default: "rounded",
  },
  {
    key: "animations",
    label: "Animations",
    type: "toggle",
    default: true,
  },
];

const ACCENT_MAP: Record<
  string,
  { brand: string; soft: string; subtle: string; glow: string }
> = {
  amber: {
    brand: "#d4a853",
    soft: "rgba(212,168,83,.12)",
    subtle: "rgba(212,168,83,.06)",
    glow: "rgba(212,168,83,.2)",
  },
  mint: {
    brand: "#5ecf8a",
    soft: "rgba(94,207,138,.12)",
    subtle: "rgba(94,207,138,.06)",
    glow: "rgba(94,207,138,.18)",
  },
  rose: {
    brand: "#e87d7d",
    soft: "rgba(232,125,125,.12)",
    subtle: "rgba(232,125,125,.06)",
    glow: "rgba(232,125,125,.18)",
  },
  lavender: {
    brand: "#9b8af2",
    soft: "rgba(155,138,242,.12)",
    subtle: "rgba(155,138,242,.06)",
    glow: "rgba(155,138,242,.2)",
  },
};

const RADIUS_MAP: Record<
  string,
  { lg: string; md: string; sm: string; full: string }
> = {
  rounded: { lg: "16px", md: "12px", sm: "8px", full: "9999px" },
  sharp: { lg: "6px", md: "4px", sm: "2px", full: "4px" },
  pill: { lg: "20px", md: "16px", sm: "12px", full: "9999px" },
};

const DENSITY_GAP: Record<string, string> = {
  comfortable: "20px",
  compact: "12px",
  spacious: "28px",
};

const DENSITY_PADDING: Record<string, string> = {
  comfortable: "24px",
  compact: "16px",
  spacious: "32px",
};

const panelStyles = {
  trigger: (open: boolean) => ({
    position: "fixed" as const,
    bottom: open ? "auto" : "20px",
    right: "20px",
    zIndex: 9999,
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    border: "1px solid var(--border-strong)",
    background: "var(--bg-elevated)",
    color: "var(--brand)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "var(--shadow-lg)",
    transition: "all var(--duration-normal) var(--ease-out)",
    transform: open ? "rotate(180deg) scale(.88)" : "rotate(0deg) scale(1)",
  }),
  panel: (open: boolean) => ({
    position: "fixed" as const,
    bottom: "20px",
    right: "20px",
    zIndex: 9998,
    width: "280px",
    borderRadius: "var(--radius-lg)",
    background: "var(--bg-card)",
    border: "1px solid var(--border-strong)",
    boxShadow: "var(--shadow-xl)",
    padding: "0",
    opacity: open ? 1 : 0,
    transform: open ? "translateY(0)" : "translateY(10px)",
    pointerEvents: (open ? "auto" : "none") as "auto" | "none",
    transition:
      "opacity var(--duration-normal) var(--ease-out), transform var(--duration-normal) var(--ease-out)",
    overflow: "hidden",
  }),
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 16px",
    borderBottom: "1px solid var(--border-soft)",
  },
  title: {
    fontSize: "11px",
    fontWeight: 700,
    color: "var(--brand)",
    letterSpacing: "1.5px",
    textTransform: "uppercase" as const,
    fontFamily: "var(--font-sans)",
  },
  closeBtn: {
    background: "none",
    border: "none",
    color: "var(--text-muted)",
    cursor: "pointer",
    padding: "2px",
    fontSize: "14px",
    lineHeight: 1,
  },
  body: {
    padding: "12px 16px 16px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
  },
  group: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "6px",
  },
  groupLabel: {
    fontSize: "10px",
    fontWeight: 600,
    color: "var(--text-muted)",
    textTransform: "uppercase" as const,
    letterSpacing: "0.6px",
    fontFamily: "var(--font-sans)",
  },
  selectRow: {
    display: "flex",
    gap: "4px",
  },
  optionChip: (active: boolean) => ({
    flex: 1,
    padding: "6px 8px",
    borderRadius: "var(--radius-sm)",
    border: "1px solid transparent",
    background: active ? "var(--brand-soft)" : "transparent",
    color: active ? "var(--brand)" : "var(--text-muted)",
    fontSize: "11px",
    fontWeight: 500,
    cursor: "pointer",
    textAlign: "center" as const,
    fontFamily: "var(--font-sans)",
    transition: "all var(--duration-fast) var(--ease-out)",
    outline: "none",
  }),
  toggleRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toggleTrack: (on: boolean) => ({
    width: "36px",
    height: "20px",
    borderRadius: "10px",
    background: on ? "var(--brand)" : "var(--bg-elevated)",
    border: `1px solid ${on ? "var(--brand)" : "var(--border)"}`,
    position: "relative" as const,
    cursor: "pointer",
    transition: "all var(--duration-fast) var(--ease-out)",
  }),
  toggleThumb: (on: boolean) => ({
    position: "absolute" as const,
    top: "2px",
    left: on ? "16px" : "2px",
    width: "14px",
    height: "14px",
    borderRadius: "50%",
    background: "var(--bg-elevated)",
    transition: "left var(--duration-fast) var(--ease-out)",
  }),
  toggleLabel: {
    fontSize: "12px",
    color: "var(--text-secondary)",
    fontWeight: 500,
    fontFamily: "var(--font-sans)",
  },
};

export interface TweaksState {
  theme: string;
  density: string;
  accent: string;
  radius: string;
  animations: boolean;
}

export function useTweaks() {
  const [state, setState] = useState<TweaksState>({
    theme: GROUPS[0].default as string,
    density: GROUPS[1].default as string,
    accent: GROUPS[2].default as string,
    radius: GROUPS[3].default as string,
    animations: GROUPS[4].default as boolean,
  });

  const set = useCallback((key: keyof TweaksState, val: string | boolean) => {
    setState((prev) => ({ ...prev, [key]: val }));
  }, []);

  return { tweaks: state, setTweak: set };
}

export function applyTweaks(tweaks: TweaksState): void {
  const root = document.documentElement;

  // Theme
  if (tweaks.theme === "light") {
    root.setAttribute("data-theme", "light");
  } else {
    root.removeAttribute("data-theme");
  }

  if (tweaks.accent && ACCENT_MAP[tweaks.accent]) {
    const a = ACCENT_MAP[tweaks.accent];
    root.style.setProperty("--brand", a.brand);
    root.style.setProperty("--brand-soft", a.soft);
    root.style.setProperty("--brand-subtle", a.subtle);
    root.style.setProperty("--brand-glow", a.glow);
    root.style.setProperty("--focus-ring", `0 0 0 2px ${a.brand}`);
  }

  if (tweaks.radius && RADIUS_MAP[tweaks.radius]) {
    const r = RADIUS_MAP[tweaks.radius];
    root.style.setProperty("--radius-lg", r.lg);
    root.style.setProperty("--radius-md", r.md);
    root.style.setProperty("--radius-sm", r.sm);
    root.style.setProperty("--radius-full", r.full);
  }

  if (!tweaks.animations) {
    root.style.setProperty("--duration-entry", "0ms");
    root.style.setProperty("--duration-slow", "0ms");
    root.style.setProperty("--duration-normal", "0ms");
    root.style.setProperty("--duration-fast", "0ms");
  } else {
    root.style.removeProperty("--duration-entry");
    root.style.removeProperty("--duration-slow");
    root.style.removeProperty("--duration-normal");
    root.style.removeProperty("--duration-fast");
  }
}

export default function TweaksPanel({
  tweaks,
  onChange,
}: {
  tweaks: TweaksState;
  onChange: (key: keyof TweaksState, val: string | boolean) => void;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    applyTweaks(tweaks);
  }, [tweaks]);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        style={panelStyles.trigger(open)}
        aria-label="Toggle Tweaks Panel"
        title="Tweaks"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </button>

      <div
        style={panelStyles.panel(open)}
        role="dialog"
        aria-label="Design Tweaks"
      >
        <div style={panelStyles.header}>
          <span style={panelStyles.title}>Tweaks</span>
          <button
            onClick={() => setOpen(false)}
            style={panelStyles.closeBtn}
            aria-label="Close Tweaks"
          >
            ✕
          </button>
        </div>
        <div style={panelStyles.body}>
          {GROUPS.map((g) => (
            <div key={g.key} style={panelStyles.group}>
              <span style={panelStyles.groupLabel}>{g.label}</span>
              {g.type === "select" && g.options ? (
                <div style={panelStyles.selectRow}>
                  {g.options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() =>
                        onChange(g.key as keyof TweaksState, opt.value)
                      }
                      style={panelStyles.optionChip(
                        String(tweaks[g.key as keyof TweaksState]) ===
                          opt.value,
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              ) : g.type === "toggle" ? (
                <div style={panelStyles.toggleRow}>
                  <span style={panelStyles.toggleLabel}>Enabled</span>
                  <button
                    role="switch"
                    aria-checked={!!tweaks[g.key as keyof TweaksState]}
                    onClick={() =>
                      onChange(
                        g.key as keyof TweaksState,
                        !tweaks[g.key as keyof TweaksState],
                      )
                    }
                    style={panelStyles.toggleTrack(
                      !!tweaks[g.key as keyof TweaksState],
                    )}
                  >
                    <span
                      style={panelStyles.toggleThumb(
                        !!tweaks[g.key as keyof TweaksState],
                      )}
                    />
                  </button>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
