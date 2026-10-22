import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithRouter } from "../test-utils";
import Home, { meta } from "./home";

describe("Home page", () => {
  it("shows the name as a single accessible heading", () => {
    renderWithRouter(Home);

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
    renderWithRouter(Home);
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
    renderWithRouter(Home);
    const nav = screen.getByRole("navigation", { name: "Primary" });

    expect(within(nav).getAllByRole("link")).toHaveLength(5);
  });

  it("is titled with Casey's name and canonical at the site root", () => {
    expect(meta()).toEqual(
      expect.arrayContaining([
        { title: "Casey Kelly | Senior Software Engineer in Denver" },
        {
          tagName: "link",
          rel: "canonical",
          href: "https://www.caseyjkelly.com/",
        },
      ]),
    );
  });

  it("introduces Casey", () => {
    renderWithRouter(Home);

    expect(
      screen.getByText(/Senior software engineer in Denver, CO/),
    ).toBeInTheDocument();
  });

  it("keeps the animated tagline out of the accessibility tree", () => {
    renderWithRouter(Home);

    const tagline = screen.getByText("accessible interfaces").closest("p");
    expect(tagline).toHaveAttribute("aria-hidden", "true");
  });
});
