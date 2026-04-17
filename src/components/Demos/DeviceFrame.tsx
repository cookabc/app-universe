interface DeviceScreenshot {
  url: string;
  device: string;
  label: string;
}

interface Props {
  screenshots: DeviceScreenshot[];
  title?: string;
}

export default function DeviceFrame({ screenshots, title = "Device Preview" }: Props) {
  if (!screenshots.length) return null;

  const frameStyle = (device: string) => {
    switch (device) {
      case "iphone-pro":
        return { width: 270, height: 580, radius: 40, notch: true, color: "#1a1a1a" };
      case "iphone-pro-max":
        return { width: 294, height: 630, radius: 44, notch: true, color: "#1a1a1a" };
      case "ipad-pro-11":
        return { width: 500, height: 376, radius: 18, notch: false, color: "#1a1a1a" };
      case "ipad-pro-13":
        return { width: 584, height: 438, radius: 20, notch: false, color: "#1a1a1a" };
      default:
        return { width: 300, height: 400, radius: 24, notch: false, color: "#1a1a1a" };
    }
  };

  return (
    <div
      style={{
        borderRadius: "var(--radius-md)",
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        overflow: "hidden",
      }}
    >
      {title && (
        <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
          <span style={{ fontSize: "13px", fontWeight: 600 }}>&#128241; {title}</span>
        </div>
      )}
      <div
        style={{
          padding: "24px",
          display: "flex",
          gap: 20,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {screenshots.map((sc, i) => {
          const f = frameStyle(sc.device);
          return (
            <div
              key={i}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}
            >
              <div
                style={{
                  width: f.width,
                  height: f.height,
                  borderRadius: f.radius,
                  background: f.color,
                  border: "3px solid #333",
                  padding: f.notch ? 8 : 12,
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
                }}
              >
                {f.notch && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 90,
                      height: 26,
                      borderRadius: 20,
                      background: "#000",
                      zIndex: 1,
                    }}
                  />
                )}
                <img
                  src={sc.url}
                  alt={sc.label}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: f.notch ? 32 : 12,
                  }}
                />
              </div>
              <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>{sc.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
