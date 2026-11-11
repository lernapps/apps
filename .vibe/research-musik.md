# Recherche Lernlandkarte Musik, Gymnasium Sekundarstufe I (Jg 5–10)

Grundlage für `map/musik.yaml`. Methode: `.agents/skills/map-research/SKILL.md`, Format:
`docs/learning-map-contract.md`.

**Hinweis:** Einen eigenen Recherchebericht für Musik gab es bisher nicht im Repository. Die erste Fassung der Karte
(feat/learning-map, KD-17) hat ihre Quellen nur im Kopf von `map/musik.yaml` und in der Zusammenfassung des
Pull Requests genannt. Die Kürzel der Quellen stehen im Kopf der Karte (KC, G9, BY, NW, RP). Dieser Bericht beginnt
deshalb mit der Überarbeitung der Voraussetzungen.

## 6. requires überarbeitet (2026-11-10, feat/map-chains)

Auftrag des Owners: Die Bausteine stehen in der fachlich richtigen Reihenfolge; wenige Wurzeln, keine allein stehenden
Bausteine; jede neue Kante mit Begründung (Skill `map-research`, Abschnitt „Connect every competency“). Ich habe alle
250 Kanten geprüft und für jede Wurzel in beide Richtungen gesucht. Die Begründung jeder neuen Kante steht als
Kommentar `# requires …` am Baustein. Ids, `gradeBand`, `status`, `iCan` und Stränge sind unverändert. Keine neuen
Bausteine.

### 6.1 Zahlen

| | Kanten | Wurzeln | allein | Teilnetze | Stufen |
|---|---|---|---|---|---|
| vorher | 250 | 6 | 0 | 2 | 13 |
| nachher | 245 | 6 | 0 | 1 | 13 |

Geprüft: keine Kreise, keine Voraussetzung mit späterer Richtstufe, keine indirekte Kante (vorher 14 Meldungen zu
11 Kanten). `npm test` grün (1 Test ohne Docker übersprungen).

Vorher gab es neben dem großen Netz ein zweites Teilnetz: `spieltechnik-instrument` → `instrument-technisch-korrekt`.
Nichts baute auf dem Instrumentalspiel auf. Jetzt ist alles ein Netz.

**Listing:** Die Karte hat kein `explainerFocus` (also `strand`). Die App `entries/musik.yaml` nutzt das Fach. Ich habe
`npm run listing` vorher und nachher laufen lassen: beide Male „bestanden“, keine Befunde, die Ergebnisse sind gleich.
Keine neuen Befunde.

### 6.2 Quellen

Am 10.11.2026 neu heruntergeladen und gelesen (PDF mit `pdftotext`, LehrplanPLUS und GIML als HTML). Seitenzahlen
sind die gedruckten Seiten.

| Kürzel | Titel | Ausgabe | URL |
|---|---|---|---|
| KC | Hessisches Kultusministerium: Bildungsstandards und Inhaltsfelder – Das neue Kerncurriculum für Hessen, Sekundarstufe I – Gymnasium, Musik | Entwurf (PDF erstellt 2014, geändert 01.07.2021), 28 S. | https://kultus.hessen.de/sites/kultus.hessen.de/files/2021-07/kerncurriculum_musik_gymnasium.pdf |
| G9 | Hessisches Kultusministerium: Lehrplan Musik, Gymnasialer Bildungsgang, Jahrgangsstufen 5 bis 13 (G9) | PDF vom 08.02.2016, 36 S. | https://kultus.hessen.de/sites/kultus.hessen.de/files/2021-06/g9-musik.pdf |
| BY | ISB Bayern: LehrplanPLUS Gymnasium, Fachlehrplan Musik, Mu5 bis Mu10 | Online-Fassung, abgerufen am 10.11.2026 | https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/5/musik · …/6/musik · …/7/musik · …/8/musik · …/9/musik · …/10/musik |
| NW | MSB NRW: Kernlehrplan für die Sekundarstufe I Gymnasium in Nordrhein-Westfalen, Musik | Heft 3406, 2019, 34 S. | https://lehrplannavigator.nrw.de/system/files/media/document/file/g9_mu_klp_3406_2019_06_23_0.pdf |
| GIML (neu, Fachdidaktik) | Gordon Institute for Music Learning: Music Learning Theory, Seite „Methodology“ (nach E. E. Gordon, Learning Sequences in Music, GIA 2012) | Online-Fassung, abgerufen am 10.11.2026 | https://giml.org/mlt/methodology/ |

KMK-Bildungsstandards für Musik gibt es nicht (KD-17); die Karte stützt sich auf das KC Hessen und vergleicht mit den
Ländern.

**Hinweise:**
- **G9** hat auf S. 8–10 eine Übersicht „Umgangsweisen – Lerninhalte – Grundkompetenzen“ nach Jahrgang (5, 6, 8, 10).
  Steht ein Inhalt dort in einem früheren Jahrgang als ein anderer im selben Lernfeld, nutze ich das als Bündel.
- **BY** bündelt in einem Lernbereich oft eine Kompetenz und einen Inhalt (z. B. Mu7 LB1: Stimmphysiologie und
  Mutation). Solche Bündel nutze ich als Quelle für Kanten.
