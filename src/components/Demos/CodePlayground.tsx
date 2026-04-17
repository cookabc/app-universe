import { useState } from "react";

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
    <div
      style={{
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--border)",
        overflow: "hidden",
        background: "var(--bg-card)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          borderBottom: "1px solid var(--border)",
          gap: "8px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-primary)" }}>
            {title}
          </span>
          <div style={{ display: "flex", gap: "4px" }}>
            {examples.map((e, i) => (
              <button
                key={i}
                onClick={() => setEi(i)}
                role="tab"
                aria-selected={i === ei}
                style={{
                  padding: "3px 10px",
                  borderRadius: "4px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "11px",
                  fontWeight: 500,
                  fontFamily: "var(--font-mono)",
                  background: i === ei ? "var(--near-black)" : "transparent",
                  color: i === ei ? "var(--white)" : "var(--text-secondary)",
                  transition: "background-color .15s ease, color .15s ease",
                }}
              >
                {e.language?.toLowerCase()}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={handleCopy}
          aria-label="Copy code"
          style={{
            padding: "4px 10px",
            borderRadius: "4px",
            border: "1px solid var(--border)",
            background: copied ? "var(--success)" : "transparent",
            color: copied ? "var(--white)" : "var(--text-secondary)",
            cursor: "pointer",
            fontSize: "11px",
            fontFamily: "var(--font-mono)",
            transition: "background-color .15s ease, color .15s ease",
          }}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      {ex.description && (
        <div
          style={{
            padding: "10px 16px",
            fontSize: "12px",
            color: "var(--text-secondary)",
            lineHeight: 1.5,
            borderBottom: "1px solid var(--border)",
          }}
        >
          {ex.description}
        </div>
      )}
      <div
        className="code-playground"
        style={{
          margin: 0,
          padding: "16px 20px",
          fontSize: "13px",
          fontFamily: "var(--font-mono)",
          lineHeight: 1.7,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          color: "var(--text-primary)",
          overflowX: "auto",
          textAlign: "left",
        }}
      >
        <code>{ex.code}</code>
      </div>
    </div>
  );
}
