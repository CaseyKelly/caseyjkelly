import { expect, test } from "./fixtures";

const projects = [
  {
    name: "FantasyPhish",
    live: "https://www.fantasyphish.com",
    source: "https://github.com/CaseyKelly/fantasyphish",
    image: "FantasyPhish landing page with the song picker",
  },
  {
    name: "Kelso Kelly Music",
    live: "https://www.kelsokellymusic.com",
    source: "https://github.com/CaseyKelly/kelso-kelly-site",
    image: "Kelso Kelly Music homepage",
  },
];

test.describe("projects page", () => {
  test("has its own title", async ({ page }) => {
    await page.goto("/projects");

    await expect(page).toHaveTitle("Projects | caseyjkelly.com");
  });

  for (const project of projects) {
    test(`shows ${project.name} with working links`, async ({ page }) => {
      await page.goto("/projects");

      const card = page.locator("article", {
        has: page.getByRole("heading", { level: 2, name: project.name }),
      });
      await expect(card).toBeVisible();

      const live = card.getByRole("link", { name: /^(Play at|Visit) / });
      await expect(live).toHaveAttribute("href", project.live);
      await expect(live).toHaveAttribute("target", "_blank");

      const source = card.getByRole("link", { name: "View source" });
      await expect(source).toHaveAttribute("href", project.source);
      await expect(source).toHaveAttribute("target", "_blank");
    });

    test(`loads the ${project.name} screenshot through next/image`, async ({
      page,
    }) => {
      await page.goto("/projects");

      const image = page.getByAltText(project.image);
      await expect(image).toBeVisible();
      // served by the image optimizer, not straight from /public
      await expect(image).toHaveAttribute("src", /\/_next\/image\?url=/);
      await expect
        .poll(() => image.evaluate((img: HTMLImageElement) => img.naturalWidth))
        .toBeGreaterThan(0);
    });
  }

  test("shows FantasyPhish usage stats", async ({ page }) => {
    await page.goto("/projects");

    const card = page.locator("article", {
      has: page.getByRole("heading", { name: "FantasyPhish" }),
    });
    await expect(card.locator("dt")).toHaveText([
      "players",
      "entries",
      "song picks",
      "shows",
    ]);
  });
});
