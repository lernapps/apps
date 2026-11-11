# Development Plan: apps (feat/map-json-place branch)

*Generated on 2026-11-11 by Vibe Feature MCP*
*Workflow: [epcc](https://codemcp.github.io/workflows/workflows/epcc)*

## Goal
Was ein Agent braucht, um aus der Lernlandkarte einen Auftrag für eine App abzuleiten (lernapps/tooling,
Skill `lernapps-map-assignment`), und was die beiden Erprobungen des Skills gezeigt haben (Owner, 2026-11-11).

## Key Decisions
### KD-01: Die Karten-JSON liefert den Ort (Owner, 2026-11-11)
Je Baustein `place: { band, step }` (Ansicht nach Klasse und Kette, lib/map.js `places`). Der Name bleibt `place`.
### KD-02: … und wie viel darauf aufbaut (2. Erprobung)
Je Baustein `opens`: Zahl der Bausteine, die darauf aufbauen, direkt oder weiter unten. Damit braucht der Skill kein
Skript; das Skript wurde im automatischen Modus gesperrt.
### KD-03: Reihenfolge bewusst übergehen (Owner, 2026-11-11)
Eine Seite darf vor einer Voraussetzung stehen, wenn sie sie in `ahead` nennt und die App sie auf einer anderen
Seite übt. Nur die Reihenfolge entfällt; fehlt die Voraussetzung in der App, meldet `checkPages` `ahead`.
`lernapps-pages.json` muss das Feld tragen (lernapps/app-templates) und `lernapps check` es prüfen (lernapps/tooling).
### KD-04: Kante Französisch (Owner, 2026-11-11)
`begruessen-und-vorstellen` braucht `verb-etre` nicht mehr: feste Wendungen vor der Regel.
### KD-05: Autonom bis zum Merge (Owner: „Merge diese Ermittlung“)

## Explore
### Completed
- [x] Prüfung der Reihenfolge: apps `lib/map.js` checkPages (Eintragen), tooling `check/rules/prerequisites-in-order.ts`,
      app-templates `runtime/explainer/page-list.ts` (schreibt lernapps-pages.json)

## Plan
### Completed
- [x] KD-01 bis KD-05

## Code
### Completed
- [x] JSON: `place`, `opens`; Vertrag Abschnitt 1, 3, 5
- [x] checkPages: `ahead`; listing: Behebung für `ahead`
- [x] Kante Französisch; Bericht `.vibe/research-franzoesisch.md`
- [x] Tests (map.test, map.e2e)

## Commit
### Tasks
- [ ] PR, CI grün, Squash-Merge
- Offen in anderen Repos: app-templates (`ahead` im Schema v2 und in page-list.ts), tooling (Regel
  `prerequisites-in-order`, Skill-Texte)
