---
name: map-research
description: Use when a subject of the learning map is new or reworked (map/<subject>.yaml) or a curriculum is added (map/<subject>/curricula/<land>-<schoolType>.yaml) - the method and the sources for strands, competencies, grade bands, requires and placements.
---

# Researching a learning map

The format is `docs/learning-map-contract.md`; the reasons are the KD-xx of `.vibe/development-plan-feat-learning-map.md`.

## Sources, in this order

1. **KMK-Bildungsstandards** of the subject (ESA/MSA, latest edition): the strands and the binding content. Where none
   exist (Musik, Kunst, Religion …): the content areas the Länder share.
2. **Three Länder plans** for the grades, e.g. Hessen, Bayern, NRW (Gymnasium G9). Read the binding text, not a school
   example; an example may only hint at a grade.
3. Nothing else for the model: no textbook, no wiki. Open every source in the original and cite it with edition and
   page.
4. **Only for `requires`:** subject-didactic literature on how the subject is built up (handbooks of the subject's
   didactics, studies on the order of acquisition, CEFR descriptors and profiles). It may justify an edge, never a
   competency, a strand or a grade band (feat/map-chains, KD-04).

## Method

- **Strands:** the KMK areas as they are. Split or merge one only with a reason in the report; a strand needs at least
  as many competencies as one app can cover in several school years.
- **A competency** belongs in the map if the KMK names it, or two of the three Länder do, or it is a prerequisite of
  one of those. Fine-grained: one competency is what one page of an app can teach. The size of the map follows from
  that, there is no target number: never merge competencies to keep a map small; split one when it teaches better.
  `iCan` starts with "Ich kann", plain German; the id is stable once published.
- **gradeBand:** exactly one per competency. Vote per Land; two of three decide, with three different votes the middle
  one. A Land that names only a span ("7-10") votes for each band in it. A tie goes to the earlier band, unless
  `requires` forces the later one. A school example (e.g. a SiLP) never votes and never breaks a tie.
- **Foreign languages:** the band is the stage of the course, not the grade, because one language starts as first,
  second or third language. Turn each vote into the learning year (grade − first grade of the course + 1) and split
  the course into three equal parts: year y of n goes to part ⌊3·(y − ½)/n⌋ + 1, part 1 → "5-6", 2 → "7-8",
  3 → "9-10". A stage without grades votes for every part it covers. What counts is the order and that the bands do
  not clump: if one band holds more than half of a strand, spread it along `requires` and give the reason.
- **Basic vocabulary** of a language (which words come first, by CEFR level): skill `map-vocabulary`, not this one.
- **requires:** only what is needed directly; never a later grade band; across strands allowed; no cycles. A unit
  app across strands is checked against `requires` page by page, so a dependency teachers rely on (a verb group before
  a grammar topic) must be in it.
- **Connect every competency** (feat/map-chains, KD-03, KD-13): few roots, none that stands alone (no `requires`
  and nothing builds on it). For a competency without a link, in this order:
  1. Look both ways: what does it need, and what later competency needs it?
  2. Sources: an edge a source names (KMK, Länder, didactics), or a bundle (a plan names topic and structure in the
     same grade or unit, or teaches one in an earlier grade than the other).
  3. Derivation from the content, only with high confidence, marked `(Herleitung)`.
  4. Nothing safe: a gap in the model (a missing competency; propose it in the report) or a real root (say why).
  Never invent an edge just to connect a competency. In History an edge means "needs A to understand B" (a concept,
  a cause, prior knowledge), not "A was earlier".
- **The reason of an edge** stands in the comment above the competency, under its sources, one line per edge:
  `# requires <id>: <reason> (<source> <page>)`, or `# requires <id> (Herleitung): <reason>` for a derivation.
- **explainerFocus:** do the strands separate apps, or only illustrate the subject? `strand` (the default) when an
  app can stay in one strand and still make sense (sciences, Mathematik, Geschichte: few `requires` across strands, or
  only along time); `competency` when a real unit needs several strands at once (foreign languages, Deutsch: many
  `requires` across strands, a theme needs words, grammar and texts). Give the reason in the report
  (lernapps/apps#226).
- **A curriculum** is added only when its document names single grades; a plan that names only spans ("7-10") gets
  none. It places only what its document places (`grades`, `unit` as it names it). Leave the rest out; never
  guess a grade.
- **Shared strands:** related subjects use the same strand ids for the same area (see below); the name may differ.
- **Same content in two subjects** (e.g. climate change in Biologie and Erdkunde): each keeps its own aspect; both
  name the other in the comment: `Siehe auch: <subject>/<id>`.
- **status:** a new or reworked subject is `status: draft`, however good the sources: only teachers of the subject
  raise it. After a teacher looked it through, add `reviews: [{ date, role }]` (role, never a name) and set `checked`;
  with two or more, `reviewed` (feat/map-status).
- **Ids used by apps** stay. A change of an id is a migration of every app that uses it.

## Shared strands (ontology)

A subject uses only the shared strands its sources carry. A strand of its own, or a shared one left out, needs a
reason in the report.

| Group | Subjects | Strand ids |
|---|---|---|
| Modern languages | englisch, franzoesisch, spanisch, … | `grammatik`, `wortschatz`, `aussprache` (Aussprache und Rechtschreibung), `landeskunde` (Länder und Kulturen), `texte` (Texte und Medien) |
| Ancient languages | latein, … | `wortschatz`, `formenlehre`, `satzlehre` (together the `grammatik` of the modern languages), `texte`, `antike-kultur` (the `landeskunde`) |
| Religious education | evangelische-religion, katholische-religion, … | `mensch`, `gott`, `bibel`, `jesus-christus`, `kirche`, `religionen`, `ethik` |

## Result

- `map/<subject>.yaml` with a comment per competency naming its sources; weakly covered ones marked so.
- A short report in the pull request: sources (title, edition, URL), the decisions and the open points.
- `npm run build` and `npm test` pass (`lib/map.js` checks ids, cycles and placements).
