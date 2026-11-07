# Development Plan: apps (feat/map-erdkunde branch)

*Generated on 2026-11-07 by Vibe Feature MCP*
*Workflow: [epcc](https://codemcp.github.io/workflows/workflows/epcc)*

## Goal
Lernlandkarte Erdkunde für das Gymnasium Sek I (Jahrgang 5–10): `map/erdkunde.yaml` nach dem Skill `map-research`.
Keine KMK-Standards; gemeinsamer Bezug: DGfG-Bildungsstandards Geographie (MSA, 10. Aufl. 2020); Länder: KC und
Lehrplan G9 Hessen, LehrplanPLUS Bayern Geographie, KLP NRW Erdkunde G9. Teil der Reihe der Sek-I-Fächer
(siehe `development-plan-feat-map-biologie.md`).

## Key Decisions
- Autonom bis zum Push (Nutzer/in, 2026-11-07); den PR legt die aufrufende Sitzung an.
- Architektur: nur eine neue Datei `map/erdkunde.yaml`; kein Code, kein neues Konzept, keine Änderung an
  Plattform-Design oder arc42-Doku. Kein Lehrplan (`curricula/`).
- `source` = DGfG-Standards: einziger bundesweiter Standard des Fachs, Grundlage des KC Hessen. Sie nennen Inhalte nur
  als Beispiele und sind nicht verbindlich; daher keine Stimme und kein Aufnahmegrund, nur Bezug (Spalte DG).
- Stränge = die Inhaltsbereiche, die die drei Länder teilen: `orientierung`, `erde`, `klima`, `landwirtschaft`,
  `wirtschaft`, `siedlung`, `entwicklung`.
- Zählweise: KC Hessen nur „Ende 9/10“ → Spanne 5-10; LP Hessen G9 mit Jahrgängen (5, 6, 8, 9); BY Geo5/7/10
  (Geo11 nach Jg 10 zählt nicht); NW Stufe 1 = 5-6, Stufe 2 = 7-10.
- Gleichstand: requires, dann SiLP-Hinweis (NRW-Umsetzungsbeispiel), dann die frühere Stufe; Stimmen 5-6 und 9-10
  oder drei verschiedene → die mittlere.

## Notes
- Vorbilder: `map/physik.yaml` (Kommentare), `map/musik.yaml` (Fach ohne KMK-Standards).
- Recherche mit Quellen, Tabellen, Entscheidungen und offenen Punkten: `.vibe/research-erdkunde.md`.
- DGfG-PDF nur als Kopie beim IQSH erreichbar (geographie.de 404, dgfg.org Cloudflare-Sperre).

## Explore
### Tasks

### Completed
- [x] Created development plan file
- [x] Branch `feat/map-erdkunde` von `origin/main`
- [x] Quellen gelesen: DGfG MSA (2020); KC Hessen Erdkunde Gymnasium (2011) und Lehrplan Erdkunde G9 Hessen;
      LehrplanPLUS Geo5, Geo7, Geo10 (Geo11 als Hinweis; Geo6, 8, 9 gibt es nicht); KLP NRW Erdkunde Heft 3408
      (2019) und SiLP (2020)
- [x] Prüfung: DGfG als `source` geeignet (Begründung in der Recherche, 1.1)
- [x] Stränge festgelegt (Recherche 1.2)

## Plan
### Entrance Criteria
- Quellen sind gelesen, Stränge und Kandidaten für Bausteine sind notiert.

### Tasks

### Completed
- [x] Rohdaten je Baustein (Fundstellen, Stimmen, requires) als Skript im Scratchpad (`gen-erdkunde/data.py`)
- [x] Prüfskript (ids, „Ich kann“, mindestens zwei Länder, requires, Richtstufen, Zyklen) und Generator für YAML und
      Recherche-Tabellen

## Code
### Entrance Criteria
- Stränge, Bausteinliste und Richtstufen sind abgestimmt.

### Tasks

### Completed
- [x] 128 Bausteine: orientierung 23, erde 19, klima 24, landwirtschaft 18, wirtschaft 15, siedlung 13,
      entwicklung 16 (51 × 5-6, 53 × 7-8, 24 × 9-10; 7 schwach belegt)
- [x] `map/erdkunde.yaml` erzeugt; `.vibe/research-erdkunde.md` erzeugt
- [x] `npm run build` (Seite `_site/map/erdkunde/` entsteht) und `npm test` laufen durch

## Commit
### Entrance Criteria
- `map/erdkunde.yaml` ist fertig; `npm run build` und `npm test` laufen durch.

### Tasks

### Completed
- [x] Ein Commit `feat(map): the learning map Erdkunde`, Push nach `origin/feat/map-erdkunde`
- [x] Bericht für den PR im Scratchpad (`reports/erdkunde.md`)

---
*This plan is maintained by the LLM. Tool responses provide guidance on which section to focus on and what tasks to work on.*
