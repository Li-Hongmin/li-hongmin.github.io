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

  it("holds the floating copy until the video sequence settles", () => {
    const { container } = render(<Hero profile={profile} copyReady={false} />);
    expect(container.querySelector(".hero-header")).toHaveStyle({ opacity: "0" });
    expect(container.querySelector(".hero-content")).toHaveStyle({ opacity: "0" });
  });
});
