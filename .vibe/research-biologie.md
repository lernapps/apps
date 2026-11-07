# Recherche Lernlandkarte Biologie, Gymnasium Sekundarstufe I (Jg 5–10)

Grundlage für `map/biologie.yaml`. Nichts davon liegt im Repository. Methode: `.claude/skills/map-research/SKILL.md`,
Format: `docs/learning-map-contract.md`. Abgerufen am 07.11.2026.

**Ergebnis in Kürze:** 92 Bausteine in den vier KMK-Strängen: `zellen` 17, `vielfalt` 27, `mensch` 32, `umwelt` 16.
Richtstufen: 39 × 5-6, 17 × 7-8, 36 × 9-10. Zwei Bausteine sind schwach belegt. Geprüft per Skript: ids eindeutig und
im Format des Vertrags, jedes iCan beginnt mit „Ich kann“, alle requires verweisen auf vorhandene ids, keine
späteren Richtstufen, keine Zyklen.

## 1. Quellen

Kürzel wie in `map/physik.yaml` und `map/chemie.yaml`. Alle Quellen habe ich im Original geöffnet (PDF per
`pdftotext`, LehrplanPLUS als HTML-Seite).

| Kürzel | Titel | Ausgabe | URL (genau so geöffnet) | Fundstellen |
|---|---|---|---|---|
| KMK | KMK: Weiterentwickelte Bildungsstandards in den Naturwissenschaften für das Fach Biologie (MSA) | Beschluss vom 16.12.2004 i. d. F. vom 13.06.2024 (PDF vom 17.12.2024, 16 S.) | https://www.kmk.org/fileadmin/Dateien/veroeffentlichungen_beschluesse/2024/2024_06_13-WeBiS_Biologie_MSA.pdf (die Datei ist bytegleich mit der vorab geladenen `src-bio/kmk-bio.pdf`, gleiche MD5-Summe) | „Verbindliche inhaltliche Aspekte“, S. 15 |
| HE | Hessisches Kultusministerium: Bildungsstandards und Inhaltsfelder – Das neue Kerncurriculum für Hessen, Sekundarstufe I – Gymnasium, Biologie | Fassung 2011 (Jahr nicht im Dokument; PDF erstellt am 28.02.2011, auf der Website seit 06/2021); 58 S. | https://kultus.hessen.de/sites/kultus.hessen.de/files/2021-06/kerncurriculum_biologie_gymnasium.pdf (gefunden über https://kultus.hessen.de//Unterricht/Sekundarstufe-I-Kerncurricula) | Kap. 6 Inhaltsfelder bis Ende Jg 9/10, S. 28–32; Kap. 7.1 bis Ende Jg 6, S. 36–39; Kap. 7.2 Jg 8 „entfällt“, S. 40; Kap. 7.3 Übersicht der Schwerpunkte „Jahrgangsstufe 5/6“ und „zusätzlich nach Abschluss der Jahrgangsstufe 9/10“, S. 41–48 |
| BY | ISB Bayern: LehrplanPLUS Gymnasium, Fachlehrpläne | Online-Fassung, abgerufen am 07.11.2026. Die PDF-Gesamtlehrpläne sind laut https://www.lehrplanplus.bayern.de/gesamtlehrplaene derzeit in Überarbeitung (voraussichtlich Q4 2026), daher die Online-Fassung | NT5: https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/5/nt_gym · NT6: https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/6/nt_gym · NT7: https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/7/nt_gym · B8: https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/8/biologie · B9: https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/9/biologie · B10: https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/10/biologie | NT5 „2 Schwerpunkt Biologie“ (2.1–2.5); NT6 „1 Schwerpunkt Biologie“ (1.1–1.5); NT7 hat keinen Biologie-Anteil (Physik und Informatik); Biologie 8 LB 1–6, Biologie 9 LB 1–6, Biologie 10 LB 1–4. Ein Fach Biologie 6 oder 7 gibt es nicht |
| NW | MSB NRW: Kernlehrplan für die Sekundarstufe I Gymnasium in Nordrhein-Westfalen, Biologie | Heft 3413, 1. Auflage 2019 (RdErl. v. 23.06.2019, in Kraft ab 01.08.2019, aufsteigend ab Kl. 5); 42 S. | https://lehrplannavigator.nrw.de/system/files/media/document/file/g9_bi_klp_-3413_2019_06_23.pdf (gefunden über https://lehrplannavigator.nrw.de/sekundarstufe-i/kernlehrplaene-fuer-das-gymnasium-ab-sj-20192020/biologie-gymnasium) | Kap. 2.2 bis Ende Erprobungsstufe: IF1 S. 22 f., IF2 S. 24 f., IF3 S. 25 f.; Kap. 2.3 bis Ende Sek I: IF4 S. 30 f., IF5 S. 32, IF6 S. 33 f., IF7 S. 35 f., IF8 S. 37 (Seiten der PDF) |
| SiLP (nur Hinweis) | QUA-LiS NRW: Beispiel für einen schulinternen Lehrplan, Gymnasium Sek I, Biologie | Fassung vom 31.01.2020 | https://lehrplannavigator.nrw.de/system/files/media/document/file/g9_bi_silp_2020_01_31-1.pdf | Übersicht der Unterrichtsvorhaben: IF1–3 in Jg 5/6; IF4, IF5 und Teile von IF8 in Jg 8; IF6, IF7, IF8 in Jg 10 |

Hinweis zur Stufung in HE und NW: Beide Dokumente nennen für Biologie nur zwei Stufen. HE: „Jahrgangsstufe 5/6“
und „zusätzlich dazu nach Abschluss der Jahrgangsstufe 9/10“ (Kap. 7.3); Kap. 7.2 (Ende Jg 8) „entfällt“, weil sich
nach der Stundentafel keine Erwartungen für Jg 8 formulieren lassen (S. 40). NW: „bis zum Ende der Erprobungsstufe“
(IF1–3) und „bis zum Ende der Sekundarstufe I“ (IF4–8). Jahrgänge nennt nur das NRW-Schulbeispiel (SiLP). Ich
verwende es nur als Hinweis, so wie in den Spalten unten angegeben.

## 2. Bausteine je Strang

Lesehilfe: **Stimmen** = HE / BY / NW. „7-10“ heißt: zweite Stufe des Landes ohne Jahrgang (zählt für 7-8 und 9-10, siehe 3.1). „–“ = nicht genannt. **(schwach)** = schwach belegt (weniger als zwei Länder oder nur ein Teil des Bausteins belegt, Grund in der Spalte). KMK-Kürzel: Z/V/M/U = Inhaltsbereich, Ziffer = Zeile der Liste auf S. 15 (z. B. Z3 = „Fotosynthese und Zellatmung“).

### Strang `zellen`: Lebewesen bestehen aus Zellen (Cells) – 17 Bausteine

