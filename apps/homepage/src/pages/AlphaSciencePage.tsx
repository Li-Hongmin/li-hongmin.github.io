import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import EditorialPageShell from "../components/EditorialPageShell";
import { researchNotes } from "../content/notes";

const layers = [
  ["01", "Human route control", "People choose the consequential question, define what success means and authorize release."],
  ["02", "Scientific guidance", "Domain reasoning identifies assumptions, competing explanations and the cheapest discriminating observation."],
  ["03", "Bounded execution", "Agents perform explicit retrieval, code, table, figure and verification tasks under limited authority."],
  ["04", "Evidence ledger", "Observations, interpretations, alternatives and decisions remain distinct before manuscript prose is written."],
  ["05", "Claim calibration", "A claim is supported, downgraded, redirected or stopped according to the evidence actually available."],
] as const;

const artifacts = [
  {
    title: "The Calibration Turn in AI-Assisted Research",
    copy: "A conceptual and methodological framework for evidence-licensed claims, with AISim-Cal simulation artifacts.",
    href: "https://arxiv.org/abs/2606.31273",
    label: "Read preprint",
  },
  {
    title: "Calibration Turn code and artifacts",
    copy: "Public manuscript source, tests, simulation code and generated outputs for inspection and reproduction.",
    href: "https://github.com/Li-Hongmin/calibration-turn-ai-assisted-research",
    label: "Inspect repository",
  },
  {
    title: "AlphaScience Codex workflow templates",
    copy: "Reusable public rules and prompt templates for bounded execution, scientific guidance and release gates.",
    href: "https://github.com/Li-Hongmin/alphascience-codex-workflow-templates",
    label: "View templates",
  },
] as const;

export default function AlphaSciencePage() {
  return (
    <EditorialPageShell>
      <article className="project-detail">
        <header className="project-detail__hero section-shell">
          <a className="back-link" href="/projects/"><ArrowLeft aria-hidden="true" size={15} />Projects</a>
          <p className="section-kicker">Flagship research program · Active</p>
          <h1>AlphaScience</h1>
          <p className="project-detail__dek">
            An evidence-calibrated methodology for turning AI-assisted exploration into scientific claims
            proportionate to the available evidence.
          </p>
          <ul aria-label="AlphaScience focus areas">
            <li>AI-assisted science</li><li>Research agents</li><li>Evaluation</li><li>Claim calibration</li>
          </ul>
        </header>

        <section className="project-story section-shell" aria-labelledby="alphascience-problem">
          <p className="project-story__label">The problem</p>
          <div>
            <h2 id="alphascience-problem">Exploration becomes narrative faster than science can validate it.</h2>
            <p>
              AI systems can search, code, compare and write at extraordinary speed. But an output can be
              technically correct while the scientific claim built from it is still too strong. AlphaScience
              treats this gap as a systems problem: preserve the path from question to measurement to decision,
              then calibrate the claim before fluency hides the uncertainty.
            </p>
          </div>
        </section>

        <section className="project-layers section-shell" aria-labelledby="alphascience-system">
          <div className="section-heading-row">
            <p className="section-kicker">System design</p>
            <h2 id="alphascience-system">Five working layers</h2>
          </div>
          <ol>
            {layers.map(([number, title, copy]) => (
              <li key={number}><span>{number}</span><div><h3>{title}</h3><p>{copy}</p></div></li>
            ))}
          </ol>
        </section>

        <section className="project-story section-shell" aria-labelledby="alphascience-contribution">
          <p className="project-story__label">My work</p>
          <div>
            <h2 id="alphascience-contribution">Design the decisions around the model.</h2>
            <p>
              I formulate the claim-calibration framework, design bounded execution and evidence-ledger
              workflows, implement reproducible research artifacts, and use concrete cases to identify where
              the method changes a route—or where it adds ceremony without changing a decision.
            </p>
            <p>
              The objective is not to maximize agent activity. It is to reduce decision-relevant uncertainty
              while keeping scientific interpretation and release authority explicit.
            </p>
          </div>
        </section>

        <section className="project-artifacts section-shell" aria-labelledby="alphascience-artifacts">
          <div className="section-heading-row">
            <p className="section-kicker">Inspectable work</p>
            <h2 id="alphascience-artifacts">Public artifacts</h2>
          </div>
          <div>
            {artifacts.map((artifact) => (
              <article key={artifact.href}>
                <h3>{artifact.title}</h3><p>{artifact.copy}</p>
                <a href={artifact.href} target="_blank" rel="noreferrer">{artifact.label}<ArrowUpRight aria-hidden="true" size={14} /></a>
              </article>
            ))}
          </div>
        </section>

        <section className="project-boundary section-shell" aria-labelledby="alphascience-boundary">
          <p className="section-kicker">Evidence boundary</p>
          <h2 id="alphascience-boundary">A methodology is not yet a validated autonomous scientist.</h2>
          <p>
            AISim-Cal is an illustrative synthetic dynamics exercise, not an empirical forecast or benchmark.
            The public workflow templates document conservative operating rules; they do not contain the
            private AlphaScience system or prove scientific benefit. The decisive next evidence is prospective,
            independent use on real research decisions against simpler alternatives.
          </p>
        </section>

        <section className="related-notes section-shell" aria-labelledby="related-notes-heading">
          <div className="section-heading-row">
            <p className="section-kicker">From the work</p>
            <h2 id="related-notes-heading">Related notes</h2>
          </div>
          <div>
            {researchNotes.map((note) => (
              <article key={note.slug}>
                <time dateTime={note.date}>{note.date}</time>
                <h3><a href={`/notes/${note.slug}/`}>{note.title}</a></h3>
                <p>{note.dek}</p>
                <a href={`/notes/${note.slug}/`}>Read note<ArrowRight aria-hidden="true" size={14} /></a>
              </article>
            ))}
          </div>
        </section>
      </article>
    </EditorialPageShell>
  );
}
