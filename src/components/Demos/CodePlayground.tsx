import { useState } from 'react';

interface CodeExample {
  language: string;
  code: string;
  title?: string;
  description?: string;
}

interface Props {
  examples: CodeExample[];
  title?: string;
}

export default function CodePlayground({ examples, title = "Live Examples" }: Props) {
  const [ei, setEi] = useState(0);
  const [copied, setCopied] = useState(false);
  if (!examples.length) return null;
  const ex = examples[ei];

  const handleCopy = () => {
    navigator.clipboard.writeText(ex.code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div style={{ borderRadius: "var(--radius-md)", background: "var(--bg-card)", border: "1px solid var(--border)", overflow: "hidden" }}>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          <span style={{ fontSize: "13px", fontWeight: 600 }}>💻 {title}</span>
          {examples.map((e, i) => (
            <button
              key={i}
              onClick={() => setEi(i)}
              role="tab"
              aria-selected={i === ei}
              style={{
                padding: "3px 10px", borderRadius: 12, border: "none", cursor: "pointer",
                fontSize: "11px", fontWeight: 600,
                background: i === ei ? "var(--accent)" : "var(--bg-secondary)",
                color: i === ei ? "#fff" : "var(--text-secondary)",
                transition: "background-color .15s ease, color .15s ease",
              }}
            >{e.title || `${e.language} #${i+1}`}</button>
          ))}
        </div>
        <button
          onClick={handleCopy}
          aria-label="Copy code"
          style={{
            padding: "4px 10px", borderRadius: 6, border: "1px solid var(--border)",
            background: copied ? "var(--accent)" : "var(--bg-secondary)",
            color: copied ? "#fff" : "var(--text-secondary)", cursor: "pointer",
            fontSize: "11px", transition: "background-color .15s ease, border-color .15s ease, color .15s ease",
          }}
        >{copied ? "✓ Copied!" : "📋 Copy"}</button>
      </div>
      {ex.description && (
        <div style={{ padding: "8px 16px", fontSize: "12px", color: "var(--text-secondary)", borderBottom: "1px solid var(--border)" }}>
          {ex.description}
        </div>
      )}
      <div style={{ background: "#0d1117", overflowX: "auto" }}>
        <div style={{ padding: "4px 12px", background: "#161b22", fontSize: "11px", color: "#778297", fontFamily: "var(--font-mono)" }}>
          {ex.language || "text"}
        </div>
        <pre style={{ margin: 0, padding: "16px", color: "#c9d1d9", fontSize: "13px", fontFamily: "var(--font-mono)", lineHeight: 1.7, whiteSpace: "pre-wrap" }}><code>{ex.code}</code></pre>
      </div>
    </div>
  );
}
