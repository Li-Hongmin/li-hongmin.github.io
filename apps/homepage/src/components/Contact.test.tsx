import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { profile } from "../data/profile";
import Contact from "./Contact";

describe("Contact", () => {
  it("keeps contact as a focused final section without a duplicate full CV", () => {
    const { container } = render(<Contact profile={profile} />);

    expect(screen.getByRole("heading", { name: "Let's build testable science." })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Email Hongmin Li" })).toHaveAttribute("href", `mailto:${profile.email}`);
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute("href", profile.github);
    expect(screen.queryByRole("heading", { name: "Full CV / Record" })).not.toBeInTheDocument();
    expect(container.querySelector("#full-cv")).toBeNull();
  });

  it("renders the footer after the contact information", () => {
    render(<Contact profile={profile} />);
    expect(screen.getByText(profile.name)).toBeInTheDocument();
    expect(screen.getByText(`Last updated ${profile.lastUpdated}`)).toBeInTheDocument();
  });
});
