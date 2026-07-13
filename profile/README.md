# Canonical profile data

`profile.json` is the single editable source for homepage profile facts, the generated CV, and platform proposals. The CV renderer consumes the structured `publicProfile` collections directly; `exports.cv` contains presentation-only settings and no duplicate factual Markdown. Records marked `homepage: false` remain available to the CV without changing the public website. `schema.json` documents the top-level contract; `tools/profile/validate.mjs` enforces cross-record rules that JSON Schema alone cannot express.

## Evidence model

- `sources` identifies self-published, public-snapshot, and official records.
- `evidence` associates date/amount-sensitive public funding entries with source IDs.
- `assertions` records platform-specific facts and explicit destination policy.
- `conflicts` remains `pending` with `autoSync: false` until primary evidence supports a deliberate resolution.
- `platforms.*.externalUpdateGate` prevents proposal files from being treated as completed external updates.

The 2016.10–2017.3 University of Tsukuba and 2008.9–2011.5 high-school entries are retained as researchmap-only assertions and intentionally omitted from homepage and LinkedIn output.

## Commands

- `npm run profile:generate` — deterministically rewrite all generated artifacts.
- `npm run profile:validate` — check IDs, URLs, category exclusivity, conflict state, evidence, and homepage safety.
- `npm run profile:check` — regenerate in memory and compare every output byte-for-byte.
