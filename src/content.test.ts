import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const cv = readFileSync(resolve(process.cwd(), "cv.md"), "utf8");
const index = readFileSync(resolve(process.cwd(), "index.md"), "utf8");
const calibrationTitle = "The Calibration Turn in AI-Assisted Research: A Conceptual and Methodological Framework for Evidence-Licensed Claims";

describe("public Markdown record", () => {
  it("keeps the current research record and uses the same clear primary headings in the CV and index", () => {
    for (const document of [cv, index]) {
      expect(document).toContain(calibrationTitle);
      expect(document).toContain("arXiv:2606.31273 [cs.LG]");
      expect(document).toContain("https://arxiv.org/abs/2606.31273");
      expect(document).toContain("https://github.com/Li-Hongmin/calibration-turn-ai-assisted-research");
      expect(document).toContain("Poster presentation — JST CREST BioDX Area Meeting");
      expect(document).toContain("Google Cloud TPU Builders Award");
      expect(document.match(/Google Cloud TPU Builders Award/g)).toHaveLength(1);
      expect(document).toContain("USD 5,500 in Google Cloud computing credits");
      expect(document).toContain("Development of a Large-Scale Language Model Integrating RNA Sequences and Text");
      expect(document).toContain("JPY 4.42 million");
      expect(document).toContain("Google research support");
      expect(document).toContain("Biological sequence optimization");
      expect(document).not.toContain("蓝色空间领航者");
      expect(document).toContain("Last Updated: July 2026");
      expect(document).not.toContain("### Research Grants");
      expect(document).toContain("Computer Science (Information Systems Engineering)");
      expect(document).toContain("April 2017 - March 2019");
      expect(document).toContain("Electronic Information Engineering");
      expect(document).toContain("Ningxia University");
      for (const heading of [
        "## Academic & industry appointments",
        "## Research funding & computing support",
        "## Conference presentations",
        "## Honors & fellowships",
      ]) expect(document).toContain(heading);
      expect(document.match(/Doctoral research support — JST SPRING/g)).toHaveLength(1);
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
      "## Publications",
      "## Academic & industry appointments",
      "## Education",
      "## Research funding & computing support",
      "## Conference presentations",
      "## Honors & fellowships",
      "## Peer Review",
      "## Skills",
      "## Contact",
    ]) {
      expect(index).toContain(heading);
    }
    expect(index).not.toContain("## Selected Work");
  });
});
