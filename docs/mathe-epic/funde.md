# Funde aus den Sessions (Mathe-Epic #402)

Vom Orchestrator gesammelt. Was Vorlage, Werkzeug oder Karte betrifft, geht am Ende der Welle einmal als Issue an die
richtige Stelle (Karte: lernapps/apps#679, Label `map-review`). Nichts davon wird in den Sessions behoben.

## Karte

| Nr | Fund | Von | Stand |
|---|---|---|---|
| K1 | `muster-zahlenfolgen` (5-6) verlangt „mit einem Term beschreiben“, Variablen kommen aber erst in #393. Entschieden: Regel in Worten und mit Platzhalter („Nummer des Bildes“), kein Termumformen. | #386 | offen für #679 |
| K2 | Karte und Issues sagen „Zahlenstrahl“, Überblick und Regeln sagen „Zahlengerade“. Entschieden in regeln.md Abschnitt 2. | #385 | geklärt, ggf. Überblick nachziehen |

## Werkzeug und Vorlage

| Nr | Fund | Von | Stand |
|---|---|---|---|
| W1 | CI nutzt Node 26, in den Sessions läuft Node 22 (Warnung). | #385 | offen |
| W2 | Das alte Repo `bruchrechnung` hatte `tooling 0.2.0` / `app-templates 0.1.0` (aktuell 0.18.5); Format 2 (strand, recap, Bausteine je Seite) ging damit nicht. `lernapps update` als erster Commit. | #389 | in Arbeit |
| W3 | Die Auto-Mode-Prüfung blockiert `npx --yes @lernapps/tooling init …` in jeder neuen Session trotz Erlaubnis in `.claude/settings.json`; jedes Mal braucht es die Freigabe des Menschen. | alle | offen |
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
| W19 | `gh api` auf Pages ist über den Proxy gesperrt; Pages-Status in Sessions nicht prüfbar. | #385 | offen |
| W20 | Zahleneingabe mit Einheit („115 Grad“) wird als leer gewertet („Antworte zuerst“). | #430 | offen |
| W21 | „Quelle: eigene Zeichnung. Lizenz: CC0-1.0.“ unter jedem Bild ist Lärm; kürzere Darstellung oder einmal pro Seite. | #430 | offen |
| W22 | Offene Aufgabe: „ja“ reicht fürs Vergleichen, Checkliste = Musterlösung. | #430 | offen |
| W23 | `max`/`min` fehlen im Ausdrucksparser (generated). | #430 | offen |
| W24 | Prop-Name = importierte Funktion macht in der Vorlage die Funktion sichtbar (Stolperfalle, im Guide notiert). | #430 | offen |
| W25 | Lint `explainer-text-load` (350 Wörter) schlägt bei Beweis- und Konstruktionsseiten an. | #430 | offen |
| W26 | `lernapps plan skip` schreibt Text in die Aufgabe, der Hook `plan-file` wertet das als Umformulierung; die beiden widersprechen sich. | #389 | offen |
| W27 | `generated` kann nicht zeichnen (z. B. Hunderterfeld); Zuordnung ohne JS zeigt keine Einträge; „85/100“ im Prozentfeld → „Antworte zuerst …“. | #389 | offen |
| W28 | Rückmeldungen von Komponenten und `generated`-`mistakes` setzen keine Formeln; die Regel „Brüche immer gesetzt“ ist dort nicht erfüllbar (ca. 40 Stellen in #389). Ausnahme in regeln.md. | #389 | offen |
| W29 | `\overline` fehlt in der Formelliste (Periodenstrich; Umgehung U+0305). | #389 | offen |
| W30 | `import.meta.glob` mit negativem Muster ließ eine neue Seite im Test aus. | #389 | offen |
| W31 | Das Schema erlaubt auf Recap-Seiten (`recap:`) keine Aufgaben („descriptive blocks only“); der Selbsttest muss auf eine eigene Kurztest-Seite. Prüfen, ob `recap:` Kurzaufgaben erlauben kann. | #393, #386, #430 | offen |
| W32 | `thirdParty: none` im Katalogeintrag, obwohl die App YouTube-Videos einbindet (mathe-algebra, Bestand). | #393 | Bestand wird bereinigt |

## Regeln (geklärt, schon in regeln.md)

- Brüche gesetzt statt `3/4`, Zahlenstrahl/Zahlengerade, Nachschlagen ist keine Quelle, keine externen `links:`.
