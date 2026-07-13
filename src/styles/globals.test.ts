import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync("src/styles/globals.css", "utf8");
const shell = readFileSync("src/styles/app-shell.css", "utf8");

describe("approved visual contract", () => {
  it("contains the cinematic hero, responsive breakpoint and reduced motion", () => {
    expect(css).toContain("height: 100svh");
    expect(css).toContain("clamp(6rem, 11.2vw, 11.125rem)");
    expect(css).toContain("@media (max-width: 899px)");
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
    expect(css).toContain("saturate(1.08) contrast(1.03)");
  });

  it("keeps the approved palette and local hero shade", () => {
    expect(css).toContain("--paper: #f2f0eb");
    expect(css).toContain("max-width: 42.5rem");
    expect(css).not.toContain(".hero-transition");
  });

  it("keeps the hero name in a system sans single line from 768px upward", () => {
    const tabletRules = css.split("@media (max-width: 899px) {")[1].split("@media (max-width: 767px)")[0];
    expect(css).toMatch(/\.hero-name\s*\{[^}]*font-family:\s*Inter, ui-sans-serif, system-ui[^}]*font-weight:\s*580[^}]*white-space:\s*nowrap/s);
    expect(css).toMatch(/@media \(max-width: 767px\)\s*\{[\s\S]*?\.hero-name\s*\{[^}]*white-space:\s*normal/s);
    expect(tabletRules).not.toContain(".hero-name");
  });

  it("gives mobile hero navigation links a 44px minimum tap target", () => {
    const mobileRules = css.split("@media (max-width: 767px) {")[1].split("@media (max-width: 599px)")[0];
    expect(mobileRules).toMatch(/\.hero-nav a\s*\{[^}]*min-height:\s*44px/s);
  });

  it("turns wide-screen hero navigation into a right-hand outline rail", () => {
    const desktopRules = css.split("@media (min-width: 1100px) {")[1].split(".hero-content")[0];

    expect(desktopRules).toMatch(/\.hero-header nav\s*\{[^}]*right:\s*var\(--page-gutter\)/s);
    expect(desktopRules).toMatch(/\.hero-nav\s*\{[^}]*flex-direction:\s*column[^}]*border-left:/s);
    expect(desktopRules).toMatch(/\.hero-nav li::before\s*\{[^}]*border-radius:\s*50%/s);
    expect(desktopRules).toMatch(/\.hero-nav a\s*\{[^}]*min-height:\s*2\.35rem/s);
  });

  it("keeps horizontal padding on mobile research rows", () => {
    const mobileRules = css.split("@media (max-width: 899px) {")[1].split("@media (max-width: 767px)")[0];
    expect(mobileRules).toMatch(/\.research-list li\s*\{[^}]*padding:\s*1\.25rem;/s);
    expect(mobileRules).not.toContain("padding: 1.25rem 0");
  });

  it("uses the approved compact navigation gap on narrow mobile screens", () => {
    const narrowMobileRules = css.split("@media (max-width: 599px) {")[1].split("@media (prefers-reduced-motion: reduce)")[0];
    expect(narrowMobileRules).toMatch(/\.hero-nav\s*\{[^}]*gap:\s*\.65rem/s);
  });

  it("keeps hero navigation underlines out of layout at narrow mobile sizes", () => {
    const narrowMobileRules = css.split("@media (max-width: 599px) {")[1].split("@media (prefers-reduced-motion: reduce)")[0];
    expect(css).toMatch(/\.hero-nav a\s*\{[^}]*position:\s*relative/s);
    expect(css).toMatch(/\.hero-nav a::after\s*\{[^}]*position:\s*absolute/s);
    expect(narrowMobileRules).toMatch(/\.hero-nav a\s*\{[^}]*font-size:\s*\.625rem/s);
  });

  it("adds compact header padding below 340px to separate the monogram and navigation", () => {
    expect(css).toMatch(/@media \(max-width: 340px\)\s*\{[\s\S]*?\.hero-header\s*\{[^}]*padding-inline:\s*\.75rem/s);
  });

  it("uses only a bounded lower-left shade that fades before the image midpoint", () => {
    const shadeRules = css.match(/\.hero-copy-shade\s*\{([\s\S]*?)\n\}/)?.[1] ?? "";
    expect(shadeRules).toContain("width: min(100%, 42.5rem)");
    expect(shadeRules).toContain("bottom: 0");
    expect(shadeRules).toContain("left: 0");
    expect(shadeRules).toContain("transparent 48%");
    expect(shadeRules).not.toContain("inset: 0");
    expect(shadeRules).not.toContain("linear-gradient(180deg");
  });

  it("does not reintroduce rejected decoration", () => {
    for (const rejected of ["orbit", "dot-grid", "coordinates", "magnet", "metric-strip"]) {
      expect(css).not.toContain(rejected);
    }
  });
});

