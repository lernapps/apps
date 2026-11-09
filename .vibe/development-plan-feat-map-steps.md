# Development Plan: apps (feat/map-steps branch)

*Generated on 2026-11-09 by Vibe Feature MCP*
*Workflow: [epcc](https://codemcp.github.io/workflows/workflows/epcc)*

## Goal
Issue lernapps/apps#227: Die Lernlandkarte zeigt, wie Bausteine über mehr als einen Schritt aufeinander aufbauen.
- a) Seite eines Bausteins: alle Vorfahren und Nachfahren, geordnet nach Stufe.
- b) Fach-Raster: Zeilen nach Stufe als zweite Ordnung (neben Richtstufe und Lehrplan).
- Stufe = 1 + längster Weg über `requires` zu einem Baustein ohne Voraussetzung (wie im Prototyp
  https://claude.ai/artifact/T7KWcUxAFm2sj6ESWnrpLj).
- Statisch, ohne JavaScript lesbar (KD-15 der Lernlandkarte, `dec-static-sites`); Pfeile nur per kleinem Skript.

Nicht Teil von #227: die Prüfung einer Beispiel-App (Lücke, Reihenfolge, Einstieg) → #226, Branch
`feat/cross-strand-languages`, KD-03a dort.

## Key Decisions
### KD-01: Stufen-Ansicht für alle Fächer (Owner, 2026-11-09)
Auch Geschichte (58 Stufen) bekommt die Ansicht.

### KD-02: Klick in der Stufen-Ansicht wie im Prototyp (Owner, 2026-11-09)
Mit JS: Vorfahren und Nachfahren hervorheben, Pfeile zeichnen, daneben die Kette Stufe für Stufe. Ohne JS: Link zur
Seite des Bausteins.

### KD-03: Anzeige-Name: `name`, sonst die id (Owner, 2026-11-09)
„Ich kann …“ ist als Beschriftung zu lang. Neue Teile der Stufen-Ansicht zeigen `name` (aus `feat/competency-names`),
bis dahin die id. Das gilt auch für die bestehenden Chips und Links der Karte (heute `canLabel`); das „Ich kann …“
bleibt im Dialog und auf der Seite des Bausteins (Owner, 2026-11-09, Runde 2).

Nach dem Merge von #230 (`name` ist Pflicht, überall angezeigt) entfallen die Filter `compName`/`compNameLang`;
Chips, Links und Kette zeigen `name`.

### KD-04: Die Stufe ist abgeleitet, nicht gespeichert (Owner, 2026-11-09)
Die Stufe folgt aus `requires`. Sie steht nicht in `map/<fach>.yaml`. `lib/map.js` berechnet sie beim Laden.
Sie kommt nicht ins JSON (`/map/<fach>.json`): wer `requires` hat, kann sie berechnen; #226 nutzt dieselbe Funktion
aus `lib/map.js`. In lernapps/docs kommt nur der Begriff „Stufe (step)“ ins Glossar, als abgeleitete Größe
(Owner, 2026-11-09, Runde 2).

### KD-05: Adresse unter dem Baum `c/` (Owner, 2026-11-09)
Die Stufen-Ansicht eines Fachs liegt unter `/map/<fach>/c/` (heute ohne Seite). So wird keine neue Adresse neben
Strängen und Lehrplänen reserviert. Annahme: genau `c/` selbst, nicht `c/<etwas>/`, weil sonst eine Baustein-id
kollidieren könnte.

### KD-06: Kette auf der Seite eines Bausteins (Owner, 2026-11-09)
Vorfahren ganz, nach Stufe geordnet. Nachfahren: die nächste Stufe ganz, danach nur die Zahl („Danach bauen noch N
Bausteine in M Stufen darauf auf.“) mit Link zur Stufen-Ansicht.
Auslegung (Plan): „die nächste Stufe“ = die direkten Nachfahren (`requiredBy`), nach ihrer Stufe geordnet; nicht alle
direkten Nachfahren liegen eine Stufe tiefer, und „direkt darauf“ ist für Lesende klarer. Bei den Vorfahren sind die
direkten Voraussetzungen markiert („direkt“).

### KD-07: Autonom ab der Phase Plan (Owner, 2026-11-09)
Nach „Explore“ arbeite ich ohne Halt an den Phasengrenzen bis zum Push. Kein Pull Request ohne ausdrücklichen Wunsch.

### KD-08: Aufbau der Stufen-Ansicht (Plan)
- Daten: `lib/map.js` berechnet beim Laden je Fach `steps` (id → Stufe) und bietet `ancestors(subject, id)` und
  `descendants(subject, id)` (Mengen). Exportiert, damit #226 sie nutzt. Nicht im JSON (KD-04).
- Seite `/map/<fach>/c/` (de) und `/en/map/<fach>/c/` (en), neue Vorlage `src/map-steps.njk`: dieselbe Tabelle wie das
  Fach-Raster (Stränge × Zeilen), Zeilen = Stufe 1 … n mit Zahl der Bausteine; Legende und Filter (geübt/Lücke) wie
  auf der Fach-Seite. Ohne JS: jeder Baustein ist ein Link zu seiner Seite.
- Umschalter „Zeilen: Klassen | Stufen der Kette“ als zwei Links auf der Fach-Seite und der Stufen-Seite.
- Mit JS (`src/assets/map-steps.js`, nur auf der Stufen-Seite): Klick auf einen Baustein wählt ihn: Vorfahren und
  Nachfahren hervorgehoben, die anderen blass; SVG-Pfeile über der Tabelle für die Kanten innerhalb der Kette; ein
  Bereich neben/unter der Tabelle zeigt Name, Stufe, Strang, „Ich kann …“, „Baut auf“ und „Darauf baut auf“ Stufe für
  Stufe, und einen Link zur Seite. Daten für das Skript als `<script type="application/json">` (id, Strang, requires,
  Stufe, Name). Escape oder „Auswahl aufheben“ hebt die Auswahl auf. Neu zeichnen bei Größenänderung. Keine
  Speicherung, keine Anfrage.
- Farben über Tokens, mit Werten für den dunklen Modus wie die übrigen Farben in `apps.css`.
- Anzeige-Name (KD-03): ein Filter `compName` (name in der Sprache, sonst die id), in allen Chips und Links der Karte
  und in der App-Seite; das „Ich kann …“ bleibt im Dialog und auf der Seite des Bausteins. `name` wird heute vom
  Schema noch nicht gelesen; der Filter nimmt es, sobald `feat/competency-names` es ins Schema bringt.

### KD-09: Die Seite eines Bausteins (Plan)
Abschnitt „Lernweg“ wird „Die Kette“: links „Baut auf“ (alle Vorfahren, je Stufe eine Zeile, direkte markiert), Mitte
der Baustein mit seiner Stufe, rechts „Darauf baut direkt auf“ (direkte Nachfahren je Stufe) und der Satz mit der Zahl
der übrigen Nachfahren und dem Link zur Stufen-Ansicht (`/map/<fach>/c/#<id>`). Ohne JS vollständig lesbar.

## Notes
### Einordnung (pdt, arc42 in lernapps/docs)
- pdt42: Service `s-gap-finding` („Seeing which app is still missing“, Kanal `ch-app-overview`). Sein Text nennt schon
  „for a student who struggles, what comes before“. Die Stufen-Ansicht macht genau das sichtbar. Annahme
  `a-gaps-guide-creators` (MVP) bleibt; die Stufen helfen Erstellenden, die Reihenfolge einer App zu planen.
  Kein neuer Service, keine neue Rolle, kein neuer Kanal.
- arc42: Baustein `bb-catalog`, Schnittstelle `if-learning-map` („one page per subject, per strand and per
  competency, per curriculum on request, and the same data as JSON“). Neu wäre: eine Seite je Fach nach Stufen, und
  im JSON die Stufe je Baustein. Glossar: `term-competency` sagt „requires … is a network, not a sequence“; ein Begriff
  „Stufe (step)“ fehlt. → Kleine Änderung in lernapps/docs (Glossar, Satz in `if-learning-map`), per PR (KD-14 der
  Lernlandkarte). Keine neue Entscheidung nötig; `dec-static-sites` gilt.
- Hinweis: `npm ci` in lernapps/docs wurde in dieser Session abgelehnt; die Modelle wurden direkt in den
  Markdown-Dateien gelesen.

### Bestand im Code
- `lib/map.js`: lädt `map/*.yaml`, prüft `requires` (keine Zyklen), berechnet `requiredBy`, `rows()` (Richtstufe oder
  Lehrplan, KD-06), `coverage()`.
- `src/_data/map.js`: Sichten je Fach; Seiten: Fach (`/map/<fach>/`, `/map/<fach>/<lehrplan>/`), Strang, Baustein
  (`/map/<fach>/c/<id>/`), Grundwortschatz, JSON. Reservierte Adressen: `c`, `grundwortschatz`, Lehrplan-ids.
- `src/map-subject.njk`: Tabelle Stränge × Zeilen; Baustein-Chip = Link, mit JS Dialog (`<template>` je Baustein).
- `src/map-competency.njk`: „Lernweg“ zeigt nur direkte `requires` und `requiredBy`.
- `src/assets/map.js`: Drop-down, Filter (geübt/Lücke), Dialog. Kein SVG bisher.
- Anzeige eines Bausteins überall: `iCan | canLabel` (gekürztes „Ich kann …“), nicht die id.
- Tests: `test/map.test.mjs` (Loader, rows), `test/map.e2e.test.mjs` (Browser).

### Zahlen (Stufen je Fach, berechnet mit dem Loader)
Bausteine / Stufen / größte Zelle (ein Strang, eine Stufe):
Biologie 113/10/9, Chemie 75/14/9, Deutsch 206/8/16, Englisch 223/8/24, Erdkunde 128/10/8, Ethik 141/8/7,
Ev. Religion 150/14/6, Französisch 186/9/19, **Geschichte 195/58/6**, Informatik 96/8/10, Kath. Religion 121/13/7,
Kunst 136/8/7, Latein 176/13/10, Mathematik 127/11/7, Musik 187/13/13, Physik 108/9/13, Politik-Wirtschaft 144/12/5,
Spanisch 184/8/24, Sport 151/7/9.
Geschichte ist eine lange Kette (chronologisch): 58 Zeilen mit je 1–8 Bausteinen.

### Parallele Arbeit
- `feat/competency-names` (dritte Session): Feld `name: { de, en }` je Baustein. Noch nicht auf origin. Wir zeigen
  `name`, sobald es da ist. Bis dahin: Annahme siehe Fragen.
- `feat/cross-strand-languages` (#226): nutzt dieselben Stufen für die Prüfung einer App. Noch nicht auf origin.
  Die Berechnung der Stufe gehört in `lib/map.js`, damit #226 sie nutzen kann.

### Graph je Fach (Wurzeln, Teile, Kettenlänge)
Wurzeln = Bausteine ohne Voraussetzung; allein = Wurzel, auf die nichts aufbaut; Teile = getrennte Teilnetze;
meiste Nachfahren / meiste Vorfahren eines Bausteins; Bausteine mit mehr als 30 Nachfahren:
Biologie 9/0/2, 59/20, 4 · Chemie 5/0/1, 48/28, 8 · Deutsch 29/5/9, 34/25, 1 · Englisch 60/23/32, 59/15, 3 ·
Erdkunde 11/0/3, 75/25, 5 · Ethik 13/0/2, 50/19, 3 · Ev. Religion 11/0/2, 81/33, 8 · Französisch 5/0/2, 117/18, 5 ·
Geschichte 1/0/1, 194/115, 84 · Informatik 4/0/2, 53/14, 2 · Kath. Religion 13/2/3, 78/15, 4 · Kunst 23/4/8, 27/38, 0 ·
Latein 10/2/4, 129/38, 12 · Mathematik 5/0/1, 96/35, 6 · Musik 6/0/2, 141/31, 6 · Physik 9/0/1, 34/27, 1 ·
Politik-Wirtschaft 22/4/10, 45/21, 8 · Spanisch 31/19/24, 112/21, 4 · Sport 23/0/10, 33/9, 1.

### Fragen an den Owner (Ende Explore, Runde 1 beantwortet 2026-11-09)
1. Adresse der Stufen-Ansicht: `/map/<fach>/stufen/` (neue reservierte Adresse) – oder anders?
2. Geschichte (58 Stufen): auch dort zeigen, oder die Ansicht nur anbieten, wenn ein Fach höchstens N Stufen hat?
3. Klick auf einen Baustein in der Stufen-Ansicht (mit JS): Kette hervorheben, Pfeile zeichnen und Dialog mit der
   Kette – oder nur hervorheben und Pfeile, Dialog über einen Knopf?
4. Lange Ketten auf der Baustein-Seite (z. B. 190 Nachfahren in Geschichte): ganz zeigen, oder ab einer Größe
   eingeklappt (`<details>`)?
5. Anzeige-Name bis `name` kommt: das bisherige gekürzte „Ich kann …“ (wie überall auf der Seite) statt der id?
6. Stufe auch ins JSON (`/map/<fach>.json`, Feld `step`) und Glossar/`if-learning-map` in lernapps/docs ergänzen?

## Explore
### Tasks


### Completed
- [x] Created development plan file
- [x] Branch `feat/map-steps` von `origin/main` angelegt
- [x] Issue #227, Prototyp, KD-15 der Lernlandkarte gelesen
- [x] Code der Karte gelesen (`lib/map.js`, `src/_data/map.js`, Seiten, `assets/map.js`)
- [x] Mit pdt eingeordnet (pdt42 `s-gap-finding`, `ch-app-overview`; arc42 `bb-catalog`, `if-learning-map`, Glossar)
- [x] Stufen je Fach berechnet
- [x] Runde 1 der Fragen beantwortet (KD-01 bis KD-04); Wurzeln und Teilnetze je Fach berechnet
- [x] Runde 2 beantwortet (KD-03 bis KD-06)

## Plan
### Entrance Criteria
- Issue, Prototyp und bestehende Lernlandkarte (Daten, Code, Seiten) sind gelesen.
- Das Feature ist mit pdt in Plattform-Design und Architektur eingeordnet.
- Offene Fragen sind mit dem Owner geklärt.

### Tasks

### Completed
- [x] Aufbau der Stufen-Ansicht, der Baustein-Seite, der Daten und des Skripts festgelegt (KD-08, KD-09)
- [x] Aufgaben für Code aufgeteilt (unten)

## Code
### Entrance Criteria
- Der Plan (Daten, Berechnung der Stufe, Seiten, Skript, Tests, Doku) ist vom Owner bestätigt.

### Tasks

### Completed
- [x] C1 `lib/map.js`: `steps` beim Laden, `ancestors`, `descendants`, `byStep`, `stepRows`; Fixture
      `test/fixtures/map/steps/` (zwei Wurzeln, zwei Wege verschiedener Länge, ein Baustein allein); 3 neue Tests
- [x] C2 `src/_data/map.js`: je Baustein `step`, `ancestorsByStep`, `ancestorCount`, `childrenByStep`, `furtherCount`,
      `furtherSteps`; je Fach `stepRows`; Seitenliste `stepsPages`
- [x] C3 Filter `compName`/`compNameLang` (name, sonst id) in Chips und Links der Karte
- [x] C4 `src/map-steps.njk` (`/map/<fach>/c/`, de und en); Umschalter „Zeilen ordnen“ auf Fach- und Stufen-Seite
      (`mapOrder`, ein gewählter Lehrplan bleibt); Texte in `de.js`, `en.js`; Begriff „Stufe“ auf `/map/`
- [x] C5 `src/assets/map-steps.js` (Auswahl, Hervorhebung, SVG-Pfeile unter der Tabelle, Kette daneben, Adresse
      `#<id>`, Escape); CSS mit Werten für den dunklen Modus
- [x] C6 Baustein-Seite: „Die Kette“ (KD-09), Link `/map/<fach>/c/#<id>`
- [x] C7 Tests: gebaute Seiten (Zeilen 1…n, Links, JSON-Daten, Umschalter, Englisch; Kette der Baustein-Seite) und
      Browser (Klick → Pfeile, Vorfahren/Nachfahren markiert, Kette, Wechsel per Knopf, Escape; ohne JS Link)
- [x] C8 `npm test` (105: 104 bestanden, 1 übersprungen), `npm run build`, `npm run check` ok; Screenshots geprüft
      (Französisch 1440 px, Mathematik 390 px, Baustein-Seite, Fach-Seite)
- [x] C9 `docs/learning-map-contract.md`: Stufe als abgeleitete Größe; lernapps/docs Branch `feat/map-steps`
      (Glossar `term-step`, Satz in `if-learning-map`), gepusht, kein PR. `npm ci`/arc42-Lint dort in dieser Session
      nicht erlaubt; die CI von lernapps/docs prüft.

### Notes (Code)
- Nicht umgestellt auf `compName` (bewusst): Seitentitel und Überschrift der Baustein-Seite, Titel im Dialog,
  Liste auf der App-Seite. Dort ist Platz, und das gekürzte „Ich kann …“ sagt Eltern und Lehrkräften mehr als eine id.
- `name` liest das Schema heute nicht (strictObject); sobald `feat/competency-names` es aufnimmt, zeigen die Filter es.
- Am Handy steht die Kette unter der Tabelle; die Hervorhebung und die Pfeile sieht man in der Tabelle.
- Eine Klasse `.map-steps` gab es schon (Liste auf `/map/`); die neue heißt `.map-bystep`.

## Commit
### Entrance Criteria
- Code ist fertig, `npm test` und `npm run build` laufen ohne Fehler.
- Seiten sind ohne JavaScript lesbar (geprüft).

### Tasks
- [ ] Owner prüft den Pull Request; vor dem Merge Squash

### Completed
- [x] Aufräumen: keine Debug-Ausgaben, keine TODOs
- [x] Doku: Vertrag (`docs/learning-map-contract.md`), arc42 in lernapps/docs (Branch `feat/map-steps`)
- [x] Tests, Build, Check grün; Commit und Push auf `feat/map-steps`
- [x] Pull Request auf Wunsch des Owners (2026-11-09)

---
*This plan is maintained by the LLM. Tool responses provide guidance on which section to focus on and what tasks to work on.*
