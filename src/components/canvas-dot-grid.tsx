"use client";

import type React from "react";
import { useEffect, useRef } from "react";
import {
  type CanvasConfig,
  drawBaseDots,
  drawGlowDots,
} from "./canvas-dot-grid.utils";

interface CanvasDotGridProps {
  className?: string;
}

export const CanvasDotGrid: React.FC<CanvasDotGridProps> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const config: CanvasConfig = {
      dotSize: 2,
      gap: 24,
      maxDistance: 150,
      baseColor: "rgba(255, 255, 255, 0.2)",
      glowColor: "rgba(59, 130, 246, ",
    };

    let rows = 0;
    let cols = 0;
    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      rows = Math.floor(canvas.height / config.gap);
      cols = Math.floor(canvas.width / config.gap);
    };

    const drawDots = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawBaseDots(ctx, config, rows, cols);

      drawGlowDots(
        ctx,
        config,
        rows,
        cols,
        mousePosition.current.x,
        mousePosition.current.y,
      );

      animationFrameId = requestAnimationFrame(drawDots);
    };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mousePosition.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", resizeCanvas);

    resizeCanvas();
    drawDots();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`z-0 fixed left-0 top-0 right-0 bottom-0 pointer-events-none ${className || ""}`}
      style={{ touchAction: "none" }}
    />
  );
};
