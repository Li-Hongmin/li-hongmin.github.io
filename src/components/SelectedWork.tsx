import { ArrowUpRight } from "lucide-react";
import type { SelectedWork as SelectedWorkItem } from "../data/profile";

export default function SelectedWork({ work }: { work: readonly SelectedWorkItem[] }) {
  return (
    <section className="editorial-section work-section section-shell" aria-labelledby="work-heading" aria-label="Selected work">
      <div className="section-heading-row">
        <p className="section-kicker">Projects</p>
        <h2 id="work-heading">Selected work</h2>
      </div>
      <div className="work-list">
        {work.map((item) => (
          <article key={item.id} className="work-row">
            <p className="work-eyebrow">{item.eyebrow} · <time dateTime={String(item.year)}>{item.year}</time></p>
            <div className="work-copy"><h3>{item.title}</h3><p>{item.description}</p></div>
            <div className="link-cluster">
              {item.links.map((link) => (
                <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                  {link.label}<ArrowUpRight aria-hidden="true" size={15} />
                </a>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
