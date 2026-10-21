import { act, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderWithRouter } from "../test-utils";
import { Navigation } from "./nav";

describe("Navigation", () => {
  it("links back to the homepage", () => {
    renderWithRouter(Navigation);

    expect(screen.getByRole("link", { name: "Back to home" })).toHaveAttribute(
      "href",
      "/",
    );
  });

  it("adds a backdrop once the header scrolls out of view", () => {
    type Report = (entries: Partial<IntersectionObserverEntry>[]) => void;
    let report: Report = () => {};
    const disconnect = vi.fn();
    // only the observer watching the <header> belongs to Navigation
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(private callback: Report) {}
        observe(target: Element): void {
          if (target.tagName === "HEADER") {
            report = this.callback;
            this.disconnect = disconnect;
          }
        }
        unobserve(): void {}
        disconnect(): void {}
      },
    );

    const { container, unmount } = renderWithRouter(Navigation);
    const bar = container.querySelector("header > div");
    expect(bar).toHaveClass("border-transparent");

    act(() => report([{ isIntersecting: false }]));
    expect(bar).toHaveClass("backdrop-blur");
    expect(bar).not.toHaveClass("border-transparent");

    act(() => report([{ isIntersecting: true }]));
    expect(bar).toHaveClass("border-transparent");

    unmount();
    expect(disconnect).toHaveBeenCalled();
  });
});
