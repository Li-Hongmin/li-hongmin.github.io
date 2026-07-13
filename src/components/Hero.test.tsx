import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { profile } from "../data/profile";
import Hero, { HeroNavigation } from "./Hero";

describe("Hero", () => {
  it("renders identity and the four-item mobile navigation without the removed Explore research CTA", () => {
    render(<Hero profile={profile} />);
    expect(screen.getByRole("heading", { level: 1, name: "HONGMIN LI" })).toBeInTheDocument();
    const navigation = screen.getByRole("navigation", { name: "Primary navigation" });
    expect(within(navigation).getAllByRole("link").map((link) => [link.textContent, link.getAttribute("href")])).toEqual([
      ["About", "#about"],
      ["Paper", "#research"],
      ["Publications", "#publications"],
      ["Contact", "#contact"],
    ]);
    expect(screen.queryByRole("link", { name: "Research" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Explore research" })).not.toBeInTheDocument();
  });

  it("uses the complete six-item section outline only on wide screens", () => {
    render(<HeroNavigation className="desktop-outline" />);

    const outline = screen.getByRole("navigation", { name: "Desktop outline navigation" });
    expect(within(outline).getAllByRole("link").map((link) => [link.textContent, link.getAttribute("href")])).toEqual([
      ["About", "#about"],
      ["Featured Paper", "#research"],
      ["Selected Work", "#selected-work"],
      ["Publications", "#publications"],
      ["Experience", "#experience"],
      ["Contact", "#contact"],
    ]);
  });

  it("reveals a research overview and three jump links only after lifting the copy", () => {
    const { container, rerender } = render(<Hero profile={profile} copyLifted={false} />);
    expect(container.querySelector(".hero-content")).not.toHaveStyle({ opacity: "0" });
    expect(screen.queryByText(/AI-automated scientific workflows/i)).not.toBeInTheDocument();

    rerender(<Hero profile={profile} copyLifted />);

    expect(container.querySelector(".hero-content")).toHaveStyle({ opacity: "1" });
    const overview = screen.getByLabelText("Research overview");
    const overviewCopy = within(overview).getByText(/My research develops AI-automated scientific workflows/i);
    expect(overviewCopy).toHaveTextContent(/biomolecular sequence design/i);
    expect(overviewCopy).toHaveTextContent(/reliable AI evaluation/i);
    expect(within(overview).getByRole("link", { name: "Research" })).toHaveAttribute("href", "#research");
    expect(within(overview).getByRole("link", { name: "Selected work" })).toHaveAttribute("href", "#selected-work");
    expect(within(overview).getByRole("link", { name: "Publications" })).toHaveAttribute("href", "#publications");
    expect(within(overview).getByLabelText("Research preview")).toHaveTextContent(profile.publications[0].title);
    expect(within(overview).getByLabelText("Research preview")).toHaveTextContent("No claim without license.");
    expect(within(overview).getByLabelText("Selected work preview")).toHaveTextContent("ID3 · 2025");
    expect(within(overview).getByLabelText("Publications preview")).toHaveTextContent(`2026.06 · ${profile.publications[0].title}`);
  });
});
