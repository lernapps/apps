# Gemeinsame Regeln: Explainer Französisch (Epic lernapps/apps#363)

Stand 2026-11-24, Methode: Skill `lernlandkarte-epic` (Abschnitt „Vorher klären"). Gilt für alle 15 Sessions des
Epics. Änderungen nur durch den Orchestrator; Erkenntnisse der Retros nach jeder Welle kommen hier hinein und gehen
einmal an alle Sessions.

## 1. Zuschnitt (fest)

- Ein Issue = ein Repository = eine Session:

| Schicht | Issue | Repository | Explainer |
|---|---|---|---|
| 1 | #346 | franzoesisch-nomen-und-begleiter | Nomen und ihre Begleiter |
| 1 | #347 | franzoesisch-verben | Verben konjugieren |
| 1 | #355 | franzoesisch-zahlen | Zahlen, Uhr und Kalender |
| 1 | #351 | franzoesisch-laute-und-schrift | Laute und Schrift |
| 1 | #349 | franzoesisch-saetze-bauen | Sätze bauen |
| 2 | #348 | franzoesisch-zeiten | Zeiten auf dem Zeitstrahl |
| 2 | #350 | franzoesisch-pronomen | Pronomen als Stellvertreter |
| 2 | #352 | franzoesisch-salut | Salut! Eine Brieffreundschaft |
| 2 | #361 | franzoesisch-woerter-werkzeuge | Werkzeuge für unbekannte Wörter |
| 3 | #354 | franzoesisch-unterwegs-in-der-stadt | Unterwegs in der Stadt |
| 3 | #356 | franzoesisch-frankreich-und-frankophonie | Eine Reise durch Frankreich und die Frankophonie |
| 3 | #357 | franzoesisch-geschichten | Geschichten lesen und erzählen |
| 3 | #358 | franzoesisch-bilder-comics-filme | Bilder, Comics und Filme lesen |
| 3 | #359 | franzoesisch-meinung | Meinung sagen und abwägen |
| 3 | #360 | franzoesisch-schreibwerkstatt | Schreibwerkstatt: Texte nach Bauplan |

- Die Schichten sind die Wellen: Schicht 1 zuerst, dann 2, dann 3 (so legt `scripts/create-repos-franzoesisch.sh`
  die Repos an; Reihenfolge aus den `requires` der Karte). Höhere Stufen innerhalb eines Explainers sind Inkremente
  auf `increment/*` im selben Repo mit eigenem Vorschau-PR; die veröffentlichte Version bleibt unberührt.
- Ein Explainer ist eine App im Format 2: `strand: franzoesisch/<strang>` (System-Explainer) oder
  `subject: franzoesisch` (Einheiten-App über Stränge). Kapitel sind Ordner `src/<kapitel>/`, eine Seite ist
  `src/<kapitel>/<seite>.yaml` und nennt ihre Bausteine in `competencies: [<id>, …]`.
- Die Lernlandkarte wird nicht geändert. Fällt einer Session etwas an ihr auf: Issue „Lernlandkarte: offene
  Prüfpunkte" (Label `map-review`).

## 2. Gemeinsame Welt (fest)

- **Figuren:** Lina (aus Deutschland) und Hugo (aus Lyon) werden in #352 Brieffreunde; in Kapitel 5 von #352 fährt
  Linas Klasse zum Austausch nach Lyon. Dieselben Namen und dieselbe Konstellation in jeder App, die die Situationen
  erzählt (#354, #356).
- **Ort:** Die erfundene Kleinstadt des Stadtplans in #354 ist Lyon. Vom Bahnhof dieser Stadt führt der Weg in die
  Reise auf der Karte von #356 weiter.
- **Ein Bild je Explainer, das von Kapitel zu Kapitel wächst:** Farbcode mit Zug #346, Konjugationstabelle #347,
  Zeitstrahl #348, Satzkarten #349, Stellvertreter-Karten #350, Laut-Schrift-Tabelle #351, mon carnet #352, Stadtplan
  #354, Zahlen-Baukasten #355, Landkarte #356, carnet de lecture #357, Bildraster #358, Meinungs-Waage mit
  Gefühlsbarometer #359, Bauplan mit Ton-Regler #360, Werkzeugkoffer #361.
- **Geteilte Symbole über Explainer hinweg:** Der Farbcode (masculin/féminin/Plural) aus #346 wird in #350 und #351
  wieder aufgenommen, das Ohr-Symbol aus #347 in #351, das Gefühlsbarometer aus #359 in #357. Gleiche Bedeutung heißt
  gleiche Darstellung.

## 3. Begriffe und Schreibweisen (fest)

- „Baustein" steht nur für eine Kompetenz der Lernlandkarte („Ich kann …"). Teile einer App heißen Komponente,
  Visualisierung, Bild, Modell. „Einordnung" macht die Karte, nicht die App.
- Texte der Apps: Deutsch, „du", einfache Sprache (ISO 24495-1). Französische Wörter immer mit Artikel und in der
  Farbe des Farbcodes; Grammatik-Fachbegriffe wie in #361 (le verbe, le sujet …).
- App-ID = Repo-Name = Adresse (`https://lernapps.net/<repo>/`). Kapitel- und Seiten-Ids sind Slugs (klein, Bindestriche).

## 4. Aufgaben, Rückmeldungen, Audio (fest)

- Übungsmuster und Rückmeldungen folgen den Skills `lernapps-exercise-patterns` und `references/foreign-languages.md`
  aus lernapps/tooling. Jede Übung meldet sofort und begründet kurz.
- Wörter in Übungen kommen aus dem Grundwortschatz der Karte (`map/franzoesisch/vocabulary/`, FLELex, Level A1/A2).
- Audio nur mit dem Skill `lernapps-audio` (fest hinterlegte Stimme). Keine externen TTS-Dienste, keine selbst
  aufgenommenen Stimmen.
- Braucht ein Kapitel Bausteine außerhalb seines Explainers: eine kompakte Sammel-Wiederholung am Kapitelanfang
  (`recap: [franzoesisch/<id>, …]`, „Das brauchst du hier") — keine eigene Seite je Baustein, keine Übung darin.

## 5. Erlaubte Quellen (fest)

- Lernlandkarte und Grundwortschatz aus lernapps/apps (öffentlich lesbar).
- KMK-Bildungsstandards und die Lehrpläne von HE, BY, NW nur zur Einordnung, nie als Inhaltsquelle einer App.
- Texte in den Apps sind eigene kurze Texte oder nachweislich lizenziert; keine Lehrbuchtexte kopieren. Lektüre-Titel
  (z. B. „Le Petit Nicolas" in #357) nur als Empfehlung nennen, nicht abdrucken.
- Keine Wortlisten aus dem Modellwissen ohne Abgleich mit dem Grundwortschatz.

## 6. Anweisung für die Sessions (Kurzbrief)

Jede Session bekommt: ihr Issue (#n), dieses Dokument, die Adresse ihres Repos.

1. **Auftrag holen:** Issue #n lesen, die Lernlandkarte und die Seiten seiner Bausteine lesen, den recap-Bedarf je
   Kapitel notieren.
2. **Plan** (Checkpoint): Kapitel- und Seitenstruktur, Bilder, recap-Seiten als Kommentar im Issue.
3. **Musterseite** (Checkpoint): eine Seite komplett bauen und als Lernende prüfen, erst dann die übrigen Seiten
   nach diesem Muster.
4. `lernapps check` ohne Fehler, `npm run build` grün.
5. **Vorschau-PR** (Checkpoint) auf Branch `work` — nie `main` pushen, Inkremente auf `increment/*`. Erlaubt sind nur
   die Befehle aus `.claude/settings.json` des Repos.
6. **Veröffentlichen** (Checkpoint): nach Freigabe des Vorschau-PRs (Squash-Merge) Katalogeintrag als PR in
   lernapps/apps (Skill `lernapps-listing`; `npm run --silent listing -- entries/<id>.yaml` muss grün sein), dann
   Issue #n mit Link auf den Eintrag schließen.

Vorlage für Format und Aufbau: die Englisch-Explainer, z. B. lernapps/englisch-saetze-bauen und
lernapps/hello-millbrook.

## 7. Prüf- und Melde-Regeln (fest)

- Wer schreibt, prüft nicht allein: jede Session startet selbst einen Prüfer in der Rolle der Lernenden und einen
  fachlichen Prüfer.
- Der Orchestrator beantwortet Checkpoints kurz mit Entscheidung und Grund und startet keine eigenen Reviews auf
  denselben Inhalten.
- Nichts ungeprüft als geprüft melden: offene Prüfungen bleiben in einer Liste, bis sie jemand gemacht hat.

## 8. Wenn Inhalte neu geordnet werden müssen

- Sessions ändern weder die Lernlandkarte noch den Explainer-Zuschnitt. Ein Fund (falsche Kante, Baustein im falschen
  Strang oder in der falschen Stufe, Grenze durch eine Kette) geht mit Baustein/Explainer und Vorschlag (Kante
  löschen, auf einen kleineren Baustein zeigen, neuen Baustein vorschlagen) in das Issue „Lernlandkarte: offene
  Prüfpunkte" (Label `map-review`) — gesammelt, nicht in jeder Session einzeln behoben.
- Die Karte ändert nur eine eigene Session mit dem Skill `map-research` (`probe.mjs` vorher und nachher), auf
  eigenem Branch und PR. Erst danach werden Explainer-Entwurf und Issues mit dem Skill `map-explainers` neu
  geschnitten (Draft ändern, `issues.mjs` rendert die Issue-Texte neu) — nie von Hand editiert.
- Reihenfolge bei einer Neuordnung: erst die Karte, dann die betroffenen Issues, dann die betroffenen Sessions.
  In der laufenden Welle wird nur noch als Inkrement gearbeitet (`increment/*`); veröffentlichte Apps werden nicht
  umgebaut.
- Dieses Dokument passt der Orchestrator an; die Änderung geht einmal an alle Sessions.
