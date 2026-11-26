# Development Plan: apps (feat/map-daf branch)

*Generated on 2026-11-24 by Vibe Feature MCP*
*Workflow: [epcc](https://codemcp.github.io/workflows/workflows/epcc)*

## Goal
Create the learning map (`map/daf.yaml`) and basic vocabulary (`map/daf/vocabulary/`) for German as a Foreign Language (Deutsch als Fremdsprache, DaF) on `lernapps.net`, following skills `map-research` and `map-vocabulary`. Also assess whether and how CEFR band labels (A1 / A2 / B1) can be shown on the map alongside the existing `5-6` / `7-8` / `9-10` schema bands.

## Key Decisions
- Scope (user, 2026-11-24): Option B — subject learning map (`map/daf.yaml`) + basic vocabulary (`map/daf/vocabulary/`, pending openly licensed source).
- Band mapping (user, 2026-11-24): Simpler mapping approach using the existing `gradeBand` enum (`"5-6"` = A1, `"7-8"` = A2, `"9-10"` = B1), matching ZfA Rahmenplan DaF's three Bildungsabschnitte (A1, A2, B1 = MSA equivalent).
- Band labeling (user, 2026-11-24): **Yes** — add optional `bandLabels` on `subject.v1` and render them in templates so DaF shows `A1`, `A2`, `B1` while existing subjects keep `Klasse 5/6` etc.
- `iCan` language (user, 2026-11-24): **Only English** (`"I can …"`). Requires a small schema + template adjustment because `schemas/entry.js` (`Text`) currently requires `de` and `schemas/map.js` enforces `de.startsWith("Ich kann")`.
- Subject ID & strands (proposed): `daf` (`name: { de: "Deutsch als Fremdsprache", en: "German as a Foreign Language" }`), `explainerFocus: competency`, shared modern-language strands: `grammatik`, `wortschatz`, `aussprache`, `landeskunde`, `texte`.
- Branch: `feat/map-daf`.

## Notes
- **Primary sources verified for `map/daf.yaml`:**
  1. **ZfA / KMK Rahmenplan „Deutsch als Fremdsprache“ für das Auslandsschulwesen (2009)** — official KMK-endorsed school DaF framework with 3 Bildungsabschnitte (A1, A2, B1 = MSA) and the exact 5 strands.
  2. **Goethe-Institut / ÖSD / telc Prüfungsziele & Testbeschreibung** (A1 Fit in Deutsch 1 / Start Deutsch 1, A2 Fit in Deutsch 2 / Goethe-Zertifikat A2, B1 Zertifikat B1) — concrete A1/A2/B1 inventories of structures, topics, speech acts, and text types.
  3. **BAMF Rahmencurriculum für Integrationskurse – Deutsch als Zweitsprache (2016)** / **LehrplanPLUS Bayern DaZ** — third authoritative source for triangulating concrete grammar and vocabulary progression across A1–B1.
- **Openly licensed German CEFR vocabulary research (completed):**
  - **GerVLPro** (Michael, Hülsing & Horbach, Kiel University & Leibniz Institute IPN, LREC 2026; `https://github.com/noahmanu/gervlpro`): 4,015 lemma–POS entries (`GerVLPro.tsv`: A1: 611, A2: 1,134, B1: 903, B2: 1,103), derived from 5,631 CEFR-annotated German L2 learner texts and manually verified. **No `LICENSE` file in repo yet** — must ask authors before publishing derived `words.yaml`.
  - **CEFRLex DAFlex** (`https://cental.uclouvain.be/cefrlex/daflex/`): German sister lexicon to `FLELex`/`EFLLex` (receptive), **not downloadable yet** (no TSV or published licence).
  - **Goethe-Institut / telc Wortlisten**: publicly readable PDFs, **copyrighted (All Rights Reserved)**.
  - **IDS Mannheim DeReWo**: **CC BY-NC 3.0 DE**, but native frequency list (not CEFR-graded; poor CEFR alignment).
  - **Conclusion:** No downloadable German CEFR-graded vocabulary list from a ministry/institute/university currently has an explicit open licence. Best path is to defer `map/daf/vocabulary/` until GerVLPro's authors confirm a licence (or DAFlex is released for download).

## Explore
### Tasks

### Completed
- [x] Created development plan file
- [x] Check platform architecture & `gradeBand` labeling options (verified `schemas/map.js`, `eleventy.config.js`, `src/_data/de.js`, `src/_data/en.js`, `src/map-*.njk`)
- [x] Identify and verify authoritative primary sources for DaF A1–B1 (ZfA Rahmenplan DaF 2009, Goethe-Institut Prüfungsziele A1/A2/B1, BAMF/LehrplanPLUS DaZ)
- [x] Research openly licensed German CEFR vocabularies (checked CEFRLex DAFlex, GerVLPro LREC 2026, Goethe/telc, IDS DeReWo, CLARIN, Zenodo, HuggingFace)
- [x] Check schema/template impact of English-only `iCan` (`schemas/entry.js`, `schemas/map.js`, `eleventy.config.js`)
- [x] Review existing foreign language maps (`map/englisch.yaml`, `map/franzoesisch.yaml`, `map/spanisch.yaml`) and `scripts/vocabulary.mjs`

## Plan
### Entrance Criteria
- Authoritative primary sources for DaF A1–B1 and basic vocabulary (with verified licence) are identified and accessible.
- Labeling approach for A1/A2/B1 vs `5-6`/`7-8`/`9-10` is clarified with the user.
- Strands, subject ID, and `iCan` language conventions are agreed.

### Tasks

### Completed
- [x] Designed optional `bandLabels` on `subject.v1` (`schemas/map.js`, `lib/map.js`, `src/_data/map.js`, `eleventy.config.js`, `src/map-*.njk`, `src/_includes/components.njk`, `docs/learning-map-contract.md`): when present, renders e.g. `A1` / `A2` / `B1` instead of `Klasse 5/6` / `Grade 5/6`; when absent, existing subjects are 100% unchanged.
- [x] Designed English-only `MapText` / `iCan` support in `schemas/map.js` (accepts `{ en }` starting with `"I can"` when `de` is absent) and `tx`/`fallbackLang` filters in `eleventy.config.js` (falls back to `en` with `lang="en"` on German pages).
- [x] Planned `map/daf.yaml` across the 5 shared modern-language strands (`grammatik`, `wortschatz`, `aussprache`, `landeskunde`, `texte`) with `explainerFocus: competency`, `status: draft`, `bandLabels: { "5-6": "A1", "7-8": "A2", "9-10": "B1" }`, English-only competency `name` and `iCan`, and source-cited `requires` chains grounded in ZfA Rahmenplan DaF (2009), Goethe-Institut Prüfungsziele A1/A2/B1, and BAMF Rahmencurriculum / GER.
- [x] Confirmed DAFlex has no download link on `cental.uclouvain.be/cefrlex/download/` (cannot fabricate `words.yaml`); documented in plan & PR report so `map/daf/vocabulary/` can be generated via `node scripts/vocabulary.mjs daf <lexicon.tsv>` once the TSV is provided.

## Code
### Entrance Criteria
- Concrete plan for `map/daf.yaml`, optional `bandLabels`, English-only `iCan`, research report, and tests is ready.

### Tasks

### Completed
- [x] Extended `schemas/map.js` with `MapText`, English-only `iCan` validation, and optional `bandLabels`, and regenerated schemas via `npm run schema`
- [x] Updated `lib/map.js`, `src/_data/map.js`, `eleventy.config.js`, `src/map-*.njk`, `src/_includes/components.njk`, and `docs/learning-map-contract.md` for `bandLabels` and English-only fallback
- [x] Added unit tests in `test/map.test.mjs` for `bandLabels` and English-only `iCan`
- [x] Authored `map/daf.yaml` (151 competencies across 5 strands, A1–B1, English-only `name`/`iCan`, source comments, specific `requires` chains)
- [x] Verified `node .agents/skills/map-research/scripts/probe.mjs daf`: 0 cell circles, 0 strand warnings, 0 isolated competencies, 0 later-band prerequisites
- [x] Wrote `.vibe/research-daf.md` with full sources, band mapping, strand rationale, `probe.mjs` findings, and vocabulary open point (DAFlex download)
- [x] Verified `node scripts/schema.mjs --check`, `npm run build` (6,454 files), rendered DaF HTML (`A1`/`A2`/`B1` + `lang="en"`), and full `npm test` (125/125 passing)

## Commit
### Entrance Criteria
- `probe.mjs`, `npm run schema`, `npm run build`, and `npm test` all pass.
- Research report `.vibe/research-daf.md` is complete with full source citations and open points.

### Tasks

### Completed
- [x] Applied `commit` skill and committed all changes including `.vibe/` on `feat/map-daf`
- [x] Pushed branch `feat/map-daf` and opened pull request with full research report summary



---
*This plan is maintained by the LLM. Tool responses provide guidance on which section to focus on and what tasks to work on.*
