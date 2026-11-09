# The contract of the learning map

How the learning map ("Lernlandkarte") is stored in the catalog, and what an app says about it. Decisions behind it:
`.vibe/development-plan-feat-learning-map.md` (KD-xx). Names are English (`dec-english-contracts`); texts for people are
German, optionally with English, as everywhere in the catalog: a plain string or `{ de, en }`.

| Term (people) | Contract |
|---|---|
| Fach | subject |
| Strang | strand |
| Baustein | competency |
| baut auf | requires |
| Richtstufe | gradeBand |
| Lehrplan | curriculum |
| Einordnung | placement |

An **id** is lower-case letters, digits and hyphens (`^[a-z0-9]+(-[a-z0-9]+)*$`). Ids are stable: once published, an id
is never renamed (links and apps point to it).

## 1. A subject: `map/<subject>.yaml` (lernapps/apps)

One file per subject: the subject, its source, its strands, and each strand's competencies nested in it, so that a
competency belongs to exactly one strand by the form of the file (KD-04, KD-09).

```yaml
# yaml-language-server: $schema=https://lernapps.net/apps/schemas/subject.v1.schema.json
name: { de: Mathematik, en: Mathematics }          # the file name is the subject's id: mathematik
source:                                            # where strands and competencies come from (KD-03)
  title: KMK-Bildungsstandards Mathematik, ESA und MSA (2022)
  url: https://www.kmk.org/fileadmin/Dateien/veroeffentlichungen_beschluesse/2022/2022_06_23-Bista-ESA-MSA-Mathe.pdf
status: checked                                    # required: draft, checked or reviewed (feat/map-status)
reviews:                                           # optional; checked needs one review, reviewed two
  - { date: 2026-12-01, role: "Lehrkraft Mathematik, Gymnasium, Hessen" }   # by role, never by name
strands:
  - id: stochastik
    name: { de: Stochastik, en: Probability and statistics }
    competencies:
      - id: laplace
        name: { de: Laplace-Formel, en: Laplace formula }  # required: a short name, 2–5 words
        iCan: { de: "Ich kann Wahrscheinlichkeiten mit der Laplace-Formel berechnen." }
        gradeBand: "7-8"                           # required: "5-6", "7-8" or "9-10" (KD-06)
        requires: [haeufigkeiten]                  # optional: ids in the same subject, any strand
      - id: baumdiagramm
        name: { de: Baumdiagramm, en: Tree diagram }
        iCan: "Ich kann ein mehrstufiges Zufallsexperiment als Baumdiagramm darstellen."
        gradeBand: "7-8"
        requires: [laplace]
```

| Field | Type | Rule |
|---|---|---|
| `name` | text | required |
| `explainerFocus` | `strand` \| `competency` | optional, default `strand`; see below |
| `source.title`, `source.url` | string, https URL | required; `url` optional when the source has none online |
| `strands[]` | list, at least one | |
| `status` | `"draft"` \| `"checked"` \| `"reviewed"` | required; how far teachers of the subject reviewed strands, competencies and `requires`: `draft` (an idea to show the principle, no review yet), `checked` (at least one review), `reviewed` (at least two). Every page of the subject's map shows it; a draft is marked loudly |
| `reviews[]` | list of `{ date, role }` | optional; `date` YYYY-MM-DD, `role` who reviewed, by role and never by name (e.g. "Lehrkraft Physik, Gymnasium, Hessen"); `checked` needs one, `reviewed` two; a draft may have reviews |
| `strands[].id` | id | unique in the subject |
| `strands[].name` | text | required |
| `strands[].competencies[]` | list, at least one | |
| `competencies[].id` | id | unique in the **subject** (not only in the strand) |
| `competencies[].name` | text | required; a short name of 2–5 words, shown where the competency is listed or linked |
| `competencies[].iCan` | text | required; starts with "Ich kann" |
| `competencies[].gradeBand` | `"5-6"` \| `"7-8"` \| `"9-10"` | required |
| `competencies[].requires` | list of ids | optional; each an id of this subject; no cycles; not itself |

A competency is addressed across the platform as `<subject>/<competency>`, a strand as `<subject>/<strand>`.

The **step** (Stufe) of a competency is not written in the file: it follows from `requires`. A competency without
`requires` is in step 1, any other one step below its deepest prerequisite (1 + the longest path over `requires`).
`lib/map.js` computes it (`steps`, with `ancestors`, `descendants` and `stepRows`); the map shows the subject by steps at
`/apps/map/<subject>/c/` and the chain of a competency on its page. The JSON (section 5) does not carry it.

### The focus of a subject: `explainerFocus` (lernapps/apps#226)

The subject decides whether its strands separate apps or are woven together.

