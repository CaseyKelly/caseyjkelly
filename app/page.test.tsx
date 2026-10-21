import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("Home page", () => {
  it("shows the name as a single accessible heading", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { level: 1, name: "casey kelly" }),
    ).toBeInTheDocument();
  });

  it.each([
    ["Projects", "/projects", null],
    ["Resume", "/CaseyKellyResume.pdf", "_blank"],
    ["Github", "https://github.com/CaseyKelly", "_blank"],
    ["LinkedIn", "https://www.linkedin.com/in/caseyjkelly", "_blank"],
    ["Contact", "/contact", null],
  ])("links to %s", (name, href, target) => {
    render(<Home />);
    const nav = screen.getByRole("navigation", { name: "Primary" });

    const link = within(nav).getByRole("link", { name });
    expect(link).toHaveAttribute("href", href);
    if (target) {
      expect(link).toHaveAttribute("target", target);
    } else {
      expect(link).not.toHaveAttribute("target");
    }
  });

  it("has exactly the five primary links", () => {
    render(<Home />);
    const nav = screen.getByRole("navigation", { name: "Primary" });

    expect(within(nav).getAllByRole("link")).toHaveLength(5);
  });

  it("introduces Casey", () => {
    render(<Home />);

    expect(
      screen.getByText(/Senior software engineer in Denver, CO/),
    ).toBeInTheDocument();
  });
});
