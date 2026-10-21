import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useMDXComponents } from "./mdx-components";

describe("useMDXComponents", () => {
  it("styles h1 and h2", () => {
    const { h1: H1, h2: H2 } = useMDXComponents({});
    render(
      <>
        <H1>Title</H1>
        <H2>Section</H2>
      </>,
    );

    expect(screen.getByRole("heading", { level: 1 })).toHaveClass("text-3xl");
    expect(screen.getByRole("heading", { level: 2 })).toHaveClass(
      "text-zinc-50",
    );
  });

  it("lets passed-in components override the defaults", () => {
    const custom = () => null;
    const components = useMDXComponents({ h1: custom, p: custom });

    expect(components.h1).toBe(custom);
    expect(components.p).toBe(custom);
    expect(components.h2).toBeTypeOf("function");
  });
});
