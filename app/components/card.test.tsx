import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Card } from "./card";

describe("Card", () => {
  it("renders its children", () => {
    render(
      <Card>
        <a href="/x">inside</a>
      </Card>,
    );

    expect(screen.getByRole("link", { name: "inside" })).toBeInTheDocument();
  });

  it("follows the pointer without throwing", () => {
    const { container } = render(<Card>content</Card>);
    const card = container.firstElementChild as HTMLElement;

    expect(() =>
      fireEvent.mouseMove(card, { clientX: 40, clientY: 25 }),
    ).not.toThrow();
  });
});
