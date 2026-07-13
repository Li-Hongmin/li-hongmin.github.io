import { ArrowUpRight } from "lucide-react";
import type { Publication } from "../data/profile";

export default function FeaturedPaper({ publication }: { publication: Publication }) {
  return (
    <section className="featured-paper section-shell" id="research" aria-labelledby="featured-paper-heading" aria-label="Featured paper">
      <div className="featured-paper__meta">
        <p className="section-kicker">Featured perspective</p>
        <p>{publication.date} · {publication.venue}</p>
      </div>
      <h2 id="featured-paper-heading">{publication.title}</h2>
      <p className="featured-paper__principle">No claim without license.</p>
      <div className="featured-paper__copy">
        <p>
          A Perspective-style framework for AI-assisted research on evidence-licensed claims, the claim–evidence gap,
          epistemic debt, and a five-stage calibration loop.
        </p>
        <p>
          AISim-Cal is an illustrative synthetic dynamics exercise, not an empirical forecast or benchmark.
        </p>
      </div>
      <div className="featured-paper__links" aria-label="Featured paper links">
        {publication.links.map((link) => (
          <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
            {link.label}<ArrowUpRight aria-hidden="true" size={14} />
          </a>
        ))}
      </div>
    </section>
  );
}
