import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import type { Profile, TimelineItem } from "../data/profile";

const INITIAL_TIMELINE_COUNT = 4;

type TimelineProps = {
  items: readonly TimelineItem[];
  label: string;
  listId: string;
  itemName: string;
  itemNamePlural: string;
};

function Timeline({ items, label, listId, itemName, itemNamePlural }: TimelineProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasMoreItems = items.length > INITIAL_TIMELINE_COUNT;
  const visibleItems = isExpanded || !hasMoreItems ? items : items.slice(0, INITIAL_TIMELINE_COUNT);
  const remainingCount = items.length - INITIAL_TIMELINE_COUNT;
  const remainingItemName = remainingCount === 1 ? itemName : itemNamePlural;

  return (
    <div className="timeline-group">
      <h3>{label}</h3>
      <ol id={listId}>
        {visibleItems.map((item) => (
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
      {hasMoreItems && (
        <button
          className="timeline-toggle"
          type="button"
          aria-expanded={isExpanded}
          aria-controls={listId}
          onClick={() => setIsExpanded((expanded) => !expanded)}
        >
          {isExpanded ? `Show fewer ${itemNamePlural}` : `View ${remainingCount} more ${remainingItemName}`}
        </button>
      )}
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
        <Timeline
          label="Academic & industry appointments"
          items={profile.experience}
          listId="recognition-appointments-list"
          itemName="appointment"
          itemNamePlural="appointments"
        />
        <Timeline
          label="Research funding & computing support"
          items={profile.grants}
          listId="recognition-funding-list"
          itemName="funding record"
          itemNamePlural="funding records"
        />
        <Timeline
          label="Conference participation & presentations"
          items={profile.activities}
          listId="recognition-activities-list"
          itemName="activity"
          itemNamePlural="activities"
        />
      </div>
    </section>
  );
}
