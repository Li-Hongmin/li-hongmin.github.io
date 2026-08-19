import { ArrowRight } from "lucide-react";
import { researchNotes } from "../content/notes";

export default function RecentNotes() {
  const recentNotes = [...researchNotes].reverse().slice(0, 3);

  return (
    <section className="editorial-section section-shell notes-section" id="notes" aria-labelledby="notes-heading">
      <div className="section-heading-row">
        <p className="section-kicker">Ideas, observations and working lessons</p>
        <h2 id="notes-heading">Insights &amp; recent notes</h2>
      </div>
      <div className="notes-list">
        {recentNotes.map((note, index) => (
          <article className="note-preview" key={note.slug}>
            <div className="note-preview__meta">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <time dateTime={note.date}>{note.date}</time>
              <span>{note.readingTime}</span>
            </div>
            <div className="note-preview__copy">
              <p>{note.project}</p>
              <h3><a href={`/notes/${note.slug}/`}>{note.title}</a></h3>
              <p>{note.dek}</p>
            </div>
            <a className="note-preview__link" href={`/notes/${note.slug}/`} aria-label={`Read ${note.title}`}>
              Read note<ArrowRight aria-hidden="true" size={15} />
            </a>
          </article>
        ))}
      </div>
      <a className="section-index-link" href="/notes/">Browse all notes<ArrowRight aria-hidden="true" size={15} /></a>
    </section>
  );
}
