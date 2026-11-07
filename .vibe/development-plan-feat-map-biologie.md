# Development Plan: apps (feat/map-biologie branch)

*Generated on 2026-11-07 by Vibe Feature MCP*
*Workflow: [epcc](https://codemcp.github.io/workflows/workflows/epcc)*

## Goal
Lernlandkarte Biologie für das Gymnasium Sek I (Jahrgang 5–10): `map/biologie.yaml` nach dem Skill `map-research`
(KMK-Bildungsstandards Biologie MSA 2024; Hessen, Bayern, NRW). Pilotfach einer Reihe: Danach folgen je eigener Branch
Deutsch, Englisch, Geschichte, Erdkunde, Politik/Wirtschaft, Französisch, Latein, Spanisch, Kunst, Sport, Informatik,
ev. Religion, kath. Religion, Ethik.

## Key Decisions
- Wunsch der Nutzerin / des Nutzers (2026-11-07): alle übrigen Sek-I-Fächer; ein Fach je Branch (`feat/map-<fach>`).
- Biologie zuerst, weil es wie Physik und Chemie KMK-Standards (MSA 2024) gibt.
- Workflow epcc.
- Architektur: Ein neues Fach ist nur eine neue Datei `map/<fach>.yaml`; `lib/map.js` lädt alle Dateien in `map/`.
  Kein Code, kein neues Konzept, also keine Änderung an Plattform-Design oder arc42-Doku.
- Kein Lehrplan (`curricula/`) im ersten Schritt, wie bei Physik, Chemie und Musik.

## Notes
- Vorbild: `map/physik.yaml` (Kopfkommentar mit Quellenkürzeln, ein Kommentar je Baustein).
- Format: `docs/learning-map-contract.md`; Prüfung: `npm run build`, `npm test`.
- Bericht (Quellen, Entscheidungen, offene Punkte) kommt in den Pull Request.

## Explore
### Tasks
- [ ] Quellen beschaffen und lesen: KMK Biologie MSA 2024; KC Hessen Biologie Sek I Gymnasium; LehrplanPLUS Bayern
      Gymnasium (NT 5, Biologie 6–10); KLP NRW Biologie Sek I Gymnasium (2019)
- [ ] Stränge festlegen (KMK-Basiskonzepte bzw. Inhaltsfelder) mit Begründung
- [ ] Bausteine mit Quellen, Richtstufe (Abstimmung 2 von 3), requires sammeln

### Completed
- [x] Created development plan file
- [x] Repository erkundet: vorhandene Fächer, Vertrag, Skill `map-research`

## Plan
### Entrance Criteria
- Quellen sind gelesen, Stränge und Kandidaten für Bausteine sind notiert.

### Tasks
- [ ] *To be added when this phase becomes active*

### Completed
*None yet*

## Code
### Entrance Criteria
- Stränge, Bausteinliste und Richtstufen sind abgestimmt.

### Tasks
- [ ] *To be added when this phase becomes active*

### Completed
*None yet*

## Commit
### Entrance Criteria
- `map/biologie.yaml` ist fertig; `npm run build` und `npm test` laufen durch.

### Tasks
- [ ] *To be added when this phase becomes active*

### Completed
*None yet*

---
*This plan is maintained by the LLM. Tool responses provide guidance on which section to focus on and what tasks to work on.*
