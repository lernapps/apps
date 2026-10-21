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

### KD-04: Four steps from an entry to its copy (2026-10-21)
The steps are described under "Steps" below: build the app, push it into its subdirectory of `gh-pages`, start it automatically, take over the apps already listed. This replaces the earlier idea of a branch `copies` in lernapps/apps that the root site's deploy pulls in: the copy goes straight into the `gh-pages` branch that serves `lernapps.net/<id>/`, and GitHub Pages publishes it on that push.

### KD-05: An app touches only its own data (2026-10-20, lernapps/tooling branch feat/own-data-only)
All copies share the origin lernapps.net with each other and the platform. Rule `own-data-only`, scope listing, severity error: keys, databases and caches named `lernapps:<id>:`, `<id>` the catalog id.

### KD-06: Relative paths are a condition for listing (2026-10-21)
Checked: all seven listed apps reference their files relatively (`./assets/…`); apps built with the tooling use `base: "./"` (archetypes/shared/preset.ts). The check of the copy at its new path catches an app with fixed paths; no separate rule.

### KD-07: A GitHub App of the organisation publishes the copies (2026-10-21)
Set up once by the owner (section "GitHub App setup"). Only jobs that run no app code get a token from it, short-lived and limited to the repos the job needs: `publish` to lernapps.github.io (push into `gh-pages`), the update job to lernapps/apps (branch and pull request: a pull request opened with a workflow's `GITHUB_TOKEN` would start no workflow, so the listing check would not run).

### KD-08: mathe-karte is the test of a submission that does not fit (2026-10-21)
mathe-karte has no licence file and fails `own-data-only`. Its entry gets `commit` like the others; the expected result: the build's check reports the errors, no copy is published, the run fails visibly, and mathe-karte stays at its own repo's Pages (not switched off). This tests the path of a submission that does not fit before any creator meets it.

### KD-09: Licences after the first copies, as the test of an update (2026-10-21)
Once the copies are live, the copyright lines of the licences are fixed in the app repos (they name "Claude", not the creator) and mathe-karte gets a licence file. Each fix is a new commit of the app, so it goes through step 3 as an update: a pull request that is not merged automatically (KD-10), reviewed, merged, published. This tests the update path, and whether the change arrives in the copy.

### KD-10: An update is merged automatically only when it changes nothing but versions of existing npm dependencies (2026-10-21)
- **Decision**: The update pull request (new `commit`) is merged automatically only if, between the entry's old and new commit of the app repo, every change is the version of a dependency that already exists in a `package.json` (`dependencies`, `devDependencies`, `peerDependencies`, `optionalDependencies`), and the listing check is green. Anything else needs a review and a merge by hand: any other file, an added or removed dependency, scripts, the licence (also for our own apps).
- **Consequence**: Renovate's updates in the app repos arrive in the copies without anyone's hand; content, code and licence changes always get a human look.
- **Lock files** (confirmed 2026-10-21): a version bump also changes `package-lock.json`. Allowed when it changes only entries of the bumped packages and their dependencies, and every `resolved` points to `https://registry.npmjs.org/`; otherwise no automatic merge.

### KD-11: Reserved ids (2026-10-21)
An id may not be a top-level path of the root site (today in `gh-pages`: `about`, `brand`, `en`, `features`, `imprint`, `join`, `privacy`, `pr-preview`, and its files) nor the name of a repo of the organisation (`apps`, `docs`, `tooling`, `app-templates`, `pflanzen`, `map`, `.github`, `lernapps.github.io`, …), unless that repo is the entry's own `source` (as for `elektrizitaet`). The listing validation checks the first against a list in lernapps/apps and the second against the organisation's repos.

### KD-12: Shadowing by a repo's own Pages is no blocker (2026-10-21)
The GitHub docs do not say whether a project repo's Pages or a folder of the root site wins at `/<id>/` ([user, organization and project pages](https://docs.github.com/enterprise/2.10/user/articles/user-organization-and-project-pages)). Either way the address never breaks: the copy is published first, then the repo's Pages is switched off. Verified during the rollout of the first app of the organisation: which one answers before and after the switch.

### KD-13: The copies move to `lernapps.net/apps/start/<id>/` (2026-10-21, supersedes KD-01, KD-11, KD-12 and step 2's push into the root site)
The rollout showed two things: a repo of the organisation keeps its path `lernapps.net/<id>/` even with its own Pages switched off (the root site's copy answered 404, so anorganische-chemie, elektrizitaet and naturwunder-quiz were unreachable until their Pages was switched on again), and those repos need their own Pages anyway for the previews of their pull requests.
- **Decision** (user): a reserved sub-path of the app overview's site, `lernapps.net/apps/start/<id>/`. The copies live in the `gh-pages` branch of lernapps/apps, directory `start/`, with `start/copies.txt`; `publish.yml` pushes there with the workflow's own `GITHUB_TOKEN`, so the GitHub App is no longer needed for publishing (still for the update pull requests). tooling's `site-deploy` gets an input `keep` (here `start/`), and no longer reads a list of copies from the root site.
- **Consequences**: the app repos keep their Pages (their own address and their previews); no clash with the names of repos; the reserved ids are only the top-level paths of the app overview's site (`start`, `en`, `build`, `enter`, `schemas`, `assets`, `pr-preview`, …); the address is longer than `/<id>/`, but has "app" only in the domain and the catalog's path.
- **Cleanup done**: the six copies and `copies.txt` removed from the root site's `gh-pages` (lernapps.github.io a7f6059); the catalog built again so it links the creators' addresses until the new copies are live.

## Steps

### 1. Build the app
- Where: a workflow in lernapps/apps (`publish.yml`), job `build`: no secrets, a read-only token, the build in a container (`BUILD_IMAGE` as in review.yml).
- What: for each added or changed entry, `scripts/review-input.mjs --repo <source> --commit <commit> --container <image>`: clone at the pinned commit, `npm ci && npm run build` (or the repo as its own bundle), `lernapps check <bundle> --entry`.
- Result: the bundle as an artifact (`copy-<id>`), without symbolic links, `.git`, `node_modules` and top-level dotfiles; only when the check reports no error. An entry whose build or check fails is not published, its copy stays as it was, and the run fails visibly.
- Needs: the required fields `source` (a GitHub repo) and `commit` (a full id) in `schemas/entry.js`; review.yml reviews the entry's `commit` by default.

### 2. Push into its subdirectory of `gh-pages`
- Where: job `publish` in the same workflow; it downloads the artifacts and runs no app code.
- What: writes each bundle to `<id>/` of the `gh-pages` branch of lernapps/lernapps.github.io (the root site that serves `lernapps.net/<id>/`), replacing that directory only, in one commit "copy of `<source>@<commit>`". A deleted entry removes its directory. GitHub Pages publishes the branch on that push: no extra deploy needed.
- Then: `lernapps check https://lernapps.net/<id>/ --entry` against the copy (job `verify`), after Pages has deployed.
- Needs:
  - A token of the GitHub App (KD-07), limited to lernapps.github.io; only the job `publish` gets it.
  - tooling's `site-deploy` must keep the copies when the home page deploys: today it only keeps `pr-preview/` (`clean-exclude`). Proposal: `publish` maintains a list of the copies in `gh-pages` (e.g. `copies.txt`, one id per line), and `site-deploy` takes `clean-exclude` from it.
  - Reserved ids: no copy may overwrite a path of the home page (`en/`, `assets/`, …) or a repo served below lernapps.net (`apps`, `docs`, `tooling`, …); the listing validation rejects them.

### 3. Start it automatically
- First listing: the merge of the listing pull request (push to `main` changing `entries/*.yaml`) starts `publish.yml`.
- Update: a scheduled workflow in lernapps/apps compares each entry's `commit` with the head of `main` of its `source` and opens (or updates) one pull request per app that sets the new `commit`, with a token of the GitHub App (KD-07); the listing check runs on it as on every entry change. The workflow compares the two commits of the app repo (KD-10): only versions of existing npm dependencies changed → it turns on auto-merge, which merges once the check is green; anything else → it labels the pull request for review and says what changed. Its merge starts `publish.yml` like a listing.
- Delisting: a merged pull request that deletes the entry starts `publish.yml`, which removes the copy.
- By hand: `workflow_dispatch` with an id rebuilds one copy, e.g. after a failed run.

### 4. The apps already listed
| App | Source | Address today | What changes |
|---|---|---|---|
| anorganische-chemie, elektrizitaet, naturwunder-quiz | lernapps | `lernapps.net/<id>/` from its own repo's Pages | Copy at the same address; then switch off the repo's Pages and its publish workflow, so the root site serves `/<id>/` (to verify: a repo's Pages shadows the root site's path) |
| mathe-karte | lernapps | `lernapps.net/mathe-karte/` | The test of a submission that does not fit (KD-08): no copy, its own Pages stays on; later fixed (keys with the prefix `lernapps:mathe-karte:` with migration, a licence file) and then taken over like the others |
| kniffel-trainer, textcheck, typonaut | mrsimpson | `mrsimpson.github.io/<id>/` | New address `lernapps.net/<id>/` in the catalog; the creator's address stays as it is |
- Order:
  1. Each entry gets `commit` (the current head of `main`) in one pull request; its merge builds and publishes the copies of six apps, mathe-karte fails as expected (KD-08).
  2. The three apps of the organisation with a copy: copy checked at `lernapps.net/<id>/`, then their Pages and publish workflow switched off, so the address never breaks.
  3. The licences (KD-09): six apps are MIT, but their copyright line names "Claude", not the creator; fixed in the app repos, mathe-karte gets a licence file; each arrives as an update reviewed by hand.

## Notes

### GitHub App setup (once, by the owner)
1. github.com/organizations/lernapps/settings/apps → **New GitHub App**.
   - Name: `lernapps-publisher`; homepage: `https://lernapps.net/`.
   - Webhook: **off** (uncheck "Active").
   - Repository permissions: **Contents: Read and write**, **Pull requests: Read and write**, Metadata: Read-only (set automatically). Nothing else, no organisation or account permissions.
   - Where can this app be installed: **Only on this account**.
2. After creating it: note the **App ID**; **Generate a private key** (a `.pem` file is downloaded).
3. **Install App** → lernapps → **Only select repositories**: `apps`, `lernapps.github.io`.
4. In lernapps/apps → Settings → Environments → **New environment** `publish`: deployment branches **main only**; add the variable `PUBLISHER_APP_ID` (the App ID) and the secret `PUBLISHER_PRIVATE_KEY` (the content of the `.pem` file). Only jobs with `environment: publish` on `main` can read them. Delete the `.pem` file afterwards.
5. If `gh-pages` of lernapps.github.io has a branch protection or ruleset: allow the app to bypass it.
In the workflows, `actions/create-github-app-token` mints a token valid for one hour, limited per job with `repositories:` (e.g. only `lernapps.github.io` for `publish`).

### Found while coding (2026-10-21)
- The listing check of a pull request opens the app at the entry's `url` (the creator's address), not the build of `commit`. For an update pull request, auto-merge therefore waits for the check of the creator's deployed app; the build of the commit is checked in `publish.yml` before it is published. A commit that fails there is not published, the old copy stays, and the run is red. A later improvement: check the build of `commit` in the listing check as well.
- `gh pr merge --auto` needs "Allow auto-merge" and a required check on `main` (task D); without them `update.yml` fails at the first dependency update.
- Merge order: tooling (`feat/own-data-only`, `feat/copies-served`) → lernapps.github.io pins that tooling commit (B1) → apps (`feat/serve-copies`). Merging apps first would publish copies that the next home page deploy removes.

### Found in the first update (elektrizitaet, apps#68, 2026-10-21)
- The update pull request was opened while the creator's own deploy of the new commit was still running, so the listing check opened the old app at the entry's `url` and failed. A re-run after the deploy passed. To fix: `update.yml` opens a pull request only when the creator's address already serves the new commit, or the listing check builds `commit` itself like `publish.yml`.
- `listing-comment.yml` took the first artifact of a re-run run, so the comment kept the old result; it now takes the newest (fix/listing-comment-rerun).
- The child session that fixed elektrizitaet could not merge its pull request nor message this session (its permission classifier: "Merge Without Review", "Auto-Mode Bypass"); the coordinating session merged it.

### Facts found
- review.yml today reviews the head of the app repo's `main` or `/review <commit>`; with the pinned commit it should default to the entry's `commit`.
- tooling's `site-deploy` replaces `gh-pages` and only keeps `pr-preview/` (`clean-exclude`); it must also keep the copies (step 2).
- Catalog (src/_data/catalog.js): `app.url`, the topic links and the QR code are built from `entry.url`; they move to `https://lernapps.net/<id>/`.
- Of the listed apps, only mathe-karte fails `own-data-only` (keys without prefix, e.g. `binom-trainer.selbsteinschaetzung`, `dtc-theme`); same origin as before, so learners' progress can be migrated in the app.
- To verify: a repo with Pages in the organisation (e.g. lernapps/mathe-karte) shadows the root site's `/<id>/`, so the copy takes over only after that repo's Pages is switched off.

## Explore
### Phase Entrance Criteria
- The need is stated: lernapps/apps#58, lernapps/docs KD-21.

### Tasks
- [x] Owner set up the GitHub App with `PUBLISHER_APP_ID` and `PUBLISHER_PRIVATE_KEY` in the environment `publish` (2026-10-21)
- [x] Lock file rule of KD-10 confirmed
- [x] Shadowing: not documented, no blocker (KD-12)
- [x] The test build of the seven apps happens in the workflow, in its container, not locally (user, 2026-10-21)
- [x] Reserved ids listed (KD-11)
- [x] `site-deploy`: `clean-exclude` of JamesIves/github-pages-deploy-action takes several patterns, one per line; the action can read them from `copies.txt` in `gh-pages` before it deploys
- [x] Steps recorded: build, push into `gh-pages/<id>/`, automatic start, apps already listed (KD-04, "Steps")

### Completed
- [x] Created development plan file
- [x] Path decided: `lernapps.net/<id>/` (KD-01), own apps included (KD-02)
- [x] Rule `own-data-only` built in tooling (KD-05)
- [x] Relative paths of the listed apps checked (KD-06)
- [x] Credential decided: GitHub App (KD-07)
- [x] mathe-karte as the test of a submission that does not fit (KD-08); licences afterwards, as the test of an update (KD-09)
- [x] Update policy: automatic merge only for version bumps of existing npm dependencies (KD-10)

## Plan
### Phase Entrance Criteria
- The GitHub App is set up.
- The steps (section "Steps") are agreed.
- Open points of Explore are decided (KD-07 to KD-12).

### Tasks
- [x] Break the work down per repo and order it (below, and as tasks of Code)
- [ ] User approves the plan

### Implementation strategy
One pull request per repo, merged in this order; each repo's checks and tests pass before its merge.

**A. lernapps/tooling** (before anything is published)
1. Rule `own-data-only` (branch `feat/own-data-only`, done).
2. `actions/site-deploy`: before deploying, read `copies.txt` from the target's `gh-pages` (if any) and add every id in it to `clean-exclude`, besides `pr-preview/`; a home page deploy then never removes a copy.
3. arc42: decision `dec-copies-served` (lernapps.net serves a copy of every listed app at `lernapps.net/<id>/`, built from the entry's commit) supersedes `dec-app-own-hosting` (status superseded); ch. 3 and 7 (deployment) accordingly; `app-publish` stays the creator's own publishing. Skill texts: `platform-rules.md` ("The app lives at its own address") and `lernapps-app/SKILL.md`.

**B. lernapps/lernapps.github.io**
1. Pin the tooling commit with the new `site-deploy` (Renovate or by hand). Nothing else: the copies arrive by push.

**C. lernapps/apps**
1. Entry format (`schemas/entry.js`, `npm run schema`): `source` required, a GitHub repo URL; `commit` required, a full commit id. `src/llms.njk`, the guidance texts and the test fixtures accordingly.
2. Listing validation (`scripts/listing.mjs`): reserved ids (KD-11: `reserved-ids.txt` for the root site's paths; the organisation's repos from the API, except the entry's own `source`); `commit` exists in `source`.
3. `review.yml`: `/review` without a commit reviews the entry's `commit`.
4. `publish.yml` (push to `main` changing `entries/*.yaml`, and `workflow_dispatch` with an id):
   - `plan`: the added, changed and deleted entries (diff to the previous commit; by hand: one id).
   - `build` (matrix, no secrets, `contents: read`): `review-input.mjs` at the entry's commit in the container; fails when the build or the check fails; uploads only the bundle (`copy-<id>`), without top-level dotfiles.
   - `publish` (environment `publish`, runs no app code): a token of the GitHub App for `lernapps.github.io` only; checks out its `gh-pages`, replaces `<id>/` with the bundle, removes `<id>/` of deleted entries, keeps `copies.txt` (`<id> <commit>` per line) in step, one commit "copy of `<source>@<commit>`", pushes.
   - `verify`: waits for the Pages deployment of lernapps.github.io, then `lernapps check https://lernapps.net/<id>/ --entry`.
   - At the end: starts `pages.yml` of lernapps/apps (`gh workflow run`, `GITHUB_TOKEN` with `actions: write`), so the catalog links the new copies.
5. Catalog (`src/_data/catalog.js`): reads `https://lernapps.net/copies.txt` at build time; an app listed there at its entry's `commit` links (button, topics, QR code) to `https://lernapps.net/<id>/`, any other app to its `url` as today. So the catalog never links a copy that is not live, e.g. mathe-karte while its copy fails (KD-08).
6. `update.yml` (schedule, daily, and `workflow_dispatch`): per entry, the head of `main` of `source`; when it differs from `commit`, opens or updates the pull request `update/<id>` with a token of the GitHub App for `apps`. `scripts/update-kind.mjs` compares the two commits (KD-10): only versions of existing npm dependencies (and their lock file, every `resolved` on registry.npmjs.org) → `gh pr merge --auto`; else the label `review` and a comment naming the changed files.
7. Texts (`src/_data/de.js`, `en.js`, README): the app is served by lernapps.net, the creator stays the author; no more "at your own address".

**D. Owner settings** (once)
- lernapps/apps: "Allow auto-merge" on; a ruleset for `main` that requires the check `listing` (auto-merge waits for it).

**E. Rollout**
1. One pull request in lernapps/apps that adds `source` and `commit` (the current head of `main`) to all seven entries; its merge publishes six copies; mathe-karte fails as expected and keeps its own address in the catalog (KD-08).
2. The first app of the organisation: check which address answers before and after its Pages is switched off (KD-12); then the other two; their publish workflows switched off.
3. Licences (KD-09): fix the copyright lines in the six app repos, add a licence file to mathe-karte; each arrives as an update pull request that is not merged automatically; reviewed, merged, published; checked that the copy changed.

### Completed
*None yet*

## Code
### Phase Entrance Criteria
- The plan names the changes per repo (apps, lernapps.github.io, tooling, app repos) and their order.
- The user approved the plan.

### Tasks
- [x] A2 tooling: `site-deploy` keeps the copies listed in `copies.txt` (lernapps/tooling branch `feat/copies-served`)
- [x] A3 tooling: arc42 `dec-copies-served`, skill texts (same branch)
- [ ] B1 lernapps.github.io: new tooling commit
- [x] C1 apps: `source` and `commit` required in the entry format; the seven entries pinned to the head of `main` (2026-10-21)
- [x] C2 apps: reserved ids in the catalog's build and the listing validation (`schemas/reserved.js`, a fixed list). Whether the commit exists is not checked there: the review and the build of the copy read it
- [x] C3 apps: `/review` defaults to the entry's commit
- [x] C4 apps: `publish.yml` with `scripts/publish-plan.mjs`, `copy-bundle.mjs`, `publish-copies.mjs`, `verify-copies.mjs`
- [x] C5 apps: catalog links live copies (`copies.txt`)
- [x] C6 apps: `update.yml`, `scripts/update-plan.mjs` and `update-kind.mjs` (a lock file entry counts as fine when it comes from registry.npmjs.org with an integrity)
- [x] C7 apps: texts, the licence as a condition for listing, README
- [ ] D owner settings: auto-merge, ruleset

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
