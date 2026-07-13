# iOS Glass App Shell Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use $superpower-subagents (recommended) or $superpower-executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking via update_plan.

**Goal:** Convert the cinematic portfolio into a stable single-viewport iOS-style glass application whose internal scroller raises and browses the content over a one-shot hero video.

**Architecture:** `HeroBackdrop` owns the fixed one-shot media layer. `GlassAppShell` owns a fixed `100dvh` viewport and one full-screen internal scroll container whose first interactive screen is `Hero` and whose second block is the continuous glass surface. The shell writes a clamped launch-progress CSS variable once per animation frame, while `AppToolbar` supplies sticky in-app navigation and existing content components retain verified data and semantic responsibilities.

**Tech Stack:** React 18, TypeScript, Framer Motion, CSS backdrop filters/custom properties, Vitest, Testing Library, Vite, Cloudflare Sites build.

---

## File map

- Create `src/lib/scrollProgress.ts` — pure clamped launch-progress calculation.
- Create `src/lib/scrollProgress.test.ts` — boundary tests for the progress calculation.
- Create `src/components/AppToolbar.tsx` — sticky iOS-style in-app identity and navigation.
- Create `src/components/GlassAppShell.tsx` — stable viewport, internal scroller, glass surface, and rAF-throttled progress write.
- Create `src/components/GlassAppShell.test.tsx` — shell semantics, navigation, and scroll-progress integration.
- Create `src/components/HeroBackdrop.tsx` — fixed poster/video layer and one-shot fallback.
- Create `src/components/HeroBackdrop.test.tsx` — responsive source, video failure, and non-looping contract.
- Modify `src/components/Hero.tsx` — retain only the interactive launch identity and local copy shade.
- Modify `src/components/Hero.test.tsx` — retain identity/navigation coverage after media extraction.
- Modify `src/App.tsx` — compose `Hero` and existing content inside `GlassAppShell`; remove the old transition band.
- Modify `src/App.test.tsx` — assert the app-style information architecture and absence of the old page transition.
- Create `src/styles/app-shell.css` — viewport, glass surface, sticky toolbar, safe-area, fallback, and responsive behavior.
- Modify `src/styles/globals.css` — convert editorial sections and contact area into compact grouped app views.
- Modify `src/main.tsx` — load the new app-shell stylesheet.
- Regenerate `public/media/hero-poster.webp` — exact final-frame fallback for mobile, reduced motion, and video failure.

---

### Task 1: Launch progress calculation

**Files:**
- Create: `src/lib/scrollProgress.ts`
- Create: `src/lib/scrollProgress.test.ts`

- [ ] **Step 1: Write the failing boundary tests**

```ts
import { describe, expect, it } from "vitest";
import { getLaunchProgress } from "./scrollProgress";

describe("getLaunchProgress", () => {
  it("clamps launch progress to the zero-to-one range", () => {
    expect(getLaunchProgress(-40, 1000)).toBe(0);
    expect(getLaunchProgress(0, 1000)).toBe(0);
    expect(getLaunchProgress(250, 1000)).toBe(0.25);
    expect(getLaunchProgress(1000, 1000)).toBe(1);
    expect(getLaunchProgress(1800, 1000)).toBe(1);
  });

  it("returns zero when the viewport height is invalid", () => {
    expect(getLaunchProgress(100, 0)).toBe(0);
    expect(getLaunchProgress(100, -1)).toBe(0);
  });
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm run test:run -- src/lib/scrollProgress.test.ts`

Expected: FAIL because `src/lib/scrollProgress.ts` does not exist.

- [ ] **Step 3: Add the minimal pure helper**

```ts
export function getLaunchProgress(scrollTop: number, viewportHeight: number) {
  if (viewportHeight <= 0) return 0;
  return Math.min(1, Math.max(0, scrollTop / viewportHeight));
}
```

- [ ] **Step 4: Run the focused test and verify GREEN**

Run: `npm run test:run -- src/lib/scrollProgress.test.ts`

