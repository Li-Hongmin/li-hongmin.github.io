import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { generateProfileArtifacts } from "./generate.mjs";
import { validateProfile } from "./validate.mjs";

const root = new URL("../../", import.meta.url);
const loadProfile = async () => JSON.parse(await readFile(new URL("profile/profile.json", root), "utf8"));
const clone = (value) => structuredClone(value);

test("generator emits every derived artifact and preserves homepage data exactly", async () => {
  const profile = await loadProfile();
  const artifacts = generateProfileArtifacts(profile);

  assert.deepEqual([...artifacts.keys()].sort(), [
    "apps/homepage/src/generated/profile.json",
    "exports/cv.md",
    "exports/linkedin.md",
    "exports/researchmap.md",
  ]);
  const homepage = JSON.parse(artifacts.get("apps/homepage/src/generated/profile.json"));
  assert.equal(homepage.activities.length, 13);
  assert.deepEqual(
    homepage.experience.find((item) => item.id === "haomo-engineer"),
    {
      id: "haomo-engineer",
      date: "2022.10 — 2023.5",
      title: "Machine Learning Engineer",
      organization: "HAOMO.AI",
      detail: "Autonomous-driving project · 蓝色空间领航者",
    },
  );
  assert.equal(
    homepage.activities.find((item) => item.id === "spring-fellowship-2022").title,
    "Presentation — JST SPRING recipients event",
  );
  assert.equal("researchInterests" in homepage, false);
  assert.equal("authors" in homepage.publications[0], false);
  assert.equal(homepage.publications[0].title, profile.publicProfile.publications[0].title);
  assert.match(artifacts.get("exports/cv.md"), /Curriculum Vitae - Li Hongmin/);
  assert.match(artifacts.get("exports/researchmap.md"), /pending conflict/i);
  assert.match(artifacts.get("exports/linkedin.md"), /pending confirmation/i);
});

test("canonical profile preserves the University of Tokyo postdoctoral appointment details", async () => {
  const profile = await loadProfile();

  assert.deepEqual(
    profile.publicProfile.experience.find((item) => item.id === "utokyo-researcher"),
    {
      id: "utokyo-researcher",
      date: "2022.4 — 2022.10",
      title: "Postdoctoral Researcher",
      organization: "The University of Tokyo",
      links: [
        {
          label: "Details",
          href: "http://asailab.cb.k.u-tokyo.ac.jp/2022/04/05/new-postdoc/",
        },
      ],
    },
  );
});

test("CV is rendered from publicProfile records without a duplicate markdown fact store", async () => {
  const profile = await loadProfile();
  assert.equal("cvMarkdown" in profile.exports, false);

  const changed = clone(profile);
  const originalTitle = changed.publicProfile.publications[0].title;
  changed.publicProfile.publications[0].title = "Changed canonical publication title";
  const cv = generateProfileArtifacts(changed).get("exports/cv.md");
  assert.match(cv, /Changed canonical publication title/);
  assert.equal(cv.includes(originalTitle), false);
});

test("CV includes every structured record and link", async () => {
  const profile = await loadProfile();
  const cv = generateProfileArtifacts(profile).get("exports/cv.md");
  for (const collection of ["publications", "experience", "grants", "activities", "awards", "education", "peerReview"]) {
    for (const record of profile.publicProfile[collection]) {
      assert(cv.includes(record.title), `${collection}.${record.id} title missing from CV`);
      assert(cv.includes(record.date), `${collection}.${record.id} date missing from CV`);
      for (const link of record.links ?? []) assert(cv.includes(link.href), `${collection}.${record.id} link missing from CV`);
    }
  }
});

test("CV publication sections use descending numeric dates", async () => {
  const profile = await loadProfile();
  const cv = generateProfileArtifacts(profile).get("exports/cv.md");
  for (const category of ["preprint", "journal", "conference"]) {
    const heading = { preprint: "Preprints", journal: "Journal Articles", conference: "Conference Papers" }[category];
    const section = cv.split(`### ${heading}\n\n`)[1].split(/\n\n### |\n\n---/)[0];
    const dates = [...section.matchAll(/^- \*\*(\d{4}(?:\.\d{1,2})?)\*\* \|/gm)].map((match) => match[1]);
    const expected = profile.publicProfile.publications.filter((item) => item.category === category)
      .map((item) => item.date).sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));
    assert.deepEqual(dates, expected, `${heading} is out of order`);
  }
});

