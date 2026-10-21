import type { MetaDescriptor } from "react-router";

// caseyjkelly.com redirects here, so this is the canonical origin
export const SITE_URL = "https://www.caseyjkelly.com";

const DEFAULT_DESCRIPTION =
  "Senior software engineer in Denver, CO building accessible React and TypeScript products.";

interface SeoOptions {
  title: string;
  path: string;
  description?: string;
}

/**
 * Title, description, canonical link and Open Graph/Twitter tags for a
 * page. React Router replaces the root's meta with the deepest route's, so
 * every route spreads this rather than inheriting it.
 */
export function seo({
  title,
  path,
  description = DEFAULT_DESCRIPTION,
}: SeoOptions): MetaDescriptor[] {
  const url = `${SITE_URL}${path}`;
  return [
    { title },
    { name: "description", content: description },
    { name: "robots", content: "index, follow, max-image-preview:large" },
    { tagName: "link", rel: "canonical", href: url },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:site_name", content: "caseyjkelly.com" },
    { property: "og:type", content: "website" },
    { property: "og:locale", content: "en_US" },
    { property: "og:image", content: `${SITE_URL}/favicon.png` },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:site", content: "@Caseyk819" },
  ];
}
