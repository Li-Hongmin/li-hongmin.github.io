import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const cv = readFileSync(resolve(process.cwd(), "cv.md"), "utf8");
const index = readFileSync(resolve(process.cwd(), "index.md"), "utf8");
const calibrationTitle = "The Calibration Turn in AI-Assisted Research: A Conceptual and Methodological Framework for Evidence-Licensed Claims";

describe("public Markdown record", () => {
  it("keeps the Calibration Turn, CREST poster, TPU Builders Award, and July 2026 current in the CV and index", () => {
    for (const document of [cv, index]) {
      expect(document).toContain(calibrationTitle);
      expect(document).toContain("arXiv:2606.31273 [cs.LG]");
      expect(document).toContain("https://arxiv.org/abs/2606.31273");
      expect(document).toContain("https://github.com/Li-Hongmin/calibration-turn-ai-assisted-research");
      expect(document).toContain("CREST バイオDX第5回領域会議");
      expect(document).toContain("Google Cloud TPU Builders Award");
      expect(document).toContain("Last Updated: July 2026");
      expect(document).not.toContain("### Research Grants");
    }
  });

  it("replaces the retired activity-stream index with the complete current record", () => {
    expect(index).not.toContain("## Recent Activities");
    expect(index).not.toContain("My current research interests center on");
    expect(index).not.toContain("Received Google Cloud TPU Builders Awards totaling");
    expect(index).not.toContain("Posted *\"Targeted Tests for LLM Reasoning");
    for (const heading of [
      "## Research Interests",
      "## Featured Paper",
      "## Selected Work",
      "## Publications",
      "## Professional Experience",
      "## Education",
      "## Funding & Support",
      "## Conference Activities",
      "## Awards & Fellowship",
      "## Peer Review",
      "## Skills",
      "## Contact",
    ]) {
      expect(index).toContain(heading);
    }
  });
});
