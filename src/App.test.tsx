import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import App from "./App";

vi.mock("./hooks/useHeroMedia", () => ({ useHeroMedia: () => ({ shouldLoadVideo: false }) }));

describe("portfolio page", () => {
  it("renders the approved information architecture", () => {
    render(<App />);
    expect(screen.getByRole("heading", { level: 1, name: "HONGMIN LI" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Research directions" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Selected work" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Publications" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Experience & recognition" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Let's build testable science." })).toBeInTheDocument();
  });

  it("exposes verified work, legacy assets and the full CV anchor", () => {
    render(<App />);
    const work = screen.getByLabelText("Selected work");
    for (const title of ["ID3", "mRNA-GPT", "FastUMAP", "Targeted Tests for LLM Reasoning"]) {
      expect(within(work).getByText(title)).toBeInTheDocument();
    }
    expect(screen.getByText("Full CV / Record").closest("details")).toHaveAttribute("id", "full-cv");
    expect(screen.getByRole("link", { name: "CREST 2025 poster" })).toHaveAttribute("href", "/files/CREST_2025_poster.pdf");
    expect(screen.getByRole("link", { name: "Email Hongmin Li" })).toHaveAttribute("href", "mailto:lihongmin@edu.k.u-tokyo.ac.jp");
  });

  it("shows six featured publications and all fifteen in the complete record", () => {
    render(<App />);
    expect(screen.getByLabelText("Featured publications").querySelectorAll("article")).toHaveLength(6);
    expect(screen.getByLabelText("Complete publication record").querySelectorAll("article")).toHaveLength(15);
  });
});
