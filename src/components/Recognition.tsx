import { ArrowUpRight } from "lucide-react";
import type { Profile, TimelineItem } from "../data/profile";

function Timeline({ items, label }: { items: readonly TimelineItem[]; label: string }) {
  return (
    <div className="timeline-group">
      <h3>{label}</h3>
      <ol>
        {items.map((item) => (
          <li key={item.id}>
            <time>{item.date}</time>
            <div>
              <h4>{item.title}</h4>
              {item.organization && <p>{item.organization}</p>}
              {item.detail && <p>{item.detail}</p>}
              {item.links?.map((link) => {
                const external = /^https?:/.test(link.href);
                return <a key={link.href} href={link.href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>{link.label}<ArrowUpRight aria-hidden="true" size={13} /></a>;
              })}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function Recognition({ profile }: { profile: Profile }) {
  return (
    <section id="experience" className="editorial-section recognition-section section-shell" aria-labelledby="recognition-heading">
      <div className="section-heading-row">
        <p className="section-kicker">Selected record</p>
        <h2 id="recognition-heading">Experience &amp; recognition</h2>
      </div>
      <div className="recognition-grid">
        <Timeline label="Experience" items={profile.experience.slice(0, 4)} />
        <Timeline label="Funding & credits" items={profile.grants} />
        <Timeline label="Academic activities" items={profile.activities} />
      </div>
    </section>
  );
}