| # | id | iCan | KMK | HE | BY | NW | Stimmen HE/BY/NW → Richtstufe | requires |
|---|---|---|---|---|---|---|---|---|
| 1 | `kennzeichen-des-lebendigen` | Ich kann an den Kennzeichen des Lebendigen erklären, ob etwas ein Lebewesen ist. | Z1 Kennzeichen des Lebendigen | – | NT5 2.2 (Jg 5): grundlegende Anforderungen an Lebewesen | IF1 (Stufe 1): Kennzeichen des Lebendigen | – / 5-6 / 5-6 → **5-6** (Mehrheit) | – |
| 2 | `mikroskopieren` | Ich kann die Teile eines Lichtmikroskops benennen und ein Präparat damit scharf einstellen. | Z2 Zellen (Erkenntnisgewinnung) | 9/10: Mikroskopieren und Zeichnen (KC 7.3, S. 41) | NT5 2.1 (Jg 5): Mikroskopieren, Teile des Lichtmikroskops | IF1 (Stufe 1): Präparate mikroskopisch untersuchen | 7-10 / 5-6 / 5-6 → **5-6** (Mehrheit) | – |
| 3 | `praeparat-und-zeichnung` | Ich kann ein einfaches Frischpräparat herstellen und davon eine beschriftete Zeichnung anfertigen. | Z2 Zellen | 9/10: Anfertigen von Präparaten, Zeichnen von Zellen (S. 41) | NT5 2.1 (Jg 5): einfache Präparate, beschriftete Zeichnungen | IF1 (Stufe 1): Zellen nach Vorgaben zeichnen | 7-10 / 5-6 / 5-6 → **5-6** (Mehrheit) | `mikroskopieren` |
| 4 | `tierzelle-pflanzenzelle` | Ich kann Tier- und Pflanzenzellen an Zellmembran, Zellplasma, Zellkern, Zellwand, Vakuole und Chloroplasten unterscheiden. | Z2 Zellen | 9/10: Zellaufbau ausgewählter Zellen (S. 41) | NT5 2.2 (Jg 5): tierische und pflanzliche Zellen, Zellbestandteile | IF1 (Stufe 1): Zellen anhand lichtmikroskopischer Strukturen unterscheiden | 7-10 / 5-6 / 5-6 → **5-6** (Mehrheit) | `kennzeichen-des-lebendigen`, `praeparat-und-zeichnung` |
| 5 | `organisationsebenen` | Ich kann an einem Beispiel die Ebenen Zelle, Gewebe, Organ, Organsystem und Organismus ordnen. | Z2 Zellen; M1 Organsysteme | 5/6: Aufgabenteilung im Organismus; 9/10: Gewebe, Vernetzung zum System (S. 43) | NT5 2.2 (Jg 5): Gewebe mikroskopieren; NT5 2.3: Organisationsebenen | IF1/IF2 (Stufe 1), Basiskonzept System: Zelle – Gewebe – Organ – Organismus | 5-6 / 5-6 / 5-6 → **5-6** (Mehrheit) | `tierzelle-pflanzenzelle` |
| 6 | `fotosynthese` | Ich kann die Fotosynthese als Wortgleichung angeben und erklären, warum Pflanzen, Tiere und Menschen auf sie angewiesen sind. | Z3 Fotosynthese | 5/6: grundlegende phänomenologische Aspekte der Fotosynthese (S. 44) | NT6 1.2 (Jg 6): Photosynthese, Bedeutung für das Leben auf der Erde | IF1 (Stufe 1): Fotosynthese als Reaktionsschema in Worten, Bedeutung | 5-6 / 5-6 / 5-6 → **5-6** (Mehrheit) | `tierzelle-pflanzenzelle`, `pflanzenorgane` |
| 7 | `zellatmung` | Ich kann die Zellatmung als Wortgleichung angeben und erklären, wozu Zellen Sauerstoff und Nährstoffe brauchen. | Z3 Zellatmung | 5/6: grundlegende phänomenologische Aspekte zur Atmung (S. 44) | NT5 2.3 (Jg 5): Zellatmung, einfaches Reaktionsschema | IF4 (Stufe 2; SiLP 8.8): Grundprinzip der Zellatmung | 5-6 / 5-6 / 7-10 → **5-6** (Mehrheit) | `tierzelle-pflanzenzelle` |
| 8 | `fotosynthese-und-zellatmung` | Ich kann Fotosynthese und Zellatmung als Stoff- und Energieumwandlungen vergleichen und erklären, wie sie zusammenhängen. | Z3 Fotosynthese und Zellatmung | 9/10: Vernetzung zu auf- und abbauenden Stoffwechselprozessen (S. 44) | NT6 1.2 (Jg 6): Zusammenhang stofflich und energetisch | IF4 (Stufe 2; SiLP 8.8): Fotosynthese der Zellatmung gegenüberstellen | 7-10 / 5-6 / 7-10 → **7-8** (Mitte (BY 5-6, HE/NW nur Stufe 2)) | `fotosynthese`, `zellatmung` |
| 9 | `zellatmung-energie` | Ich kann erklären, wie Zellen bei der Zellatmung Energie aus Glucose für Bewegung, Wachstum und Körperwärme bereitstellen. | Z3 Zellatmung | 9/10: Stoff- und Energieumwandlung (S. 30) | B10 3.4 (Jg 10): Glucoseabbau, ATP, aerob/anaerob | IF7 (Stufe 2; SiLP 10.2): Bedeutung der Glucose für den Energiehaushalt der Zelle | 7-10 / 9-10 / 7-10 → **9-10** (Mehrheit) | `fotosynthese-und-zellatmung`, `naehrstoffe` |
| 10 | `proteine` | Ich kann beschreiben, dass Proteine aus Aminosäuren bestehen und im Körper als Baustoffe, Enzyme, Hormone oder Antikörper viele Aufgaben haben. | Z4 Enzymreaktion (Voraussetzung) | – | B9 3.1 (Jg 9): Vielfalt der Proteine; B10 3.1: Aufbau aus Aminosäuren | IF6 (Stufe 2; SiLP 10.4): funktionelle Vielfalt der Proteine | – / 9-10 / 7-10 → **9-10** (Mehrheit) | `naehrstoffe` |
| 11 | `enzyme` | Ich kann mit dem Schlüssel-Schloss-Modell erklären, wie ein Enzym einen Stoff umsetzt, und dass Temperatur und pH-Wert seine Wirkung beeinflussen. | Z4 Enzymreaktion | 9/10: Schlüssel-Schloss-Prinzip (S. 41) | B10 3.2 (Jg 10): Enzyme, Schlüssel-Schloss-Modell, Temperatur, pH | IF2 (Stufe 1): Verdauungsenzyme mit einfachen Modellen; IF6/IF7 (Stufe 2): Schlüssel-Schloss-Modell<br>Hinweis: Temperatur und pH nur BY; NW führt das Enzymmodell schon in Stufe 1 ein | 7-10 / 9-10 / 5-6 → **9-10** (Mehrheit) | `proteine`, `verdauungsorgane` |
| 12 | `bakterienzelle` | Ich kann den Bau einer Bakterienzelle beschreiben, sie von Tier- und Pflanzenzellen abgrenzen und erklären, wie sich Bakterien durch Zweiteilung schnell vermehren. | Z2 Zellen | 9/10: Vermehrung bei Bakterien (S. 45) | B9 LB2 (Jg 9): prokaryotische Zelle, Zweiteilung, exponentielles Wachstum | IF7 (Stufe 2; SiLP 10.1): Bau der Bakterienzelle, Vermehrung | 7-10 / 9-10 / 7-10 → **9-10** (Mehrheit) | `tierzelle-pflanzenzelle` |
| 13 | `viren` | Ich kann den Bau eines Virus beschreiben und erklären, warum sich Viren nur in Wirtszellen vermehren können. | Z1 Kennzeichen des Lebendigen (Grenzfall); M2 | 9/10: Vermehrung bei Viren (S. 45) | B10 LB2 (Jg 10): Bau und lytischer Vermehrungszyklus | IF7 (Stufe 2; SiLP 10.1): Aufbau und Vermehrung von Viren | 7-10 / 9-10 / 7-10 → **9-10** (Mehrheit) | `bakterienzelle`, `kennzeichen-des-lebendigen` |
| 14 | `dna-modell` | Ich kann mit einem einfachen DNA-Modell erklären, wie die Erbinformation in der DNA gespeichert ist. | Z2 Zellen; V2 Vererbung | 9/10: vereinfachtes DNA-Modell (S. 41, 45) | B9 3.1 (Jg 9): einfaches DNA-Modell | IF6 (Stufe 2; SiLP 10.4): DNA | 7-10 / 9-10 / 7-10 → **9-10** (Mehrheit) | `tierzelle-pflanzenzelle` |
| 15 | `chromosomen` | Ich kann den Bau eines Chromosoms beschreiben und Ein-Chromatid-, Zwei-Chromatid- und homologe Chromosomen unterscheiden. | Z2 Mitose, Meiose (Voraussetzung) | 9/10: Chromosomenmodell (S. 41) | B9 3.2 (Jg 9): Chromosomen, Replikation, Ein-/Zwei-Chromatid-Chromosomen | IF6 (Stufe 2; SiLP 10.4): Chromosomen | 7-10 / 9-10 / 7-10 → **9-10** (Mehrheit) | `dna-modell` |
| 16 | `mitose` | Ich kann den Zellzyklus mit der Mitose beschreiben und erklären, warum dabei erbgleiche Tochterzellen entstehen. | Z2 Mitose | 9/10: Zellteilungsprozesse, Mitose (S. 45) | B9 3.2 (Jg 9): Zellzyklus, Mitose | IF6 (Stufe 2; SiLP 10.4): Zellzyklus, Mitose | 7-10 / 9-10 / 7-10 → **9-10** (Mehrheit) | `chromosomen` |
| 17 | `meiose` | Ich kann das Prinzip der Meiose beschreiben und erklären, warum Keimzellen einen einfachen Chromosomensatz haben und Geschwister verschieden sind. | Z2 Meiose; V2 genetische Variabilität | 9/10: Keimzellbildung, Meiose (S. 45) | B9 3.3 (Jg 9): Meiose, Neukombination | IF6 (Stufe 2; SiLP 10.4): Meiose und Befruchtung | 7-10 / 9-10 / 7-10 → **9-10** (Mehrheit) | `mitose`, `befruchtung-schwangerschaft` |

### Strang `vielfalt`: Vielfalt und Veränderung von Lebewesen (Diversity and change of living things) – 27 Bausteine

