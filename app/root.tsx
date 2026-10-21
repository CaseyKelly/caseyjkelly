import type { ReactNode } from "react";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
} from "react-router";
import { Analytics } from "@vercel/analytics/react";
import interLatin400 from "@fontsource/inter/files/inter-latin-400-normal.woff2?url";
import { StatusPage } from "./components/status-page";
import "./app.css";

export const links = () => [
  {
    rel: "preload",
    href: "/fonts/CalSans-SemiBold.woff2",
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  },
  {
    rel: "preload",
    href: interLatin400,
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  },
  { rel: "icon", href: "/favicon.png" },
];

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <Meta />
        <Links />
      </head>
      <body className="bg-black">
        {children}
        <ScrollRestoration />
        <Scripts />
        <Analytics />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <StatusPage
        heading="Page not found"
        message="That page doesn't exist or has moved."
      />
    );
  }
  console.error(error);
  return (
    <StatusPage
      heading="Something went wrong"
      message="Try reloading the page."
    />
  );
}
