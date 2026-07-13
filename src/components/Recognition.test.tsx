import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { profile } from "../data/profile";
import Recognition from "./Recognition";

describe("Recognition", () => {
  it("provides the experience section anchor used by the desktop outline", () => {
    render(<Recognition profile={profile} />);

    expect(screen.getByRole("heading", { name: "Experience & recognition" }).closest("section")).toHaveAttribute("id", "experience");
  });
});