| # | id | iCan | KMK | HE | BY | NW | Stimmen HE/BY/NW → Richtstufe | requires |
|---|---|---|---|---|---|---|---|---|
| 18 | `wirbeltierklassen` | Ich kann die fünf Wirbeltierklassen an Körperbedeckung, Atmung, Körpertemperatur und Fortpflanzung unterscheiden und ein Tier einer Klasse zuordnen. | V3 Verwandtschaft; U2 Artenkenntnis | 5/6: Bau und Funktion von Organen von Wirbeltieren, Körperformen (S. 41) | NT6 1.4 (Jg 6): charakteristische Eigenschaften der Wirbeltierklassen | IF1 (Stufe 1): Wirbeltierklassen vergleichen und zuordnen | 5-6 / 5-6 / 5-6 → **5-6** (Mehrheit) | – |
| 19 | `angepasstheit-fortbewegung` | Ich kann an Beispielen erklären, wie der Körperbau von Fischen, Vögeln und Säugetieren an die Fortbewegung im Wasser, in der Luft oder an Land angepasst ist. | V3 Angepasstheit | 5/6: Körperbau, Lebensweise und Lebensraum (S. 47) | NT6 1.3 (Jg 6): Fortbewegung im Wasser, an Land, in der Luft | IF1 (Stufe 1): Angepasstheit von Säugetieren und Vögeln (Skelett, Fortbewegung) | 5-6 / 5-6 / 5-6 → **5-6** (Mehrheit) | `wirbeltierklassen` |
| 20 | `angepasstheit-ernaehrung` | Ich kann an Gebiss und Verdauung von Pflanzenfressern und Fleischfressern erklären, wie Tiere an ihre Nahrung angepasst sind. | V3 Angepasstheit | 5/6: Körperbau und artspezifische Lebensweise (S. 47) | NT6 1.3 (Jg 6): Fleisch- und Pflanzenfresser, Nahrungserwerb | IF1 (Stufe 1): Angepasstheit beim Nahrungserwerb | 5-6 / 5-6 / 5-6 → **5-6** (Mehrheit) | `wirbeltierklassen` |
| 21 | `ueberwinterung` | Ich kann erklären, wie wechselwarme und gleichwarme Tiere mit Kältestarre, Winterschlaf, Winterruhe oder Vogelzug den Winter überstehen. | V3 Angepasstheit | 5/6: Regelung der Körpertemperatur (S. 44) | NT6 1.3 (Jg 6): Temperaturregulation, Winterschlaf, Winterruhe, Vogelzug | IF4 (Stufe 2): Einfluss der Jahreszeiten | 5-6 / 5-6 / 7-10 → **5-6** (Mehrheit) | `wirbeltierklassen` |
| 22 | `fortpflanzung-wirbeltiere` | Ich kann Fortpflanzung und Entwicklung von Wirbeltieren vergleichen, zum Beispiel äußere und innere Befruchtung, Metamorphose, Nesthocker und Nestflüchter. | V3 Angepasstheit | 5/6: Fortpflanzungsstrategien bei Wirbeltieren (S. 45) | NT6 1.3 (Jg 6): Fortpflanzung im Wasser/an Land, Metamorphose, Nesthocker | IF1 (Stufe 1): Fortpflanzung oder Individualentwicklung | 5-6 / 5-6 / 5-6 → **5-6** (Mehrheit) | `wirbeltierklassen` |
| 23 | `zuechtung-und-haltung` | Ich kann erklären, wie aus Wildtieren durch Züchtung Haus- und Nutztiere wurden, und Formen der Nutztierhaltung bewerten. | V3 Verwandtschaft (Beispiel) | 5/6: Abstammung und Züchtung, Wild- und Nutzformen, Bewertung der Haltung (S. 47) | NT6 1.4 (Jg 6): Züchtung, tiergerechte Haltung | IF1 (Stufe 1): Wild- und Nutztiere, Nutztierhaltung erörtern | 5-6 / 5-6 / 5-6 → **5-6** (Mehrheit) | `wirbeltierklassen` |
| 24 | `pflanzenorgane` | Ich kann Wurzel, Sprossachse und Blatt einer Samenpflanze benennen und ihre Aufgaben erklären. | M1 Organsysteme (übertragen); Z3 | 5/6: Körperformen von Blütenpflanzen, Struktur und Zusammenspiel der Elemente (S. 36, 41) | NT6 1.2 (Jg 6): Aufgaben der Pflanzenteile | IF1 (Stufe 1): Zusammenwirken der Organe einer Samenpflanze | 5-6 / 5-6 / 5-6 → **5-6** (Mehrheit) | – |
| 25 | `bluete-und-bestaeubung` | Ich kann den Aufbau einer Blüte beschreiben und erklären, wie es durch Bestäubung zur Befruchtung kommt. | V3 Angepasstheit | 5/6: Fortpflanzungsstrategien bei Blütenpflanzen (S. 45) | NT5 2.4 (Jg 5): Blütenbau, Bestäubung und Befruchtung | IF1 (Stufe 1): Blüten präparieren, Fortpflanzung | 5-6 / 5-6 / 5-6 → **5-6** (Mehrheit) | `pflanzenorgane` |
| 26 | `fruechte-und-samen` | Ich kann erklären, wie Früchte und Samen durch Wind, Wasser oder Tiere verbreitet werden. | V3 Angepasstheit | 5/6: Fortpflanzungsstrategien bei Blütenpflanzen (allgemein, S. 45) | NT6 1.2 (Jg 6): Frucht als Ausbreitungseinheit | IF1 (Stufe 1): Struktur und Funktion von Früchten und Samen | 5-6 / 5-6 / 5-6 → **5-6** (Mehrheit) | `bluete-und-bestaeubung` |
| 27 | `keimung-experiment` | Ich kann ein Experiment zur Keimung planen, bei dem ich nur einen Faktor wie Wasser, Licht oder Temperatur verändere. | (Erkenntnisgewinnung) | – | NT6 1.2 (Jg 6): Einfluss von Außenfaktoren auf Keimung und Wachstum | IF1 (Stufe 1): Experiment nach Variablenkontrolle zu Keimung und Wachstum | – / 5-6 / 5-6 → **5-6** (Mehrheit) | `fruechte-und-samen` |
| 28 | `ungeschlechtliche-vermehrung` | Ich kann geschlechtliche Fortpflanzung und ungeschlechtliche Vermehrung bei Pflanzen, zum Beispiel durch Ausläufer, unterscheiden. | (V2 genetische Variabilität, Voraussetzung) | 5/6: geschlechtliche und ungeschlechtliche Vermehrung (S. 45) | NT6 1.2 (Jg 6): ungeschlechtliche Fortpflanzung, Ausläufer | IF1 (Stufe 1), Basiskonzept Entwicklung: ungeschlechtliche Vermehrung | 5-6 / 5-6 / 5-6 → **5-6** (Mehrheit) | `bluete-und-bestaeubung` |
| 29 | `wirbellose-und-insekten` | Ich kann wichtige Gruppen der Wirbellosen unterscheiden und Körperbau und Verwandlung von Insekten beschreiben. | U2 Artenkenntnis | – | B9 LB5 (Jg 9): Biodiversität bei Wirbellosen, Metamorphose | IF4 (Stufe 2; SiLP 8.1): Wirbellosen-Taxa, Entwicklungsstadien von Insekten | – / 9-10 / 7-10 → **9-10** (Mehrheit) | `wirbeltierklassen` |
| 30 | `evolutionstheorie-darwin` | Ich kann die Grundgedanken von Darwins Evolutionstheorie wiedergeben: Vielfalt, Überproduktion, natürliche Selektion und Fortpflanzungserfolg. | V1 Evolutionstheorie | 9/10: Evolutionsmechanismen (S. 47) | B9 LB4 (Jg 9): erweiterte Evolutionstheorie; vereinfacht schon NT6 1.4 | IF5 (Stufe 2; SiLP 8.4): Darwin'sche Evolutionstheorie | 7-10 / 9-10 / 7-10 → **9-10** (Mehrheit) | `zuechtung-und-haltung` |
| 31 | `angepasstheit-selektion` | Ich kann Angepasstheiten von Lebewesen als Ergebnis natürlicher Selektion erklären. | V3 Angepasstheit | 9/10: Angepasstheit als Resultat der Evolutionsmechanismen (S. 32) | B9 LB4 (Jg 9): Angepasstheiten als Selektionsvorteil | IF5 (Stufe 2; SiLP 8.4): Angepasstheit vor dem Hintergrund der Selektionstheorie | 7-10 / 9-10 / 7-10 → **9-10** (Mehrheit) | `evolutionstheorie-darwin`, `angepasstheit-fortbewegung` |
| 32 | `mutation-und-modifikation` **(schwach)** | Ich kann an Beispielen unterscheiden, ob ein Merkmal durch eine Mutation (erblich) oder durch Umwelteinflüsse (Modifikation, nicht erblich) verändert ist. | V2 genetische Variabilität | 9/10: Mutation und Modifikation (S. 31, 47); 5/6: individuelle Veränderungen durch äußere Einflüsse | B9 3.3 (Jg 9): nur Genommutation | IF6 (Stufe 2): nur Genommutation<br>Hinweis: Modifikation nennt nur HE; BY und NW nennen nur Mutationen | 7-10 / 9-10 / 7-10 → **9-10** (Mehrheit) | `dna-modell` |
| 33 | `evolutionsfaktoren` | Ich kann erklären, wie Mutation, Rekombination, Selektion und Isolation zusammen Arten verändern. | V1 Evolutionstheorie; V2 genetische Variabilität | 9/10: Mutation, Rekombination, Selektion (S. 47) | B9 LB4 (Jg 9): genetische Variabilität, Selektion, Isolation | IF5 (Stufe 2; SiLP 8.4): Variabilität, natürliche Selektion | 7-10 / 9-10 / 7-10 → **9-10** (Mehrheit) | `angepasstheit-selektion`, `meiose`, `mutation-und-modifikation` |
| 34 | `artbegriff-und-artbildung` | Ich kann den biologischen Artbegriff anwenden und erklären, wie durch geografische Isolation neue Arten entstehen können. | V3 Artbildung | 9/10: Erläuterung des Artbegriffs, Veränderung von Arten (S. 47) | B9 LB4 (Jg 9): geographische Isolation, Entstehung der Vielfalt | IF5 (Stufe 2; SiLP 8.5): biologischer Artbegriff | 7-10 / 9-10 / 7-10 → **9-10** (Mehrheit) | `evolutionsfaktoren` |
| 35 | `fossilien` | Ich kann erklären, wie Fossilien entstehen und wie sie, zum Beispiel als Brückentiere, die Evolution belegen. | V1 Evolutionstheorie | 9/10: Forschungsmethoden zur Evolution (S. 47) | B9 LB4 (Jg 9): fossile Abstammungsreihe, Brückentiere | IF5 (Stufe 2; SiLP 8.5): Fossilfunde, Leitfossilien | 7-10 / 9-10 / 7-10 → **9-10** (Mehrheit) | `evolutionstheorie-darwin` |
| 36 | `erdzeitalter` | Ich kann die Geschichte des Lebens auf einer Zeitleiste der Erdzeitalter darstellen, auch den Übergang vom Leben im Wasser zum Leben an Land. | V4 Stammesgeschichte (Voraussetzung) | 9/10: Eroberung von Wasser, Land oder Luft als Lebensraum (S. 47) | B10 LB4 (Jg 10): Verlauf der Geschichte des Lebens | IF5 (Stufe 2; SiLP 8.5): Erdzeitalter, Evolution der Landwirbeltiere | 7-10 / 9-10 / 7-10 → **9-10** (Mehrheit) | `fossilien` |
| 37 | `verwandtschaft-und-stammbaum` | Ich kann aus abgestuften Ähnlichkeiten im Körperbau auf Verwandtschaft schließen und Lebewesen in einem Stammbaum und im natürlichen System ordnen. | V3 Verwandtschaft | 9/10: phylogenetische Stammbäume (S. 47) | B10 LB4 (Jg 10): natürliches System (Reich, Stamm, Klasse) | IF5 (Stufe 2; SiLP 8.5): abgestufte Ähnlichkeit, natürliches System | 7-10 / 9-10 / 7-10 → **9-10** (Mehrheit) | `evolutionstheorie-darwin`, `wirbeltierklassen` |
| 38 | `evolution-des-menschen` | Ich kann anhand von Fossilfunden beschreiben, wie sich Merkmale in der Evolution des Menschen verändert haben. | V4 Stammesgeschichte des Menschen | 9/10: Abstammung des Menschen (S. 47) | B10 LB4 (Jg 10): Fossilfunde, Einordnung des Homo sapiens | IF5 (Stufe 2; SiLP 8.6): Hominidenevolution | 7-10 / 9-10 / 7-10 → **9-10** (Mehrheit) | `verwandtschaft-und-stammbaum`, `fossilien` |
| 39 | `gen-und-allel` | Ich kann die Begriffe Gen, Allel, dominant, rezessiv, Genotyp und Phänotyp an einem Beispiel erklären. | V2 Vererbung | 9/10: Grundlagen der Vererbung, Ausprägung von Merkmalen, klassische Genetik (S. 31, 45) | – | IF6 (Stufe 2; SiLP 10.5): Gen- und Allelbegriff | 7-10 / – / 7-10 → **9-10** (festgelegt: Gleichstand 7-8/9-10 (BY nennt es nicht); Hinweis SiLP Jg 10; requires meiose (9-10)) | `meiose` |
| 40 | `erbgaenge` | Ich kann mit einem Kreuzungsschema vorhersagen, wie ein Merkmal nach den mendelschen Regeln vererbt wird. | V2 Vererbung | 9/10: klassische Genetik (S. 31) | – | IF6 (Stufe 2; SiLP 10.5): Gesetzmäßigkeiten der Vererbung, Rekombinationswahrscheinlichkeiten | 7-10 / – / 7-10 → **9-10** (festgelegt: Gleichstand; Hinweis SiLP Jg 10; requires gen-und-allel) | `gen-und-allel` |
| 41 | `familienstammbaum` | Ich kann einen Familienstammbaum mit einem eindeutigen Erbgang auswerten. | V2 Vererbung | 9/10: individuelle Stammbäume (S. 47) | – | IF6 (Stufe 2; SiLP 10.5): Familienstammbäume | 7-10 / – / 7-10 → **9-10** (festgelegt: Gleichstand; Hinweis SiLP Jg 10; requires erbgaenge) | `erbgaenge` |
| 42 | `vom-gen-zum-merkmal` | Ich kann in einfachen Schritten erklären, wie über die Proteinbiosynthese aus einem Gen ein Merkmal entsteht. | V2 Vererbung | 9/10: Ausprägung von Merkmalen (S. 45; ohne Proteinbiosynthese) | B9 3.1 (Jg 9): Proteinbiosynthese, Genwirkkette | IF6 (Stufe 2; SiLP 10.4): Grundprinzip der Proteinbiosynthese | 7-10 / 9-10 / 7-10 → **9-10** (Mehrheit) | `dna-modell`, `proteine` |
| 43 | `trisomie-und-karyogramm` | Ich kann in einem Karyogramm eine Trisomie 21 erkennen, erklären, wie sie durch einen Fehler in der Meiose entsteht, und Möglichkeiten und Grenzen der Pränataldiagnostik nennen. | V2 genetische Variabilität | 9/10: Veränderung genetischer Information, Erbkrankheiten (S. 45 f.) | B9 3.3 (Jg 9): Meiosefehler, Karyogramm, Pränataldiagnostik | IF6 (Stufe 2; SiLP 10.4): Karyogramm, Genommutation, Pränataldiagnostik | 7-10 / 9-10 / 7-10 → **9-10** (Mehrheit) | `meiose`, `chromosomen` |
| 44 | `gentechnik` | Ich kann das Prinzip der Gentechnik (Einbau fremder DNA) beschreiben und Chancen und Risiken bewerten. | (V2 Vererbung, Bewertung) | 9/10: gentechnische Veränderungen, Bewertung (S. 31, 46) | B9 3.3 (Jg 9): Einbau von Fremd-DNA, Bewertung | – | 7-10 / 9-10 / – → **9-10** (Mehrheit) | `dna-modell`, `bakterienzelle` |

