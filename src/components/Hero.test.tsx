import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { profile } from "../data/profile";
import Hero from "./Hero";

describe("Hero", () => {
  it("renders identity, navigation and light research link", () => {
    render(<Hero profile={profile} />);
    expect(screen.getByRole("heading", { level: 1, name: "HONGMIN LI" })).toBeInTheDocument();
    for (const name of ["About", "Research", "Publications", "Contact"]) {
      expect(screen.getByRole("link", { name })).toBeInTheDocument();
    }
    expect(screen.getByRole("link", { name: "Explore research" })).toHaveAttribute("href", "#about");
  });

  it("keeps copy visible at the bottom before lifting it after playback", () => {
    const { container, rerender } = render(<Hero profile={profile} copyLifted={false} />);
    expect(container.querySelector(".hero-content")).not.toHaveStyle({ opacity: "0" });
    rerender(<Hero profile={profile} copyLifted />);
    expect(container.querySelector(".hero-content")).toHaveStyle({ opacity: "1" });
  });
});
