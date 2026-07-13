import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { profile } from "../data/profile";
import Contact from "./Contact";

describe("Contact", () => {
  it("keeps the full CV record permanently visible without disclosure controls", () => {
    const { container } = render(<Contact profile={profile} />);

    expect(screen.getByRole("heading", { name: "Full CV / Record" })).toBeInTheDocument();
    expect(container.querySelector("details#full-cv")).toBeNull();
    expect(container.querySelector("div#full-cv")).not.toBeNull();
    expect(container.querySelector("details")).toBeNull();
    expect(container.querySelector("summary")).toBeNull();
    expect(screen.queryByText("Expand")).not.toBeInTheDocument();
  });

  it("provides stable anchors for full-record subsections without duplicating experience", () => {
    const { container } = render(<Contact profile={profile} />);

    const expectedRecords = [
      ["education", "Education"],
      ["grants", "Funding & credits"],
      ["awards", "Awards & fellowship"],
      ["peer-review", "Peer review"],
    ] as const;

    for (const [id, title] of expectedRecords) {
      const record = container.querySelector(`#${id}`);
      expect(record).not.toBeNull();
      expect(record).toHaveClass("compact-record");
      expect(within(record as HTMLElement).getByRole("heading", { name: title })).toBeInTheDocument();
    }
    expect(container.querySelector("#experience")).toBeNull();
  });

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
