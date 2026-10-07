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

It replaces the narrower capability map in lernapps/map for this purpose.

## How it is built

- Static pages with [Eleventy](https://www.11ty.dev/) and [UnoCSS](https://unocss.dev/), like the home page
  (lernapps.github.io). Every page is readable without JavaScript; small scripts in `src/assets/` add
  the search, copy buttons and the referral code in the e-mails.
- Texts: all in `src/_data/de.js`, plain German (ISO 24495-1), "du". Templates contain no copy.
- Reusable parts: Nunjucks macros in `src/_includes/components.njk` (app card, fitness signal,
  copy field, count buttons), imported with `{% import "components.njk" as c with context %}`.
  The layout is `src/_includes/base.njk`. Shared with other repos later via a package in lernapps/tooling.
- Entries: one YAML file per app in `entries/`. `src/_data/catalog.js` reads them and checks them against
  the schema; a broken entry fails the build. It also renders the QR code of each app at build time.
- Schema: `schemas/entry.js` (Zod) is the single source of the entry format. `npm run schema` writes
  `schemas/entry.v1.schema.json`, published at <https://lernapps.net/apps/schemas/entry.v1.schema.json>
  for editors and agents; `npm run check` fails if it is out of date.
- `scripts/check.mjs` checks the output: no external resources, no broken links, privacy notice and
  imprint linked on every page.

## Entries

The format is defined in [`schemas/entry.js`](schemas/entry.js) and explained for people and agents in
[`src/llms.njk`](src/llms.njk) (served as `/apps/llms.txt`). Conditions for listing are in
`src/_data/de.js` (`list.criteria`) and enforced by the schema where they can be.

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
  served at <https://lernapps.net/apps/>.
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
```

## License

[MIT](LICENSE)
