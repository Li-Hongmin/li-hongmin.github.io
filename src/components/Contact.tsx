import { ArrowUpRight, Mail } from "lucide-react";
import type { Profile, TimelineItem } from "../data/profile";

function CompactRecord({ title, items, id }: { title: string; items: readonly TimelineItem[]; id?: string }) {
  return (
    <section className="compact-record" id={id}>
      <h3>{title}</h3>
      <ol>
        {items.map((item) => (
          <li key={item.id} className={item.date ? undefined : "compact-record__item--undated"}>
            {item.date && <time>{item.date}</time>}
            <div><strong>{item.title}</strong>{item.organization && <span>{item.organization}</span>}{item.detail && <span>{item.detail}</span>}</div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default function Contact({ profile }: { profile: Profile }) {
  return (
    <section className="contact-section" id="contact" aria-labelledby="contact-heading">
      <div className="section-shell contact-inner">
        <p className="section-kicker">Collaborate</p>
        <h2 id="contact-heading">Let's build testable science.</h2>
        <p className="contact-note">For conversations about AI for Science, biomolecular sequence design, and reproducible research workflows.</p>
        <div className="contact-links">
          <a href={`mailto:${profile.email}`} aria-label="Email Hongmin Li"><Mail aria-hidden="true" size={18} />{profile.email}</a>
          <a href={profile.github} target="_blank" rel="noreferrer">GitHub<ArrowUpRight aria-hidden="true" size={16} /></a>
        </div>
        <div className="full-cv" id="full-cv" aria-labelledby="full-cv-heading">
          <h3 className="full-cv-heading" id="full-cv-heading">Full CV / Record</h3>
          <div className="full-cv-grid">
            <CompactRecord title="Experience" items={profile.experience} />
            <CompactRecord id="education" title="Education" items={profile.education} />
            <CompactRecord id="grants" title="Funding & credits" items={profile.grants} />
            <CompactRecord id="awards" title="Awards & fellowship" items={profile.awards} />
            <CompactRecord id="peer-review" title="Peer review" items={profile.peerReview} />
          </div>
        </div>
      </div>
      <footer className="site-footer section-shell">
        <p>{profile.name}</p><p>Institute of Science Tokyo · The University of Tokyo</p><p>Last updated {profile.lastUpdated}</p>
      </footer>
    </section>
  );
}
