import { act, render } from "@testing-library/react";
import { type Mock, beforeEach, describe, expect, it, vi } from "vitest";
import Constellation from "./constellation";

function stubContext() {
  const ctx = {
    setTransform: vi.fn(),
    clearRect: vi.fn(),
    fill: vi.fn(),
    stroke: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    createLinearGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
  };
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
    ctx as unknown as CanvasRenderingContext2D,
  );
  return ctx;
}

function stubReducedMotion(initial: boolean) {
  let onChange: ((event: MediaQueryListEvent) => void) | undefined;
  const removeEventListener = vi.fn();
  vi.spyOn(window, "matchMedia").mockReturnValue({
    matches: initial,
    addEventListener: (_: string, listener: typeof onChange) => {
      onChange = listener;
    },
    removeEventListener,
  } as unknown as MediaQueryList);
  return {
    change: (matches: boolean) =>
      onChange?.({ matches } as MediaQueryListEvent),
    removeEventListener,
  };
}

describe("Constellation", () => {
  let requestFrame: Mock<typeof window.requestAnimationFrame>;
  let cancelFrame: Mock<typeof window.cancelAnimationFrame>;

  beforeEach(() => {
    vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(800);
    vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(600);
    requestFrame = vi.fn<typeof window.requestAnimationFrame>(() => 42);
    cancelFrame = vi.fn<typeof window.cancelAnimationFrame>();
    vi.spyOn(window, "requestAnimationFrame").mockImplementation(requestFrame);
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation(cancelFrame);
  });

  it("is hidden from assistive tech", () => {
    stubContext();
    stubReducedMotion(false);

    const { container } = render(<Constellation className="sky" />);

    const root = container.firstElementChild;
    expect(root).toHaveAttribute("aria-hidden", "true");
    expect(root).toHaveClass("sky");
    expect(root?.querySelector("canvas")).toBeInTheDocument();
  });

  it("does nothing when the canvas has no 2D context", () => {
    stubReducedMotion(false);

    expect(() => render(<Constellation />)).not.toThrow();
    expect(requestFrame).not.toHaveBeenCalled();
  });

  it("sizes the canvas to its container, capped at 2x pixel density", () => {
    const ctx = stubContext();
    stubReducedMotion(false);
    vi.spyOn(window, "devicePixelRatio", "get").mockReturnValue(3);

    const { container } = render(<Constellation />);

    const canvas = container.querySelector("canvas") as HTMLCanvasElement;
    expect(canvas.width).toBe(1600);
    expect(canvas.height).toBe(1200);
    expect(canvas.style.width).toBe("800px");
    expect(canvas.style.height).toBe("600px");
    expect(ctx.setTransform).toHaveBeenCalledWith(2, 0, 0, 2, 0, 0);
  });

  it("animates when motion is allowed", () => {
    const ctx = stubContext();
    stubReducedMotion(false);

    render(<Constellation />);
    expect(requestFrame).toHaveBeenCalledTimes(1);

    // run one frame of the loop: it draws the stars and schedules the next
    const loop = requestFrame.mock.calls[0][0];
    act(() => loop(performance.now()));
    expect(ctx.clearRect).toHaveBeenCalledWith(0, 0, 800, 600);
    expect(ctx.fill).toHaveBeenCalled();
    expect(requestFrame).toHaveBeenCalledTimes(2);
  });

  it("links stars to the cursor and launches shooting stars", () => {
    const ctx = stubContext();
    stubReducedMotion(false);
    // put every star on the same spot so they all link up
    vi.spyOn(Math, "random").mockReturnValue(0.99);
    render(<Constellation />);
    const loop = requestFrame.mock.calls[0][0];

    act(() => {
      window.dispatchEvent(
        new PointerEvent("pointermove", { clientX: 400, clientY: 300 }),
      );
    });
    // well past the intro and the first meteor
    act(() => loop(performance.now() + 10_000));

    expect(ctx.stroke).toHaveBeenCalled();
    expect(ctx.createLinearGradient).toHaveBeenCalled();
  });

  it("draws a single static frame when the user prefers reduced motion", () => {
    const ctx = stubContext();
    stubReducedMotion(true);

    render(<Constellation />);

    expect(ctx.clearRect).toHaveBeenCalledTimes(1);
    expect(ctx.fill).toHaveBeenCalled();
    expect(requestFrame).not.toHaveBeenCalled();
  });

  it("follows live changes to the reduced-motion preference", () => {
    const ctx = stubContext();
    const motion = stubReducedMotion(false);
    render(<Constellation />);
    expect(requestFrame).toHaveBeenCalledTimes(1);

    act(() => motion.change(true));
    expect(cancelFrame).toHaveBeenCalledWith(42);
    expect(ctx.clearRect).toHaveBeenCalledTimes(1);

    act(() => motion.change(false));
    expect(requestFrame).toHaveBeenCalledTimes(2);
  });

  it("shows the cursor spotlight while a pointer is over the page", () => {
    stubContext();
    stubReducedMotion(true);
    const { container } = render(<Constellation />);
    const spotlight = container.querySelector("canvas + div") as HTMLDivElement;

    act(() => {
      window.dispatchEvent(
        new PointerEvent("pointermove", { clientX: 120, clientY: 80 }),
      );
    });
    expect(spotlight.style.opacity).toBe("1");
    expect(spotlight.style.getPropertyValue("--x")).toBe("120px");
    expect(spotlight.style.getPropertyValue("--y")).toBe("80px");

    // a mouse stays put after a click
    act(() => {
      window.dispatchEvent(
        new PointerEvent("pointerup", { pointerType: "mouse" }),
      );
    });
    expect(spotlight.style.opacity).toBe("1");

    // a finger lifts off the screen
    act(() => {
      window.dispatchEvent(
        new PointerEvent("pointerup", { pointerType: "touch" }),
      );
    });
    expect(spotlight.style.opacity).toBe("0");

    act(() => {
      window.dispatchEvent(new PointerEvent("pointermove", { clientX: 1 }));
      document.documentElement.dispatchEvent(new PointerEvent("pointerleave"));
    });
    expect(spotlight.style.opacity).toBe("0");
  });

  it("redraws a static frame on resize under reduced motion", () => {
    const ctx = stubContext();
    stubReducedMotion(true);
    render(<Constellation />);

    act(() => {
      window.dispatchEvent(new Event("resize"));
    });

    expect(ctx.clearRect).toHaveBeenCalledTimes(2);
  });

  it("stops animating and removes its listeners on unmount", () => {
    stubContext();
    const motion = stubReducedMotion(false);
    const removeWindowListener = vi.spyOn(window, "removeEventListener");

    const { unmount } = render(<Constellation />);
    unmount();

    expect(cancelFrame).toHaveBeenCalledWith(42);
    expect(motion.removeEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function),
    );
    const removed = removeWindowListener.mock.calls.map(([type]) => type);
    expect(removed).toEqual(
      expect.arrayContaining(["resize", "pointermove", "pointerup"]),
    );
  });
});
