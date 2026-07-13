# Cinematic Research Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use $superpower-subagents (recommended) or $superpower-executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking via update_plan.

**Goal:** Replace the legacy Jekyll presentation with a cinematic, accessible React portfolio for Hongmin Li, preserving verified research content, legacy public paths, and static-host compatibility.

**Architecture:** Build a single-route Vite + React + TypeScript site whose content lives in one typed `profile.ts` module. The hero loads an optimized self-hosted video only at desktop widths without reduced-motion preference, while every other device receives a poster. Static output is deployed to GitHub Pages by Actions and to Sites as a preview handoff.

**Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS 3, Framer Motion 12, Lucide React, Vitest, Testing Library, FFmpeg, GitHub Pages Actions.

---

## File map

Create or replace these implementation files:

```text
package.json                         scripts and dependencies
package-lock.json                    reproducible dependency lock
index.html                           final metadata and React mount
vite.config.ts                       Vite, React and Vitest configuration
tsconfig.json                        browser TypeScript configuration
tsconfig.app.json                    application and test typing
tsconfig.node.json                   Vite configuration typing
tailwind.config.ts                   Tailwind content and tokens
postcss.config.cjs                   Tailwind/PostCSS pipeline
.gitignore                           generated-file exclusions
.github/workflows/deploy-pages.yml  GitHub Pages build and deploy
public/cv.html                       legacy /cv.html compatibility page
public/files/CREST_2025_poster.pdf  preserved public poster path
public/media/hero.mp4                optimized desktop hero video
public/media/hero-poster.webp        mobile/reduced-motion fallback
public/og.png                        generated social card
src/main.tsx                         React bootstrap
src/App.tsx                          page composition only
src/App.test.tsx                     end-to-end component contract
src/test/setup.ts                    Testing Library setup
src/data/profile.ts                  sole runtime content source
src/data/profile.test.ts             content/provenance contract
src/hooks/useHeroMedia.ts            responsive/reduced-motion media gate
src/hooks/useHeroMedia.test.ts       media-gate tests
src/components/Hero.tsx              cinematic hero and navigation
src/components/Hero.test.tsx         hero behavior/accessibility tests
src/components/ResearchVision.tsx    about and research vision
src/components/ResearchAreas.tsx     three core research themes
src/components/SelectedWork.tsx      four featured projects
src/components/Publications.tsx      selected and complete publication record
src/components/Recognition.tsx       experience, funding and activities
src/components/Contact.tsx           contact and permanently visible full CV
src/styles/globals.css               visual system and responsive behavior
src/styles/globals.test.ts            static visual-contract test
```

Retain `index.md` and `cv.md` only as migration records. Remove no scientific source text during this implementation.

### Task 1: Scaffold the tested React application

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Create: `tsconfig.node.json`
- Create: `tailwind.config.ts`
- Create: `postcss.config.cjs`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/App.test.tsx`
- Create: `src/test/setup.ts`
- Create: `src/styles/globals.css`
- Modify: `.gitignore`

- [ ] **Step 1: Add package metadata and install the approved stack**

Use this `package.json` contract:

```json
{
  "name": "hongmin-li-research-portfolio",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:run": "vitest run",
    "typecheck": "tsc -b --pretty false"
  },
  "dependencies": {
    "framer-motion": "^12.38.0",
    "lucide-react": "^0.344.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.1.0",
    "@testing-library/user-event": "^14.5.2",
    "@types/react": "^18.3.18",
    "@types/react-dom": "^18.3.5",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "jsdom": "^25.0.1",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.7.2",
    "vite": "^5.4.14",
    "vitest": "^2.1.9"
  }
}
```

Run:

```bash
npm install
```

Expected: `package-lock.json` is created and install exits 0.

- [ ] **Step 2: Write the failing application smoke test**

Create `src/App.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders Hongmin Li's portfolio shell", () => {
    render(<App />);
    expect(screen.getByRole("heading", { level: 1, name: "HONGMIN LI" })).toBeInTheDocument();
  });
});
```

Create `src/test/setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 3: Configure Vite, Vitest, TypeScript and Tailwind**

Create `vite.config.ts`:

```ts
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  base: "/",
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    css: true,
  },
});
```

Create `tailwind.config.ts`:

```ts
import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: { extend: {} },
  plugins: [],
} satisfies Config;
```

Create `postcss.config.cjs`:

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

Create `tsconfig.json`:

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

Create `tsconfig.app.json` and add it to the file map:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  },
  "include": ["src"]
}
```

Create `tsconfig.node.json`:

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "allowImportingTsExtensions": true
  },
  "include": ["vite.config.ts", "tailwind.config.ts"]
}
```

