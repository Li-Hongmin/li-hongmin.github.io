import { copyFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const hostingSource = resolve(projectRoot, ".openai", "hosting.json");
const hostingDestination = resolve(projectRoot, "dist", ".openai", "hosting.json");

await mkdir(dirname(hostingDestination), { recursive: true });
await copyFile(hostingSource, hostingDestination);
