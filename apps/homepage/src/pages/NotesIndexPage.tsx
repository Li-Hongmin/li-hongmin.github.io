import { ArrowRight } from "lucide-react";
import EditorialPageShell from "../components/EditorialPageShell";
import { researchNotes } from "../content/notes";

export default function NotesIndexPage() {
  return (
    <EditorialPageShell>
      <header className="index-hero section-shell">
        <p className="section-kicker">Essays, case studies and working lessons</p>
        <h1>Research notes</h1>
        <p>
          Dated accounts of research decisions, engineering choices and failed assumptions. Notes are not
          peer-reviewed publications; each article states its evidence status and boundary.
        </p>
      </header>
      <section className="notes-index section-shell" aria-label="Research notes index">
        {researchNotes.map((note, index) => (
          <article key={note.slug}>
            <div className="notes-index__number">{String(index + 1).padStart(2, "0")}</div>
            <div className="notes-index__copy">
              <p>{note.project} · {note.date} · {note.readingTime}</p>
              <h2><a href={`/notes/${note.slug}/`}>{note.title}</a></h2>
              <p>{note.dek}</p>
              <span>{note.evidenceStatus}</span>
            </div>
            <a className="notes-index__link" href={`/notes/${note.slug}/`} aria-label={`Read ${note.title}`}>
              Read<ArrowRight aria-hidden="true" size={15} />
            </a>
          </article>
        ))}
      </section>
    </EditorialPageShell>
  );
}
