# Development Plan: apps (claude/funny-hawking-mwtivh branch)

*Generated on 2026-11-22 by Vibe Feature MCP*
*Workflow: [epcc](https://codemcp.github.io/workflows/workflows/epcc)*

## Goal
Lernlandkarten (Themen mit mehreren Apps) in der Katalogsuche besser darstellen:
- Lernlandkarten sind in der Suche sichtbar (derzeit versteckt).
- Lernlandkarten lassen sich als Filter nutzen (derzeit nicht möglich).
- Ergebnisse zeigen, welche App wann gelernt werden sollte (Reihenfolge innerhalb der Karte).

Stand: Ideensammlung, noch keine Entscheidung. Erster Schritt: Ist-Zustand erkunden, dann Ideen vorschlagen.

## Key Decisions
*Important decisions will be documented here as they are made*

## Notes
Ist-Zustand (Explore):
- Suche: `src/index.njk` + `src/assets/finden.js`. Filter: Freitext `thema`, `fach`, `klasse` (URL-Parameter). Karten: `appCard` in `src/_includes/components.njk`. Nur ein Link "Zur Lernlandkarte" unter der Ergebnisliste.
- Katalog: `src/_data/catalog.js`; je App `subjectId`, `strand` (`<fach>/<strang>`), `pages` (aus `lernapps-pages.json`, mit `competencies`). Apps ohne Format 2 haben keine Kompetenzen.
- Karte: `src/_data/map.js` und `lib/map.js` berechnen je Kompetenz `place` (Richtstufe + Schritt), Abdeckung (`practisedBy`), Strang-Balken (`bars`: von/bis Richtstufe je App). Seiten: `/map/<fach>/`, `/map/<fach>/<strang>/`, `/map/<fach>/c/` (Schritte).
- Daten reichen schon aus, um jede App zu einer Lernreihenfolge zu ordnen (frühester Schritt/Richtstufe ihrer Kompetenzen). Gilt nur für Apps mit `strand`, `competencies` oder Format-2-Seiten; `entries/` hat 18 Apps, davon nur wenige mit Strang (englisch-grammatik, klima, geo-quizzer).
- Offene Frage: Apps ohne Strang haben keine Reihenfolge; `grades` allein ist grob.

## Explore
Eintritt: Nutzerwunsch liegt vor (erfüllt).
### Tasks
- [x] Ist-Zustand der Suche und der Lernlandkarten (`map/`, `src/`, `lib/`) erkunden
- [x] Ideen mit Vor- und Nachteilen vorschlagen (Chat, Nutzer wählt)
- [ ] Nutzerentscheidung zu Ideen und offenen Fragen abwarten

### Completed
- [x] Created development plan file

## Plan
Eintritt: Der Nutzer hat eine Idee ausgewählt; Ist-Zustand ist verstanden.
### Tasks
- [ ] *To be added when this phase becomes active*

### Completed
*None yet*

## Code
Eintritt: Plan ist vom Nutzer freigegeben.
### Tasks
- [ ] *To be added when this phase becomes active*

### Completed
*None yet*

## Commit
Eintritt: Umsetzung ist fertig, Tests laufen durch.
### Tasks
- [ ] *To be added when this phase becomes active*

### Completed
*None yet*



---
*This plan is maintained by the LLM. Tool responses provide guidance on which section to focus on and what tasks to work on.*