test("APBJC 2024 poster links to the single FastUMAP publication", async () => {
  const profile = await loadProfile();
  const poster = profile.publicProfile.activities.find((record) => record.id === "apbjc24");
  const publications = profile.publicProfile.publications.filter((record) => record.id === "fastumap");

  assert.equal(poster.title, "Poster presentation — FastUMAP at the Asia-Pacific Bioinformatics Joint Conference 2024");
  assert.equal(poster.detail, "Early conference presentation of the work later developed into the FastUMAP preprint");
  assert.deepEqual(poster.links.map(({ label }) => label), ["Event", "Paper"]);
  assert.equal(
    poster.links.find(({ label }) => label === "Paper").href,
    publications[0].links.find(({ label }) => label === "arXiv").href,
  );
  assert.equal(publications.length, 1);
});

test("RNA Informatics Dojo 2025 talk links to the single ID3 publication and code", async () => {
  const profile = await loadProfile();
  const talk = profile.publicProfile.activities.find((record) => record.id === "rna-dojo-2025");
  const publications = profile.publicProfile.publications.filter((record) => record.id === "gradient-based-optimization");
  const publication = publications[0];

  assert.equal(talk.title, "Oral presentation — Input Data Differentiable Designer (ID3) at RNA Informatics Dojo 2025");
  assert.equal(
    talk.detail,
    "Early presentation of the method later developed into the preprint “Gradient-based Optimization for mRNA Sequence Design”",
  );
  assert.deepEqual(talk.links.map(({ label }) => label), ["Event", "Paper", "Code"]);
  assert.equal(
    talk.links.find(({ label }) => label === "Paper").href,
    publication.links.find(({ label }) => label === "Preprint").href,
  );
  assert.equal(
    talk.links.find(({ label }) => label === "Code").href,
    publication.links.find(({ label }) => label === "Code").href,
  );
  assert.equal(publications.length, 1);
});

test("workspace lifecycle hooks generate for dev and reject stale data before checked commands", async () => {
  const packageJson = JSON.parse(await readFile(new URL("package.json", root), "utf8"));
  assert.equal(packageJson.scripts.predev, "npm run profile:generate");
  assert.equal(packageJson.scripts.prebuild, "npm run profile:check");
  assert.equal(packageJson.scripts["prebuild:sites"], "npm run profile:check");
  assert.equal(packageJson.scripts.pretypecheck, "npm run profile:check");
});

test("canonical profile passes validation", async () => {
  assert.deepEqual(validateProfile(await loadProfile()), []);
});

test("validator rejects duplicate IDs and malformed URLs", async () => {
  const profile = clone(await loadProfile());
  profile.publicProfile.publications[1].id = profile.publicProfile.publications[0].id;
  profile.sources[0].url = "not a URL";

  const errors = validateProfile(profile);
  assert(errors.some((error) => error.includes("duplicate id")));
  assert(errors.some((error) => error.includes("valid http(s) URL")));
});

test("validator enforces category exclusivity and pending conflicts", async () => {
  const profile = clone(await loadProfile());
  profile.publicProfile.awards.push(profile.publicProfile.grants[0]);
  profile.conflicts[0].status = "resolved";

  const errors = validateProfile(profile);
  assert(errors.some((error) => error.includes("mutually exclusive")));
  assert(errors.some((error) => error.includes("must remain pending")));
});

test("validator requires evidence for dates and amounts", async () => {
  const profile = clone(await loadProfile());
  profile.assertions.push({
    id: "unsupported-amount",
    field: "funding.amount",
    value: "USD 1,000",
    date: "2026.07",
    status: "verified",
    destinations: ["cv"],
    evidence: [],
  });

  const errors = validateProfile(profile);
  assert(errors.some((error) => error.includes("date/amount assertion requires evidence")));
});

test("validator rejects empty funding evidence and malformed platform profile URLs", async () => {
  const profile = clone(await loadProfile());
  profile.evidence[0].sources = [];
  profile.platforms.linkedin.profileUrl = "not a URL";

  const errors = validateProfile(profile);
  assert(errors.some((error) => error.includes("amount/date evidence is missing or invalid")));
  assert(errors.some((error) => error.includes("profileUrl must be a valid http(s) URL")));
});

test("validator blocks disputed assertions from homepage", async () => {
  const profile = clone(await loadProfile());
  profile.assertions.push({
    id: "disputed-homepage",
    field: "experience.date",
    value: "2022.11 — 2023.4",
    status: "disputed",
    destinations: ["homepage"],
    evidence: ["researchmap-public-2026-07-13"],
  });

  const errors = validateProfile(profile);
  assert(errors.some((error) => error.includes("disputed assertion cannot target homepage")));
});