Expected: 2 tests pass.

- [ ] **Step 5: Commit the helper**

```bash
git add src/lib/scrollProgress.ts src/lib/scrollProgress.test.ts
git commit -m "test: define glass launch progress"
```

---

### Task 2: One-shot fixed backdrop and interactive launch identity

**Files:**
- Create: `src/components/HeroBackdrop.test.tsx`
- Create: `src/components/HeroBackdrop.tsx`
- Modify: `src/components/Hero.test.tsx`
- Modify: `src/components/Hero.tsx`
- Modify: `public/media/hero-poster.webp`

- [ ] **Step 1: Write failing fixed-backdrop tests**

Move the media-source and failure tests out of `Hero.test.tsx`, then create `src/components/HeroBackdrop.test.tsx`:

```tsx
import { fireEvent, render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import HeroBackdrop from "./HeroBackdrop";

const mediaState = vi.hoisted(() => ({ shouldLoadVideo: true }));
vi.mock("../hooks/useHeroMedia", () => ({ useHeroMedia: () => mediaState }));

describe("HeroBackdrop", () => {
  beforeEach(() => { mediaState.shouldLoadVideo = true; });

  it("plays once with inline muted autoplay", () => {
    render(<HeroBackdrop />);
    const video = document.querySelector("video")!;
    expect(video).toHaveAttribute("src", "/media/hero.mp4");
    expect(video).toHaveAttribute("autoplay");
    expect(video).toHaveAttribute("playsinline");
    expect(video).toHaveProperty("muted", true);
    expect(video).not.toHaveAttribute("loop");
  });

  it("omits the source when policy disallows video", () => {
    mediaState.shouldLoadVideo = false;
    render(<HeroBackdrop />);
    expect(document.querySelector("video")).not.toHaveAttribute("src");
  });

  it("preserves the final-frame poster when video fails", () => {
    render(<HeroBackdrop />);
    const video = document.querySelector("video")!;
    expect(video).toHaveAttribute("poster", "/media/hero-poster.webp");
    fireEvent.error(video);
    expect(video).toHaveClass("hero-video--failed");
  });
});
```

- [ ] **Step 2: Run backdrop and hero tests and verify RED**

Run: `npm run test:run -- src/components/HeroBackdrop.test.tsx src/components/Hero.test.tsx`

Expected: FAIL because `HeroBackdrop` does not exist.

- [ ] **Step 3: Extract the fixed media layer**

Create `src/components/HeroBackdrop.tsx`:

```tsx
import { useState } from "react";
import { useHeroMedia } from "../hooks/useHeroMedia";

export default function HeroBackdrop() {
  const { shouldLoadVideo } = useHeroMedia();
  const [videoFailed, setVideoFailed] = useState(false);
  return (
    <div className="hero-backdrop" aria-hidden="true">
      <div className="hero-poster" />
      <video
        className={`hero-video${videoFailed ? " hero-video--failed" : ""}`}
        src={shouldLoadVideo && !videoFailed ? "/media/hero.mp4" : undefined}
        poster="/media/hero-poster.webp"
        autoPlay
        muted
        playsInline
        preload="metadata"
        tabIndex={-1}
        onError={() => setVideoFailed(true)}
      />
    </div>
  );
}
```

Remove `useHeroMedia`, `useState`, `.hero-poster`, and `<video>` from `Hero.tsx`. Keep the copy shade, launch header, identity, navigation, statement, and call to action. In `Hero.test.tsx`, remove the old `mediaState` mock plus now-unused `fireEvent`, `beforeEach`, and `vi` imports after moving the media tests. Do not add an `ended` handler that seeks or swaps sources; native non-looping behavior preserves the decoded final frame.

- [ ] **Step 4: Regenerate the poster from the final video frame**

Run:

```bash
ffmpeg -sseof -0.05 -i public/media/hero.mp4 -frames:v 1 -vf "scale='min(1920,iw)':-2" -c:v libwebp -quality 84 -y public/media/hero-poster.webp
```

