export type ProjectLink = {
  label: string;
  href: string;
};

export type ProjectSummary = {
  id: string;
  title: string;
  eyebrow: string;
  summary: string;
  status: string;
  href: string;
  external?: boolean;
  signals: readonly string[];
  links: readonly ProjectLink[];
};

export const projects: readonly ProjectSummary[] = [
  {
    id: "alphascience",
    title: "AlphaScience",
    eyebrow: "Flagship research program",
    summary:
      "An evidence-calibrated methodology for turning AI-assisted exploration into scientific claims proportionate to the available evidence.",
    status: "Active · public framework",
    href: "/projects/alphascience/",
    signals: ["Evidence ledger", "Claim calibration", "Human route control"],
    links: [
      { label: "Project page", href: "/projects/alphascience/" },
      { label: "Framework paper", href: "https://arxiv.org/abs/2606.31273" },
    ],
  },
  {
    id: "conditional-perturbation-benchmarking",
    title: "Conditional Perturbation Benchmarking",
    eyebrow: "AI for science evaluation",
    summary:
      "A deterministic replay showing how benchmark composition changes comparative performance among single-cell perturbation predictors.",
    status: "Public reproducibility artifact",
    href: "https://github.com/Li-Hongmin/conditional-perturbation-benchmarking",
    external: true,
    signals: ["46 perturbations", "6 model families", "10 registered runs"],
    links: [
      {
        label: "Code & results",
        href: "https://github.com/Li-Hongmin/conditional-perturbation-benchmarking",
      },
    ],
  },
  {
    id: "selection-aware-inference",
    title: "Selection-Aware Embedding Inference",
    eyebrow: "Reliable AI evaluation",
    summary:
      "A cross-domain study of why label-guided map selection must be replayed inside the statistical procedure.",
    status: "Public code, data & figures",
    href: "https://github.com/Li-Hongmin/selection-aware-embedding-inference",
    external: true,
    signals: ["4 domains", "64 embeddings", "9,600 evaluation records"],
    links: [
      {
        label: "Code & figures",
        href: "https://github.com/Li-Hongmin/selection-aware-embedding-inference",
      },
    ],
  },
  {
    id: "id3",
    title: "ID3",
    eyebrow: "Biomolecular sequence design",
    summary:
      "A differentiable framework for optimizing mRNA sequences while preserving amino-acid constraints and integrating biological objectives.",
    status: "Preprint · open implementation",
    href: "https://github.com/Li-Hongmin/ID3",
    external: true,
    signals: ["3 constraint mechanisms", "4 optimization modes", "12 variants"],
    links: [
      { label: "Preprint", href: "https://doi.org/10.1101/2025.10.22.683691" },
      { label: "Code", href: "https://github.com/Li-Hongmin/ID3" },
    ],
  },
] as const;

export const alphaScience = projects[0];
