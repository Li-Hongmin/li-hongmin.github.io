import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const amountPattern = /\b(?:USD|JPY)\s*[\d,.]+/i;

function walk(value, visit, path = "profile") {
  if (Array.isArray(value)) {
    value.forEach((item, index) => walk(item, visit, `${path}[${index}]`));
    return;
  }
  if (!value || typeof value !== "object") return;
  visit(value, path);
  for (const [key, child] of Object.entries(value)) walk(child, visit, `${path}.${key}`);
}

function validUrl(value, allowRootRelative = false) {
  if (allowRootRelative && value.startsWith("/")) return true;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function validateProfile(profile) {
  const errors = [];
  for (const field of ["publicProfile", "sources", "conflicts", "platforms"]) {
    if (profile?.[field] == null) errors.push(`missing required field: ${field}`);
  }
  if (errors.length) return errors;

  const ids = new Map();
  walk(profile, (object, path) => {
    if (typeof object.id === "string") {
      if (ids.has(object.id)) errors.push(`duplicate id \"${object.id}\" at ${path}; first seen at ${ids.get(object.id)}`);
      else ids.set(object.id, path);
    }
    for (const [key, value] of Object.entries(object)) {
      if ((key === "url" || key === "href" || key === "profileUrl") && value != null && (typeof value !== "string" || !validUrl(value, key === "href"))) {
        errors.push(`${path}.${key} must be a valid http(s) URL${key === "href" ? " or root-relative path" : ""}`);
      }
    }
  });

  const categories = ["publications", "experience", "grants", "activities", "awards", "education", "peerReview"];
  const categoryById = new Map();
  for (const category of categories) {
    for (const item of profile.publicProfile[category] ?? []) {
      const prior = categoryById.get(item.id);
      if (prior && prior !== category) errors.push(`id \"${item.id}\" appears in mutually exclusive categories ${prior} and ${category}`);
      else categoryById.set(item.id, category);
    }
  }

  const sourceIds = new Set(profile.sources.map((source) => source.id));
  for (const conflict of profile.conflicts) {
    if (conflict.status !== "pending" || conflict.autoSync !== false) errors.push(`conflict ${conflict.id} must remain pending with autoSync=false`);
    if (!Array.isArray(conflict.evidence) || conflict.evidence.length < 2 || conflict.evidence.some((id) => !sourceIds.has(id))) {
      errors.push(`conflict ${conflict.id} must cite valid evidence from both sides`);
    }
  }

  for (const assertion of profile.assertions ?? []) {
    const evidence = Array.isArray(assertion.evidence) ? assertion.evidence : [];
    if ((assertion.date || amountPattern.test(String(assertion.value))) && (evidence.length === 0 || evidence.some((id) => !sourceIds.has(id)))) {
      errors.push(`assertion ${assertion.id}: date/amount assertion requires evidence`);
    }
    if (assertion.status === "disputed" && assertion.destinations?.includes("homepage")) {
      errors.push(`assertion ${assertion.id}: disputed assertion cannot target homepage`);
    }
  }

  const evidenceByTarget = new Map((profile.evidence ?? []).map((entry) => [entry.targetId, entry]));
  for (const grant of profile.publicProfile.grants ?? []) {
    const fields = ["date", ...(amountPattern.test(grant.detail ?? "") ? ["amount"] : [])];
    const evidence = evidenceByTarget.get(grant.id);
    if (
      !evidence ||
      fields.some((field) => !evidence.fields?.includes(field)) ||
      !Array.isArray(evidence.sources) ||
      evidence.sources.length === 0 ||
      evidence.sources.some((id) => !sourceIds.has(id))
    ) {
      errors.push(`grant ${grant.id}: amount/date evidence is missing or invalid`);
    }
  }

  return errors;
}

export async function validateCanonicalProfile(root = repositoryRoot) {
  const profile = JSON.parse(await readFile(resolve(root, "profile/profile.json"), "utf8"));
  return validateProfile(profile);
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  const errors = await validateCanonicalProfile();
  if (errors.length) {
    console.error(errors.map((error) => `- ${error}`).join("\n"));
    process.exitCode = 1;
  } else {
    console.log("Profile validation passed.");
  }
}
