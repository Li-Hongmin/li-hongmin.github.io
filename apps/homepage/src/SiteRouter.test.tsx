import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import SiteRouter from "./SiteRouter";

vi.mock("./hooks/useHeroMedia", () => ({ useHeroMedia: () => ({ shouldLoadVideo: false }) }));

afterEach(() => {
  cleanup();
  window.history.pushState({}, "", "/");
});

describe("static site routes", () => {
  it("renders the projects index", () => {
    window.history.pushState({}, "", "/projects/");
    render(<SiteRouter />);
    expect(screen.getByRole("heading", { level: 1, name: "Projects" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "AlphaScience" })).toBeInTheDocument();
  });

  it("renders the AlphaScience project page with a clear evidence boundary", () => {
    window.history.pushState({}, "", "/projects/alphascience/");
    render(<SiteRouter />);
    expect(screen.getByRole("heading", { level: 1, name: "AlphaScience" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "A methodology is not yet a validated autonomous scientist." })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Related notes" })).toBeInTheDocument();
  });

  it("renders a standalone research note", () => {
    window.history.pushState({}, "", "/notes/evidence-ledger-before-manuscript/");
    render(<SiteRouter />);
    expect(screen.getByRole("heading", { level: 1, name: "Why an Evidence Ledger Comes Before a Manuscript" })).toBeInTheDocument();
    expect(screen.getByText(/not peer reviewed/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Public sources" })).toBeInTheDocument();
  });
});
