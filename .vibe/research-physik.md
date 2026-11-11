# Recherche Lernlandkarte Physik, Gymnasium Sekundarstufe I (Jg 5–10)

Grundlage für `map/physik.yaml`. Methode: `.agents/skills/map-research/SKILL.md`, Format:
`docs/learning-map-contract.md`.

Der erste Bericht zur Physik-Karte (Stränge, Bausteine, Richtstufen; feat/learning-map, KD-23) lag nur im Scratchpad
der damaligen Sitzung (`research-physik/report.md`) und ist nicht im Repo. Die Quellenkürzel stehen im Kopf von
`map/physik.yaml`. Diese Datei beginnt daher mit der Überarbeitung der Voraussetzungen; die Quellen habe ich dafür neu
geöffnet (6.2).

## 6. requires überarbeitet (2026-11-10, feat/map-chains)

Auftrag des Owners: Die Bausteine stehen in der fachlich richtigen Reihenfolge; wenige Wurzeln, keine allein
stehenden Bausteine; jede neue Kante mit Begründung aus einer Quelle oder als gekennzeichnete Herleitung (Skill
`map-research`, „Connect every competency“). Ich habe jede Wurzel in beide Richtungen geprüft (Was braucht sie? Was
baut auf ihr auf?) und alle 145 bestehenden Kanten gelesen. Die Begründung jeder neuen Kante steht als Kommentar
`# requires …` am Baustein. Ids, `gradeBand`, `status`, `iCan` und Stränge sind unverändert. Neue Bausteine habe ich
nicht eingefügt.

**Ergebnis in Kürze:** Die Karte war schon gut verbunden (kein Baustein allein, ein Teilnetz). Ich habe 6 Kanten mit
Quelle ergänzt und 9 entfernt: 4 waren schon vorher indirekt, 1 zeigte in die falsche Richtung, 4 wurden durch die
neuen Kanten indirekt. Eine Wurzel weniger. Wichtigste Änderung: Die elektrische Ladung kommt jetzt vor dem
Atommodell, nicht danach.

### 6.1 Zahlen

| | Kanten | Wurzeln | allein | Teilnetze | Stufen |
|---|---|---|---|---|---|
| vorher | 145 | 9 | 0 | 1 | 9 |
| nachher | 142 | 8 | 0 | 1 | 9 |

Geprüft: keine Kreise, keine Voraussetzung mit späterer Richtstufe, keine indirekte Kante (Messskript ohne Zeilen
`LATE` und `INDIRECT`; vorher gab es 5 Zeilen `INDIRECT` zu 4 Kanten). `npm test` grün (111 bestanden, 1 übersprungen
ohne Docker).

**Listing:** Die Karte hat kein `explainerFocus: competency` (es gilt `strand`). Auf Wunsch habe ich das Listing der
App `entries/elektrizitaet.yaml` trotzdem vorher und nachher erstellt. Beide sind gleich (bis auf die Uhrzeit):
bestanden mit 1 Warnung, die schon vorher bestand: `magnetwirkung-strom` setzt `permanentmagnete` voraus, das die App
nicht übt (Regel `entry-learning-map`; Abhilfe: Wiederholungsseite `recap: physik/permanentmagnete` oder Link zur
Karte). **Keine neuen Befunde.** Die geänderten Kanten betreffen nur Bausteine der Richtstufe 9-10, die die App
(Klasse 5–8) nicht übt.

### 6.2 Quellen

Alle Quellen habe ich am 10.11.2026 neu heruntergeladen und gelesen (PDF mit `pdftotext`, LehrplanPLUS als HTML).

