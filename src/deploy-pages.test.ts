import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const workflow = readFileSync(resolve(process.cwd(), ".github/workflows/deploy-pages.yml"), "utf8");

describe("GitHub Pages deployment workflow", () => {
  it("verifies every required static artifact after the build", () => {
    expect(workflow).toContain("- run: npm run build");
    expect(workflow).toContain("test -f dist/index.html");
    expect(workflow).toContain("test -f dist/cv.html");
    expect(workflow).toContain("test -f dist/files/CREST_2025_poster.pdf");
    expect(workflow).toContain("test -f dist/media/hero.mp4");
    expect(workflow).toContain("test -f dist/media/hero-poster.webp");
    expect(workflow).toContain("test -f dist/og.png");
    expect(workflow).toContain("grep -Fq '/#full-cv' dist/cv.html");
  });
});
