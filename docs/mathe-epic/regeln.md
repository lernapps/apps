# Gemeinsame Regeln: Mathe-Explainer (Epic lernapps/apps#402)

Gilt für jede Session, die einen Mathe-Explainer baut. Kurz und prüfbar. Neue Erkenntnisse kommen hierher und gehen
einmal an alle (Orchestrator). Bei Widerspruch gewinnt: Issue-Text vor diesen Regeln vor dem eigenen Geschmack; die
`lernapps-*`-Skills gewinnen bei Werkzeugfragen.

## 1 Zuschnitt

1. **Ein Issue, ein Repo, eine Session.** Das Issue legt Kapitel, Bausteine und Stufen fest. Die Didaktik im Issue ist
   die Richtung; Kapitel darfst du anders schneiden, wenn alle Bausteine des Issues geübt werden.
2. **Eine Seite behandelt eine Kompetenz** (einen Baustein oder zwei, die sich nicht trennen lassen).
3. **Das Explainer bleibt in seinem Strang.** Was ein Kapitel von außerhalb braucht, steht am Kapitelanfang als
   kompakte Sammel-Wiederholung (`recap`). Grenzen zu anderen Explainern stehen im Abschnitt „Abgrenzung“ des Issues.
4. **Die Lernlandkarte wird nicht geändert.** Funde: ein Kommentar im Issue „Lernlandkarte: offene Prüfpunkte“
   (lernapps/apps#679, Label `map-review`) – nur über den Orchestrator (siehe Anweisung).
5. **Tragende Darstellungen wiederverwenden.** Zahlengerade, Rechteckmodell, Messen mit Einheiten, Baumdiagramm
   (siehe Überblick #402). Wer eine Darstellung einführt, nennt sie in allen Explainern gleich.

## 2 Begriffe und Schreibweisen

Für alle Seiten, Aufgaben, Rückmeldungen und Bildbeschriftungen. Die Schreibweisen entsprechen dem Unterricht in
Hessen (Annahme; bei Abweichung im Lehrplan oder Issue gilt dieser).

| Was | Schreibweise |
|---|---|
| Dezimalzahl | Komma: `3,5` (nie Punkt). Eingabefelder akzeptieren Komma **und** Punkt. |
| Große Zahlen | Ab 5 Stellen in Dreiergruppen mit schmalem geschütztem Leerzeichen (`12 345`, `1 000 000`); vierstellig ohne Lücke (`2024`). Nie Punkt als Tausendertrennung. |
| Minus | Rechenzeichen und Vorzeichen: `−` (U+2212), nie der kurze Bindestrich. Negative Zahl in Rechnung: Klammer `5 + (−3)`. |
| Mal, geteilt | `·` (Malpunkt) und `:` (Doppelpunkt). Kein `*`, kein `/` als Rechenzeichen. Bruchstrich nur für Brüche. |
| Einheiten | Zahl, geschütztes Leerzeichen, Einheit: `3 cm`, `2,5 kg`. Einheit nie kursiv. |
| Prozent | `15 %` mit geschütztem Leerzeichen. „Prozentpunkte“ nie mit „Prozent“ verwechseln. |
| Brüche | In Text, Aufgaben, Rückmeldungen und Bildbeschriftungen immer gesetzt (Zähler über Nenner, MathML), nie als `3/4`. Eingabefelder dürfen `3/4`, `0,75` und `0.75` akzeptieren, wo die Aufgabe das erlaubt. |
| Variablen | Kursiv: *x*, *a*. Termumformung zeilenweise, ein Schritt je Zeile, Begründung am Rand. |
| Fachwörter | Das Wort der Karte (Name des Bausteins) gilt. Neue Wörter werden am Beispiel eingeführt und stehen bei der ersten Verwendung im Text, nicht in einem Glossar allein. |
| Anrede | „du“. Kurze Sätze. Kein „man“ in Arbeitsaufträgen. Kein Kindchenschema, keine Niedlichkeit. |

## 3 Aufgaben und Rückmeldungen

1. **Jeder Baustein wird geübt** (Pflicht laut Issue: „seine Seiten üben alle Bausteine“). Mindestens drei Aufgaben je
   Baustein, mit steigender Schwierigkeit; die erste ist ohne Vorwissen aus dem Kapitel lösbar.
2. **Rückmeldung sofort und inhaltlich:** richtig / nicht richtig, **warum**, und bei häufigen Fehlern ein Hinweis auf
   den Fehlertyp („Du hast addiert statt multipliziert“). Nie nur „falsch“. Nie Punktestand, Rangliste, Zeitdruck,
   Strafe.
3. **Mehrere Versuche, dann der Lösungsweg.** Nach dem zweiten Fehlversuch darf der Weg gezeigt werden; die Aufgabe
   bleibt wiederholbar mit neuen Zahlen (Zufallswerte, mit festem Seed prüfbar).
4. **Werte werden geprüft, nicht verglichen als Text:** `0,5`, `0.5`, `1/2` gelten, wo die Aufgabe das erlaubt. Ergebnisse
   aus Rundung nennen die verlangte Genauigkeit in der Aufgabe.
5. **Jede Aufgabe ist lösbar, die Musterlösung stimmt.** Zahlenwerte mit Rechenprobe im Test oder Selbsttest der
   Seite; Zufallsaufgaben nie mit Division durch 0 oder unsinnigen Größen.
6. **Alltagsbezug ohne Marken und ohne reale Personen.** Namen frei erfunden und gemischt. Nichts über echte Lernende
   in Dateien oder Commit-Nachrichten.
7. **Barrierefrei:** Bedienung per Tastatur, Bilder und Diagramme mit Textalternative, Kontrast nach WCAG AA, nie
   Farbe allein als Information.

## 4 Quellen

- **Erlaubt:** Lernlandkarte Mathematik (lernapps.net/apps/map/mathematik/), KMK-Bildungsstandards Mathematik
  (2022), Hessischer Lehrplan/Kerncurriculum Mathematik Sek I (Gymnasium), eigene Herleitungen und eigene
  Aufgaben.
- **Nicht erlaubt:** Texte, Aufgaben, Bilder aus Schulbüchern oder Arbeitsblattseiten übernehmen; KI-generierte
  Aufgaben ohne eigene Rechenprobe; Inhalte mit unklarer Lizenz. Bilder und Animationen entstehen im Explainer selbst
  (SVG, Canvas).
- **Nachschlagen ist keine Quelle:** Fakten dürfen in anderen öffentlichen Quellen (zum Beispiel Wikipedia) nachgeschlagen
  werden, wenn du sie danach selbst herleitest oder nachrechnest. Solche Seiten stehen nicht im Explainer (weder in den
  Quellen noch als „Weiterlesen“-Link), und es werden keine Formulierungen, Aufgaben oder Bilder übernommen. Der
  fachliche Prüfer rechnet nach.
- **Keine Dritt-Inhalte nachladen** (Videos, Schriftarten, Skripte von fremden Servern). Ausnahme nur nach Freigabe
  durch den Orchestrator; sie muss im Katalogeintrag stehen (`thirdParty`).

## 5 Prüfung

1. **Musterseite als Tor:** Eine Seite komplett bauen (Erklärung, Beispiel, Bild, Aufgaben mit Rückmeldung), als
   Lernende(r) durchspielen und dem Orchestrator melden. Erst nach Freigabe entstehen die übrigen Seiten nach diesem
   Muster.
2. **Zwei Prüfer, die nicht geschrieben haben** (startet die Session selbst):
   - *Lernenden-Prüfer*: spielt die Seiten als Kind der Stufe durch, meldet unklare Sätze, Sackgassen, unfaire
     Rückmeldungen.
   - *Fachlicher Prüfer*: rechnet alle Aufgaben und Musterlösungen nach, prüft Begriffe, Schreibweisen (Abschnitt 2)
     und die Abgrenzung zu den Nachbar-Explainern.
   Befunde stehen im Plan unter „Review“, getrennt nach Prüfer. Was nicht geprüft ist, steht als offen darin.
3. **`lernapps check` ohne Fehler**, bevor „Veröffentlichen“ gemeldet wird.
4. **Nichts Ungeprüftes als geprüft melden.**

## 6 Schichten und Reihenfolge

1. **Drei Schichten nach Tiefe** der Abhängigkeiten zwischen den Explainern (aus den `requires` der Karte).
   - Schicht 1: #385, #386, #397, #389, #430, #432.
   - Schicht 2: #768, #398, #400 (neue Apps) sowie #391, #393, #401 (Inkremente in `mathe-arithmetik`, `mathe-algebra`, `mathe-stochastik`).
   - Schicht 3: #392, #395, #399, #429, #396.
2. **Innerhalb einer Schicht bauen die Sessions parallel.** Jede baut gegen die Bausteine der Karte und wiederholt
   Fremdes in einer Sammel-Wiederholung (`recap`); sie liest die Apps der anderen nicht und verlinkt nicht dorthin.
3. **Veröffentlicht wird in der Reihenfolge der Tiefe.** Eine Session meldet „Veröffentlichen“ erst, wenn die
   Explainer, von denen sie abhängt, veröffentlicht sind oder der Orchestrator es freigibt. Die Abhängigkeiten stehen
   im Plan jeder Session (Orchestrator trägt sie ein).
4. **Bestand wird nicht überschrieben.** Hat ein Repo schon Seiten (`mathe-brueche-dezimal`, `mathe-arithmetik`,
   `mathe-algebra`, `mathe-stochastik`), prüft die Session zuerst den Bestand gegen die Bausteine des Issues, nennt
   die Lücken und baut nur diese. Schon veröffentlichte Apps ändert sie nur als Inkrement auf `increment/*`; die
   veröffentlichte Version bleibt unberührt.

## 7 Rolle des Orchestrators

Der Orchestrator antwortet an den Checkpoints in Vertretung des Menschen (Berechtigung ausdrücklich erteilt). Er
vermerkt das in der Retro getrennt von Rückmeldungen des Menschen. **Freigabe zum Veröffentlichen (Merge,
Katalogeintrag) bleibt beim Menschen.**
