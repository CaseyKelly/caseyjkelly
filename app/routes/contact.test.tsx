import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithRouter } from "../test-utils";
import Contact, { meta } from "./contact";

describe("Contact page", () => {
  it("has a heading and a way back home", () => {
    renderWithRouter(Contact);

    expect(
      screen.getByRole("heading", { level: 1, name: "Get in touch" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to home" })).toHaveAttribute(
      "href",
      "/",
    );
  });

  it("has its own title and description", () => {
    expect(meta()).toEqual(
      expect.arrayContaining([
        { title: "Contact | caseyjkelly.com" },
        {
          name: "description",
          content:
            "Get in touch with Casey Kelly by email, LinkedIn or GitHub.",
        },
      ]),
    );
  });

  it.each([
    [/LinkedIn/, "https://www.linkedin.com/in/caseyjkelly", "_blank"],
    [/Email/, "mailto:casey.kelly819@gmail.com", null],
    [/Github/, "https://github.com/CaseyKelly", "_blank"],
  ])("links to %s", (name, href, target) => {
    renderWithRouter(Contact);

    const link = screen.getByRole("link", { name });
    expect(link).toHaveAttribute("href", href);
    if (target) {
      expect(link).toHaveAttribute("target", target);
    } else {
      expect(link).not.toHaveAttribute("target");
    }
  });
});
