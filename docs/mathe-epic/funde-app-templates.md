# Funde für `lernapps/app-templates` (aus dem Mathe-Epic #402)

Quelle: `docs/mathe-epic/funde.md` (vom Orchestrator gesammelt). Hier stehen die Funde, die Runtime, Schema,
Komponenten oder Meldungstexte von `app-templates` betreffen. Jede Zeile nennt die Session, die den Fund gemacht hat
(Nummer des Issues in `lernapps/apps`); die Repos der Sessions sind öffentlich lesbar, die Fundstelle steht dort im
Branch `work` bzw. `increment/…`:

| Issue | Repo |
|---|---|
| #385 | lernapps/mathe-grosse-zahlen |
| #386 | lernapps/mathe-muster-zaehlen |
| #389 | lernapps/mathe-brueche-dezimal |
| #397 | lernapps/mathe-figuren-abbilden |
| #430 | lernapps/mathe-saetze-entdecken (hier liegt auch die Komponente `Kurztest`) |
| #432 | lernapps/mathe-koerper-bauen |
| #398 | lernapps/mathe-messen |
| #768 | lernapps/mathe-zahlen-unter-null |

## Gruppen (Vorschlag für die Reihenfolge)

- **A Recap und Selbsttest:** W31, W33, W34, W36, W41, W37 (Recap-Pfade). Ein Block oder eine Komponente `Kurztest` für den Selbsttest
  auf Recap-Seiten; Kopf der Recap-Seite lesbar machen.
- **B Rückmeldungen und Meldungen:** W5, W6, W9, W10, W11, W12, W13, W18, W20, W38, W39 (und W37: „Antworte zuerst …“).
- **C Zahlen und Formeln:** W14, W17, W28, W29, W40 (Minus, Dezimalkomma, `\angle`, `\overline`, Formeln in Rückmeldungen).
- **D Test ohne JavaScript und Struktur:** W7, W15, W16, W27, W30.
- **E Übrige:** W4, W8, W21, W22, W23, W24, W37 (Tutor-Block, Glossar-Link, „fewer than N distinct tasks“).

## Die Funde

