import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithRouter } from "../test-utils";
import Projects, { meta } from "./projects";

function projectCard(name: string): HTMLElement {
  const heading = screen.getByRole("heading", { level: 2, name });
  return heading.closest("article") as HTMLElement;
}

describe("Projects page", () => {
  it("sets its page title and canonical URL", () => {
    expect(meta()).toEqual(
      expect.arrayContaining([
        { title: "Projects | caseyjkelly.com" },
        {
          tagName: "link",
          rel: "canonical",
          href: "https://www.caseyjkelly.com/projects",
        },
      ]),
    );
  });

  it("loads only the first screenshot eagerly", () => {
    renderWithRouter(Projects);

    const [first, second] = screen.getAllByRole("img", { hidden: true });
    expect(first).toHaveAttribute("loading", "eager");
    expect(first).toHaveAttribute("fetchpriority", "high");
    expect(second).toHaveAttribute("loading", "lazy");
    expect(second).not.toHaveAttribute("fetchpriority");
    // a 640w variant for phones, the full 1280w image otherwise
    expect(second).toHaveAttribute(
      "srcset",
      "/projects/curbcut-640.webp 640w, /projects/curbcut.webp 1280w",
    );
  });

  it("lists every project", () => {
    renderWithRouter(Projects);

    expect(
      screen.getByRole("heading", { level: 1, name: "Projects" }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent),
    ).toEqual([
      "FantasyPhish",
      "Curbcut",
      "Kelso Kelly Music",
      "caseyjkelly.com",
    ]);
  });

  it.each([
    [
      "FantasyPhish",
      "Play at fantasyphish.com",
      "https://www.fantasyphish.com",
      "https://github.com/CaseyKelly/fantasyphish",
      "FantasyPhish landing page with the song picker",
    ],
    [
      "Kelso Kelly Music",
      "Visit kelsokellymusic.com",
      "https://www.kelsokellymusic.com",
      "https://github.com/CaseyKelly/kelso-kelly-site",
      "Kelso Kelly Music homepage",
    ],
  ])(
    "links %s to the live site and its source",
    (name, liveLabel, liveHref, sourceHref, imageAlt) => {
      renderWithRouter(Projects);
      const card = within(projectCard(name));

      const live = card.getByRole("link", { name: liveLabel });
      expect(live).toHaveAttribute("href", liveHref);
      expect(live).toHaveAttribute("target", "_blank");

      const source = card.getByRole("link", { name: "View source" });
      expect(source).toHaveAttribute("href", sourceHref);
      expect(source).toHaveAttribute("target", "_blank");

      // the screenshot link duplicates the live link, so it is hidden from
      // assistive tech and skipped by keyboard focus
      const image = card.getByAltText(imageAlt);
      const imageLink = image.closest("a");
      expect(imageLink).toHaveAttribute("href", liveHref);
      expect(imageLink).toHaveAttribute("aria-hidden", "true");
      expect(imageLink).toHaveAttribute("tabindex", "-1");
    },
  );

  it.each([
    [
      "Curbcut",
      "https://github.com/CaseyKelly/Curbcut",
      "Curbcut banner over a concept mockup of a scan in the terminal",
    ],
    [
      "caseyjkelly.com",
      "https://github.com/CaseyKelly/caseyjkelly",
      "caseyjkelly.com home page: the name over a constellation",
    ],
  ])(
    "links %s, which has no separate live site, only to its source",
    (name, sourceHref, imageAlt) => {
      renderWithRouter(Projects);
      const card = within(projectCard(name));

      expect(
        card.queryByRole("link", { name: /^(Play at|Visit) / }),
      ).not.toBeInTheDocument();
      const source = card.getByRole("link", { name: "View source" });
      expect(source).toHaveAttribute("href", sourceHref);
      expect(source).toHaveAttribute("target", "_blank");

      const imageLink = card.getByAltText(imageAlt).closest("a");
      expect(imageLink).toHaveAttribute("href", sourceHref);
      expect(imageLink).toHaveAttribute("aria-hidden", "true");
    },
  );

  it("links to Upasana's GitHub from the Curbcut card", () => {
    renderWithRouter(Projects);
    const card = within(projectCard("Curbcut"));

    const link = card.getByRole("link", { name: "@UpasanaAjbani" });
    expect(link).toHaveAttribute("href", "https://github.com/UpasanaAjbani");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("marks only Curbcut as in progress", () => {
    renderWithRouter(Projects);

    expect(
      within(projectCard("Curbcut")).getByText("Currently building"),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Currently building")).toHaveLength(1);
  });

  it("shows FantasyPhish usage stats", () => {
    renderWithRouter(Projects);
    const card = within(projectCard("FantasyPhish"));

    for (const [value, label] of [
      ["200+", "players"],
      ["600+", "entries"],
      ["8,000+", "song picks"],
      ["46", "shows"],
    ]) {
      const term = card.getByText(label);
      expect(term.tagName).toBe("DT");
      expect(term.nextElementSibling).toHaveTextContent(value);
    }
  });

  it("lists each project's stack", () => {
    renderWithRouter(Projects);

    const stack = within(
      within(projectCard("Kelso Kelly Music")).getByRole("list", {
        name: "Built with",
      }),
    );
    expect(stack.getByText("Google APIs")).toBeInTheDocument();
    expect(stack.getAllByRole("listitem")).toHaveLength(9);
  });
});
