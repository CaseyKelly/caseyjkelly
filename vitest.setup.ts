import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(() => {
  cleanup();
});

// jsdom has no canvas, Path2D, IntersectionObserver or matchMedia. These are
// inert defaults so any page that mounts the starfield or the nav renders;
// tests that care about them install their own spies.
class Path2DStub {
  moveTo(): void {}
  lineTo(): void {}
  arc(): void {}
}
vi.stubGlobal("Path2D", Path2DStub);

HTMLCanvasElement.prototype.getContext = function getContext() {
  return null;
} as unknown as HTMLCanvasElement["getContext"];

class IntersectionObserverStub {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}
vi.stubGlobal("IntersectionObserver", IntersectionObserverStub);

if (!window.matchMedia) {
  window.matchMedia = (query: string): MediaQueryList =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
}
