import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const html = readFileSync(resolve(process.cwd(), "index.html"), "utf8");

describe("site metadata", () => {
  it("publishes canonical and social metadata", () => {
    expect(html).toContain("Hongmin Li — AI for Science &amp; Biomolecular Design");
    expect(html).toContain(
      'name="description" content="Hongmin Li builds AI systems for scientific discovery, biomolecular sequence design, and reproducible research workflows."',
    );
    expect(html).toContain('rel="canonical" href="https://li-hongmin.github.io/"');
    expect(html).toContain('property="og:type" content="website"');
    expect(html).toContain(
      'property="og:title" content="Hongmin Li — AI for Science &amp; Biomolecular Design"',
    );
    expect(html).toContain(
      'property="og:description" content="Computational systems that turn scientific questions into testable, reproducible discoveries."',
    );
    expect(html).toContain('property="og:url" content="https://li-hongmin.github.io/"');
    expect(html).toContain('property="og:image" content="https://li-hongmin.github.io/og.png"');
    expect(html).toContain('name="twitter:card" content="summary_large_image"');
    expect(html).toContain('name="twitter:site" content="@lihongmin_lab"');
    expect(html).toContain('name="twitter:creator" content="@lihongmin_lab"');
    expect(html).toContain(
      'name="twitter:title" content="Hongmin Li — AI for Science &amp; Biomolecular Design"',
    );
    expect(html).toContain(
      'name="twitter:description" content="Computational systems that turn scientific questions into testable, reproducible discoveries."',
    );
    expect(html).toContain('name="twitter:image" content="https://li-hongmin.github.io/og.png"');
  });
});
