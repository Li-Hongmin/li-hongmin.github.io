import { fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import GlassAppShell from "./GlassAppShell";

describe("GlassAppShell", () => {
  beforeEach(() => {
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
  });

  afterEach(() => vi.unstubAllGlobals());

  it("renders one labeled internal app scroller and sticky navigation", () => {
    render(
      <GlassAppShell backdrop={<div>Cloud media</div>} hero={<div id="top">Launch identity</div>}>
        <section id="about">Overview content</section>
      </GlassAppShell>,
    );
    expect(screen.getByText("Cloud media")).toBeInTheDocument();
    expect(screen.getByText("Launch identity")).toBeInTheDocument();
    const scroller = screen.getByRole("main", { name: "Hongmin Li research app" });
    expect(scroller).toHaveAttribute("tabindex", "0");
    const nav = screen.getByRole("navigation", { name: "App navigation" });
    for (const label of ["Overview", "Research", "Papers", "Contact"]) {
      expect(within(nav).getByRole("link", { name: label })).toBeInTheDocument();
    }
  });

  it("writes clamped launch progress without React scroll state", () => {
    render(
      <GlassAppShell backdrop={<div>Cloud media</div>} hero={<div id="top">Launch identity</div>}>
        <section>Content</section>
      </GlassAppShell>,
    );
    const scroller = screen.getByRole("main", { name: "Hongmin Li research app" });
    Object.defineProperty(scroller, "clientHeight", { configurable: true, value: 1000 });
    Object.defineProperty(scroller, "scrollTop", { configurable: true, value: 500 });
    fireEvent.scroll(scroller);
    expect(screen.getByTestId("app-viewport").style.getPropertyValue("--launch-progress")).toBe("0.5000");
  });
});
