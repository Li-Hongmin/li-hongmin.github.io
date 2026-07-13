import { ArrowUpRight } from "lucide-react";
import type { Publication } from "../data/profile";

function PublicationRow({ publication }: { publication: Publication }) {
  return (
    <article className="publication-row">
      <time>{publication.date}</time>
      <div className="publication-copy"><h3>{publication.title}</h3><p>{publication.venue}</p></div>
      <div className="link-cluster">
        {publication.links.map((link) => (
          <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
            {link.label}<ArrowUpRight aria-hidden="true" size={14} />
          </a>
        ))}
      </div>
    </article>
  );
}

export default function Publications({ publications }: { publications: readonly Publication[] }) {
  const featured = publications.filter((publication) => publication.featured);
  return (
    <section className="editorial-section section-shell" id="publications" aria-labelledby="publications-heading">
      <div className="section-heading-row">
        <p className="section-kicker">Research record</p>
        <h2 id="publications-heading">Publications</h2>
      </div>
      <div className="publication-list" aria-label="Featured publications">
        {featured.map((publication) => <PublicationRow key={publication.id} publication={publication} />)}
      </div>
      <details className="record-details publication-details">
        <summary>Complete publication record <span aria-hidden="true">{publications.length} entries</span></summary>
        <div className="publication-list" aria-label="Complete publication record">
          {publications.map((publication) => <PublicationRow key={publication.id} publication={publication} />)}
        </div>
      </details>
    </section>
  );
}
