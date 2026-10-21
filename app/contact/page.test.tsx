import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Contact from "./page";

describe("Contact page", () => {
  it("has a heading and a way back home", () => {
    render(<Contact />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Get in touch" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to home" })).toHaveAttribute(
      "href",
      "/",
    );
  });

  it.each([
    [/LinkedIn/, "https://www.linkedin.com/in/caseyjkelly", "_blank"],
    [/Email/, "mailto:casey.kelly819@gmail.com", null],
    [/Github/, "https://github.com/CaseyKelly", "_blank"],
  ])("links to %s", (name, href, target) => {
    render(<Contact />);

    const link = screen.getByRole("link", { name });
    expect(link).toHaveAttribute("href", href);
    if (target) {
      expect(link).toHaveAttribute("target", target);
    } else {
      expect(link).not.toHaveAttribute("target");
    }
  });
});