| Kürzel | Titel | Ausgabe | URL |
|---|---|---|---|
| KMK | KMK: Weiterentwickelte Bildungsstandards in den Naturwissenschaften für das Fach Physik (MSA) | Beschluss vom 16.12.2004 i. d. F. vom 13.06.2024 (PDF vom 25.07.2024, 17 S.); „Verbindliche inhaltliche Aspekte“ S. 15–16 | https://www.kmk.org/fileadmin/Dateien/veroeffentlichungen_beschluesse/2024/2024_06_13-WeBiS_Physik_MSA.pdf |
| HE | Hessisches Kultusministerium: Bildungsstandards und Inhaltsfelder – Das neue Kerncurriculum für Hessen, Sekundarstufe I – Gymnasium, Physik | Fassung 2011 (Dateiname „201102“; PDF vom 22.02.2024, 47 S.) | https://kultus.hessen.de/sites/kultus.hessen.de/files/2024-02/kc_physik_uesekii_201102-uea.pdf (gefunden über https://kultus.hessen.de/Unterricht/Sekundarstufe-I-Kerncurricula) |
| BY | ISB Bayern: LehrplanPLUS Gymnasium, Natur und Technik 5–7, Physik 8–10 | Online-Fassung, abgerufen am 10.11.2026 | https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/5/nt_gym · …/6/nt_gym · …/7/nt_gym · …/8/physik · …/9/physik · …/10/physik |
| NW | MSB NRW: Kernlehrplan für die Sekundarstufe I Gymnasium in Nordrhein-Westfalen, Physik | Heft 3411, 1. Auflage 2019 (48 S.) | https://lehrplannavigator.nrw.de/system/files/media/document/file/g9_ph_klp_3411_2019_06_23.pdf |
| SiLP (nur Hinweis) | QUA-LiS NRW: Beispiel für einen schulinternen Lehrplan, Gymnasium Sek I, Physik | Fassung vom 31.01.2020 | https://lehrplannavigator.nrw.de/system/files/media/document/file/g9_ph_silp_2020_01_31.pdf |

Hinweis: Im Kopf von `map/physik.yaml` heißt der NRW-Lehrplan „Kernlehrplan … Physik (2019)“; die frühere URL mit
`3418` im Dateinamen gibt es nicht (Seite nicht gefunden), richtig ist Heft 3411.

**Fachdidaktik:** Für die neuen Kanten war keine nötig; KMK und Länder tragen sie selbst. Ich habe keine
fachdidaktische Quelle zitiert.

### 6.3 Neue Kanten (6)

| Baustein | Voraussetzung | Grund | Fundstelle | Art |
|---|---|---|---|---|
| `kraft-wirkungen` | `geschwindigkeitsaenderung` | Dass eine Kraft die Bewegung ändert, setzt den Begriff der Geschwindigkeitsänderung voraus. BY und NW lehren die Bewegungsänderung vor den Kräften. | KMK S. 15 („Kräfte und ihre Wirkungen, insbesondere Geschwindigkeitsänderung (Betrag und Richtung)“); BY Ph8 3.1 („Geschwindigkeitsänderung … als Folge einer Krafteinwirkung“) vor 3.2 („Kräfte und ihre Wirkungen“); NW IF7 S. 36 („Bewegungen: Geschwindigkeit, Beschleunigung“ vor „Kraft: Bewegungsänderung, Verformung“) | Quelle |
| `atomaufbau` | `elektrische-ladung` | Kern und Hülle, Protonen und Elektronen unterscheidet man nach ihrer Ladung. | BY NT7 1.3 („Ladungsarten und ihre grundlegenden Eigenschaften, Kern-Hülle-Modell des Atoms“, ein Abschnitt); NW IF9 S. 39 („Elektrostatik: elektrische Ladungen“) vor IF10 S. 41 („Atomaufbau“) | Bündel |
| `elektrostatische-phaenomene` | `atomaufbau` | Aufladung erklärt man damit, dass Elektronen der Hülle von einem Körper zum anderen wechseln, der Kern aber bleibt. | BY NT7 1.3 („erklären einfache elektrostatische Phänomene … mithilfe ihrer Kenntnisse über Ladungseigenschaften und über das Kern-Hülle-Modell des Atoms“); NW IF9 S. 40 („elektrische Aufladung … mithilfe eines einfachen Elektronen-Atomrumpf-Modells erklären“) | Quelle |
| `strom-als-ladungstransport` | `atomaufbau` | Das Elektronenmodell des Stroms braucht die Elektronen der Hülle, die sich zwischen festen Atomrümpfen bewegen. | NW IF9 S. 39 („Elektronen-Atomrumpf-Modell, Ladungstransport und elektrischer Strom“), S. 40 („Leitungseigenschaften … mithilfe eines einfachen Elektronen-Atomrumpf-Modells erklären“); BY NT7 1.3 (Kern-Hülle-Modell und „elektrischer Strom als Bewegung von Ladungen“ im selben Abschnitt) | Quelle |
| `strahlungshaushalt-erde` | `waermestrahlung` | Die Erde nimmt Sonnenstrahlung auf und gibt Wärmestrahlung ab; ohne Wärmestrahlung lässt sich die Bilanz nicht beschreiben. | BY Ph9 3.2 („beschreiben … Wärmestrahlung. Sie nutzen diese Kenntnisse, um … die Vorgänge zu erklären, die zur Erwärmung der Erdatmosphäre führen“; Inhalt „Strahlungsgleichgewicht der Erde“); KMK S. 15 | Quelle |
| `mondphasen` | `lichtquellen-und-sehen` | Der Mond leuchtet nicht selbst; man sieht nur seine von der Sonne beleuchtete Hälfte. | BY NT7 1.2 („Lichtquellen und beleuchtete Körper, Sehvorgang“ und „Mondphasen, Mond- und Sonnenfinsternis“ im selben Abschnitt) | Bündel |

