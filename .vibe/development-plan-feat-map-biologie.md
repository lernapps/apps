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
- Umfang (Nutzer/in, 2026-11-07): keine Zielgröße. Maßstab ist, den Inhalt möglichst gut lehren zu können. Regel im
  Skill `map-research` ergänzt. Folge für Biologie: Die Zusammenlegungen aus Recherche 3.3, die nur der Größe dienten,
  werden wieder getrennt, wo zwei Seiten besser lehren.
- Verhalten (`tierkommunikation`, `verhalten-und-lernen`) kommt in den Strang `umwelt` (Nutzer/in; HE und BY nennen es).

## Notes
- Vorbild: `map/physik.yaml` (Kopfkommentar mit Quellenkürzeln, ein Kommentar je Baustein).
- Format: `docs/learning-map-contract.md`; Prüfung: `npm run build`, `npm test`.
- Bericht (Quellen, Entscheidungen, offene Punkte) kommt in den Pull Request.

## Explore
### Tasks
- [ ] Offene Punkte mit der Nutzerin / dem Nutzer klären (siehe unten)

### Completed
- [x] Created development plan file
- [x] Repository erkundet: vorhandene Fächer, Vertrag, Skill `map-research`
- [x] Quellen gelesen: KMK Biologie MSA (13.06.2024); KC Hessen Biologie Gymnasium (2011); LehrplanPLUS Bayern
      online (NT 5, NT 6, Biologie 8–10; PDF-Gesamtlehrplan derzeit nicht abrufbar); KLP NRW Biologie G9 Heft 3413
      (2019, über lehrplannavigator.nrw.de)
- [x] Stränge = die vier KMK-Inhaltsbereiche: `zellen`, `vielfalt`, `mensch`, `umwelt`
- [x] 92 Bausteine mit Fundstellen, Stimmen und requires (Rohdaten: scratchpad `research-biologie.md`, `gen/data.py`)
      zellen 17, vielfalt 27, mensch 32, umwelt 16

### Findings / open points
1. Zählweise Hessen (nur „5/6“ und „nach 9/10“) und NRW (nur Stufe 7–10): Recherche zählte „7-10“ als Stimme für beide;
   Physik/Chemie zählen die zweite Stufe Hessens als 9-10. Betrifft 3 Bausteine.
2. In 7–10 entscheidet praktisch Bayern die Reihenfolge (Bayern: Nerven/Hormone 8, Genetik/Evolution 9, Immun 10).
   Strang `vielfalt` hat daher keinen Baustein in 7-8.
3. Mendel-Genetik fehlt in Bayern; Richtstufe 9-10 per Stichentscheid.
4. Klimawandel nur KMK; 9-10 gesetzt (wegen `kohlenstoffkreislauf`).
5. Verhalten (`tierkommunikation`, `verhalten-und-lernen`): weder KMK noch NRW; vorläufig in `umwelt`.
6. 92 Bausteine leicht über dem Ziel 60–90; Kandidaten zum Zusammenlegen in der Recherche.

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
