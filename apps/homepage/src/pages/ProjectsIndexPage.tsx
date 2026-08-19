import { ArrowRight, ArrowUpRight } from "lucide-react";
import EditorialPageShell from "../components/EditorialPageShell";
import { projects } from "../content/projects";

export default function ProjectsIndexPage() {
  return (
    <EditorialPageShell>
      <header className="index-hero section-shell">
        <p className="section-kicker">Selected research systems and cases</p>
        <h1>Projects</h1>
        <p>
          Stable accounts of the questions I chose, the systems I built, the evidence that changed the route,
          and the limits that remain.
        </p>
      </header>
      <section className="index-grid section-shell" aria-label="Project index">
        {projects.map((project, index) => (
          <article className={`index-card${index === 0 ? " index-card--featured" : ""}`} key={project.id}>
            <div className="index-card__meta"><span>{String(index + 1).padStart(2, "0")}</span><span>{project.status}</span></div>
            <p>{project.eyebrow}</p>
            <h2>{project.title}</h2>
            <p>{project.summary}</p>
            <ul>{project.signals.map((signal) => <li key={signal}>{signal}</li>)}</ul>
            <a href={project.href} target={project.external ? "_blank" : undefined} rel={project.external ? "noreferrer" : undefined}>
              {project.external ? "View public artifact" : "View project"}
              {project.external ? <ArrowUpRight aria-hidden="true" size={15} /> : <ArrowRight aria-hidden="true" size={15} />}
            </a>
          </article>
        ))}
      </section>
    </EditorialPageShell>
  );
}
