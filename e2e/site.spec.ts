import { expect, test } from "./fixtures";

const pages = ["/", "/projects", "/contact"];

test.describe("whole site", () => {
  for (const path of pages) {
    test(`${path} fits the viewport without sideways scrolling`, async ({
      page,
    }) => {
      await page.goto(path);
      await page.waitForLoadState("networkidle");

      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });

    test(`${path} can be navigated by keyboard`, async ({ page }) => {
      await page.goto(path);

      await page.keyboard.press("Tab");
      const focused = page.locator(":focus");
      await expect(focused).toHaveCount(1);
      expect(await focused.evaluate((el) => el.tagName)).toBe("A");
    });
  }

  test("publishes SEO and social metadata", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /Senior software engineer in Denver, CO/,
    );
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      "Casey Kelly-Ajbani | Senior Software Engineer in Denver",
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      "https://www.caseyjkelly.com/og-image.png",
    );
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      "content",
      "summary_large_image",
    );
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /index, follow/,
    );
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });

  for (const path of pages) {
    test(`${path} has exactly one canonical URL`, async ({ page }) => {
      await page.goto(path);

      const canonical = page.locator('link[rel="canonical"]');
      await expect(canonical).toHaveCount(1);
      await expect(canonical).toHaveAttribute(
        "href",
        `https://www.caseyjkelly.com${path}`,
      );
    });
  }

  test("lists every page in the sitemap", async ({ request }) => {
    const response = await request.get("/sitemap.xml");

    expect(response.status()).toBe(200);
    const body = await response.text();
    for (const path of pages) {
      expect(body).toContain(`<loc>https://www.caseyjkelly.com${path}</loc>`);
    }
  });

  test("points crawlers at the sitemap", async ({ request }) => {
    const response = await request.get("/robots.txt");

    expect(response.status()).toBe(200);
    expect(await response.text()).toContain(
      "Sitemap: https://www.caseyjkelly.com/sitemap.xml",
    );
  });

  test("serves the favicon", async ({ request }) => {
    const response = await request.get("/favicon.png");

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/png");
  });

  test("serves the social preview image", async ({ request }) => {
    const response = await request.get("/og-image.png");

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/png");
  });

  test("describes Casey as a Person for search engines", async ({ page }) => {
    await page.goto("/");

    const json = await page
      .locator('script[type="application/ld+json"]')
      .textContent();
    expect(JSON.parse(json ?? "")).toMatchObject({
      "@type": "Person",
      name: "Casey Kelly-Ajbani",
      alternateName: "Casey Kelly",
      url: "https://www.caseyjkelly.com",
      sameAs: expect.arrayContaining(["https://github.com/CaseyKelly"]),
    });
  });

  test("returns a 404 for unknown pages", async ({ page }) => {
    const response = await page.goto("/does-not-exist/at/all");

    expect(response?.status()).toBe(404);
    await expect(page).toHaveTitle("Page not found | caseyjkelly.com");
    await expect(
      page.getByRole("heading", { level: 1, name: "Page not found" }),
    ).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex",
    );

    // the page hydrates at any URL, so its links work client-side
    await page.getByRole("link", { name: "Back to home" }).last().click();
    await expect(page).toHaveURL("/");
    await expect(page).toHaveTitle(
      "Casey Kelly-Ajbani | Senior Software Engineer in Denver",
    );
  });
});
