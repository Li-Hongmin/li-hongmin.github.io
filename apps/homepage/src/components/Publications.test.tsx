import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { profile } from "../data/profile";
import Publications from "./Publications";

describe("Publications", () => {
  it("shows the latest nine publications in input order with a dynamic remaining count", () => {
    render(<Publications publications={profile.publications} />);

    const grid = screen.getByLabelText("Publications list");
    const articles = within(grid).getAllByRole("article");
    const button = screen.getByRole("button", { name: "View 7 more publications" });

    expect(articles).toHaveLength(9);
    expect(articles.map((article) => within(article).getByRole("heading").textContent)).toEqual(
      profile.publications.slice(0, 9).map((publication) => publication.title),
    );
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(button).toHaveAttribute("aria-controls", grid.id);
    expect(screen.queryByText("Complete publication record")).not.toBeInTheDocument();
  });

  it("expands all publications without duplicates and collapses back to nine", async () => {
    const user = userEvent.setup();
    render(<Publications publications={profile.publications} />);

    const grid = screen.getByLabelText("Publications list");
    const button = screen.getByRole("button", { name: "View 7 more publications" });
    await user.click(button);

    const expandedArticles = within(grid).getAllByRole("article");
    expect(expandedArticles).toHaveLength(16);
    expect(new Set(expandedArticles.map((article) => article.dataset.publicationId)).size).toBe(16);
    expect(new Set(expandedArticles.map((article) => within(article).getByRole("heading").textContent)).size).toBe(16);
    expect(button).toHaveAccessibleName("Show fewer publications");
    expect(button).toHaveAttribute("aria-expanded", "true");

    await user.click(button);
    expect(within(grid).getAllByRole("article")).toHaveLength(9);
    expect(button).toHaveAccessibleName("View 7 more publications");
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("shows every publication and no toggle when there are at most nine", () => {
    const publications = profile.publications.slice(0, 9);
    render(<Publications publications={publications} />);

    expect(within(screen.getByLabelText("Publications list")).getAllByRole("article")).toHaveLength(9);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
