# Development Plan: apps (feat/map-spanisch branch)

*Generated on 2026-11-07 by Vibe Feature MCP*
*Workflow: [epcc](https://codemcp.github.io/workflows/workflows/epcc)*

## Goal
Lernlandkarte Spanisch für das Gymnasium Sek I: `map/spanisch.yaml` nach dem Skill `map-research`. Ohne eigene
KMK-Standards; Struktur nach den KMK-Standards erste Fremdsprache (2023), Inhalte und Richtstufen aus den Lehrplänen
Hessen (G9), Bayern (LehrplanPLUS) und NRW (KLP G9). Teil der Reihe „ein Fach je Branch“ (siehe
`development-plan-feat-map-biologie.md`).

## Key Decisions
- Autonom bis zum Push (Nutzer/in, 2026-11-07); den PR legt die aufrufende Sitzung an.
- Architektur: nur eine neue Datei `map/spanisch.yaml`; `lib/map.js` lädt alle Dateien in `map/`. Kein Code, kein
  neues Konzept, also keine Änderung an Plattform-Design oder arc42-Doku.
- Kein Lehrplan (`curricula/`).
- Bezug: KMK-Bildungsstandards erste Fremdsprache (Englisch/Französisch), i. d. F. 22.06.2023, nur für die Struktur;
  die KMK nennt keine Spanisch-Inhalte, darum entscheiden die Länder (zwei von drei).
- Gezählt: HE und NW Spanisch als 2. Fremdsprache (ab Jg 7), BY Spanisch als 3. Fremdsprache (ab Jg 8; in BY gibt es
  in der Sek I keine andere Form). Keine Stufe 5-6.
- Stränge wie in der Karte Englisch: `grammatik`, `wortschatz`, `aussprache` (Aussprache und Rechtschreibung),
  `landeskunde` (Länder und Kulturen).
- Gleichstand: frühere Stufe, außer ein `requires` liegt in der späteren.

## Notes
- Quellen, Tabellen und offene Punkte: `.vibe/research-spanisch.md`.
- Rohdaten und Generator im Scratchpad (`gen-spanisch/data.py`, `gen.py`), nicht im Repository.

## Explore
### Tasks

### Completed
- [x] Created development plan file
- [x] Repository erkundet: Vertrag, Skill `map-research`, Vorbilder physik, musik, Recherche Biologie, Entwurf Englisch
- [x] Quellen gelesen: KMK erste Fremdsprache 2023; Lehrplan Spanisch G9 Hessen; KC Moderne Fremdsprachen Hessen
      2023; LehrplanPLUS Bayern Sp8–Sp10 (3. FS, Beginn Jg 8); KLP NRW Spanisch Heft 3416 (2019) mit SiLP 2020
- [x] Beginn je Land geklärt: HE 2. FS Jg 7, BY 3. FS Jg 8, NW 2. FS Jg 7

## Plan
### Entrance Criteria
- Quellen sind gelesen, Stränge und Kandidaten für Bausteine sind notiert.

### Tasks

### Completed
- [x] Strategie: Rohdaten je Baustein (Fundstellen, Stimmen, requires) in `data.py`; ein Skript prüft die Regeln und
      erzeugt `map/spanisch.yaml` und die Tabellen der Recherche

## Code
### Entrance Criteria
- Strategie steht.

### Tasks

### Completed
- [x] 153 Bausteine: grammatik 83, wortschatz 32, aussprache 15, landeskunde 23 (93 × 7-8, 60 × 9-10)
- [x] Skriptprüfung: ids, iCan, mindestens zwei Länder, requires vorhanden, keine spätere Richtstufe, keine Zyklen
- [x] `npm run build` (Seite `_site/map/spanisch/` entsteht) und `npm test` laufen durch

## Commit
### Entrance Criteria
- Build und Tests laufen durch.

### Tasks

### Completed
- [x] Ein Commit mit `.vibe`, Push nach `feat/map-spanisch`
