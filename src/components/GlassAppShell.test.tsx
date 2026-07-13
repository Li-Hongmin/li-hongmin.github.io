import { fireEvent, render, screen } from "@testing-library/react";
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
    expect(document.querySelector(".content-backdrop-shade")).toHaveAttribute("aria-hidden", "true");
    expect(scroller.querySelector(".glass-app-surface")).not.toBeInTheDocument();
    expect(screen.queryByRole("navigation", { name: "App navigation" })).not.toBeInTheDocument();
  });

  it("increases the background shade as content scrolls over the video", () => {
    render(
      <GlassAppShell backdrop={<div>Cloud media</div>} hero={<div>Launch identity</div>}>
        <section>Overview content</section>
      </GlassAppShell>,
    );
    const scroller = screen.getByRole("main", { name: "Hongmin Li research app" });
    Object.defineProperty(scroller, "clientHeight", { configurable: true, value: 1000 });
    Object.defineProperty(scroller, "scrollTop", { configurable: true, value: 360 });
    fireEvent.scroll(scroller);
    expect(screen.getByTestId("app-viewport")).toHaveStyle("--content-progress: 0.500");
  });

});
