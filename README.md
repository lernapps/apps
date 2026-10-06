# apps

Find learning apps for your class or your child: <https://lernapps.net/apps/>.

This is the application of the platform lernapps.net. It implements the experiences of the
[platform design](https://lernapps.net/docs/platform-design/) (agents: skill
[`skills/pdt`](https://github.com/lernapps/docs/tree/main/skills/pdt) in lernapps/docs) for the
first-draft MVP (D8 `mvp-first-draft`):

| Page | Experience and steps (D7) | Channel (D5) |
|---|---|---|
| `/apps/` find | `x-app-in-minutes`, `x-practice-tonight`: `s-finding`, `t-find-app` | `ch-app-overview` |
| `/apps/<id>/` app page | `x-app-in-minutes`: `s-fitness-clarity`, `t-confirm-fitness`, `t-bring-app`, `s-giving-back`, `t-thank-creator-adult`, `t-give-feedback`; referral wave (`?welle=`) | `ch-fitness-signal`, `ch-collections`, `ch-feedback` |
| `/apps/eintragen/` list an app | `x-list-and-hear-back`: `s-listing-help`, `t-list-app`, `s-use-insight` | `ch-listing` |
| `/apps/llms.txt` | the creator's AI assistant writes the entry | `ch-listing` |

It replaces the narrower capability map in lernapps/map for this purpose.

## How it is built

- Static pages with [Eleventy](https://www.11ty.dev/) and [UnoCSS](https://unocss.dev/), like the home page
  (lernapps.github.io). Every page is readable without JavaScript; small scripts in `src/assets/` add
  the search, copy buttons and the thanks clicks.
- Texts: all in `src/_data/de.js`, plain German (ISO 24495-1), "du". Templates contain no copy.
- Reusable parts: Nunjucks macros in `src/_includes/components.njk` (app card, fitness signal,
  copy field, count buttons), imported with `{% import "components.njk" as c with context %}`.
  The layout is `src/_includes/base.njk`. Shared with other repos later via a package in lernapps/tooling.
- Entries: one YAML file per app in `entries/`. `src/_data/catalog.js` reads and checks them; a broken
  entry fails the build. It also renders the QR code of each app at build time.
- `scripts/check.mjs` checks the output: no external resources, no broken links, privacy notice and
  imprint linked on every page.

## Entries

The format is documented for people and agents in [`src/llms.njk`](src/llms.njk) (served as
`/apps/llms.txt`). Conditions for listing are in `src/_data/de.js` (`list.criteria`) and enforced where
possible in `src/_data/catalog.js`.

## Counting thanks (deferred)

The app page has one-click buttons for thanks, use (in class, at home), structured feedback, and
"I'll have a look" for referral links. They POST `{"app", "event", "welle"?}` as `text/plain` to the URL
in `LERNAPPS_COUNTER_URL` at build time. No cookies, no browser storage, no identifier.

The counter itself is deferred. While `LERNAPPS_COUNTER_URL` is empty, the thanks block and the referral
banner stay hidden; if the counter cannot be reached, they step aside quietly. Totals, once there, go to
`data/totals.json` (`{"<id>": {"danke": 3, …}}`) and are shown on each app page.

## Develop

```bash
npm ci
npm run dev        # http://localhost:8080/apps/
npm run build && npm run check
LERNAPPS_COUNTER_URL=http://localhost:8099/count npm run build   # show the thanks block
```

## License

[MIT](LICENSE)
