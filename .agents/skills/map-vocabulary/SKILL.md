---
name: map-vocabulary
description: Use when a language of the learning map gets a basic vocabulary (Grundwortschatz) or its vocabulary is reworked (map/<subject>/vocabulary/) - the source, its licence, the levels, the corrections for children's everyday life, how the list is written and checked, and how apps apply it in their exercises.
---

# Making the basic vocabulary of a language

The format is `docs/learning-map-contract.md`, section 6. An existing one: `map/franzoesisch/vocabulary/`.

## What it is

- The words that come first in a language, independent of any textbook, by CEFR level. It says how far a word is,
  not where it belongs.
- No list per competency (the words of a page follow from its exercises), no grade band per word (first or second
  foreign language changes when a level is reached), no meanings (the page that practises a word gives it).

## Sources, in this order

1. A graded lexicon of the CEFRLex family (<https://cental.uclouvain.be/cefrlex/>), receptive, one level per word if
   there is such a variant.
2. Without one: a published basic vocabulary of the school subject from a ministry, institute or university, with a
   stated licence; write the TSV (`word`, `tag`, `level`) from it and say in `source.yaml` how levels were set.
3. Nothing else: no textbook's list, no list without author, no list a model wrote.

## Licence

- Read it on the download page before taking anything. The derived files take the lexicon's licence, written in
  `LICENSE.md`; cite as the authors ask.
- No licence stated: ask the owner; never guess one.

## Method

1. Download the lexicon; if the host refuses this machine, ask the owner for the file. It stays out of the repository.
2. Write `source.yaml`: language, lexicon, levels (the first two; more only when apps need them).
3. Look for gaps for children: go through the vocabulary competencies of the strand `wortschatz` and look up the words
   a child of the first year needs. Search in the lexicon's own spelling first.
4. Correct sparingly, each with a `reason` naming the child's situation: `level` for a word placed too late, `add`
   for a missing one, `remove` for one no child needs.
5. `node scripts/vocabulary.mjs <subject> <lexicon.tsv>`; never edit `words.yaml` by hand.
6. `npm run schema`, `npm run build`, `npm test`; look at `/apps/map/<subject>/grundwortschatz/`.

## How apps apply it

The guidance for creators is in lernapps/tooling: skill `lernapps-exercise-patterns`,
`references/foreign-languages.md`. Change it too when creators must know of a change.

## Result

- `source.yaml`, `words.yaml`, `LICENSE.md` in `map/<subject>/vocabulary/`.
- In the pull request: lexicon, licence, levels, each correction with its reason, open points.
