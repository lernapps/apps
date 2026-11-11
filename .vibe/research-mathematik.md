# Recherche Lernlandkarte Mathematik, Gymnasium Sekundarstufe I (Jg 5–10)

Grundlage für `map/mathematik.yaml`. Methode: `.agents/skills/map-research/SKILL.md`, Format:
`docs/learning-map-contract.md`.

Der erste Bericht zur Mathematik-Karte (Stränge, Bausteine, Richtstufen, Umzug der Ids; feat/learning-map) heißt im
Kopf von `map/mathematik.yaml` „report.md“. Er lag nur im Scratchpad der damaligen Sitzung und ist nicht im Repo. Die
Quellenkürzel stehen im Kopf von `map/mathematik.yaml`. Diese Datei beginnt daher mit der Überarbeitung der
Voraussetzungen; die Quellen habe ich dafür neu geöffnet (6.2).

## 6. requires überarbeitet (2026-11-10, feat/map-chains)

Auftrag des Owners: Die Bausteine stehen in der fachlich richtigen Reihenfolge; wenige Wurzeln, keine allein
stehenden Bausteine; jede neue Kante mit Begründung aus einer Quelle oder als gekennzeichnete Herleitung (Skill
`map-research`, „Connect every competency“). Ich habe jede Wurzel in beide Richtungen geprüft (Was braucht sie? Was
baut auf ihr auf?) und alle 203 bestehenden Kanten gelesen. Die Begründung jeder neuen Kante steht als Kommentar
`# requires …` am Baustein. Ids, `gradeBand`, `status`, `iCan` und Stränge sind unverändert. Neue Bausteine habe ich
nicht eingefügt.

Lage der Kommentare: In `map/mathematik.yaml` stehen die Quellenzeilen eines Bausteins unter `- id:`, nicht darüber
(anders als in Englisch und Physik). Die Zeile `# requires …` steht deshalb direkt unter den Quellenzeilen, also
zwischen `# bands: …` und `name:`. So steht der Grund neben den Quellen, und die Datei bleibt einheitlich.

**Ergebnis in Kürze:** Die Karte war schon verbunden (kein Baustein allein, ein Teilnetz), hatte aber 15 indirekte
Kanten. Ich habe 7 Kanten mit Quelle oder Bündel ergänzt und 23 entfernt: 15 waren schon vorher indirekt, 8 wurden
durch die neuen Kanten indirekt. Keine bestehende Kante war inhaltlich falsch. Zwei Wurzeln weniger: Die Geometrie hat
nur noch eine Wurzel, die Stochastik keine eigene mehr. Wichtigste Änderung: Terme mit Variablen bauen jetzt auf dem
Rechnen mit negativen Zahlen auf. Dadurch werden die Ketten in Algebra und Funktionen länger (Stufen 11 → 15); das
entspricht der Reihenfolge in allen drei Ländern (negative Zahlen vor Termen).

### 6.1 Zahlen

| | Kanten | Wurzeln | allein | Teilnetze | Stufen |
|---|---|---|---|---|---|
| vorher | 203 | 5 | 0 | 1 | 11 |
| nachher | 187 | 3 | 0 | 1 | 15 |

Geprüft: keine Kreise, keine Voraussetzung mit späterer Richtstufe, keine indirekte Kante (Messskript ohne Zeilen
`LATE` und `INDIRECT`; vorher gab es 16 Zeilen `INDIRECT` zu 15 Kanten). `npm test` grün (111 bestanden,
1 übersprungen ohne Docker).

**Listing der Apps des Fachs** (`mathe-algebra`, `mathe-arithmetik`, `mathe-stochastik`, `kniffel-trainer`), vorher
und nachher verglichen. Mathematik hat `explainerFocus: strand`; Befunde sind Warnungen, alle Apps bestehen.

