import { ArrowRight, ArrowUpRight } from "lucide-react";
import { projects } from "../content/projects";

export default function FeaturedProjects() {
  const [flagship, ...supporting] = projects;

  return (
    <section className="editorial-section section-shell projects-section" id="projects" aria-labelledby="projects-heading">
      <div className="section-heading-row">
        <p className="section-kicker">Selected work</p>
        <h2 id="projects-heading">Projects</h2>
      </div>

      <article className="flagship-project">
        <div className="flagship-project__intro">
          <p>{flagship.eyebrow}</p>
          <p>{flagship.status}</p>
        </div>
        <div className="flagship-project__body">
          <div>
            <h3>{flagship.title}</h3>
            <p>{flagship.summary}</p>
          </div>
          <ul aria-label="AlphaScience core ideas">
            {flagship.signals.map((signal) => <li key={signal}>{signal}</li>)}
          </ul>
        </div>
        <a className="project-primary-link" href={flagship.href}>
          Explore AlphaScience<ArrowRight aria-hidden="true" size={17} />
        </a>
      </article>

      <div className="project-grid" aria-label="Supporting research projects">
        {supporting.map((project) => (
          <article className="project-card" key={project.id}>
            <p className="project-card__eyebrow">{project.eyebrow}</p>
            <h3>{project.title}</h3>
            <p className="project-card__summary">{project.summary}</p>
            <ul>
              {project.signals.map((signal) => <li key={signal}>{signal}</li>)}
            </ul>
            <a href={project.href} target={project.external ? "_blank" : undefined} rel={project.external ? "noreferrer" : undefined}>
              View public artifact<ArrowUpRight aria-hidden="true" size={14} />
            </a>
          </article>
        ))}
      </div>

      <a className="section-index-link" href="/projects/">All projects<ArrowRight aria-hidden="true" size={15} /></a>
    </section>
  );
}