describe("glass app styles", () => {
  it("applies launch progress to the non-motion hero parent", () => {
    const heroRules = shell.match(/\.app-scroller > \.hero\s*\{([^}]*)\}/)?.[1] ?? "";
    const reducedMotionRules = shell.split("@media (prefers-reduced-motion:reduce) {")[1] ?? "";

    expect(heroRules).toContain("opacity:calc(1 - var(--launch-progress))");
    expect(heroRules).toContain("transform:translateY(calc(var(--launch-progress) * -1.5rem))");
    expect(shell).not.toContain(".app-viewport .hero-header");
    expect(shell).not.toContain(".app-viewport .hero-content");
    expect(reducedMotionRules).toMatch(/\.app-scroller > \.hero\s*\{[^}]*opacity:1;[^}]*transform:none;[^}]*transition:none;/s);
  });

  it("locks the document and provides a native internal scroller", () => {
    expect(shell).toContain(".app-viewport");
    expect(shell).toContain("height:100dvh");
    expect(shell).toContain(".app-scroller");
    expect(shell).toContain("overflow-y:auto");
    expect(shell).toContain("overscroll-behavior:contain");
  });

  it("keeps a slim overlay-style scrollbar without reserving a gutter", () => {
    expect(shell).not.toContain("scrollbar-gutter");
    expect(shell).toContain("scrollbar-width:thin");
    expect(shell).toMatch(/\.app-scroller::-webkit-scrollbar-track\s*\{[^}]*background:transparent;/s);
    expect(shell).toMatch(/\.app-scroller::-webkit-scrollbar-thumb\s*\{[^}]*border-radius:999px;[^}]*background:rgba\(/s);
  });

  it("places opaque no-blur fallbacks after responsive glass backgrounds", () => {
    const fallbackIndex = shell.indexOf("@supports not ((-webkit-backdrop-filter: blur(1px)) or (backdrop-filter: blur(1px)))");
    const mobileBackgroundIndex = shell.indexOf("@media (max-width:899px)");
    const narrowRulesIndex = shell.indexOf("@media (max-width:599px)");
    const fallbackRules = shell.slice(fallbackIndex);

    expect(fallbackIndex).toBeGreaterThan(mobileBackgroundIndex);
    expect(fallbackIndex).toBeGreaterThan(narrowRulesIndex);
    expect(fallbackRules).toContain(".glass-app-surface { background:rgba(249,247,242,.94); }");
    expect(fallbackRules).toContain(".app-toolbar { background:rgba(249,247,242,.96); }");
  });

  it("offsets section anchors by the toolbar and top safe area", () => {
    expect(shell).toContain(".app-content > section { scroll-margin-top:calc(6rem + env(safe-area-inset-top)); }");
    expect(shell).not.toContain(".app-content > section { scroll-margin-top:6rem; }");
  });

  it("provides dynamic glass, safe-area, and no-blur fallbacks", () => {
    expect(shell).toContain("backdrop-filter:blur(26px)");
    expect(shell).toContain("env(safe-area-inset-top)");
    expect(shell).toContain("@supports not ((-webkit-backdrop-filter: blur(1px)) or (backdrop-filter: blur(1px)))");
    expect(css).not.toContain(".hero-transition");
  });
});
