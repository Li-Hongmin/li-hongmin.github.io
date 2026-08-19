import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const workflow = readFileSync(resolve(process.cwd(), "../../.github/workflows/deploy-pages.yml"), "utf8");

describe("GitHub Pages deployment workflow", () => {
  it("verifies every required static artifact after the build", () => {
    expect(workflow).toContain("- run: npm run build");
    expect(workflow).toContain("- run: npm run profile:validate");
    expect(workflow).toContain("- run: npm run profile:check");
    expect(workflow).toContain("- run: npm run test:run");
    expect(workflow).toContain("- run: npm run typecheck");
    expect(workflow).toContain("test -f apps/homepage/dist/index.html");
    expect(workflow).toContain("test -f apps/homepage/dist/projects/index.html");
    expect(workflow).toContain("test -f apps/homepage/dist/projects/alphascience/index.html");
    expect(workflow).toContain("test -f apps/homepage/dist/notes/index.html");
    expect(workflow).toContain("test -f apps/homepage/dist/notes/evidence-ledger-before-manuscript/index.html");
    expect(workflow).toContain("test -f apps/homepage/dist/notes/bounded-agent-execution/index.html");
    expect(workflow).toContain("test -f apps/homepage/dist/notes/selection-is-part-of-the-procedure/index.html");
    expect(workflow).toContain("test -f apps/homepage/dist/notes/how-long-should-a-cognitive-thread-live/index.html");
    expect(workflow).toContain("test -f apps/homepage/dist/cv.html");
    expect(workflow).toContain("test -f apps/homepage/dist/files/CREST_2025_poster.pdf");
    expect(workflow).toContain("test -f apps/homepage/dist/media/hero.mp4");
    expect(workflow).toContain("test -f apps/homepage/dist/media/hero-poster.webp");
    expect(workflow).toContain("test -f apps/homepage/dist/og.png");
    expect(workflow).toContain("grep -Fq '/#full-cv' apps/homepage/dist/cv.html");
    expect(workflow).toContain("path: apps/homepage/dist");
  });
});
