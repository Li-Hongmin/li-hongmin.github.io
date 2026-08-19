export type NoteSection = {
  heading: string;
  paragraphs: readonly string[];
  points?: readonly string[];
};

export type ResearchNote = {
  slug: string;
  title: string;
  dek: string;
  date: string;
  readingTime: string;
  project: string;
  projectHref: string;
  evidenceStatus: string;
  sections: readonly NoteSection[];
};

export const researchNotes: readonly ResearchNote[] = [
  {
    slug: "evidence-ledger-before-manuscript",
    title: "Why an Evidence Ledger Comes Before a Manuscript",
    dek: "AI can move from observation to narrative too quickly. An evidence ledger keeps exploration useful without allowing fluency to outrun support.",
    date: "2026-08-19",
    readingTime: "6 min read",
    project: "AlphaScience",
    projectHref: "/projects/alphascience/",
    evidenceStatus: "Methodological research note · not peer reviewed",
    sections: [
      {
        heading: "The dangerous shortcut",
        paragraphs: [
          "AI-assisted research systems are unusually good at collapsing different epistemic states into one fluent answer. A preliminary pattern, a robustness check, an external confirmation and a manuscript claim can be rendered in the same confident voice even though they license very different conclusions.",
          "The problem is not merely hallucination. A system can report every number correctly and still overstate what those numbers justify. Once the narrative exists, later work tends to defend it rather than test the decisions that produced it.",
        ],
      },
      {
        heading: "The ledger is a decision surface",
        paragraphs: [
          "In AlphaScience, the evidence ledger sits between exploration and manuscript-facing claims. It records what was observed, under which assumptions, with which comparison, and what decision the observation is allowed to change.",
          "The ledger is deliberately less elegant than prose. Its purpose is to preserve weak, ordinary, incomplete and negative results before they are edited into a coherent story.",
        ],
        points: [
          "Observed: the direct output of an experiment or source.",
          "Supported interpretation: an explanation licensed by that output and its design.",
          "Open alternative: a competing explanation that remains viable.",
          "Decision: continue, redirect, downgrade or stop.",
        ],
      },
      {
        heading: "Calibration is an operation, not editing",
        paragraphs: [
          "Claim calibration should happen inside the research loop. If the evidence does not discriminate between two explanations, the next action is not to improve the wording; it is to run the cheapest observation that would change the route, or to state that the distinction remains unresolved.",
          "This is why an evidence ledger comes before a manuscript. It makes the cost of a stronger sentence visible: the additional experiment, source, comparison or assumption that sentence requires.",
        ],
      },
      {
        heading: "What remains unproven",
        paragraphs: [
          "The ledger is a methodological control, not proof that an AI-assisted project is scientifically successful. The public AISim-Cal exercise illustrates possible research dynamics; it is not an empirical forecast or a benchmark of autonomous discovery.",
          "The next meaningful validation is prospective: use the method on independent, consequential research decisions and test whether it changes routes, prevents overclaiming or preserves useful negative results.",
        ],
      },
    ],
  },
  {
    slug: "bounded-agent-execution",
    title: "Bounded Agent Execution for Scientific Research",
    dek: "A useful research agent needs more than tools. It needs a bounded question, explicit authority and a handoff that preserves the claim boundary.",
    date: "2026-08-19",
    readingTime: "7 min read",
    project: "AlphaScience",
    projectHref: "/projects/alphascience/",
    evidenceStatus: "Engineering research note · not peer reviewed",
    sections: [
      {
        heading: "More autonomy is not the same as more progress",
        paragraphs: [
          "Long agent traces often look productive because they contain searches, code, tests and confident summaries. But the relevant unit of progress is a reduction in uncertainty that can change the next scientific decision.",
          "Without a bounded task, agents tend to broaden the literature search, add infrastructure, repeat validation or optimize artifacts whose possible outcomes no longer affect the route.",
        ],
      },
      {
        heading: "A bounded execution package",
        paragraphs: [
          "The AlphaScience workflow separates scientific route control from execution. A human or scientific-guidance layer decides which uncertainty matters. The execution agent receives a compact package containing the question, authoritative inputs, allowed actions, acceptance criteria and the required handoff.",
        ],
        points: [
          "Context packet: only the state needed for the current decision.",
          "Task card: inputs, commands, exclusions and acceptance criteria.",
          "Execution capsule: bounded file, code, figure or retrieval work.",
          "Compact handoff: result, failure, uncertainty and artifact locations.",
          "Verifier handoff: an independent check before claim status changes.",
        ],
      },
      {
        heading: "Authority should be explicit",
        paragraphs: [
          "An execution agent may calculate a statistic, rebuild a figure or retrieve a source. That does not authorize it to decide that the result is novel, causal, clinically useful or publication-ready.",
          "The distinction matters because many research failures are authority failures rather than calculation failures. A technically correct output is silently promoted into a stronger scientific role than the design permits.",
        ],
      },
      {
        heading: "The cheapest useful architecture",
        paragraphs: [
          "The practical architecture is intentionally small: route control, bounded execution, a retained evidence state, verification and a human release gate. More orchestration is added only after the same manual problem recurs and a direct observation shows that automation would change performance.",
          "This remains a workflow hypothesis. Its value should be judged prospectively against simpler alternatives, including a strong single agent with the same token and tool budget.",
        ],
      },
    ],
  },
  {
    slug: "selection-is-part-of-the-procedure",
    title: "Selection Is Part of the Statistical Procedure",
    dek: "When labels choose the most favorable representation, valid inference must replay that choice rather than pretend the selected map was fixed in advance.",
    date: "2026-08-19",
    readingTime: "6 min read",
    project: "AlphaScience · evaluation case",
    projectHref: "/projects/alphascience/",
    evidenceStatus: "Case note based on a public reproducibility artifact",
    sections: [
      {
        heading: "The workflow under test",
        paragraphs: [
          "Suppose several two-dimensional embeddings are available. Labels are used to select the map with the largest same-label neighbourhood agreement, and the same labels are then used to test whether the selected map shows more structure than expected by chance.",
          "If the test treats the winning map as if it had been chosen before seeing the labels, it ignores the search that made the map look favorable.",
        ],
      },
      {
        heading: "Replay the choice",
        paragraphs: [
          "The valid randomization target includes the recorded selection rule. For every label permutation, the procedure must choose the winning map again and then calculate the statistic. The null distribution therefore represents the workflow that was actually performed.",
          "This idea was tested across Dry Bean, wearable activity, BBBP and PBMC representations. The public reconstruction includes 64 embeddings and 9,600 empirical evaluation records.",
        ],
      },
      {
        heading: "Why this is an AlphaScience case",
        paragraphs: [
          "The central issue is not a specialized correction detached from research practice. It is a measurement-to-decision path: labels changed which representation entered the claim, so that decision must remain inside the evidence record.",
          "The same principle applies more broadly to model selection, prompt selection, benchmark filtering and repeated agent attempts. If an observed outcome changes what is selected, inference over the selected object must account for that path.",
        ],
      },
      {
        heading: "Boundary",
        paragraphs: [
          "The study diagnoses the specified label-guided workflow. It does not estimate how common selective reporting is, validate the scientific labels or provide conditional inference for every individual selected map.",
          "The complete code, processed data, configurations and figure sources are available in the public repository.",
        ],
      },
    ],
  },
] as const;

export function findResearchNote(slug: string) {
  return researchNotes.find((note) => note.slug === slug);
}