- [ ] **Step 4: Run the smoke test and verify the intended failure**

Run:

```bash
npm run test:run -- src/App.test.tsx
```

Expected: FAIL because `App` or the `HONGMIN LI` heading does not exist.

- [ ] **Step 5: Add the minimal application shell**

Create `src/App.tsx`:

```tsx
export default function App() {
  return (
    <main>
      <h1>HONGMIN LI</h1>
    </main>
  );
}
```

Create `src/main.tsx`:

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

Create `src/styles/globals.css` with Tailwind directives and a minimal reset:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

*, *::before, *::after { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { margin: 0; min-width: 320px; background: #0a0a0a; }
```

Create `index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hongmin Li — AI for Science &amp; Biomolecular Design</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Create `.gitignore` with exactly:

```text
node_modules/
dist/
.vite/
coverage/
.DS_Store
```

- [ ] **Step 6: Verify and commit the scaffold**

Run:

```bash
npm run test:run -- src/App.test.tsx
npm run typecheck
```

Expected: both commands exit 0.

Commit:

```bash
git add package.json package-lock.json index.html vite.config.ts tsconfig.json tsconfig.node.json tailwind.config.ts postcss.config.cjs .gitignore src
git commit -m "build: scaffold tested React portfolio"
```

### Task 2: Establish the typed profile content source

**Files:**
- Create: `src/data/profile.ts`
- Create: `src/data/profile.test.ts`

- [ ] **Step 1: Write the failing data provenance tests**

Create `src/data/profile.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { profile } from "./profile";

describe("profile data", () => {
  it("preserves the verified identity and content counts", () => {
    expect(profile.name).toBe("Hongmin Li");
    expect(profile.email).toBe("lihongmin@edu.k.u-tokyo.ac.jp");
    expect(profile.researchAreas).toHaveLength(3);
    expect(profile.selectedWork).toHaveLength(4);
    expect(profile.publications).toHaveLength(15);
    expect(profile.grants).toHaveLength(3);
  });

  it("uses unique ids and valid external links", () => {
    const ids = profile.publications.map((publication) => publication.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const publication of profile.publications) {
      expect(publication.links.length).toBeGreaterThan(0);
      for (const link of publication.links) {
        expect(link.href).toMatch(/^https?:\/\//);
      }
    }
  });

  it("keeps the selected work claim-safe", () => {
    expect(profile.selectedWork.map((work) => work.id)).toEqual([
      "id3",
      "mrna-gpt",
      "fastumap",
      "targeted-tests",
    ]);
  });
});
```

- [ ] **Step 2: Run the data tests and verify failure**

Run:

```bash
npm run test:run -- src/data/profile.test.ts
```

Expected: FAIL because `profile.ts` does not exist.

- [ ] **Step 3: Define the exact runtime types**

Create these exported types in `src/data/profile.ts`:

```ts
export type ExternalLink = { label: string; href: string };
export type ResearchArea = { id: string; title: string; description: string };
export type SelectedWork = {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  links: ExternalLink[];
};
export type Publication = {
  id: string;
  date: string;
  title: string;
  venue: string;
  links: ExternalLink[];
  featured: boolean;
};
export type TimelineItem = {
  id: string;
  date: string;
  title: string;
  organization?: string;
  detail?: string;
  links?: ExternalLink[];
};
```

Define `profile` with these required top-level fields:

```ts
export const profile = {
  name: "Hongmin Li",
  displayName: "HONGMIN LI",
  email: "lihongmin@edu.k.u-tokyo.ac.jp",
  github: "https://github.com/Li-Hongmin",
  statement:
    "I build computational systems that turn scientific questions into testable, reproducible discoveries.",
  vision:
    "Scientific AI should turn ambitious questions into evidence others can test.",
  affiliation:
    "Researcher at the Institute of Science Tokyo and Guest Researcher at The University of Tokyo.",
  researchAreas: [] as ResearchArea[],
  selectedWork: [] as SelectedWork[],
  publications: [] as Publication[],
  experience: [] as TimelineItem[],
  grants: [] as TimelineItem[],
  activities: [] as TimelineItem[],
  awards: [] as TimelineItem[],
  education: [] as TimelineItem[],
  peerReview: [] as TimelineItem[],
} as const;

export type Profile = typeof profile;
```

- [ ] **Step 4: Migrate the verified content one-to-one**

Use `index.md` lines 3, 18–24, 26–41, 43–51, 55–67 and 80–83 plus `cv.md` lines 19–33 as the only factual source. Apply this exact mapping:

```text
index.md 27–41  -> 15 Publication objects in the same order
index.md 46–48  -> 3 grant TimelineItem objects
index.md 56–58  -> 3 featured activity TimelineItem objects
index.md 81–83 and cv.md 118 -> 4 award/scholarship TimelineItem objects
cv.md 29–33 -> 5 experience TimelineItem objects
cv.md 21–23 -> 3 education TimelineItem objects
index.md 71–78 -> 8 peer-review TimelineItem objects
```

Set `featured: true` only for the six publications named in the design specification. Use stable lowercase kebab-case ids derived from the short title. Preserve every existing URL verbatim.

Use these exact selected-work descriptions:

```ts
const selectedWork: SelectedWork[] = [
  {
    id: "id3",
    title: "ID3",
    eyebrow: "Biomolecular design",
    description: "A differentiable framework for biomolecular sequence design.",
    links: [
      { label: "Preprint", href: "https://doi.org/10.1101/2025.10.22.683691" },
      { label: "Code", href: "https://github.com/Li-Hongmin/ID3" },
    ],
  },
  {
    id: "mrna-gpt",
    title: "mRNA-GPT",
    eyebrow: "RNA language models",
    description: "A generative mRNA language foundation model for coding sequence design.",
    links: [{ label: "Preprint", href: "https://doi.org/10.64898/2025.12.22.695962" }],
  },
  {
    id: "fastumap",
    title: "FastUMAP",
    eyebrow: "Scalable representation learning",
    description: "Scalable dimensionality reduction through bipartite landmark sampling.",
    links: [{ label: "arXiv", href: "https://arxiv.org/abs/2605.11428" }],
  },
  {
    id: "targeted-tests",
    title: "Targeted Tests for LLM Reasoning",
    eyebrow: "Reliable AI evaluation",
    description: "An audit-constrained protocol for controlled LLM reasoning evaluation.",
    links: [{ label: "arXiv", href: "https://arxiv.org/abs/2605.11599" }],
  },
];
```

- [ ] **Step 5: Verify content tests and commit**

Run:

```bash
npm run test:run -- src/data/profile.test.ts
```

Expected: PASS with 15 publications and no duplicate ids.

Commit:

```bash
git add src/data/profile.ts src/data/profile.test.ts
git commit -m "feat: migrate verified portfolio content"
```

### Task 3: Gate hero video loading by capability

**Files:**
- Create: `src/hooks/useHeroMedia.ts`
- Create: `src/hooks/useHeroMedia.test.ts`

- [ ] **Step 1: Write failing pure-policy and hook tests**

Create `src/hooks/useHeroMedia.test.ts`:

```ts
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { shouldLoadHeroVideo, useHeroMedia } from "./useHeroMedia";

describe("hero media policy", () => {
  it("loads video only at 900px or wider without reduced motion", () => {
    expect(shouldLoadHeroVideo(899, false)).toBe(false);
    expect(shouldLoadHeroVideo(900, false)).toBe(true);
    expect(shouldLoadHeroVideo(1440, true)).toBe(false);
  });

  it("reacts to viewport changes", () => {
    const listeners = new Set<() => void>();
    Object.defineProperty(window, "innerWidth", { value: 1200, writable: true });
    window.matchMedia = vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
    vi.spyOn(window, "addEventListener").mockImplementation((type, listener) => {
      if (type === "resize") listeners.add(listener as () => void);
    });
    vi.spyOn(window, "removeEventListener").mockImplementation((type, listener) => {
      if (type === "resize") listeners.delete(listener as () => void);
    });

    const { result } = renderHook(() => useHeroMedia());
    expect(result.current.shouldLoadVideo).toBe(true);
    act(() => {
      window.innerWidth = 700;
      for (const listener of listeners) listener();
    });
    expect(result.current.shouldLoadVideo).toBe(false);
  });
});
```

- [ ] **Step 2: Verify the tests fail**

Run:

```bash
npm run test:run -- src/hooks/useHeroMedia.test.ts
```

Expected: FAIL because the hook does not exist.

- [ ] **Step 3: Implement the media policy with listener cleanup**

Create `src/hooks/useHeroMedia.ts`:

```ts
import { useEffect, useState } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export function shouldLoadHeroVideo(width: number, reducedMotion: boolean) {
  return width >= 900 && !reducedMotion;
}

function readPolicy() {
  if (typeof window === "undefined") return false;
  return shouldLoadHeroVideo(
    window.innerWidth,
    window.matchMedia(REDUCED_MOTION_QUERY).matches,
  );
}

export function useHeroMedia() {
  const [shouldLoadVideo, setShouldLoadVideo] = useState(readPolicy);

  useEffect(() => {
    const motionQuery = window.matchMedia(REDUCED_MOTION_QUERY);
    const update = () => setShouldLoadVideo(readPolicy());
    window.addEventListener("resize", update, { passive: true });
    motionQuery.addEventListener("change", update);
    update();
    return () => {
      window.removeEventListener("resize", update);
      motionQuery.removeEventListener("change", update);
    };
  }, []);

  return { shouldLoadVideo };
}
```

- [ ] **Step 4: Verify and commit**

Run:

```bash
npm run test:run -- src/hooks/useHeroMedia.test.ts
```

Expected: PASS.

Commit:

```bash
git add src/hooks
git commit -m "feat: gate cinematic video by motion and viewport"
```

### Task 4: Build the cinematic hero

**Files:**
- Create: `src/components/Hero.tsx`
- Create: `src/components/Hero.test.tsx`

- [ ] **Step 1: Write the failing hero contract tests**

Create `src/components/Hero.test.tsx`:

```tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { profile } from "../data/profile";
import Hero from "./Hero";

const mediaState = vi.hoisted(() => ({ shouldLoadVideo: true }));
vi.mock("../hooks/useHeroMedia", () => ({
  useHeroMedia: () => mediaState,
}));

describe("Hero", () => {
  beforeEach(() => { mediaState.shouldLoadVideo = true; });

  it("renders one-line identity, navigation and light CTA", () => {
    render(<Hero profile={profile} />);
    expect(screen.getByRole("heading", { level: 1, name: "HONGMIN LI" })).toBeInTheDocument();
    for (const name of ["About", "Research", "Publications", "Contact"]) {
      expect(screen.getByRole("link", { name })).toBeInTheDocument();
    }
    expect(screen.getByRole("link", { name: "Explore research" })).toHaveAttribute("href", "#about");
  });

  it("loads the video source only when policy permits", () => {
    const { rerender } = render(<Hero profile={profile} />);
    expect(document.querySelector("video")).toHaveAttribute("src", "/media/hero.mp4");
    mediaState.shouldLoadVideo = false;
    rerender(<Hero profile={profile} />);
    expect(document.querySelector("video")).not.toHaveAttribute("src");
  });

  it("falls back to the poster when video fails", () => {
    render(<Hero profile={profile} />);
    const video = document.querySelector("video")!;
    fireEvent.error(video);
    expect(video).toHaveClass("hero-video--failed");
  });
});
```

- [ ] **Step 2: Verify hero tests fail**

Run:

```bash
npm run test:run -- src/components/Hero.test.tsx
```

Expected: FAIL because `Hero.tsx` does not exist.

- [ ] **Step 3: Implement the minimal accessible hero**

Create `src/components/Hero.tsx` with this structure:

```tsx
import { motion } from "framer-motion";
import { useState } from "react";
import type { Profile } from "../data/profile";
import { useHeroMedia } from "../hooks/useHeroMedia";

type HeroProps = { profile: Profile };

const navItems = [
  ["About", "#about"],
  ["Research", "#research"],
  ["Publications", "#publications"],
  ["Contact", "#contact"],
] as const;

export default function Hero({ profile }: HeroProps) {
  const { shouldLoadVideo } = useHeroMedia();
  const [videoFailed, setVideoFailed] = useState(false);

  return (
    <section className="hero" id="top" aria-labelledby="page-title">
      <div className="hero-poster" aria-hidden="true" />
      <video
        className={`hero-video${videoFailed ? " hero-video--failed" : ""}`}
        src={shouldLoadVideo ? "/media/hero.mp4" : undefined}
        poster="/media/hero-poster.webp"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        onError={() => setVideoFailed(true)}
      />
      <div className="hero-copy-shade" aria-hidden="true" />
      <header className="hero-header">
        <a className="monogram" href="#top" aria-label="Hongmin Li, home">H/L</a>
        <nav aria-label="Primary navigation">
          <ul className="hero-nav">
            {navItems.map(([label, href]) => (
              <li key={href}><a href={href}>{label}</a></li>
            ))}
          </ul>
        </nav>
      </header>
      <motion.div
        className="hero-content"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1 id="page-title" className="hero-name">{profile.displayName}</h1>
        <div className="hero-intro">
          <p>{profile.statement}</p>
          <a className="hero-cta" href="#about" aria-label="Explore research">Explore research <span aria-hidden="true">↘</span></a>
        </div>
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 4: Verify and commit the hero**

Run:

```bash
npm run test:run -- src/components/Hero.test.tsx
```

Expected: PASS.

Commit:

```bash
git add src/components/Hero.tsx src/components/Hero.test.tsx
git commit -m "feat: add cinematic minimal hero"
```

### Task 5: Compose the research, publication and CV sections

**Files:**
- Create: `src/components/ResearchVision.tsx`
- Create: `src/components/ResearchAreas.tsx`
- Create: `src/components/SelectedWork.tsx`
- Create: `src/components/Publications.tsx`
- Create: `src/components/Recognition.tsx`
- Create: `src/components/Contact.tsx`
- Modify: `src/App.tsx`
- Modify: `src/App.test.tsx`

- [ ] **Step 1: Replace the smoke test with the complete page contract**

Extend `src/App.test.tsx`:

```tsx
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("portfolio page", () => {
  it("renders the approved information architecture", () => {
    render(<App />);
    expect(screen.getByRole("heading", { level: 1, name: "HONGMIN LI" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Research directions" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Selected work" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Publications" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Experience & recognition" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Let's build testable science." })).toBeInTheDocument();
  });

  it("exposes verified work, legacy assets and the full CV anchor", () => {
    render(<App />);
    const work = screen.getByLabelText("Selected work");
    for (const title of ["ID3", "mRNA-GPT", "FastUMAP", "Targeted Tests for LLM Reasoning"]) {
      expect(within(work).getByText(title)).toBeInTheDocument();
    }
    expect(screen.getByRole("heading", { name: "Full CV / Record" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "CREST 2025 poster" })).toHaveAttribute(
      "href",
      "/files/CREST_2025_poster.pdf",
    );
    expect(screen.getByRole("link", { name: "Email Hongmin Li" })).toHaveAttribute(
      "href",
      "mailto:lihongmin@edu.k.u-tokyo.ac.jp",
    );
  });
});
```

- [ ] **Step 2: Run the page tests and verify failure**

Run:

```bash
npm run test:run -- src/App.test.tsx
```

Expected: FAIL on the first missing section heading.

- [ ] **Step 3: Implement focused section components**

Use semantic sections and data mapping only:

```tsx
// src/components/ResearchVision.tsx
export default function ResearchVision({ vision, affiliation }: { vision: string; affiliation: string }) {
  return (
    <section className="vision-section" id="about" aria-labelledby="vision-heading">
      <p className="section-kicker">Research vision</p>
      <h2 id="vision-heading">{vision}</h2>
      <p className="vision-affiliation">{affiliation}</p>
    </section>
  );
}
```

`ResearchAreas.tsx` renders an ordered list inside `<section id="research">`; `SelectedWork.tsx` renders four `<article>` elements and external links; `Publications.tsx` renders six featured rows followed by `<details>` containing all 15 rows; `Recognition.tsx` renders experience, grants and activities in three labeled lists; `Contact.tsx` renders the email/GitHub actions and a permanently visible `Full CV / Record` containing experience, education, grants, awards and peer-review activity.

For external links, use `target="_blank" rel="noreferrer"`. Use the exact visible link label `CREST 2025 poster` for the local PDF.

- [ ] **Step 4: Compose the page without adding client state**

Replace `src/App.tsx` with:

```tsx
import Contact from "./components/Contact";
import Hero from "./components/Hero";
import Publications from "./components/Publications";
import Recognition from "./components/Recognition";
import ResearchAreas from "./components/ResearchAreas";
import ResearchVision from "./components/ResearchVision";
import SelectedWork from "./components/SelectedWork";
import { profile } from "./data/profile";

export default function App() {
  return (
    <main>
      <Hero profile={profile} />
      <div className="hero-transition" aria-hidden="true" />
      <ResearchVision vision={profile.vision} affiliation={profile.affiliation} />
      <ResearchAreas areas={profile.researchAreas} />
      <SelectedWork work={profile.selectedWork} />
      <Publications publications={profile.publications} />
      <Recognition profile={profile} />
      <Contact profile={profile} />
    </main>
  );
}
```

- [ ] **Step 5: Verify and commit the content surface**

Run:

```bash
npm run test:run -- src/App.test.tsx
```

Expected: PASS.

Commit:

```bash
git add src/App.tsx src/App.test.tsx src/components
git commit -m "feat: add research portfolio sections"
```

### Task 6: Implement the approved visual and responsive system

**Files:**
- Modify: `src/styles/globals.css`
- Create: `src/styles/globals.test.ts`

- [ ] **Step 1: Write the failing static visual-contract test**

Create `src/styles/globals.test.ts`:

```ts
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync(new URL("./globals.css", import.meta.url), "utf8");

describe("approved visual contract", () => {
  it("contains the cinematic hero, responsive breakpoint and reduced motion", () => {
    expect(css).toContain("height: 100svh");
    expect(css).toContain("clamp(6rem, 11.2vw, 11.125rem)");
    expect(css).toContain("@media (max-width: 899px)");
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
    expect(css).toContain("saturate(1.08) contrast(1.03)");
  });

  it("does not reintroduce rejected decoration", () => {
    for (const rejected of ["orbit", "dot-grid", "coordinates", "magnet", "metric-strip"]) {
      expect(css).not.toContain(rejected);
    }
  });
});
```

- [ ] **Step 2: Verify the visual test fails**

Run:

```bash
npm run test:run -- src/styles/globals.test.ts
```

Expected: FAIL because the final visual rules do not exist.

- [ ] **Step 3: Implement the hero design tokens and layout**

Use these exact root tokens:

```css
:root {
  color: #181817;
  background: #0a0a0a;
  font-family: -apple-system, BlinkMacSystemFont, "Inter", "Helvetica Neue", Arial, sans-serif;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  --ink: #181817;
  --paper: #f2f0eb;
  --night: #0a0a0a;
  --white: #ffffff;
  --line: rgba(24, 24, 23, 0.18);
  --gutter: clamp(1.25rem, 3.5vw, 3.5rem);
}
```

Implement `.hero` as `position: relative; isolation: isolate; height: 100svh; min-height: 45rem; overflow: hidden`. Place `.hero-poster` and `.hero-video` at `inset: 0`, `object-fit: cover`, `object-position: center 48%`; give the poster the same WebP as a CSS background. Apply `filter: saturate(1.08) contrast(1.03)` only to the video and poster.

Implement `.hero-copy-shade` as a left-bottom radial/linear gradient no wider than `42.5rem`; it may darken the copy area but must be transparent by the image midpoint. Keep `.hero-name` on one line from 768px upward with `font-size: clamp(6rem, 11.2vw, 11.125rem); font-weight: 580; letter-spacing: -0.065em; white-space: nowrap`.

Place `.hero-intro` in the lower-left with a maximum width of `42rem`. Style `.hero-cta` as an unfilled text link with a 1px underline animation; do not add a pill background.

- [ ] **Step 4: Implement the warm-white editorial sections**

Use `#f2f0eb` section backgrounds, 1px separators, no rounded card containers, and responsive type with `clamp`. Render research areas and publications as full-width rows. Render selected work as four full-width panels with text and links only. The transition between hero and vision is exactly `6.25rem` high, using a dark-to-paper linear gradient.

- [ ] **Step 5: Implement responsive and accessibility rules**

At `max-width: 899px`, hide `.hero-video`, keep the poster, and reframe it at `58% center`. At `max-width: 767px`, allow `.hero-name` to wrap, reduce the navigation to 0.625rem text and 0.65rem gaps, stack all section grids, and keep a minimum 44px interactive target height. Add visible `:focus-visible` outlines.

At `prefers-reduced-motion: reduce`, set animation and transition durations to `0.01ms`, prevent smooth scrolling, and hide the video.

- [ ] **Step 6: Verify style, component and type contracts**

Run:

```bash
npm run test:run
npm run typecheck
```

Expected: all tests pass and typecheck exits 0.

Commit:

```bash
git add src/styles/globals.css src/styles/globals.test.ts
git commit -m "style: apply cinematic minimal visual system"
```

### Task 7: Optimize and self-host the hero media

**Files:**
- Create: `public/media/hero.mp4`
- Create: `public/media/hero-poster.webp`
- Create: `public/files/CREST_2025_poster.pdf`
- Create: `public/cv.html`
- Modify: `.gitignore`

- [ ] **Step 1: Download the authorized source to temporary storage**

Run:

```bash
curl --fail --location --silent --show-error \
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_171521_25968ba2-b594-4b32-aab7-f6b69398a6fa.mp4' \
  --output /tmp/hongmin-hero-source.mp4
ffprobe -v error -show_entries stream=codec_name,width,height -show_entries format=duration \
  -of default=noprint_wrappers=1 /tmp/hongmin-hero-source.mp4
```

Expected: H.264, approximately 1924×1076, approximately 10.04 seconds.

- [ ] **Step 2: Transcode with bounded memory and no audio**

Run:

```bash
mkdir -p public/media
ffmpeg -hide_banner -loglevel error -y -threads 2 \
  -i /tmp/hongmin-hero-source.mp4 -an \
  -vf "scale='min(1920,iw)':-2:flags=lanczos" \
  -c:v libx264 -preset medium -crf 26 -pix_fmt yuv420p \
  -movflags +faststart public/media/hero.mp4
```

Check bytes:

```bash
stat -f '%z' public/media/hero.mp4
```

Expected: at most 7,340,032 bytes. If larger, rerun the same command with `-crf 28`; do not reduce dimensions below 1600px wide.

- [ ] **Step 3: Create the poster**

Run:

```bash
ffmpeg -hide_banner -loglevel error -y -threads 2 \
  -ss 00:00:05 -i /tmp/hongmin-hero-source.mp4 -frames:v 1 \
  -vf "scale='min(1920,iw)':-2:flags=lanczos" \
  -c:v libwebp -quality 82 public/media/hero-poster.webp
```

Expected: a 1920px-or-smaller warm cloud/island frame.

- [ ] **Step 4: Preserve legacy assets and route**

Run:

```bash
mkdir -p public/files
cp files/CREST_2025_poster.pdf public/files/CREST_2025_poster.pdf
```

Create `public/cv.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="refresh" content="0; url=/#contact">
    <link rel="canonical" href="https://li-hongmin.github.io/#contact">
    <title>Hongmin Li — Full CV</title>
  </head>
  <body>
    <p><a href="/#contact">Continue to Hongmin Li's full CV and research record.</a></p>
  </body>
</html>
```

- [ ] **Step 5: Verify media and compatibility files**

Run:

```bash
ffprobe -v error -select_streams a -show_entries stream=index -of csv=p=0 public/media/hero.mp4
ffprobe -v error -show_entries stream=width,height -of csv=p=0 public/media/hero-poster.webp
test -s public/files/CREST_2025_poster.pdf
rg -n '/#contact' public/cv.html
```

Expected: the audio command prints nothing, poster dimensions print successfully, PDF is non-empty, and redirect target is present.

Commit:

```bash
git add public/media public/files public/cv.html .gitignore
git commit -m "feat: self-host optimized cinematic media"
```

### Task 8: Add final SEO metadata and the bespoke social card

**Files:**
- Modify: `index.html`
- Create: `public/og.png`
- Create: `src/seo.test.ts`

- [ ] **Step 1: Write the failing metadata test**

Create `src/seo.test.ts`:

```ts
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");

describe("site metadata", () => {
  it("publishes canonical and social metadata", () => {
    expect(html).toContain("Hongmin Li — AI for Science &amp; Biomolecular Design");
    expect(html).toContain('rel="canonical" href="https://li-hongmin.github.io/"');
    expect(html).toContain('property="og:image" content="https://li-hongmin.github.io/og.png"');
    expect(html).toContain('name="twitter:card" content="summary_large_image"');
  });
});
```

- [ ] **Step 2: Verify metadata test failure**

Run:

```bash
npm run test:run -- src/seo.test.ts
```

Expected: FAIL on canonical or OG metadata.

- [ ] **Step 3: Generate exactly one social-card candidate**

Use the approved image-generation tool with `public/media/hero-poster.webp` as the reference and this exact prompt:

```text
Create a complete 1200×630 social preview card for Hongmin Li's finished AI-for-Science portfolio. Reuse the reference image's vivid deep-blue sky, warm gold cloud edges, floating island and lone laptop researcher, but compose it as a clean cinematic research brand card. Add the exact text "HONGMIN LI" in a smaller single-line modern white sans-serif wordmark and the exact subtitle "AI FOR SCIENCE · BIOMOLECULAR DESIGN". Preserve generous negative space, strong legibility in small link previews, no browser frame, no extra logos, no invented text, no watermark.
```

Inspect the returned image for the two exact text strings. Retry once only if either string is wrong or missing. If the retry is also unusable, omit `og:image` and adjust the test to assert that no generic image is shipped.

- [ ] **Step 4: Wire final metadata**

Add charset, viewport, title, description, canonical, Open Graph and Twitter metadata to `index.html`. Use:

```html
<meta name="description" content="Hongmin Li builds AI systems for scientific discovery, biomolecular sequence design, and reproducible research workflows.">
<link rel="canonical" href="https://li-hongmin.github.io/">
<meta property="og:type" content="website">
<meta property="og:title" content="Hongmin Li — AI for Science &amp; Biomolecular Design">
<meta property="og:description" content="Computational systems that turn scientific questions into testable, reproducible discoveries.">
<meta property="og:url" content="https://li-hongmin.github.io/">
<meta property="og:image" content="https://li-hongmin.github.io/og.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Hongmin Li — AI for Science &amp; Biomolecular Design">
<meta name="twitter:description" content="Computational systems that turn scientific questions into testable, reproducible discoveries.">
<meta name="twitter:image" content="https://li-hongmin.github.io/og.png">
```

- [ ] **Step 5: Verify and commit metadata**

Run:

```bash
npm run test:run -- src/seo.test.ts
if rg -q 'property="og:image"' index.html; then test -s public/og.png; else test ! -e public/og.png; fi
```

Expected: test passes and OG image exists.

Commit:

```bash
git add index.html src/seo.test.ts
if test -e public/og.png; then git add public/og.png; fi
git commit -m "feat: add portfolio sharing metadata"
```

### Task 9: Configure GitHub Pages deployment

**Files:**
- Create: `.github/workflows/deploy-pages.yml`

- [ ] **Step 1: Add the Pages Actions workflow**

Create `.github/workflows/deploy-pages.yml`:

```yaml
name: Deploy portfolio to GitHub Pages

on:
  push:
    branches: [master]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run test:run
      - run: npm run build
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Verify local production output and legacy paths**

Run:

```bash
npm run build
test -f dist/index.html
test -f dist/cv.html
test -f dist/files/CREST_2025_poster.pdf
test -f dist/media/hero.mp4
test -f dist/media/hero-poster.webp
if rg -q 'property="og:image"' dist/index.html; then test -f dist/og.png; else test ! -e dist/og.png; fi
```

Expected: every command exits 0.

- [ ] **Step 3: Commit the deployment workflow**

```bash
git add .github/workflows/deploy-pages.yml
git commit -m "ci: deploy portfolio with GitHub Pages Actions"
```

### Task 10: Perform complete verification and Sites handoff

**Files:**
- Modify only if verification finds a requirement failure.

- [ ] **Step 1: Run the full automated suite**

Run:

```bash
npm run test:run
npm run typecheck
npm run build
git diff --check
```

Expected: all commands exit 0.

- [ ] **Step 2: Run denylist and asset-budget checks**

Run:

```bash
if rg -n -i 'orbit|dot-grid|coordinates|magnet|metric-strip|lorem|coming-soon' src index.html -g '!*.test.ts' -g '!*.test.tsx'; then exit 1; fi
test "$(stat -f '%z' public/media/hero.mp4)" -le 7340032
if test -e public/og.png; then test "$(stat -f '%z' public/og.png)" -le 8388608; fi
ffprobe -v error -select_streams a -show_entries stream=index -of csv=p=0 public/media/hero.mp4
```

Expected: denylist has no product-code hits, size checks exit 0, and FFprobe prints no audio stream.

- [ ] **Step 3: Verify content and compatibility contracts**

Run:

```bash
rg -q 'HONGMIN LI' dist/assets
rg -q 'Scientific AI should turn ambitious questions' dist/assets
rg -q 'Targeted Tests for LLM Reasoning' dist/assets
rg -n '/#contact' dist/cv.html
test -s dist/files/CREST_2025_poster.pdf
```

Expected: key content is present in built output, legacy CV redirects correctly, and the PDF is non-empty.

- [ ] **Step 4: Review the rendered result against the approved V3**

Keep `npm run dev` alive, open the exact Vite Local URL once, and inspect desktop and mobile widths. Confirm:

```text
Desktop: vivid video; one-line HONGMIN LI; no next section visible in the initial viewport.
Mobile: poster only; readable wrapped name; four navigation links fit without horizontal scroll.
All modes: local shade affects only the copy area; CTA is a light text link; no rejected decoration.
Reduced motion: no hero entrance animation and no video request.
```

Fix only failures against these requirements, then rerun Steps 1–3.

- [ ] **Step 5: Deploy a Sites preview and record the handoff URL**

Use the Sites hosting workflow on the verified `dist/` output. Do not change the canonical URL away from `https://li-hongmin.github.io/`. Confirm the returned preview loads the hero poster, assets, CV redirect and PDF path.

- [ ] **Step 6: Commit any final verification fixes**

If and only if Step 4 required source fixes:

```bash
git add src public index.html package-lock.json
git commit -m "fix: close portfolio verification gaps"
```

Finish with a clean working tree and report both the committed branch and the Sites preview URL. Do not push or merge unless separately authorized.

## Verification summary

The implementation is complete only when all of the following are true:

```text
npm run test:run  -> PASS
npm run typecheck -> PASS
npm run build     -> PASS
git diff --check  -> PASS
hero.mp4           <= 7 MiB and contains no audio stream
desktop hero       one-line HONGMIN LI, vivid video, 100svh
mobile hero        poster only, no horizontal overflow
legacy /cv.html    redirects to /#contact
legacy poster PDF  available at /files/CREST_2025_poster.pdf
GitHub workflow    publishes dist/ from master
Sites preview      loads with canonical still pointing to GitHub Pages
```

**Next skill:** `$superpower-subagents`, routed through `$azure-codex-subagent` per repository instructions.
