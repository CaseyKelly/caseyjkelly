import { render, screen } from "@testing-library/react";
import { createRoutesStub, data } from "react-router";
import { describe, expect, it, vi } from "vitest";
import { ErrorBoundary } from "./root";

// throws from the loader, where React Router turns a thrown data() into a
// route error response, the way a missing page reaches the boundary
function renderThrowing(error: unknown) {
  const Stub = createRoutesStub([
    {
      path: "/",
      loader: () => {
        throw error;
      },
      Component: () => null,
      ErrorBoundary,
    },
  ]);
  return render(<Stub />);
}

describe("root ErrorBoundary", () => {
  it("shows the not-found page for a 404 response", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    renderThrowing(data(null, { status: 404 }));

    expect(
      await screen.findByRole("heading", { name: "Page not found" }),
    ).toBeInTheDocument();
  });

  it("shows a generic message and logs anything else", async () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const error = new Error("boom");

    renderThrowing(error);

    expect(
      await screen.findByRole("heading", { name: "Something went wrong" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("boom")).not.toBeInTheDocument();
    expect(consoleError).toHaveBeenCalledWith(error);
  });
});
