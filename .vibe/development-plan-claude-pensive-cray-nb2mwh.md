# Development Plan: Grundwortschatz neben der Karte (claude/pensive-cray-nb2mwh branch)

*Begonnen am 2026-11-08, Workflow [epcc](https://codemcp.github.io/workflows/workflows/epcc)*

## Goal

Ein Grundwortschatz je Fremdsprache neben der Lernlandkarte, unabhängig von Lehrwerken: welche Wörter zu welchem
Wortschatz-Baustein gehören, mit Bedeutung und GER-Stufe. Er dient Creatorn beim Erstellen als Orientierung (kein
Wörterbuch, keine Beispielsätze). Teil des Features „Fremdsprachen im Explainer“; dessen Plan und Entscheidungen
stehen in lernapps/app-templates, `.vibe/development-plan-claude-pensive-cray-nb2mwh.md` (KD-02, KD-05, KD-08,
KD-14, Entwurf D6).

## Key Decisions

- KD-01 (Owner, app-templates KD-02/KD-05): Grundwortschatz liegt in lernapps/apps neben der Karte; nur Orientierung,
  ohne Beispiele.
- KD-02 (Owner, app-templates KD-08): Wir beginnen mit Französisch.
- KD-03 (Owner, app-templates KD-14): Quelle ist FLELex / Beacco (TreeTagger), mit beiden Zitaten.
- KD-04 (Owner, 2026-11-08): lernapps.net ist nicht kommerziell. FLELex steht unter CC BY-NC-SA 4.0; die abgeleiteten
  Wortlisten stehen deshalb ebenfalls unter CC BY-NC-SA 4.0, nicht unter der MIT-Lizenz des Repos.

- KD-05 (Owner, 2026-11-08): Zwei Ebenen: (1) der Grundwortschatz des Fachs mit Umfang und Reihenfolge, (2) was
  in einem Baustein sinnvoll eingeführt wird. Beides muss nicht deckungsgleich sein; Bausteine bauen fachweit auf
  dem Wortschatz auf.
- KD-06 (Owner, 2026-11-08): Keine Zuordnung der Wörter zu Richtstufen (erste oder zweite Fremdsprache macht sie
  unmöglich). Die Reihenfolge sind die GER-Stufen A1, A2 (…) aus FLELex; beim Zusammenstellen einer Lektion wählt
  der Creator aus den passenden Bereichen.
- KD-07 (Owner, 2026-11-08): Zwei Grundsätze werden festgehalten: Die Wörter werden nicht zu früh zu komplex, und
  die Einheiten bauen auf dem Alltag von Kindern auf.
- KD-08 (Owner, 2026-11-08): Die Wortlisten haben keine Bedeutungen, auch die Auswahl je Baustein nicht. Die
  Bedeutung gibt die Seite der App, die den Baustein übt.
- KD-09 (Owner, 2026-11-08): Keine Auswahl je Baustein im Katalog: welche Wörter eine Seite braucht, folgt aus ihren
  Übungen. Der Katalog hält nur den Grundwortschatz des Fachs (Umfang, Reihenfolge nach Stufe).
- KD-10 (Owner, 2026-11-08): Ein Skill beschreibt, wie man für andere Sprachen einen Grundwortschatz erstellt und
  wie Apps ihn in Übungen anwenden: `map-vocabulary` in diesem Repo; die Anwendung verweist auf die Referenzen in
  lernapps/tooling.

## Notes

### Quelle

- Datei des Owners: `FLELex_TreeTagger_Beacco.tsv`, 14.236 Lemmata, Spalten `word, tag, freq_A1 … freq_C2,
  freq_total, level`. Stufen: A1 1247, A2 679, B1 1753, B2 5088, C1 3155, C2 2314.
- Zitate:
  - François, T., Gala, N., Watrin, P. & Fairon, C. (2014). FLELex: a graded lexical resource for French foreign
    learners. LREC 2014, Reykjavik.
  - Pintard, A. & François, T. (2020). Combining expert knowledge with frequency information to infer CEFR levels
    for words. READI 2020, S. 85–92.
- Download: https://cental.uclouvain.be/cefrlex/flelex/download/ (aus dieser Umgebung nicht erreichbar: der Server
  bricht die Verbindung ab; der Owner hat die Datei hochgeladen).
- FLELex hat keine Themen: die Zuordnung Wort → Baustein ist redaktionell (die Stufe kommt aus FLELex).

### Katalog heute

- `lib/map.js` lädt `map/<subject>.yaml` und `map/<subject>/curricula/*.yaml`, prüft mit zod (`schemas/map.js`) und
  wirft bei jedem Fehler (Build schlägt fehl). `scripts/schema.mjs` erzeugt die JSON-Schemas.
