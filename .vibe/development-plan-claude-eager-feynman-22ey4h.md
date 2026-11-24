# Development Plan: apps (claude/eager-feynman-22ey4h branch)

*Generated on 2026-11-24 by Vibe Feature MCP*
*Workflow: [epcc](https://codemcp.github.io/workflows/workflows/epcc)*

## Goal
Die Baustein-Seite der Lernlandkarte (`src/map-competency.njk`) stellt die App in den Vordergrund: Ist eine App vorhanden, wird sie prominent hervorgehoben, darunter folgt die Einordnung, die Quelle tritt zurück.

Stand: Drei Mockups (A Banner, B Zwei Spalten, C Schmale App-Leiste) liegen als Artifact vor: https://claude.ai/artifact/2Fim5DMBTEpgpeju8QZYdQ. Die Wahl des Entwurfs steht aus.

## Key Decisions
- Entwurf C (schmale App-Leiste, Lernweg, eingeklappt Lehrplan und Quelle) mit der großen Wirkung aus A bei den App-Karten. Die Bewertung durch einen unabhängigen Agenten kam zum gleichen Ergebnis.
- Reihenfolge der Seite: Titel mit Strang und Richtstufe, App, Einordnung (Kette), Lehrplan eingeklappt, Quelle eingeklappt.
- Jede App ist eine Karte (`panel panel-main`) mit Titel, Klassen, Knopf „Zur App“ und den Seiten, die den Baustein üben. Ohne App bleibt die gestrichelte Lücke mit Link zum Bauen.
- Nicht übernommen: „Daten bleiben auf dem Gerät“ (kein Feld im Datenmodell), Vorschaubild (nicht im Datenmodell).
- Der Prüfstatus des Fachs (Hinweis „Entwurf“) steht nicht auf der Baustein-Seite: Er steht schon auf der Karte des Fachs, auf der Baustein-Seite wäre er zu dominant. Der Hinweis auf den Grundwortschatz bleibt auf der Seite.
- Kette: Links stehen unter der Zeitüberschrift, ein langer Name endet mit Ellipsis (voller Name als `title`).
- Nutzer arbeitet autonom bis zum Pull Request und Merge: keine Stopps an den Phasengrenzen.

## Notes
- Betroffen: `src/map-competency.njk`, Texte in `src/_data/de.js` und `src/_data/en.js` (Abschnitt `map.competency`), Test in `test/map.e2e.test.mjs`.
- Bestehende Klassen: `.panel-main`, `.btn-primary`, `.map-chip-gap`, `.map-facts`.

## Explore
### Tasks

### Completed
- [x] Created development plan file
- [x] Baustein-Seite, Texte und Tests gelesen
- [x] Drei Mockups erstellt und von einem Agenten bewerten lassen
- [x] Entwurf gewählt

## Plan
### Tasks

### Completed
- [x] Vorgehen festgelegt: Template umbauen (App, Kette, Lehrplan und Quelle eingeklappt), vorhandene Texte weiterverwenden, ein Test für Reihenfolge und App-Karte
- [x] Tests nicht brechen: „Dieser Baustein · Klasse …“, `map-direct`, „Noch übt keine App diesen Baustein“, Link zur App bleiben erhalten

## Code
### Tasks

### Completed
- [x] Template umbauen: App-Karten zuerst, dann Kette, Lehrplan und Quelle eingeklappt, Grundwortschatz-Link unter der Kette
- [x] Texte: keine neuen nötig, vorhandene Strings reichen
- [x] Test ergänzt; Build und alle Tests laufen (123 bestanden, 0 fehlgeschlagen)
- [x] Offen gelassen: Aussehen im Browser nicht geprüft (nur Markup und Tests)

## Commit
### Tasks

### Completed
- [x] Aufräumen: keine Debug-Ausgaben, keine TODOs; Doku braucht keine Änderung (Seite hat keinen eigenen Doku-Abschnitt)
- [x] Commits zu einem zusammenfassen
- [x] Branch pushen und Pull Request öffnen



---
*This plan is maintained by the LLM. Tool responses provide guidance on which section to focus on and what tasks to work on.*