Then verify:

```bash
file public/media/hero-poster.webp
ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 public/media/hero-poster.webp
```

Expected: a valid WebP with non-zero dimensions and no width above 1920px.

- [ ] **Step 5: Run the hero test and verify GREEN**

Run: `npm run test:run -- src/components/HeroBackdrop.test.tsx src/components/Hero.test.tsx`

Expected: all hero tests pass.

- [ ] **Step 6: Commit the one-shot media contract**

```bash
git add src/components/HeroBackdrop.tsx src/components/HeroBackdrop.test.tsx src/components/Hero.tsx src/components/Hero.test.tsx public/media/hero-poster.webp
git commit -m "feat: stop hero animation on its final frame"
```

---

### Task 3: Stable app viewport, internal scroller, and sticky toolbar

**Files:**
- Create: `src/components/AppToolbar.tsx`
- Create: `src/components/GlassAppShell.tsx`
- Create: `src/components/GlassAppShell.test.tsx`

- [ ] **Step 1: Write the failing shell tests**

Create `src/components/GlassAppShell.test.tsx`:

```tsx
import { fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import GlassAppShell from "./GlassAppShell";

describe("GlassAppShell", () => {
  beforeEach(() => {
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
  });

  afterEach(() => vi.unstubAllGlobals());

  it("renders one labeled internal app scroller and sticky navigation", () => {
    render(<GlassAppShell backdrop={<div>Cloud media</div>} hero={<div id="top">Launch identity</div>}><section id="about">Overview content</section></GlassAppShell>);
    expect(screen.getByText("Cloud media")).toBeInTheDocument();
    expect(screen.getByText("Launch identity")).toBeInTheDocument();
    const scroller = screen.getByRole("main", { name: "Hongmin Li research app" });
    expect(scroller).toHaveAttribute("tabindex", "0");
    const nav = screen.getByRole("navigation", { name: "App navigation" });
    for (const label of ["Overview", "Research", "Papers", "Contact"]) {
      expect(within(nav).getByRole("link", { name: label })).toBeInTheDocument();
    }
  });

  it("writes clamped launch progress without React scroll state", () => {
    render(<GlassAppShell backdrop={<div>Cloud media</div>} hero={<div id="top">Launch identity</div>}><section>Content</section></GlassAppShell>);
    const scroller = screen.getByRole("main", { name: "Hongmin Li research app" });
    Object.defineProperty(scroller, "clientHeight", { configurable: true, value: 1000 });
    Object.defineProperty(scroller, "scrollTop", { configurable: true, value: 500 });
    fireEvent.scroll(scroller);
    expect(screen.getByTestId("app-viewport").style.getPropertyValue("--launch-progress")).toBe("0.5000");
  });
});
```

- [ ] **Step 2: Run the shell test and verify RED**

Run: `npm run test:run -- src/components/GlassAppShell.test.tsx`

Expected: FAIL because `GlassAppShell` does not exist.

- [ ] **Step 3: Add `AppToolbar.tsx`**

```tsx
const items = [
  ["Overview", "#about"],
  ["Research", "#research"],
  ["Papers", "#publications"],
  ["Contact", "#contact"],
] as const;

export default function AppToolbar() {
  return (
    <div className="app-toolbar-wrap">
      <nav className="app-toolbar" aria-label="App navigation">
        <a className="app-identity" href="#top" aria-label="Hongmin Li, launch screen"><span aria-hidden="true">H/L</span><span>Scientific AI</span></a>
        <ul>{items.map(([label, href]) => <li key={href}><a href={href}>{label}</a></li>)}</ul>
      </nav>
    </div>
  );
}
```

- [ ] **Step 4: Add `GlassAppShell.tsx`**

