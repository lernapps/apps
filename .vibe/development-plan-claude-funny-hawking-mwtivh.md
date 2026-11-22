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
- Entscheidung Nutzer: Dieselbe Ordnungszahl (`part`) darf bei parallelen Einheiten mehrfach vergeben werden. Folge: keine Eindeutigkeitsprüfung; bei gleicher Zahl sortiert der Titel; die Marke zeigt für parallele Apps dieselbe Zahl (z. B. 2/13 zweimal).
- Offen: Form des Attributs (Vorschlag `series: { title, part, of? }`), ob `of` deklariert oder gezählt wird, Prüfung im Build (gleiche `of` je Serie), Sortierung der Serie unter den anderen Apps.
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
- [x] Entwurf festgelegt (siehe unten)

Entwurf:
- Schema (`schemas/entry.js`): optional `series: { title: Text, part: int >= 1, of?: int >= part }`; Schema-JSON mit `npm run schema` neu erzeugen.
- Katalog (`src/_data/catalog.js`): `series` an die App geben. Build-Fehler, wenn Einträge derselben Serie (gleicher deutscher Titel) verschiedene `of` nennen. Sortierung je Fach: Gruppenschlüssel (Serientitel oder Apptitel), dann `part`, dann Titel. `part` darf doppelt vorkommen.
- Karte (`src/_includes/components.njk`, `de.js`, `en.js`): Marke "Serie · part/of" (ohne `of`: "Teil part"), für Screenreader "Teil 2 von 6 der Reihe …". Serientitel in `data-search`, damit die Suche die Reihe findet (`finden.js` bleibt).
- Doku: `docs/learning-map-contract.md` Abschnitt 4, `src/llms.njk`.
- Test: Sortierung und Prüfung der Serie (`test/`).
- Englisch: Serie "Millbrook", `of: 6`. Teile nach den Schichten aus Issue #489: 1 Hello, Millbrook! (#470); 2 Pronomen, Zeiten, Verbketten (#471, #472, #480); 3 Sätze bauen, Dinge/Mengen/Orte, Adjektive/Adverbien, Sätze verbinden (#473, #475, #476, #481); 4 Alltag, Großbritannien, Geschichten, Klang und Schrift (#477, #478, #479, #482); 5 erste Versionen von #484 bis #487; 6 #483. Heute gibt es Einträge für Teil 1 (hello-millbrook), 3 (dinge-mengen-orte, adjektive-adverbien) und 4 (alltag, grossbritannien, geschichten).

### Completed
*None yet*

## Code
Eintritt: Plan ist vom Nutzer freigegeben.
### Tasks
- [x] Schema und Schema-JSON
- [x] Katalog: Prüfung und Sortierung (`lib/series.js`)
- [x] Karte und Texte (de, en)
- [x] Englisch-Einträge anpassen (6 Einträge, Serie Millbrook, `of: 6`)
- [x] Doku und Test (`docs/learning-map-contract.md`, `test/series.test.mjs`)
- [x] Build und Tests laufen lassen (Build offline mit `LERNAPPS_PAGES=off`; Unit-Tests, Schema-Check und `find.e2e` grün)

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