| App | vorher | nachher | Unterschied |
|---|---|---|---|
| `kniffel-trainer` | bestanden, keine Warnung | bestanden, keine Warnung | – |
| `mathe-algebra` | 1 Warnung | 1 Warnung | unverändert (`klammern-binome` → `terme-umformen`) |
| `mathe-arithmetik` | 2 Warnungen | 1 Warnung | weg: `prozent-grundbegriffe` → `brueche-begriff` (Kante entfernt, indirekt) |
| `mathe-stochastik` | 4 Warnungen | 4 Warnungen | weg: `zufall-pfadregel-2` → `brueche-addieren-subtrahieren` (indirekt); **neu:** `zufall-baumdiagramm` → `zaehlprinzip` |

**Neuer Befund:** `mathe-stochastik`, Seite des Bausteins `zufall-baumdiagramm`: Die App übt das Zählprinzip nicht.
Eine Seite `recap: mathematik/zaehlprinzip` vor dem Baumdiagramm oder ein Link auf die Seite der Karte hilft (eine
Warnung, kein Fehler).

### 6.2 Quellen

Alle Quellen habe ich am 10.11.2026 neu heruntergeladen und gelesen (PDF mit `pdftotext`, LehrplanPLUS als HTML).

| Kürzel | Titel | Ausgabe | URL |
|---|---|---|---|
| KMK | KMK: Bildungsstandards für das Fach Mathematik, Erster Schulabschluss (ESA) und Mittlerer Schulabschluss (MSA) | Beschluss vom 15.10.2004 und 04.12.2003 i. d. F. vom 23.06.2022 (22 S.; mit Korrekturvermerk vom 18.06.2026 auf S. 16); Seitenzahl = „Seite n“ des PDF | https://www.kmk.org/fileadmin/Dateien/veroeffentlichungen_beschluesse/2022/2022_06_23-Bista-ESA-MSA-Mathe.pdf |
| HE | Hessisches Kultusministerium: Lehrplan Mathematik, Gymnasialer Bildungsgang, Jahrgangsstufen 5 bis 13 (G9), „Geltende Lehrpläne zusammengefasst“ | PDF vom 08.02.2016 (47 S.), Einheiten 5.1 … 10.5 | https://kultus.hessen.de/sites/kultus.hessen.de/files/2021-06/g9-mathematik.pdf |
| HE-KC | Hessisches Kultusministerium: Kerncurriculum Mathematik, Sekundarstufe I – Gymnasium | Fassung 2011 (35 S.); für die Kanten nicht gebraucht | https://kultus.hessen.de/sites/kultus.hessen.de/files/2021-07/kerncurriculum_mathematik_gymnasium.pdf |
| BY | ISB Bayern: LehrplanPLUS Gymnasium, Mathematik 5–10 | Online-Fassung, abgerufen am 10.11.2026 | https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/5/mathematik · …/6/mathematik · …/7/mathematik · …/8/mathematik · …/9/mathematik · …/10/mathematik |
| NRW | MSB NRW: Kernlehrplan für die Sekundarstufe I Gymnasium in Nordrhein-Westfalen, Mathematik | Heft 3401, 1. Auflage 2019 (40 S.); E = Erprobungsstufe, S1/S2 = erste/zweite Stufe | https://lehrplannavigator.nrw.de/system/files/media/document/file/g9_m_klp_3401_2019_06_23_0.pdf |
| SILP (nur Hinweis) | QUA-LiS NRW: Beispiel für einen schulinternen Lehrplan, Gymnasium Sek I, Mathematik | Fassung vom 31.01.2020; für die Kanten nicht gebraucht | https://lehrplannavigator.nrw.de/system/files/media/document/file/g9_m_silp_2020_01_31.pdf |

Hinweis: Die naheliegende NRW-URL ohne `_0` (`…/g9_m_klp_3401_2019_06_23.pdf`) liefert eine HTML-Seite, kein PDF;
richtig ist die Datei mit `_0`.

**Fachdidaktik:** Für die neuen Kanten war keine nötig; KMK und Länder tragen sie selbst. Ich habe keine
fachdidaktische Quelle zitiert.

### 6.3 Neue Kanten (7)

