import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { profile, type AiMathematics as Data } from "../data/profile";
import AiMathematics from "./AiMathematics";

describe("AiMathematics", () => {
  const data = profile.aiMathematics as Data;

  it("lists only accepted rStation papers with rstation.ai links", () => {
    render(<AiMathematics data={data} />);
    expect(screen.getByRole("heading", { name: "AI-generated mathematics" })).toBeInTheDocument();
    expect(data.items.length).toBe(11);
    for (const item of data.items) {
      expect(item.links[0].href).toMatch(/^https:\/\/rstation\.ai\/problems\/[a-z_]+\/papers\/\d+\/v\d+$/);
    }
    expect(screen.getAllByText(/Accepted \(platform review\)/)).toHaveLength(11);
    expect(screen.getByRole("note")).toHaveTextContent("not journal peer review");
  });
});
