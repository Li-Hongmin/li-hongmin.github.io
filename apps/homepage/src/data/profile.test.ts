import { describe, expect, it } from "vitest";
import { profile } from "./profile";

describe("profile data", () => {
  it("reports the July 2026 content refresh in the footer metadata", () => {
    expect(profile.lastUpdated).toBe("July 2026");
  });

  it("preserves the verified identity and content counts", () => {
    expect(profile.name).toBe("Hongmin Li");
    expect(profile.email).toBe("lihongmin@edu.k.u-tokyo.ac.jp");
    expect(profile.x).toBe("https://x.com/lihongmin_lab");
    expect(profile.publications).toHaveLength(17);
    expect(profile.experience).toHaveLength(5);
    expect(profile.grants).toHaveLength(4);
    expect(profile.activities).toHaveLength(13);
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
      title: "Oral presentation — Input Data Differentiable Designer (ID3) at RNA Informatics Dojo 2025",
      detail: "Early presentation of the method later developed into the preprint “Gradient-based Optimization for mRNA Sequence Design”",
    }));
    expect(profile.activities[3]).toEqual(expect.objectContaining({
      title: "Poster presentation — FastUMAP at the Asia-Pacific Bioinformatics Joint Conference 2024",
      detail: "Early conference presentation of the work later developed into the FastUMAP preprint",
    }));
    expect(profile.activities.find((item) => item.id === "spring-fellowship-2022")?.title).toBe("Presentation — JST SPRING recipients event");
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

  it("keeps the 2024 and 2026 KAKENHI projects distinct under one grant name", () => {
    const grants = profile.grants.filter((grant) => grant.id.startsWith("kakenhi-"));
    const grant2024 = grants.find((grant) => grant.id === "kakenhi-2024");
    const grant2026 = grants.find((grant) => grant.id === "kakenhi-2026");

    expect(grants).toHaveLength(2);
    expect(grant2024?.id).not.toBe(grant2026?.id);
    expect(grant2024?.date).not.toBe(grant2026?.date);
    expect(grant2024?.title).toBe(grant2026?.title);
    expect(grant2024).toEqual({
      id: "kakenhi-2024",
      date: "2024.4",
      title: "Grant-in-Aid for Early-Career Scientists (KAKENHI)",
      detail: "Development of a Large-Scale Language Model Integrating RNA Sequences and Text · ¥4,420,000",
      links: [{ label: "Project info", href: "https://kaken.nii.ac.jp/grant/KAKENHI-PROJECT-24K20890/" }],
    });
    expect(grant2026).toEqual({
      id: "kakenhi-2026",
      date: "2026.04",
      title: "Grant-in-Aid for Early-Career Scientists (KAKENHI)",
      detail: "Development of an Input Data Differentiable Integrated Framework (ID3) for Biomolecular Sequence Design · ¥4,550,000",
      links: [{ label: "Project info", href: "https://kaken.nii.ac.jp/en/grant/KAKENHI-PROJECT-26K21370/" }],
    });
  });

  it("uses official categories, project scopes, and amounts for other funding", () => {
    expect(profile.grants).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: "google-grant-2025",
        title: "Google research support",
        detail: "Biological sequence optimization · USD 30,000",
      }),
    ]));
  });

  it("names legacy honors by competition or conference before award level", () => {
    const legacyAwards = profile.awards.filter(({ id }) => [
      "aeta-second-prize",
      "analysys-special-award",
      "cbdcom-best-paper",
    ].includes(id));

    expect(legacyAwards).toEqual([
      expect.objectContaining({
        id: "aeta-second-prize",
        title: "AETA Earthquake Prediction AI Algorithm Competition 2019 — Second Prize",
        detail: "Second-place recognition for an AI model predicting earthquakes from real-time monitoring data · awarded in 2020",
      }),
      expect.objectContaining({
        id: "analysys-special-award",
        title: "3rd Analysys International Algorithm Competition — Special Award",
        detail: "Special recognition in the website page-view and unique-visitor prediction task",
      }),
      expect.objectContaining({
        id: "cbdcom-best-paper",
        title: "IEEE International Conference on Cloud and Big Data Computing 2018 — Best Paper Award",
        detail: "Awarded for “Large Scale Spectral Clustering Using Sparse Representation Based on Hubness”",
      }),
    ]);
    expect(legacyAwards.map(({ title }) => title)).toEqual([
      "AETA Earthquake Prediction AI Algorithm Competition 2019 — Second Prize",
      "3rd Analysys International Algorithm Competition — Special Award",
      "IEEE International Conference on Cloud and Big Data Computing 2018 — Best Paper Award",
    ]);
    expect(legacyAwards.every(({ title }) => !/^(Second Prize|Special Award|Best Paper Award)\b/.test(title))).toBe(true);
  });

  it("describes the HAOMO role and project without inventing seniority", () => {
    expect(profile.experience.find((item) => item.id === "haomo-engineer")).toEqual({
      id: "haomo-engineer",
      date: "2022.10 — 2023.5",
      title: "Machine Learning Engineer",
      organization: "HAOMO.AI",
      detail: "Autonomous-driving project · 蓝色空间领航者",
    });
  });
});
