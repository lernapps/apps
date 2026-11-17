# Development Plan: apps (feat/recap-several branch)

*Generated on 2026-11-17 by Vibe Feature MCP*
*Workflow: [epcc](https://codemcp.github.io/workflows/workflows/epcc)*

## Goal
Eine Recap-Seite eines Explainers (Format 2) darf mehrere Bausteine wiederholen: `recap: [physik/x, physik/y]`
neben `recap: physik/x` (Sammel-Wiederholung „Das brauchst du hier“ am Anfang eines Kapitels). Der Katalog liest
beides aus `lernapps-pages.json` und prüft jeden Baustein. Teil 3 des Features; der Plan führt in
lernapps/app-templates (`.vibe/development-plan-feat-recap-several.md`, KD-01 bis KD-05; dort 0.9.0, #166),
tooling folgt mit lernapps/tooling#309.

## Key Decisions
- KD-03 (lead plan): `lernapps-pages.json` bleibt Format 1; `recap` ist eine Zeichenkette oder eine Liste.
  `lib/map.js` hat dafür `recapsOf(page)`; `checkApp` bekommt weiter eine flache Liste `recaps`, `checkPages` liest
  `page.recap` in beiden Formen.
- Der Skill `map-explainers` liegt nur auf dem Branch der Explainer-Entwürfe
  (`claude/lernlandkarten-content-structure-uesnsl`), nicht auf `main`; er wird dort ergänzt, nicht hier.

## Notes
- Fundstellen: `docs/learning-map-contract.md` (Abschnitt „A recap page“, Seitenliste), `lib/map.js`,
  `scripts/listing.mjs`, `src/_data/map.js`, `src/llms.njk`, `test/map.test.mjs`.
- tooling wird per Commit gepinnt (`@lernapps/tooling` in package.json).

## Explore
### Tasks

### Completed
- [x] Created development plan file
- [x] Fundstellen gesucht

## Plan
### Tasks

### Completed
- [x] `recapsOf` in `lib/map.js`, Leser in Listing und Karte, Vertrag, Test, Pin von tooling

## Code
### Tasks
- [ ] PR, grüne Prüfungen, squash, merge

### Completed
- [x] `lib/map.js` (`recapsOf`, `checkPages`), `scripts/listing.mjs`, `src/_data/map.js`, `src/llms.njk`
- [x] Vertrag: Sammel-Wiederholung, Regeln, Seitenliste
- [x] Test in `test/map.test.mjs`; `npm test` grün
- [x] Pin von `@lernapps/tooling` auf den gemergten Stand von main

## Commit
### Tasks

### Completed



---
*This plan is maintained by the LLM. Tool responses provide guidance on which section to focus on and what tasks to work on.*
