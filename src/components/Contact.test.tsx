import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { profile } from "../data/profile";
import Contact from "./Contact";

describe("Contact", () => {
  it("marks undated education records so their content can span the date column", () => {
    render(<Contact profile={profile} />);

    const education = screen.getByRole("heading", { name: "Education" }).closest("section");
    expect(education).not.toBeNull();

    for (const degree of ["Master's in Computer Science", "Bachelor's in Computer Science"]) {
      const record = within(education!).getByText(degree).closest("li");
      expect(record).toHaveClass("compact-record__item--undated");
      expect(record!.querySelector("time")).toBeNull();
    }
  });
});
