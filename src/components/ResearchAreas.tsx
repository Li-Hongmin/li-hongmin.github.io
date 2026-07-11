import type { ResearchArea } from "../data/profile";

export default function ResearchAreas({ areas }: { areas: readonly ResearchArea[] }) {
  return (
    <section className="editorial-section section-shell" id="research" aria-labelledby="research-heading">
      <div className="section-heading-row">
        <p className="section-kicker">Focus</p>
        <h2 id="research-heading">Research directions</h2>
      </div>
      <ol className="research-list">
        {areas.map((area, index) => (
          <li key={area.id}>
            <span className="row-index" aria-hidden="true">0{index + 1}</span>
            <div><h3>{area.title}</h3><p>{area.description}</p></div>
          </li>
        ))}
      </ol>
    </section>
  );
}
