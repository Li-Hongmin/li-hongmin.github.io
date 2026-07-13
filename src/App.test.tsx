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
    expect(screen.queryByRole("heading", { name: "Research directions" })).not.toBeInTheDocument();
    expect(screen.queryByText("AI-Automated Scientific Workflows")).not.toBeInTheDocument();
    expect(screen.queryByText("Biomolecular Sequence Design and Optimization")).not.toBeInTheDocument();
    expect(screen.queryByText("Reliable AI Research and Evaluation")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Selected work" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Publications" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Experience & recognition" }).closest("section")).toHaveAttribute("id", "experience");
    expect(screen.getByRole("heading", { name: "Let's build testable science." })).toBeInTheDocument();
  });

  it("exposes verified work, legacy assets and unique record anchors", () => {
    const { container } = render(<App />);
    const work = screen.getByLabelText("Selected work");
    for (const title of ["ID3", "mRNA-GPT", "FastUMAP", "Targeted Tests for LLM Reasoning"]) {
      expect(within(work).getByText(title)).toBeInTheDocument();
    }
    expect(screen.getByRole("heading", { name: "Full CV / Record" })).toBeInTheDocument();
    expect(container.querySelector("details#full-cv")).toBeNull();
    expect(container.querySelector("div#full-cv")).not.toBeNull();
    expect(screen.queryByText("Expand")).not.toBeInTheDocument();
    for (const id of ["about", "research", "publications", "experience", "education", "grants", "awards", "peer-review", "contact"]) {
      expect(container.querySelectorAll(`#${id}`)).toHaveLength(1);
    }
    expect(screen.getByRole("link", { name: "CREST 2025 poster" })).toHaveAttribute("href", "/files/CREST_2025_poster.pdf");
    expect(screen.getByRole("link", { name: "Email Hongmin Li" })).toHaveAttribute("href", "mailto:lihongmin@edu.k.u-tokyo.ac.jp");
  });

  it("shows data-driven recent and complete publication counts without retired public labels", () => {
    render(<App />);
    expect(screen.getByLabelText("Recent publications").querySelectorAll("article")).toHaveLength(
      profile.publications.filter((publication) => publication.featured).length,
    );
    expect(screen.queryByLabelText("Featured publications")).not.toBeInTheDocument();
    expect(screen.getAllByRole("heading", { name: "Funding & credits" })).toHaveLength(2);
    expect(screen.queryByRole("heading", { name: "Research grants" })).not.toBeInTheDocument();
    expect(screen.getByLabelText("Complete publication record").querySelectorAll("article")).toHaveLength(
      profile.publications.length,
    );
    expect(screen.getByText(`${profile.publications.length} entries`)).toBeInTheDocument();
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
