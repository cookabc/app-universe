interface Props {
  phrases: string[];
}
export default function TriggerPhraseCloud({ phrases }: Props) {
  if (!phrases?.length) return null;
  return (
    <div
      style={{
        marginBottom: "24px",
        padding: "12px 16px",
        maxWidth: "65ch",
        margin: "0 auto",
      }}
    >
      <h3
        style={{
          fontSize: "14px",
          fontWeight: 600,
          marginBottom: "12px",
          color: "var(--text-secondary)",
        }}
      >
        🏷️ Trigger Phrases
      </h3>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {phrases.map((p, i) => (
          <span
            key={i}
            style={{
              padding: "8px 16px",
              borderRadius: "16px",
              background: "var(--tag-bg)",
              color: "var(--accent)",
              fontSize: "12px",
              fontWeight: 500,
              fontFamily: "var(--font-mono)",
              border: "1px solid transparent",
              transition: "background-color .15s ease, border-color .15s ease",
            }}
          >
            {p}
          </span>
        ))}
      </div>
    </div>
  );
}