Summe: 4 × Quelle, 2 × Bündel, 0 × Herleitung.

### 6.4 Entfernte Kanten (9)

| Baustein | Voraussetzung | Grund |
|---|---|---|
| `energieerhaltung` | `energieumwandlung` | Indirekt: folgt über `energieuebertragung` → `energieumwandlung`. |
| `energiebilanz` | `energie-und-joule` | Indirekt: folgt über `lageenergie-berechnen` und `bewegungsenergie-berechnen`. |
| `hausinstallation-sicherungen` | `widerstand` | Indirekt: folgt über `elektrische-leistung` → `ohmsches-gesetz-rechnen` → `ohmsches-gesetz` → `widerstand`. |
| `kernspaltung` | `atomaufbau` | Indirekt: folgt über `spontanzerfall` → `radioaktivitaet` → `atomaufbau`. |
| `elektrische-ladung` | `atomaufbau` | Falsche Richtung. Das iCan (Ladungen beschreiben, gleich- und verschiedenartige Ladungen) braucht kein Atommodell; umgekehrt braucht das Atommodell die Ladung (6.3). BY lehrt Ladungen schon in NT7, das Kern-Hülle-Modell im selben Abschnitt; NW die Elektrostatik in IF9 vor dem Atomaufbau in IF10. |
| `elektrostatische-phaenomene` | `elektrische-ladung` | Wird indirekt durch die neue Kante zu `atomaufbau` (→ `elektrische-ladung`). |
| `strom-als-ladungstransport` | `elektrische-ladung` | Wird indirekt durch die neue Kante zu `atomaufbau` (→ `elektrische-ladung`). |
| `kraft-aendert-geschwindigkeit` | `geschwindigkeitsaenderung` | Wird indirekt durch die neue Kante `kraft-wirkungen` → `geschwindigkeitsaenderung` (über `kraft-darstellen` → `kraft-wirkungen`). |
| `strahlungshaushalt-erde` | `absorption-emission-transmission` | Wird indirekt durch die neue Kante zu `waermestrahlung` (→ `absorption-emission-transmission`). |

Sonst war keine bestehende Kante inhaltlich falsch. Fraglich, aber behalten: `schaltzeichen` → `schalter` und
`elektrische-leistung` → `ohmsches-gesetz-rechnen` (siehe 6.7).

### 6.5 Wurzeln, die bleiben (8, keine allein)

| Baustein | Strang | Grund |
|---|---|---|
| `energieformen` | energie | Anfang des Strangs; die KMK nennt die Energieformen als ersten Inhalt (S. 15). 23 Bausteine bauen direkt oder indirekt darauf auf. Eine Kante zu `thermische-energie` wäre nur mittel sicher (6.7). |
| `einfacher-stromkreis` | elektrizitaetslehre | Anfang der Elektrizitätslehre (NW IF2 Jg 6, BY NT7 1.3, HE s1). |
| `elektrische-ladung` | elektrizitaetslehre | Anfang der Elektrostatik; eine Größe der KMK (S. 15). Braucht keinen anderen Baustein. Neu Wurzel, weil die Kante zu `atomaufbau` falsch herum war (6.4). |
| `permanentmagnete` | elektrizitaetslehre | Anfang des Magnetismus (NW IF2 Jg 6, BY NT7 1.1, HE s1). |
| `strecke-und-zeit-messen` | mechanik | Grundgrößen der Mechanik (KMK S. 15: Ort, Strecke, Zeit); Anfang der Bewegungslehre. |
| `masse` | mechanik | Grundgröße (KMK S. 15; BY NT5 1.1 Massenbestimmung). `gewichtskraft` baut darauf auf. |
| `temperatur` | elektromagnetische-strahlung | Grundgröße (KMK S. 15; BY NT5 1.1 Celsiusskala). `thermische-energie` und `waermestrahlung` bauen darauf auf. |
| `geradlinige-lichtausbreitung` | elektromagnetische-strahlung | Anfang der Optik (NW IF4 Jg 6, BY NT7 1.2, HE s1). |

