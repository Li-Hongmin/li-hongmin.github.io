import { motion, useReducedMotion } from "framer-motion";
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
  ["Selected Work", "#selected-work"],
  ["Publications", "#publications"],
  ["Experience", "#experience"],
  ["Contact", "#contact"],
] as const;

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
        <h1 id="page-title" className="hero-name">{profile.displayName}</h1>
        <div className="hero-intro">
          <p>{profile.statement}</p>
        </div>
      </motion.div>
      {copyLifted && (
        <motion.div
          className="hero-overview"
          aria-label="Research overview"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reduceMotion ? 0 : 1.05, duration: reduceMotion ? 0 : 0.65 }}
        >
          <p>
            My research develops AI-automated scientific workflows for biomolecular sequence design,
            grounded in reliable AI evaluation and reproducible evidence.
          </p>
          <nav aria-label="Research overview links">
            <a href="#research">Research</a>
            <a href="#selected-work">Selected work</a>
            <a href="#publications">Publications</a>
          </nav>
        </motion.div>
      )}
    </section>
  );
}
