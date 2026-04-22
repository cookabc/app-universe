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

export default function CodePlayground({
  examples,
  title = "Live Examples",
}: Props) {
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
        background: "var(--bg-card)",
        border: "1px solid var(--border-soft)",
        overflow: "hidden",
        maxWidth: "65ch",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 14px",
          borderBottom: "1px solid var(--border-soft)",
          gap: "8px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontSize: "12px",
              fontWeight: 600,
              color: "var(--text-primary)",
            }}
          >
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
                  padding: "4px 10px",
                  borderRadius: "3px",
                  border:
                    i === ei
                      ? "1px solid var(--brand)"
                      : "1px solid transparent",
                  background: i === ei ? "var(--tag-bg)" : "transparent",
                  color: i === ei ? "var(--brand)" : "var(--text-secondary)",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: 500,
                  fontFamily: "var(--font-mono)",
                  transition: "all .15s ease",
                }}
                onMouseDown={(e) => {
                  (e.currentTarget as HTMLElement).style.transform =
                    "scale(0.96)";
                }}
                onMouseUp={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "scale(1)";
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
            borderRadius: "3px",
            border: copied
              ? "1px solid var(--success)"
              : "1px solid var(--border-soft)",
            background: copied ? "#EEF2F7" : "transparent",
            color: copied ? "var(--success)" : "var(--text-secondary)",
            cursor: "pointer",
            fontSize: "12px",
            fontFamily: "var(--font-mono)",
            transition: "all .15s ease",
          }}
          onMouseDown={(e) => {
            (e.currentTarget as HTMLElement).style.transform = "scale(0.96)";
          }}
          onMouseUp={(e) => {
            (e.currentTarget as HTMLElement).style.transform = "scale(1)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.transform = "scale(1)";
          }}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      {ex.description && (
        <div
          style={{
            padding: "8px 14px",
            fontSize: "13px",
            color: "var(--text-secondary)",
            lineHeight: 1.5,
            borderBottom: "1px solid var(--border-soft)",
          }}
        >
          {ex.description}
        </div>
      )}
      <div
        className="code-playground"
        style={{
          margin: 0,
          padding: "14px",
          fontSize: "12px",
          fontFamily: "var(--font-mono)",
          lineHeight: 1.6,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          color: "var(--text-primary)",
          overflowX: "auto",
        }}
      >
        <code>{ex.code}</code>
      </div>
    </div>
  );
}
