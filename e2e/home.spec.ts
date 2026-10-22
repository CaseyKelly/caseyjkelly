import { expect, test } from "./fixtures";

test.describe("homepage", () => {
  test("renders the name, intro and primary navigation", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(
      "Casey Kelly | Senior Software Engineer in Denver",
    );
    await expect(
      page.getByRole("heading", { level: 1, name: "casey kelly" }),
    ).toBeVisible();
    await expect(
      page.getByText(/Senior software engineer in Denver, CO/),
    ).toBeVisible();

    const nav = page.getByRole("navigation", { name: "Primary" });
    await expect(nav.getByRole("link")).toHaveText([
      "Projects",
      "Resume",
      "Github",
      "LinkedIn",
      "Contact",
    ]);
    await expect(nav.getByRole("link", { name: "Resume" })).toHaveAttribute(
      "href",
      "/CaseyKellyResume.pdf",
    );
    await expect(nav.getByRole("link", { name: "Github" })).toHaveAttribute(
      "href",
      "https://github.com/CaseyKelly",
    );
    await expect(nav.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/caseyjkelly",
    );
  });

  test("uses the Cal Sans display font for the name", async ({ page }) => {
    await page.goto("/");

    const heading = page.getByRole("heading", { level: 1 });
    const family = await heading.evaluate(
      (el) => getComputedStyle(el).fontFamily,
    );
    const normalize = (name: string) => name.toLowerCase().replace(/\s/g, "");
    expect(normalize(family)).toContain("calsans");
    await page.evaluate(() => document.fonts.ready);
    const loaded = await page.evaluate(() =>
      Array.from(document.fonts).some(
        (font) =>
          font.family.toLowerCase().replace(/\s/g, "").includes("calsans") &&
          font.status === "loaded",
      ),
    );
    expect(loaded).toBe(true);
  });

  test("draws the starfield", async ({ page }) => {
    await page.goto("/");

    const canvas = page.locator("canvas");
    await expect(canvas).toHaveCount(1);
    const box = await canvas.boundingBox();
    expect(box?.width).toBeGreaterThan(0);
    expect(box?.height).toBeGreaterThan(0);

    // some pixel has been painted once the intro has started
    await expect
      .poll(() =>
        canvas.evaluate((el: HTMLCanvasElement) => {
          const ctx = el.getContext("2d");
          if (!ctx) return false;
          const { data } = ctx.getImageData(0, 0, el.width, el.height);
          for (let i = 3; i < data.length; i += 4) {
            if (data[i] > 0) return true;
          }
          return false;
        }),
      )
      .toBe(true);
  });

  test("still shows everything with reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    // the fade-in animations are skipped, so content is visible immediately
    await expect(page.getByRole("navigation", { name: "Primary" })).toHaveCSS(
      "opacity",
      "1",
    );
    await expect(page.locator("h1 span").first()).toHaveCSS("opacity", "1");
  });

  test("reveals the page and cycles the tagline", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("link", { name: "Contact" })).toBeVisible();
    await expect(page.locator("[data-intro]")).toHaveCSS("opacity", "1");
    const specialty = page.locator("[data-specialty]");
    await expect(specialty).toHaveText("accessible interfaces");
    // the next specialty decodes in a few seconds after the intro
    await expect(specialty).toHaveText("reliable backend services", {
      timeout: 10_000,
    });
  });

  test("navigates to Projects and back", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: "Projects" }).click();
    await expect(page).toHaveURL("/projects");
    await expect(
      page.getByRole("heading", { level: 1, name: "Projects" }),
    ).toBeVisible();
    // a client-side navigation updates the route's meta tags too
    await expect(page).toHaveTitle("Projects | caseyjkelly.com");

    await page.getByRole("link", { name: "Back to home" }).click();
    await expect(page).toHaveURL("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("navigates to Contact", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: "Contact" }).click();
    await expect(page).toHaveURL("/contact");
    await expect(
      page.getByRole("heading", { level: 1, name: "Get in touch" }),
    ).toBeVisible();
  });

  test("opens the resume in a new tab", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("link", { name: "Resume" })).toHaveAttribute(
      "target",
      "_blank",
    );
    const response = await page.request.get("/CaseyKellyResume.pdf");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/pdf");
    const body = await response.body();
    expect(body.subarray(0, 5).toString()).toBe("%PDF-");
  });
});
