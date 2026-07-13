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

  it("shows the complete dated education record", () => {
    render(<Contact profile={profile} />);

    const education = screen.getByRole("heading", { name: "Education" }).closest("section");
    expect(education).not.toBeNull();

    expect(within(education!).getByText("2017.04 — 2019.03")).toBeInTheDocument();
    expect(within(education!).getByText("Master's in Computer Science (Information Systems Engineering)")).toBeInTheDocument();
    expect(within(education!).getByText("2011.09 — 2015.07")).toBeInTheDocument();
    expect(within(education!).getByText("Bachelor's in Electronic Information Engineering")).toBeInTheDocument();
    expect(within(education!).getByText("Ningxia University")).toBeInTheDocument();
  });
});
