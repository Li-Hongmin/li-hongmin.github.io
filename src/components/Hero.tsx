import { motion, useReducedMotion } from "framer-motion";
import type { Profile } from "../data/profile";

type HeroProps = { profile: Profile };

const navItems = [
  ["About", "#about"],
  ["Research", "#research"],
  ["Publications", "#publications"],
  ["Contact", "#contact"],
] as const;

export default function Hero({ profile }: HeroProps) {
  const reduceMotion = useReducedMotion();

  const entrance = reduceMotion
    ? { initial: false as const, animate: { opacity: 1, y: 0 }, transition: { duration: 0 } }
    : {
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <section className="hero" id="top" aria-labelledby="page-title">
      <div className="hero-copy-shade" aria-hidden="true" />
      <motion.header className="hero-header" {...entrance}>
        <a className="monogram" href="#top" aria-label="Hongmin Li, home">H/L</a>
        <nav aria-label="Primary navigation">
          <ul className="hero-nav">
            {navItems.map(([label, href]) => (
              <li key={href}><a href={href}>{label}</a></li>
            ))}
          </ul>
        </nav>
      </motion.header>
      <motion.div className="hero-content" {...entrance}>
        <h1 id="page-title" className="hero-name">{profile.displayName}</h1>
        <div className="hero-intro">
          <p>{profile.statement}</p>
          <a className="hero-cta" href="#about" aria-label="Explore research">
            Explore research <span aria-hidden="true">↘</span>
          </a>
        </div>
      </motion.div>
    </section>
  );
}
