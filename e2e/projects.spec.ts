import { expect, test } from "./fixtures";

const projects = [
  {
    name: "FantasyPhish",
    live: "https://www.fantasyphish.com",
    source: "https://github.com/CaseyKelly/fantasyphish",
    image: "FantasyPhish landing page with the song picker",
    file: "fantasyphish",
  },
  {
    name: "Kelso Kelly Music",
    live: "https://www.kelsokellymusic.com",
    source: "https://github.com/CaseyKelly/kelso-kelly-site",
    image: "Kelso Kelly Music homepage",
    file: "kelso-kelly",
  },
  {
    name: "Curbcut",
    live: null,
    source: "https://github.com/CaseyKelly/Curbcut",
    image: "Curbcut banner over a concept mockup of a scan in the terminal",
    file: "curbcut",
  },
  {
    name: "caseyjkelly.com",
    live: null,
    source: "https://github.com/CaseyKelly/caseyjkelly",
    image: "caseyjkelly.com home page: the name over a constellation",
    file: "caseyjkelly",
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
      if (project.live) {
        await expect(live).toHaveAttribute("href", project.live);
        await expect(live).toHaveAttribute("target", "_blank");
      } else {
        await expect(live).toHaveCount(0);
      }

      const source = card.getByRole("link", { name: "View source" });
      await expect(source).toHaveAttribute("href", project.source);
      await expect(source).toHaveAttribute("target", "_blank");
    });

    test(`loads the ${project.name} screenshot at the right size`, async ({
      page,
    }) => {
      await page.goto("/projects");

      const image = page.getByAltText(project.image);
      await image.scrollIntoViewIfNeeded();
      await expect(image).toBeVisible();
      // one of the two srcset widths, picked for the screen's pixel density
      await expect
        .poll(() => image.evaluate((img: HTMLImageElement) => img.currentSrc))
        .toMatch(new RegExp(`/projects/${project.file}(-640)?\\.webp$`));
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

test("fetches only the first screenshot up front", async ({ page }) => {
  await page.goto("/projects");

  const images = page.locator("article img");
  await expect(images.first()).toHaveAttribute("loading", "eager");
  await expect(images.first()).toHaveAttribute("fetchpriority", "high");
  await expect(images.nth(1)).toHaveAttribute("loading", "lazy");
});
