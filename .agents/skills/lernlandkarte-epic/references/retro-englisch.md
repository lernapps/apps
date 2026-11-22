# Retro Englisch-Epic: Methodik für Agenten und Arbeitsschnitt

Für den Start des Mathe-Epics (lernapps/apps#402). Nur das Vorgehen; Inhalte und Einzelfälle stehen in `konventionen.md`.

## Arbeitsschnitt

- **Ein Epic, ein Issue je Explainer.** Englisch: #489 bündelt #470–#487, jedes Issue wird ein eigenes Repo mit eigener App.
- **Nach Stufe in Wellen geschnitten:** erst die Startstufe (5-6), danach Inkremente für 7-8, später 9-10. Jedes Inkrement liegt im bestehenden Repo auf einem eigenen Branch mit Vorschau-PR; die veröffentlichte Version bleibt unberührt.
- **Innerhalb eines Explainers: Kapitel → Seite → Baustein.** Eine Seite behandelt eine Kompetenz. Eine Seite ist die Musterseite, die anderen folgen ihr.
- **Schichten nach Abhängigkeit:** was andere voraussetzen, kommt zuerst (Schicht 1 vor 2 vor 3). So gab es früh ein Muster, an dem sich die späteren Apps orientierten.

## Agenten und Rollen

- **Orchestrator** (eine Session): schreibt die gemeinsamen Regeln, beantwortet Rückfragen, verteilt Aufträge, fasst für den Menschen zusammen. Er greift nicht in Inhalte ein, solange die Session keine Frage hat.
- **Eine Session je App-Repo.** Jede arbeitet nach dem Plan des Werkzeugs (Explore, Plan, Code, Commit) und stoppt an festen Checkpoints: Recherche, Plan und Inhaltsmethode, Musterseite, Veröffentlichen.
- **Sub-Agenten innerhalb einer Session:** Seiten parallel schreiben (je Kapitel ein Worktree), danach unabhängig prüfen (Lerner-Check als Kind der Klassenstufe, fachliche Prüfung). Die Session führt zusammen.
- **Mensch:** entscheidet, was ihm gehört (Freigaben, Stil, Veröffentlichen). Der Orchestrator darf vorab erlaubte Checkpoints in dessen Namen beantworten; das wird getrennt vermerkt.

## Führung

- **Gemeinsame Regeln an einem Ort** (`konventionen.md` im Start-Repo). Neue Erkenntnisse gehen dort hinein und werden allen Sessions einmal gemeldet. Die Regeln sollen kurz sein und prüfbar.
- **Musterseite als Tor:** Erst wenn eine Seite den Lerner-Check bestanden hat und der Orchestrator zustimmt, dürfen die übrigen nach ihr entstehen. Das hat Korrekturen auf alle Seiten verhindert.
- **Prüfen durch Dritte:** Wer schreibt, prüft nicht allein. Mindestens ein Prüfer, der die Rolle der Lernenden einnimmt, und ein fachlicher.
- **Keine Arbeit doppelt:** Die Sessions prüfen selbst, mit eigenen Sub-Agenten (Lerner-Check, Sprachprüfung, Gesamtcheck je Kapitel). Der Orchestrator startet deshalb keine eigenen Review-Agenten auf denselben Inhalten und schickt keine ungefragten Nachrichten. Er greift nur ein, wenn eine Session fragt, oder bei Regeln, die alle betreffen (dann einmal in die Konventionen). Aufträge an Sessions stehen in einer Nachricht an alle statt in einzelnen Nachfragen, und Funde, die mehrere Apps betreffen (Template, Werkzeug), werden einmal gesammelt statt je Session behandelt. Vor einem Auftrag klären, wer ihn schon macht.
- **Kurze Rückfragen, kurze Antworten.** Eine Antwort pro Frage, mit Entscheidung und Grund; Sessions melden bei Unsicherheit statt zu raten. Fragen an den Menschen nur, wenn ihm die Entscheidung gehört.
- **Nichts Ungeprüftes als geprüft melden.** Offene Prüfungen stehen in einer Liste und bleiben dort, bis jemand sie wirklich gemacht hat.
- **Einheitliche Berichte:** jede Session meldet an den Checkpoints dasselbe (was Lernende tun, was geprüft wurde, was offen ist). Das macht Zusammenfassungen für den Menschen billig.

## Was uns ausgebremst hat

- **Berechtigungen:** Push und Merge waren am Anfang nicht freigegeben. Eine Nachricht des Orchestrators reicht dem Berechtigungsmodus einer Session nicht; der Mensch muss freigeben. Für Mathe: vorher im Modus jeder Session hinterlegen.
- **Regeln kamen zu spät:** Vieles, was die Konventionen heute enthalten, kam erst aus den ersten Reviews und musste in elf Repos nachgezogen werden. Für Mathe: Konventionen vor der ersten Session schreiben.
- **Zu viele Nachrichten an den Menschen:** Er wollte, dass Sessions und Orchestrator Fachfragen selbst klären und ihn nur bei seinen Entscheidungen fragen.
- **Werkzeugreibung:** Update-Befehl fand neue Templates nicht, Plan-Werkzeug und Hooks kollidierten, Pre-Push-Hooks dauern mehrere Minuten je Push. Solche Funde zentral sammeln und nicht in jeder Session einzeln behandeln.

## Für Mathe (Vorschläge, nicht erprobt)

1. Konventionen zuerst: Zuschnitt, Begriffe und Schreibweisen (Dezimalkomma, Einheiten, Rundung), Regeln für Aufgaben und Rückmeldungen.
2. Berechtigungen und Merge-Regeln vor dem Start klären und in den Sessions hinterlegen.
3. Gleiche Struktur: Orchestrator, eine Session je Explainer, Musterseite als Tor, Prüfer-Agenten. Prüfung fachlich statt sprachlich: Rechenwege und Ergebnisse per Skript nachrechnen.
4. Epic #402 vorher in Wellen und Schichten zerlegen (was setzt was voraus), bevor Sessions starten.
5. Nach jeder Welle eine kurze Retro in die Konventionen übernehmen.
