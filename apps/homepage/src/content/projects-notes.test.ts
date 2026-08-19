import { describe, expect, it } from "vitest";
import { projects } from "./projects";
import { researchNotes } from "./notes";

describe("public projects and research notes", () => {
  it("leads with AlphaScience and keeps all project links public", () => {
    expect(projects[0]).toMatchObject({ id: "alphascience", href: "/projects/alphascience/" });
    expect(projects).toHaveLength(4);
    for (const project of projects) {
      expect(project.summary.length).toBeGreaterThan(80);
      expect(project.signals.length).toBeGreaterThanOrEqual(3);
      for (const link of project.links) expect(link.href).toMatch(/^(\/|https:\/\/)/);
    }
  });

  it("ships three substantial dated notes with explicit evidence status", () => {
    expect(researchNotes).toHaveLength(3);
    expect(new Set(researchNotes.map((note) => note.slug)).size).toBe(researchNotes.length);
    for (const note of researchNotes) {
      expect(note.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(note.evidenceStatus).toMatch(/note|artifact/i);
      expect(note.sections.length).toBeGreaterThanOrEqual(4);
      expect(note.sections.flatMap((section) => section.paragraphs).join(" ").length).toBeGreaterThan(1500);
    }
  });
});
