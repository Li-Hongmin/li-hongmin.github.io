import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const pages = [
  ["projects/index.html", "https://li-hongmin.github.io/projects/"],
  ["projects/alphascience/index.html", "https://li-hongmin.github.io/projects/alphascience/"],
  ["notes/index.html", "https://li-hongmin.github.io/notes/"],
  ["notes/evidence-ledger-before-manuscript/index.html", "https://li-hongmin.github.io/notes/evidence-ledger-before-manuscript/"],
  ["notes/bounded-agent-execution/index.html", "https://li-hongmin.github.io/notes/bounded-agent-execution/"],
  ["notes/selection-is-part-of-the-procedure/index.html", "https://li-hongmin.github.io/notes/selection-is-part-of-the-procedure/"],
] as const;

describe("project and note metadata", () => {
  it.each(pages)("publishes unique metadata for %s", (relativePath, canonical) => {
    const html = readFileSync(resolve(process.cwd(), relativePath), "utf8");
    expect(html).toContain(`<link rel="canonical" href="${canonical}">`);
    expect(html).toContain(`<meta property="og:url" content="${canonical}">`);
    expect(html).toContain('<meta name="twitter:site" content="@lihongmin_lab">');
    expect(html).toContain('<script type="module" src="/src/main.tsx"></script>');
  });
});

describe("public content boundary", () => {
  it("does not expose internal project-management or local-path material", () => {
    const source = [
      readFileSync(resolve(process.cwd(), "src/content/projects.ts"), "utf8"),
      readFileSync(resolve(process.cwd(), "src/content/notes.ts"), "utf8"),
      readFileSync(resolve(process.cwd(), "src/pages/AlphaSciencePage.tsx"), "utf8"),
    ].join("\n");
    expect(source).not.toContain("app.notion.com");
    expect(source).not.toContain("/Volumes/");
    expect(source).not.toMatch(/稿号|人工确认|本地权威路径/);
  });
});
