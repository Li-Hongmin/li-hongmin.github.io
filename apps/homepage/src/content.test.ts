import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { profile } from "./data/profile";

const cv = readFileSync(resolve(process.cwd(), "../../exports/cv.md"), "utf8");
const calibrationTitle = "The Calibration Turn in AI-Assisted Research: A Conceptual and Methodological Framework for Evidence-Licensed Claims";

describe("generated public record", () => {
  it("keeps the complete current CV semantics in the generated export", () => {
    expect(cv).toContain(calibrationTitle);
    expect(cv).toContain("arXiv preprint · 2606.31273 [cs.LG]");
    expect(cv).toContain("https://arxiv.org/abs/2606.31273");
    expect(cv).toContain("https://github.com/Li-Hongmin/calibration-turn-ai-assisted-research");
    expect(cv).toContain("Poster presentation — JST CREST BioDX Area Meeting");
    expect(cv).toContain("Google Cloud TPU Builders Award");
    expect(cv.match(/Google Cloud TPU Builders Award/g)).toHaveLength(1);
    expect(cv).toContain("USD 5,500 in Google Cloud computing credits");
    expect(cv).toContain("Development of a Large-Scale Language Model Integrating RNA Sequences and Text");
    expect(cv).toContain("JPY 4.42 million");
    expect(cv).toContain("Google research support");
    expect(cv).toContain("Biological sequence optimization");
    expect(cv).toContain("Machine Learning Engineer** — HAOMO.AI — Autonomous-driving project · 蓝色空间领航者");
    expect(cv).toContain("Presentation — JST SPRING recipients event");
    expect(cv).not.toContain("Oral presentation — SPRING Fellowship");
    expect(cv).not.toMatch(/Senior|Lead/);
    expect(cv).toContain("Last Updated: July 2026");
    expect(cv).toContain("Computer Science (Information Systems Engineering)");
    expect(cv).toContain("2017.04 — 2019.03");
    expect(cv).toContain("Electronic Information Engineering");
    expect(cv).toContain("Ningxia University");
    for (const heading of [
      "## Academic & industry appointments",
      "## Research funding & computing support",
      "## Conference presentations",
      "## Honors & fellowships",
    ]) expect(cv).toContain(heading);
  });

  it("serves Calibration Turn and the current funding record from generated JSON", () => {
    expect(profile.publications[0].title).toBe(calibrationTitle);
    expect(profile.grants.filter((item) => item.id === "google-cloud-tpu-builders-2026")).toHaveLength(1);
    expect(profile.lastUpdated).toBe("July 2026");
  });
});