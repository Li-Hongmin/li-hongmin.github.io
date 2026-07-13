import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import type { Publication } from "../data/profile";

function PublicationRow({ publication }: { publication: Publication }) {
  return (
    <article className="publication-row" data-publication-id={publication.id}>
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

const INITIAL_PUBLICATION_COUNT = 9;
const PUBLICATION_LIST_ID = "publication-list";

export default function Publications({ publications }: { publications: readonly Publication[] }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasMorePublications = publications.length > INITIAL_PUBLICATION_COUNT;
  const visiblePublications = isExpanded || !hasMorePublications
    ? publications
    : publications.slice(0, INITIAL_PUBLICATION_COUNT);
  const remainingCount = publications.length - INITIAL_PUBLICATION_COUNT;

  return (
    <section className="editorial-section section-shell" id="publications" aria-labelledby="publications-heading">
      <div className="section-heading-row">
        <p className="section-kicker">Research record</p>
        <h2 id="publications-heading">Publications</h2>
      </div>
      <div className="publication-list" id={PUBLICATION_LIST_ID} aria-label="Publications list">
        {visiblePublications.map((publication) => <PublicationRow key={publication.id} publication={publication} />)}
      </div>
      {hasMorePublications && (
        <button
          className="publication-toggle"
          type="button"
          aria-expanded={isExpanded}
          aria-controls={PUBLICATION_LIST_ID}
          onClick={() => setIsExpanded((expanded) => !expanded)}
        >
          {isExpanded ? "Show fewer publications" : `View ${remainingCount} more publications`}
        </button>
      )}
    </section>
  );
}
