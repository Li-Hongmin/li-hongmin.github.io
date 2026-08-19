import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import EditorialPageShell from "../components/EditorialPageShell";
import type { ResearchNote } from "../content/notes";

const publicLinks: Record<string, { label: string; href: string }[]> = {
  "evidence-ledger-before-manuscript": [
    { label: "The Calibration Turn", href: "https://arxiv.org/abs/2606.31273" },
    { label: "Code & artifacts", href: "https://github.com/Li-Hongmin/calibration-turn-ai-assisted-research" },
  ],
  "bounded-agent-execution": [
    { label: "Workflow templates", href: "https://github.com/Li-Hongmin/alphascience-codex-workflow-templates" },
  ],
  "selection-is-part-of-the-procedure": [
    { label: "Reproducibility repository", href: "https://github.com/Li-Hongmin/selection-aware-embedding-inference" },
  ],
  "how-long-should-a-cognitive-thread-live": [
    { label: "Sakana AI · Learning to Orchestrate Agents", href: "https://sakana.ai/learning-to-orchestrate/" },
  ],
};

export default function NotePage({ note }: { note: ResearchNote }) {
  return (
    <EditorialPageShell>
      <article className="note-detail section-shell">
        <header>
          <a className="back-link" href="/notes/"><ArrowLeft aria-hidden="true" size={15} />Research notes</a>
          <p className="section-kicker">{note.project}</p>
          <h1>{note.title}</h1>
          <p className="note-detail__dek">{note.dek}</p>
          <div className="note-detail__meta">
            <time dateTime={note.date}>{note.date}</time><span>{note.readingTime}</span><span>{note.evidenceStatus}</span>
          </div>
        </header>

        <div className="note-detail__body">
          {note.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {section.points && <ul>{section.points.map((point) => <li key={point}>{point}</li>)}</ul>}
            </section>
          ))}
        </div>

        <aside className="note-sources" aria-labelledby="note-sources-heading">
          <h2 id="note-sources-heading">Public sources</h2>
          <div>
            {publicLinks[note.slug].map((link) => (
              <a key={link.href} href={link.href} target="_blank" rel="noreferrer">{link.label}<ArrowUpRight aria-hidden="true" size={14} /></a>
            ))}
          </div>
        </aside>

        <footer className="note-project-link">
          <p>Part of the {note.project} research program.</p>
          <a href={note.projectHref}>View project<ArrowRight aria-hidden="true" size={15} /></a>
        </footer>
      </article>
    </EditorialPageShell>
  );
}
