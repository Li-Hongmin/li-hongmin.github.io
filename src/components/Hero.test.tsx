import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { profile } from "../data/profile";
import Hero from "./Hero";

describe("Hero", () => {
  it("renders identity and navigation without the removed Explore research CTA", () => {
    render(<Hero profile={profile} />);
    expect(screen.getByRole("heading", { level: 1, name: "HONGMIN LI" })).toBeInTheDocument();
    for (const name of ["About", "Research", "Publications", "Contact"]) {
      expect(screen.getByRole("link", { name })).toBeInTheDocument();
    }
    expect(screen.queryByRole("link", { name: "Explore research" })).not.toBeInTheDocument();
  });

  it("reveals a research overview and three jump links only after lifting the copy", () => {
    const { container, rerender } = render(<Hero profile={profile} copyLifted={false} />);
    expect(container.querySelector(".hero-content")).not.toHaveStyle({ opacity: "0" });
    expect(screen.queryByText(/AI-automated scientific workflows/i)).not.toBeInTheDocument();

    rerender(<Hero profile={profile} copyLifted />);

    expect(container.querySelector(".hero-content")).toHaveStyle({ opacity: "1" });
    expect(screen.getByText(/AI-automated scientific workflows/i)).toHaveTextContent(/biomolecular sequence design/i);
    expect(screen.getByText(/AI-automated scientific workflows/i)).toHaveTextContent(/reliable AI evaluation/i);
    const overview = screen.getByLabelText("Research overview");
    expect(within(overview).getByRole("link", { name: "Research" })).toHaveAttribute("href", "#research");
    expect(within(overview).getByRole("link", { name: "Selected work" })).toHaveAttribute("href", "#selected-work");
    expect(within(overview).getByRole("link", { name: "Publications" })).toHaveAttribute("href", "#publications");
  });
});
