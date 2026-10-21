# Development Plan: apps (feat/serve-copies branch)

*Generated on 2026-10-21 by Vibe Feature MCP*
*Workflow: [epcc](https://codemcp.github.io/workflows/workflows/epcc)*

## Goal

lernapps.net serves a copy of every listed app (lernapps/docs KD-21, lernapps/apps#58), our own apps included: one address, one privacy notice, links that keep working. When a listing pull request is merged, and on every update of an entry, the app is built from the commit its entry names and published at `https://lernapps.net/<id>/`. The creator stays the author and keeps the repo, the licence and their own address.

Repos involved: lernapps/apps (entries, building the copies), lernapps/lernapps.github.io (the root site that serves `/<id>/`), lernapps/tooling (rule `own-data-only`, the site and publish actions, arc42), the app repos of the lernapps organisation (their own Pages switched off once the copy is live).

## Key Decisions

### KD-01: Copies at `lernapps.net/<id>/`, served by the root site (2026-10-21)
`/apps/<id>/app/` would put "app" three times into the address teachers type or scan. `/<id>/` is the shortest, and our four apps in the organisation keep their address exactly, so links on worksheets do not break (#57).
- **Decision**: The copies are part of the root site (lernapps.github.io), each under `/<id>/`. Not one repo per app: that needs a GitHub App that creates repos.
- **Consequence**: ids must not collide with paths of the root site or with other repos served below lernapps.net (`apps`, `docs`, `tooling`, `en`, …): a list of reserved ids, checked by the listing validation.
- **Consequence**: the 1 GB limit of GitHub Pages is shared by the home page and all copies; enough for small learning apps.

### KD-02: Our own apps are built and published the same way (2026-10-21)
No exception for the apps in the organisation: they get an entry `commit` and a copy like every other app. Once the copy is live, the app repo's own Pages is switched off, so the copy takes over the same address.

### KD-03: The copy is the bundle built from the entry's pinned commit (2026-10-21)
The entry gets a required field `commit` (full id). The copy is built from that commit with `scripts/review-input.mjs` (the review's build: clone, `npm ci && npm run build` or the repo as its own bundle, in a container, without secrets) and checked with `lernapps check <bundle> --entry`. What is served is what was checked, not what happens to be at the creator's address. `url` stays the creator's address, which the listing check of a pull request opens.

### KD-04: Copies built in apps, published by the root site (2026-10-21)
- apps, on a push to `main` that changes `entries/*.yaml`: a job without secrets and with a read-only token builds the changed entries in a container; a job with `contents: write` (normal `GITHUB_TOKEN`, runs no app code) writes the bundles to the branch `copies` of lernapps/apps, one directory per id; a deleted entry removes its directory.
- lernapps.github.io: its Pages deploy checks out `apps@copies` and puts each directory under `_site/<id>/` after the site's own build and check, so home page and copies go online together.

### KD-05: An app touches only its own data (2026-10-20, lernapps/tooling branch feat/own-data-only)
All copies share the origin lernapps.net with each other and the platform. Rule `own-data-only`, scope listing, severity error: keys, databases and caches named `lernapps:<id>:`, `<id>` the catalog id.

### KD-06: Relative paths are a condition for listing (2026-10-21)
Checked: all seven listed apps reference their files relatively (`./assets/…`); apps built with the tooling use `base: "./"` (archetypes/shared/preset.ts). The check of the copy at its new path catches an app with fixed paths; no separate rule.

## Notes

### Open questions (decide in Explore)
1. **Trigger of the root site's deploy.** A workflow's `GITHUB_TOKEN` only works in its own repo, so apps cannot start the deploy of lernapps.github.io without a credential. Options: (a) a GitHub App of the organisation with only *Actions: write* on lernapps.github.io; a small job in apps that runs no app code mints a short-lived token and runs `gh workflow run`. (b) a fine-grained personal access token (bound to a person, expires). (c) no credential: a scheduled workflow in lernapps.github.io compares the head of `apps@copies` with the deployed one, every 15 minutes (up to 15 minutes delay; GitHub pauses schedules after 60 days without activity).
2. **Updates: review or automatic?** Every update of an app goes the same way (new `commit` by pull request, check, merge, build, deploy). Proposal: an update is merged automatically when the listing check is green; a review only for a first listing and when the licence or the source repo changes; a scheduled workflow opens the update pull request when the creator's `main` moves. With that, the trigger matters, so option (a).

### Facts found
- review.yml today reviews the head of the app repo's `main` or `/review <commit>`; with the pinned commit it should default to the entry's `commit`.
- tooling's `site-deploy` replaces `gh-pages` and only keeps `pr-preview/` (`clean-exclude`); the copies must therefore be part of the site artifact, not written to `gh-pages` beside it.
- Catalog (src/_data/catalog.js): `app.url`, the topic links and the QR code are built from `entry.url`; they move to `https://lernapps.net/<id>/`.
- Of the listed apps, only mathe-karte fails `own-data-only` (keys without prefix, e.g. `binom-trainer.selbsteinschaetzung`, `dtc-theme`); same origin as before, so learners' progress can be migrated in the app.
- To verify: a repo with Pages in the organisation (e.g. lernapps/mathe-karte) shadows the root site's `/<id>/`, so the copy takes over only after that repo's Pages is switched off.

## Explore
### Phase Entrance Criteria
- The need is stated: lernapps/apps#58, lernapps/docs KD-21.

### Tasks
- [ ] Decide the trigger of the root site's deploy (open question 1)
- [ ] Decide the update policy (open question 2)
- [ ] Verify that a project repo's Pages shadows the root site's `/<id>/`, and what happens when it is switched off
- [ ] Build all seven apps at their current commits with `review-input.mjs` and check the bundles (sizes, relative paths)
- [ ] List the reserved ids (paths of the root site, repos served below lernapps.net)

### Completed
- [x] Created development plan file
- [x] Path decided: `lernapps.net/<id>/` (KD-01), own apps included (KD-02)
- [x] Rule `own-data-only` built in tooling (KD-05)
- [x] Relative paths of the listed apps checked (KD-06)

## Plan
### Phase Entrance Criteria
- Open questions 1 and 2 are decided.
- The shadowing of `/<id>/` by project repos is verified.
- All seven apps build at a pinned commit.

### Tasks
- [ ] *To be added when this phase becomes active*

### Completed
*None yet*

## Code
### Phase Entrance Criteria
- The plan names the changes per repo (apps, lernapps.github.io, tooling, app repos) and their order.
- The user approved the plan.

### Tasks
- [ ] *To be added when this phase becomes active*

### Completed
*None yet*

## Commit
### Phase Entrance Criteria
- All changes are implemented, and the checks and tests of each repo pass.
- A first copy is live at `lernapps.net/<id>/` and checked there.

### Tasks
- [ ] *To be added when this phase becomes active*

### Completed
*None yet*



---
*This plan is maintained by the LLM. Tool responses provide guidance on which section to focus on and what tasks to work on.*
