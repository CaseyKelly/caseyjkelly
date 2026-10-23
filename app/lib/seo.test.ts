import { describe, expect, it } from "vitest";
import { SITE_URL, seo } from "./seo";

describe("seo", () => {
  it("builds the canonical and Open Graph URL from the page path", () => {
    const tags = seo({ title: "Projects", path: "/projects" });

    expect(tags).toContainEqual({
      tagName: "link",
      rel: "canonical",
      href: `${SITE_URL}/projects`,
    });
    expect(tags).toContainEqual({
      property: "og:url",
      content: `${SITE_URL}/projects`,
    });
  });

  it("uses the www origin that caseyjkelly.com redirects to", () => {
    expect(SITE_URL).toBe("https://www.caseyjkelly.com");
  });

  it("falls back to the site description", () => {
    const tags = seo({ title: "Casey Kelly-Ajbani", path: "/" });

    expect(tags).toContainEqual({
      name: "description",
      content: expect.stringMatching(/^Senior software engineer in Denver/),
    });
  });

  it("uses one title and description for the page and its social cards", () => {
    const tags = seo({
      title: "Contact",
      path: "/contact",
      description: "Say hi.",
    });

    expect(tags).toContainEqual({ title: "Contact" });
    expect(tags).toContainEqual({ property: "og:title", content: "Contact" });
    expect(tags).toContainEqual({ name: "description", content: "Say hi." });
    expect(tags).toContainEqual({
      property: "og:description",
      content: "Say hi.",
    });
  });

  it("shares a large preview image with its dimensions", () => {
    const tags = seo({ title: "x", path: "/" });

    expect(tags).toContainEqual({
      property: "og:image",
      content: `${SITE_URL}/og-image.png`,
    });
    expect(tags).toContainEqual({
      property: "og:image:width",
      content: "1200",
    });
    expect(tags).toContainEqual({
      property: "og:image:height",
      content: "630",
    });
    expect(tags).toContainEqual({
      name: "twitter:card",
      content: "summary_large_image",
    });
  });

  it("lets search engines index the page", () => {
    expect(seo({ title: "x", path: "/" })).toContainEqual({
      name: "robots",
      content: "index, follow, max-image-preview:large",
    });
  });
});
