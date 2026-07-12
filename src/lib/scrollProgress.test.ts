import { describe, expect, it } from "vitest";
import { getLaunchProgress } from "./scrollProgress";

describe("getLaunchProgress", () => {
  it("clamps launch progress to the zero-to-one range", () => {
    expect(getLaunchProgress(-40, 1000)).toBe(0);
    expect(getLaunchProgress(0, 1000)).toBe(0);
    expect(getLaunchProgress(250, 1000)).toBe(0.25);
    expect(getLaunchProgress(1000, 1000)).toBe(1);
    expect(getLaunchProgress(1800, 1000)).toBe(1);
  });

  it("returns zero when the viewport height is invalid", () => {
    expect(getLaunchProgress(100, 0)).toBe(0);
    expect(getLaunchProgress(100, -1)).toBe(0);
  });
});
