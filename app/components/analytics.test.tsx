import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Analytics } from "./analytics";

describe("Analytics", () => {
  it("renders nothing when no Beam token is configured", () => {
    vi.stubEnv("NEXT_PUBLIC_BEAM_TOKEN", "");

    const { container } = render(<Analytics />);

    expect(container).toBeEmptyDOMElement();
  });

  it("loads the Beam script with the configured token", () => {
    vi.stubEnv("NEXT_PUBLIC_BEAM_TOKEN", "beam-token");

    const { container } = render(<Analytics />);

    const script = container.querySelector("script");
    expect(script).toHaveAttribute(
      "src",
      "https://beamanalytics.b-cdn.net/beam.min.js",
    );
    expect(script).toHaveAttribute("data-token", "beam-token");
    expect(script).toHaveAttribute("async");
  });
});
