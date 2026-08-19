import { motion, useReducedMotion } from "framer-motion";
import type { Profile } from "../data/profile";

type HeroProps = {
  profile: Profile;
  copyLifted?: boolean;
};

const mobileNavItems = [
  ["Projects", "#projects"],
  ["Notes", "#notes"],
  ["Papers", "#publications"],
  ["Contact", "#contact"],
] as const;

const desktopOutlineItems = [
  ["About", "#about"],
  ["Projects", "#projects"],
  ["Research Notes", "#notes"],
  ["Featured Paper", "#research"],
  ["Publications", "#publications"],
  ["Experience", "#experience"],
  ["Contact", "#contact"],
] as const;

function RecentNews({ profile }: { profile: Profile }) {
  const news = [
    { ...profile.publications[0], category: "Preprint", href: profile.publications[0]?.links[0]?.href ?? "#publications" },
    { ...profile.grants[0], category: "Support", href: "#grants" },
    { ...profile.activities[0], category: "Presentation", href: "#experience" },
    ...profile.publications.slice(1, 5).map((item) => ({ ...item, category: "Preprint", href: item.links[0]?.href ?? "#publications" })),
    { ...profile.experience[0], category: "Appointment", href: "#experience" },
    { ...profile.experience[1], category: "Appointment", href: "#experience" },
  ].filter((item) => item.id).slice(0, 9);

  return (
    <section className="hero-news" aria-labelledby="hero-news-heading">
      <h2 id="hero-news-heading">Recent news</h2>
      <ol>
        {news.map((item) => {
          const external = /^https?:/.test(item.href);
          return (
            <li key={item.id}>
              <a href={item.href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>
                <span>{item.category} · {item.date}</span>
                <strong>{item.title}</strong>
              </a>
            </li>
          );
        })}
      </ol>
    </section>
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
        <h1 id="page-title" className="hero-name">
          <span>HONGMIN</span>{" "}<span>LI</span>
        </h1>
        <div className="hero-intro">
          <p>{profile.statement}</p>
        </div>
      </motion.div>
      {copyLifted && (
        <motion.div
          className="hero-overview"
          aria-label="Recent news overview"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reduceMotion ? 0 : 1.05, duration: reduceMotion ? 0 : 0.65 }}
        >
          <p>
            I build evidence-calibrated AI systems for scientific and mathematical research,
            grounded in reproducible evaluation and concrete research cases.
          </p>
          <RecentNews profile={profile} />
        </motion.div>
      )}
    </section>
  );
}
