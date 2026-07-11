import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync("src/styles/globals.css", "utf8");

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
    expect(css).toContain("height: 6.25rem");
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
