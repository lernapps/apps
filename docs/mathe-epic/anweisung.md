# Anweisung für Sessions: Mathe-Explainer

Du baust ein Explainer für lernapps.net im Fach Mathematik. Du arbeitest im Repo, in dem deine Session gestartet wurde
(ein Issue, ein Repo). Der Orchestrator führt das Epic (lernapps/apps#402) und antwortet dir an den Checkpoints in
Vertretung des Menschen („creator“ in deiner AGENTS.md). Der Mensch prüft deinen Vorschau-PR.

## Vor dem Start

1. Lies die Dateien dieser Anweisung vollständig (öffentlich lesbar; klone sie **außerhalb** deines Repos):
   `git clone --depth 1 -b claude/determined-cray-fmepl7 https://github.com/lernapps/apps /tmp/epic`
   - `/tmp/epic/docs/mathe-epic/regeln.md` – gemeinsame Regeln (verbindlich).
   - `/tmp/epic/docs/mathe-epic/issues/<Nr>.md` – dein Auftrag (der Text des GitHub-Issues, Nr. steht im Prompt).
2. Folge der AGENTS.md deines Repos (`npx --yes @lernapps/tooling init <name>` falls noch nicht geschehen) und den
   Skills `lernapps-app`, `lernapps-explainer`, `lernapps-explainer-design`, `lernapps-listing`. Das Repo ist ein
   Explainer im Format 2 mit dem im Issue genannten `strand`.
3. Der Name der App: der Repo-Name ohne Organisation. Beim `init` genau diesen Namen verwenden.

## Bestand

Hat dein Repo schon Seiten (siehe Regeln, Abschnitt 6, Punkt 4), ist der erste Schritt in „Recherche“: Bestand lesen,
jeden Baustein des Issues dem Bestand zuordnen (vorhanden / teilweise / fehlt), Abweichungen von den Regeln nennen
(Schreibweisen, Aufgaben, Quellen, Dritt-Inhalte) und dem Orchestrator melden. Gebaut wird nur, was fehlt oder gegen
die Regeln verstößt.

## Aus Schicht 1 gelernt (gilt für dich)

- **Musterseite:** Lass sie vor deiner Meldung von einem unabhängigen Lernenden-Prüfer (Unteragent, Klasse der Stufe) durchspielen und setze die Befunde um. Erst dann melden.
- **Prüfer vor „Veröffentlichen“:** fachlicher Prüfer (rechnet alles nach, Stichprobe auf wörtliche Übernahmen) und ein Lernenden-Prüfer über alle Seiten. Schreibe im Plan unter „Review“ auf, was nach dem letzten Prüferlauf noch geändert wurde; war es inhaltlich, prüfe genau diese Stellen noch einmal.
- **Funde zur Laufzeit** (Knöpfe, Meldungen, Formeln, Tests) behebst du nicht. Sammle sie im Bericht; der Orchestrator führt sie in `docs/mathe-epic/funde.md`.
- **Links:** keine externen `links:`, auch nicht an Aufgaben. Verlangt das Werkzeug einen, verlinke die Kartenseite des Bausteins. Formeln: kein `\angle` (Unicode `∠`), keine geschützten Leerzeichen oder gruppierten Zahlen in Überschriften.
- **Plan:** Nutze `lernapps plan` für alle Änderungen an Aufgaben (Hook `plan-file`). Hake nichts vor der Erledigung ab; übersprungene Aufgaben begründest du unter „Notes“.
- **Push und PR:** Plan und Stand regelmäßig auf `work` bzw. `increment/*` pushen. Den Vorschau-PR öffnest du selbst, sobald du bereit bist; mergen darfst du nie.
- **Sammel-Wiederholungen** schreibst du nach regeln.md Abschnitt 7, nicht nur als „Ich kann …“-Sätze.
- **`init`/`npx`:** Wird ein Befehl vom Auto-Modus abgelehnt, umgehe das nicht, sondern melde mir den genauen Befehl; die Freigabe gibt der Mensch.

## Checkpoints

Vier, wie in den Prozessregeln `stop-at-checkpoints`: **Recherche, Plan, Musterseite, Veröffentlichen.**
An jedem: Kurzbericht mit deiner Entscheidung bzw. Frage (höchstens zehn Zeilen), dann warten.

- Bericht per `send_message` an die Orchestrator-Session `session_016Nmpwb88Nk6memi4xX83Ac`. Beginne mit
  `[Mathe <Issue-Nr> · <Checkpoint>]`. Die Antwort kommt als Nachricht zurück. Fehlt dir `send_message`, schreibe den
  Bericht in deine Antwort und warte auf den Menschen.
- Rückfragen sonst nur, wenn du etwas nicht aus Issue, Regeln, Karte oder Skill entscheiden kannst (Regel
  `few-turns-after-plan`).
- Funde, die **alle** betreffen (Regelwiderspruch, Fehler in Vorlage, Werkzeug, Karte): in den Bericht, nicht selbst
  beheben und nicht in fremde Repos schreiben. Der Orchestrator sammelt sie als Issues.

## Was du pushen darfst

- Nur `work` (Erstversion) und später `increment/*` (Inkremente). Nie `main`. Nie `gh-pages` (das Skript hat sie
  angelegt). Die Berechtigung dazu steht in `.claude/settings.json` des Repos.
- „Veröffentlichen“ heißt: grüner Vorschau-PR von `work` nach `main`, **nicht mergen**. Der Mensch prüft, der
  Orchestrator merged nach seinem Ja.
- Kein `--no-verify`, kein Force-Push.

## Prüfer

Starte die zwei Prüfer selbst (Regeln, Abschnitt 5), vor dem Checkpoint „Veröffentlichen“, nicht durch den
Orchestrator. Der Orchestrator führt keine eigenen Reviews auf denselben Inhalten durch.

## Fertig, wenn

- Alle Bausteine des Issues sind auf mindestens einer Seite geübt (Liste „Baustein → Seite“ im Plan).
- `lernapps check` meldet keine Fehler; Vorschau-PR ist grün.
- Plan: Review der beiden Prüfer, offene Prüfungen, Retro mit Tatsachen (Phasen, Rückfragen nach dem Plan, wo du
  geraten hast).
- Du hast **Veröffentlichen** gemeldet. Danach tust du nichts mehr, bis eine Nachricht kommt.
