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
- Kein Strang als Ordnungs- oder Filterkriterium für Sprachen (Nutzer, `explainerFocus: competency`: Apps mischen Stränge). Stattdessen: relative Position der App in der Karte des Fachs, abgeleitet aus den Bausteinen, die sie übt.
- Ansatz (Vorschlag, noch nicht bestätigt): `lib/map.js` liefert je Baustein `steps` (Zeile durch alle Richtstufen) und `places` ({band, step}). Position einer App = Spanne (min..max) und Mitte (Median) der Schritte ihrer geübten Bausteine (`pages[].competencies` oder `competencies`; Recap-Seiten zählen nicht). Normiert auf die Zeilenzahl des Fachs ergibt das 0..1.
- Entscheidung Nutzer: Variante B (Lernweg-Streifen je Karte) gefällt; A verworfen, weil Stufenzahlen bei 1./2./3. Fremdsprache verwirren. C (Ansicht Lernweg) später. Filter-Mockups E (Streifen als Filter) und F (Auswahlfeld "Lernweg") mit neutralen Namen Anfang, Mitte, Weiter statt Stufenzahlen; Klasse bleibt eigener Filter. Auswahl E oder F steht aus.
- Neue Richtung (Nutzer, ersetzt die berechnete Position und die Varianten A bis F): Das Listing bekommt ein Metamodell-Attribut für Serien. Ein Eintrag (`entries/<id>.yaml`, `schemas/entry.js`) nennt Serie und Ordnungszahl; die Suche zeigt "2/13" und sortiert Apps derselben Serie nach der Ordnungszahl. Grund: einfacher, unabhängig von Strängen, Stufen und Fremdsprachen-Reihenfolge.
- Offen: Form des Attributs (Vorschlag `series: { title, part, of? }`), ob `of` deklariert oder gezählt wird, ob `part` eindeutig sein muss, Prüfungen im Build (gleiche `of` je Serie, keine doppelte `part`), Sortierung der Serie unter den anderen Apps.
- Beispiel Issue #489 (Englisch): Schichten 0 bis 3 in Welle 1 (Stufe 5-6), danach Wellen 2 und 3; die Schichtung ergibt sich schon aus `requires`. Apps derselben Schicht liegen parallel (gleiche Position ist ehrlich, keine Scheinreihenfolge).

## Notes
Mockup (Beispielwerte, nicht berechnet): https://claude.ai/artifact/K2ogXmVCCZ4JQXmYrYaKBc mit vier Varianten: A Marke und Nummer auf jeder Karte, B Lernweg-Streifen je Karte, C Ansicht "Lernweg" als Zeitleiste mit parallelen Blöcken und Lücke, D Stufen (5–6, 7–8, 9–10) als Filter über der Liste. Auswahl durch den Nutzer steht aus.

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
