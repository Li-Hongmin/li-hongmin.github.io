import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { profile } from "../data/profile";
import SelectedWork from "./SelectedWork";

describe("SelectedWork", () => {
  it("renders the verified year for every selected work item", () => {
    render(<SelectedWork work={profile.selectedWork} />);

    for (const { title, year } of profile.selectedWork) {
      const row = screen.getByRole("heading", { level: 3, name: title }).closest("article");
      expect(row).not.toBeNull();
      expect(within(row!).getByText(String(year))).toBeInTheDocument();
    }
  });
});
