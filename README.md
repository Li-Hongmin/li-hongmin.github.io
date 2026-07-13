# Profile hub

This repository is the canonical, evidence-aware profile hub for Hongmin Li. The public website is a workspace app rather than the repository root.

## Architecture

- `profile/profile.json` — canonical structured facts, source registry, unresolved conflicts, platform gates, evidence, and non-factual export presentation settings.
- `profile/schema.json` — machine-readable shape of the canonical record.
- `profile/sources/` — dated public-source snapshots. A snapshot describes what was page-visible; it does not prove that an unobserved record does not exist.
- `tools/profile/` — dependency-free Node generator, validator, byte-for-byte generated-file check, and tests.
- `exports/` — generated CV and platform-specific update proposals.
- `apps/homepage/` — the complete Vite website, Sites worker/configuration, design records, public assets, and hosting metadata.

## Edit and generate

1. Edit `profile/profile.json` and, when needed, add or update a dated source snapshot.
2. Run `npm run profile:validate`.
3. Run `npm run profile:generate`.
4. Review all generated diffs, especially `exports/researchmap.md` and `exports/linkedin.md`.
5. Run `npm run profile:check` and the project verification commands.

The CV is rendered directly from structured `publicProfile` records; it has no second Markdown fact store. The root lifecycle hooks keep generated data safe: `npm run dev` regenerates first, while `npm run build`, `npm run build:sites`, and `npm run typecheck` run `profile:check` first and fail if generated files are stale. The hooks call only profile scripts, so they do not recurse into their parent command.

Do not hand-edit generated files:

- `apps/homepage/src/generated/profile.json`
- `exports/cv.md`
- `exports/researchmap.md`
- `exports/linkedin.md`

## Development and publication

```sh
npm ci
npm run dev
npm run test:run
npm run typecheck
npm run build
npm run build:sites
```

`npm run build` creates `apps/homepage/dist` for GitHub Pages. `npm run build:sites` runs in the homepage workspace and also places `.openai/hosting.json` at `apps/homepage/dist/.openai/hosting.json`.

## External update gate

Generated researchmap and LinkedIn files are proposals, not evidence that an external account was updated. Before any external change:

1. confirm the destination profile URL and authenticated account;
2. resolve every `pending` conflict using primary evidence;
3. verify proposed publication, presentation, project, date, and amount fields in the platform UI;
4. obtain explicit approval for the final diff; and
5. only then perform and independently verify the external update.

The repository generator never logs in, publishes, or auto-synchronizes disputed data.