- **GIML** (Music Learning Theory) begründet nur `requires`: Erst hören und nachsingen oder nachklatschen
  („aural/oral“), dann Noten lesen („symbolic association“); Rhythmus erst über Bewegung und Grundschlag
  („macrobeats, microbeats“). Das stützt die bestehende Ordnung „Hören vor Notation“ (z. B. `notenwerte-erkennen` →
  `tondauer-hoeren`, `rhythmus-lesen` → `rhythmus-nachklatschen`) und eine neue Kante (6.3).

### 6.3 Neue Kanten (6)

„Bündel“: Ein Lehrplan nennt beides im selben Jahr oder Lernbereich, oder lehrt die Voraussetzung früher.

| Baustein | Voraussetzung | Grund | Fundstelle | Art |
|---|---|---|---|---|
| `mitspielsatz` | `spieltechnik-instrument` | Wer im Mitspielsatz eine Stimme spielt, braucht die Spieltechnik seines Instruments. | G9 S. 8, Lernfeld Gestalten mit Instrumenten (Jg 5: „Spieltechniken“, Jg 6: „Mitspielsätze“); G9 S. 14, 5/04 („Spielweisen“; „Einsatz vorhandener Instrumente bei Klassenarrangements und Mitspielsätzen“) | Bündel |
| `stimme-im-stimmwechsel` | `stimme-klangquelle` | Was im Stimmwechsel passiert, erklärt man mit dem Wissen, wie die Stimme entsteht. | BY Mu7 LB1 („beschreiben mit Wissen um physiologische Grundlagen erlebte Funktionsweisen der eigenen Stimme“; „Die Stimme in der Phase der Mutation“) | Bündel |
| `dreiklangsarten` | `intervall-qualitaet` | Dur- und Moll-Dreiklang unterscheiden sich in der großen oder kleinen Terz. | BY Mu6 LB4 („bestimmen Intervalle bis zur Quinte sowie Dreiklangsformen in Dur und Moll“; „Intervalle bis zur Oktave: rein, groß und klein“); G9 S. 10, Jg 6 („genauere Intervallbestimmung“, „Dreiklangsarten“) | Bündel |
| `melodie-lesen` | `tonfolge-nachsingen` | Noten liest man erst, wenn man Tonfolgen hörend nachsingen kann; so baut schon `rhythmus-lesen` auf `rhythmus-nachklatschen` auf. | GIML, Methodology, Abschnitt „Sequence“ („learn to read notation …, but only after they have developed the ability to audiate the note patterns“) | Quelle |
| `popularmusik-stile` | `beat-offbeat` | Stile unterscheidet man auch am Rhythmus; BY lehrt den Off-Beat in Stilen der Popularmusik ein Jahr früher. | BY Mu7 LB4 („Synkope, Off-Beat … in Stilen der Popularmusik“) → BY Mu8 LB4 („unterscheiden charakteristische Merkmale verschiedener Stile in der Popularmusik (z. B. Rhythmik, Besetzung, Sound)“) | Bündel |
| `popularmusik-stile` | `ensembles-besetzungen` | Stile unterscheidet man auch an der Besetzung; das iCan nennt sie ausdrücklich. | BY Mu6 LB4 („charakteristische Elemente aus den Bereichen Besetzung …“) → BY Mu8 LB4 (wie oben) | Bündel |

Summe: 1 Quelle (Fachdidaktik), 5 Bündel, 0 Herleitungen.

### 6.4 Entfernte Kanten (11)

Alle sind indirekt: Die Voraussetzung folgt schon über eine andere Kante desselben Bausteins. Keine bestehende Kante
war inhaltlich falsch (Zweifelsfälle in 6.7).

| Baustein | entfernte Voraussetzung | folgt schon über |
|---|---|---|
| `instrumentenfamilien` | `klangquellen-unterscheiden` | `schwingung` |
| `elektronische-klangerzeugung` | `schwingung` | `klangformung` |
| `klang-gestalten` | `klangformung` | `klang-verfremden` |
| `beat-offbeat` | `betonung-hoeren` | `synkope` (→ `weitere-taktarten` → `taktarten-unterscheiden`) |
| `diatonik-chromatik` | `halbtonschritte` | `tonleiter-ganzton-halbton` |
| `hoerpartitur-verfolgen` | `konzentriert-hoeren` | `grafisch-notieren` (→ `parameter-nennen`) |
| `mehrstimmig-realisieren` | `aufeinander-hoeren` | `zweistimmig-singen` |
| `musizieren-anleiten` | `aufeinander-hoeren` | `gesten-verstehen` |
| `musik-zeitepoche` | `epoche-barock` | `epoche-neue-musik` (Kette der Epochen) |
| `musik-zeitepoche` | `epoche-klassik` | `epoche-neue-musik` |
| `musik-zeitepoche` | `epoche-romantik` | `epoche-neue-musik` |

`musik-zeitepoche` braucht weiter alle vier Epochen, jetzt über die Kette Barock → Klassik → Romantik → 20. Jh.
(siehe offenen Punkt 1).