- Seiten: `src/map-competency.njk` (ein Baustein), `src/map-json.njk` (Karte als JSON).
- Französisch, Strang `wortschatz`: 35 Bausteine, 17 davon Richtstufe 5-6.

## Explore

### Tasks

### Completed

- [x] Created development plan file
- [x] Laden und Prüfen der Karte gelesen (`lib/map.js`, `schemas/map.js`), Seiten des Bausteins und JSON
- [x] FLELex-Datei gelesen: Spalten, Stufen

## Plan

### Phase Entrance Criteria

- Quelle, Lizenz und Ablage sind entschieden (KD-01 bis KD-04).

### Design (Entwurf 2, nach KD-05 bis KD-07)

- **Ebene 1, Grundwortschatz des Fachs**: `map/franzoesisch/vocabulary/words.yaml`, erzeugt von
  `scripts/vocabulary.mjs` aus der FLELex-Datei: alle Wörter der Stufen A1 und A2 mit Wortart und Stufe
  (`{ word, pos, level }`), sortiert nach Stufe. Redaktionelle Korrekturen in `corrections.yaml` (fehlende Wörter wie
  *œuf*, andere Stufe wie *petit-déjeuner*), jede mit Grund; das Skript wendet sie an. Keine Richtstufe (KD-06).
- **Keine Auswahl je Baustein** (KD-09): die Wörter einer Seite folgen aus ihren Übungen.
- **Lizenz**: `map/franzoesisch/vocabulary/LICENSE.md`, CC BY-NC-SA 4.0, Quelle und beide Zitate.
- **Grundsätze (KD-07)** stehen an drei Stellen: im Vertrag `docs/learning-map-contract.md` (neuer Abschnitt
  „Grundwortschatz“), in `LICENSE.md`/Kopf der Dateien kurz, und als Hinweis auf der Seite eines Bausteins. Für die
  Creator-Anleitung (lernapps/tooling, nicht in dieser Session) ein Folgeauftrag.
- **Seiten**: eine Seite „Grundwortschatz“ je Fach (`/apps/map/<subject>/grundwortschatz/`; nicht `wortschatz/`, das ist die Adresse des Strangs: Wort, Wortart,
  Stufe, Quelle, Lizenz, Grundsätze); die Seite eines Wortschatz-Bausteins verlinkt sie; die JSON der Karte enthält
  die Liste.
- **Umfang jetzt**: Grundwortschatz Französisch, A1 und A2, mit Korrekturen.

### Tasks

- [ ] Owner bestätigt den Entwurf

### Completed

## Code

### Phase Entrance Criteria

- Entwurf vom Owner bestätigt.

### Tasks

### Completed

- [x] Schemas `Vocabulary`, `VocabularySource` (`schemas/map.js`), JSON-Schema `vocabulary.v1.schema.json`
- [x] `scripts/vocabulary.mjs`: liest ein CEFRLex-Lexikon (Spalte `level` oder `freq_A1 …`), wendet `source.yaml` an,
      schreibt `words.yaml`
- [x] `map/franzoesisch/vocabulary/`: `source.yaml` (FLELex/Beacco, A1/A2, 4 Korrekturen: trousse, stylo,
      petit-déjeuner, goûter), `words.yaml` (1930 Wörter: A1 1251, A2 679), `LICENSE.md` (CC BY-NC-SA 4.0)
- [x] `lib/map.js` lädt und prüft den Grundwortschatz gegen `source.yaml`
- [x] Seite `/apps/map/<subject>/grundwortschatz/` (de/en), Link von der Fachkarte und von den Bausteinen des Strangs
      `wortschatz`; JSON der Karte mit `vocabulary`; Adresse `grundwortschatz` für Stränge gesperrt
- [x] Vertrag `docs/learning-map-contract.md`, Abschnitt 6
- [x] Skill `map-vocabulary` (`.agents/skills/`, verlinkt in `.claude/skills/`), Verweis aus `map-research`
- [x] Tests `test/vocabulary.test.mjs`; `npm run build`, `npm test` (97 grün, 1 übersprungen), `npm run check` grün
- [x] Owner-Wunsch 2026-11-08: Skill, wie man für andere Sprachen einen Wortschatz erstellt und wie er in Übungen
      angewendet wird (KD-10)
- Notiz: FLELex schreibt oe statt œ (oeuf, soeur); *œuf* fehlt also nicht.

## Commit

### Completed

- [x] Aufräumen geprüft: keine Debug-Ausgaben, keine TODO/FIXME (die Ausgabe eines Skripts ist gewollt)
- [x] Doku aktuell (README, arc42, Vertrag bzw. Skills)
- [x] Pull Request angelegt (Owner, 2026-11-08); Zusammenfassen beim Merge mit „Squash and merge“ (Force-Push war in
      der Session nicht erlaubt)

---
*This plan is maintained by the LLM. Tool responses provide guidance on which section to focus on and what tasks to work on.*