| Baustein | Voraussetzung | Grund | Fundstelle | Art |
|---|---|---|---|---|
| `grundfiguren-eben` | `parallel-senkrecht-abstand` | Die Eigenschaften der Grundfiguren beschreibt man mit parallelen und senkrechten Seiten (Rechteck, Parallelogramm, Trapez). | HE 5.2 („Ebene Figuren“ und „Lagebeziehung von Geraden“ in einer Einheit); NRW E Geo-1 („erläutern Grundbegriffe und verwenden diese zur Beschreibung von ebenen Figuren … sowie deren Lagebeziehungen“); BY M5 2 (Lagebeziehungen vor den Vierecken) | Bündel |
| `daten-darstellen` | `zahlen-vergleichen-ordnen` | Die Achse eines Säulen- oder Balkendiagramms ist ein Zahlenstrahl mit passender Skalierung. | HE 5.1 („Bestimmung von Anzahlen und Darstellung in Diagrammen“ und „Vergleichen, Ordnen, Zahlenstrahl“ in einer Einheit); BY M5 1.1 („stellen sie unter Wahl einer geeigneten Skalierung am Zahlenstrahl dar“) | Bündel |
| `terme-variable` | `rationale-zahlen-rechnen` | Beim Einsetzen in Terme kommen negative Zahlen vor; Vorzeichen- und Klammerregeln bereiten die Termumformungen vor. | BY M7 1.1 („greifen auf die aus den vorhergehenden Jahrgangsstufen bekannten Rechenregeln für rationale Zahlen zurück“); HE 7.2 („Klammerregeln / Vorrangregeln (Propädeutik der in Klasse 8 zu behandelnden Termumformungen)“); NRW S1 Ari-3 vor Ari-4 | Quelle |
| `brueche-kuerzen-erweitern` | `primfaktoren-ggt-kgv` | Zum Vergleichen bringt man Brüche auf den Hauptnenner, das kgV der Nenner. | HE 6.1 („Kürzen und Erweitern von Brüchen, Hauptnenner als kgV“); BY M6 1.1 (Hauptnenner „mithilfe eines algorithmischen (z. B. auf der Primfaktorzerlegung basierenden) Verfahrens“) | Quelle |
| `bewegungen-figuren` | `winkel-messen` | Eine Drehung ist durch Zentrum und Drehwinkel bestimmt. | HE 6.2 („Winkel“ vor „Bewegung von Figuren: … Drehung“ in einer Einheit); KMK S. 20 (verschieben, drehen, spiegeln) | Bündel |
| `zufall-baumdiagramm` | `zaehlprinzip` | Das Baumdiagramm zum Zählen von Möglichkeiten ist die Grundlage des Wahrscheinlichkeitsbaums. | BY M5 3.1 („nutzen dieses [Zählprinzip] sowie Baumdiagramme zur systematischen Bestimmung von Anzahlen“); BY M8 5 („berechnen Laplace-Wahrscheinlichkeiten und nutzen dabei auch das Zählprinzip und Baumdiagramme“); KMK S. 16, 22 | Quelle |
| `exponentialfunktionen` | `funktionen-darstellung` | Exponentialfunktionen beschreibt man mit Term, Wertetabelle und Graph. | BY M10 1 (zu b · aˣ „den Verlauf des zugehörigen Graphen und dessen typische Merkmale“); KMK S. 19 (Merkmale von Funktionen „im Funktionsterm, Graph und der Wertetabelle“); HE 8.1 vor 10.2 | Quelle |

Summe: 4 × Quelle, 3 × Bündel, 0 × Herleitung.

### 6.4 Entfernte Kanten (23)

Schon vorher indirekt (15):

