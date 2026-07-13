import { ArrowUpRight, Mail } from "lucide-react";
import type { Profile } from "../data/profile";

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
      </div>
      <footer className="site-footer section-shell">
        <p>{profile.name}</p><p>Institute of Science Tokyo · The University of Tokyo</p><p>Last updated {profile.lastUpdated}</p>
      </footer>
    </section>
  );
}
