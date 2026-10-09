# apps

Find learning apps for your class or your child: <https://lernapps.net/apps/>.

This is the application of the platform lernapps.net. It implements the experiences of the
[platform design](https://lernapps.net/docs/platform-design/) (agents: skill
[`skills/pdt`](https://github.com/lernapps/docs/tree/main/skills/pdt) in lernapps/docs) for the
first-draft MVP (D8 `mvp-first-draft`):

| Page | Experience and steps (D7) | Channel (D5) |
|---|---|---|
| `/apps/` find | `x-app-in-minutes`, `x-practice-tonight`: `s-finding`, `t-find-app` | `ch-app-overview` |
| `/apps/<id>/` app page | `x-app-in-minutes`: `s-fitness-clarity`, `t-confirm-fitness`, `t-bring-app`, `s-giving-back`, `t-thank-creator-adult`, `t-give-feedback`, referral code (`?welle=`) in the e-mails | `ch-fitness-signal`, `ch-collections`, `ch-feedback` (prepared e-mails for now) |
| `/apps/eintragen/` list an app | `x-list-and-hear-back`: `s-listing-help`, `t-list-app`, `s-use-insight` | `ch-listing` |
| `/apps/llms.txt` | the creator's AI assistant writes the entry | `ch-listing` |

## How it is built

- Static pages with [Eleventy](https://www.11ty.dev/) and [UnoCSS](https://unocss.dev/), like the home page
  (lernapps.github.io). Every page is readable without JavaScript; small scripts in `src/assets/` add
  the search, copy buttons and the referral code in the e-mails.
- Texts: all in `src/_data/de.js`, plain German (ISO 24495-1), "du". Templates contain no copy.
- Reusable parts: Nunjucks macros in `src/_includes/components.njk` (app card, fitness signal,
  copy field, count buttons), imported with `{% import "components.njk" as c with context %}`.
  The layout is `src/_includes/base.njk`.
- Header, footer and design tokens are those of every lernapps.net site: the package `@lernapps/site`
  ([`site-frame/`](https://github.com/lernapps/lernapps.github.io/tree/main/site-frame) in lernapps.github.io),
  installed from git; Renovate keeps it on the latest commit of its `main`.
- Entries: one YAML file per app in `entries/`. `src/_data/catalog.js` reads them and checks them against
  the schema; a broken entry fails the build. It also renders the QR code of each app at build time.
- Schema: `schemas/entry.js` (Zod) is the single source of the entry format. `npm run schema` writes
  `schemas/entry.v1.schema.json`, published at <https://lernapps.net/apps/schemas/entry.v1.schema.json>
  for editors and agents; `npm run check` fails if it is out of date.
- `npm run check` runs `lernapps-check` from the same package on the output: no external resources, no
  broken links, privacy notice and imprint linked on every page.

## Entries

The format is defined in [`schemas/entry.js`](schemas/entry.js) and explained for people and agents in
[`src/llms.njk`](src/llms.njk) (served as `/apps/llms.txt`). Conditions for listing are in
`src/_data/de.js` (`list.criteria`) and enforced by the schema where they can be.

## Listing validation

A pull request that adds or changes an entry is checked against the deployed app (lernapps/tooling, architecture
chapter 5, "Listing validation"). One command does it, the same in CI and in a creator's clone:

```bash
npm run --silent listing -- entries/<id>.yaml   # prints the comment; exit code 1 when a check fails
```

`scripts/listing.mjs` runs `lernapps check --entry <file>` of `@lernapps/tooling` for each entry: the checks of the
built app on its `url` (Chromium, installed on the first run), the `url` and every topic link resolve, the fitness
values match the measured ones. One rule is the catalog's own: `fitness.checked: true` only while the check passes.
It writes one validation report per entry to `node_modules/.cache/lernapps/listing/` (or `--out <dir>`) and prints
the listing results comment from them (`scripts/listing-comment.mjs`), written for the creator's assistant: per
finding the rule, where, what was found, the fix and the rule's link, and how to run the check locally.

- `listing.yml`, on pull requests that change `entries/`: runs that command on the added and changed entries and
  uploads the reports as the artifact `listing`. It runs the pull request's code, so it has a read-only token and
  no secrets.
- `listing-comment.yml`, on `workflow_run` of Listing: runs from `main`, never the pull request's code. It finds the
  open pull request by the run's head commit, renders the comment from the artifact with main's
  `scripts/listing-comment.mjs`, which treats the reports as data (values in code blocks, links built from rule
  ids), and posts it as one comment, found by the marker `<!-- lernapps-listing -->` and updated in place: on
  failure, and to say "bestanden" once the check passes again.
- The review agent is not run here: the owner starts it on a pull request that passed (lernapps/tooling, "The review").

`@lernapps/tooling` is a development dependency pinned to a commit of its `main`, kept current by Renovate like
`@lernapps/site`. `npm test` runs the end-to-end tests (`test/`, job `test` in `pages.yml`): the command on fixture
entries against a fixture app served on 127.0.0.1, the comment of the broken topic compared with
`test/fixtures/comments/`, and a report with markup, mentions and a second marker rendered as plain text.
`UPDATE_GOLDEN=1 npm test` writes the golden comments after an intended change.

## Thanks and feedback

For the MVP, thanks and feedback are prepared e-mails (`mailto:`), so no server is needed and the links
work without JavaScript: "Danke sagen" writes to `Danke-lernapps@beimir.net`, use and feedback to
`Feedback-lernapps@beimir.net` (`src/_data/site.js`). Subject and body are prepared per app
(`src/_data/de.js`, `app.mail`); the body says that this is only to test whether thanks arrive, and that
thanks will be counted with one click later. A referral code (`?welle=<code>`) is added to the body by
`src/assets/app.js`. Nothing is stored in the browser.

Later, one click is counted openly as a total, without e-mail (platform design D5 `ch-feedback`).

## Deploy and previews

GitHub Pages serves the `gh-pages` branch (Settings → Pages → Deploy from a branch → `gh-pages`, `/ (root)`).

- `pages.yml`: every push to `main` builds, checks and publishes to the root of `gh-pages`,
  served at <https://lernapps.net/apps/>. The steps are the shared site actions of
  [lernapps/tooling](https://github.com/lernapps/tooling), the same for every site.
- `pr-preview.yml`: every pull request from this repository gets a preview at
  `https://lernapps.net/apps/pr-preview/pr-<number>/`, linked in a comment on the pull request,
  updated on every push and removed when the pull request closes. Previews are built with
  `SITE_PATH_PREFIX=/apps/pr-preview/pr-<number>/` and `SITE_PREVIEW=1` (banner, `noindex`).

## Develop

```bash
npm ci
npm run dev        # http://localhost:8080/apps/
SITE_PATH_PREFIX=/apps/pr-preview/pr-1/ SITE_PREVIEW=1 npm run build   # as a preview
npm run build && npm run check   # schema in sync, output checked
npm run schema                   # after changing schemas/entry.js
npm test                         # end-to-end tests of the listing validation
npm run --silent listing -- entries/mathe-karte.yaml   # check an entry against its deployed app
```

## License

[MIT](LICENSE)
