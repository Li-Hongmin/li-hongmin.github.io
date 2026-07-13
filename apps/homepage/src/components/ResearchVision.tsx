export default function ResearchVision({ vision, affiliation }: { vision: string; affiliation: string }) {
  return (
    <section className="vision-section section-shell" id="about" aria-labelledby="vision-heading">
      <p className="section-kicker">Research vision</p>
      <h2 id="vision-heading">{vision}</h2>
      <p className="vision-affiliation">{affiliation}</p>
    </section>
  );
}