### 6.5 Wurzeln, die bleiben (6, keine allein)

| Baustein | Grund |
|---|---|
| `konzentriert-hoeren` | Anfang des Fachs: Das KC nennt fundiertes Hörwissen „in allen musikalischen Handlungsfeldern“ zentral (KC S. 20, Kap. 7.1, Inhaltsfeld Hörkultur). Parameter, Formteile und das Musizieren bauen darauf auf. |
| `klangquellen-unterscheiden` | Anfang des Strangs Klang: Stimme, Körper und Instrumente als Klangquellen (KC S. 20, Kap. 7.1, Inhaltsfeld Klang). Schwingung, Stimme und freies Experimentieren bauen darauf auf. Eine Kante zu `konzentriert-hoeren` wäre nur mittel sicher (man unterscheidet Klangquellen auch durch Sehen und Anfassen). |
| `haltung-atmung` | Anfang des Singens (KC 7.1: „mit stimmgerechter Körperhaltung und Atmung … singen“); Stimmpflege und Intonation bauen darauf auf. |
| `spieltechnik-instrument` | Anfang des Instrumentalspiels; braucht keinen anderen Baustein sicher. Jetzt bauen `instrument-technisch-korrekt` und `mitspielsatz` darauf auf. |
| `ueben-strategien` | Methode des Übens; braucht keinen anderen Baustein. `musizieren-korrigieren` baut darauf auf. |
| `herkunft-einordnen` | Anfang des Strangs Kontext (wann, wo, von wem); Biografie, Kulturen und Gebrauchspraxis bauen darauf auf. |

### 6.6 Vorgeschlagene neue Bausteine (Lücken im Modell)

Für die Ketten fehlt kein Baustein. Es gibt keine allein stehenden Bausteine.

### 6.7 Offene Punkte (nicht in der Karte)

1. **Kette der Epochen:** `epoche-klassik` → `epoche-barock` → … → `epoche-neue-musik` heißt: Man versteht eine
   Epoche im Vergleich mit der vorigen (z. B. Klassik gegen Barock). Wer die Epochen lieber unabhängig will, streicht
   die drei Kettenkanten und gibt `musik-zeitepoche` wieder alle vier Epochen. Lehrkräfte sollten entscheiden.
2. **`grundschlag-finden` → `tempo-hoeren`:** Nach GIML (Methodology, „Rhythmic Movement“) kommt der Grundschlag
   zuerst, und Tempo ist die Geschwindigkeit des Grundschlags. Die umgekehrte Richtung (`tempo-hoeren` →
   `grundschlag-finden`) wäre fachlich plausibler. Ich habe die Kante nicht gedreht: Das KC (7.1, Parameter) nennt
   Tempo als Grundeigenschaft vor Metrum und Rhythmus, und das Drehen ändert die Ordnung des ganzen Strangs.
3. **`tonaufnahme-erstellen` → `lied-begleiten`:** Keine Quelle verbindet die Tonaufnahme gerade mit der
   Liedbegleitung (G9 S. 8: „Tonaufnahme erstellen“ ohne Bezug). Die Kante ist nicht falsch (man nimmt etwas auf, das
   man spielt), aber beliebig.
4. **`gesten-verstehen` → `aufeinander-hoeren`:** Handzeichen versteht man auch allein; die Kante gilt nur für das
   Reagieren in der Gruppe. Mittlere Zuversicht, deshalb unverändert.
5. **`musik-nach-vorgabe-erfinden` → `programmmusik-hoeren`:** G9 6/08 (S. 18) verbindet Hören von erzählender
   Musik und „Musik zu Geschichten / Musik zum Bild“. G9 nennt Klanggeschichten aber schon in Jg 5, vor 6/08.
   Mittlere Zuversicht.
6. **`formverlauf-darstellen` → `grafisch-notieren`:** G9 nennt „Hörverläufe grafisch“ (S. 9, Jg 5); das iCan sagt
   aber nur „in einer Übersicht“. Mittlere Zuversicht.
7. **`improvisieren-nach-vorgabe` → `hauptfunktionen`:** BY Mu7 LB1 nennt Improvisation über „einfache harmonische
   Modelle“; das iCan sagt aber „Pattern *oder* Akkordfolge“. Mittlere Zuversicht.
8. **`spieltechnik-instrument` → `klangformung`:** G9 5/04 (S. 14) nennt Bau, Tonerzeugung und Spielweisen zusammen.
   Spieltechnik lernt man aber auch ohne dieses Wissen. Mittlere Zuversicht; der Baustein bleibt Wurzel.

### 6.8 Nicht geöffnet

- **E. E. Gordon, Learning Sequences in Music (GIA 2012)** im Original: nicht frei zugänglich. Ich zitiere nur die
  Seite des Gordon Institute. Die Seite `https://giml.org/mlt/skill-learning-sequence/` gab HTTP 404.
- **RP** (Lehrplan Rheinland-Pfalz) habe ich für diese Runde nicht neu geöffnet; keine neue Kante stützt sich darauf.
- Handbücher der Musikdidaktik (z. B. Jank, Musik-Didaktik) sind nicht frei online; nicht geöffnet, nicht zitiert.