| Baustein | Voraussetzung | folgt über |
|---|---|---|
| `prozent-grundbegriffe` | `brueche-begriff` | `dezimalbrueche` |
| `terme-variable` | `grundrechenarten-rechengesetze` | `einfache-gleichungen` |
| `lineare-gleichungen` | `einfache-gleichungen` | `terme-umformen` → `terme-variable` |
| `logarithmen` | `potenzgesetze` | `exponentialfunktionen` |
| `funktionen-darstellung` | `koordinatensystem` | `funktionsbegriff` → `zuordnungen` |
| `lineare-funktionen` | `koordinatensystem` | `proportionale-zuordnungen` bzw. `funktionen-darstellung` |
| `quadratische-funktionen` | `funktionen-darstellung` | `lineare-funktionen` |
| `sinusfunktion` | `trigonometrie` | `bogenmass` |
| `flaeche-umfang-quadrat-rechteck` | `umrechnung-groessen` | `einheiten-flaeche-volumen` |
| `zusammengesetzte-figuren` | `grundfiguren-eben` | `flaeche-umfang-quadrat-rechteck` |
| `berechnungen-dreiecke-vielecke` | `satz-des-pythagoras` | `trigonometrie` |
| `wahrscheinlichkeitsbegriff` | `brueche-begriff` | `haeufigkeit-als-schaetzwert` → … → `haeufigkeiten` |
| `zufall-pfadregel-2` | `brueche-addieren-subtrahieren` | `zufall-pfadregel-1` → `brueche-multiplizieren-dividieren` |
| `zufall-ereignis-uebersetzen` | `zufall-baumdiagramm` | `zufall-pfadregel-2` → `zufall-pfadregel-1` |
| `vierfeldertafel` | `haeufigkeiten` | `zufall-laplace` → … → `zufallserscheinungen` |

Durch die neuen Kanten indirekt geworden (8):

| Baustein | Voraussetzung | folgt jetzt über |
|---|---|---|
| `vierecke-grundfiguren` | `parallel-senkrecht-abstand` | `grundfiguren-eben` |
| `konstruktionen` | `parallel-senkrecht-abstand` | `grundfiguren-eben` |
| `kreis-sehne-tangente` | `parallel-senkrecht-abstand` | `grundfiguren-eben` |
| `winkelsaetze` | `parallel-senkrecht-abstand` | `winkel-messen` → `grundfiguren-eben` |
| `brueche-kuerzen-erweitern` | `teilbarkeit` | `primfaktoren-ggt-kgv` |
| `bruchterme` | `brueche-kuerzen-erweitern` | `klammern-binome` → … → `terme-variable` → `rationale-zahlen-rechnen` → `brueche-multiplizieren-dividieren` → `brueche-addieren-subtrahieren` |
| `potenzgesetze` | `potenzen` | `terme-umformen` → … → `brueche-kuerzen-erweitern` → `primfaktoren-ggt-kgv` |
| `potenzen-ganzzahlige-exponenten` | `brueche-multiplizieren-dividieren` | `potenzgesetze` → … → `rationale-zahlen-rechnen` |

Keine bestehende Kante war inhaltlich falsch. Fraglich, aber behalten: `bogenmass` → `trigonometrie` und
`kenngroessen-lage-streumasse` → `mittelwert` (siehe 6.7).

### 6.5 Wurzeln, die bleiben (3, keine allein)

| Baustein | Strang | Grund |
|---|---|---|
| `natuerliche-zahlen` | arithmetik | Anfang des Fachs; baut auf der Grundschule auf (KMK-P; HE 5.1 „Reaktivierung des Dezimalsystems“; BY M5 1.1). |
| `groessenvorstellungen-schaetzen` | arithmetik | Anfang der KMK-Leitidee „Größen und Messen“ (KMK S. 17); baut auf den Größen der Grundschule auf (HE 5.3 „Fortführung der Behandlung von Größen“). Eine Kante zu `natuerliche-zahlen` wäre nur mittel sicher (6.7). |
| `parallel-senkrecht-abstand` | geometrie | Anfang der Geometrie: Grundbegriffe Punkt, Gerade, Lage (KMK S. 20; HE 5.2; BY M5 2; NRW E Geo-1). Jetzt die einzige Wurzel des Strangs. |

Nicht mehr Wurzel: `grundfiguren-eben` (jetzt nach `parallel-senkrecht-abstand`) und `daten-darstellen` (jetzt nach
`zahlen-vergleichen-ordnen`). Die Stränge Algebra, Funktionen und Stochastik haben keine eigene Wurzel; sie beginnen
mit Bausteinen, die an der Arithmetik hängen.

### 6.6 Vorgeschlagene neue Bausteine (Lücken im Modell)

Für die Anbindung fehlt kein Baustein. Zwei Vorschläge für die Lehrkräfte, nicht in die Karte übernommen:

