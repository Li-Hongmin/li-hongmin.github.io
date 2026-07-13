import { describe, expect, it } from "vitest";
import { profile } from "./profile";

describe("profile data", () => {
  it("reports the July 2026 content refresh in the footer metadata", () => {
    expect(profile.lastUpdated).toBe("July 2026");
  });

  it("preserves the verified identity and content counts", () => {
    expect(profile.name).toBe("Hongmin Li");
    expect(profile.email).toBe("lihongmin@edu.k.u-tokyo.ac.jp");
    expect(profile.selectedWork).toHaveLength(4);
    expect(profile.publications).toHaveLength(16);
    expect(profile.experience).toHaveLength(5);
    expect(profile.grants).toHaveLength(4);
    expect(profile.activities).toHaveLength(3);
    expect(profile.awards).toHaveLength(5);
    expect(profile.education).toHaveLength(3);
    expect(profile.peerReview).toHaveLength(8);
  });

  it("uses unique ids and valid publication links", () => {
    const ids = profile.publications.map((publication) => publication.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const publication of profile.publications) {
      expect(publication.links.length).toBeGreaterThan(0);
      for (const link of publication.links) expect(link.href).toMatch(/^https?:\/\//);
    }
  });

  it("places the Calibration Turn preprint first as a featured publication", () => {
    expect(profile.publications[0]).toEqual({
      id: "calibration-turn-ai-assisted-research",
      date: "2026.06",
      title: "The Calibration Turn in AI-Assisted Research: A Conceptual and Methodological Framework for Evidence-Licensed Claims",
      venue: "arXiv preprint · 2606.31273 [cs.LG]",
      links: [
        { label: "arXiv", href: "https://arxiv.org/abs/2606.31273" },
        { label: "Code & artifacts", href: "https://github.com/Li-Hongmin/calibration-turn-ai-assisted-research" },
      ],
      featured: true,
    });
  });

  it("keeps education limited to the facts stated in the CV", () => {
    expect(profile.education).toEqual([
      { id: "phd", date: "March 2022", title: "Ph.D. in Computer Science", organization: "University of Tsukuba" },
      { id: "masters", date: "", title: "Master's in Computer Science", organization: "University of Tsukuba" },
      { id: "bachelors", date: "", title: "Bachelor's in Computer Science" },
    ]);
  });

  it("keeps the selected work claim-safe", () => {
    expect(profile.selectedWork.map((work) => work.id)).toEqual([
      "id3", "mrna-gpt", "fastumap", "targeted-tests",
    ]);
  });

  it("records the verified year for each selected work item", () => {
    expect(profile.selectedWork.map(({ id, year }) => ({ id, year }))).toEqual([
      { id: "id3", year: 2025 },
      { id: "mrna-gpt", year: 2025 },
      { id: "fastumap", year: 2026 },
      { id: "targeted-tests", year: 2026 },
    ]);
  });

  it("includes the public Google Cloud TPU Builders Award in funding and awards", () => {
    const expectedAward = expect.objectContaining({
      id: "google-cloud-tpu-builders-2026",
      date: "2026.06",
      title: "Google Cloud TPU Builders Award",
      detail: "USD 5,500 in GCP credits for TPU-based AI and scientific workflow experiments",
    });

    expect(profile.grants).toContainEqual(expectedAward);
    expect(profile.awards).toContainEqual(expectedAward);
  });
});
