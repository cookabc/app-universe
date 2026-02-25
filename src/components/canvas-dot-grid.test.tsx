import { expect, test, mock, beforeAll } from "bun:test";
import { GlobalRegistrator } from "@happy-dom/global-registrator";
import * as React from "react";
import { render } from "@testing-library/react";

beforeAll(() => {
  GlobalRegistrator.register();
});

test("CanvasDotGrid renders and calls draw functions", async () => {
    // Mock utils
    const spyBase = mock(() => {});
    const spyGlow = mock(() => {});

    mock.module('./canvas-dot-grid.utils', () => {
        return {
            drawBaseDots: spyBase,
            drawGlowDots: spyGlow,
        };
    });

    const mockContext = {
        clearRect: mock(),
        beginPath: mock(),
        moveTo: mock(),
        arc: mock(),
        fill: mock(),
        fillStyle: "",
    } as unknown as CanvasRenderingContext2D;

    Object.defineProperty(window.HTMLCanvasElement.prototype, 'getContext', {
      value: mock(() => mockContext),
      writable: true,
      configurable: true,
    });

    // Mock rAF
    window.requestAnimationFrame = mock(() => 1);
    window.cancelAnimationFrame = mock();

    // Import component dynamically
    const { CanvasDotGrid } = await import("./canvas-dot-grid");

    const result = render(React.createElement(CanvasDotGrid, {}));
    const { unmount } = result;

    // Check if getContext was called
    await new Promise(resolve => setTimeout(resolve, 50));

    expect(window.HTMLCanvasElement.prototype.getContext).toHaveBeenCalled();
    expect(spyBase).toHaveBeenCalled();
    expect(spyGlow).toHaveBeenCalled();

    unmount();
    expect(window.cancelAnimationFrame).toHaveBeenCalled();
});
