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

test("CV is rendered from publicProfile records without a duplicate markdown fact store", async () => {
  const profile = await loadProfile();
  assert.equal("cvMarkdown" in profile.exports, false);

  const changed = clone(profile);
  changed.publicProfile.publications[0].title = "Changed canonical publication title";
  const cv = generateProfileArtifacts(changed).get("exports/cv.md");
  assert.match(cv, /Changed canonical publication title/);
  assert.doesNotMatch(cv, /The Calibration Turn in AI-Assisted Research:/);
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
