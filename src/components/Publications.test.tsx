import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { profile } from "../data/profile";
import Publications from "./Publications";

describe("Publications", () => {
  it("derives the complete-record count from the publications it receives", () => {
    const publications = profile.publications.slice(0, 2);
    render(<Publications publications={publications} />);

    expect(screen.getByText("2 entries")).toBeInTheDocument();
    expect(within(screen.getByLabelText("Complete publication record")).getAllByRole("article")).toHaveLength(2);
  });
});
