# Recherche Lernlandkarte Chemie, Gymnasium Sekundarstufe I

Grundlage für `map/chemie.yaml`. Methode: `.agents/skills/map-research/SKILL.md`,
Format: `docs/learning-map-contract.md`.

**Hinweis zur Datei:** Der erste Bericht zum Modell (Stränge, Bausteine, Richtstufen) hieß `report.md` und lag nicht
im Repo; der Kopf von `map/chemie.yaml` verwies auf ihn. Er ist nicht mehr auffindbar (auch nicht in der
git-Historie). Diese Datei beginnt deshalb mit der Überarbeitung der `requires`. Die Fundstellen der Bausteine stehen
weiter als Kommentar an jedem Baustein in `map/chemie.yaml`. Der Kopf der Karte verweist jetzt auf diese Datei.

## requires überarbeitet (2026-11-10, feat/map-chains)

Auftrag des Owners: Die Bausteine stehen in der fachlich richtigen Reihenfolge; wenige Wurzeln, keine allein
stehenden Bausteine; jede neue Kante mit Begründung (Skill `map-research`, Abschnitt „Connect every competency“).
Ich habe für jede Wurzel beide Richtungen geprüft (Was braucht der Baustein? Was baut auf ihm auf?) und alle
bestehenden Kanten auf indirekte und falsche Kanten durchgesehen. Die Begründung jeder neuen Kante steht als
Kommentar `# requires …` am Baustein. Ids, `gradeBand`, `status`, `iCan` und Stränge sind unverändert; kein Baustein
ist neu.

### 1. Zahlen

| | Bausteine | Kanten | Wurzeln | allein | Teilnetze | Stufen |
|---|---|---|---|---|---|---|
| vorher | 75 | 112 | 5 | 0 | 1 | 14 |
| nachher | 75 | 107 | 3 | 0 | 1 | 16 |

Geprüft mit dem Messskript: keine Kreise, keine Voraussetzung mit späterer Richtstufe, keine indirekte Kante (vorher
3 indirekte Kanten). `npm test` grün (ein Test ohne Docker übersprungen).

Die Karte war schon gut verbunden. Die Änderung betrifft vor allem den Anfang des Fachs: Zuerst kommen die
Stoffeigenschaften (Stoffebene), dann Reinstoffe, Teilchenmodell und Atommodell (Teilchenebene). Das Gesetz der
Massenerhaltung steht jetzt vor dem Daltonschen Atommodell, das es erklärt. Dadurch wurde die Kette um zwei Stufen
länger (14 → 16).

### 2. Quellen

Alle Quellen habe ich am 10.11.2026 neu heruntergeladen und gelesen (PDF mit `pdftotext`, LehrplanPLUS als HTML).
Seitenzahlen sind die gedruckten Seiten.

| Kürzel | Titel | Ausgabe | URL |
|---|---|---|---|
| KMK | KMK: Weiterentwickelte Bildungsstandards in den Naturwissenschaften für das Fach Chemie (Mittlerer Schulabschluss) | Beschluss vom 16.12.2004 i. d. F. vom 13.06.2024; PDF vom 25.07.2024, 16 S. | https://www.kmk.org/fileadmin/Dateien/veroeffentlichungen_beschluesse/2024/2024_06_13-WeBiS_Chemie_MSA.pdf |
| HE | Hessisches Kultusministerium: Kerncurriculum für Hessen, Sekundarstufe I – Gymnasium, Chemie | Fassung 2011, 45 S. | https://kultus.hessen.de/sites/kultus.hessen.de/files/2021-06/kerncurriculum_chemie_gymnasium-1.pdf (gefunden über https://kultus.hessen.de/Unterricht/Sekundarstufe-I-Kerncurricula; die Adresse ohne „-1“ liefert kein PDF) |
| BY | ISB Bayern: LehrplanPLUS Gymnasium, Fachlehrpläne Chemie 8, 9, 10 (naturwissenschaftlich-technologisches Gymnasium) | Online-Fassung, abgerufen am 10.11.2026 | https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/8/chemie · https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/9/chemie/ch-ntg · https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/10/chemie/ch-ntg (die Fassung der anderen Zweige: …/9/chemie/ch, …/10/chemie/ch) |
| NW | MSB NRW: Kernlehrplan für die Sekundarstufe I Gymnasium in Nordrhein-Westfalen, Chemie | Heft 3415, 1. Auflage 2019 | https://lehrplannavigator.nrw.de/system/files/media/document/file/g9_ch_klp_3415_2019_06_23.pdf |
| ZPG (neu, Fachdidaktik) | ZPG Chemie Baden-Württemberg (A. Konrad): Das Teilchenmodell in Klasse 8. Stoffe und ihre Teilchen – eine Leitlinie des Chemieunterrichts. Materialien der Lehrerfortbildung | Juni 2010 / Februar 2011, 50 S. | https://www.lehrerfortbildung-bw.de/u_matnatech/chemie/gym/bp2004/fb2/modul2/das_teilchenmodell_in_klasse_8_zpg.pdf |

