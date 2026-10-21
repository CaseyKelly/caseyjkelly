import { expect, test } from "./fixtures";

test.describe("contact page", () => {
  test("has its page heading", async ({ page }) => {
    await page.goto("/contact");

    await expect(
      page.getByRole("heading", { level: 1, name: "Get in touch" }),
    ).toBeVisible();
  });

  test("links to every contact method", async ({ page }) => {
    await page.goto("/contact");

    const email = page.getByRole("link", { name: /Email/ });
    await expect(email).toHaveAttribute(
      "href",
      "mailto:casey.kelly819@gmail.com",
    );

    const linkedin = page.getByRole("link", { name: /LinkedIn/ });
    await expect(linkedin).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/caseyjkelly",
    );
    await expect(linkedin).toHaveAttribute("target", "_blank");

    const github = page.getByRole("link", { name: /Github/ });
    await expect(github).toHaveAttribute(
      "href",
      "https://github.com/CaseyKelly",
    );
    await expect(github).toHaveAttribute("target", "_blank");
  });

  test("navigates back home", async ({ page }) => {
    await page.goto("/contact");

    await page.getByRole("link", { name: "Back to home" }).click();
    await expect(page).toHaveURL("/");
  });
});