```tsx
import { type ReactNode, type UIEvent, useEffect, useRef } from "react";
import { getLaunchProgress } from "../lib/scrollProgress";
import AppToolbar from "./AppToolbar";

export default function GlassAppShell({ backdrop, hero, children }: { backdrop: ReactNode; hero: ReactNode; children: ReactNode }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const handleScroll = (event: UIEvent<HTMLElement>) => {
    const { scrollTop, clientHeight } = event.currentTarget;
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      viewportRef.current?.style.setProperty("--launch-progress", getLaunchProgress(scrollTop, clientHeight).toFixed(4));
      frameRef.current = null;
    });
  };
  useEffect(() => () => { if (frameRef.current !== null) cancelAnimationFrame(frameRef.current); }, []);
  return (
    <div className="app-viewport" data-testid="app-viewport" ref={viewportRef}>
      {backdrop}
      <main className="app-scroller" aria-label="Hongmin Li research app" onScroll={handleScroll} tabIndex={0}>
        {hero}
        <div className="glass-app-surface">
          <div className="glass-grabber" aria-hidden="true" />
          <AppToolbar />
          <div className="app-content">{children}</div>
        </div>
      </main>
    </div>
  );
}
```

- [ ] **Step 5: Run focused tests and verify GREEN**

Run: `npm run test:run -- src/components/GlassAppShell.test.tsx src/lib/scrollProgress.test.ts`

Expected: all focused tests pass.

- [ ] **Step 6: Commit the shell components**

```bash
git add src/components/AppToolbar.tsx src/components/GlassAppShell.tsx src/components/GlassAppShell.test.tsx
git commit -m "feat: add stable glass app viewport"
```

---

### Task 4: Compose the portfolio inside the app shell

**Files:**
- Modify: `src/App.test.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Add a failing app-composition test**

Add to `src/App.test.tsx`:

```tsx
it("presents the portfolio as one internal glass application", () => {
  render(<App />);
  const app = screen.getByRole("main", { name: "Hongmin Li research app" });
  expect(app).toHaveClass("app-scroller");
  expect(document.querySelector(".glass-app-surface")).toBeInTheDocument();
  expect(document.querySelector(".hero-transition")).not.toBeInTheDocument();
  const nav = screen.getByRole("navigation", { name: "App navigation" });
  expect(within(nav).getByRole("link", { name: "Overview" })).toHaveAttribute("href", "#about");
});
```

- [ ] **Step 2: Run the app test and verify RED**

Run: `npm run test:run -- src/App.test.tsx`

Expected: FAIL because the labeled app scroller and glass surface are absent.

- [ ] **Step 3: Replace the page-level composition**

Import `GlassAppShell` and `HeroBackdrop`, then replace the `App` return value with:

```tsx
return (
  <GlassAppShell backdrop={<HeroBackdrop />} hero={<Hero profile={profile} />}>
    <ResearchVision vision={profile.vision} affiliation={profile.affiliation} />
    <ResearchAreas areas={profile.researchAreas} />
    <SelectedWork work={profile.selectedWork} />
    <Publications publications={profile.publications} />
    <Recognition profile={profile} />
    <Contact profile={profile} />
  </GlassAppShell>
);
```

Delete the `hero-transition` element. Do not change profile data or component order.

- [ ] **Step 4: Run app and shell tests and verify GREEN**

Run: `npm run test:run -- src/App.test.tsx src/components/GlassAppShell.test.tsx`

Expected: all focused tests pass.

- [ ] **Step 5: Commit the composition**

```bash
git add src/App.tsx src/App.test.tsx
git commit -m "feat: compose portfolio as a glass app"
```

---

### Task 5: Apply the iOS glass visual system

**Files:**
- Create: `src/styles/app-shell.css`
- Modify: `src/styles/globals.css`
- Modify: `src/styles/globals.test.ts`
- Modify: `src/main.tsx`

- [ ] **Step 1: Add failing stylesheet contract tests**

Extend `src/styles/globals.test.ts` to read both stylesheets and add:

```ts
const shell = readFileSync("src/styles/app-shell.css", "utf8");

