import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { profile } from "../data/profile";
import Hero from "./Hero";

const mediaState = vi.hoisted(() => ({ shouldLoadVideo: true }));
vi.mock("../hooks/useHeroMedia", () => ({ useHeroMedia: () => mediaState }));

describe("Hero", () => {
  beforeEach(() => { mediaState.shouldLoadVideo = true; });

  it("renders identity, navigation and light research link", () => {
    render(<Hero profile={profile} />);
    expect(screen.getByRole("heading", { level: 1, name: "HONGMIN LI" })).toBeInTheDocument();
    for (const name of ["About", "Research", "Publications", "Contact"]) {
      expect(screen.getByRole("link", { name })).toBeInTheDocument();
    }
    expect(screen.getByRole("link", { name: "Explore research" })).toHaveAttribute("href", "#about");
  });

  it("sets the video source only when policy permits", () => {
    const { unmount } = render(<Hero profile={profile} />);
    expect(document.querySelector("video")).toHaveAttribute("src", "/media/hero.mp4");
    unmount();
    mediaState.shouldLoadVideo = false;
    render(<Hero profile={profile} />);
    expect(document.querySelector("video")).not.toHaveAttribute("src");
  });

  it("preserves the poster fallback when video fails", () => {
    render(<Hero profile={profile} />);
    const video = document.querySelector("video")!;
    expect(video).toHaveAttribute("poster", "/media/hero-poster.webp");
    expect(video).toHaveAttribute("aria-hidden", "true");
    fireEvent.error(video);
    expect(video).toHaveClass("hero-video--failed");
  });
});
