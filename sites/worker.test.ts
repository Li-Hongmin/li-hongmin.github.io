import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
import worker from "./worker.js";

describe("Sites static worker", () => {
  it("returns a non-404 static asset response unchanged", async () => {
    const response = new Response("asset", { status: 200 });
    const assets = { fetch: vi.fn().mockResolvedValue(response) };
    const request = new Request("https://example.com/assets/logo.svg");

    await expect(worker.fetch(request, { ASSETS: assets })).resolves.toBe(response);
    expect(assets.fetch).toHaveBeenCalledTimes(1);
    expect(assets.fetch).toHaveBeenCalledWith(request);
  });

  it("falls back to index.html for an HTML navigation missing from static assets", async () => {
    const fallback = new Response("app shell", { status: 200 });
    const assets = {
      fetch: vi.fn().mockResolvedValueOnce(new Response(null, { status: 404 })).mockResolvedValueOnce(fallback),
    };
    const request = new Request("https://example.com/research", {
      headers: { Accept: "text/html,application/xhtml+xml" },
    });

    await expect(worker.fetch(request, { ASSETS: assets })).resolves.toBe(fallback);
    expect(assets.fetch).toHaveBeenCalledTimes(2);
    expect(new URL(assets.fetch.mock.calls[1][0].url).pathname).toBe("/index.html");
  });

  it("does not fall back for a missing image", async () => {
    const missing = new Response(null, { status: 404 });
    const assets = { fetch: vi.fn().mockResolvedValue(missing) };
    const request = new Request("https://example.com/media/missing.webp", {
      headers: { Accept: "image/avif,image/webp,*/*" },
    });

    await expect(worker.fetch(request, { ASSETS: assets })).resolves.toBe(missing);
    expect(assets.fetch).toHaveBeenCalledTimes(1);
  });
});

describe("Sites build contract", () => {
  it("keeps the normal build and wires build:sites to preparation", () => {
    const packageJson = JSON.parse(readFileSync(resolve(process.cwd(), "package.json"), "utf8"));
    const prepareScript = readFileSync(resolve(process.cwd(), "scripts/prepare-sites.mjs"), "utf8");

    expect(packageJson.scripts.build).toBe("tsc -b && vite build");
    expect(packageJson.scripts["build:sites"]).toBe("npm run build && node scripts/prepare-sites.mjs");
    expect(prepareScript).toContain('"dist", "server", "index.js"');
    expect(prepareScript).toContain('"dist", ".openai", "hosting.json"');
    expect(prepareScript).toContain('"sites", "worker.js"');
    expect(prepareScript).toContain('".openai", "hosting.json"');
  });
});