1. **Geometrische Grundbegriffe** (id z. B. `geometrische-grundbegriffe`, iCan „Ich kann Punkt, Strecke, Strahl,
   Gerade und Ebene unterscheiden und richtig benennen.“, Strang `geometrie`, Richtstufe 5-6; Quellen: KMK S. 20
   („Punkte, Winkel, Strecken, Geraden, Flächen, Körper“), HE 5.2 („Geometrische Grundbegriffe: Punkt, Strecke …
   Gerade, Ebene“), NRW E Geo-1, BY M5 2). Kanten: `parallel-senkrecht-abstand` und `koordinatensystem` → ihn. Er wäre
   die natürliche Wurzel der Geometrie; bisher steckt der Inhalt unausgesprochen in `parallel-senkrecht-abstand`.
2. **Absolute Häufigkeit und Strichliste** (Teilung von `haeufigkeiten`): HE 5.1 nennt absolute Häufigkeiten in
   Jg 5, relative erst in 6.1; NRW E Sto-1 („erheben Daten, fassen sie in Ur- und Strichlisten zusammen“). Ein eigener
   Baustein (Strang `stochastik`, 5-6) könnte vor `daten-darstellen` stehen, `haeufigkeiten` (relativ) nach
   `brueche-begriff`. Das wäre eine Teilung mit Richtstufe und neuer Id; ich schlage sie nur vor (siehe 6.7, Punkt 2).

### 6.7 Offene Punkte (auch Kanten mit nur mittlerer Zuversicht)

1. **`groessenvorstellungen-schaetzen` → `natuerliche-zahlen`**: HE 5.1 (Zahlen, „Verständnis für Größenordnungen“)
   und BY M5 1 kommen vor den Größen (HE 5.3, BY M5 4). Mittel: Schätzen mit Bezugsgrößen braucht Zahlvorstellungen
   aus der Grundschule, nicht das Stellenwertsystem bis zur Billion. Nicht aufgenommen.
2. **Reihenfolge Daten – Häufigkeiten**: BY M6 3 bestimmt Häufigkeiten und stellt „so aufbereitete Daten“ dann
   grafisch dar; NRW E Sto-1 (erheben, Strichlisten) vor Sto-2 („stellen Häufigkeiten in Tabellen und Diagrammen
   dar“). Das spräche für `daten-darstellen` → `umfragen-erhebungen` bzw. → absolute Häufigkeit, die Karte hat aber
   `umfragen-erhebungen` → `daten-darstellen`. Man kann Daten auch darstellen, ohne sie selbst erhoben zu haben. Mittel;
   nicht geändert. Hängt am Vorschlag 6.6, Punkt 2.
3. **`dezimalbrueche` → `primfaktoren-ggt-kgv`**: BY M6 1.2 entscheidet „anhand der Primfaktorzerlegung des Nenners“,
   ob ein Bruch abbricht; das iCan verlangt diese Erklärung. Nur BY; HE nennt nur das Umwandeln. Mittel.
4. **`dezimalbrueche` → `umrechnung-groessen`**: HE (Einleitung Jg 6: „Die Verwendung der Kommaschreibweise bei
   Größenangaben führt auf Dezimalbrüche“) und BY M6 1.2 („die bislang nur bei Größen verwendete Kommaschreibweise“)
   führen Dezimalbrüche über Größen ein. Ein Zugang, aber keine zwingende Voraussetzung. Mittel.
5. **`zufall-laplace` → `zaehlprinzip`**: BY M8 5 („nutzen dabei auch das Zählprinzip“). Bei einfachen Laplace-Versuchen
   (ein Würfel) nicht nötig; aufgenommen ist nur die Kante vom Baumdiagramm. Mittel.
6. **`terme-variable` → `muster-zahlenfolgen`**: KMK S. 16 („führen Zahlenfolgen fort, auch unter Verwendung von
   Variablen als allgemeine Zahl“), NRW E Fkt-3 (Gesetzmäßigkeiten „mit Termen“). Ein guter Zugang zur Variable, aber
   nicht der einzige; nur NRW hat den Baustein. Mittel. `muster-zahlenfolgen` bleibt ohne Nachfolger (kein Problem: er
   hat eine Voraussetzung).
