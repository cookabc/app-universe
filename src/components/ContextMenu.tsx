"use client";

import { useEffect, useRef, useState } from "react";

interface ContextMenuProps {
  x: number;
  y: number;
  nodeType: "folder" | "stock" | null;
  onAddFolder: () => void;
  onAddStock: () => void;
  onRename: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export default function ContextMenu({
  x,
  y,
  nodeType,
  onAddFolder,
  onAddStock,
  onRename,
  onDelete,
  onClose,
}: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [isClosing, setIsClosing] = useState(false);

  function handleClose() {
    setIsClosing(true);
  }

  useEffect(() => {
    if (isClosing) return;
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        handleClose();
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        handleClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isClosing]);

  useEffect(() => {
    if (!isClosing) return;
    const timer = setTimeout(() => {
      onClose();
    }, 150);
    return () => clearTimeout(timer);
  }, [isClosing, onClose]);

  const adjustedX = Math.min(x, window.innerWidth - 200);
  const adjustedY = Math.min(y, window.innerHeight - 250);

  return (
    <div
      ref={menuRef}
      className={`context-menu${isClosing ? " is-closing" : ""}`}
      style={{
        left: adjustedX,
        top: adjustedY,
      }}
    >
      <div className="context-menu-section">
        <button
          className="context-menu-item"
          onClick={() => {
            onAddFolder();
            handleClose();
          }}
        >
          <span className="context-menu-icon">📁</span>
          <span className="context-menu-label">新建文件夹</span>
        </button>
        <button
          className="context-menu-item"
          onClick={() => {
            onAddStock();
            handleClose();
          }}
        >
          <span className="context-menu-icon">📈</span>
          <span className="context-menu-label">添加股票</span>
        </button>
      </div>

      {nodeType && (
        <>
          <div className="context-menu-divider" />
          <div className="context-menu-section">
            <button
              className="context-menu-item"
              onClick={() => {
                onRename();
                handleClose();
              }}
            >
              <span className="context-menu-icon">✏️</span>
              <span className="context-menu-label">重命名</span>
            </button>
            <button
              className="context-menu-item danger"
              onClick={() => {
                onDelete();
                handleClose();
              }}
            >
              <span className="context-menu-icon">🗑️</span>
              <span className="context-menu-label">删除</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
