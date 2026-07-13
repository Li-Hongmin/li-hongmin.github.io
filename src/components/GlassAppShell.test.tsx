import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import GlassAppShell from "./GlassAppShell";

describe("GlassAppShell", () => {
  it("renders one labeled internal scroller without a connected glass surface", () => {
    render(
      <GlassAppShell backdrop={<div>Cloud media</div>} hero={<div id="top">Launch identity</div>}>
        <section id="about">Overview content</section>
      </GlassAppShell>,
    );
    expect(screen.getByText("Cloud media")).toBeInTheDocument();
    expect(screen.getByText("Launch identity")).toBeInTheDocument();
    const scroller = screen.getByRole("main", { name: "Hongmin Li research app" });
    expect(scroller).toHaveAttribute("tabindex", "0");
    expect(scroller.querySelector(".editorial-feed")).toBeInTheDocument();
    expect(scroller.querySelector(".glass-app-surface")).not.toBeInTheDocument();
    expect(screen.queryByRole("navigation", { name: "App navigation" })).not.toBeInTheDocument();
  });

});