### Strang `mensch`: Der Mensch als Lebewesen (The human being as a living thing) – 32 Bausteine

| # | id | iCan | KMK | HE | BY | NW | Stimmen HE/BY/NW → Richtstufe | requires |
|---|---|---|---|---|---|---|---|---|
| 45 | `skelett-und-gelenke` | Ich kann wichtige Teile des Skeletts und verschiedene Gelenktypen benennen und ihre Aufgaben für Stütze, Schutz und Bewegung erklären. | M1 Organsysteme | 5/6: Bau und Funktion von Organsystemen des Menschen, Steuerung von Körperbewegungen (S. 41, 44) | NT5 2.3 (Jg 5): Skelett, Gelenke | IF2 (Stufe 1): Abschnitte des Skeletts, Grundprinzip von Bewegungen | 5-6 / 5-6 / 5-6 → **5-6** (Mehrheit) | – |
| 46 | `gegenspielerprinzip` | Ich kann erklären, wie Muskeln als Gegenspieler zusammen mit Sehnen und Gelenken eine Bewegung ermöglichen. | M1 Organsysteme | 5/6: Gegenspielerprinzip an der Skelettmuskulatur (S. 41) | NT5 2.3 (Jg 5): Gegenspielerprinzip | IF2 (Stufe 1): Zusammenwirken von Skelett und Muskulatur | 5-6 / 5-6 / 5-6 → **5-6** (Mehrheit) | `skelett-und-gelenke` |
| 47 | `naehrstoffe` | Ich kann Kohlenhydrate, Fette, Eiweiße, Vitamine, Mineralstoffe und Ballaststoffe unterscheiden und Stärke und Fett in Lebensmitteln nachweisen. | M3 Ernährung | 5/6: Aspekte zur ausgewogenen Ernährung (S. 44) | NT5 2.1/2.3 (Jg 5): Nahrungsbestandteile, Stärkenachweis, Fettfleckprobe | IF2 (Stufe 1): Nahrungsbestandteile, Nährstoffnachweise | 5-6 / 5-6 / 5-6 → **5-6** (Mehrheit) | – |
| 48 | `ausgewogene-ernaehrung` | Ich kann erklären, wie viel Energie der Körper bei verschiedenen Tätigkeiten braucht, und eine ausgewogene Mahlzeit zusammenstellen. | M3 Gesundheitsbildung, Ernährung | 5/6: ausgewogene Ernährung, Stoff- und Energieumwandlung (S. 44) | NT5 2.3 (Jg 5): Energiebedarf, ausgewogene Nahrung; B10 3.1 | IF2 (Stufe 1): Nahrungsaufnahme und Energiebedarf, ausgewogene Ernährung | 5-6 / 5-6 / 5-6 → **5-6** (Mehrheit) | `naehrstoffe` |
| 49 | `verdauungsorgane` | Ich kann den Weg der Nahrung durch die Verdauungsorgane beschreiben und erklären, was in jedem Organ geschieht. | M1 Organsysteme | 5/6: Verdauungssystem (S. 43) | NT5 2.3 (Jg 5): Verdauungsorgane, Resorption; B10 3.2 | IF2 (Stufe 1): Verdauungsorgane und -vorgänge | 5-6 / 5-6 / 5-6 → **5-6** (Mehrheit) | `naehrstoffe`, `organisationsebenen` |
| 50 | `atmung-und-gasaustausch` | Ich kann den Weg der Atemluft beschreiben und erklären, wie in den Lungenbläschen Sauerstoff und Kohlenstoffdioxid ausgetauscht werden. | M1 Organsysteme | 5/6: Herz-Lungen-System (S. 43) | NT5 2.3 (Jg 5): Gasaustausch; B10 3.3 | IF2 (Stufe 1): Atmungsorgane, Gasaustausch in der Lunge | 5-6 / 5-6 / 5-6 → **5-6** (Mehrheit) | `organisationsebenen` |
| 51 | `oberflaechenvergroesserung` | Ich kann an Lungenbläschen und Darmzotten erklären, warum eine große Oberfläche den Stoffaustausch verbessert. | M1 Organsysteme | 5/6: Prinzip der Oberflächenvergrößerung an Lunge oder Darm (S. 41) | NT5 2.3 (Jg 5): Oberflächenvergrößerung | IF2 (Stufe 1): Oberflächenvergrößerung an Dünndarm und Lunge | 5-6 / 5-6 / 5-6 → **5-6** (Mehrheit) | `verdauungsorgane`, `atmung-und-gasaustausch` |
| 52 | `herz-und-blutkreislauf` | Ich kann den Bau des Herzens und den Weg des Blutes im Körper- und Lungenkreislauf beschreiben und erklären, was das Blut transportiert. | M1 Organsysteme | 5/6: Herz-Lungen-System (S. 43) | NT5 2.3 (Jg 5): Blutkreislauf; B10 3.3: Herz-Kreislauf-System | IF2 (Stufe 1): Blutkreislauf, Herz, Aufgaben des Blutes | 5-6 / 5-6 / 5-6 → **5-6** (Mehrheit) | `atmung-und-gasaustausch` |
| 53 | `koerperliche-belastung` | Ich kann Puls und Atemfrequenz in Ruhe und bei Belastung messen und die Unterschiede mit dem Bedarf der Zellen an Sauerstoff und Nährstoffen erklären. | M1 Organsysteme (Erkenntnisgewinnung) | 5/6: physiologische Untersuchungen am eigenen Körper (S. 43) | NT5 2.3 (Jg 5): Messwerte zu Atem- und Herzschlagfrequenz | IF2 (Stufe 1): quantitatives Experiment zu Herzschlag- oder Atemfrequenz | 5-6 / 5-6 / 5-6 → **5-6** (Mehrheit) | `herz-und-blutkreislauf`, `zellatmung` |
| 54 | `rauchen` | Ich kann beschreiben, wie Rauchen Lunge und Kreislauf schädigt und warum Nikotin abhängig macht. | M3 Suchtprävention | 9/10: Drogen als Störfaktoren (S. 30) | NT5 2.3 (Jg 5): Schädigung der Lunge, Suchtgefahr durch Rauchen | IF2 (Stufe 1): Folgen des Tabakkonsums | 7-10 / 5-6 / 5-6 → **5-6** (Mehrheit) | `atmung-und-gasaustausch` |
| 55 | `reiz-reaktion` | Ich kann an einem Alltagsbeispiel die Kette von der Sinneszelle über Nerven und Gehirn bis zum Muskel darstellen. | M1 Organsysteme | 5/6: Informationswege, Reiz-Reaktions-Mechanismen bei Tier und Mensch (S. 42) | NT5 2.3 (Jg 5): Reiz-Reaktions-Kette | IF7 (Stufe 2; SiLP 10.6): Reiz-Reaktions-Schema | 5-6 / 5-6 / 7-10 → **5-6** (Mehrheit) | – |
| 56 | `auge-und-ohr` | Ich kann erklären, wie Auge oder Ohr Reize aufnehmen, wie Sehfehler oder Hörschäden entstehen und wie ich meine Sinnesorgane schütze. | M1 Organsysteme; M3 Gesundheitsbildung | 9/10: Leistungsstärke und Gesundheitsschutz von Auge oder Ohr (S. 42) | B8 LB2 (Jg 8): Auge, Sehfehler, Hörvorgang; NT5: Gehörschutz | – | 7-10 / 7-8 / – → **7-8** (Mehrheit) | `reiz-reaktion` |
| 57 | `nervenzelle-und-synapse` | Ich kann den Bau einer Nervenzelle beschreiben und mit einem einfachen Modell erklären, wie eine Synapse ein Signal weitergibt. | M1 Organsysteme | 9/10: Erregung, Weiterleitung, Zellstrukturen (S. 42) | B8 LB2 (Jg 8): Nervenzelle, chemische Synapse | IF7 (Stufe 2; SiLP 10.6): Neuron und Synapse | 7-10 / 7-8 / 7-10 → **7-8** (Mehrheit) | `reiz-reaktion` |
| 58 | `hormone` | Ich kann erklären, wie Hormone als Botenstoffe nach dem Schlüssel-Schloss-Prinzip an Zielzellen wirken, und sie mit Nervensignalen vergleichen. | M1 Organsysteme | 9/10: Hormone als Botenstoffe (S. 42) | B8 LB2 (Jg 8): Wirkungsmechanismus, Vergleich mit Nervensystem | IF7 (Stufe 2; SiLP 10.2): Schlüssel-Schloss-Modell bei Hormonen, Vergleich | 7-10 / 7-8 / 7-10 → **7-8** (Mehrheit) | `nervenzelle-und-synapse` |
| 59 | `blutzucker-und-diabetes` | Ich kann die Regelung des Blutzuckers durch Insulin und Glukagon als Regelkreis erklären und Diabetes Typ 1 und Typ 2 unterscheiden. | M1 Organsysteme; M3 Gesundheitsbildung | 9/10: Regelmechanismen, ausgewählte Hormone, Regelkreisschema (S. 30, 44) | B8 LB2 (Jg 8): Blutzuckerregulation, Diabetes | IF7 (Stufe 2; SiLP 10.2): Blutzuckerregulation, Diabetes | 7-10 / 7-8 / 7-10 → **7-8** (Mehrheit) | `hormone` |
| 60 | `stressreaktion` | Ich kann erklären, wie Nerven und Hormone bei Stress zusammenwirken, und Wege nennen, gut mit Stress umzugehen. | M3 Gesundheitsbildung | – | B8 LB2 (Jg 8): Stressreaktion, Stressbewältigung | IF7 (Stufe 2; SiLP 10.6): Reaktionen des Körpers auf Stress | – / 7-8 / 7-10 → **7-8** (Mehrheit) | `hormone` |
| 61 | `sucht` | Ich kann Genuss, Gewöhnung und Sucht unterscheiden und beschreiben, wie Suchtmittel und Verhaltenssüchte Körper und Psyche verändern. | M3 Suchtprävention | 9/10: Drogen als Störfaktoren (S. 30) | B8 LB5 (Jg 8): Genuss und Sucht, Suchtentstehung | IF7 (Stufe 2; SiLP 10.6): Auswirkungen von Drogenkonsum | 7-10 / 7-8 / 7-10 → **7-8** (Mehrheit) | `nervenzelle-und-synapse`, `rauchen` |
| 62 | `infektionskrankheiten` | Ich kann bakterielle und virale Infektionskrankheiten unterscheiden, Übertragungswege nennen und erklären, wie Hygiene vor Ansteckung schützt. | M2 Immunabwehr | 9/10: Infektionskrankheiten (AIDS, Hepatitis) (S. 43) | B10 LB2 (Jg 10): bakterielle und virale Infektionen, Hygiene | IF7 (Stufe 2; SiLP 10.1): Infektionskrankheiten, Hygiene | 7-10 / 9-10 / 7-10 → **9-10** (Mehrheit) | `bakterienzelle`, `viren` |
| 63 | `unspezifische-abwehr` | Ich kann beschreiben, wie Haut, Schleimhäute, Magensäure und Fresszellen Krankheitserreger unspezifisch abwehren. | M2 Mechanismen der Immunabwehr | 9/10: Immunsystem, Immunität (S. 43) | B10 LB2 (Jg 10): unspezifische Abwehr | IF7 (Stufe 2; SiLP 10.1): unspezifische Immunreaktion | 7-10 / 9-10 / 7-10 → **9-10** (Mehrheit) | `infektionskrankheiten` |
| 64 | `spezifische-abwehr` | Ich kann erklären, wie Antikörper und Gedächtniszellen einen bestimmten Erreger erkennen, und eine Allergie als Fehlreaktion des Immunsystems beschreiben. | M2 Mechanismen der Immunabwehr | 9/10: Immunsystem, Immunität (S. 43) | B10 LB2 (Jg 10): spezifische Abwehr, Allergie | IF7 (Stufe 2; SiLP 10.1): spezifische Immunreaktion, Allergien | 7-10 / 9-10 / 7-10 → **9-10** (Mehrheit) | `unspezifische-abwehr`, `proteine` |
| 65 | `impfung` | Ich kann aktive und passive Immunisierung unterscheiden und begründen, warum Schutzimpfungen sinnvoll sind. | M2 Impfung | 9/10: Immunisierung (S. 29) | B10 LB2 (Jg 10): aktive und passive Immunisierung, Impfempfehlungen | IF7 (Stufe 2; SiLP 10.1): passive und aktive Immunisierung, STIKO | 7-10 / 9-10 / 7-10 → **9-10** (Mehrheit) | `spezifische-abwehr` |
| 66 | `antibiotika` | Ich kann erklären, wie Antibiotika gegen Bakterien wirken, warum sie gegen Viren nicht helfen und wie Resistenzen entstehen. | M2 Immunabwehr; M3 Gesundheitsbildung | – | B10 LB2 (Jg 10): Antibiotika, Resistenzbildung | IF7 (Stufe 2; SiLP 10.1): Einsatz von Antibiotika, Resistenzen | – / 9-10 / 7-10 → **9-10** (Mehrheit) | `infektionskrankheiten` |
| 67 | `pubertaet` | Ich kann körperliche und seelische Veränderungen in der Pubertät bei Mädchen und Jungen beschreiben. | M4 Pubertät | 5/6: Veränderung während der Pubertät (S. 46) | NT5 2.3 (Jg 5): Pubertät; B8 LB3 | IF3 (Stufe 1): Veränderungen in der Pubertät | 5-6 / 5-6 / 5-6 → **5-6** (Mehrheit) | – |
| 68 | `geschlechtsorgane-und-zyklus` | Ich kann Bau und Aufgaben der weiblichen und männlichen Geschlechtsorgane beschreiben und den Menstruationszyklus in Grundzügen erklären. | M4 Fortpflanzung | 5/6: äußere Geschlechtsmerkmale (S. 46) | NT5 2.3 (Jg 5): Geschlechtsorgane, vereinfachter Zyklus | IF3 (Stufe 1): Geschlechtsorgane, weiblicher Zyklus in Grundzügen<br>Hinweis: Zyklus nennt HE für 5/6 nicht | 5-6 / 5-6 / 5-6 → **5-6** (Mehrheit) | `pubertaet` |
| 69 | `befruchtung-schwangerschaft` | Ich kann Eizelle und Spermienzelle vergleichen und Befruchtung, Schwangerschaft und Geburt beschreiben. | M4 Fortpflanzung | 5/6: Zeugung, Schwangerschaft und Geburt (S. 46) | NT5 2.3 (Jg 5): Befruchtung, Zeugung; B8 LB3: Schwangerschaft | IF3 (Stufe 1): Befruchtung, Schwangerschaft und Geburt | 5-6 / 5-6 / 5-6 → **5-6** (Mehrheit) | `geschlechtsorgane-und-zyklus` |
| 70 | `verhuetung` | Ich kann Methoden der Empfängnisverhütung beschreiben und erklären, warum Kondome auch vor Infektionen schützen. | M4 Sexualbildung | 5/6: Empfängnisverhütung (S. 46) | B8 LB3 (Jg 8): Empfängnisregulation | IF3 (Stufe 1): Methoden der Empfängnisverhütung | 5-6 / 7-8 / 5-6 → **5-6** (Mehrheit) | `befruchtung-schwangerschaft` |
| 71 | `sexuelle-selbstbestimmung` | Ich kann eigene Grenzen benennen, die Grenzen anderer achten und erwünschte Nähe von Übergriffen unterscheiden. | M4 Sexualbildung | 5/6: sexuelle Selbstbestimmung, Rollenverhalten (S. 46) | NT5 2.3 (Jg 5): Intimsphäre, Prävention von Missbrauch; B8 LB3 | IF3 (Stufe 1): respektvoller Sprachgebrauch; IF8 (Stufe 2): Verantwortung | 5-6 / 5-6 / 5-6 → **5-6** (Mehrheit) | `pubertaet` |
| 72 | `zyklus-und-hormone` | Ich kann erklären, wie Hormone den Menstruationszyklus steuern und wie hormonelle Verhütungsmittel wirken. | M4 Fortpflanzung | 9/10: Hormone, biologische Grundlagen der Empfängnisverhütung (S. 46) | B8 LB3 (Jg 8): Steuerung des Zyklus durch Hormone | IF8 (Stufe 2; SiLP 10.3): hormonelle Steuerung des Zyklus | 7-10 / 7-8 / 7-10 → **7-8** (Mehrheit) | `geschlechtsorgane-und-zyklus`, `hormone` |
| 73 | `verhuetung-vergleichen` | Ich kann Verhütungsmethoden nach Sicherheit (Pearl-Index), Handhabung und Nebenwirkungen vergleichen und begründet auswählen. | M4 Sexualbildung | 9/10: Abwägung von Handlungsoptionen (S. 46) | B8 LB3 (Jg 8): Vor- und Nachteile abwägen | IF8 (Stufe 2; SiLP 10.3): Pearl-Index, Methoden vergleichen | 7-10 / 7-8 / 7-10 → **7-8** (Mehrheit) | `zyklus-und-hormone`, `verhuetung` |
| 74 | `sexuell-uebertragbare-infektionen` | Ich kann Übertragungswege sexuell übertragbarer Infektionen wie HIV nennen und erklären, wie ich mich und andere schütze. | M2 Immunabwehr; M4 Sexualbildung | 9/10: AIDS, Hepatitis (S. 43); 5/6: Vermeidung von Infektionen (S. 46) | B8 LB3 (Jg 8): sexuell übertragbare Erkrankungen, HIV | IF7 (Stufe 2): virale Infektionskrankheiten (allgemein) | 7-10 / 7-8 / 7-10 → **7-8** (Mehrheit) | `verhuetung` |
| 75 | `sexuelle-vielfalt` | Ich kann sexuelle Orientierungen und geschlechtliche Identitäten sachlich beschreiben und Sachinformationen von Wertungen unterscheiden. | M4 Sexualbildung und Diversität | 9/10: heterosexuelle und homosexuelle Partnerschaften (S. 46) | B8 LB3 (Jg 8): Geschlechtsidentität, sexuelle Orientierung | IF8 (Stufe 2; SiLP 8.10): sexuelle Orientierung, geschlechtliche Identität | 7-10 / 7-8 / 7-10 → **7-8** (Mehrheit) | `pubertaet` |
| 76 | `schwangerschaftsabbruch` | Ich kann die gesetzlichen Regeln zum Schwangerschaftsabbruch beschreiben und unterschiedliche Positionen dazu sachlich abwägen. | M4 Sexualbildung | 9/10: Schwangerschaftsabbruch (S. 46) | B8 LB3 (Jg 8): ungewollte Schwangerschaft, Schwangerschaftsabbruch | IF8 (Stufe 2; SiLP 10.3): Schwangerschaftsabbruch | 7-10 / 7-8 / 7-10 → **7-8** (Mehrheit) | `befruchtung-schwangerschaft` |

