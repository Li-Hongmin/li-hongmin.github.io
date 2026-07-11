import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { shouldLoadHeroVideo, useHeroMedia } from "./useHeroMedia";

afterEach(() => vi.restoreAllMocks());

describe("hero media policy", () => {
  it("loads video only at 900px or wider without reduced motion", () => {
    expect(shouldLoadHeroVideo(899, false)).toBe(false);
    expect(shouldLoadHeroVideo(900, false)).toBe(true);
    expect(shouldLoadHeroVideo(1440, true)).toBe(false);
  });

  it("reacts to viewport and reduced-motion changes", () => {
    const resizeListeners = new Set<() => void>();
    const motionListeners = new Set<() => void>();
    const motionQuery = {
      matches: false,
      addEventListener: vi.fn((_type: string, listener: () => void) => motionListeners.add(listener)),
      removeEventListener: vi.fn((_type: string, listener: () => void) => motionListeners.delete(listener)),
    };
    Object.defineProperty(window, "innerWidth", { value: 1200, writable: true });
    window.matchMedia = vi.fn().mockReturnValue(motionQuery);
    vi.spyOn(window, "addEventListener").mockImplementation((type, listener) => {
      if (type === "resize") resizeListeners.add(listener as () => void);
    });
    vi.spyOn(window, "removeEventListener").mockImplementation((type, listener) => {
      if (type === "resize") resizeListeners.delete(listener as () => void);
    });

    const { result, unmount } = renderHook(() => useHeroMedia());
    expect(result.current.shouldLoadVideo).toBe(true);
    act(() => {
      window.innerWidth = 700;
      resizeListeners.forEach((listener) => listener());
    });
    expect(result.current.shouldLoadVideo).toBe(false);
    act(() => {
      window.innerWidth = 1200;
      motionQuery.matches = true;
      motionListeners.forEach((listener) => listener());
    });
    expect(result.current.shouldLoadVideo).toBe(false);
    unmount();
    expect(resizeListeners.size).toBe(0);
    expect(motionListeners.size).toBe(0);
  });
});
