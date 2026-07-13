import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { generateProfileArtifacts, readCanonicalProfile } from "./generate.mjs";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const profile = await readCanonicalProfile(repositoryRoot);
const expected = generateProfileArtifacts(profile);
const mismatches = [];

for (const [relativePath, generatedContent] of expected) {
  try {
    const committedContent = await readFile(resolve(repositoryRoot, relativePath));
    if (!committedContent.equals(Buffer.from(generatedContent))) mismatches.push(`${relativePath} differs from deterministic output`);
  } catch (error) {
    mismatches.push(`${relativePath} cannot be read: ${error.code ?? error.message}`);
  }
}

if (mismatches.length) {
  console.error(mismatches.map((message) => `- ${message}`).join("\n"));
  console.error("Run npm run profile:generate and review the generated changes.");
  process.exitCode = 1;
} else {
  console.log(`Generated profile check passed (${expected.size} byte-for-byte matches).`);
}
