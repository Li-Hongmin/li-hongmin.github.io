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
      ["Projects", "#projects"],
      ["Insights", "#notes"],
      ["Papers", "#publications"],
      ["Contact", "#contact"],
    ]);
    expect(screen.queryByRole("link", { name: "Research" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Explore research" })).not.toBeInTheDocument();
  });

  it("uses the seven-item section outline only on wide screens", () => {
    render(<HeroNavigation className="desktop-outline" />);

    const outline = screen.getByRole("navigation", { name: "Desktop outline navigation" });
    expect(within(outline).getAllByRole("link").map((link) => [link.textContent, link.getAttribute("href")])).toEqual([
      ["About", "#about"],
      ["Projects", "#projects"],
      ["Insights", "#notes"],
      ["Featured Paper", "#research"],
      ["Publications", "#publications"],
      ["Experience", "#experience"],
      ["Contact", "#contact"],
    ]);
  });

  it("reveals a nine-item recent-news record only after lifting the copy", () => {
    const { container, rerender } = render(<Hero profile={profile} copyLifted={false} />);
    expect(container.querySelector(".hero-content")).not.toHaveStyle({ opacity: "0" });
    expect(screen.queryByText(/AI-automated scientific workflows/i)).not.toBeInTheDocument();

    rerender(<Hero profile={profile} copyLifted />);

    expect(container.querySelector(".hero-content")).toHaveStyle({ opacity: "1" });
    const overview = screen.getByLabelText("Recent news overview");
    const overviewCopy = within(overview).getByText(/I build evidence-calibrated AI systems/i);
    expect(overviewCopy).toHaveTextContent(/scientific and mathematical research/i);
    expect(overviewCopy).toHaveTextContent(/concrete research cases/i);
    expect(within(overview).getByRole("heading", { name: "Recent news" })).toBeInTheDocument();
    expect(within(overview).getAllByRole("listitem")).toHaveLength(9);
    expect(within(overview).queryByRole("link", { name: "Research" })).not.toBeInTheDocument();
    expect(within(overview).queryByRole("link", { name: "Publications" })).not.toBeInTheDocument();
    expect(overview).toHaveTextContent(profile.publications[0].title);
    expect(overview).toHaveTextContent(profile.grants[0].title);
    expect(overview).toHaveTextContent(profile.activities[0].title);
  });
});
