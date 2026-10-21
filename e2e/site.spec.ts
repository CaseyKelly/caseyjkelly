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
      "Casey Kelly",
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      "https://caseyjkelly.com/favicon.png",
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

  test("serves the favicon", async ({ request }) => {
    const response = await request.get("/favicon.png");

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/png");
  });

  test("returns a 404 for unknown pages", async ({ page }) => {
    const response = await page.goto("/does-not-exist");

    expect(response?.status()).toBe(404);
    await expect(page.getByText("This page could not be found.")).toBeVisible();
  });
});

test.describe("/api/incr", () => {
  test("only accepts POST", async ({ request }) => {
    const response = await request.get("/api/incr");

    expect(response.status()).toBe(405);
    expect(await response.text()).toBe("use POST");
  });

  test("rejects non-JSON bodies", async ({ request }) => {
    const response = await request.post("/api/incr", {
      headers: { "Content-Type": "text/plain" },
      data: "hello",
    });

    expect(response.status()).toBe(400);
  });
});