7. **`bogenmass` → `trigonometrie`** (behalten): Das Bogenmaß braucht das Gradmaß und den Kreisumfang, nicht Sinus und
   Kosinus. Behalten, weil HE (10.4) und NRW (Inhalt Sinusfunktionen) es erst im Zusammenhang mit den trigonometrischen
   Funktionen lehren und BY M10 3 es mit dem Einheitskreis verbindet. Ersetzt man die Kante durch `winkel-messen`,
   braucht `sinusfunktion` wieder `trigonometrie`.
8. **`kenngroessen-lage-streumasse` → `mittelwert`** (behalten): Median und Spannweite brauchen das Mittel nicht
   rechnerisch; die Länder lehren das Mittel aber früher (HE 6.1 vor 9.7) und vergleichen Median und Mittel (NRW E Sto-3).
9. **`parallel-senkrecht-abstand` → `messen-laenge-masse-geld-zeit`**: Abstände misst man als Längen. Längen messen ist
   aber schon Grundschulstoff. Mittel; deshalb bleibt der Baustein Wurzel.
10. **`zufall-gegenereignis` → `brueche-addieren-subtrahieren`** (1 − P(E)) und **`potenzfunktionen` →
    `quadratische-funktionen`** (HE 10.1 nach 9.3; die Normalparabel ist eine Potenzfunktion): beide mittel.
11. **Formal indirekt, im Unterricht direkt**: `winkelsaetze` braucht die Parallelen (Stufen-, Wechselwinkel),
    `bruchterme` das Kürzen und Erweitern von Brüchen, `potenzgesetze` die Potenzen. Diese Kanten sind entfernt, weil
    sie über die Kette folgen. Apps sollten diese Bausteine trotzdem auf einer Wiederholungsseite oder mit einem Link
    aufgreifen; das Listing meldet sie aber nicht mehr.
12. **App `mathe-stochastik`**: neue Warnung zu `zaehlprinzip` (6.1). Eine Wiederholungsseite vor dem Baumdiagramm würde
    sie beheben.

### 6.8 Nicht geöffnet

- Fachdidaktische Handbücher habe ich nicht gebraucht und nicht geöffnet.
- Den ersten Bericht der Mathematik-Karte („report.md“, Scratchpad einer früheren Sitzung) gibt es nicht mehr; die
  Quellen habe ich neu geöffnet.
- Alle anderen Quellen ließen sich öffnen.

Downloads: `/tmp/claude-0/-home-user/63cb6fc9-e6ad-586d-91c1-59230f4b1df1/scratchpad/src-mathematik/`. Listing:
`/tmp/claude-0/-home-user/63cb6fc9-e6ad-586d-91c1-59230f4b1df1/scratchpad/listing-mathematik-vorher.log` und
`…/listing-mathematik-nachher.log`.

### 6.9 Neue Bausteine (Owner, 2026-11-11)

Der Owner hat entschieden, den Vorschlag 6.6, Punkt 1 aufzunehmen. Punkt 2 (absolute Häufigkeit) gehört nicht zu
diesem Auftrag und bleibt offen. Ich habe die Fundstellen im Original nachgelesen (Downloads vom 10.11.2026, 6.2).

#### `geometrische-grundbegriffe`

- **iCan:** „Ich kann Punkt, Strecke, Gerade und Ebene unterscheiden und richtig benennen.“
- **Name:** Geometrische Grundbegriffe / Basic geometric terms
- **Strang:** `geometrie`, erster Baustein des Strangs
- **Richtstufe:** 5-6. Stimmen: HE 5 / BY 5 / NRW 5-6 → 5-6 (alle drei).
- **Quellen:**
  - KMK S. 20: „benennen und beschreiben geometrische Objekte … mit Hilfe mathematischer Modelle (Punkte, Winkel,
    Strecken, Geraden, Flächen, Körper)“ (ohne Jahrgang)
  - HE 5.2: „Geometrische Grundbegriffe: Punkt, Strecke, Fläche …; die Begriffe Gerade, Ebene einführen“
  - BY M5 2: „stellen Punkte, Strecken, Geraden und Kreise sorgfältig im kartesischen Koordinatensystem dar …
    abkürzende Schreibweisen für Strecken, Geraden und Kreise“
  - NRW E Geo-1: „erläutern Grundbegriffe und verwenden diese zur Beschreibung von ebenen Figuren und Körpern sowie
    deren Lagebeziehungen“
