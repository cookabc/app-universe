import {
  drawGlowDots,
  CanvasConfig,
} from "../src/components/canvas-dot-grid.utils";

// Naive implementation for comparison
const drawGlowDotsNaive = (
  ctx: CanvasRenderingContext2D,
  config: CanvasConfig,
  rows: number,
  cols: number,
  mouseX: number,
  mouseY: number,
) => {
  const dotRadius = config.dotSize / 2;
  const maxDist = config.maxDistance;
  const maxDistSq = maxDist * maxDist;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * config.gap + config.gap / 2;
      const y = row * config.gap + config.gap / 2;

      const dx = mouseX - x;
      const dy = mouseY - y;
      const distSq = dx * dx + dy * dy;

      if (distSq < maxDistSq) {
        const distance = Math.sqrt(distSq);
        const opacity = 1 - distance / maxDist;

        ctx.beginPath();
        ctx.arc(x, y, dotRadius * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `${config.glowColor}${opacity})`;
        ctx.fill();
      }
    }
  }
};

// Mock context
const createMockContext = () => {
  return {
    beginPath: () => {},
    moveTo: () => {},
    arc: () => {},
    fill: () => {},
    fillStyle: "",
  } as unknown as CanvasRenderingContext2D;
};

const runBenchmark = () => {
  const width = 1920;
  const height = 1080;
  const config = {
    dotSize: 2,
    gap: 24,
    maxDistance: 150,
    baseColor: "rgba(255, 255, 255, 0.2)",
    glowColor: "rgba(59, 130, 246, ",
  };

  const rows = Math.floor(height / config.gap);
  const cols = Math.floor(width / config.gap);

  const ctx = createMockContext();
  const iterations = 1000;

  // Test centered mouse
  const mouseX = width / 2;
  const mouseY = height / 2;

  console.log(`Benchmarking with grid ${cols}x${rows} (${rows * cols} dots)`);
  console.log(`Iterations: ${iterations}`);

  // Naive Benchmark
  const startNaive = performance.now();
  for (let i = 0; i < iterations; i++) {
    drawGlowDotsNaive(ctx, config, rows, cols, mouseX, mouseY);
  }
  const endNaive = performance.now();
  const timeNaive = endNaive - startNaive;

  // Optimized Benchmark
  const startOpt = performance.now();
  for (let i = 0; i < iterations; i++) {
    drawGlowDots(ctx, config, rows, cols, mouseX, mouseY);
  }
  const endOpt = performance.now();
  const timeOpt = endOpt - startOpt;

  console.log(`Naive Time: ${timeNaive.toFixed(2)}ms`);
  console.log(`Optimized Time: ${timeOpt.toFixed(2)}ms`);
  console.log(`Speedup: ${(timeNaive / timeOpt).toFixed(2)}x`);
};

runBenchmark();
