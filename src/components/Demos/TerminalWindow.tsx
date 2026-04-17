import { useState } from "react";

interface TerminalLine {
  text: string;
  type?: "input" | "output" | "error" | "success" | "info";
  delay?: number;
}

interface Props {
  lines: TerminalLine[];
  title?: string;
  prompt?: string;
  height?: string;
  autoPlay?: boolean;
}

export default function TerminalWindow({
  lines,
  title = "Terminal",
  prompt = "$ ",
  height = "280px",
  autoPlay = true,
}: Props) {
  const [visible, setVisible] = useState<number>(autoPlay ? 0 : lines.length);

  const lineColor = (type?: string) => {
    switch (type) {
      case "input":
        return "#7dd3fc";
      case "error":
        return "#fca5a5";
      case "success":
        return "#86efac";
      case "info":
        return "#93c5fd";
      default:
        return "#d4d4d8";
    }
  };

  return (
    <div
      style={{
        borderRadius: "var(--radius-md)",
        background: "#0d0d0d",
        border: "1px solid #333",
        overflow: "hidden",
        fontFamily: "var(--font-mono)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "10px 14px",
          background: "#1a1a1a",
          borderBottom: "1px solid #333",
        }}
      >
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e" }} />
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} />
        <span style={{ marginLeft: 12, fontSize: "12px", color: "#888" }}>{title}</span>
      </div>
      <div
        style={{
          padding: "12px 16px",
          height,
          overflowY: "auto",
          fontSize: "13px",
          lineHeight: 1.7,
        }}
      >
        {lines.slice(0, visible).map((line, i) => (
          <div key={i} style={{ color: lineColor(line.type), whiteSpace: "pre-wrap" }}>
            {line.type === "input" ? (
              <>
                <span style={{ color: "#86efac" }}>{prompt}</span>
                {line.text}
              </>
            ) : (
              line.text
            )}
          </div>
        ))}
        {visible < lines.length && (
          <span style={{ animation: "blink 1s step-end infinite" }}>&#9608;</span>
        )}
      </div>
      {autoPlay && visible < lines.length && (
        <button
          onClick={() => setVisible(Math.min(visible + 1, lines.length))}
          style={{
            margin: "8px 16px 12px",
            padding: "6px 16px",
            borderRadius: 6,
            border: "1px solid #444",
            background: "#1a1a1a",
            color: "#d4d4d8",
            cursor: "pointer",
            fontSize: "12px",
          }}
        >
          Next Line
        </button>
      )}
    </div>
  );
}
