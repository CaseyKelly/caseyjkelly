import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithRouter } from "../test-utils";
import NotFound, { meta } from "./not-found";

describe("Not found page", () => {
  it("says the page doesn't exist and links home", () => {
    renderWithRouter(NotFound);

    expect(
      screen.getByRole("heading", { level: 1, name: "Page not found" }),
    ).toBeInTheDocument();
    for (const link of screen.getAllByRole("link", { name: /home/i })) {
      expect(link).toHaveAttribute("href", "/");
    }
  });

  it("keeps itself out of search results", () => {
    expect(meta()).toContainEqual({ name: "robots", content: "noindex" });
  });
});
