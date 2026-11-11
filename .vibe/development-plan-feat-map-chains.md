# Development Plan: apps (feat/map-chains branch)

*Generated on 2026-11-10 by Vibe Feature MCP*
*Workflow: [epcc](https://codemcp.github.io/workflows/workflows/epcc)*

## Goal
Die Voraussetzungen (`requires`) aller Lernlandkarten `map/<fach>.yaml` prüfen und überarbeiten, Fach für Fach
(Auftrag Owner, 2026-11-10):
- Die Bausteine stehen in der fachlich richtigen Reihenfolge.
- Pro Fach wenige Wurzeln, möglichst keine allein stehenden Bausteine.
- Jede neue oder geänderte Kante hat eine Begründung aus einer Quelle (Kommentar am Baustein), nach Skill
  `map-research` (KMK, drei Länder, dazu fachdidaktische Quellen zum Aufbau).
- Keine erfundenen Kanten. Echte Wurzeln bleiben und stehen im Bericht.
- Geschichte: prüfen, ob die 58-stufige Kette fachlich „baut auf“ ist oder nur Chronologie.
- `status: draft` bleibt; Ids bleiben; `npm test` und `npm run build` grün.
- Bericht je Fach in `.vibe/research-<fach>.md` (Ergänzung).

## Key Decisions
### KD-01: Ein Branch, je Fach ein Commit (Owner, 2026-11-10)
Alle Fächer auf `feat/map-chains`, je Fach ein Commit mit Karte und Bericht. Vor dem Merge zusammenfassen (AGENTS.md).

### KD-02: Teilagenten je Fach (Owner, 2026-11-10)
Je Fach ein Teilagent: liest Quellen, schlägt Kanten mit Begründung vor. Höchstens 2–3 gleichzeitig. Ich prüfe jeden
Vorschlag, bevor er in die Karte kommt.

### KD-03: Wie ein Baustein angebunden wird (Owner, 2026-11-10)
Stufenweise, je Baustein ohne Anknüpfung:
1. Verschiedene Quellen lesen (KMK, Länder, Fachdidaktik) und Kanten aus den Inhalten ableiten.
2. Gibt keine Quelle eine Kante her: Inhalt prüfen – in welchem Alter ist er relevant, welche inhaltlichen
   Beziehungen gibt es? Bei hoher Zuversicht eine Kante und Einordnung vorschlagen (im Kommentar als Herleitung
   gekennzeichnet, nicht als Quelle).
3. Nur wenn es gar keinen sicheren Anknüpfungspunkt gibt: der Baustein bleibt unabhängig. Dann bekommt er ein neues,
   optionales Modell-Feld, damit er in einer passenden Stufe steht und sich nicht alles in Stufe 1 sammelt.
Das ändert KD-04 von feat/map-steps („Stufe nur abgeleitet“) für diesen Fall: Vertrag, Schema, `lib/map.js`, Tests
und das Glossar in lernapps/docs sind betroffen. Zuschnitt des Felds: siehe KD-05.

### KD-04: Fachdidaktische Quellen nur für requires (Owner, 2026-11-10)
Fachdidaktische Literatur darf `requires` begründen, nie Bausteine oder Richtstufen. Mit Titel, Ausgabe, Seite.
Der Skill `map-research` wird entsprechend ergänzt.

### KD-05: Feld für die Stufe erst bei Bedarf (Owner, 2026-11-10)
Erst die Fächer bearbeiten. Ein Feld (oder eine Regel) für unabhängige Bausteine kommt erst, wenn ein Fach nach
KD-03 wirklich unabhängige Bausteine übrig hat. Offene Frage des Owners: Wie wird `gradeBand` heute genutzt?
Befund: `gradeBand` ist Pflicht an jedem Baustein (Schema subject.v1, Werte 5-6/7-8/9-10, per Mehrheit der Länder).
Die Stufen-Ansicht nutzt es nicht: Stufe 1 = keine requires, egal welche Richtstufe. Heute stehen dadurch z. B. in
Englisch 12 allein stehende Bausteine der Richtstufen 7-8 und 9-10 in Stufe 1 (Spanisch 8, Kunst 2,
Kath. Religion 1). Mögliche einfachere Lösung ohne neues Feld: Startstufe einer Wurzel aus ihrem `gradeBand`
ableiten. Entscheidung folgt, wenn der Bedarf feststeht.

## Notes
- Ausgangszahlen: siehe Auftrag (Tabelle Stand main nach #229). Mein Messskript (Scratchpad, `measure.mjs`, nutzt
  `loadMap`) ergibt genau dieselben Zahlen; mit `<fach>` als Argument listet es die Wurzeln je Strang
  (`*` = allein stehend).
- Einordnung (pdt, lernapps/docs): Die Lernlandkarte ist `if-learning-map` im Baustein Katalog (arc42 Kap. 5). Das
  Glossar sagt: „requires (baut auf) ist ein Netz, keine Folge“ (`term-competency`). Die Arbeit ändert nur Daten in
  `map/*.yaml`, keinen Vertrag, kein Konzept und nichts an Plattform-Design oder Architektur.
- Englisch: Wurzeln liegen vor allem im Wortschatz (24 von 33 Bausteinen, viele davon allein: Wortfelder wie
  `essen-trinken`, `gesundheit`, `umwelt`) und in der Grammatik (18). Wortfelder bauen fachlich oft nicht
  aufeinander auf – hier droht der Konflikt „keine erfundenen Kanten“ gegen „wenige Wurzeln“.
- Geschichte: 1 Wurzel (`was-ist-geschichte`), 259 Kanten, davon 45 über Strang-Grenzen, meist Epoche an Epoche.
  Prüfmaßstab nötig: Kante nur, wenn man A braucht, um B zu verstehen (Begriff, Ursache, Vorwissen) – nicht, weil A
  früher war.
- Skill `map-research` sagt „Nothing else for the model: no textbook, no wiki“. Der Auftrag will zusätzlich
  fachdidaktische Quellen zum Aufbau. Klären, ob der Skill dafür ergänzt wird.

- 2026-11-10: Die Vorschau von PR #235 kam nicht online: GitHub Pages brach zweimal mit Timeout ab. Auf Wunsch des
  Owners habe ich 95 Vorschauen geschlossener PRs von `gh-pages` entfernt (Commit `2b2cbeb`); danach war die
  Vorschau nach 2 Minuten da. Der Issue-Entwurf für lernapps/tooling (warum Vorschauen liegen bleiben) liegt im
  Scratchpad (`issue-tooling-previews.md`).

## Explore
### Entrance Criteria
- Auftrag des Owners liegt vor.

### Tasks
- [x] Vorhandene Berichte je Fach gesichtet (durch die Teilagenten, Phase Code)

### Completed
- [x] Created development plan file
- [x] Branch `feat/map-chains` von main (1dc310a) angelegt
- [x] Einordnung mit Skill pdt: nur Daten, keine Änderung an Design oder Architektur
- [x] Messskript (Wurzeln, allein, Teilnetze, Stufen) – Zahlen bestätigt
- [x] Fragen an den Owner beantwortet (KD-01 bis KD-05)
- [x] Nutzung von `gradeBand` bei Wurzeln ausgewertet (KD-05)

## Plan
### Entrance Criteria
- Einordnung (pdt) ist gemacht, Messskript läuft, Owner hat die Fragen zum Zuschnitt beantwortet.

### KD-06: Ablauf je Fach (Plan)
1. **Teilagent** (general-purpose, im Hintergrund) bekommt: die Karte, den alten Bericht `.vibe/research-<fach>.md`,
   den Skill `map-research`, KD-03/KD-04 und die Liste der Wurzeln je Strang (Messskript). Er liest die Quellen
   im Original (KMK, die drei Länder des Berichts, dazu Fachdidaktik zum Aufbau) und schreibt **nur einen Vorschlag**
   in den Scratchpad (`proposal-<fach>.md`). Er ändert keine Datei im Repo.
2. **Vorschlag** = Tabelle, je Zeile: Baustein, Aktion (`add` / `remove` / `keep-root`), Voraussetzung, Begründung,
   Quelle (Kürzel, Ausgabe, Seite oder Abschnitt), Art (`Quelle` oder `Herleitung`, nur bei hoher Zuversicht).
   Dazu: Quellenliste mit URL, verbleibende Wurzeln mit Grund, offene Punkte.
3. **Ich prüfe** jede Zeile: Ist die Kante direkt (nicht schon über andere Kanten da)? Keine spätere Richtstufe als
   Voraussetzung? Kein Kreis? Quelle plausibel? Stichproben in den Quellen. Was nicht trägt, fliegt raus.
4. **Ich ändere die Karte.** Form des Kommentars am Baustein, unter den bestehenden Quellenzeilen:
   `# requires <id>: <Begründung> (<Kürzel Fundstelle>)`; bei Herleitung `# requires <id> (Herleitung): <Grund>`.
   Entfernte Kanten stehen nur im Bericht. Ids, `gradeBand` und `status` bleiben.
5. **Prüfen:** Messskript (vorher/nachher), `npm test`, `npm run build`; bei Fächern mit
   `explainerFocus: competency` (Deutsch, Englisch, Französisch, Latein, Spanisch) zusätzlich `npm run listing`
   vorher/nachher vergleichen – neue Befunde bei Apps im Bericht nennen.
6. **Bericht:** neuer Abschnitt „requires überarbeitet (2026-11, feat/map-chains)“ in `.vibe/research-<fach>.md`:
   Quellen, geänderte Kanten mit Begründung, Wurzeln, die bleiben (mit Grund), offene Punkte, Zahlen vorher/nachher.
7. **Commit** je Fach (Karte + Bericht + Plan-Datei).

### KD-07: Reihenfolge und Pilot (Plan)
Englisch zuerst, als **Pilot**: danach halte ich an und zeige dem Owner das Ergebnis, bevor die übrigen Fächer
folgen. Dann Spanisch, Deutsch, Kunst, Sport, Politik-Wirtschaft, Geschichte; danach Ethik, Kath. Religion,
Erdkunde, Ev. Religion, Latein, Biologie, Physik, Musik, Chemie, Französisch, Mathematik, Informatik.
Höchstens 2–3 Teilagenten gleichzeitig (KD-02).

### KD-08: Geschichte (Plan)
Prüfmaßstab für jede Kante: Man braucht A, um B zu verstehen (Begriff, Ursache, Vorwissen). Zeitliche Folge allein
reicht nicht. Kanten über Epochen, die nur die Zeit abbilden, werden entfernt; dafür bleibt die Epoche über ihre
eigenen Grundbegriffe (z. B. `zeitrechnung`) angebunden, wenn eine Quelle das trägt. Mehr Wurzeln sind hier das
erwartete Ergebnis, kein Fehler.

### KD-10: Prüfung der Vorschläge (Englisch-Pilot)
Kanten, die der Teilagent selbst nur mit mittlerer Zuversicht einstuft, übernehme ich nicht (Regel 2: nur hohe
Zuversicht). Werkzeug: `apply.py` im Scratchpad liest die Tabellen 2.1/2.2 des Vorschlags und ändert die YAML-Datei
als Text (Kommentare bleiben); einzelne Kanten lassen sich ausschließen.

### KD-11: Entwurfs-PR nach dem Pilot (Owner, 2026-11-10)
Nach dem Pilot Englisch: WIP-Commit, Push und ein PR als Entwurf (draft). Die übrigen Fächer kommen als weitere
Commits in denselben PR. Vor dem Merge wird zusammengefasst (AGENTS.md).

### KD-12: Allein stehende Bausteine in der Stufen-Ansicht (Owner, 2026-11-10)
Der Owner kann in der Stufen-Ansicht nicht erkennen, welche Bausteine nicht eingeordnet sind; ohne das kann er
Englisch und die Methode nicht beurteilen. Daher: Über dem Raster ein Satz mit Zahl und Links („5 Bausteine stehen
allein: …“, sonst „Jeder Baustein ist in die Kette eingeordnet.“); am Baustein ein Etikett „steht allein“
(gestrichelter Rand, fett, ohne Farbe). „Allein“ = keine Voraussetzung und nichts baut darauf auf. Erst Englisch
fertig machen, dann weitere Fächer (Owner).

### KD-13: Englisch – alle fünf allein stehenden Bausteine eingeordnet (Owner, 2026-11-10)
Vorgehen: in beide Richtungen suchen (was braucht er, was baut auf ihm auf), Bündel in den Lehrplänen, sonst
Herleitung. Neuer Baustein `sprachvergleich` (Sprachvergleich Deutsch–Englisch, 9-10) hinter `phrasal-verbs` und
`false-friends` (Owner). Ergebnis: 31 Wurzeln, 0 allein, 4 Teilnetze (Bericht 6.8).

### KD-14: Übrige 18 Fächer durch Teilagenten nach dem Muster Englisch (Owner, 2026-11-10)
Je Fach ein Teilagent in einem eigenen Worktree (Isolation, damit Tests nicht über halbe Dateien anderer Fächer
stolpern). Er ändert nur `map/<fach>.yaml` und `.vibe/research-<fach>.md`, nach Skill `map-research` (vier Schritte),
mit `# requires`-Zeilen, prüft (keine Kreise, keine späte Richtstufe, keine indirekte Kante, `npm test`) und
committet im Worktree. Neue Bausteine fügt er nicht ein; eine Lücke im Modell schlägt er im Bericht vor. Ids,
`gradeBand`, `status` bleiben. Ich prüfe jedes Ergebnis (Diff, Zahlen, Stichproben) und übernehme es per
Cherry-Pick, ein Commit je Fach. Drei Agenten gleichzeitig. Bericht an den Owner am Ende.

### KD-15: Ergebnis aller Fächer (2026-11-10)
Alle 19 Karten überarbeitet; je Fach ein Commit mit Karte und Bericht (`.vibe/research-<fach>.md`; Physik, Musik,
Chemie, Mathematik neu angelegt). Wurzeln vorher 290, nachher 227. Allein stehend vorher 59,
nachher 1. Teilnetze vorher 119, nachher 29. Kopfzeile der Karten: „Neue und geänderte Kanten sind am Baustein
begründet …, die übrigen über die Fundstellen“. Vorschläge für neue Bausteine stehen in den Berichten, keiner ist
eingefügt (außer `sprachvergleich` in Englisch, Owner).

### KD-16: Sieben neue Bausteine aus den Vorschlägen (Owner, 2026-11-11)
Aufgenommen werden die gut belegten Vorschläge (KMK oder zwei von drei Ländern): Spanisch `wochentage-und-monate`
und `sprachvergleich`, Mathematik `geometrische-grundbegriffe`, Sport `erste-schwimmart`, Französisch
`nebensatz-que`, Geschichte `herrschaftsformen` und `was-ist-eine-revolution`. Je Fach ein Teilagent im eigenen
Worktree: Richtstufe nach Skill auszählen, Quellen-Kommentar, Kanten mit `# requires`, indirekt gewordene Kanten
entfernen, Bericht ergänzen; ein Commit je Fach. Die übrigen Vorschläge (4 mit offenen Fragen, 3 schwach belegt)
bleiben offene Punkte in den Berichten.

### KD-17: Ansicht nach Klasse und Kette (Variante B) und ohne Anzahlen (Owner, 2026-11-11)
Die Stufe allein hatte kaum Bedeutung (sagt nichts über Alter; ein später Baustein ohne Voraussetzung stand in
Stufe 1). Neu: Die Zeilen gehen nach Richtstufe, darin nach Schritten der Kette; ein Baustein steht einen Schritt
unter seiner tiefsten Voraussetzung aus derselben Richtstufe. Bedeutung: Alles im selben Schritt ist voneinander
unabhängig; alles darüber kommt vorher. `lib/map.js`: `places` ({ band, step }) und `steps` (Zeilen über alle
Richtstufen); `byStep` und `stepRows` tragen `band`, `bandStep`. Eine (verbotene) Voraussetzung mit späterer
Richtstufe verschiebt nichts. Die Ansicht zeigt keine Anzahlen mehr (Zeilen, Abdeckung je Strang, Filter); das
Etikett der Richtstufe am Baustein entfällt, weil die Zeile sie nennt. Begriff „Stufe“ → „Schritt“ (Glossar /map/,
Hilfe, Seite des Bausteins: „Klasse 7/8 · Schritt 2“). Prototyp: Artefakt „Lernlandkarte nach Klasse und Kette“.
Autonom bis zum Merge (Owner, 2026-11-11). Offen: Begriff `term-step` im Glossar von lernapps/docs anpassen.

### KD-09: Richtstufe als Etikett in der Stufen-Ansicht (Owner, 2026-11-10)
In `/map/<fach>/c/` bekommt jeder Baustein ein kleines Etikett mit seiner Richtstufe („5–6“, „7–8“, „9–10“), ohne
Farbe. So sieht man sofort, wenn ein später Baustein in Stufe 1 steht. Kein Filter. Eigener Commit auf
`feat/map-chains` (gleicher PR), vor dem Pilot Englisch. Nur Anzeige: `gradeBand` steht schon im Modell und in
`stepsData`; kein neues Feld, kein Vertrag geändert. Test für die Seite ergänzen.

### Tasks
- [x] Owner-Wunsch Richtstufe in der Stufen-Ansicht aufgenommen (KD-09)
- [x] Skill `map-research` ergänzen (KD-03, KD-04): Fachdidaktik nur für requires; Stufenregel für Anbindung;
      Kommentarform `# requires …` – eigener Commit vor dem ersten Fach
- [x] Auftragstext für die Teilagenten festlegen (KD-06, Schritt 1–2)
- [x] Code-Aufgaben je Fach anlegen (siehe Code)
- [x] Owner bestätigt den Plan

### Completed
*None yet*

## Code
### Entrance Criteria
- Plan je Fach (Reihenfolge, Quellen, Vorgehen bei Wurzeln) ist vom Owner bestätigt.

### Tasks
- [x] Richtstufe als Etikett in der Stufen-Ansicht (KD-09, eigener Commit): Text „Klasse 5/6“ wie auf den anderen Kartenseiten (Filter `band`), Rand ohne Farbe; Test in map.e2e
- [x] Skill `map-research` ergänzt (Commit)
- [x] Englisch (Pilot): 48 Kanten neu, 11 weg; Wurzeln 60 → 34, allein 23 → 5, Teilnetze 32 → 9; Bericht
      `.vibe/research-englisch.md` Abschnitt 6 – **Halt beim Owner**
- [x] Allein stehende Bausteine in der Stufen-Ansicht sichtbar (KD-12)
- [x] Englisch mit dem Owner fertig machen (KD-13)
- [x] Spanisch: Wurzeln 31 → 20, allein 19 → 1, Teilnetze 24 → 5 (Teilagent, geprüft, übernommen)
- [x] Deutsch: Wurzeln 29 → 27, allein 5 → 0, Teilnetze 9 → 2 (Teilagent, geprüft, übernommen)
- [x] Kunst: Wurzeln 23 → 22, allein 4 → 0, Teilnetze 8 → 1 (Teilagent, geprüft, übernommen)
- [x] Sport: Wurzeln 23 → 21, allein 0, Teilnetze 10 → 2 (Teilagent, geprüft, übernommen)
- [x] Politik-Wirtschaft: Wurzeln 22 → 13, allein 4 → 0, Teilnetze 10 → 1 (Teilagent, geprüft, übernommen)
- [x] Geschichte (KD-08): Kanten 259 → 249, 25 entfernt (13 nur Zeit), Wurzeln 1 → 3, Stufen 58 → 49 (Teilagent, geprüft, übernommen)
- [x] Ethik: Wurzeln 13 → 12, Teilnetze 2 → 1 (Teilagent, geprüft, übernommen)
- [x] Katholische Religion: Wurzeln 13 → 12, allein 2 → 0, Teilnetze 3 → 1 (Teilagent, geprüft, übernommen)
- [x] Erdkunde: Wurzeln 11 → 10, Teilnetze 3 → 2 (Teilagent, geprüft, übernommen)
- [x] Evangelische Religion: Wurzeln 11 → 10, Teilnetze 2 → 1 (Teilagent, geprüft, übernommen)
- [x] Latein: Wurzeln 10 → 9, allein 2 → 0, Teilnetze 4 → 1 (Teilagent, geprüft, übernommen)
- [x] Biologie: Wurzeln 9 → 8, Teilnetze 2 → 1 (Teilagent, geprüft, übernommen)
- [x] Physik: Wurzeln 9 → 8 (Teilagent, geprüft, übernommen)
- [x] Musik: Teilnetze 2 → 1 (Teilagent, geprüft, übernommen)
- [x] Chemie: Wurzeln 5 → 3 (Teilagent, geprüft, übernommen)
- [x] Französisch: Teilnetze 2 → 1 (Teilagent, geprüft, übernommen)
- [x] Mathematik: Wurzeln 5 → 3 (Teilagent, geprüft, übernommen)
- [x] Informatik: Teilnetze 2 → 1 (Teilagent, geprüft, übernommen)
- [x] Neue Bausteine (KD-16): alle 7 aufgenommen. Abweichungen: Spanisch `datum` enger gefasst (Name, iCan;
      id und Richtstufe gleich), `sprachvergleich` Spanisch nach Auszählung 7-8; Französisch
      `indirekte-rede-praesens` 5-6 → 7-8 (Klumpen-Regel: sonst > Hälfte von `grammatik` in 5-6). Jetzt steht in
      keiner Karte mehr ein Baustein allein.
- [x] Ansicht nach Klasse und Kette (KD-17)
- [x] Bedarf für Stufen-Feld bewertet (KD-05): nach der Arbeit steht in allen 19 Fächern nur noch 1 Baustein allein
      (Spanisch `feste-und-braeuche`, Lücke im Modell: `wochentage-und-monate`). Empfehlung: kein Feld – Owner fragen

### Completed
*None yet*

## Commit
### Entrance Criteria
- Alle geplanten Fächer überarbeitet, Berichte geschrieben, `npm test` und `npm run build` grün.

### Tasks
- [x] Aufräumen: keine Debug-Ausgaben, keine TODO/FIXME im Diff; Worktrees der Teilagenten entfernt
- [x] Doku: Vertrag (Ort eines Bausteins), Skill `map-research`, Berichte je Fach
- [x] Branch zu einem Commit zusammengefasst und auf `main` gesetzt (AGENTS.md); Tests grün (112)
- [x] PR #235 bereit, CI grün, Squash-Merge (Owner: autonom bis zum Merge, 2026-11-11)

### Completed
- [x] Alles oben

---
*This plan is maintained by the LLM. Tool responses provide guidance on which section to focus on and what tasks to work on.*
