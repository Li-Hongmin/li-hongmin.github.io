import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import App from "./App";
import { profile } from "./data/profile";

vi.mock("./hooks/useHeroMedia", () => ({ useHeroMedia: () => ({ shouldLoadVideo: false }) }));

describe("portfolio page", () => {
  it("renders the approved information architecture", () => {
    render(<App />);
    expect(screen.getByRole("heading", { level: 1, name: "HONGMIN LI" })).toBeInTheDocument();
    const featuredPaper = screen.getByLabelText("Featured paper");
    expect(featuredPaper).toHaveAttribute("id", "research");
    expect(within(featuredPaper).getByRole("heading", { name: "The Calibration Turn in AI-Assisted Research: A Conceptual and Methodological Framework for Evidence-Licensed Claims" })).toBeInTheDocument();
    expect(within(featuredPaper).getByText("No claim without license.")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Projects" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "AlphaScience" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Research notes" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Research directions" })).not.toBeInTheDocument();
    expect(screen.queryByText("AI-Automated Scientific Workflows")).not.toBeInTheDocument();
    expect(screen.queryByText("Biomolecular Sequence Design and Optimization")).not.toBeInTheDocument();
    expect(screen.queryByText("Reliable AI Research and Evaluation")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Publications" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Experience & recognition" }).closest("section")).toHaveAttribute("id", "experience");
    expect(screen.getByRole("heading", { name: "Let's build testable science." })).toBeInTheDocument();
  });

  it("exposes verified work, legacy assets and unique record anchors", () => {
    const { container } = render(<App />);
    expect(screen.queryByRole("heading", { name: "Full CV / Record" })).not.toBeInTheDocument();
    expect(container.querySelector("#full-cv")).toBeNull();
    for (const id of ["about", "projects", "notes", "research", "publications", "experience", "education", "grants", "awards", "peer-review", "contact"]) {
      expect(container.querySelectorAll(`#${id}`)).toHaveLength(1);
    }
    expect(screen.getByRole("link", { name: "CREST 2025 poster" })).toHaveAttribute("href", "/files/CREST_2025_poster.pdf");
    expect(screen.getByRole("link", { name: "Email Hongmin Li" })).toHaveAttribute("href", "mailto:lihongmin@edu.k.u-tokyo.ac.jp");
  });

  it("shows one nine-item publication grid with a data-driven expansion count", () => {
    const { container } = render(<App />);
    expect(screen.getByLabelText("Publications list").querySelectorAll("article")).toHaveLength(9);
    expect(screen.getByRole("button", { name: `View ${profile.publications.length - 9} more publications` })).toBeInTheDocument();
    expect(container.querySelectorAll("#publications .publication-list")).toHaveLength(1);
    expect(container.querySelector("#publications details")).toBeNull();
    expect(screen.getAllByRole("heading", { name: "Academic & industry appointments" })).toHaveLength(1);
    expect(screen.getAllByRole("heading", { name: "Research funding & computing support" })).toHaveLength(1);
    expect(screen.getByRole("heading", { name: "Conference participation & presentations" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Honors & fellowships" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Research grants" })).not.toBeInTheDocument();
  });

  it("presents separate editorial panels over a fixed cinematic backdrop", () => {
    render(<App />);
    const app = screen.getByRole("main", { name: "Hongmin Li research app" });
    expect(app).toHaveClass("app-scroller");
    expect(document.querySelector(".editorial-feed")).toBeInTheDocument();
    expect(document.querySelector(".glass-app-surface")).not.toBeInTheDocument();
    expect(document.querySelector(".hero-transition")).not.toBeInTheDocument();
    expect(screen.queryByRole("navigation", { name: "App navigation" })).not.toBeInTheDocument();
  });
});