### Strang `umwelt`: Lebewesen in ihrer Umwelt (Living things in their environment) – 16 Bausteine

| # | id | iCan | KMK | HE | BY | NW | Stimmen HE/BY/NW → Richtstufe | requires |
|---|---|---|---|---|---|---|---|---|
| 77 | `oekosystem-grundbegriffe` | Ich kann an einem heimischen Ökosystem wie Wiese, Wald oder Gewässer beschreiben, was Lebensraum (Biotop) und Lebensgemeinschaft (Biozönose) sind. | U1 Ökosysteme | 5/6: Tiere und Pflanzen eines ausgewählten Ökosystems (S. 43) | NT5 2.5 (Jg 5): Lebensraum, Lebensgemeinschaft; NT6 1.5 | IF4 (Stufe 2; SiLP 8.1): Biotop und Biozönose | 5-6 / 5-6 / 7-10 → **5-6** (Mehrheit) | – |
| 78 | `arten-bestimmen` | Ich kann Pflanzen und Tiere mit einem Bestimmungsschlüssel oder einer Bestimmungs-App bestimmen. | U2 Artenkenntnis | 9/10: Erweiterung der Artenkenntnis (S. 44) | NT5 2.1, 2.5 (Jg 5): Bestimmen von Samenpflanzen; B8 LB1 | IF1 (Stufe 1): Bestimmungsschlüssel für Samenpflanzen; IF4: Taxa bestimmen | 7-10 / 5-6 / 5-6 → **5-6** (Mehrheit) | `pflanzenorgane` |
| 79 | `nahrungsbeziehungen` | Ich kann Nahrungsketten und Nahrungsnetze zeichnen und darin Produzenten, Konsumenten und Destruenten zuordnen. | U3 Trophiestufen | 5/6: Nahrungsketten und -netze; Produzenten, Konsumenten, Destruenten (S. 43 f.) | NT6 1.5 (Jg 6): Nahrungsnetz; B9 LB6 | IF4 (Stufe 2; SiLP 8.8): Nahrungsbeziehungen und Nahrungsnetze | 5-6 / 5-6 / 7-10 → **5-6** (Mehrheit) | `oekosystem-grundbegriffe`, `fotosynthese` |
| 80 | `eingriffe-des-menschen` | Ich kann an einem Beispiel beschreiben, wie Eingriffe des Menschen wie Düngung, Versiegelung oder Begradigung ein Ökosystem verändern. | U1 Naturschutz | 5/6: Auswirkungen von Eingriffen des Menschen (S. 45); 9/10: Gefährdung von Ökosystemen | NT5 2.5 (Jg 5): Bewirtschaftungsmethoden; NT6 1.5; B8 LB6; B9 LB6 | IF4 (Stufe 2; SiLP 8.9): Eingriffe des Menschen | 5-6 / 5-6 / 7-10 → **5-6** (Mehrheit) | `nahrungsbeziehungen` |
| 81 | `tierkommunikation` | Ich kann an Beispielen beschreiben, wie Tiere mit Lauten, Duftstoffen, Farben oder Bewegungen miteinander kommunizieren. | U2 Wechselbeziehungen zwischen Lebewesen | 5/6: einfache Beispiele für Verhaltensweisen aus der Tierwelt (S. 42); 9/10: intra- und interspezifisch | NT6 1.3 (Jg 6): innerartliche Kommunikation; B9 5.4: Signale bei Insekten | – | 5-6 / 5-6 / – → **5-6** (Mehrheit) | `wirbeltierklassen` |
| 82 | `abiotische-faktoren` | Ich kann Umweltfaktoren wie Licht, Temperatur und Feuchtigkeit in einem Lebensraum messen und mit dem Vorkommen von Arten in Beziehung setzen. | U2 Wechselbeziehungen mit der Umwelt | 9/10: abiotische und biotische Faktoren (S. 43) | NT5 2.5 (Jg 5) und NT6 1.5 (Jg 6): Umweltfaktoren im Freiland | IF4 (Stufe 2; SiLP 8.1): abiotische Faktoren messen | 7-10 / 5-6 / 7-10 → **7-8** (Mitte (BY 5-6, HE/NW nur Stufe 2)) | `oekosystem-grundbegriffe` |
| 83 | `sukzession` | Ich kann beschreiben, wie sich ein Ökosystem im Lauf der Zeit verändert (Sukzession), und natürliche von menschengemachten Veränderungen unterscheiden. | U1 Ökosysteme | – | B8 LB6 (Jg 8): Sukzession | IF4 (Stufe 2; SiLP 8.9/10.6): natürliche Sukzession, anthropogene Einflüsse | – / 7-8 / 7-10 → **7-8** (Mehrheit) | `oekosystem-grundbegriffe`, `eingriffe-des-menschen` |
| 84 | `biodiversitaet-und-naturschutz` | Ich kann erklären, was Biodiversität ist, warum sie gefährdet ist und wie Biotopschutz Arten schützt. | U1 Biodiversität, Naturschutz | 9/10: Artenvielfalt und Artensterben, Gefährdung (S. 44, 47) | NT5 2.5 (Jg 5): Biodiversität; NT6 1.5 (Jg 6): Schutz der biologischen Vielfalt | IF4 (Stufe 2; SiLP 8.9): Biotop- und Artenschutz | 7-10 / 5-6 / 7-10 → **7-8** (Mitte (BY 5-6, HE/NW nur Stufe 2)) | `eingriffe-des-menschen`, `arten-bestimmen` |
| 85 | `nachhaltigkeit` | Ich kann am ökologischen Fußabdruck erklären, was nachhaltige Entwicklung bedeutet, und Handlungsmöglichkeiten im Alltag bewerten. | U4 Nachhaltigkeit | 9/10: Handlungsoptionen im Sinne der Nachhaltigkeit (S. 30, 45) | B8 LB6 (Jg 8): nachhaltige Entwicklung, ökologischer Fußabdruck | IF4 (Stufe 2; SiLP 8.9): Handlungsoptionen Naturschutz und Nachhaltigkeit | 7-10 / 7-8 / 7-10 → **7-8** (Mehrheit) | `eingriffe-des-menschen` |
| 86 | `verhalten-und-lernen` | Ich kann an Beispielen unterscheiden, ob ein Verhalten eher angeboren oder erlernt ist, und Lernen durch Konditionierung erklären. | (U2 Wechselbeziehungen) | 9/10: Verhaltensweisen von Tieren und Menschen; Lernvorgänge (S. 28, 42) | B8 LB4 (Jg 8): genetisch bedingtes und erlerntes Verhalten, Konditionierung | – | 7-10 / 7-8 / – → **7-8** (Mehrheit) | `tierkommunikation`, `reiz-reaktion` |
| 87 | `beziehungen-zwischen-arten` | Ich kann Konkurrenz, Räuber-Beute-Beziehung, Symbiose und Parasitismus an Beispielen unterscheiden. | U2 Wechselbeziehungen zwischen Lebewesen | 5/6: Räuber-Beute-Wechselwirkungen (S. 38); 9/10: ökologische Funktion der Art | B10 LB2 (Jg 10): Symbionten, Parasiten (Ökosystem Mensch) | IF4 (Stufe 2; SiLP 8.1): Parasitismus, Symbiose, Koexistenz | 5-6 / 9-10 / 7-10 → **9-10** (Mehrheit) | `nahrungsbeziehungen` |
| 88 | `angepasstheit-an-umweltfaktoren` | Ich kann an Beispielen erklären, wie Pflanzen und Tiere an Licht, Wasser oder Temperatur in ihrem Lebensraum angepasst sind. | U2 Wechselbeziehungen; V3 Angepasstheit | 9/10: abiotische Faktoren, ökologische Funktion der Art (S. 43) | B9 LB4 (Jg 9): Angepasstheiten an biotische und abiotische Umweltfaktoren | IF4 (Stufe 2; SiLP 8.7): Angepasstheiten an abiotische Faktoren | 7-10 / 9-10 / 7-10 → **9-10** (Mehrheit) | `abiotische-faktoren` |
| 89 | `energiefluss` | Ich kann erklären, wie Energie durch die Trophiestufen fließt und warum auf jeder Stufe nur ein kleiner Teil weitergegeben wird. | U3 Energiefluss und Trophiestufen | 9/10: Trophieebenen, Energiefluss (S. 29 f., 43) | B9 LB6 (Jg 9): Nahrungsnetz, Energiefluss im Boden | IF4 (Stufe 2; SiLP 8.8): Energieentwertung | 7-10 / 9-10 / 7-10 → **9-10** (Mehrheit) | `nahrungsbeziehungen`, `fotosynthese-und-zellatmung` |
| 90 | `kohlenstoffkreislauf` | Ich kann einen einfachen Kohlenstoffkreislauf mit Fotosynthese, Zellatmung, Zersetzung und Verbrennung darstellen. | U3 Kohlenstoffkreislauf | 9/10: Stoffkreisläufe, Kohlenstoffkreislauf (S. 44) | B9 LB6 (Jg 9): einfacher Kohlenstoffatomkreislauf | IF4 (Stufe 2; SiLP 8.8): Grundprinzip des Kohlenstoffkreislaufs | 7-10 / 9-10 / 7-10 → **9-10** (Mehrheit) | `nahrungsbeziehungen`, `fotosynthese-und-zellatmung` |
| 91 | `pilze-und-zersetzer` | Ich kann Pilze von Pflanzen und Tieren unterscheiden und erklären, welche Rolle Pilze, Bakterien und Bodentiere als Zersetzer spielen. | U2 Wechselbeziehungen; U3 Kohlenstoffkreislauf | – | B9 LB2 (Jg 9): Pilze, Hefen; B9 LB6: Humusbildung, Mineralisierung | IF4 (Stufe 2; SiLP 8.2/8.3): Pilze und ihre Rolle im Ökosystem | – / 9-10 / 7-10 → **9-10** (Mehrheit) | `kohlenstoffkreislauf`, `bakterienzelle` |
| 92 | `klimawandel` **(schwach)** | Ich kann erklären, wie mehr Kohlenstoffdioxid in der Luft den Treibhauseffekt verstärkt und welche Folgen der Klimawandel für Lebewesen und Ökosysteme hat. | U4 Klimawandel, Klimafolgen | 9/10: globale Stoffkreisläufe, Eingriffe des Menschen, Prognosen (S. 30; Klima nicht genannt) | B8 LB6 (Jg 8): globale Stoffströme (Klima nicht genannt) | – | 7-10 / 7-8 / – → **9-10** (Regel ergäbe 7-8; festgelegt: Klimawandel nennt nur die KMK ausdrücklich; nach der Abstimmung 7-8, aber requires kohlenstoffkreislauf (9-10) verlangt 9-10) | `kohlenstoffkreislauf`, `nachhaltigkeit` |

