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

  it("carries the cinematic homepage palette into project and note pages", () => {
    const editorialStart = css.indexOf(".editorial-page {");
    const editorialRules = css.slice(editorialStart, css.indexOf("@media (max-width: 899px)", editorialStart));

    expect(editorialRules).toContain("--ink: #f7f4ed");
    expect(editorialRules).toContain("background: var(--night)");
    expect(editorialRules).toContain('url("/media/hero-poster.webp")');
    expect(editorialRules).toContain("background: rgba(5, 8, 10, .62)");
    expect(editorialRules).not.toContain("color: #191a18");
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

  it("removes the duplicate full CV panel from the final contact section", () => {
    expect(css).not.toContain(".full-cv");
    expect(css).not.toContain(".compact-record");
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

  it("presents publications as a compact responsive three-column record", () => {
    const publicationRowRules = css.match(/\.publication-row\s*\{([^}]*)\}/)?.[1] ?? "";
    const publicationHeadingRules = css.match(/\.publication-copy h3\s*\{([^}]*)\}/)?.[1] ?? "";
    const publicationCopyRules = css.match(/\.publication-copy p\s*\{([^}]*)\}/)?.[1] ?? "";
    const publicationLinksRules = css.match(/\.publication-row \.link-cluster\s*\{([^}]*)\}/)?.[1] ?? "";

    expect(css).toMatch(/\.publication-list\s*\{[^}]*display:\s*grid;[^}]*grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)/s);
    expect(css).toMatch(/@media \(max-width: 1099px\)[\s\S]*?\.publication-list\s*\{[^}]*repeat\(2,/s);
    expect(css).toMatch(/@media \(max-width: 699px\)[\s\S]*?\.publication-list\s*\{[^}]*grid-template-columns:\s*1fr/s);
    expect(css).toMatch(/@media \(max-width: 699px\)[\s\S]*?\.publication-row\s*\{[^}]*min-height:\s*0;/s);
    expect(publicationRowRules).toContain("min-height: 10.5rem");
    expect(publicationRowRules).toContain("padding: .85rem 0");
    expect(publicationRowRules).toContain("border-top: 1px solid var(--rule)");
    expect(publicationRowRules).not.toContain("border-right");
    expect(publicationRowRules).not.toContain("border-bottom");
    expect(publicationHeadingRules).toContain("margin: .55rem 0 0");
    expect(publicationCopyRules).toContain("margin: .35rem 0 0");
    expect(publicationLinksRules).toContain("margin-top: .7rem");
    expect(publicationLinksRules).toContain("padding-top: 0");
    expect(publicationLinksRules).not.toContain("margin-top: auto");
  });

  it("provides a compact accessible publication toggle without legacy publication details styles", () => {
    const publicationToggleRules = css.match(/\.publication-toggle\s*\{([^}]*)\}/)?.[1] ?? "";

    expect(publicationToggleRules).toContain("min-height: 44px");
    expect(publicationToggleRules).toContain("margin-top: .65rem");
    expect(css).not.toContain(".publication-details");
    expect(css).not.toContain(".record-details");
  });

  it("provides a compact 44px timeline toggle without adding another glass card", () => {
    expect(css).toMatch(/\.timeline-toggle\s*\{[^}]*min-height:\s*44px;/s);
    const timelineToggleRules = css.match(/\.timeline-toggle\s*\{([^}]*)\}/)?.[1] ?? "";
    expect(timelineToggleRules).toContain("background: transparent");
    expect(timelineToggleRules).not.toContain("box-shadow:");
    expect(timelineToggleRules).not.toContain("backdrop-filter:");
  });

  it("keeps content-link hover underlines out of flex layout", () => {
    expect(css).toMatch(/\.hero-nav a::after, \.link-cluster a::after, \.timeline-group a::after, \.contact-links a::after\s*\{[^}]*position:\s*absolute;[^}]*inset-inline:\s*0;/s);
    expect(css).toMatch(/\.link-cluster a, \.timeline-group a\s*\{[^}]*white-space:\s*nowrap;/s);
  });

  it("uses the approved compact navigation gap on narrow mobile screens", () => {
    const narrowMobileRules = css.split("@media (max-width: 599px) {")[1].split("@media (prefers-reduced-motion: reduce)")[0];
    expect(narrowMobileRules).toMatch(/\.hero-nav\s*\{[^}]*gap:\s*\.65rem/s);
  });

  it("keeps hero navigation underlines out of layout at narrow mobile sizes", () => {
    const narrowMobileRules = css.split("@media (max-width: 599px) {")[1].split("@media (prefers-reduced-motion: reduce)")[0];
    expect(css).toMatch(/\.hero-nav a, \.link-cluster a, \.timeline-group a, \.contact-links a\s*\{[^}]*position:\s*relative/s);
    expect(css).toMatch(/\.hero-nav a::after, \.link-cluster a::after, \.timeline-group a::after, \.contact-links a::after\s*\{[^}]*position:\s*absolute/s);
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

  it("keeps the three-column recent-news record directly over the hero", () => {
    const overviewRules = css.slice(css.indexOf(".hero-overview {"), css.indexOf(".section-shell"));

    expect(overviewRules).toMatch(/\.hero-news ol\s*\{[^}]*grid-template-columns:\s*repeat\(3,/s);
    expect(overviewRules).toMatch(/\.hero-news li\s*\{[^}]*border-bottom:\s*1px solid/s);
    expect(overviewRules).not.toContain("backdrop-filter:");
    expect(overviewRules).not.toContain("backdrop-filter:");
    expect(overviewRules).not.toContain("border-radius:");
  });

  it("animates recent news only when motion is allowed and keeps mobile overview hidden", () => {
    const reducedMotionRules = css.split("@media (prefers-reduced-motion: reduce) {")[1];

    expect(css).toMatch(/@media \(prefers-reduced-motion: no-preference\)\s*\{[\s\S]*?\.hero-news\s*\{[^}]*animation:\s*hero-news-in/s);
    expect(reducedMotionRules).not.toContain(".hero-news");
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

  it("progressively darkens the cinematic background as editorial content rises", () => {
    expect(shell).toMatch(/\.content-backdrop-shade\s*\{[^}]*position:fixed;[^}]*background:linear-gradient\([^}]*opacity:calc\(var\(--content-progress, 0\) \* \.92\)/s);
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
