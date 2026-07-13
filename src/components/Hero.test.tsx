import { fireEvent, render, screen, within } from "@testing-library/react";
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

  it("uses the nine-item section outline only on wide screens", () => {
    render(<HeroNavigation className="desktop-outline" />);

    const outline = screen.getByRole("navigation", { name: "Desktop outline navigation" });
    expect(within(outline).getAllByRole("link").map((link) => [link.textContent, link.getAttribute("href")])).toEqual([
      ["About", "#about"],
      ["Featured Paper", "#research"],
      ["Publications", "#publications"],
      ["Experience", "#experience"],
      ["Education", "#education"],
      ["Grants", "#grants"],
      ["Awards", "#awards"],
      ["Peer Review", "#peer-review"],
      ["Contact", "#contact"],
    ]);
  });

  it("reveals a research overview and two jump links only after lifting the copy", () => {
    const { container, rerender } = render(<Hero profile={profile} copyLifted={false} />);
    expect(container.querySelector(".hero-content")).not.toHaveStyle({ opacity: "0" });
    expect(screen.queryByText(/AI-automated scientific workflows/i)).not.toBeInTheDocument();

    rerender(<Hero profile={profile} copyLifted />);

    expect(container.querySelector(".hero-content")).toHaveStyle({ opacity: "1" });
    const overview = screen.getByLabelText("Research overview");
    const overviewCopy = within(overview).getByText(/My research develops AI-automated scientific workflows/i);
    expect(overviewCopy).toHaveTextContent(/biomolecular sequence design/i);
    expect(overviewCopy).toHaveTextContent(/reliable AI evaluation/i);
    expect(within(overview).getAllByRole("link").map((link) => [link.textContent, link.getAttribute("href")])).toEqual([
      ["Research", "#research"],
      ["Publications", "#publications"],
    ]);
  });

  it("shows the current featured paper preview on hover and removes it when the overview is left", () => {
    render(<Hero profile={profile} copyLifted />);

    const overview = screen.getByLabelText("Research overview");
    fireEvent.mouseEnter(within(overview).getByRole("link", { name: "Research" }));

    const preview = screen.getByRole("status");
    const featuredPaper = profile.publications.find((publication) => publication.featured)!;
    expect(preview).toHaveTextContent(`Featured paper · ${featuredPaper.date}`);
    expect(preview).toHaveTextContent(featuredPaper.title.split(":", 1)[0]);
    expect(preview).toHaveTextContent(featuredPaper.title);
    expect(preview).toHaveTextContent("No claim without license.");

    fireEvent.mouseLeave(overview);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("switches overview previews on keyboard focus, keeps the first three records, and hides after focus leaves", () => {
    render(<Hero profile={profile} copyLifted />);

    const overview = screen.getByLabelText("Research overview");
    const publicationsLink = within(overview).getByRole("link", { name: "Publications" });

    fireEvent.focus(publicationsLink);
    const preview = screen.getByRole("status");
    expect(preview).toHaveTextContent("Publications");
    for (const publication of profile.publications.slice(0, 3)) {
      expect(preview).toHaveTextContent(publication.title);
      expect(preview).toHaveTextContent(publication.date);
    }
    expect(preview).not.toHaveTextContent(profile.publications[3].title);

    fireEvent.blur(publicationsLink, { relatedTarget: document.body });
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});
