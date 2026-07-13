import { describe, expect, it } from "vitest";
import { profile } from "./profile";

describe("profile data", () => {
  it("reports the July 2026 content refresh in the footer metadata", () => {
    expect(profile.lastUpdated).toBe("July 2026");
  });

  it("preserves the verified identity and content counts", () => {
    expect(profile.name).toBe("Hongmin Li");
    expect(profile.email).toBe("lihongmin@edu.k.u-tokyo.ac.jp");
    expect(profile.publications).toHaveLength(16);
    expect(profile.experience).toHaveLength(5);
    expect(profile.grants).toHaveLength(4);
    expect(profile.activities).toHaveLength(4);
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

  it("places the June 2026 CREST BioDX fifth-area-meeting poster first without unverified links", () => {
    expect(profile.activities[0]).toEqual({
      id: "crest-biodx-5th-meeting-2026",
      date: "2026.06.09",
      title: "Poster · CREST バイオDX第5回領域会議",
      organization: "沼津",
    });
  });

  it("keeps education limited to the facts stated in the CV", () => {
    expect(profile.education).toEqual([
      { id: "phd", date: "2019.04 — 2022.03", title: "Ph.D. in Computer Science (Information Systems Engineering)", organization: "University of Tsukuba" },
      { id: "masters", date: "2017.04 — 2019.03", title: "Master's in Computer Science (Information Systems Engineering)", organization: "University of Tsukuba" },
      { id: "bachelors", date: "2011.09 — 2015.07", title: "Bachelor's in Electronic Information Engineering", organization: "Ningxia University" },
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
