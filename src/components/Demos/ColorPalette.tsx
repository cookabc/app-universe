import { useState } from 'react';

interface ColorSwatch {
  name: string;
  hex: string;
  role?: string;
}

interface ThemeData {
  name: string;
  colors: ColorSwatch[];
}

interface Props {
  themes: ThemeData[];
  title?: string;
}

export default function ColorPalette({ themes, title = "Design Systems" }: Props) {
  const [ti, setTi] = useState(0);
  if (!themes.length) return null;
  const t = themes[ti];
  const roles = ["primary", "background", "card", "border", "muted", "accent", "foreground", "secondary"];

  return (
    <div style={{ borderRadius: "var(--radius-md)", background: "var(--bg-card)", border: "1px solid var(--border)", overflow: "hidden" }}>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: "13px", fontWeight: 600 }}>&#127912; {title}</span>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {themes.map((th, i) => (
            <button
              key={i}
              onClick={() => setTi(i)}
              style={{
                padding: "4px 12px", borderRadius: 20, border: "none", cursor: "pointer",
                fontSize: "12px", fontWeight: 600,
                background: i === ti ? "var(--accent)" : "var(--bg-secondary)",
                color: i === ti ? "#fff" : "var(--text-secondary)",
                transition: "all .2s",
              }}
            >{th.name}</button>
          ))}
        </div>
      </div>
      <div style={{ padding: "16px" }}>
        <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: 12 }}>{t.name} Palette</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 8 }}>
          {t.colors.map((c, i) => (
            <div key={i} style={{
              borderRadius: 8, overflow: "hidden",
              border: "1px solid var(--border)", background: "var(--bg-secondary)",
            }}>
              <div style={{ height: 48, background: c.hex }} />
              <div style={{ padding: "6px 8px" }}>
                <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-primary)" }}>{c.name}</div>
                <div style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}>{c.hex}</div>
                {c.role && <div style={{ fontSize: "10px", color: "var(--text-secondary)", opacity: 0.7 }}>{c.role}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function extractThemeColors(systemJson: Record<string, any>): ThemeData[] {
  if (!systemJson || !systemJson.defaultDesignSystems) return [];
  return systemJson.defaultDesignSystems.map((ds: any) => {
    const light = ds.themeConfig?.light || {};
    const dark = ds.themeConfig?.dark || {};
    const colors: ColorSwatch[] = [];
    const roleMap: Record<string, string> = {
      primary: "Primary", background: "Background", card: "Card",
      border: "Border", muted: "Muted", accent: "Accent",
      foreground: "Foreground", secondary: "Secondary",
      destructive: "Destructive", popover: "Popover",
      ring: "Ring", input: "Input", sidebar: "Sidebar",
    };
    for (const [key, label] of Object.entries(roleMap)) {
      const hex = light[key] || dark[key];
      if (hex && hex.startsWith("#")) {
        colors.push({ name: label, hex, role: key });
      }
    }
    return { name: ds.name || "Unknown", colors: colors.slice(0, 12) };
  });
}
