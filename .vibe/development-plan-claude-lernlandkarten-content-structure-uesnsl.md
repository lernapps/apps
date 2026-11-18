# Development Plan: apps (claude/lernlandkarten-content-structure-uesnsl branch)

*Generated on 2026-11-17 by Vibe Feature MCP*
*Workflow: [epcc](https://codemcp.github.io/workflows/workflows/epcc)*

## Goal
Die Kompetenzen aller Lernlandkarten (`map/<fach>.yaml`, 19 Fächer, 125 Stränge, rund 2.850 Kompetenzen) in
Lerneinheiten gruppieren, aus denen je ein Explainer schnell entstehen kann (Auftrag Owner, 2026-11-17).

Präzisiert nach dem ersten Pilot (KD-11): Ergebnis sind **Entwürfe für Explainer**. Ein Explainer ist gut abgegrenzt
und eingeordnet, folgt einer Didaktik und hat Kapitel, die je mehrere Bausteine (Kompetenzen der Karte) nennen.

Ergebnis dieser Session:
- Allgemeine Prinzipien für die Entwürfe (Skill `map-explainers`).
- Je Pilotfach die fachlichen Prinzipien und die Explainer-Entwürfe (`map/<fach>/explainer.md`).
- Eine gemeinsame Struktur für Issues (Vorlage, Labels) und am Ende getaggte Issues für die übrigen Fächer,
  die nach und nach abgearbeitet werden.

## Key Decisions
### KD-01: Doppel-Klassenstufe als Orientierung (Owner, 2026-11-17)
Eine Einheit liegt in der Regel in einer Doppel-Klassenstufe (`gradeBand` 5-6, 7-8, 9-10). Richtwert:
4 bis 10 Kompetenzen, die über `requires` aufeinander aufbauen.

### KD-02: Keine Änderung am Modell der Karte (Owner, 2026-11-17)
Das Gruppieren ist eine einmalige Planungsarbeit. Kein Feld `units`, keine Änderung an Schema, Vertrag oder
`lib/map.js`. Die Prinzipien und Einheiten stehen als Markdown im Repo, je Fach eine Datei.

### KD-03: Kompetenzen dürfen in mehreren Einheiten stehen (Owner, 2026-11-17)
Wenn es didaktisch sinnvoll ist, wird eine Kompetenz in mehreren Einheiten gelehrt. Kein Zwang zur lückenlosen,
überschneidungsfreien Abdeckung; Lücken werden aber sichtbar gemacht.

### KD-04: Pilot mit drei verschiedenen Fächern (Owner, 2026-11-17)
Physik (Naturwissenschaft, `explainerFocus: strand`), Französisch (Sprache, `explainerFocus: competency`) und
Politik-Wirtschaft (Gesellschaftswissenschaft).

### KD-05: Ausrollen über Issues mit gemeinsamer Struktur (Owner, 2026-11-17)
Am Ende der Session je übriges Fach ein Issue in lernapps/apps, mit gemeinsamer Struktur und Labels.

### KD-06: Mehrere Lernpakete je Strang (Owner, 2026-11-17)
Auch in Fächern mit Strang-Fokus darf ein Strang (auch innerhalb einer Doppel-Klassenstufe) mehrere Lernpakete
haben, wenn sich in sich zusammenhängende und voneinander getrennte Gruppen ergeben.

### KD-07: Name „Lernpaket“ (Annahme, 2026-11-17)
Die Gruppe heißt „Lernpaket“ (engl. learning package), damit sie nicht mit „Einheiten-App“ (Glossar, unit app)
verwechselt wird. Vorschlag ohne Widerspruch des Owners; leicht änderbar, solange nichts veröffentlicht ist.

### KD-08: Ablage (Owner, 2026-11-17)
Methode als Skill `.agents/skills/map-units/SKILL.md` (Link in `.claude/skills/`); je Fach `map/<fach>/units.md`
mit fachlichen Prinzipien und Lernpaketen.

### KD-09: Issues ohne Vorlage, mit Labels (Owner, 2026-11-17)
Keine Issue-Vorlage: Die Aufteilung ist einmalig und wird nicht von Nutzern geschrieben. Die gemeinsame Struktur
des Issue-Texts steht im Skill `map-units`; die Issues erstelle ich am Ende der Session. Labels: `map-units` und
je Fach `fach:<fach>`.

### KD-10: Kleiner Test für den Parser, nicht in der Testsuite (Owner, 2026-11-17)
Ein Test für das Einlesen von `units.md` liegt im Skill-Ordner (`.agents/skills/map-units/scripts/`) und wird von Hand
mit `node --test` ausgeführt. Er gehört nicht zu `npm test` (das nur `test/**` liest).

### KD-11: Explainer-Entwürfe statt Lernpakete (Owner, 2026-11-17)
Die Lernpakete des ersten Pilots sind eher **Kapitel**. Ziel der Session sind didaktisch und pädagogisch sinnvolle
**Entwürfe für Explainer**: Ein Explainer hat mehrere Kapitel, ein Kapitel nennt mehrere Bausteine. Ob aus einem
Baustein eine oder mehrere Seiten werden, ist zweitrangig. Wichtig sind:
- **Abgrenzung und Einordnung** des Explainers: was hinein gehört, was nicht, was davor, danach und daneben steht.
- **Didaktik** des Explainers, z. B. „Wir erklären den Stromkreis mit der Wasser-Analogie“, „möglichst viel
  interaktiv bauen oder virtuell messen“.
„Baustein“ ist der Begriff der Karte für eine Kompetenz („Ich kann …“); er wird nicht für Komponenten benutzt.
Ersetzt KD-07 (Name „Lernpaket“). KD-01 (Doppel-Klassenstufe) gilt jetzt für Kapitel; ein Explainer darf über
mehrere Stufen gehen.

### KD-12: Umbenennung (Owner, 2026-11-17)
Skill `map-units` → `map-explainers`; Datei `map/<fach>/units.md` → `map/<fach>/explainer.md`; Label `map-units`
→ `map-explainers`. „Einordnung“ ist in der Karte schon belegt (Lehrplan ordnet einen Baustein in Klassen ein);
im Entwurf heißen die Zeilen darum „Abgrenzung“, „Davor“, „Danach“, „Daneben“.

### KD-13: Entwurf zieht nur Grenzen, keine Baustein-Beziehungen (Owner, 2026-11-17)
Die Beziehungen der Bausteine (`requires`, Reihenfolge, Wiederholungen) stehen in der Karte; wer einen Explainer
baut, orientiert sich zuerst dort. Der Entwurf wiederholt sie nicht: keine Zeilen `Wiederholung`, `Davor`, `Danach`,
`Daneben`, keine Reihenfolge der Bausteine. Er zieht Grenzen (welche Bausteine gehören in welchen Explainer und welches
Kapitel) und hält die Didaktik fest. Was ein Explainer von außen braucht oder wem er zuarbeitet, berechnet das Skript
aus der Karte. Später sind Links zwischen den Issues der Explainer wertvoll.

### KD-14: Kapitel als didaktische Ebene (Owner, 2026-11-17)
Kapitel bleiben als Abstraktionsebene. Jedes Kapitel sagt, wie es das didaktische Konzept des Explainers aufgreift oder
bewusst ein neues einführt. Der Skill leitet dazu an.

### KD-15: Neu erstellen und vergleichen (Owner, 2026-11-17)
Die Entwürfe der Runde 2 liegen in `.vibe/archive/explainer-v2/`. Neue Agenten erstellen die Piloten mit dem
angepassten Skill ohne Blick ins Archiv; danach vergleiche ich beide Runden.

### KD-16: Grammatik in den Sprachen: System-Explainer, disjunkt (Owner, 2026-11-17)
Weg aus Runde 3: Grammatik steht in System-Explainern (je ein System, ein Bildmodell), ohne Überschneidung.
Situations-Explainer üben keine Grammatik-Bausteine; das Kapitel, das Grammatik braucht, beginnt beim Bau mit einer
Sammel-Wiederholung über mehrere Bausteine (KD-17).

### KD-17: Sammel-Wiederholung als Plattform-Feature (Owner, 2026-11-17)
Eine Recap-Seite darf mehrere Bausteine wiederholen (`recap` als Liste); die Laufzeit schreibt nur die Links zur
Karte (Variante a); `lernapps check` warnt, wenn die Seite einen Baustein nicht nennt. Umsetzung durch einen Agenten in
lernapps/app-templates, lernapps/tooling und lernapps/apps (je Branch `feat/recap-several`, Plan in app-templates),
Merge in dieser Reihenfolge. Diese Session kümmert sich um die Struktur der Inhalte.

### KD-18: Zielformat Explainer-Issue, ohne berechnete Bezüge (Owner, 2026-11-17)
Je Explainer ein Issue als Bauauftrag. Es nennt keine Bezüge zu anderen Explainern; stattdessen die Aufgabe
„Untersuche, wie der Explainer in die Lernlandkarte für <Fach> passt“ mit Link auf die Karte des Fachs. Offen:
Quelle (explainer.md oder Issue), Ort, Status.

### KD-19: Ergebnis sind Issues, keine Dateien (Owner, 2026-11-17)
Die Agenten je Fach erzeugen nur Issues in lernapps/apps, auf Deutsch, mit den Labels `explainer` und `proposed`: je
Explainer ein Issue und je Fach ein Überblick (Prinzipien, Liste der Explainer, Bausteine ohne Explainer, Hinweise zur
Karte). Der Entwurf ist nur eine Arbeitsdatei, geprüft mit `check.mjs --file`; `issues.mjs` erzeugt daraus die Texte,
damit alle Issues dieselbe Form haben. Ersetzt KD-09 (ein Issue je Fach mit Labels `map-units`/`fach:`). Die drei
Piloten werden mit demselben Skript zu Issues.

### KD-20: Keine Zirkel zwischen Explainern (Owner, 2026-11-17)
Explainer eines Fachs bauen nie gegenseitig aufeinander auf, auch nicht über andere. Der Check meldet einen Zirkel als
Fehler; er wird beim Entwurf aufgelöst (Bausteine verschieben, Explainer teilen).

### KD-21: requires ist spezifisch; Zirkel aus der Karte werden dort behoben (Owner, 2026-11-17)
Der Physik-Zirkel kam aus der Karte: `elektrostatische-phaenomene` → `atomaufbau` (zu grob: gebraucht ist nur ein
Kern-Hülle-Modell), `nachhaltige-energieversorgung` → `stromversorgung`, `kraftwerksarten` → `generator` (Kontext,
keine Voraussetzung). Eine Kante zeigt auf den kleinsten Baustein, der wirklich gebraucht wird; Kontext ist kein
`requires` (Skill `map-research`). Ein Entwurf verbiegt keine Explainer wegen falscher Kanten: er nennt sie unter
„Hinweise zur Karte“ als `a` → `b`; der Check zählt den Zirkel dann als beantwortet.

### KD-22: Zirkel sind ein Signal; die Karte korrigiere ich (Owner, 2026-11-17)
Meldet ein Agent einen Zirkel (unter „Hinweise zur Karte“ als `a` → `b`), prüfe ich die Karte selbst und entscheide;
ich darf die Karte korrigieren, die Agenten nicht. Abwägung bei mir. Erste Fälle: Physik (neuer Baustein
`kern-huelle-modell`; ohne `kraftwerksarten` → `generator`, `nachhaltige-energieversorgung` → `stromversorgung`;
`elektrische-leistung` → `stromstaerke`, `spannung` statt `ohmsches-gesetz-rechnen`): Pilot-Schnitt bleibt.
Politik-Wirtschaft (ohne `nachhaltigkeitsziele` → `kinder-weltweit`): die Teilung „Eine Welt“/„Welthandel“ bleibt,
weil sie didaktisch trägt und schon als Issues steht.

### KD-23: Prüfskript für die Karte; Zirkel in andere Stränge prüfen auch die Strang-Zuordnung (Owner, 2026-11-17)
`map-research/scripts/probe.mjs` berichtet (kein Test) Zirkel zwischen Zellen Strang × Stufe mit ihren Kanten und, bei
Strang-Fokus, Bausteine, deren Nachbarn überwiegend in einem anderen Strang liegen. Bei einer Kante in einen anderen
Strang wird auch geprüft, ob der Baustein im richtigen Strang steht. Ich lasse es vor jedem Fach laufen und korrigiere
die Karte, bevor ein Agent entwirft.

### KD-24: Mathematik nach KMK-Leitideen (Owner, 2026-11-17)
Die Stränge der Mathematik sind die fünf Leitideen der KMK (2022): Algebra und Funktionen gehören zu einer Leitidee
(„Strukturen und funktionaler Zusammenhang“, S. 18). Die Ids `arithmetik`, `algebra`, `geometrie`, `stochastik`
bleiben (Apps nutzen sie), Namen werden die Leitideen; `funktionen` geht in `algebra` auf; neu `groessen-und-messen`.

### KD-25: Folgen einer Kartenänderung zuerst dem Owner melden (Owner, 2026-11-17)
Muss nach einer Korrektur der Karte (Strang, Kante, Baustein) etwas nachgezogen werden (Issues, Apps, Tests,
Vertrag), sage ich das dem Owner, bevor ich es tue. Prüfung nach jeder Änderung: Apps des Fachs gegen die neue Karte
(`checkApp`, `checkPages` mit ihrer `lernapps-pages.json`), betroffene Explainer-Issues, Tests.

### KD-26: Musik ohne Strang „Notation und Zeichen“ (Owner, 2026-11-17)
In 5-6 bauten fünf Stränge der Musik gegenseitig aufeinander auf. Notation ist die Schreibweise von Rhythmus und
Tonhöhe (BY LB4 „Musik und ihre Grundlagen“). Die Bausteine von `zeichen` wandern dorthin, wo ihr Inhalt liegt
(Notenwerte zu Rhythmus, Notensystem und Vorzeichen zu Tonhöhe, Gesten zu Singen und Musizieren …); der Strang
entfällt. Nichts nachzuziehen: die App `musik` nennt keinen Strang, Issues gibt es noch nicht.

### KD-27: Alle Karten nach den Hinweisen der Explainer-Issues überarbeiten (Owner, 2026-11-17)
Alle Karten werden gezielt nach den „Hinweisen zur Karte“ in den Überblick-Issues überarbeitet (Skill `map-research`);
betroffene Explainer-Issues und Überblicke werden je Fach angepasst (Freigabe für das Nachziehen, KD-25 erfüllt).
Ziel: Am 2026-11-18 früh sollen die Issues autonom abgearbeitet werden.

### KD-28: Branch aktualisieren, squashen, mergen bei grüner CI (Owner, 2026-11-17)
Nach Runde 5 darf ich `main` in den Branch holen, die Commits zu einem zusammenfassen, einen PR anlegen und bei
grüner CI mergen, damit die korrigierten Karten und Skills morgen früh auf `main` sind.

### KD-29: Issues als Bauaufträge ohne Rückfragen (Owner, 2026-11-18)
Die Explainer-Issues müssen ein Agent ohne Nachfrage abarbeiten können: keine Prozessgeschichte, keine KD-Nummern,
keine offenen Punkte der Karte darin. Label `ready` statt `proposed`. Wo und wie gebaut wird, entscheidet, wer umsetzt;
das Issue sagt, wie man vorgeht („So gehst du vor“). Offene Prüfpunkte der Karte stehen in einem eigenen Issue
„Lernlandkarte: offene Prüfpunkte“ (Label `map-review`).

### KD-30: Struktur einer fraglichen Kante als Kommentar an der Kante (Owner, 2026-11-18)
Was eine in #679 fragliche Kante im Graphen trägt (tragend, einzige Voraussetzung, nicht tragend, doppelt), steht als
YAML-Kommentar an der Kante, nicht im Issue und nicht in den Daten der Karte (JSON). Nur für die fraglichen Kanten.

## Notes
- Stränge: im Mittel 19 Kompetenzen, kleinster 6, größter 94 (Französisch/Grammatik 89, Physik/Elektrizitätslehre 39
  über Klasse 5 bis 10). Ein Strang ist für einen Explainer meist zu groß.
- Vertrag `docs/learning-map-contract.md`: Ein Explainer im Format 2 nennt einen Strang (`strand`) oder, bei
  `explainerFocus: competency`, nur das Fach (Unit-App). Je Seite in der Regel eine Kompetenz. Recap-Seiten für
  Voraussetzungen außerhalb der App. Daraus folgt für Einheiten:
  - Fächer mit `explainerFocus: strand`: eine Einheit bleibt in einem Strang; Voraussetzungen aus anderen Strängen
    werden Recap-Seiten.
  - Fächer mit `explainerFocus: competency`: eine Einheit darf Stränge mischen.

### Ergebnisse Explore (2026-11-17)
**Zellen Strang × Doppel-Klassenstufe** (Skript im Scratchpad, `lib/map.js` `loadMap`): 328 Zellen.
- 165 Zellen haben 4–10 Kompetenzen: Sie sind schon fast eine Einheit (Reihenfolge über `requires`/`place`).
- 93 Zellen haben mehr als 10: teilen, meist entlang der `requires`-Ketten (Teilbäume) oder nach Themen.
- 70 Zellen haben weniger als 4: mit einer Nachbarzelle zusammenlegen (gleicher Strang, Nachbarstufe, oder bei
  `explainerFocus: competency` anderer Strang) oder als kleine Einheit stehen lassen.
- Pilotfächer: Physik 5 Stränge/108 Kompetenzen (3 / 4 / 5 Zellen <4 / 4–10 / >10); Französisch 5/187 (2 / 9 / 4,
  größte Zelle 44); Politik-Wirtschaft 11/144 (10 / 11 / 5). Die drei decken die drei Fälle gut ab.
- Am größten: Sprachen (Englisch bis 47 je Zelle) und Geschichte (10 von 12 Zellen >10).

**Hilfsdaten der Karte:** `lib/map.js` liefert `places` (`{ band, step }`), `steps`, `descendants`, `ancestors`,
`byStep`. Damit lässt sich je Zelle die Kette und ihre Teilbäume ausgeben, als Vorlage für einen Vorschlag.

**Plattform (pdt, lernapps/docs):**
- Die Einheiten stützen die Annahme `a-gaps-guide-creators` (MVP): Ersteller bauen eine App für eine Lücke auf der
  Karte. Eine Einheit ist eine Lücke in passender Größe. Keine Änderung an Design oder Architektur nötig (KD-02).
- Glossar (arc42 12): „Einheiten-App“ (unit app) heißt schon eine App über mehrere Stränge in Sprachen. Unsere Gruppe
  ist allgemeiner: in Fächern mit Strang-Fokus wird sie eine Strang-App über einen Teil des Strangs, in Sprachen eine
  Einheiten-App. Der Name muss das unterscheiden (offene Frage an Owner).

**Ablage im Repo (Vorschlag):**
- Allgemeine Prinzipien als Skill `.agents/skills/map-units/SKILL.md` (Link in `.claude/skills/`), wie die Methode
  `map-research`. So nutzt jeder Agent, der ein Issue abarbeitet, dieselbe Methode.
- Je Fach `map/<fach>/units.md`: fachliche Prinzipien und die Einheiten (Name, Strang, Stufe, Kompetenz-Ids in
  Reihenfolge, Recaps). `map/<fach>/` gibt es schon für Lehrpläne und Grundwortschatz; `loadMap` liest dort nur
  YAML in `curricula/` und `vocabulary/`, Eleventy veröffentlicht `map/` nicht.

**Issues:** Labels in lernapps/apps: nur `updater`. Neu vorgeschlagen: `map-units` (+ evtl. Fach-Label). Vorlage
als `.github/ISSUE_TEMPLATE/map-units.yml` neben `app-enter.yml`.

## Explore
### Tasks
### Completed
- [x] Owner: Ablage, Labels und mehrere Pakete je Strang geklärt (KD-06 bis KD-09)
- [x] Created development plan file
- [x] Ziel und Entscheidungen KD-01 bis KD-05 mit dem Owner geklärt
- [x] Pilotfächer lesen: Stränge, Größen, `gradeBand`, `requires`, `place`
- [x] Hilfsdaten der Karte geprüft (`lib/map.js`)
- [x] Ablage im Repo und Issue-Labels angesehen
- [x] Fit in Plattform und Architektur geklärt (pdt; arc42-Glossar)

### Ergebnisse Pilot (2026-11-17)
| Fach | Pakete | Abdeckung | Größen | Überschneidungen | Check |
|---|---|---|---|---|---|
| Physik | 22 | 108/108 | 1–9 (18 in 4–10) | 1 | 0 Fehler, 11 begründet |
| Politik-Wirtschaft | 26 | 144/144 | 3–10 (24 in 4–10) | 0 | 0 Fehler, 20 begründet |
| Französisch | 37 (24 gemischt) | 187/187 | 3–8 (36 in 4–10) | 0 | 0 Fehler, 25 begründet |

Rückblick, umgesetzt:
- Check: Warnungen eines Pakets mit `Begründung` gelten als beantwortet (`note`), getrennt gezählt.
- Skill: bis 5 Wiederholungen mit Begründung (9-10, Sprachen); dünne Stufen mit Nachbarstufe verbinden;
  Faustregel Grammatik in Themenpaketen vs. eigene Grammatikpakete; Einzelgänger durch die Strangregel als
  Hinweis zur Karte; Grundwortschatz nur Hintergrund.
- Hinweise zur Karte stehen in den drei `units.md`; sie sind Stoff für eine spätere Arbeit nach `map-research`.

## Plan
### Entrance Criteria
- Die Pilotfächer sind gelesen; Daten für das Gruppieren sind bekannt.
- Ablage der Markdown-Dateien und Issue-Struktur sind als Vorschlag formuliert.

### Entwurf (2026-11-17)

#### Was ist ein Lernpaket? (Kriterien für den Skill `map-units`)
Ein Lernpaket ist der Zuschnitt eines Explainers: ein Thema, das ein Kind am Stück lernt.
1. **Eine Doppel-Klassenstufe** (KD-01). Ausnahme mit Begründung: eine kurze Kette, die über die Grenze läuft.
2. **4 bis 10 Kompetenzen** als Richtwert. Weniger nur, wenn es keinen sinnvollen Partner gibt; mehr nur, wenn sich
   die Gruppe nicht sinnvoll trennen lässt.
3. **In sich zusammenhängend:** die Kompetenzen hängen über `requires` zusammen oder dienen einer gemeinsamen Leitfrage.
   Jedes Paket hat eine **Kernidee** (ein Satz: Was kann das Kind danach?).
4. **Nach außen getrennt** (KD-06): wenige `requires`-Kanten zu anderen Paketen derselben Zelle. Mehrere Pakete je
   Strang und Stufe sind erlaubt.
5. **Strang oder Fach nach Fokus:** bei `explainerFocus: strand` ein Strang (wird eine Strang-App); bei
   `competency` darf das Paket Stränge mischen und folgt einem Thema („Au restaurant“, wird eine Einheiten-App).
6. **Reihenfolge = Seitenfolge:** Kompetenzen in der Reihenfolge der Seiten, Voraussetzungen zuerst.
7. **Voraussetzungen außerhalb** werden Wiederholungsseiten (Recap), höchstens etwa 3.
8. **Überschneidung** (KD-03) erlaubt, mit Begründung. **Lücken** (Kompetenzen ohne Paket) stehen mit Grund in
   einem eigenen Abschnitt.
9. **Kindgerechter Titel**, Id als Slug (stabil innerhalb der Datei, nicht Teil der Karte).

#### Format `map/<fach>/units.md`
```
# Lernpakete: <Fach>
Stand, Methode (Link Skill), Kurzstatistik (Pakete, Abdeckung)

## Prinzipien des Fachs
Was die Pakete dieses Fachs zusammenhält (z. B. Themengebiete der Länder, Experimente, Situationen).

## Lernpakete
### <Strang-Name> (oder bei Sprachen: <Themenfeld>)
#### <paket-id> · <Titel> (<Stufe>)
- Kernidee: …
- Explainer: strand <fach>/<strang> | subject <fach>
- Kompetenzen: id-a, id-b, … (Seitenfolge)
- Wiederholung: <fach>/id-x, …   (optional)
- Begründung: … (optional: Ausnahmen, Überschneidungen)

## Ohne Lernpaket
- id: Grund
```
Die Zeilen `Explainer`, `Kompetenzen`, `Wiederholung` sind maschinenlesbar.

#### Werkzeuge (im Skill-Ordner, nicht Teil der Site, keine Änderung an `lib/map.js`)
- `.agents/skills/map-units/scripts/draft.mjs <fach>`: Rohdaten je Zelle Strang × Stufe als Markdown: Kompetenzen
  in Ketten-Reihenfolge (`byStep`), zusammenhängende Teilgraphen über `requires`, Größe, Kanten nach außen.
  Grundlage für den Vorschlag, keine Entscheidung.
- `.agents/skills/map-units/scripts/check.mjs <fach>`: liest `units.md` und prüft jedes Paket mit den Prüfungen der
  Plattform (`checkApp`, `checkPages` aus `lib/map.js`) wie einen Explainer: unbekannte Ids, falscher Strang,
  Reihenfolge, Lücken, Einstiege ohne Recap. Dazu: Stufe, Größe außerhalb 4–10, Abdeckung (Kompetenzen ohne Paket,
  die nicht unter „Ohne Lernpaket“ stehen), Überschneidungen. Ausgabe als Liste; Fehler = Exit-Code 1.
- Test: ein kleiner Test für den Parser von `units.md` im Skill-Ordner, von Hand (KD-10).

#### Pilot
- Je Pilotfach ein Teilagent (Physik, Französisch, Politik-Wirtschaft, parallel): liest Skill, Karte und Draft,
  schreibt `map/<fach>/units.md`, bis `check.mjs` ohne Fehler ist. Ich prüfe jeden Vorschlag (Stichproben der
  Pakete, Ausnahmen, Lücken).
- Danach Rückblick: Kriterien im Skill nachschärfen.

#### Issue-Struktur (im Skill, KD-09)
Titel „Lernpakete: <Fach>“, Labels `map-units`, `fach:<fach>`. Text:
- Ziel (ein Satz) und Link auf Skill `map-units` und ein Pilotbeispiel
- Ausgangslage aus `draft.mjs`: Stränge, Zellen < 4 / 4–10 / > 10, größte Zelle, Fokus
- Besonderheiten des Fachs (Hinweise für die Prinzipien)
- Aufgaben: Prinzipien des Fachs schreiben; Pakete schneiden; `check.mjs` ohne Fehler; Lücken begründen
- Fertig, wenn: `map/<fach>/units.md` liegt vor, Check grün, Owner hat geprüft
16 Issues (19 Fächer ohne die 3 Piloten).

### Tasks
### Completed
- [x] Owner: Entwurf bestätigt, Test nur für den Parser (KD-10)
- [x] Kriterien, Format, Werkzeuge, Pilotablauf und Issue-Struktur entworfen

## Code
### Entrance Criteria
- Der Plan (Kriterien, Dateiformat, Werkzeuge, Issue-Struktur) ist vom Owner bestätigt.

### Tasks
- [x] Skill `map-units` schreiben (Kriterien, Format, Ablauf, Issue-Struktur) und in `.claude/skills/` verlinken
- [x] `draft.mjs` schreiben und an den Pilotfächern ausprobieren
- [x] `check.mjs` schreiben (Parser `units.md`, `checkApp`/`checkPages`, Größe, Stufe, Abdeckung)
- [x] Test für den Parser im Skill-Ordner (KD-10), von Hand ausführen
- [x] Pilot Physik (Teilagent): `map/physik/units.md`
- [x] Pilot Französisch: `map/franzoesisch/units.md`
- [x] Pilot Politik-Wirtschaft: `map/politik-wirtschaft/units.md`
- [x] Pilotvorschläge prüfen; Rückblick, Skill nachschärfen
- [ ] Owner prüft die Piloten
- [x] `npm test` und `npm run build` grün

### Completed
*None yet*

## Code (Runde 2: Explainer-Entwürfe, KD-11)
### Ergebnisse Runde 2 (2026-11-17)
| Fach | Explainer | Kapitel | Bausteine | Check |
|---|---|---|---|---|
| Physik | 10 | 31 | 107/108 (temperatur ohne, begründet) | 0 Fehler, 2 begründet |
| Politik-Wirtschaft | 16 | 52 | 144/144 | 0 Fehler, 6 begründet |
| Französisch | 10 | 44 | 187/187 | 0 Fehler, 4 begründet |
Rückblick: Schnitt nach Didaktik statt nach Stufe; wachsende Visualisierung je Explainer; wiederkehrende Figuren;
Sprachen: Situations-Explainer neben System-Explainern der Grammatik. Skill ergänzt; Regel 5 (Größe) nach Didaktik
statt Zeit, weil Explainer über mehrere Stufen erlaubt sind.

### Tasks
- [x] Skill umbenennen und neu schreiben (`map-explainers`: Explainer → Kapitel → Bausteine, Didaktik, Abgrenzung)
- [x] Parser, Test und Check auf das neue Format umstellen (Prüfung über den ganzen Explainer)
- [x] Piloten neu: Physik, Französisch, Politik-Wirtschaft als `explainer.md` (alte `units.md` als Vorarbeit)
- [x] Piloten prüfen, Skill nachschärfen, alte `units.md` entfernen
- [ ] Owner prüft die Piloten

## Code (Runde 3: nur Grenzen und Didaktik, KD-13 bis KD-15)
### Tasks
- [x] Entwürfe der Runde 2 archivieren (`.vibe/archive/explainer-v2/`)
- [x] Skill, Parser, Test und Check anpassen (ohne Wiederholung/Davor/Danach/Daneben; Kapitel mit Didaktik; Check nur Grenzen, Bezüge berechnet)
- [x] Piloten neu erstellen lassen (ohne Archiv)
- [x] Runde 2 und 3 vergleichen, Ergebnis im Plan (`.vibe/archive/comparison-v2-v3.md`): Grenzen in Strang-Fächern stabil (Rand 0,95/0,99), Französisch offen (Grammatik in Situationen oder eigene Systeme)
- [ ] Owner prüft

## Code (Runde 4: Explainer-Issues je Fach, KD-19)
### Tasks
- [x] Skript `issues.mjs`, `check.mjs --file`, Skill auf Issues umgestellt; erstes Issue lernapps/apps#345
- [x] Agenten je Fach (Gruppen zu vier): physik, franzoesisch, politik-wirtschaft, mathematik | biologie, chemie,
  englisch, deutsch | erdkunde, geschichte, informatik, spanisch | latein, ethik, evangelische-religion,
  katholische-religion | kunst, musik, sport
- [ ] Ergebnisse stichprobenartig prüfen (Überblick-Issues, Sub-Issues, Labels)
- Stand und Entscheidungen zur Karte (KD-22, KD-23):
  - [x] Französisch #346–#363, Physik #345–#376 (Karte korrigiert), Politik-Wirtschaft #362–#384 (Karte korrigiert),
    Chemie #418–#428 (keine Änderung: `daltonsches-atommodell` → `massenerhaltung` ist echt), Biologie #403–#417
    (Zelle-Zirkel 5-6 im Prüfskript, aber kein Zirkel zwischen Explainern: Karte bleibt)
  - [x] Mathematik: Karte auf KMK-Leitideen umgestellt (KD-24); Entwurf läuft neu, alte Issues #385–#402 werden
    weiterverwendet oder geschlossen
  - [x] Mathematik: 16 Explainer #385–#401, #429, #430, #432, Überblick #402; #390, #394 geschlossen
  - [x] Geschichte: `herrschaftsformen` von Grundlagen nach Antike (iCan: Herrscher der Antike; alle Nachbarn dort);
    Zirkel Grundlagen ↔ Antike 5-6 aufgelöst; nichts nachzuziehen (keine App, keine Issues)
  - [x] Erdkunde #431–#456, Überblick #459; Deutsch #441–#474, Überblick #488; Englisch #470–#487, Überblick #489:
    keine Zirkel. Gesammelte Hinweise zur Karte (ohne Zirkel, später nach `map-research`): Englisch
    `gesellschaft-politik` → `politik-uk` (zu eng), `infinitivkonstruktionen` → `fragewoerter`, `technik-fortschritt`
    → `passiv` (nur ein Aspekt); Deutsch `indirekte-rede` → `woertliche-rede-zeichensetzen` (schmal); Erdkunde
    `kartierung` → `stadtviertel`
  - [x] Informatik #490–#505, Überblick #509; Latein #528–#543, Überblick #545; Geschichte #497–#527, Überblick
    #546; Spanisch #526–#560, Überblick #561; Ethik #562–#580, Überblick #581; Sport #582–#601, Überblick #605;
    Kunst #591–#613, Überblick #614. Keine Zirkel.
  - [x] Karten überarbeitet (Owner-Freigabe): Erdkunde, Politik-Wirtschaft, Informatik, Physik, Chemie, Biologie,
    beide Religionen; Skill map-research ergänzt. Nachziehen freigegeben: Issues Physik, Chemie, Erdkunde (läuft),
    Forschungsbericht Erdkunde (erledigt); `hoehenstufen` in Erdkunde 5-6 (Wetterstation in den Alpen).
  - [x] Musik: Strang Notation aufgelöst (KD-26); Explainer #655–#670, Überblick #671
  - [x] Katholische Religion #615–#645, Überblick #648; Evangelische Religion #616–#653, Überblick #654
  - [x] Nachgezogen: Issues Physik, Chemie, Erdkunde (Texte gegen Skript-Ausgabe geprüft)
  - Stand: alle 19 Fächer als Issues, 304 Explainer und 19 Überblicke, Labels `explainer` und `proposed`
  - [ ] Zweite Runde Karten nach gesammelten Hinweisen: Mathematik, Deutsch, Englisch, Französisch, Latein,
    Spanisch, Geschichte, Ethik, Sport, Kunst (Hinweise stehen unter „Hinweise zur Karte“ in den Arbeitsdateien
    und Überblick-Issues)
  - [x] Englisch, Deutsch, Erdkunde: Prüfskript gelesen, Kanten fachlich begründet (z. B. `imperativ` →
    `classroom-phrases`: Wendungen vor der Regel), Karte bleibt; Agenten laufen

## Code (Runde 5: Karten nach allen Hinweisen, KD-27)
### Tasks
- [x] Je Fach: Hinweise aus Überblick-Issue und Arbeitsdatei prüfen, Karte korrigieren, Entwurf anpassen, Issues nachziehen (alle 19 Fächer; Biologie #403–#416 hatten Platzhalter, jetzt voller Text; alle 304 Explainer-Issues mit Text geprüft)
- [x] Tests, Build, Commit je Gruppe (115 Tests grün, Build grün nach Merge von main)
- [x] Abschluss: main hineingeholt; Commits zusammenfassen, PR (für das autonome Abarbeiten muss die Karte auf main sein)

## Code (Runde 6: Issues als Bauaufträge, KD-29)
### Tasks
- [x] `issues.mjs`: Label `ready`, Abschnitt „So gehst du vor“, Überblick ohne Hinweise zur Karte; Skill angepasst
- [x] Entwürfe aller Fächer sprachlich bereinigen (keine Prozessgeschichte), offene Prüfpunkte sammeln (ein Agent je Fach)
- [x] Alle Explainer-Issues und Überblicke neu schreiben, Label `proposed` → `ready`; erste Zeile „Bauauftrag“ (letzter Durchgang je Fach)
- [x] Issue „Lernlandkarte: offene Prüfpunkte“ anlegen: lernapps/apps#679 (129 Punkte, Label `map-review`)
- [x] PR, CI grün, merge (#680)

## Code (Runde 7: Struktur der fraglichen Kanten, KD-30)
### Tasks
- [x] Kanten aus #679 gegen die Karten ausgewertet: keine doppelt, keine verhindert einen Zirkel; einige tragen
  (Baustein sonst lose) oder sind einzige Voraussetzung; 6 vorgeschlagene Kanten schlössen einen Explainer-Zirkel
- [x] Strukturzeile `# requires <id> (Struktur): …` an die 49 fraglichen Kanten in 15 Karten; Skill map-research nennt sie
- [ ] PR, CI grün, merge

## Commit
### Entrance Criteria
- Prinzipien und Lernpakete der drei Pilotfächer liegen vor und sind vom Owner geprüft.
- Skill mit Issue-Struktur ist fertig.

### Tasks
- [ ] Labels `map-units` und `fach:<fach>` anlegen
- [ ] 16 Issues erstellen (nach Freigabe durch den Owner)
- [ ] Commits zusammenfassen (AGENTS.md), PR nur auf Wunsch

### Completed
*None yet*



---
*This plan is maintained by the LLM. Tool responses provide guidance on which section to focus on and what tasks to work on.*
