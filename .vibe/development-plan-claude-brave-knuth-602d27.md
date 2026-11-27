# Development Plan: apps (claude/brave-knuth-602d27 branch)

*Generated on 2026-11-26 by Vibe Feature MCP*
*Workflow: [epcc](https://codemcp.github.io/workflows/workflows/epcc)*

## Goal
Orchestrierung des Epics Informatik (lernapps/apps#509, 12 Explainer). Erster Schritt: Architektur für die
reichhaltigen, interaktiven Umgebungen des Fachs klären (Programmierumgebung, Simulatoren, Tabelle, Editoren),
bevor die erste Explainer-Session startet. Grundlage: Skill `lernlandkarte-epic`.

## Key Decisions
*Noch offen; Vorschlag siehe Notes, Entscheidung beim Menschen.*

## Notes

### Befund: Grenzen der Plattform (gelesen in lernapps/app-templates und lernapps/tooling, Stand 2026-11-26)
- Explainer-Komponente: Vue-SFC, höchstens 20 kB gzip eigener Code (inkl. importierter Dateien des eigenen
  Ordners, `plugin.ts`, Regel `vue-component-size`); Imports nur aus `vue`, Runtime, `@lernapps/tooling/storage`,
  `i18n`, `a11y`, eigenem Ordner; kein Netz, kein `eval`/`new Function`, kein `innerHTML`/`v-html`.
  Die Fehlermeldung nennt selbst den Ausweg „ask for a built-in block“.
- Folge: Blockly, CodeMirror, sql.js und eine HTML-Live-Vorschau passen nicht in eine Explainer-Komponente.
  Eigener kleiner Interpreter (Roboter-Sprache, Automat, Mini-Tabelle) passt.
- Eine Übungskomponente gibt nur die Antwort ab; Prüfen macht das Logikmodul (`generate/check/solution/wrong`,
  50 Seeds im Build). Das passt gut zu „Programm als Antwort, Prüfung durch Testfälle“.
- Jede Seite braucht zusätzlich eine Frage oder eine generierte Übung; eine Komponente zählt nicht als Pflichtübung.
- Apps teilen zur Laufzeit keinen Code (`con-frontend-only`); jede Kopie einer Komponente lebt im eigenen Repo.
- Speicher: nur eigenes Präfix `lernapps:<id>:` (`dec-own-data-only`); geteilte Präfixe nur für Einstellungen.
  Es gibt also keinen Rückkanal von einer App in eine andere.
- Interaktive App (Archetyp `interactive`): eigene Bibliotheken mit offener Lizenz gebündelt, Routen `app/#<id>`
  per Link öffnbar, 100 kB Speicher, Playthroughs; kein Tutor, keine Lernkarten-Seiten wie ein Explainer.

### Befund: Umgebungen im Epic
| Umgebung | Explainer | geteilt mit | passt in Komponente? |
|---|---|---|---|
| Programmierumgebung (Blöcke → Diagramm → Text, Roboter) | #495 | #496 (Feld) | Blöcke klein ja; Text-Ausführung nur mit eigenem Interpreter |
| Bit-Karten, Pixel-Editor, Caesar-Scheibe, Abtastung | #491 | #492 (Baum, Byte) | ja |
| Dateimanager, Passwort-Simulation | #492 | – | ja |
| Klassifizierer-Simulation | #493 | – | ja |
| Rechenblatt + Datenflussdiagramm | #494 | #498 (Tabelle) | Mini-Tabelle ja |
| SQL auf Tabellen | #498 | – | nur Teilmenge mit eigenem Interpreter |
| Automaten-Simulator | #500 | – | ja |
| Netz-Simulator | #502 | – | ja |
| HTML/CSS mit Vorschau | #504 | – | Vorschau nein (`v-html`-Verbot) |

Der Schnitt des Epics („ein Modell, ein Explainer“) bündelt die Umgebungen schon weitgehend.
Nur zwei Umgebungen überschreiten die Grenzen ernsthaft: Programmieren (#495, #496) und HTML/CSS (#504);
SQL (#498) ist ein Grenzfall.

### Optionen
- A: Umgebung als Komponente im Explainer, Inhalte je Umgebung in einem Explainer (heutiger Schnitt). Für die
  meisten Umgebungen ausreichend.
- B: Externe Werkstatt-App (Archetyp `interactive`) je schwere Umgebung; Explainer verlinken Aufträge.
- C: Eingebauter Block in der Explainer-Runtime (app-templates), z. B. `program`, nicht an das Budget gebunden,
  für alle Explainer und Fächer nutzbar. Plattformänderung, aber eine Prüfung, Tutor-Seite und Selbsteinschätzung
  wie bei jeder Übung.

## Explore
### Entrance Criteria
- Epic #509 und Auftrag des Menschen liegen vor.

### Tasks
- [ ] Entscheidung des Menschen zu Optionen A/B/C und offenen Fragen einholen

### Completed
- [x] Created development plan file
- [x] Skill `lernlandkarte-epic` gelesen
- [x] Epic #509 und 12 Explainer-Issues gelesen (Kopien im Scratchpad `issues/`)
- [x] Grenzen der Explainer-Komponenten, des Archetyps `interactive` und der Speicherregeln geprüft

## Plan
### Entrance Criteria
- Der Mensch hat die Architektur der Umgebungen entschieden.

### Tasks
- [ ] *To be added when this phase becomes active*

### Completed
*None yet*

## Code
### Entrance Criteria
- Gemeinsame Regeln, Session-Anweisung, Schichten und Berechtigungen sind festgelegt.

### Tasks
- [ ] *To be added when this phase becomes active*

### Completed
*None yet*

## Commit
### Entrance Criteria
- Repos und Sessions sind angelegt bzw. Dokumente fertig.

### Tasks
- [ ] *To be added when this phase becomes active*

### Completed
*None yet*

---
*This plan is maintained by the LLM. Tool responses provide guidance on which section to focus on and what tasks to work on.*

## Orchestrierung (laufend)
### Antworten des Orchestrators in der Rolle des Menschen
- #491: Skytale für Grundidee, Caesar eigene Seite; Klassenfahrt 6b, „TREFFEN MONTAG ACHT UHR AM BAHNHOF“.
- #490: Festspeicher als Schublade „Speicher – hebt auf“ unter Verarbeitung (kein EVAS-Kasten).
- Epic: gemeinsame Klasse 6b mit Jona, Selin, Mia (je 11); Aussehen legt #490 fest.

### Funde für Sammel-Issues (noch nicht angelegt)
- map-review: `informatiksystem-auswaehlen` in 5-6, GI 2025 IS-10 sagt 7-10 (NRW 5/6 deckt 5-6) – #490.
- map-review: Karte nennt GI als Quelle für `eva-prinzip`, GI 2025 nennt EVA nicht wörtlich (NRW, BY-MS, HE schon) – #490.
- app-templates (explainer runtime, Funde #491): leere Antwort bei single-choice generisch; Rückfall-Meldung „Lies den Text über der Aufgabe“ passt nicht, wenn nur „Übung“ darüber steht; `generated` startet mit zufälliger Aufgabennummer; `ordering` erlaubt mehrfach „Platz 1“, Rückmeldung ohne Ort; Lizenz-Abzeichen überdeckt bei 360 px den Bildrand.
- tooling/app-templates (Funde coding): Blockly lädt Medien von static.blockly.com (`no-request-before-click`), Blockly-ARIA im Flyout (upstream), `lernapps create` verlangt Plan in Phase code.
- app-templates#201 angelegt (Parameter der Adresse für interactive); Session session_016NmpwboqaaxmBctiZ2xkeS autonom bis grüner PR.
- map-review (#500): GI 2025 setzt Automaten (SA-3, SA-4) in 7-10; Karte setzt `automaten-im-alltag` und `zustandsdiagramm` in 5-6, nur durch NRW gedeckt.
- map-review (#500): Issue #500 nennt `informatiksysteme-im-alltag` als Voraussetzung, die Karte `eva-prinzip` (Issue-Text, kein Kartenfehler).
- app-templates (#491, #490): `image` nur eine Datei für alle Sprachen; Text im Bild nur über labelled-figure oder Anzeige-Komponente übersetzbar. Übungskomponente ohne „Lösung“-Knopf; Rückmeldung bleibt nach Änderung stehen; ohne JS zeigt generierte Ordnungsaufgabe keine Schritte.
- Session-Setup: Auto-Modus lehnt `npx --yes @lernapps/tooling init` trotz Regel in `.claude/settings.json` ab (#500, #492); Mensch gibt je Session frei.
- Für Nachtrag 3 (Bilder): Kiko (coding, `public/kiko.svg`, orange #e8590c, Visier #1f2a44, gelbe Antennenlampe, Räder, gelbes Richtungsdreieck); Mias Tablet (#492, türkis #2a9d8f, gelber Stern #f2c14e); Trainingsbeutel (#493, Petrol #3a8fa3, gelbe Pfote #f4c542; verbindlich nach Musterseite); Automaten-Simulator (#500, Eingabe blau, Ausgabe orange; nach Musterseite).
- app-templates (coding): Sprachumschalter verliert `?c=`; Routenleiste markiert bei params erste Route; h1 ohne Silbentrennung auf 360 px. → an #202-Session gegeben.
- Offene Prüfungen: coding – echter Screenreader (NVDA/VoiceOver), echtes Handy.
- tooling (coding): generischer e2e der Startseite verlangt genau einen Link je Route im main; `arc42 diff` nach `lernapps update` meldet Vorlagenteile; `create` schreibt LICENSE „Copyright (c) 2026 Claude“ (Rechteinhaber klären, betrifft vermutlich alle neuen Repos).
- tooling (#493): `plan done` kann nachgetragene Aufgaben früherer Phasen nicht abhaken; Hook `plan-file` lehnt ersetzte `<archetype>`-Wörter ab.
- Offene Prüfungen coding: Screenreader, echte Handys/Touch, Firefox/Safari, forced colors, 200 % Zoom.
- map-review (#494): Baustein `funktionen-verketten` – „verketten“ ist in Tabellenkalkulationen die Textfunktion VERKETTEN (CONCATENATE); fachlich gemeint ist „verschachteln“ (nest). Explainer schreibt „verschachteln“, id unverändert.
- app-templates (coding): `markRoute` in interactive.ts setzt aria-current auf die erste Route ohne Hash, auch wenn `?c=` eine Challenge zeigt; Option „keine Route markieren“ gewünscht.

### Retro-Punkte für Nachtrag 6 (gesammelt 2026-11-27)
- #496: Eigenschaften erschöpfend prüfen (alle Antworten per Skript, < 1 min); Seed mischen (`Math.imul(seed, 2654435761)`), sonst sind Aufgabe 1–3 bei mulberry32 fast gleich.
- #496: aufeinander aufbauende Definitionen früh fachlich prüfen lassen; Wörter mit Doppelsinn nach der Einführung meiden.
- #496: Bild als `material` in die Frage statt daneben; unten rechts im SVG ~35 Einheiten frei für das Lizenz-Badge.
- #496: Bauaufgaben brauchen eine Deutungsfrage; Regeltexte mit Zahl ohne Plural-Grammatik.
- #496/#492: Figuren auf der ersten Seite einführen; Fachbegriffe beim ersten Vorkommen je Seite erklären (Seiten werden einzeln geöffnet).
- #492: Einleitung/Klassenangabe in app.yaml bei jedem Inkrement mitziehen (Aufgabe im Inkrement-Plan).
- #492: Simulationsstufen müssen die Beispiele der Seite unterscheiden; Geschichte kapitelweit auf Widersprüche prüfen; Textlast 350 Wörter knapp – nach jeder Prüferrunde `lernapps check`.
- tooling (aus app-templates-Session): Engine-Größe in `lernapps check`/fitness melden; `no-request-before-click` für Worker-Anfragen prüfen; Doku zu `engines` in Skills.
