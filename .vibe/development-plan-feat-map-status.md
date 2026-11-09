# Development Plan: apps (feat/map-status branch)

*Generated on 2026-11-09 by Vibe Feature MCP*
*Workflow: [epcc](https://codemcp.github.io/workflows/workflows/epcc)*

## Goal
Jede Karte (Fach) sagt, wie weit sie geprüft ist. Heute sind alle Karten unvalidierte Entwürfe. Auf der Karte muss klar
erkennbar sein: Ein Entwurf ist nur eine Idee, um das Prinzip zu zeigen, nicht mehr. Der Status steigt nach und nach:
`draft` → `checked` (mindestens eine Lehrkraft des Fachs hat sie durchgesehen) → `reviewed` (mehrere).
Folge-Feature zu #227 (Owner, 2026-11-09); gestapelt auf `feat/map-steps` (#229), damit auch die Seite nach Stufen den
Hinweis zeigt.

## Key Decisions
### KD-01: Feld `status` in `map/<fach>.yaml`, Pflicht (Owner, 2026-11-09)
`status: draft | checked | reviewed`. Alle 19 Fächer starten mit `draft`.

### KD-02: Feld `reviews`, ohne Namen (Owner, 2026-11-09)
Optional, eine Liste `{ date, role }`, z. B. `{ date: 2026-12-01, role: "Lehrkraft Französisch, Gymnasium, Hessen" }`.
Keine Namen: keine Daten über Personen. Regeln beim Laden (Fehler): `checked` braucht mindestens 1 Durchsicht,
`reviewed` mindestens 2. `draft` darf Durchsichten haben (eine Durchsicht kann Mängel finden).
Einfachere Alternative wäre, den Status nur aus der Zahl der Durchsichten zu berechnen; das Feld bleibt, weil eine
Durchsicht nicht automatisch hochstuft.

### KD-03: Nur das Fach (Owner, 2026-11-09)
Der Status gilt für Stränge, Bausteine und „baut auf“. Lehrpläne und Grundwortschatz bekommen später einen eigenen.

### KD-04: Anzeige (Owner, 2026-11-09)
- `draft`: auffälliger Hinweis oben auf jeder Seite der Karte eines Fachs (Fach, Lehrplan-Ansicht, nach Stufen, Strang,
  Baustein): „Entwurf: Diese Karte ist eine Idee, um das Prinzip zu zeigen. Noch keine Lehrkraft hat sie geprüft.“ und
  ein Link zum Mithelfen (GitHub-Issue, wie auf `/map/`).
- `checked`, `reviewed`: ein ruhiger Hinweis mit der Zahl der Durchsichten.
- `/map/`: jede Fach-Karte trägt ein Etikett „Entwurf“, „Geprüft“ oder „Begutachtet“; der Text dort erklärt die Stufen.
- JSON `/map/<fach>.json`: `status` und `reviews`.

### KD-05: Einordnung
pdt42: gehört zu `s-gap-finding` und dem Prinzip, offen zu sagen, was die Plattform kann (Karte als „unsere eigene
Methode“, `/map/`). arc42: `if-learning-map`, Glossar-Begriff „Review state (Status)“, Risiko `risk-map-upkeep`
(Status macht sichtbar, was noch niemand geprüft hat). Änderung in lernapps/docs auf eigenem Branch.

## Notes
- Schema: `schemas/map.js` (`Subject`, strictObject), JSON-Schema mit `npm run schema` neu schreiben.
- Parallel: `feat/competency-names` ändert dieselben YAML-Dateien (Feld `name` je Baustein); `status` steht oben bei
  `source`, Konflikte sind klein.

## Explore
### Entrance Criteria
- Owner hat die Fragen zu Ort, Feldern, Geltung und Anzeige beantwortet.

### Tasks

### Completed
- [x] Created development plan file
- [x] Branch `feat/map-status` von `feat/map-steps`
- [x] Fragen an den Owner beantwortet (KD-01 bis KD-04); Einordnung (KD-05)

## Plan
### Entrance Criteria
- Entscheidungen KD-01 bis KD-05 stehen.

### Tasks

### Completed
- [x] Aufgaben für Code (unten)

## Code
### Entrance Criteria
- Plan steht; Owner hat autonomes Arbeiten erlaubt (2026-11-09).

### Tasks

### Completed
- [x] S1 Schema `status` (Pflicht), `reviews` (`{ date, role }`); JSON-Schema neu; Regeln in `lib/map.js` (checked ≥ 1,
      reviewed ≥ 2 Durchsichten; ein Datum ohne Anführungszeichen wird zu YYYY-MM-DD); Fixtures `status-checked`,
      `status-missing-review`; Test
- [x] S2 alle 19 `map/*.yaml` und die Test-Fixtures: `status: draft`
- [x] S3 `src/_data/map.js`, JSON: `status`, `reviews`
- [x] S4 Makro `mapStatus`: Entwurf in Bernstein mit „Mithelfen“ (Issue „Lernlandkarte <Fach>: Durchsicht“); geprüft und
      begutachtet ruhig mit Zahl der Durchsichten. Auf Fach- (auch Lehrplan-), Stufen-, Strang- und Baustein-Seite.
      Etikett auf jeder Karte von `/map/` und Erklärung der drei Stufen; Texte de und en; dunkler Modus
- [x] S5 Test der gebauten Seiten; `npm test` (110: 109 bestanden, 1 übersprungen), Build, Check grün; Screenshots;
      Anzeige für `checked` mit vorübergehend geänderter Physik-Datei geprüft (nicht committet)
- [x] S6 Vertrag (Beispiel und Tabelle), Skill `map-research` (neue Fächer sind `draft`); lernapps/docs Branch
      `feat/map-status` (Glossar `term-review-state`, Satz in `if-learning-map`), gepusht

### Notes (Code)
- Nicht auf der Seite des Grundwortschatzes: der Status gilt nur für das Fach (KD-03).

## Commit
### Entrance Criteria
- Tests, Build, Check grün.

### Tasks
- [ ] Owner prüft den Pull Request; vor dem Merge Squash; nach dem Merge von #229 Basis auf `main` umstellen

### Completed
- [x] Commit, Push, Pull Request gegen `feat/map-steps` (gestapelt)

---
*This plan is maintained by the LLM. Tool responses provide guidance on which section to focus on and what tasks to work on.*
