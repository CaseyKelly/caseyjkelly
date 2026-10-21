import { render, type RenderResult } from "@testing-library/react";
import type { ComponentType } from "react";
import { createRoutesStub } from "react-router";

/**
 * Renders a component inside an in-memory router so its `<Link>`s work, the
 * same way it renders inside the app.
 */
export function renderWithRouter(
  Component: ComponentType,
  path = "/",
): RenderResult {
  const Stub = createRoutesStub([{ path, Component }]);
  return render(<Stub initialEntries={[path]} />);
}