**ZPG** begründet hier nur `requires`, keinen Baustein und keine Richtstufe. S. 2 („Gliederung“) beschreibt den
Aufbau in drei Schritten: Das Stoffteilchenmodell „ist ein Modell kleiner Teilchen, aber kein Atommodell“ und
erklärt Aggregatzustände und Lösungsvorgänge. Das Daltonsche Atommodell „erweitert das Stoffteilchenmodell“, ordnet
Elemente, Verbindungen und Gemische, ist die Grundlage der Formelsprache und erklärt die Massenerhaltung. Das
Kern-Hülle-Modell erweitert das Daltonsche Modell und ist die Grundlage für Ionen. Das stützt die bestehenden Kanten
`daltonsches-atommodell` → `teilchenmodell`, `formeln-von-verbindungen` → `daltonsches-atommodell` und
`atombau-bausteine` → `daltonsches-atommodell` sowie die neue Kante zur Massenerhaltung.

**Wichtige Fundstellen für Kanten:**
- BY Chemie 8, LB 2 heißt „Stoffe und ihre Eigenschaften – Von beobachtbaren Stoffeigenschaften zum
  Teilchenmodell“. Kompetenzerwartung: „beschreiben die Eigenschaften von Stoffen … Dabei erläutern sie die
  Notwendigkeit definierter Kenneigenschaften zur Charakterisierung und Identifizierung eines Reinstoffes“.
- BY Chemie 8, LB 3: „wenden das Daltonsche Atommodell an, um Massenerhaltung und Stoffänderungen mit der
  Umgruppierung von Atomen auf der Teilchenebene zu erklären“.
- NW IF1, S. 20: „Reinstoffe aufgrund charakteristischer Eigenschaften (Schmelztemperatur/Siedetemperatur,
  Dichte, Löslichkeit) identifizieren“.
