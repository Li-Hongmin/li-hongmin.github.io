import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const bulletList = (items) => items.map((item) => `- ${item}`).join("\n");
const links = (items = []) => items.map((link) => `[${link.label}](${link.href})`).join(", ");

function renderTimeline(items) {
  return items.map((item) => {
    const context = [item.organization, item.detail].filter(Boolean).join(" — ");
    const suffix = [context, links(item.links)].filter(Boolean).join("; ");
    return `- **${item.date}** | **${item.title}**${suffix ? ` — ${suffix}` : ""}`;
  }).join("\n");
}

function renderPublications(publications) {
  const categories = [
    ["preprint", "Preprints"],
    ["journal", "Journal Articles"],
    ["conference", "Conference Papers"],
  ];
  return categories.map(([category, heading]) => {
    const records = publications.filter((publication) => publication.category === category);
    if (!records.length) return "";
    const rows = records.map((publication) => {
      const authors = publication.authors?.length ? `${publication.authors.join(", ")}. ` : "";
      const resources = links(publication.links);
      return `- **${publication.date}** | ${authors}*“${publication.title}”*. ${publication.venue}.${resources ? ` ${resources}` : ""}`;
    });
    return `### ${heading}\n\n${rows.join("\n\n")}`;
  }).filter(Boolean).join("\n\n");
}

function renderCv(profile) {
  const data = profile.publicProfile;
  const cv = profile.exports.cv;
  const primary = data.experience[0];
  const guest = data.experience[1];
  const affiliation = (item) => `${item.organization}${item.links?.[0] ? ` ([${item.links[0].label}](${item.links[0].href}))` : ""}`;
  const skillSections = Object.entries(data.skills).map(([heading, items]) => `### ${heading}\n${bulletList(items)}`).join("\n\n");

  return `# ${cv.title}\n\n**Email:** ${data.email.replace("@", "[at]")}\n\n**Primary Affiliation:** ${affiliation(primary)}\n\n**Guest Affiliation:** ${affiliation(guest)}\n\n---\n\n## Research Interests\n\n${bulletList(data.researchInterests)}\n\n---\n\n## Education\n\n${renderTimeline(data.education)}\n\n---\n\n## Academic & industry appointments\n\n${renderTimeline(data.experience)}\n\n---\n\n## Research funding & computing support\n\n${renderTimeline(data.grants)}\n\n---\n\n## Publications\n\n${renderPublications(data.publications)}\n\n---\n\n## Conference presentations\n\n${renderTimeline(data.activities)}\n\n---\n\n## Peer Review Activities\n\n${renderTimeline(data.peerReview)}\n\n---\n\n## Honors & fellowships\n\n${renderTimeline(data.awards)}\n\n---\n\n## Skills\n\n${skillSections}\n\n---\n\n*Last Updated: ${data.lastUpdated}*\n`;
}

function renderHomepageProfile(publicProfile) {
  const homepage = structuredClone(publicProfile);
  delete homepage.researchInterests;
  delete homepage.skills;
  for (const category of ["publications", "experience", "grants", "activities", "awards", "education", "peerReview"]) {
    homepage[category] = homepage[category]
      .filter((record) => record.homepage !== false)
      .map(({ authors, category: publicationCategory, homepage: destination, ...record }) => record);
  }
  return homepage;
}

function renderResearchmap(profile) {
  const copy = profile.exports.researchmap;
  const conflicts = profile.conflicts.map(
    (conflict) => `- **${conflict.field}**: canonical \`${conflict.canonicalValue}\` vs researchmap \`${conflict.researchmapValue}\` — **pending conflict; do not auto-sync**`,
  );

  return `# researchmap update proposal\n\n> Proposal only. No external account has been changed. Every item remains behind the external update gate.\n\n## Sync checklist\n\n${bulletList(copy.syncChecklist)}\n\n## Current public-profile differences (snapshot: 2026-07-13)\n\n${bulletList(copy.differences)}\n\nPublic-page absence means only “not page-visible in the captured snapshot”; it is not proof that a record does not exist.\n\n## Pending conflicts\n\n${conflicts.join("\n")}\n\n## Suggested English summary\n\n${copy.summaryEnglish}\n\n## Suggested Japanese summary\n\n${copy.summaryJapanese}\n\n## Suggested keywords (4)\n\n${bulletList(copy.keywords)}\n\n## Calibration Turn to add after verification\n\n${copy.calibrationTurn}\n\n## Requires authenticated review\n\n${bulletList(copy.loginChecks)}\n`;
}

function renderLinkedIn(profile) {
  const copy = profile.exports.linkedin;
  const featured = copy.featured.map((item, index) => `${index + 1}. [${item.title}](${item.url})`).join("\n");

  return `# LinkedIn update proposal\n\n> Proposal only. No LinkedIn account has been changed.\n\n**LinkedIn profile URL:** pending confirmation\n\n## Headline\n\n${copy.headline}\n\n## About\n\n${copy.about}\n\n## Featured (4 items)\n\n${featured}\n\n## Calibration Turn promotion post draft\n\n${copy.postDraft}\n\n## External update gate\n\nConfirm the profile URL, resolve pending conflicts, review the draft in the authenticated UI, and obtain explicit approval before publishing.\n`;
}

export function generateProfileArtifacts(profile) {
  return new Map([
    ["apps/homepage/src/generated/profile.json", `${JSON.stringify(renderHomepageProfile(profile.publicProfile), null, 2)}\n`],
    ["exports/cv.md", renderCv(profile)],
    ["exports/researchmap.md", renderResearchmap(profile)],
    ["exports/linkedin.md", renderLinkedIn(profile)],
  ]);
}

export async function readCanonicalProfile(root = repositoryRoot) {
  return JSON.parse(await readFile(resolve(root, "profile/profile.json"), "utf8"));
}

export async function writeProfileArtifacts(root = repositoryRoot) {
  const artifacts = generateProfileArtifacts(await readCanonicalProfile(root));
  for (const [relativePath, content] of artifacts) {
    const destination = resolve(root, relativePath);
    await mkdir(dirname(destination), { recursive: true });
    await writeFile(destination, content);
  }
  return artifacts;
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  const artifacts = await writeProfileArtifacts();
  console.log(`Generated ${artifacts.size} profile artifacts.`);
}
