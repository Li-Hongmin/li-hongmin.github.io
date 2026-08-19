import { cloudflare } from "@cloudflare/vite-plugin";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const page = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  base: "/",
  plugins: [react(), cloudflare({ configPath: "./wrangler.sites.jsonc" })],
  build: {
    rollupOptions: {
      input: {
        home: page("./index.html"),
        projects: page("./projects/index.html"),
        alphaScience: page("./projects/alphascience/index.html"),
        notes: page("./notes/index.html"),
        evidenceLedger: page("./notes/evidence-ledger-before-manuscript/index.html"),
        boundedAgentExecution: page("./notes/bounded-agent-execution/index.html"),
        selectionProcedure: page("./notes/selection-is-part-of-the-procedure/index.html"),
        cognitiveThreadLifetime: page("./notes/how-long-should-a-cognitive-thread-live/index.html"),
      },
    },
  },
});