describe("glass app styles", () => {
  it("locks the document and provides a native internal scroller", () => {
    expect(shell).toContain(".app-viewport");
    expect(shell).toContain("height:100dvh");
    expect(shell).toContain(".app-scroller");
    expect(shell).toContain("overflow-y:auto");
    expect(shell).toContain("overscroll-behavior:contain");
  });

  it("provides dynamic glass, safe-area, and no-blur fallbacks", () => {
    expect(shell).toContain("backdrop-filter:blur(26px)");
    expect(shell).toContain("env(safe-area-inset-top)");
    expect(shell).toContain("@supports not ((-webkit-backdrop-filter: blur(1px)) or (backdrop-filter: blur(1px)))");
    expect(css).not.toContain(".hero-transition");
  });
});
```

Preserve the existing `readFileSync` import and `css` declaration; do not add unused `fs` or `path` imports. Replace the obsolete `expect(css).toContain("height: 6.25rem")` transition-band assertion with `expect(css).not.toContain(".hero-transition")`.

- [ ] **Step 2: Run the stylesheet test and verify RED**

Run: `npm run test:run -- src/styles/globals.test.ts`

Expected: FAIL because `src/styles/app-shell.css` does not exist.

- [ ] **Step 3: Create `src/styles/app-shell.css`**

```css
html, body, #root { width:100%; height:100%; overflow:hidden; }
body { background:#0c0d0c; }

.app-viewport {
  --launch-progress:0;
  position:relative;
  width:100%;
  height:100dvh;
  min-height:38rem;
  overflow:hidden;
  background:#0c0d0c;
}

.hero-backdrop { position:absolute; z-index:0; inset:0; isolation:isolate; overflow:hidden; pointer-events:none; }
.app-scroller > .hero { position:relative; z-index:1; width:100%; height:100dvh; min-height:38rem; background:transparent; }
.app-viewport .hero-header, .app-viewport .hero-content {
  opacity:calc(1 - var(--launch-progress));
  transform:translateY(calc(var(--launch-progress) * -1.5rem));
  transition:opacity .08s linear;
}

.app-scroller {
  position:absolute;
  z-index:2;
  inset:0;
  overflow-x:hidden;
  overflow-y:auto;
  overscroll-behavior:contain;
  scroll-behavior:smooth;
  -webkit-overflow-scrolling:touch;
}

.app-scroller:focus-visible { outline:2px solid rgba(255,255,255,.9); outline-offset:-4px; }
.glass-app-surface {
  position:relative;
  min-height:100dvh;
  margin-inline:clamp(0rem,1vw,.875rem);
  overflow:clip;
  border:1px solid rgba(255,255,255,.64);
  border-bottom:0;
  border-radius:clamp(2rem,4vw,3.5rem) clamp(2rem,4vw,3.5rem) 0 0;
  background:linear-gradient(180deg,rgba(249,247,242,.60) 0,rgba(249,247,242,.72) 30rem,rgba(249,247,242,.82) 68rem);
  box-shadow:0 -1.75rem 5rem rgba(6,8,10,.25),inset 0 1px 0 rgba(255,255,255,.92);
  backdrop-filter:blur(26px) saturate(1.28);
  -webkit-backdrop-filter:blur(26px) saturate(1.28);
}

.glass-grabber { width:2.5rem; height:.28rem; margin:.8rem auto .35rem; border-radius:999px; background:rgba(22,22,21,.22); }
.app-toolbar-wrap { position:sticky; z-index:20; top:0; padding:calc(.45rem + env(safe-area-inset-top)) var(--page-gutter) .55rem; pointer-events:none; }

.app-toolbar {
  display:flex;
  width:min(100%,54rem);
  min-height:3.25rem;
  margin-inline:auto;
  padding:.35rem .45rem;
  align-items:center;
  justify-content:space-between;
  gap:.75rem;
  overflow:hidden;
  border:1px solid rgba(255,255,255,.72);
  border-radius:999px;
  color:#171716;
  background:rgba(250,248,244,.66);
  box-shadow:0 .75rem 2.5rem rgba(34,31,27,.13),inset 0 1px 0 rgba(255,255,255,.95);
  backdrop-filter:blur(20px) saturate(1.25);
  -webkit-backdrop-filter:blur(20px) saturate(1.25);
  pointer-events:auto;
}

.app-identity { display:flex; min-height:2.5rem; padding-inline:.85rem; align-items:center; gap:.55rem; font-size:.7rem; font-weight:650; letter-spacing:.06em; text-transform:uppercase; white-space:nowrap; }
.app-identity span:first-child { display:grid; place-items:center; width:1.75rem; height:1.75rem; border-radius:999px; color:#f8f5ee; background:#171716; }
.app-toolbar ul { display:flex; margin:0; padding:0; gap:.15rem; overflow-x:auto; list-style:none; scrollbar-width:none; }
.app-toolbar ul::-webkit-scrollbar { display:none; }
.app-toolbar li a { display:grid; min-height:2.5rem; padding-inline:.9rem; place-items:center; border-radius:999px; color:#4f4d48; font-size:.68rem; font-weight:600; letter-spacing:.035em; }
.app-toolbar li a:hover, .app-toolbar li a:focus-visible { color:#171716; background:rgba(255,255,255,.58); }
.app-content { padding-bottom:env(safe-area-inset-bottom); }
.app-content > section { scroll-margin-top:6rem; }

@supports not ((-webkit-backdrop-filter: blur(1px)) or (backdrop-filter: blur(1px))) {
  .glass-app-surface { background:rgba(249,247,242,.94); }
  .app-toolbar { background:rgba(249,247,242,.96); }
}

@media (max-width:899px) {
  .glass-app-surface { margin-inline:0; border-inline:0; border-radius:2rem 2rem 0 0; background:linear-gradient(180deg,rgba(249,247,242,.72),rgba(249,247,242,.88) 42rem); backdrop-filter:blur(14px) saturate(1.16); -webkit-backdrop-filter:blur(14px) saturate(1.16); }
  .app-toolbar-wrap { padding-inline:.75rem; }
  .app-identity span:last-child { display:none; }
}

@media (prefers-reduced-motion:reduce) {
  .app-scroller { scroll-behavior:auto; }
  .app-viewport .hero-header, .app-viewport .hero-content { transform:none; transition:none; }
}
```

- [ ] **Step 4: Convert editorial sections to compact app groups**

In `src/styles/globals.css`, delete `.hero-transition`, keep the existing hero media styles, and apply:

```css
.section-shell { width:min(100%,78rem); margin-inline:auto; padding-inline:var(--page-gutter); }
.vision-section { padding-top:clamp(3rem,7vw,6rem); padding-bottom:clamp(4rem,8vw,7rem); }
.vision-section h2 { max-width:20ch; font-size:clamp(2.25rem,4.6vw,4.85rem); }
.editorial-section { padding-top:clamp(3rem,6vw,5rem); padding-bottom:clamp(3rem,6vw,5rem); border-top:1px solid rgba(23,23,22,.12); }

.research-list, .work-list, .publication-list, .recognition-grid, .record-details {
  overflow:hidden;
  border:1px solid rgba(255,255,255,.52);
  border-radius:1.5rem;
  background:rgba(255,255,255,.24);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.62);
}

.research-list, .work-list, .publication-list { border-top:1px solid rgba(255,255,255,.52); }
.research-list li, .work-row, .publication-row { padding-inline:clamp(1rem,2.5vw,2rem); }
.recognition-grid { padding:clamp(1rem,2.5vw,2rem); }

.contact-section { padding-top:clamp(3rem,7vw,6rem); background:transparent; color:var(--ink); border-top:1px solid rgba(23,23,22,.12); }
.contact-section .section-kicker, .contact-note, .contact-section .record-details summary span { color:var(--muted); }
.contact-section .record-details, .contact-section .record-details[open] summary, .compact-record li, .site-footer { border-color:rgba(23,23,22,.14); }
.compact-record span, .site-footer { color:var(--muted); }
```

Remove any remaining contact declarations that force a dark block or white text. Retain responsive grid collapse rules and factual-content selectors.

- [ ] **Step 5: Load the new shell stylesheet**

In `src/main.tsx`:

```ts
import "./styles/globals.css";
import "./styles/app-shell.css";
```

- [ ] **Step 6: Run focused tests and verify GREEN**

Run:

```bash
npm run test:run -- src/styles/globals.test.ts src/App.test.tsx src/components/GlassAppShell.test.tsx src/components/HeroBackdrop.test.tsx src/components/Hero.test.tsx
```

Expected: all focused tests pass.

- [ ] **Step 7: Commit the visual system**

```bash
git add src/styles/app-shell.css src/styles/globals.css src/styles/globals.test.ts src/main.tsx
git commit -m "style: present research as an iOS glass app"
```

---

### Task 6: Full verification and Sites release

**Files:**
- Verify only unless a test exposes a scoped defect.

- [ ] **Step 1: Run the complete automated suite**

Run:

```bash
npm run test:run
npm run typecheck
npm run build
npm run build:sites
```

Expected: all tests pass, TypeScript reports no errors, the GitHub Pages build succeeds, and the Sites build/packaging succeeds.

- [ ] **Step 2: Start a local preview**

Run: `npm run dev -- --host 127.0.0.1`

Keep the returned local URL for browser verification.

- [ ] **Step 3: Verify desktop behavior in a real browser**

At a desktop viewport near 1440×1000, confirm:

```text
document.scrollingElement.scrollTop === 0
internal app scroller scrollTop increases with wheel or trackpad input
video.loop === false
after playback: video.ended === true
after playback: abs(video.duration - video.currentTime) < 0.15
glass surface begins below the launch screen and rises with native scrolling
hero identity fades before it can interfere with glass text
toolbar remains sticky and each anchor moves the internal scroller
no gray transition seam, horizontal overflow, or console error
```

- [ ] **Step 4: Verify mobile and reduced-motion behavior**

At a viewport near 390×844 and with reduced motion enabled, confirm:

```text
the hero video has no src and the final-frame poster is visible
touch-sized toolbar links remain usable and horizontally contained
the internal surface scrolls with touch or trackpad input
blur is reduced, text remains readable, and safe-area padding is present
```

- [ ] **Step 5: Probe required assets and failure behavior**

Confirm `/media/hero.mp4`, `/media/hero-poster.webp`, and `/files/CREST_2025_poster.pdf` return 200. Confirm a deliberately missing asset returns 404. Inspect browser logs for media, rendering, accessibility, or runtime errors.

- [ ] **Step 6: Repair only verified defects**

If verification exposes a defect, first add a focused failing regression test, implement the smallest fix, rerun the focused test and complete suite, then commit the repair. Do not create an empty verification commit.

- [ ] **Step 7: Publish through Sites**

Use the Sites hosting workflow against the existing project. Preserve owner-only access, deploy the verified `build:sites` output, then probe the live root page, hero video, final-frame poster, CV PDF, one deep anchor, and one missing asset.

Expected: deployment success; required live assets return 200; missing asset returns 404; the live video does not loop; the document remains fixed while the app's internal scroller moves.

---

## Verification gate

Do not call the work complete until all of these are true:

- The old `hero-transition` element and style are absent.
- The background video plays once and remains at the final frame.
- Browser document scroll remains locked while the labeled internal app scroller moves.
- One continuous glass surface rises from below and becomes more opaque for reading.
- The sticky toolbar navigates within the app surface.
- The mobile and reduced-motion paths use the final-frame poster.
- Existing profile, publication, selected-work, link, and deployment tests still pass.
- Both production builds succeed and the published Sites deployment passes live probes.

**Next skill:** `$superpower-executing-plans`, with implementation delegated to the Azure Codex sub-agent required by the workspace instructions.
