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
    expect(profile.awards).toHaveLength(4);
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

  it("describes conference presentations in clear English without changing APBJC to oral", () => {
    expect(profile.activities[0]).toEqual({
      id: "crest-biodx-5th-meeting-2026",
      date: "2026.06.09",
      title: "Poster presentation — JST CREST BioDX Area Meeting",
      detail: "5th area meeting · Numazu, Japan",
    });
    expect(profile.activities[1].title).toBe("Poster presentation — JST CREST BioDX Interim Symposium");
    expect(profile.activities[2]).toEqual(expect.objectContaining({
      title: "Oral presentation — RNA Informatics Dojo 2025",
      detail: "Input Data Differentiable Designer",
    }));
    expect(profile.activities[3].title).toBe("Poster presentation — Asia-Pacific Bioinformatics Joint Conference 2024");
  });

  it("keeps education limited to the facts stated in the CV", () => {
    expect(profile.education).toEqual([
      { id: "phd", date: "2019.04 — 2022.03", title: "Ph.D. in Computer Science (Information Systems Engineering)", organization: "University of Tsukuba" },
      { id: "masters", date: "2017.04 — 2019.03", title: "Master's in Computer Science (Information Systems Engineering)", organization: "University of Tsukuba" },
      { id: "bachelors", date: "2011.09 — 2015.07", title: "Bachelor's in Electronic Information Engineering", organization: "Ningxia University" },
    ]);
  });

  it("keeps TPU cloud credits only with funding and identifies them as non-cash support", () => {
    const expectedSupport = expect.objectContaining({
      id: "google-cloud-tpu-builders-2026",
      date: "2026.06",
      title: "Google Cloud TPU Builders Award",
      detail: "Cloud computing support · USD 5,500 in Google Cloud computing credits",
    });

    expect(profile.grants).toContainEqual(expectedSupport);
    expect(profile.awards).not.toContainEqual(expectedSupport);
    expect(profile.awards.some((award) => award.id === "google-cloud-tpu-builders-2026")).toBe(false);
  });

  it("uses official funding categories, project scopes, and amounts", () => {
    expect(profile.grants).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: "kakenhi-2024",
        title: "Grant-in-Aid for Early-Career Scientists (KAKENHI)",
        detail: "Development of a Large-Scale Language Model Integrating RNA Sequences and Text · Total budget: JPY 4.42 million",
      }),
      expect.objectContaining({
        id: "kakenhi-2026",
        title: "Grant-in-Aid for Early-Career Scientists (KAKENHI)",
        detail: "Input Data Differentiable Designer for biomolecular sequence design · JPY 4.55 million",
      }),
      expect.objectContaining({
        id: "google-grant-2025",
        title: "Google research support",
        detail: "Biological sequence optimization · USD 30,000",
      }),
    ]));
  });

  it("presents honors in plain language with their necessary context", () => {
    expect(profile.awards).toEqual([
      expect.objectContaining({ id: "jst-spring", title: "Doctoral research support — JST SPRING", detail: "Support for Pioneering Research Initiated by the Next Generation" }),
      expect.objectContaining({ id: "aeta-second-prize", title: "Second Prize — AETA Earthquake Prediction AI Competition", detail: "2019 competition · awarded in 2020" }),
      expect.objectContaining({ id: "analysys-special-award", title: "Special Award — 3rd Analysys International Algorithm Competition" }),
      expect.objectContaining({ id: "cbdcom-best-paper", title: "Best Paper Award — Cloud and Big Data Computing (CBDCom 2018)", detail: "For “Large Scale Spectral Clustering Using Sparse Representation Based on Hubness”" }),
    ]);
  });

  it("does not add an unverified HAOMO project or research field", () => {
    expect(profile.experience.find((item) => item.id === "haomo-engineer")).toEqual({
      id: "haomo-engineer",
      date: "2022.10 — 2023.5",
      title: "Machine Learning Engineer",
      organization: "HAOMO.AI",
    });
  });
});
