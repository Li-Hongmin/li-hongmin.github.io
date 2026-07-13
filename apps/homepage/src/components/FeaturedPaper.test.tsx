import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { profile } from "../data/profile";
import FeaturedPaper from "./FeaturedPaper";

describe("FeaturedPaper", () => {
  it("keeps the research navigation target while presenting the Calibration Turn claim boundary", () => {
    render(<FeaturedPaper publication={profile.publications[0]} />);

    const paper = screen.getByLabelText("Featured paper");
    expect(paper).toHaveAttribute("id", "research");
    expect(within(paper).getByRole("heading", { name: profile.publications[0].title })).toBeInTheDocument();
    expect(within(paper).getByText("No claim without license.")).toBeInTheDocument();
    expect(within(paper).getByText("The paper asks a simple but consequential question: when AI systems generate hypotheses, derive consequences, seek external validation, and update beliefs, what are they actually entitled to claim? It answers with a five-operator framework in which claim calibration is the final scientific operation, not a stylistic afterthought.")).toBeInTheDocument();
    expect(within(paper).queryByText(/Perspective-style framework/i)).not.toBeInTheDocument();
    expect(within(paper).getByText(/AISim-Cal is an illustrative synthetic dynamics exercise/i)).toHaveTextContent(/not an empirical forecast or benchmark/i);
  });

  it("provides the public preprint and code-and-artifacts links", () => {
    render(<FeaturedPaper publication={profile.publications[0]} />);

    expect(screen.getByRole("link", { name: "arXiv" })).toHaveAttribute("href", "https://arxiv.org/abs/2606.31273");
    expect(screen.getByRole("link", { name: "Code & artifacts" })).toHaveAttribute(
      "href",
      "https://github.com/Li-Hongmin/calibration-turn-ai-assisted-research",
    );
  });
});