| Value | Subjects | An app … |
|---|---|---|
| `strand` (default) | sciences, Mathematik, Geschichte, … | names one strand and practises only its competencies (a strand app) |
| `competency` | Englisch, Französisch, Spanisch, Latein, Deutsch | either names one strand (a strand app, e.g. a vocabulary trainer), or names only the subject and practises competencies of several strands (a unit app, e.g. "Au restaurant") |

For a unit app, three rules keep the method of a strand and the order of learning:

1. **One strand per page.** Each page practises competencies of one strand (KD-07).
2. **Prerequisites first.** Each direct prerequisite (`requires`) of a competency a page practises comes on an earlier
   page: practised, or repeated on a recap page, or linked in the page's text to its page on the map (KD-03a, KD-04).
3. **Gap and entry.** A prerequisite the app does not have is a *gap* when the app practises something it builds on
   (it is missing in the middle of the app's chain), else an *entry* (the start of the chain; a recap page helps).

| Finding | `explainerFocus: competency` | `explainerFocus: strand` |
|---|---|---|
| a page across strands | listing error, `lernapps check` warning | (cannot happen: one strand per app) |
| a prerequisite out of order | listing error, `lernapps check` warning | listing warning, `lernapps check` hint |
| a gap | listing error, `lernapps check` warning | listing warning, `lernapps check` hint |
| an entry without recap or link | listing warning, `lernapps check` warning | listing warning, `lernapps check` hint |

An app without pages (a list of competencies in its entry) has no order: only gap and entry apply.

## 2. A curriculum: `map/<subject>/curricula/<curriculum>.yaml` (lernapps/apps)

One file per curriculum (Lehrplan) and subject; contributed one by one, and may place only some competencies (KD-06).
The file name is the curriculum's id: `<land>-<school type>`, e.g. `he-gymnasium`.

```yaml
# yaml-language-server: $schema=https://lernapps.net/apps/schemas/curriculum.v1.schema.json
land: HE                                           # ISO 3166-2:DE code without "DE-"
schoolType: { de: Gymnasium (G9), en: Grammar school (G9) }
version: Kerncurriculum Sekundarstufe I (2011) und Lehrplan G9
source:
  title: Kerncurriculum Mathematik Sekundarstufe I, Hessisches Kultusministerium
  url: https://kultusministerium.hessen.de/unterricht/kerncurricula/sekundarstufe-i/mathematik
placements:
  - { competency: laplace, grades: [7], unit: "7.4" }
  - { competency: baumdiagramm, grades: [7, 10], unit: "7.4, 10.5" }
```

| Field | Type | Rule |
|---|---|---|
| `land` | `BW` `BY` `BE` `BB` `HB` `HH` `HE` `MV` `NI` `NW` `RP` `SL` `SN` `ST` `SH` `TH` | required |
| `schoolType` | text | required |
| `version` | string | required: which document, which edition |
| `source.title`, `source.url` | string, https URL | required; `url` optional |
| `placements[]` | list | may be empty; at most one per competency |
| `placements[].competency` | id | a competency of the subject |
| `placements[].grades` | list of integers 1–13, at least one | ascending |
| `placements[].unit` | string | optional: the unit of the curriculum, as it names it |

The state of a curriculum ("places 42 of 85") is computed, never written down.

## 3. An explainer: format 2 (lernapps/app-templates)

`explainer.v2.schema.json`. Format 1 stays valid for apps that do not move (KD-07): they are not on the
map. An app is on format 2 when its `app.yaml` says so.

`src/app.yaml`:

```yaml
# yaml-language-server: $schema=../node_modules/@lernapps/app-templates/runtime/explainer/explainer.v2.schema.json
format: 2                                          # required in format 2; absent means format 1
strand: mathematik/stochastik                      # "<subject>/<strand>", or "none"; or, instead:
# subject: franzoesisch                            # a unit app across the strands (lernapps/apps#226)
title: Stochastik
# … everything else as in format 1
```

A page, `src/<chapter>/<page>.yaml`:

```yaml
title: Laplace-Formel
competencies: [laplace]                            # ids of the app's strand; as a rule one (KD-24)
blocks: […]
```

| Field | Where | Rule |
|---|---|---|
| `format` | `app.yaml` | `2`, required in format 2 |
| `strand` | `app.yaml` | `<subject>/<strand>` (two ids) or `none`; exactly one of `strand` and `subject` (`oneOf`) |
| `subject` | `app.yaml` | a subject id; only where the subject has `explainerFocus: competency` (checked by `lernapps check` and the listing, not by the schema, which does not know the map) |
| `competencies` | every page | with `subject`, or when `strand` is not `none`: required, at least one id; as a rule one (several give a hint of `lernapps check`, `one-competency-per-page`); a competency may have several pages. When `none`: not allowed |

The app cannot know the vocabulary (the subject's ids); the catalog checks the ids when the app is listed (step F).

### A recap page

A competency may require one the app does not practise: of another strand (`requires` crosses strands, KD-25), or of
its own strand outside the app's scope. The app may repeat it on a recap page (KD-26):

```yaml
title: Gewichtskraft – kurz wiederholt
recap: physik/gewichtskraft-berechnen              # "<subject>/<competency>", one the app does not practise
blocks: [...]                                      # descriptive blocks only: no exercise
```

| Rule | Checked by |
|---|---|
| A page has either `competencies` or `recap`, never both | explainer schema v2 |
| A recap page has no exercise; `topic-has-exercises` does not apply to it | explainer schema v2, build |
| The link to the competency's page on the map is written by the runtime, so it cannot be missing | runtime |
| The recapped competency exists, and the app does not practise it on a page of its own | `lernapps check` (warning), listing (error) |

A recap page counts as nothing on the map and is left out of the self-assessment.

### The page list: `lernapps-pages.json`

The build of a format-2 explainer writes `lernapps-pages.json` at the root of the bundle, beside `index.html`. The
catalog reads it instead of hand-written topics (KD-13).

```json
{
  "format": 1,
  "strand": "mathematik/stochastik",
  "pages": [
    { "path": "zufall/laplace/", "title": { "de": "Laplace-Formel" }, "competencies": ["laplace"] }
  ]
}
```

`path` is relative to the app's root, as a link in the app; `title` is the page's title as text (string or by language);
pages are in the order of the app. With `strand: none` the file has `"strand": "none"` and no `competencies`. A unit
app (`subject` in `src/app.yaml`, section 1) has `"subject": "<subject>"` instead of `"strand"`. A recap
page has `"recap": "<subject>/<competency>"` instead of `competencies`.

## 4. A catalog entry: `entries/<id>.yaml` (lernapps/apps)

`subject` is the id of a subject of the map; the catalog shows its name from the map (lernapps/apps#226). Two
optional fields place the app on the map (KD-08):

```yaml
subject: mathematik                                # required: a subject of the map, by its id
strand: mathematik/stochastik                      # "<subject>/<strand>"; leave out when the app has none
competencies: [laplace, baumdiagramm]              # only for apps that are not explainers
```

| Field | Rule |
|---|---|
| `subject` | required; the id of a subject of the map (`map/<subject>.yaml`) |
| `strand` | optional; `<subject>/<strand>` of the entry's subject |
| `competencies` | optional; not for an explainer, whose pages name their competencies in `lernapps-pages.json`. With `strand`, ids of that strand; without, ids of several strands, only where the subject has `explainerFocus: competency` (a unit app) |
| `topics` | stays, for apps that are not explainers; for a format-2 explainer the catalog takes its pages from `lernapps-pages.json` |

Checks of the listing (rule `entry-learning-map`, an error): every id exists; every competency of an app belongs to the
app's strand (KD-19), or, for a unit app, the subject allows several strands; an explainer's `strand` in the entry, if
given, equals the one in `lernapps-pages.json`, and its `subject` there equals the entry's. Then the pages, as section 1
says under "The focus of a subject".

## 5. The map as data: `/apps/map/<subject>.json` (lernapps/apps)

For assistants and the tooling: the subject as in its YAML (with `explainerFocus`, always given), plus `curricula` (id, land, schoolType, version, placements)
and `coverage` (per competency: the apps and pages that practise it), and for a language with a basic vocabulary its
`vocabulary` (section 6). Linked from `/apps/llms.txt`.

## 6. The basic vocabulary of a language: `map/<subject>/vocabulary/` (lernapps/apps)

A language subject may have a basic vocabulary beside its map: the words that come first, independent of any
textbook, by CEFR level. It says how far a word is, not where it belongs: the words of a page follow from its
exercises. No list per competency, no grade band per word, no meanings.

| File | What it holds |
|---|---|
| `source.yaml` | language, graded lexicon (title, URL, licence, citations), levels taken, corrections (`add`, `level`, `remove`, each with a `reason`) |
| `words.yaml` | the list, written by `scripts/vocabulary.mjs` from the lexicon and `source.yaml`: `{ word, pos, level, note? }` ([schema](https://lernapps.net/apps/schemas/vocabulary.v1.schema.json)) |
| `LICENSE.md` | the lexicon's licence for both files, not the repository's |

- The build checks `words.yaml` against `source.yaml`. The lexicon stays out of the repository.
- Published at `/apps/map/<subject>/grundwortschatz/` and in the subject's JSON as `vocabulary`; linked from the
  subject's map and the competencies of the strand `wortschatz`.
- How a vocabulary is made: skill `map-vocabulary`. How apps use it: lernapps/tooling, skill
  `lernapps-exercise-patterns`, `references/foreign-languages.md`.
