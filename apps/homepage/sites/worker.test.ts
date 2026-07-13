import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
import worker from "./worker.js";

describe("Sites static worker", () => {
  it("serves the app shell for an HTML GET navigation", async () => {
    const fallback = new Response("app shell", { status: 200 });
    const assets = { fetch: vi.fn().mockResolvedValue(fallback) };
    const request = new Request("https://example.com/research", {
      headers: { Accept: "text/html,application/xhtml+xml" },
    });

    await expect(worker.fetch(request, { ASSETS: assets })).resolves.toBe(fallback);
    expect(assets.fetch).toHaveBeenCalledTimes(1);
    const [assetRequest] = assets.fetch.mock.calls[0];
    expect(assetRequest).toBeInstanceOf(Request);
    expect(assetRequest).not.toBe(request);
    expect(new URL(assetRequest.url).pathname).toBe("/index.html");
    expect(assetRequest.method).toBe("GET");
    expect(assetRequest.headers.get("Accept")).toBe("text/html,application/xhtml+xml");
    expect(assetRequest.signal).not.toBe(request.signal);
  });

  it("returns an empty 404 without fetching assets for a missing image", async () => {
    const assets = { fetch: vi.fn() };
    const request = new Request("https://example.com/media/missing.webp", {
      headers: { Accept: "image/avif,image/webp,*/*" },
    });

    const response = await worker.fetch(request, { ASSETS: assets });

    expect(response.status).toBe(404);
    await expect(response.text()).resolves.toBe("");
    expect(assets.fetch).not.toHaveBeenCalled();
  });

  it("returns an empty 404 without fetching assets for a non-GET request", async () => {
    const assets = { fetch: vi.fn() };
    const request = new Request("https://example.com/research", {
      method: "POST",
      headers: { Accept: "text/html" },
    });

    const response = await worker.fetch(request, { ASSETS: assets });

    expect(response.status).toBe(404);
    await expect(response.text()).resolves.toBe("");
    expect(assets.fetch).not.toHaveBeenCalled();
  });
});

describe("Sites build contract", () => {
  it("keeps the GitHub Pages build separate and generates the Cloudflare Sites worker output", () => {
    const packageJson = JSON.parse(readFileSync(resolve(process.cwd(), "package.json"), "utf8"));
    const viteConfig = readFileSync(resolve(process.cwd(), "vite.config.ts"), "utf8");
    const sitesViteConfig = readFileSync(resolve(process.cwd(), "vite.sites.config.ts"), "utf8");
    const wranglerConfig = readFileSync(resolve(process.cwd(), "wrangler.sites.jsonc"), "utf8");
    const prepareScript = readFileSync(resolve(process.cwd(), "scripts/prepare-sites.mjs"), "utf8");

    expect(packageJson.scripts.build).toBe("tsc -b && vite build");
    expect(viteConfig).not.toContain("@cloudflare/vite-plugin");
    expect(packageJson.scripts["build:sites"]).toBe(
      "tsc -b && vite build --config vite.sites.config.ts && node scripts/prepare-sites.mjs",
    );
    expect(sitesViteConfig).toContain('import { cloudflare } from "@cloudflare/vite-plugin"');
    expect(sitesViteConfig).toContain("plugins: [react(), cloudflare({ configPath: \"./wrangler.sites.jsonc\" })]");
    expect(wranglerConfig).toContain('"name": "server"');
    expect(wranglerConfig).toContain('"compatibility_date": "2026-05-22"');
    expect(wranglerConfig).toContain('"main": "./sites/worker.js"');
    expect(wranglerConfig).toContain('"binding": "ASSETS"');
    expect(wranglerConfig).toContain('"not_found_handling": "single-page-application"');
    expect(prepareScript).not.toContain('"dist", "server", "index.js"');
    expect(prepareScript).toContain('"dist", ".openai", "hosting.json"');
    expect(prepareScript).toContain('".openai", "hosting.json"');
  });
});
