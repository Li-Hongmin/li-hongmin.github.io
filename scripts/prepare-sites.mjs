import { copyFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workerSource = resolve(projectRoot, "sites", "worker.js");
const hostingSource = resolve(projectRoot, ".openai", "hosting.json");
const workerDestination = resolve(projectRoot, "dist", "server", "index.js");
const hostingDestination = resolve(projectRoot, "dist", ".openai", "hosting.json");

await mkdir(dirname(workerDestination), { recursive: true });
await mkdir(dirname(hostingDestination), { recursive: true });
await copyFile(workerSource, workerDestination);
await copyFile(hostingSource, hostingDestination);