| Nr | Fund | Von | Stand |
|---|---|---|---|
| W4 | Das Werkzeug verlangt je Frage einen `links:`-Eintrag; unsere Regeln erlauben nur die Kartenseite des Bausteins. Prüfen, ob `links` optional werden kann. | #386 | offen |
| W5 | „Neue Aufgabe“-Knopf nur als Symbol (ohne Text). | #386 | offen |
| W6 | Meldung „Antworte zuerst …“ erscheint auch bei falscher Eingabeform im Zahlenfeld. | #386 | offen |
| W7 | Test ohne JS bricht bei `$…$` in `matching`-Seiten (Umgehung: Unicode-Hochzahlen). | #386 | offen |
| W8 | `definition`-Box wirkt wie ein Link; Zuordnung markiert Fehler nur mit rotem Rand und „×“. | #386 | offen |
| W9 | „Prüfen“ bei Komponenten ohne Auswahl ist grau ohne Hinweis, bei Fragen klickbar mit „Antworte zuerst“ (uneinheitlich). | #432 | offen |
| W10 | Der „Lösung“-Knopf nach Fehlversuch bewirkte beim Lernenden-Prüfer nichts Sichtbares (nicht untersucht). | #397 | offen |
| W11 | „Antworte zuerst: Wähle, tippe oder ordne alles zu“ erscheint auch bei einem Textfeld. | #430 | offen |
| W12 | `generated` startet bei einer zufälligen „Aufgabe Nr.“. | #430 | offen |
| W13 | Rückmeldung bei falscher Wahr/Falsch-Antwort ist generisch („Lies dazu noch einmal den Text“). | #430 | offen |
| W14 | `\angle` fehlt in der Formelliste; Umgehung mit Unicode `∠` (U+2220). Betrifft alle Geometrie-Explainer. | #430 | offen |
| W15 | Die No-JS-Prüfung zählt `<math>` außerhalb beschriebener Aufgaben als Formel des Inhalts; Komponenten setzen Brüche daher in HTML mit `role=math`. | #389 | offen |
| W16 | Der No-JS-Test vergleicht Überschriften mit normalisiertem Text; ein geschütztes Leerzeichen oder eine gruppierte Zahl in einem Titel lässt ihn scheitern. | #389, #385 | offen |
| W17 | Die Lösungsanzeige der Laufzeit schreibt Zahlen mit Punkt (2.236), unsere Regel verlangt Komma bzw. Lücke. | #385 | offen |
| W18 | Eingabe „1/6“ oder Text im Zahlenfeld liefert nur „Antworte zuerst …“ ohne Hinweis (vgl. W6, W11). | #389 | offen |
| W20 | Zahleneingabe mit Einheit („115 Grad“) wird als leer gewertet („Antworte zuerst“). | #430 | offen |
| W21 | „Quelle: eigene Zeichnung. Lizenz: CC0-1.0.“ unter jedem Bild ist Lärm; kürzere Darstellung oder einmal pro Seite. | #430 | offen |
| W22 | Offene Aufgabe: „ja“ reicht fürs Vergleichen, Checkliste = Musterlösung. | #430 | offen |
| W23 | `max`/`min` fehlen im Ausdrucksparser (generated). | #430 | offen |
| W24 | Prop-Name = importierte Funktion macht in der Vorlage die Funktion sichtbar (Stolperfalle, im Guide notiert). | #430 | offen |
| W27 | `generated` kann nicht zeichnen (z. B. Hunderterfeld); Zuordnung ohne JS zeigt keine Einträge; „85/100“ im Prozentfeld → „Antworte zuerst …“. | #389 | offen |
| W28 | Rückmeldungen von Komponenten und `generated`-`mistakes` setzen keine Formeln; die Regel „Brüche immer gesetzt“ ist dort nicht erfüllbar (ca. 40 Stellen in #389). Ausnahme in regeln.md. | #389 | offen |
| W29 | `\overline` fehlt in der Formelliste (Periodenstrich; Umgehung U+0305). | #389 | offen |
| W30 | `import.meta.glob` mit negativem Muster ließ eine neue Seite im Test aus. | #389 | offen |
| W31 | Das Schema erlaubt auf Recap-Seiten (`recap:`) keine Aufgaben („descriptive blocks only“). Umgehung: Komponente `Kurztest` in der Recap-Seite (Vorbild #430). Prüfen, ob das Werkzeug einen Kurztest-Block für Recaps anbieten soll. | #393, #386, #430, #392, #768 | offen |
| W33 | Der Kopf der Runtime-Recap-Seite (Tutor-Link, Inhaltsverzeichnis, technischer Name im Eingangskasten) ist nicht änderbar. | #397 | offen |
| W34 | Ein `term:` darf im Explainer nur einmal als `definition` stehen; wiederholte Begriffe in späteren Recaps stehen nur fett im Text. | #430 | offen |
| W36 | Ein Werkzeug-Baustein für den Recap-Selbsttest (statt Komponente `Kurztest` je Explainer) wäre für alle Explainer sinnvoll; `competencies` darf nicht leer sein, eine Recap-Seite ohne `recap:` geht nicht. | #430 | offen |
| W37 | Der Fachbegriff-Link (`definition`) springt nur auf dieselbe Seite; der KI-Tutor-Block oben ist für Klasse 5 unverständlich; `generated` meldet „fewer than N distinct tasks“ bei kleinem Wertebereich; der Block `recap` zeigt die Karten-Sätze als rohe Pfade („mathematik/natuerliche-zahlen“). | #398, #386 | offen |
| W38 | Zahlenaufgaben sperren nach der ersten Antwort ohne zweiten Versuch; Enter im Zahlenfeld prüft nicht; „Prüfen“ grau (vgl. W9). | #432 | offen |
| W39 | Der Link einer Aufgabe ist nach falscher Antwort nicht sichtbar, nur unter „Lösung“; die Standardrückmeldung „Lies dazu noch einmal den Text“ ohne `mistakes` hilft nicht (vgl. W13). | #385, #398 | offen |
| W40 | Die Lösungsanzeige der Laufzeit schreibt negative Zahlen mit Bindestrich („-3“), unsere Regel verlangt `−` (U+2212); die Komponente `Kurztest` braucht `a/b` in Frage und Optionen (W28). | #768 | offen |
| W41 | Komponente `Kurztest` (Vorlage in `docs/mathe-epic/components/`, aus #430): Pfeiltasten beantworten beim Durchgehen jede Option (Radio-Verhalten), Radios nur 13 px, eine mehrzeilige Frage schneidet den Rahmen (`legend`), der Kartenlink öffnet eine externe Seite ohne Hinweis. Nach der Welle einmal zentral beheben und in alle Explainer übernehmen. | #389 | offen |

## Nicht in `app-templates` (gehören nach `lernapps/tooling` oder zur Plattform)

- W1: CI nutzt Node 26, in den Sessions läuft Node 22 (Warnung).
- W2: Das alte Repo `bruchrechnung` hatte `tooling 0.2.0` / `app-templates 0.1.0` (aktuell 0.18.5); Format 2 (strand, recap, Bausteine je Seite) ging damit nicht. `lernapps update` als erster Commit.
- W3: Die Auto-Mode-Prüfung blockiert `npx --yes @lernapps/tooling init …` in jeder neuen Session trotz Erlaubnis in `.claude/settings.json`; jedes Mal braucht es die Freigabe des Menschen.
- W19: `gh api` auf Pages ist über den Proxy gesperrt; Pages-Status in Sessions nicht prüfbar.
- W25: Lint `explainer-text-load` (350 Wörter) schlägt bei Beweis- und Konstruktionsseiten an.
- W26: `lernapps plan skip` schreibt Text in die Aufgabe, der Hook `plan-file` wertet das als Umformulierung; die beiden widersprechen sich.
- W32: `thirdParty: none` im Katalogeintrag, obwohl die App YouTube-Videos einbindet (mathe-algebra, Bestand).
- W35: Die Hinweise `explainer-text-load` und `explainer-repetition` melden Recaps (textlastig, wiederkehrender Satz „Wenn du unsicher warst …“); bleiben stehen.