## 3. Entscheidungen

### 3.1 Abstimmung über die Richtstufe

- **Eine Stimme je Land.** BY stimmt mit dem Jahrgang seines Lernbereichs. HE und NW stimmen in der ersten Stufe mit
  „5-6“. Ihre zweite Stufe umfasst Jg 7–10 ohne Jahrgang. Diese Stimme heißt in den Tabellen **„7-10“** und zählt für
  7-8 und für 9-10. Folgen:
  - Nennt BY den Baustein in 7-8 oder 9-10, dann entscheidet diese Stufe (zwei Stimmen).
  - Steht BY auf 5-6 und HE und NW auf „7-10“, dann sind alle drei Stimmen verschieden. Ich nehme die mittlere: 7-8
    (`fotosynthese-und-zellatmung`, `abiotische-faktoren`, `biodiversitaet-und-naturschutz`).
  - Fehlt BY und stehen HE und NW auf „7-10“, dann gibt es einen Gleichstand. Den löse ich über den SiLP-Hinweis und
    über requires: `gen-und-allel`, `erbgaenge`, `familienstammbaum` → 9-10 (SiLP Jg 10; Meiose ist 9-10).
  - `klimawandel`: Die Abstimmung ergäbe 7-8. Weil der Baustein `kohlenstoffkreislauf` (9-10) voraussetzt, setze ich
    9-10.
