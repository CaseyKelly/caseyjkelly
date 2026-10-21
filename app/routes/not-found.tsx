import { StatusPage } from "../components/status-page";

export const meta = () => [
  { title: "Page not found | caseyjkelly.com" },
  { name: "robots", content: "noindex" },
];

// prerendered at /404 and copied to 404.html (see react-router.config.ts),
// which Vercel serves with a 404 status for any unknown path
export default function NotFound() {
  return (
    <StatusPage
      heading="Page not found"
      message="That page doesn't exist or has moved."
    />
  );
}