Nicht mehr Wurzel: `kraft-wirkungen` (jetzt nach `geschwindigkeitsaenderung`) und `atomaufbau` (jetzt nach
`elektrische-ladung`). Der Strang `ionisierende-strahlung` hat damit keine eigene Wurzel mehr; er beginnt mit
`atomaufbau`, das an der Elektrizitätslehre hängt.

### 6.6 Vorgeschlagene neue Bausteine

Für die verbleibenden Wurzeln fehlt kein Zwischenschritt. Ein Vorschlag, nicht nötig für die Anbindung: ein eigener
Baustein „Kern-Hülle-Modell“ zwischen `elektrische-ladung` und `atomaufbau` (Begründung und Kanten in 6.7, Punkt 3).
Die Lehrkräfte sollten entscheiden, ob er sich lohnt.

### 6.7 Offene Punkte (auch Kanten mit nur mittlerer Zuversicht)

1. **`energieformen` → `thermische-energie`** (NW lehrt Temperatur und Wärme in IF1, Jg 6, vor den Energieformen in
   IF7). Mittel: das iCan von `energieformen` zählt die thermische Energie nur auf und braucht die Unterscheidung von
   Temperatur und thermischer Energie nicht. Nicht aufgenommen.
2. **`schaltzeichen` → `schalter`**: Ein Schaltplan braucht den Schalter nicht unbedingt; näher läge
   `einfacher-stromkreis`. Behalten, weil das Schaltzeichen des Schalters zu jedem Schaltplan der Klasse 5/6 gehört
   und die Kante nichts Falsches ordnet.
3. **`atomaufbau` ist feiner, als das Elektronenmodell braucht.** NW nennt in IF9 nur das einfache
   Elektronen-Atomrumpf-Modell, Protonen und Neutronen erst in IF10. `elektrostatische-phaenomene` und
   `strom-als-ladungstransport` brauchen nur Kern und Hülle. Falls Lehrkräfte das anders sehen: ein eigener Baustein
   „Kern-Hülle-Modell“ (id z. B. `kern-huelle-modell`, iCan „Ich kann erklären, dass ein Atom aus einem positiv
   geladenen Kern und einer Hülle aus Elektronen besteht.“, Strang `elektrizitaetslehre`, Richtstufe offen (BY NT7 1.3 lehrt
   es in Jg 7, NW in IF9); Kanten: → `elektrische-ladung`; `atomaufbau`, `elektrostatische-phaenomene`,
   `strom-als-ladungstransport` → ihn). Das wäre eine Änderung des Modells mit Richtstufe; ich schlage sie nur vor.
4. **`elektrische-leistung` → `ohmsches-gesetz-rechnen`**: P = U · I braucht das ohmsche Gesetz nicht, nur Spannung
   und Stromstärke. Behalten, weil BY und NW das ohmsche Gesetz vorher lehren (BY Ph8 1 vor Ph9 1.2; NW IF9: Widerstand vor
   „elektrische Energie und Leistung“)
   und Aufgaben zur Leistung oft U = R · I nutzen. Mittel sicher, ob die Kante direkt ist.

### 6.8 Nicht geöffnet

- Fachdidaktische Handbücher (z. B. zur Reihenfolge Elektrostatik vor Atommodell) habe ich nicht gebraucht und nicht
  geöffnet.
- Den ersten Bericht der Physik-Karte (Scratchpad einer früheren Sitzung) gibt es nicht mehr; die Quellen habe ich
  neu geöffnet.

Downloads: `/tmp/claude-0/-home-user/63cb6fc9-e6ad-586d-91c1-59230f4b1df1/scratchpad/src-physik/`.
