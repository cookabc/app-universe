import { useState } from "react";

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

export default function ImageGallery({
  images,
  title = "Gallery",
  height = "360px",
}: Props) {
  const [idx, setIdx] = useState(0);
  if (!images.length) return null;

  const cur = images[idx];
  const goPrev = () => setIdx((idx - 1 + images.length) % images.length);
  const goNext = () => setIdx((idx + 1) % images.length);

  return (
    <div
      style={{
        borderRadius: "var(--radius-md)",
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        overflow: "hidden",
      }}
      role="region"
      aria-label={title}
    >
      {title && (
        <div
          style={{
            padding: "12px 16px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: "13px", fontWeight: 600 }}>📸 {title}</span>
          <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
            {idx + 1} / {images.length}
          </span>
        </div>
      )}
      <div
        style={{
          position: "relative",
          height,
          background: "var(--bg-secondary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <img
          src={cur.url}
          alt={cur.title || "Gallery image"}
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
            borderRadius: "4px",
          }}
          loading="lazy"
        />
        {images.length > 1 && (
          <>
            <button
              onClick={goPrev}
              aria-label="Previous image"
              style={{
                position: "absolute",
                left: 8,
                top: "50%",
                transform: "translateY(-50%)",
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "rgba(0,0,0,0.6)",
                border: "none",
                color: "#fff",
                cursor: "pointer",
                fontSize: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background-color .15s ease",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.background =
                  "rgba(0,0,0,0.8)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.background =
                  "rgba(0,0,0,0.6)")
              }
            >
              ‹
            </button>
            <button
              onClick={goNext}
              aria-label="Next image"
              style={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: "translateY(-50%)",
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "rgba(0,0,0,0.6)",
                border: "none",
                color: "#fff",
                cursor: "pointer",
                fontSize: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background-color .15s ease",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.background =
                  "rgba(0,0,0,0.8)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.background =
                  "rgba(0,0,0,0.6)")
              }
            >
              ›
            </button>
          </>
        )}
      </div>
      {cur.caption && (
        <div
          style={{
            padding: "8px 16px",
            fontSize: "12px",
            color: "var(--text-secondary)",
            textAlign: "center",
            borderTop: "1px solid var(--border)",
          }}
        >
          {cur.caption}
        </div>
      )}
      {images.length > 1 && (
        <div
          style={{
            padding: "10px 16px",
            display: "flex",
            gap: 6,
            overflowX: "auto",
          }}
          role="tablist"
          aria-label="Gallery thumbnails"
        >
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`View image ${i + 1}: ${img.title}`}
              aria-selected={i === idx}
              role="tab"
              style={{
                width: i === idx ? 48 : 40,
                height: i === idx ? 40 : 32,
                borderRadius: 6,
                border:
                  i === idx
                    ? "2px solid var(--accent)"
                    : "2px solid transparent",
                padding: 0,
                overflow: "hidden",
                cursor: "pointer",
                background: "var(--bg-secondary)",
                transition: "border-color .15s ease, opacity .15s ease",
                opacity: i === idx ? 1 : 0.5,
              }}
            >
              <img
                src={img.url}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