- **Abweichung von der Vorlage:** In `physik.yaml` und `chemie.yaml` zählt die zweite Stufe von HE als 9-10. In
  Biologie würde das fast alle Inhalte der zweiten Stufe auf 9-10 schieben, obwohl HE ausdrücklich keinen Jg 8
  festlegt. Darum zähle ich sie hier als „7-10“. Wird die Regel der Vorlage übernommen, ändert sich das Ergebnis nur
  bei den drei „Mitte“-Fällen oben (dann 9-10) und bei `klimawandel` nicht. Die Bausteine mit BY 7-8 bleiben 7-8, weil
  NW „7-10“ mit BY übereinstimmt.
- **Folge:** Innerhalb von 7–10 entscheidet in der Regel Bayern. Bayern ordnet anders als das NRW-Schulbeispiel:
  - BY: Neurobiologie, Hormone, Sexualität und Sucht in Jg 8; Genetik, Evolution, Wirbellose und Ökosystem Boden in
    Jg 9; Immunbiologie, Stoffwechsel und Evolution des Menschen in Jg 10.
  - SiLP NRW: Ökologie und Evolution in Jg 8; Genetik, Immunbiologie, Neurobiologie und Hormone in Jg 10.
  - Deshalb hat der Strang `vielfalt` keinen Baustein in 7-8 (Evolution 9-10 statt Hinweis Jg 8). Die
    Hormon- und Nervenbausteine stehen dagegen auf 7-8 (Hinweis NRW: Jg 10).

### 3.2 Zuschnitt und Strang-Zuordnung von Grenzfällen

- **Stränge:** die vier KMK-Inhaltsbereiche, unverändert. Ids: `zellen`, `vielfalt`, `mensch`, `umwelt`.
- **Zellbiologie und Genetik:** DNA-Modell, Chromosomen, Mitose und Meiose kommen in den Strang `zellen` (KMK:
  „Zellen, Mitose, Meiose“). Gen und Allel, Erbgänge, Stammbaum, Proteinbiosynthese, Mutation, Trisomie 21 mit
  Karyogramm und Gentechnik kommen in den Strang `vielfalt` (KMK: „Vererbung, genetische Variabilität“).
- **`proteine` in `zellen`:** Der Baustein ist direkte Voraussetzung für `enzyme` (KMK Z4 „Enzymreaktion“), für
  `vom-gen-zum-merkmal` und für `spezifische-abwehr`.
- **`bakterienzelle` und `viren` in `zellen`:** Die KMK nennt Zellen und Kennzeichen des Lebendigen; Viren sind ein
  Grenzfall des Lebendigen (so auch SiLP UV 10.1). Infektion und Abwehr stehen in `mensch` und setzen beide Bausteine
  voraus.
- **Samenpflanzen in `vielfalt`:** Pflanzenorgane, Blüte, Früchte, Keimung und ungeschlechtliche Vermehrung stehen in
  BY unter „Samenpflanzen als Lebewesen“ und in NW unter „Vielfalt und Angepasstheiten von Samenpflanzen“. Die
  Fotosynthese bleibt in `zellen` (KMK Z3).
- **Wirbeltierklassen in `vielfalt`** (KMK „Verwandtschaft“). **Arten bestimmen in `umwelt`** (KMK U2
  „Artenkenntnis“).
- **Angepasstheit:** zwei Bausteine. `angepasstheit-selektion` (Evolution) kommt in den Strang `vielfalt`,
  `angepasstheit-an-umweltfaktoren` (Ökologie) in den Strang `umwelt`.