- NW IF3, S. 23: „Ein einfaches Atommodell ermöglicht eine Erklärung des Gesetzes von der Erhaltung der Masse“.
- HE S. 30 („Der Mix macht's“): „Vergleich von Stoffeigenschaften und Zusammensetzung von Gemischen“;
  HE S. 33 („Blick hinter die Kulissen“): „Teilchenmodell zur Deutung von Phänomenen“.
- KMK S. 15: „Reinstoffe und Stoffgemische, Elemente und Verbindungen als Ordnungssysteme auf der makroskopischen
  Ebene“.

### 3. Neue Kanten (3)

| Baustein | Voraussetzung | Grund | Fundstelle | Art |
|---|---|---|---|---|
| `reinstoffe-und-gemische` | `stoffeigenschaften-beschreiben` | Einen Reinstoff erkennt man an seinen Kenneigenschaften (Schmelz- und Siedetemperatur, Dichte, Löslichkeit). | NW IF1 S. 20; BY 8 LB 2; HE S. 30 | Quelle |
| `teilchenmodell` | `stoffeigenschaften-beschreiben` | Das Teilchenmodell erklärt beobachtete Eigenschaften; erst die Beobachtung, dann das Modell. | BY 8 LB 2 (Titel); HE S. 33; ZPG S. 2 | Quelle |
| `daltonsches-atommodell` | `massenerhaltung` | Das Atommodell erklärt das Gesetz von der Erhaltung der Masse; der Befund auf der Stoffebene kommt vor dem Modell. | NW IF3 S. 23; BY 8 LB 3; ZPG S. 2 | Quelle |

### 4. Entfernte Kanten (8)

| Baustein | Voraussetzung | Grund |
|---|---|---|
| `gasnachweise` | `sicherheit-beim-experimentieren` | Indirekt (vorher schon): folgt über `stoffeigenschaften-beschreiben`. |
| `hauptgruppen` | `periodensystem-lesen` | Indirekt (vorher schon): folgt über `schalenmodell` → `ordnungszahl-und-massenzahl`. |
| `reaktionsgleichung-aufstellen` | `daltonsches-atommodell` | Indirekt (vorher schon): folgt über `formeln-von-verbindungen`. |
| `reaktionsgleichung-aufstellen` | `massenerhaltung` | Jetzt indirekt: folgt über `formeln-von-verbindungen` → `daltonsches-atommodell`. |
| `stoffmenge-und-molare-masse` | `massenerhaltung` | Jetzt indirekt (wie oben). Zudem braucht der Baustein selbst die Massenerhaltung nicht; sie wird erst beim Rechnen mit Reaktionsgleichungen gebraucht, und `stoechiometrische-berechnung` hat sie über `reaktionsgleichung-aufstellen`. |
| `gemische-trennen` | `stoffeigenschaften-beschreiben` | Jetzt indirekt: folgt über `reinstoffe-und-gemische`. |
| `metalle-und-nichtmetalle` | `stoffeigenschaften-beschreiben` | Jetzt indirekt: folgt über `periodensystem-lesen` → `symbole-der-elemente` → `elemente-und-verbindungen` → `reinstoffe-und-gemische`. |
| `massenerhaltung` | `teilchenmodell` | Falsch als direkte Kante: Das Gesetz ist ein Befund auf der Stoffebene (Wägung). Erklärt wird es mit dem Atommodell, nicht mit dem einfachen Teilchenmodell, das „kein Atommodell“ ist (ZPG S. 2; NW IF3 S. 23; BY 8 LB 3). Die Erklärung im iCan („zeigen und erklären“) leistet `daltonsches-atommodell`, das jetzt auf `massenerhaltung` aufbaut. Am Baustein steht dazu eine Zeile `requires changed`. |

### 5. Wurzeln, die bleiben (3, davon 0 allein)

| Baustein | Grund |
|---|---|
| `sicherheit-beim-experimentieren` | Anfang des Fachs: BY 8 beginnt mit LB 1 (Gefahrstoffe, Laborregeln); HE nennt das Gefahrenpotenzial in der ersten Einheit „Welt der Stoffe“ (S. 30). Braucht keinen Baustein der Karte. `stoffeigenschaften-beschreiben` baut darauf auf. |
| `aggregatzustaende-beschreiben` | Vorwissen aus dem Alltag und aus Physik oder Naturwissenschaften der früheren Jahrgänge; die drei Länder behandeln es in der ersten Einheit (BY 8 LB 2, NW IF1, HE „Verwandlungen“). Schmelz- und Siedetemperatur, Aggregatzustände im Teilchenmodell und die Abgrenzung von chemischen Reaktionen bauen darauf auf. Eine Kante zu `stoffeigenschaften-beschreiben` ist nur mittel sicher (offener Punkt 1). |
| `energieformen-unterscheiden` | Anfang des Strangs Energie; die Energieformen kennen die Lernenden aus der Physik. Braucht keinen Baustein der Karte. Energieumwandlung bei Reaktionen baut darauf auf. |

**Allein:** keiner. **Teilnetze:** eines.

### 6. Vorgeschlagene neue Bausteine

Keine. Für alle Wurzeln fand sich ein Grund, warum sie Anfang sein dürfen; eine Lücke im Modell hat die Prüfung
nicht gezeigt.

### 7. Offene Punkte (auch Kanten mit mittlerer Zuversicht, nicht in der Karte)

1. **`aggregatzustaende-beschreiben` → `stoffeigenschaften-beschreiben`:** BY 8 LB 2 nennt Aggregatzustände
   neben den Kenneigenschaften, NW IF1 im selben Inhaltsfeld. Zum Benennen der Zustände und Übergänge braucht man die
   Stoffeigenschaften aber nicht; der Baustein bleibt Wurzel.
2. **`oxidation-und-reduktion` → `reaktionsgleichung-aufstellen`** bleibt, ist aber fraglich: NW lehrt die
   Sauerstoffübertragung in IF3/IF4 (Jg. 7/8 nach den Schulplänen), Reaktionsgleichungen erst in IF6 (Jg. 8). Für das
   iCan („als Aufnahme und Abgabe von Sauerstoff beschreiben“) reicht vielleicht `wortgleichung`. Lehrkräfte sollten
   entscheiden.
3. **`elektronenpaarbindung` → `atome-ionen-und-molekuele-unterscheiden`** und **`ionen-bilden` →
   `atome-ionen-und-molekuele-unterscheiden`:** Beide Bausteine setzen den Begriff Molekül bzw. Ion voraus. Die
   Begriffe lassen sich aber auch im Baustein selbst einführen; keine Quelle verbindet die Bausteine direkt.
   Mittlere Zuversicht.
4. **`temperatur-und-reaktionsgeschwindigkeit` → `aktivierungsenergie`:** Den Einfluss der Temperatur erklärt man
   oft mit der Aktivierungsenergie. KMK S 1.7 nennt nur die Temperatur; keines der drei Länder nennt den Baustein.
   Mittlere Zuversicht.
5. **App `anorganische-chemie`** (Listing, Abschnitt 8): Die neue Kante `reinstoffe-und-gemische` →
   `stoffeigenschaften-beschreiben` ergibt eine neue Warnung: Die Seite `stoffe/reinstoffe-gemische/` steht vor der
   Seite zu den Stoffeigenschaften (Seite 2). Die App sollte die Seiten tauschen.
6. Die bestehenden Kanten (ohne die neuen) haben noch keine eigene Zeile `# requires …`. Ihre Begründung steht in
   den Fundstellen am Baustein.
7. Der erste Bericht (`report.md`) fehlt (siehe Hinweis oben). Die Quellen IMPL (KMK-Implementationsbroschüre) und
   die zwei NRW-Schulpläne (Hildegardis-Gymnasium Bochum, Couven-Gymnasium Aachen), die der Kopf der Karte nennt,
   haben deshalb hier keine URL. Für die `requires` habe ich sie nicht gebraucht.

### 8. Vergleich des Listings (Apps des Fachs)

Die Karte hat kein `explainerFocus: competency`. Zwei Einträge nutzen Chemie: `entries/anorganische-chemie.yaml`
und `entries/chemie-reaktionen.yaml`. Ich habe `npm run listing` vorher und nachher verglichen.

- **`anorganische-chemie`:** vorher 5 Warnungen (Regel `entry-learning-map`), nachher 6. Neu ist nur die Warnung aus
  offenem Punkt 5. Die fünf alten Warnungen bleiben (u. a. `stoffeigenschaften-beschreiben` braucht
  `sicherheit-beim-experimentieren`, das die App nicht übt).
- **`chemie-reaktionen`:** vorher bestanden, nachher bestanden. Ein Lauf meldete einmal vier Fehler auf der Seite
  `reaktionen/einschaetzung/` (Barrierefreiheit, Breite bei 360 px). Ein zweiter Lauf mit derselben neuen Karte und
  ein Lauf mit der alten Karte waren fehlerfrei; die Meldung war zufällig und hat mit der Karte nichts zu tun.

### 9. Nicht geöffnet

- Fachdidaktische Handbücher der Chemie (z. B. Barke, Harsch & Schmid: Essentials of Chemical Education; Sommer,
  Wambach-Laicher & Pfeifer: Konkrete Fachdidaktik Chemie) sind nicht frei online; nicht geöffnet, nicht zitiert.
- Die Fassungen von BY Chemie 9 und 10 unter `…/9/chemie` und `…/10/chemie` (ohne Zweig) zeigen nur die
  Startseite; geöffnet habe ich die Fassungen mit Zweig (siehe Quellen).
- Sonst fehlte keine Quelle.
