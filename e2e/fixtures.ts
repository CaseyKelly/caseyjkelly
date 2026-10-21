import { test as base, expect } from "@playwright/test";

// Fails any test whose page throws, logs a console error, or requests an
// asset that doesn't load, which is how hydration mismatches, broken client
// bundles and moved assets usually show up after a dependency upgrade.
export const test = base.extend<{ pageErrors: string[] }>({
  pageErrors: [
    async ({ page }, use) => {
      // Vercel Analytics' script is only served on Vercel; elsewhere it 404s
      await page.route("**/_vercel/insights/**", (route) =>
        route.fulfill({ contentType: "text/javascript", body: "" }),
      );

      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => {
        // reported with its URL by the response listener below
        if (message.text().startsWith("Failed to load resource")) return;
        if (message.type() === "error") errors.push(message.text());
      });
      page.on("response", (response) => {
        // page-level statuses (e.g. the 404 page) are asserted by the tests
        if (response.request().isNavigationRequest()) return;
        if (response.status() >= 400) {
          errors.push(`${response.status()} ${response.url()}`);
        }
      });
      // requests that never got a response (connection reset, DNS, CORS...)
      page.on("requestfailed", (request) => {
        if (request.isNavigationRequest()) return;
        const reason = request.failure()?.errorText ?? "unknown error";
        // the browser cancels in-flight requests (e.g. prefetches) when the
        // page navigates away; that isn't a broken asset
        if (reason === "net::ERR_ABORTED") return;
        errors.push(`${reason} ${request.url()}`);
      });

      await use(errors);
      expect(errors, "page errors, console errors or failed requests").toEqual(
        [],
      );
    },
    { auto: true },
  ],
});

export { expect };
