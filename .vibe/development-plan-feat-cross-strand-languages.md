# Development Plan: apps (feat/cross-strand-languages branch)

*Generated on 2026-11-09 by Vibe Feature MCP*
*Workflow: [epcc](https://codemcp.github.io/workflows/workflows/epcc)*

## Goal

lernapps/apps#226: Apps für Fremdsprachen dürfen über Stränge hinweg üben; die Methode innerhalb eines Strangs bleibt
gleich. Heute gilt „eine App, ein Strang“ (KD-07 in `development-plan-feat-learning-map.md`,
`dec-one-app-one-strand` in lernapps/docs). Eine Einheit wie „Essen“ braucht aber Wörter, Grammatik und Texte.

Die Optionen A, B und C im Issue sind ein Vorschlag. Der Owner entscheidet.

## Key Decisions

### KD-01: Das Fach sagt, worauf ein Explainer sich konzentriert (2026-11-09, Owner)
- Feld im Fach-Modell `map/<fach>.yaml`: `explainerFocus: strand | competency` (Strang | Baustein; englisch im
  Vertrag nach `dec-english-contracts`).
- `strand` (Standard): eine App, ein Strang, wie heute. `competency`: eine App darf Bausteine mehrerer Stränge des
  Fachs üben; die Stränge illustrieren nur.
- Gesetzt auf `competency`: Englisch, Französisch, Spanisch, Latein und Deutsch (KD-02).
- Kein Strang an der Seite; der Strang einer Seite ergibt sich aus ihren Bausteinen (Runde 2, Owner).
- Begründung: In Sprachen sind Stränge eng verflochten (Daten unter Notes), in Naturwissenschaften und Geschichte
  trennend.

### KD-02: `competency` für die vier Fremdsprachen und Deutsch (2026-11-09, Owner)
Alle anderen Fächer bleiben `strand`, bis jemand es für ein Fach begründet; dann ändert ein PR an der Fach-Datei es.

### KD-03: Voraussetzungen in der Reihenfolge der App (2026-11-09, Owner)
- Jede direkte Voraussetzung (`requires`) eines geübten Bausteins ist auf einer früheren Seite geübt oder wiederholt.
  Wiederholte Bausteine werden nicht weiter verfolgt.
- Fehler in der Listung nur in Fächern mit `explainerFocus: competency`; sonst Warnung (wie heute
  `prerequisites-linked`). `lernapps check` warnt in beiden Fällen.

### KD-03a: Lücke und Einstieg; Baustein-Fokus ist strenger (2026-11-09, Owner)
- Die Prüfung unterscheidet je direkter Voraussetzung: früher geübt oder wiederholt (in Ordnung), später geübt
  (Reihenfolge falsch), **Lücke** (fehlt, aber ein Vorfahr ist in der App), **Einstieg** (fehlt, kein Vorfahr in der
  App; `recap` empfohlen). Siehe Notes, „Kette der Voraussetzungen“.
- Baustein-Fokus: Reihenfolge falsch und Lücke sind Fehler in der Listung, Warnung in `lernapps check`; Einstieg ohne
  `recap` ist eine Warnung. Strang-Fokus: alles nur Warnung (wie KD-03).
- Es ist eine Prüfung für Ersteller (`lernapps check`, Listung). Ein Hinweis für Lernende in der App kommt später mit
  lernapps/app-templates#130.

### KD-04: „Referenziert“ heißt: eine Seite mit `recap` oder ein Link im Text (2026-11-09, Owner; revidiert)
Erst „nur recap“; im Plan revidiert (P1): Der Link im Text auf die Seite des Bausteins auf der Karte zählt weiter, wie
heute bei `prerequisites-linked`, weil die Prüfung ihn schon kann.

### KD-05: Apps ohne Seiten dürfen auch mischen (2026-11-09, Owner)
In einem Fach mit `explainerFocus: competency` darf die Liste einer App ohne Seiten (quiz, interactive) Bausteine
mehrerer Stränge haben. Geprüft wird nur, ob jede Voraussetzung in der Liste ist; eine Reihenfolge gibt es nicht.
Der Name `explainerFocus` bleibt trotzdem (Owner).

### KD-06: Eine App nennt `strand` oder `subject`, genau eins (2026-11-09, Owner)
- `strand` ist immer ein Strang (`<fach>/<strang>`) oder `none`, wie heute. Neu: `subject: <fach>` für eine App, die
  Bausteine mehrerer Stränge übt (Einheiten-App). Ein Wert mit zwei Bedeutungen („strand: <fach>“) ist unverständlich
  (Owner); ein umbenanntes Feld `focus` hätte alle Explainer umgestellt.
- Schema: im Explainer-Format 2 `oneOf: [required strand, required subject]`; im Eintrag (Zod) beide optional, nicht
  beide zugleich. Bestehende Apps ändern nichts.
- Dass `subject` nur in Fächern mit `explainerFocus: competency` steht, kann das Schema der App nicht prüfen (es kennt
  die Karte nicht): `lernapps check` warnt, Listung und Build des Katalogs geben einen Fehler.

### KD-07: Eine Seite übt Bausteine nur eines Strangs (2026-11-09, Owner: „je Strang eine Seite“)
So bleibt die Methode je Strang gleich (Option B des Issues). Annahme: bei `competency` Fehler in der Listung und
Warnung in `lernapps check`, wie die Reihenfolge (KD-03a); bei `strand` ist es durch „eine App, ein Strang“ ohnehin
erfüllt.

### KD-08: Pull Requests je Repo (2026-11-09, Owner)
Ein PR je Repo, in der Reihenfolge apps → app-templates → tooling → docs; Branch vorher squashen.

### KD-09: `subject` im Eintrag ist die Fach-Id der Karte (2026-11-09, Owner)
Im Eintrag gab es `subject` schon als Anzeigename ({ de: Physik, en: Physics }). Der Owner: Wir haben noch alle
Einträge in der Hand, also wird es die Id des Fachs auf der Karte (`subject: physik`); den Namen zeigt der Katalog aus
der Karte. Kein neues Schema (entry.v1 bleibt), alle 11 Einträge umgestellt. Eine App ohne Seiten wird zur
Einheiten-App, wenn sie `competencies` ohne `strand` nennt. Jedes gelistete Fach braucht eine Karte.

## Notes

### Einordnung in Plattform-Design und Architektur (Skill pdt, lernapps/docs)

- **pdt42:** Der Dienst `s-gap-finding` („Seeing which app is still missing“, für `e-creators`) nutzt die Karte. Die
  Annahme `a-gaps-guide-creators` (MVP `mvp-first-draft`) prüft, ob Ersteller für eine Lücke bauen. Bei Sprachen sieht
  die Karte Grammatik heute nicht als geübt, wenn eine Einheit sie mitübt. Die Lücken wären also falsch. Option B oder
  C stärkt den Dienst. Neue Rollen oder Transaktionen braucht es nicht.
- **arc42:**
  - Entscheidung `dec-one-app-one-strand` sagt ausdrücklich: „Rejected: several strands per app“. B oder C ändert
    diese Entscheidung. Sie bekommt eine Ausnahme oder eine neue Entscheidung ersetzt sie.
  - Glossar `term-strand`: „an app covers one strand“. Muss angepasst werden.
  - Bei C kommen zwei Begriffe ins Glossar (Strang-App, Einheiten-App).
  - Schnittstelle `if-learning-map` (bb-catalog) und `if-archetypes` (Explainer-Format 2, ein `strand` je App) sind
    betroffen.
  - Qualitätsziele: `qg-understandable`, `qg-learnable-for-creators`. Mehr Regeln machen es schwerer zu lernen.
- Änderungen an pdt42/arc42 gehören nach lernapps/docs, per Pull Request (KD-14 der Lernlandkarte). Diese Sitzung hat
  dort nur Lesezugriff.

### Was im Code betroffen ist (lernapps/apps)

- `lib/map.js`, `checkApp`: eine Kompetenz eines anderen Strangs ist ein Hinweis; die Listung macht daraus einen
  Fehler (`entry-learning-map`).
- `docs/learning-map-contract.md`: `strand` je App, `competencies` je Seite.
- Sprachfächer auf der Karte: Englisch, Französisch, Spanisch (grammatik, wortschatz, aussprache, landeskunde, texte),
  Latein (wortschatz, formenlehre, satzlehre, texte, antike-kultur). Deutsch ist ein Sprachfach, aber keine
  Fremdsprache.
- Andere Repos (eigene Branches): lernapps/tooling (`competencies-on-map`, `prerequisites-linked`, Leitfaden
  `foreign-languages.md`), lernapps/app-templates (Explainer-Format 2, KD-16 dort).

### Fragen an den Owner

1. A, B oder C? Vorschlag im Issue: C in drei Schritten.
2. Umfang dieses Branches: nur Schritt 1 (Regel B in lernapps/apps)? Die Vokabel-App (Schritt 2) ist eine eigene App
   und kein Teil des Katalogs.
3. Welche Fächer dürfen über Stränge üben, und wie wird das markiert (Feld in `map/<subject>.yaml` oder feste Liste)?
4. Wie nennt eine App unter B ihre Stränge? `strand` bleibt der Haupt-Strang, oder `strand` wird zu einer Liste, oder
   nur das Fach?

### Antworten des Owners (Runde 1, 2026-11-09)

- Option: noch offen. Der Owner fragt, was das für das Schema bedeutet: Strang optional an der App und an der Seite?
  Pro Fach festlegen, ob der Strang je App oder je Seite gilt?
- Markierung der Fächer: ein Feld in `map/<fach>.yaml`.
- Wo die App ihre Stränge nennt: „an der Seite?“ (Rückfrage).
- Umfang: alle Repos (apps, tooling, app-templates, docs) in dieser Sitzung.

### Schema-Entwurf (zur Antwort auf Runde 1, noch nicht entschieden)

- `map/<fach>.yaml` bekommt ein Feld, z. B. `strandScope: app | page` (Standard `app`). Sprachen: `page`.
- `app.yaml` (Explainer-Format 2): `strand` bleibt Pflicht. Neu erlaubt: nur das Fach (`franzoesisch`), aber nur in
  einem Fach mit `strandScope: page`. Weiter erlaubt: `<fach>/<strang>` und `none`.
- Seite: kein neues Feld. Der Strang einer Seite ergibt sich aus ihren Kompetenzen (Ids sind im Fach eindeutig). Regel:
  alle Kompetenzen einer Seite gehören zu einem Strang.
- Ein optionales `strand` an der Seite wäre doppelt (berechenbar) und könnte widersprechen. Abgeraten.
- „Optional an der App“ hebt KD-11 auf (jede App entscheidet ausdrücklich). Abgeraten; `none` bleibt.
- Option C ergibt sich ohne neue Felder: Strang-App = `strand: <fach>/<strang>`, Einheiten-App = `strand: <fach>`.
- Offen: Apps ohne Seiten (quiz, interactive) haben eine Liste je App. In einem `page`-Fach dürfte ihre Liste mehrere
  Stränge haben; die Regel „eine Methode je Strang“ lässt sich dort nicht prüfen.

### Antworten des Owners (Runde 2, 2026-11-09)

- Kein Strang an der Seite: gut.
- `strandScope` im Fach wirkt redundant.
- In übergreifenden Apps ist die Reihenfolge noch wichtiger: Alles, was Voraussetzung ist, soll in der App gelehrt
  oder referenziert werden. Frage: Wie gehen wir damit um?

### Entwurf Runde 2 (noch nicht entschieden)

- Ohne `strandScope`: `strand: <fach>` ist in jedem Fach erlaubt. Die App sagt damit selbst, dass sie übergreifend
  ist. Gegen zu große Apps (Grund von KD-07) hilft ein Hinweis in `lernapps check`, kein Verbot.
- `requires` über Stränge (Zahlen aus den Karten): Englisch 43 von 225, Französisch 67 von 249, Spanisch 42 von 199,
  Latein 58 von 263, Mathematik 40 von 203. Also ähnlich häufig; in einer Einheiten-App liegen aber mehr davon in der
  App selbst.
- Regel `prerequisites-in-order` (ersetzt `prerequisites-linked`): Für jede geübte Kompetenz ist jede direkte
  Voraussetzung (`requires`) auf einer **früheren** Seite geübt oder wiederholt (`recap`). Reihenfolge aus
  `lernapps-pages.json`. Nur direkte Voraussetzungen: was wiederholt wird, wird nicht weiter verfolgt.
- Gilt für alle Explainer, nicht nur übergreifende. Apps ohne Seiten: nur Vollständigkeit, keine Reihenfolge.
- Offen: Stärke (Hinweis, Warnung, Fehler in der Listung); ob „referenziert“ nur `recap` heißt oder auch ein Link.

### Antworten des Owners (Runde 3, 2026-11-09)

- In Fremdsprachen gibt es oft das Muster: Eine Verbgruppe muss bekannt sein, bevor man ein Grammatikthema erschließt.
- Das Fach entscheidet: In Sprachen sind Stränge eher illustrativ, in den Naturwissenschaften trennend.
  Geisteswissenschaften: unklar.

### Daten: welche Stränge aufeinander aufbauen (`requires` über Stränge, häufigste Paare)

- Französisch: grammatik → wortschatz 25, wortschatz → texte 19, wortschatz → landeskunde 9, grammatik → texte 7.
- Englisch: grammatik → texte 12, wortschatz → texte 12, grammatik → aussprache 7.
- Latein: formenlehre → satzlehre 38 (die Formen kommen vor den Sätzen), dann je 5.
- Geschichte (Stränge = Epochen): nur entlang der Zeit, z. B. revolutionen → weltkrieg-weimar 8. Trennend.
- Physik: wenige, je 1–2. Trennend.

### Entwurf Runde 3 (noch nicht entschieden)

- Das Fach-Modell sagt, welche Art Stränge es hat. Das ist eine Eigenschaft des Fachs, keine Wiederholung der App:
  z. B. `crossStrandApps: true` in `map/<fach>.yaml`, Standard `false`.
- Gesetzt für Englisch, Französisch, Spanisch, Latein. Geschichte bleibt trennend (Epochen). Alle anderen bleiben, wie
  sie sind, bis jemand es für ein Fach begründet; dann ändert ein PR an der Fach-Datei es, ohne Code.
- `strand: <fach>` ist nur in solchen Fächern erlaubt; sonst Fehler.
- Der Skill `map-research` fragt künftig je Fach: Trennen die Stränge, oder illustrieren sie?
- Die Regel zur Reihenfolge (Runde 2) bleibt; sie nutzt die `requires` der Karte. Das Muster „Verbgruppe vor
  Grammatikthema“ muss also in der Karte stehen.

### Vokabel-Lern-Apps (Owner hadert, 2026-11-09)

- Befund: Der Strang `franzoesisch/wortschatz` hat 35 Bausteine. Sie sind Themen mit einem „Ich kann …“ zum Sprechen
  („Ich kann meine Familie vorstellen“), keine Wortlisten. Der Grundwortschatz liegt neben der Karte (#224).
- Eine Vokabel-App passt ins Modell als Strang-App: `strand: franzoesisch/wortschatz`, Liste der Themen. `explainerFocus:
  competency` erlaubt das Mischen, erzwingt es aber nicht.
- `fitness.storage: device` erlaubt Wiederholung mit Speicher auf dem Gerät.
- Lücke 1: Eine Vokabel-App übt die Wörter eines Themas, nicht das ganze „Ich kann …“. Zählt sie trotzdem als geübt?
- Lücke 2: `topics` einer App ohne Seiten haben keine Bausteine. Die Karte kann nicht ins passende Thema der
  Vokabel-App verlinken. Vorschlag: optionales `competencies` an einem Topic im Eintrag.
- Lücke 3: Dürfen Einheiten-Apps Wörter selbst üben, oder nur wiederholen (`recap`) und so auf die Vokabel-App
  verweisen? Das Issue (Schritt 3) will Letzteres, damit die Methode je Strang gleich bleibt.

### Kette der Voraussetzungen in Explainern (Owner, 2026-11-09)

Owner: Innerhalb eines Explainers sind alle Voraussetzungen der Kette erfüllt. Strang-Fokus: ein `recap` ist zulässig.
Baustein-Fokus: Hinweis, wenn zwischendrin etwas fehlt; beim ersten Baustein fehlt logischerweise etwas, dort hilft
ein `recap`. Frage: Lässt sich das modellieren? Karte zusätzlich als vertikaler Baum der Abhängigkeiten?

Modell-Entwurf: Für jeden geübten Baustein auf Seite i und jede direkte Voraussetzung r:
1. r auf einer früheren Seite geübt oder wiederholt: in Ordnung.
2. r erst auf einer späteren Seite geübt: Reihenfolge falsch.
3. r fehlt, und ein Vorfahr von r wird in der App geübt: **Lücke** (r liegt zwischen zwei Bausteinen der App).
4. r fehlt, und kein Vorfahr von r ist in der App: **Einstieg**; ein `recap` hilft.
Ein `recap` beendet die Kette. Nur direkte Voraussetzungen prüfen genügt; die Kette ergibt sich Schritt für Schritt.

Daten (Bausteine / ohne Voraussetzung / längste Kette / meiste Vorfahren eines Bausteins): Französisch 186/5/9/18,
Englisch 223/60/8/15, Latein 176/10/13/38, Deutsch 206/29/8/25, Mathematik 127/5/11/35, Physik 108/9/9/27.
Die Abhängigkeiten sind ein Netz ohne Kreise (gerichteter azyklischer Graph): 62 von 186 Bausteinen in Französisch
haben mehrere Voraussetzungen, z. B. adverb-steigerung ← adverb-bildung, adjektiv-steigerung ← beide ←
adjektiv-angleichung (Raute). Kreise verbietet der Lader schon heute (`cycles` in `lib/map.js`). Jedes Fach hat
Anfangs-Bausteine ohne Voraussetzung.

Offen: Ist „Hinweis“ eine Prüfung (`lernapps check`, Listung) oder ein Hinweis der Runtime an Lernende
(lernapps/app-templates#130)? Widerspricht das KD-03 (Fehler nur bei Baustein-Fokus)? Ansicht der Karte: siehe
Antwort an den Owner.

### Ansicht in Stufen (2026-11-09)

- Eigenes Issue lernapps/apps#227 (Owner: „mach mal eine“): a) Kette auf der Seite eines Bausteins, b) Zeilen nach
  Stufe im Raster. Nicht Teil dieses Branches.
- Prototyp für Französisch (privat): https://claude.ai/artifact/T7KWcUxAFm2sj6ESWnrpLj — Stränge als Spalten, Stufen
  als Zeilen, Kette eines Bausteins, Prüfung einer Beispiel-App „On fait les courses“ mit Lücke, Reihenfolge und
  Einstieg nach KD-03a.

## Explore
### Entrance Criteria
- Issue gelesen, Feature-Branch angelegt.

### Tasks
- [x] Issue #226 lesen
- [x] Einordnung mit Skill pdt (pdt42, arc42 in lernapps/docs)
- [x] Betroffene Stellen im Code finden
- [x] Optionen A, B, C mit dem Owner klären (KD-01 bis KD-05)

### Completed
- [x] Created development plan file

## Plan
### Entrance Criteria
- Der Owner hat zwischen A, B und C entschieden und die Fragen oben beantwortet.
- Die Entscheidung steht unter Key Decisions.

### Ausgelagert (2026-11-09, Owner)
- Ansicht in Stufen: lernapps/apps#227, eigene Session `session_016NmpwasChkZtGqeCTkGLiv`, Branch `feat/map-steps`.
- Lesbare Namen der Bausteine (`name: { de, en }`, Pflicht): eigene Session `session_016NmpwdMKCBs6HpYA6GtLvk`, Branch
  `feat/competency-names`, ohne Workflow. Beide berühren `map/*.yaml`; dieser Branch ändert dort nur die Kopfzeilen.

### Befunde für den Plan
- Kein Eintrag in `entries/` hat heute einen Strang in Sprachen oder Deutsch; die Explainer im Format 2 sind
  Mathematik, Physik, Chemie, Musik (alle `explainerFocus: strand`). Die strengere Prüfung bricht also keine Listung;
  bei `strand` gibt es nur Warnungen.
- Die Listung liest `lernapps-pages.json` mit den Seiten in der Reihenfolge der App: die Prüfung der Reihenfolge kann
  dort laufen, ohne neue Daten.
- `lernapps check` (tooling) liest die Karte als JSON von lernapps.net: `explainerFocus` muss in `/apps/map/<fach>.json`.
  Reihenfolge der Auslieferung: apps zuerst, dann tooling und app-templates.

### Umsetzung je Repo (Branch überall `feat/cross-strand-languages`)

**lernapps/apps**
1. `schemas/map.js`: Fach bekommt `explainerFocus: "strand" | "competency"`, optional, Standard `strand`; JSON-Schema neu
   (`npm run schema`).
2. `map/englisch|franzoesisch|spanisch|latein|deutsch.yaml`: `explainerFocus: competency` (nur Kopfzeile).
3. `schemas/entry.js`: neues optionales Feld `subject` (Fach-Id); nicht zusammen mit `strand`; `competencies` braucht
   `strand` oder `subject` (KD-06).
4. `lib/map.js`:
   - `loadMap` liest `explainerFocus`.
   - `checkApp`: `subject` nur bei `competency`, sonst Fehler; mit `subject` sind Bausteine aller Stränge des Fachs
     erlaubt; mit `strand` wie heute.
   - neu `checkPrerequisites(subject, pages)`: je Seite und direkter Voraussetzung die Fälle in Ordnung / Reihenfolge /
     Lücke / Einstieg (KD-03a); Apps ohne Seiten: nur Lücke (KD-05).
   - neu: eine Seite übt Bausteine nur eines Strangs (KD-07).
   - `coverage` und `_data/map.js`: eine App mit `subject` zählt im ganzen Fach; `lernapps-pages.json` hat dann
     `subject` statt `strand`.
5. `scripts/listing.mjs` (`entry-learning-map`): Fehler bei `competency` für Reihenfolge und Lücke, Warnung für
   Einstieg; bei `strand` alles Warnung.
6. `src/_data/map.js` und Seiten: Strang-Seite zeigt eine Einheiten-App als Balken in jedem Strang, den sie übt; JSON
   `/apps/map/<fach>.json` mit `explainerFocus`; `llms.njk` und Begriffe-Seite (`/apps/map/`) erklären den Fokus.
7. `docs/learning-map-contract.md`: Feld, Werte von `strand`, die Prüfung mit Beispiel.
8. Tests in `test/` für `checkApp`, `checkPrerequisites`, Listung, Schema.

**lernapps/app-templates**
9. `explainer.v2.schema.json`: `subject`, `oneOf` mit `strand` (KD-06); `schema.ts`: verständliche Meldung für
   `oneOf` („Nenne entweder strand oder subject“); `page-list.ts` schreibt `subject` in `lernapps-pages.json`; Tests.
   KD-16 dort (diese Frage) schließen.

**lernapps/tooling**
10. `check/explainer-map.ts`: `SubjectMap` mit `explainerFocus`; `readExplainer` liest `subject`.
11. `competencies-on-map`: `subject` nur bei `competency`; dann alle Stränge erlaubt; Seite in einem Strang (KD-07).
12. `prerequisites-linked` wird `prerequisites-in-order` (KD-03a, KD-04): Reihenfolge, Lücke, Einstieg; recap oder Link
    im Text zählen; Schwere je Fokus; Regel-Seite und Tests.
13. Leitfaden: `skills/content/lernapps-exercise-patterns/references/foreign-languages.md`, Skills
    `lernapps-explainer`, `lernapps-explainer-design`, `lernapps-listing`: Einheiten-App, Strang-App, Reihenfolge, recap
    am Einstieg.

**lernapps/docs**
14. arc42: neue Entscheidung `dec-explainer-focus` (ergänzt `dec-one-app-one-strand`, dort Verweis und „Rejected“
    anpassen); Glossar `term-strand` und neuer Begriff „Fokus eines Fachs“; Schnittstellen `if-learning-map`,
    `if-archetypes`, `if-guidance` erwähnen den Fokus. pdt42: keine Änderung nötig (`s-gap-finding` bleibt).

**lernapps/apps (Skill)**
15. `map-research`: je Fach die Frage „Trennen die Stränge, oder illustrieren sie?“ → `explainerFocus`.

### Offene Fragen an den Owner (Plan)
- P1: Ein Link im Text auf die Karte zählt heute bei `prerequisites-linked`. Nach KD-04 nur noch `recap` — auch bei
  Strang-Fokus? (Vorschlag: ja, eine Regel für alle; bei `strand` ist es ohnehin nur eine Warnung.)
- P2: Eine Seite übt nur Bausteine eines Strangs (Option B im Issue): bei `competency` Fehler in der Listung oder nur
  Warnung? (Vorschlag: Warnung; der Owner hat „ein Strang je Seite“ nicht ausdrücklich entschieden.)
- P3: Pull Requests je Repo, in der Reihenfolge apps → app-templates → tooling → docs, erst auf Wunsch des Owners.

### Tasks
- [x] Repos tooling, app-templates, docs mit Schreibzugriff anhängen und klonen
- [x] Betroffene Stellen in allen vier Repos finden
- [x] Umsetzung je Repo planen
- [x] Fragen P1–P3 mit dem Owner klären (KD-04 revidiert, KD-06, KD-07, KD-08)

### Completed
*None yet*

## Code
### Entrance Criteria
- Der Plan ist mit dem Owner abgestimmt (Regel, Datenformat, Checks, Doku, betroffene Repos).

### Tasks
- [x] apps: Schritte 1–8 und 15 (Schema, Karte, checkApp, checkPages, Listung, Seiten, Vertrag, Tests, Skill) und KD-09
- [x] app-templates: Schritt 9 (Sub-Agent, Branch `feat/cross-strand-languages`)
- [x] tooling: Schritte 10–13 (Sub-Agent) und KD-09 im Skill `lernapps-listing`
- [x] docs: Schritt 14 (Sub-Agent) und KD-09 in `dec-explainer-focus`; arc42 validiert ohne Befund
- [x] Ergebnisse der Sub-Agenten prüfen; Tests in allen Repos grün (apps 96, app-templates 531 + vp check, tooling 571 + vp check, docs arc42 validate ohne Befund)

### Completed
*None yet*

## Commit
### Entrance Criteria
- Code, Tests und Doku sind fertig; `npm test` läuft durch.

### Tasks
- [x] Aufräumen: keine Debug-Ausgaben, keine TODO/FIXME im Diff (alle vier Repos)
- [x] Doku geprüft: Vertrag, llms.txt, Listungs-Anleitung, Skills, arc42 entsprechen der Umsetzung
- [x] Je Repo zu einem Commit squashen, auf `main` setzen, PR anlegen (KD-08): lernapps/apps#231,
  lernapps/app-templates#146, lernapps/tooling#273, lernapps/docs#103; apps auf #224 (Grundwortschatz) rebased
- [x] Mergen in der Reihenfolge apps → app-templates → tooling → docs (Owner, 2026-11-09), jeweils nach grüner CI

### Completed
*None yet*


---
*This plan is maintained by the LLM. Tool responses provide guidance on which section to focus on and what tasks to work on.*
