import { motion, useReducedMotion } from "framer-motion";
import { useState, type FocusEvent } from "react";
import type { Profile } from "../data/profile";

type HeroProps = {
  profile: Profile;
  copyLifted?: boolean;
};

const mobileNavItems = [
  ["About", "#about"],
  ["Paper", "#research"],
  ["Publications", "#publications"],
  ["Contact", "#contact"],
] as const;

const desktopOutlineItems = [
  ["About", "#about"],
  ["Featured Paper", "#research"],
  ["Publications", "#publications"],
  ["Appointments", "#experience"],
  ["Education", "#education"],
  ["Funding & compute", "#grants"],
  ["Honors", "#awards"],
  ["Peer Review", "#peer-review"],
  ["Contact", "#contact"],
] as const;

const overviewItems = [
  ["research", "Research", "#research"],
  ["publications", "Publications", "#publications"],
] as const;

type OverviewPreview = (typeof overviewItems)[number][0];

function shortTitle(title: string) {
  return title.split(":", 1)[0].trim();
}

function OverviewPreviewContent({ preview, profile }: { preview: OverviewPreview; profile: Profile }) {
  const featuredPaper = profile.publications.find((publication) => publication.featured) ?? profile.publications[0];

  if (!featuredPaper) return null;

  if (preview === "research") {
    return (
      <div className="hero-overview__preview" id="research-overview-preview" role="status" aria-live="polite" aria-atomic="true">
        <p className="hero-overview__preview-kicker">Featured paper · {featuredPaper.date}</p>
        <dl className="hero-overview__preview-research">
          <div>
            <dt>Short title</dt>
            <dd>{shortTitle(featuredPaper.title)}</dd>
          </div>
          <div>
            <dt>Full title</dt>
            <dd>{featuredPaper.title}</dd>
          </div>
          <div>
            <dt>Principle</dt>
            <dd>No claim without license.</dd>
          </div>
        </dl>
      </div>
    );
  }

  const records = profile.publications.slice(0, 3).map((publication) => ({
    id: publication.id,
    title: publication.title,
    meta: publication.date,
  }));

  return (
    <div className="hero-overview__preview" id="research-overview-preview" role="status" aria-live="polite" aria-atomic="true">
      <p className="hero-overview__preview-kicker">Publications</p>
      <ol className="hero-overview__preview-list">
        {records.map((record) => (
          <li key={record.id}>
            <span>{record.title}</span>
            <span>{record.meta}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function HeroNavigation({ className = "mobile-navigation" }: { className?: string }) {
  const isDesktopOutline = className === "desktop-outline";
  const items = isDesktopOutline ? desktopOutlineItems : mobileNavItems;

  return (
    <nav className={className} aria-label={isDesktopOutline ? "Desktop outline navigation" : "Primary navigation"}>
      <ul className="hero-nav">
        {items.map(([label, href]) => (
          <li key={href}><a href={href}>{label}</a></li>
        ))}
      </ul>
    </nav>
  );
}

export default function Hero({ profile, copyLifted = false }: HeroProps) {
  const reduceMotion = useReducedMotion();
  const [activeOverviewPreview, setActiveOverviewPreview] = useState<OverviewPreview | null>(null);

  const clearOverviewPreviewAfterBlur = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setActiveOverviewPreview(null);
    }
  };

  const headerEntrance = reduceMotion
    ? { initial: false as const, animate: { opacity: 1, y: 0 }, transition: { duration: 0 } }
    : {
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
      };

  const contentEntrance = reduceMotion
    ? { initial: false as const, animate: { opacity: 1, y: 0 }, transition: { duration: 0 } }
    : {
        initial: false as const,
        animate: {
          opacity: 1,
          y: copyLifted ? "calc(-100svh + 26rem)" : 0,
        },
        transition: {
          delay: copyLifted ? 0 : 0.12,
          duration: copyLifted ? 1.15 : 0.82,
          ease: [0.22, 1, 0.36, 1] as const,
        },
      };

  return (
    <section className={`hero${copyLifted ? " hero--lifted" : ""}`} id="top" aria-labelledby="page-title">
      <div className="hero-copy-shade" aria-hidden="true" />
      <motion.header className="hero-header" {...headerEntrance}>
        <a className="monogram" href="#top" aria-label="Hongmin Li, home">H/L</a>
        <HeroNavigation />
      </motion.header>
      <motion.div className="hero-content" {...contentEntrance}>
        <h1 id="page-title" className="hero-name">{profile.displayName}</h1>
        <div className="hero-intro">
          <p>{profile.statement}</p>
        </div>
      </motion.div>
      {copyLifted && (
        <motion.div
          className="hero-overview"
          aria-label="Research overview"
          onMouseLeave={() => setActiveOverviewPreview(null)}
          onBlurCapture={clearOverviewPreviewAfterBlur}
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reduceMotion ? 0 : 1.05, duration: reduceMotion ? 0 : 0.65 }}
        >
          <p>
            My research develops AI-automated scientific workflows for biomolecular sequence design,
            grounded in reliable AI evaluation and reproducible evidence.
          </p>
          <nav aria-label="Research overview links">
            {overviewItems.map(([preview, label, href]) => (
              <a
                key={preview}
                href={href}
                aria-describedby={activeOverviewPreview === preview ? "research-overview-preview" : undefined}
                onMouseEnter={() => setActiveOverviewPreview(preview)}
                onFocus={() => setActiveOverviewPreview(preview)}
              >
                {label}
              </a>
            ))}
          </nav>
          {activeOverviewPreview && <OverviewPreviewContent preview={activeOverviewPreview} profile={profile} />}
        </motion.div>
      )}
    </section>
  );
}
