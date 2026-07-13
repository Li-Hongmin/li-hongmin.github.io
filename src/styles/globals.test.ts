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

    expect(desktopRules).toMatch(/\.desktop-outline\s*\{[^}]*position:\s*fixed[^}]*z-index:\s*30[^}]*top:\s*min\(6vh,\s*2\.75rem\)[^}]*right:\s*var\(--page-gutter\)/s);
    expect(desktopRules).toMatch(/\.hero-nav\s*\{[^}]*flex-direction:\s*column[^}]*gap:\s*\.05rem[^}]*min-width:\s*9\.75rem/s);
    expect(desktopRules).toMatch(/\.hero-nav a\s*\{[^}]*min-height:\s*2rem/s);
    expect(desktopRules).toMatch(/\.hero-nav\s*\{[^}]*flex-direction:\s*column[^}]*gap:\s*\.05rem[^}]*border-left:/s);
    expect(desktopRules).toMatch(/\.hero-nav li::before\s*\{[^}]*border-radius:\s*50%/s);
    expect(desktopRules).toMatch(/\.hero-nav a\s*\{[^}]*min-height:\s*2rem[^}]*font-size:\s*\.625rem/s);
    const nineItemRailHeight = 9 * 2 * 16 + 8 * 0.05 * 16;
    const railTopAndVisualInset = 2.75 * 16 + 2 * 16;
    expect(nineItemRailHeight + railTopAndVisualInset).toBeLessThanOrEqual(768);
  });

  it("keeps the permanent full CV text line-led and free of a glass panel", () => {
    const fullCvRules = css.slice(css.indexOf(".full-cv {"), css.indexOf(".compact-record li"));

    expect(fullCvRules).toMatch(/\.full-cv\s*\{[^}]*border-top:\s*1px solid/s);
    expect(fullCvRules).not.toContain("background:");
    expect(fullCvRules).not.toContain("box-shadow:");
    expect(fullCvRules).not.toContain("border-radius:");
  });

  it("uses a white, line-led featured-paper treatment without a panel", () => {
    const featuredPaperRules = css.slice(css.indexOf(".featured-paper {"), css.indexOf(".publication-copy h3"));

    expect(featuredPaperRules).toContain("--ink: #fff");
    expect(featuredPaperRules).toContain("border-top: 1px solid var(--rule)");
    expect(featuredPaperRules).toContain("text-shadow");
    expect(featuredPaperRules).not.toMatch(/background\s*:/);
    expect(featuredPaperRules).not.toMatch(/backdrop-filter\s*:/);
    expect(featuredPaperRules).not.toMatch(/border-radius\s*:/);
    expect(css).not.toContain(".research-list");
  });

  it("presents publications as a dense responsive three-column record", () => {
    expect(css).toMatch(/\.publication-list\s*\{[^}]*display:\s*grid;[^}]*grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)/s);
    expect(css).toMatch(/@media \(max-width: 1099px\)[\s\S]*?\.publication-list\s*\{[^}]*repeat\(2,/s);
    expect(css).toMatch(/@media \(max-width: 699px\)[\s\S]*?\.publication-list\s*\{[^}]*grid-template-columns:\s*1fr/s);
  });

  it("lets undated compact-record content span both grid columns", () => {
    expect(css).toMatch(/\.compact-record__item--undated\s*>\s*div\s*\{[^}]*grid-column:\s*1\s*\/\s*-1/s);
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

  it("keeps research overview previews as white, line-led text directly over the hero", () => {
    const overviewRules = css.slice(css.indexOf(".hero-overview {"), css.indexOf(".section-shell"));

    expect(overviewRules).toMatch(/\.hero-overview__preview\s*\{[^}]*border-top:\s*1px solid[^}]*color:\s*#fff[^}]*text-shadow:/s);
    expect(overviewRules).toMatch(/\.hero-overview__preview-list li\s*\{[^}]*border-top:\s*1px solid/s);
    expect(overviewRules).not.toContain("background:");
    expect(overviewRules).not.toContain("backdrop-filter:");
    expect(overviewRules).not.toContain("border-radius:");
  });

  it("animates overview previews only when motion is allowed and keeps mobile overview hidden", () => {
    const reducedMotionRules = css.split("@media (prefers-reduced-motion: reduce) {")[1];

    expect(css).toMatch(/@media \(prefers-reduced-motion: no-preference\)\s*\{[\s\S]*?\.hero-overview__preview\s*\{[^}]*animation:\s*hero-overview-preview-in/s);
    expect(reducedMotionRules).not.toContain(".hero-overview__preview");
    expect(css).toMatch(/@media \(max-width: 899px\)\s*\{[\s\S]*?\.hero-overview\s*\{\s*display:\s*none;/s);
  });

  it("does not reintroduce rejected decoration", () => {
    for (const rejected of ["orbit", "dot-grid", "coordinates", "magnet", "metric-strip"]) {
      expect(css).not.toContain(rejected);
    }
  });
});

describe("cinematic scroll styles", () => {
  it("keeps the hero in the scroll flow without fading the fixed outline navigation", () => {
    const heroRules = shell.match(/\.app-scroller > \.hero\s*\{([^}]*)\}/)?.[1] ?? "";

    expect(heroRules).not.toContain("opacity:");
    expect(heroRules).not.toContain("transform:");
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

  it("uses white editorial typography directly over the cinematic background", () => {
    expect(shell).not.toContain(".glass-app-surface");
    expect(shell).not.toContain(".glass-grabber");
    expect(shell).not.toContain("backdrop-filter:");
    expect(shell).toMatch(/\.app-content > section\s*\{[^}]*--ink:#f7f4ed;[^}]*background:transparent;[^}]*box-shadow:none;/s);
    expect(shell).toMatch(/\.app-content :is\(\.publication-list,[^}]*background:transparent;[^}]*box-shadow:none;/s);
  });

  it("gives the editorial content a wider desktop measure while reserving the outline rail", () => {
    expect(css).toContain("width: min(100%, 88rem)");
    expect(shell).toMatch(/\.app-content > section\s*\{[^}]*max-width:88rem;[^}]*margin-right:clamp\(11\.5rem,15vw,14rem\);/s);
  });

  it("offsets section anchors by the panel spacing and top safe area", () => {
    expect(shell).toContain("scroll-margin-top:calc(2rem + env(safe-area-inset-top))");
    expect(shell).not.toContain(".app-content > section { scroll-margin-top:6rem; }");
  });

  it("provides safe-area support without glass fallbacks", () => {
    expect(shell).not.toContain("backdrop-filter");
    expect(shell).toContain("env(safe-area-inset-top)");
    expect(shell).not.toContain("@supports not ((-webkit-backdrop-filter: blur(1px)) or (backdrop-filter: blur(1px)))");
    expect(css).not.toContain(".hero-transition");
  });
});