- **Verhalten:** `tierkommunikation` und `verhalten-und-lernen` kommen in den Strang `umwelt`. Die KMK nennt Verhalten
  nicht. HE führt es unter „Informationsfluss … zwischen Organismen“, BY in B8 LB4, NW gar nicht. Ich ordne es den
  „Wechselbeziehungen zwischen Lebewesen und ihrer Umwelt“ zu. Siehe offene Punkte.
- **Pilze und Zersetzer in `umwelt`** (NW IF4: Rolle im Ökosystem; BY B9 LB6: Humusbildung).
- **Sexuell übertragbare Infektionen in `mensch`.** Der Baustein ist 7-8 (BY B8) und setzt deshalb nicht
  `infektionskrankheiten` (9-10) voraus, sondern `verhuetung`.

Requires über Strang-Grenzen (erlaubt, alle geprüft): `fotosynthese` → `pflanzenorgane`; `zellatmung-energie` und
`proteine` → `naehrstoffe`; `enzyme` → `verdauungsorgane`; `meiose` → `befruchtung-schwangerschaft`;
`mutation-und-modifikation`, `vom-gen-zum-merkmal` und `gentechnik` → `dna-modell`; `evolutionsfaktoren`,
`gen-und-allel` und `trisomie-und-karyogramm` → `meiose`; `trisomie-und-karyogramm` → `chromosomen`;
`vom-gen-zum-merkmal` und `spezifische-abwehr` → `proteine`; `gentechnik`, `infektionskrankheiten` und
`pilze-und-zersetzer` → `bakterienzelle`; `infektionskrankheiten` → `viren`; `verdauungsorgane` und
`atmung-und-gasaustausch` → `organisationsebenen`; `koerperliche-belastung` → `zellatmung`; `arten-bestimmen` →
`pflanzenorgane`; `nahrungsbeziehungen` → `fotosynthese`; `tierkommunikation` → `wirbeltierklassen`;
`verhalten-und-lernen` → `reiz-reaktion`; `energiefluss` und `kohlenstoffkreislauf` → `fotosynthese-und-zellatmung`.

### 3.3 Zusammengelegt (um bei etwa 90 Bausteinen zu bleiben)

Zusammengelegt habe ich:
- Gelenke und Skelett
- Energiebedarf und ausgewogene Ernährung
- Nährstoffe und Nährstoffnachweise
- Blut als Transportmittel und Herz-Kreislauf
- Nervenzelle und Synapse
- Vergleich der Hormone mit Nervensignalen in `hormone`
- Diabetes und Blutzuckerregulation
- Allergie in `spezifische-abwehr`
- Hygiene in `infektionskrankheiten`
- Geschlechtsorgane und Zyklus in Grundzügen
- Befruchtung, Schwangerschaft und Geburt
- Artbegriff und Artbildung
- natürliches System und Stammbaum
- Proteinbiosynthese und Genwirkkette
- Karyogramm, Trisomie 21 und Pränataldiagnostik
- Wirbellose und Insekten
- Züchtung und Nutztierhaltung
- angeborenes Verhalten und Konditionierung
- Vermehrung der Bakterien und Bakterienzelle
- Fotosynthese mit ihrer Bedeutung
- Temperatur- und pH-Abhängigkeit in `enzyme`

### 3.4 Nicht aufgenommen (nur ein Land, und keine direkte Voraussetzung)

| Inhalt | nur in |
|---|---|
| Gärung (Milchsäure- und alkoholische Gärung), ATP-ADP-System, aerober und anaerober Abbau im Muskel | BY B9 LB2, B10 3.4 |
| Biotechnologie, Lebensmittelverderb, Konservierung | BY B9 LB2 |
| DNA-Replikation als eigener Baustein (steckt als Ein-/Zwei-Chromatid-Chromosom in `chromosomen`) | BY B9 3.2 |
| Bionik; Reizbarkeit und Bewegung bei Pflanzen (Phototropismus); Sinnesleistungen der Wirbeltiere | BY NT6 |
| Pflanzenfamilien im Vergleich | BY NT5 2.4 |
| Ökosystem Boden (Bodeneigenschaften, Humusbildung; Teile stecken in `pilze-und-zersetzer`) | BY B9 LB6 (NW nur im SiLP) |
| kulturelle Evolution, Populationsentwicklung | BY B10 LB4 |
| Erste Hilfe, Blutspende, Organspende | BY B10 3.3 |
| Organtransplantation; Reflex und bewusste Reaktion; Abgrenzung der Evolutionstheorie von nicht-naturwissenschaftlichen Vorstellungen; historische Fotosynthese-Experimente | NW IF7, IF5, IF4 |
| Leistungen des Gehirns, Lernvorgänge (nur teilweise in `verhalten-und-lernen`) | HE 9/10 |
| Arbeitsweisen ohne eigenen Inhalt (Erkenntnisweg, Protokoll, Modelle, Diagramme) | alle; das sind Prozesskompetenzen (KMK-Kompetenzbereiche), keine Inhalte. Aufgenommen nur, wo sie an einen Inhalt gebunden sind: `mikroskopieren`, `praeparat-und-zeichnung`, `keimung-experiment`, `koerperliche-belastung`, `abiotische-faktoren` |

### 3.5 Schwach belegt

- `mutation-und-modifikation`: Die KMK nennt „genetische Variabilität“. Die Modifikation nennt nur HE; BY und NW
  nennen nur Mutationen (Genommutation).
- `klimawandel`: Ausdrücklich nennt ihn nur die KMK („Klimawandel, Klimafolgen, Nachhaltigkeit“). HE und BY nennen nur
  globale Stoffkreisläufe und Stoffströme, NW nichts. Der Baustein ist aufgenommen, weil die KMK ihn verbindlich nennt.
- Auf schwacher Grundlage stehen einzelne Länderfundstellen (in den Tabellen als „allgemein“ oder „ohne …“
  vermerkt): HE bei `fruechte-und-samen`, `koerperliche-belastung` und `vom-gen-zum-merkmal`; NW bei
  `sexuell-uebertragbare-infektionen`. Zwei Länder tragen den Baustein trotzdem.

## 4. Offene Punkte

1. **Regel für die zweite Stufe von HE und NW** (3.1): Soll Biologie bei „7-10“ bleiben, oder wird die Regel der
   Vorlage übernommen (HE-Stufe 2 = 9-10)? Das sollte für alle Fächer einheitlich entschieden werden.
2. **Bayern bestimmt die Reihenfolge in 7–10.** Für NRW-Schulen passt das schlecht (Evolution und Ökologie dort
   meist in Jg 8, Hormone und Nerven in Jg 10). Die Placements eines späteren Curriculums `nw-gymnasium` dürfen nur
   die Stufe nennen, nicht den SiLP-Jahrgang.
3. **Mendel-Genetik:** BY behandelt sie in Jg 8–10 nicht. `gen-und-allel`, `erbgaenge` und `familienstammbaum` stehen
   auf KMK, HE und NW; die Richtstufe 9-10 ist ein Stichentscheid.
4. **Klimawandel:** Er steht wahrscheinlich in den Geographie- oder Erdkunde-Plänen der Länder. Diese Quellen lagen
   außerhalb des Auftrags. Bitte entscheiden, ob der Baustein in Biologie bleibt.
5. **Verhalten** hat keinen KMK-Aspekt und steht nicht im NRW-KLP. Klären: Strang `umwelt` beibehalten, oder die
   zwei Bausteine weglassen?
6. **Größe:** 92 Bausteine, knapp über dem Ziel von 60–90. Weitere Kandidaten zum Zusammenlegen:
   `verhuetung` und `verhuetung-vergleichen` (aber verschiedene Richtstufen), `fruechte-und-samen` und
   `keimung-experiment`, `unspezifische-abwehr` und `spezifische-abwehr`. Lange iCan-Sätze, die vielleicht zwei
   Seiten brauchen: `trisomie-und-karyogramm`, `artbegriff-und-artbildung`, `spezifische-abwehr`.
7. **Sensible Themen** (`sexuelle-selbstbestimmung`, `sexuelle-vielfalt`, `schwangerschaftsabbruch`): Alle drei
   Länder nennen sie verbindlich. Ob eine Lern-App sie behandeln soll, ist eine Entscheidung der Plattform, nicht der
   Recherche.
8. **HE-Ausgabe:** Das KC nennt kein Erscheinungsjahr und keinen G8/G9-Bezug. Auf der Website gibt es nur diese eine
   Fassung für das Gymnasium. Ein eigenes G9-KC oder Hinweise zur Jahrgangsverteilung außerhalb des KC habe ich nicht
   gefunden. Ich nenne „Fassung 2011“ nach dem Erstellungsdatum der PDF.

## 5. Quellen, die ich nicht öffnen konnte

- **LehrplanPLUS, PDF-Gesamtlehrpläne:** derzeit nicht verfügbar (Hinweis auf https://www.lehrplanplus.bayern.de/gesamtlehrplaene).
  Ich habe stattdessen die Online-Fachlehrpläne gelesen; diese gelten. Die alten Adressen
  `…/fachlehrplan/gymnasium/5/nt` und `…/6/biologie` leiten auf die Startseite um. Gültig sind `…/5/nt_gym` usw.
- **schulentwicklung.nrw.de:** Die Lehrplannavigator-Adresse leitet auf qua-lis.nrw.de um. Den KLP (Heft 3413) habe
  ich vom Nachfolger lehrplannavigator.nrw.de geladen; es ist dasselbe Heft.
- Sonst fehlte keine Quelle.

Die Downloads liegen in `/tmp/claude-0/-home-user-apps/1c2b2c5a-27bd-5db5-a715-10acdfd55efc/scratchpad/src-bio/`.
Die Bausteine als Daten und das Prüfskript liegen in
`/tmp/claude-0/-home-user-apps/1c2b2c5a-27bd-5db5-a715-10acdfd55efc/scratchpad/gen/` (`data.py`, `check.py`).
