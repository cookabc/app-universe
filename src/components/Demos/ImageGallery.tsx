import { useState } from 'react';

interface ImageItem {
  url: string;
  title: string;
  caption?: string;
}

interface Props {
  images: ImageItem[];
  title?: string;
  height?: string;
}

export default function ImageGallery({ images, title = "Gallery", height = "360px" }: Props) {
  const [idx, setIdx] = useState(0);
  if (!images.length) return null;

  const cur = images[idx];

  return (
    <div style={{ borderRadius: "var(--radius-md)", background: "var(--bg-card)", border: "1px solid var(--border)", overflow: "hidden" }}>
      {title && (
        <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "13px", fontWeight: 600 }}>&#128444; {title}</span>
          <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>{idx + 1} / {images.length}</span>
        </div>
      )}
      <div style={{ position: "relative", height, background: "var(--bg-secondary)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <img
          src={cur.url}
          alt={cur.title}
          style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: "4px" }}
        />
        {images.length > 1 && (
          <>
            <button
              onClick={() => setIdx((idx - 1 + images.length) % images.length)}
              style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", width: 32, height: 32, borderRadius: "50%", background: "rgba(0,0,0,0.6)", border: "none", color: "#fff", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}
            >&#8249;</button>
            <button
              onClick={() => setIdx((idx + 1) % images.length)}
              style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", width: 32, height: 32, borderRadius: "50%", background: "rgba(0,0,0,0.6)", border: "none", color: "#fff", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}
            >&#8250;</button>
          </>
        )}
      </div>
      {cur.caption && (
        <div style={{ padding: "8px 16px", fontSize: "12px", color: "var(--text-secondary)", textAlign: "center", borderTop: "1px solid var(--border)" }}>
          {cur.caption}
        </div>
      )}
      {images.length > 1 && (
        <div style={{ padding: "10px 16px", display: "flex", gap: 6, overflowX: "auto" }}>
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              style={{
                width: i === idx ? 48 : 40, height: i === idx ? 40 : 32,
                borderRadius: 6, border: i === idx ? "2px solid var(--accent)" : "2px solid transparent",
                padding: 0, overflow: "hidden", cursor: "pointer", background: "var(--bg-secondary)",
                transition: "all .2s", opacity: i === idx ? 1 : 0.5,
              }}
            >
              <img src={img.url} alt={img.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