- Die KMK und alle drei Länder nennen den Inhalt. Damit gehört der Baustein in die Karte.

**Abweichung vom Vorschlag:** Das iCan nennt den **Strahl** nicht mehr. Keine der vier Quellen nennt Strahl oder
Halbgerade in diesem Zusammenhang (HE nennt „Halbebene“ erst im Übergangsprofil von Jahrgangsstufe 10 in die Oberstufe, Abschnitt 2).

#### Neue Kanten (2)

| Baustein | Voraussetzung | Grund | Fundstelle | Art |
|---|---|---|---|---|
| `parallel-senkrecht-abstand` | `geometrische-grundbegriffe` | Lagebeziehungen beschreibt man zwischen Punkten und Geraden; die Begriffe kommen zuerst. | HE 5.2 („Geometrische Grundbegriffe“ vor „Lagebeziehung von Geraden“ in einer Einheit); BY M5 2 (Lagebeziehungen „zwischen Punkt und Gerade, zwischen zwei Geraden“); NRW E Geo-1 | Quelle |
| `koordinatensystem` | `geometrische-grundbegriffe` | Im Koordinatensystem stellt man Punkte, Strecken und Geraden dar. | BY M5 2; HE 5.2 (Grundbegriffe und Koordinatensystem in einer Einheit) | Quelle |

`geometrische-grundbegriffe` selbst hat keine Voraussetzung. Er ist die neue Wurzel der Geometrie und löst
`parallel-senkrecht-abstand` als Wurzel ab. Er baut auf den geometrischen Figuren der Grundschule auf (BY M5 2,
Querverweis „Grundschule Mathematik 3/4: 2.2 Geometrische Figuren benennen und darstellen“).

`koordinatensystem` behält `natuerliche-zahlen`: Die Koordinaten sind Zahlen, und `natuerliche-zahlen` folgt nicht
über den neuen Baustein.

#### Entfernte Kanten

Keine. Keine bestehende Kante ist durch die neuen indirekt geworden: Kein Baustein hatte zugleich
`parallel-senkrecht-abstand` oder `koordinatensystem` und eine Kante, die jetzt über den neuen Baustein folgt.

#### Zahlen

| | Bausteine | Kanten | Wurzeln | allein | Teilnetze | Stufen |
|---|---|---|---|---|---|---|
| vorher | 127 | 187 | 3 | 0 | 1 | 15 |
| nachher | 128 | 189 | 3 | 0 | 1 | 15 |

Wurzeln nachher: `natuerliche-zahlen`, `groessenvorstellungen-schaetzen`, `geometrische-grundbegriffe`. Die Ketten der
Geometrie werden eine Stufe länger; die längste Kette der Karte (Algebra, Funktionen) bleibt bei 15 Stufen.

Geprüft: Messskript ohne Zeilen `LATE` und `INDIRECT`. `npm test` grün (111 bestanden, 1 übersprungen ohne Docker).

**Listing** der Apps `kniffel-trainer`, `mathe-algebra`, `mathe-arithmetik` und `mathe-stochastik` vorher und nachher:
gleich (bis auf die Zeitstempel). Keine App nutzt `parallel-senkrecht-abstand` oder `koordinatensystem`.

#### Offene Punkte

1. **Strahl:** Soll das iCan den Strahl (Halbgerade) nennen? Die Quellen tun es nicht; viele Schulbücher schon.
   Lehrkräfte entscheiden.
2. **Weitere Kanten zu `geometrische-grundbegriffe`:** Auch `grundfiguren-eben` und `grundkoerper-quader-wuerfel`
   nutzen die Begriffe (NRW E Geo-1: ebene Figuren und Körper). Sie folgen schon über `parallel-senkrecht-abstand`
   bzw. `grundfiguren-eben`; eine direkte Kante wäre indirekt.
3. **Absolute Häufigkeit und Strichliste** (6.6, Punkt 2): weiter offen.
