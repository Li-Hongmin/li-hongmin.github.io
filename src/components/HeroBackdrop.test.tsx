import { fireEvent, render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import HeroBackdrop from "./HeroBackdrop";

const mediaState = vi.hoisted(() => ({ shouldLoadVideo: true }));
vi.mock("../hooks/useHeroMedia", () => ({ useHeroMedia: () => mediaState }));

describe("HeroBackdrop", () => {
  beforeEach(() => { mediaState.shouldLoadVideo = true; });

  it("plays once with inline muted autoplay", () => {
    render(<HeroBackdrop />);
    const video = document.querySelector("video")!;
    expect(video).toHaveAttribute("src", "/media/hero.mp4");
    expect(video).toHaveAttribute("autoplay");
    expect(video).toHaveAttribute("playsinline");
    expect(video).toHaveProperty("muted", true);
    expect(video).not.toHaveAttribute("loop");
  });

  it("omits the source when policy disallows video", () => {
    mediaState.shouldLoadVideo = false;
    render(<HeroBackdrop />);
    expect(document.querySelector("video")).not.toHaveAttribute("src");
  });

  it("preserves the final-frame poster when video fails", () => {
    render(<HeroBackdrop />);
    const video = document.querySelector("video")!;
    expect(video).toHaveAttribute("poster", "/media/hero-poster.webp");
    fireEvent.error(video);
    expect(video).toHaveClass("hero-video--failed");
  });

  it("reveals the floating copy only after the video has settled", () => {
    const onVideoSettled = vi.fn();
    render(<HeroBackdrop onVideoSettled={onVideoSettled} />);
    fireEvent.ended(document.querySelector("video")!);
    expect(onVideoSettled).toHaveBeenCalledTimes(1);
  });

  it("reveals the copy immediately when the video is not used", () => {
    mediaState.shouldLoadVideo = false;
    const onVideoSettled = vi.fn();
    render(<HeroBackdrop onVideoSettled={onVideoSettled} />);
    expect(onVideoSettled).toHaveBeenCalledTimes(1);
  });
});
