import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { CloseIcon, SettingsIcon } from "../icons";

export default function SettingsModal({
  isOpen,
  onClose,
  refreshMs,
  onSaveSettings,
  onExport,
  onImport,
  importMsg,
}) {
  const [tempSeconds, setTempSeconds] = useState(30);
  const importFileRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTempSeconds(Math.round(refreshMs / 1000));
    }
  }, [isOpen, refreshMs]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const ms = Math.max(5, Number(tempSeconds)) * 1000;
    onSaveSettings(ms);
  };

  const handleImportClick = () => {
    importFileRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onImport(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="glass card modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="title"
          style={{ marginBottom: 20, justifyContent: "space-between" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <SettingsIcon width="20" height="20" />
            <span>设置</span>
          </div>
          <button
            className="icon-button"
            onClick={onClose}
            style={{ border: "none", background: "transparent" }}
          >
            <CloseIcon width="20" height="20" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: 20 }}>
            <label
              className="muted"
              style={{ display: "block", marginBottom: 8, fontSize: "14px" }}
            >
              自动刷新间隔 (秒) - 最少5秒
            </label>
            <input
              type="number"
              min="5"
              className="input"
              value={tempSeconds}
              onChange={(e) => setTempSeconds(e.target.value)}
            />
          </div>

          <div
            className="form-group"
            style={{
              marginBottom: 20,
              paddingTop: 16,
              borderTop: "1px solid var(--border)",
            }}
          >
            <label
              className="muted"
              style={{ display: "block", marginBottom: 12, fontSize: "14px" }}
            >
              数据备份与恢复
            </label>
            <div className="row" style={{ gap: 12 }}>
              <button
                type="button"
                className="button secondary"
                onClick={onExport}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                导出数据
              </button>
              <div style={{ flex: 1, position: "relative" }}>
                <button
                  type="button"
                  className="button secondary"
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                  }}
                  onClick={handleImportClick}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  导入数据
                </button>
                <input
                  ref={importFileRef}
                  type="file"
                  accept=".json"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </div>
            </div>
            {importMsg && (
              <div
                className="muted"
                style={{
                  fontSize: "12px",
                  marginTop: 8,
                  color: importMsg.includes("失败")
                    ? "var(--danger)"
                    : "var(--success)",
                  textAlign: "center",
                }}
              >
                {importMsg}
              </div>
            )}
          </div>

          <div className="row" style={{ gap: 12, marginTop: 24 }}>
            <button
              type="button"
              className="button secondary"
              onClick={onClose}
              style={{
                flex: 1,
                background: "rgba(0,0,0,0.04)",
                color: "var(--text)",
              }}
            >
              取消
            </button>
            <button type="submit" className="button" style={{ flex: 1 }}>
              保存设置
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
