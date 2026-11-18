# Vergleich der Explainer-Entwürfe: Runde 2 und Runde 3

Stand 2026-11-17. Runde 2: Skill mit `Wiederholung`, `Davor`, `Danach`, `Daneben` (archiviert in `explainer-v2/`).
Runde 3: Skill nach KD-13/KD-14 (nur Grenzen und Didaktik, Kapitel mit eigener Didaktik), neue Agenten ohne Blick
ins Archiv. Grenzen gemessen mit dem Rand-Index über alle Paare von Bausteinen (1,0 = gleiche Grenzen).

| Fach | Runde 2 | Runde 3 | Gleiche Grenzen (Rand) | Paare aus Runde 2 auch in Runde 3 zusammen |
|---|---|---|---|---|
| Physik | 10 Explainer, 31 Kapitel | 7 Explainer, 37 Kapitel | 0,95 | 98 % |
| Politik-Wirtschaft | 16 Explainer, 52 Kapitel | 14 Explainer, 55 Kapitel | 0,99 | 99 % |
| Französisch | 10 Explainer, 44 Kapitel | 15 Explainer, 51 Kapitel | 0,91 | 44 % |

## Was gleich bleibt

- In Fächern mit Strang-Fokus sind die Grenzen stabil: zwei unabhängige Durchläufe ziehen sie fast gleich.
  Der Strang und die Karte geben die Grenzen weitgehend vor; der Skill trifft sie zuverlässig.
- Die tragenden Modelle sind ähnlich (Physik: Baukasten und Wasser-Analogie, Feldlinienbild, Energieflussdiagramm,
  Lichtstrahl, Spektrum; Politik-Wirtschaft: wachsendes Schaubild der Staatsorgane, Fallarbeit am Grundgesetz).

## Was sich ändert

- **Kapitel-Didaktik:** Runde 3 sagt je Kapitel, ob es das Konzept aufgreift, erweitert oder bewusst ersetzt
  (Physik: Rundweg → Wasserkreislauf → Elektronen mit der „Lupe“ im Baukasten; Politik-Wirtschaft: das Schaubild der
  Staatsorgane wird am Ende als Gewaltenteilung eingefärbt). Runde 2 hatte das nur als Begründung einzelner Kapitel.
- **Weniger Redundanz:** 39 bis 70 Zeilen je Fach mit Bezügen der Bausteine fallen weg. Die Texte sind trotzdem etwa
  20 % länger: Der Zuwachs ist Didaktik der Kapitel.
- **Größere Explainer, kleinere Kapitel in Physik:** Mechanik ist ein Explainer (eine Bewegungsspur trägt vom Messen bis
  zur Kraft), Haushalt gehört zu Stromkreise, Energieversorgung zu Energie. Kapitel haben 1 bis 4 Bausteine.
- **Berechnete Bezüge wirken:** Die Agenten haben mit `--relations` gegenseitige Abhängigkeiten zwischen Explainern
  aufgelöst (Französisch: keine zwei Explainer bauen mehr aufeinander auf) und Grenzen mitten durch Ketten vermieden.

## Offene Frage: Grammatik in den Sprachen

Französisch unterscheidet sich am stärksten, und zwar in einer didaktischen Grundsatzfrage:
- **Runde 2:** Die Nomengruppe (Artikel, Begleiter, Adjektive) steckt im Situations-Explainer „Salut !“; daneben drei
  System-Explainer (Verben, Zeiten, Sätze).
- **Runde 3:** Sechs System-Explainer, auch für Nomengruppe und Pronomen; die Situations-Explainer (Brieffreundschaft,
  Stadt, Zahlen, Bilder, Schreibwerkstatt …) sind kleiner und enthalten keine Grammatik mehr. Treiber war die Prüfung
  auf Grenzen mitten durch Ketten: Fast alle Grammatik-Bausteine von 5-6 hängen an `subjektpronomen` oder
  `bestimmter-artikel`.
Beides ist vertretbar. Runde 2 ist näher am Lehrbuch (Lektion mit Grammatik), Runde 3 trennt Systeme sauberer und hat
klarere Grenzen. Das sollte der Owner entscheiden, bevor die übrigen Sprachen (Englisch, Spanisch, Latein, Deutsch)
ausgerollt werden; der Skill nennt die Entscheidung dann als Regel.
