## Gemeinsame Konventionen für alle Explainer (Stand nach #470)

Referenz: [`lernapps/hello-millbrook`](https://github.com/lernapps/hello-millbrook), live unter <http://lernapps.net/hello-millbrook/>. Der **Inhaltsführer** `.agents/skills/app-content/SKILL.md` dort ist das Muster für jeden eigenen Inhaltsführer (Abschnitte, Übungsmuster, „Rules learned from mistakes“). Das Vorgehen selbst steht in den Skills; hier stehen nur die Dinge, die für alle Explainer gleich sein müssen.

### 1. Zuschnitt und Reihenfolge

- Ein Repository je Explainer: `lernapps/<name>`, App unter `https://lernapps.net/<name>/`.
- **Die erste Version baut nur die Kapitel der niedrigsten Stufe des Explainers.** Spätere Stufen kommen als Inkremente (`increment/<NN>-<name>`) in dasselbe Repository, nachdem die Lernenden älter geworden sind (siehe 2).
- Welle 1 sind die Kapitel der Stufe **5-6**. Aus den `requires` der Karte ergibt sich diese Schichtung (ein Baustein eines anderen Explainers wird als Wiederholungsseite `recap` am Kapitelanfang wiederholt, nicht neu geübt):

| Schicht | Explainer | braucht (Stufe 5-6) |
|---|---|---|
| 0 | #470 Hello, Millbrook! (fertig) | |
| 1 | #471 Pronomen · #472 Zeiten · #480 Verbketten | #472: `personalpronomen` aus #471 |
| 2 | #473 Sätze bauen · #475 Dinge, Mengen, Orte · #476 Adjektive, Adverbien · #481 Sätze verbinden | #472, #470 |
| 3 | #477 Alltag · #478 Großbritannien · #479 Geschichten · #482 Klang und Schrift | #472, #473, #475, #476 |

- Danach Welle 2 (Stufe 7-8: Inkremente zu #471, #472, #475, #476, #478, #479, #480, #481, #482 und die ersten Versionen von #484, #485, #486, #487) und Welle 3 (9-10: Inkremente zu #472, #473, #481, #484, #485, #486, #487 und die erste Version von #483).
- Eine Session baut ihre Schicht erst, wenn die vorige als Vorschau-Pull-Request vorliegt, damit Wiederholungsseiten auf echte Seiten verweisen können.

### 2. Die Figuren werden mit den Lernenden älter

| Stufe | Sophie ist | Form der Geschichte | Ton |
|---|---|---|---|
| 5-6 | 11 bis 12, erstes Schuljahr in Millbrook | gezeichnete Kinder, eine Szene je Seite (Vorlage in #470) | kurze Sätze, Dinge aus dem Alltag der Kinder |
| 7-8 | 13 bis 14, sie bleibt in England | Nachrichten, Chats und kurze Dialoge, ein Bild nur wo es etwas zeigt | längere Texte, eigene Meinung, erste Sachthemen |
| 9-10 | 15 bis 16 | ein realer oder realistischer Fall mit Daten, Quellen und einer Entscheidung; **keine erfundenen Kinder mehr** (`explainer-age-appropriate`) | sachlich, kein Kleinreden |

Der Inhalt entwickelt sich mit: Aus „Ich stelle mich vor“ wird erst „Ich erzähle von gestern“, dann „Ich begründe meine Meinung“, dann „Ich schreibe eine Bewerbung“.

### 3. Figuren und Orte (nicht ändern)

- **Sophie** (blond, Zöpfe, grüne Jacke, aus Deutschland, wohnt bei den Parkers), **Ellie Parker** (11, roter Pferdeschwanz, rote Jacke), **Peter Parker** (9, kurze braune Haare, gelbe Jacke, Ellies Bruder), **Amir** (11, schwarze Locken, Brille, blaue Jacke), **Mr Hill** (Englischlehrer, graue Haare, braune Jacke), **Mrs Parker** (Ellies Mutter, Sophies Gastmutter). Die Zeichnungen der Figuren stehen als `<g id="…">` in `src/images/millbrook-klassenzimmer.svg` von #470: von dort kopieren und gleich lassen.
- **Millbrook School**, erfundene Schule in einer englischen Kleinstadt. Schultag beginnt 8:45. Geburtstage: Peter 5. Mai, Ellie 10. Juli, Amir 12. Oktober, Sophie 14. Oktober.
- **Lagerraum und Schulfest** (#475): Der Lagerraum der Millbrook School liegt im Erdgeschoss neben dem Klassenzimmer. Mr Hill ordnet dort im Herbst mit Sophie, Ellie, Peter und Amir Dinge fürs Schulfest (Zählbares in Kisten, Nicht-Zählbares in Gläser, alles auf Regalen); Mrs Parker backt Kuchen. Das Schulfest ist am ersten Samstag im Dezember um 10 Uhr, der Schulkalender hängt neben der Lagerraumtür.
- **Ausstellung „Our Millbrook“** (#476): Im Flur der Millbrook School baut Mr Hills Klasse im Herbstquartal, einige Wochen nach Sophies Ankunft und vor den Elternabenden, eine Ausstellung mit Fotos und Zeichnungen von Orten, Dingen und Leuten der Stadt auf und beschriftet sie mit Anhängern. Kein Datum, kein Schulfest, kein Lagerraum.
- **Mrs Parker** (festgelegt nach #477, gilt für alle Bilder): rote Haare (#b5501e) als Dutt oben auf dem Kopf, türkise Strickjacke (#2a9d8f), Haut #f1cdb0, im Stil der Kinder. Nicht verwechseln mit Grandma Parker (graue Haare #bbb als Dutt, lila Strickjacke #8e5bb5) und Mr Hill (graue Haare #aaa, braune Jacke #8a5a2b); Mr Parker: kurze braune Haare #6b3f1e, graue Strickjacke #8d99a6. Die Figuren zeichnet die Funktion `adult` in `make_images.py` von `lernapps/englisch-alltag`.
- **Weitere Familie** (#477, nur im Stammbaum und als Beispiele, ohne eigene Szene): **Mr Parker** (Ellies und Peters Vater, kurze braune Haare, graue Strickjacke) und **Grandma Parker** (graue Haare zum Dutt, lila Strickjacke). **Sophies Eltern** in Deutschland heißen nur „Mum and Dad“ (ohne Namen, ohne Zeichnung außer einem kleinen Foto im Stammbaum; Sophies Mum ist blond). Keine weiteren Figuren ohne Rückfrage.
- **Stadtplan von Millbrook, Cornwall-Ausflug und London-Tag** (#478): Der Stadtplan von Millbrook (Hauptstraße, Bibliothek, Bäckerei, Bahnhof, Park, Kleidungsladen) ist erfunden und bleibt in allen Seiten gleich (die genaue Lage steht im Inhaltsführer von `englisch-grossbritannien`). Die Parkers fahren in den Herbstferien nach Cornwall; ein Tag in London mit Mr Hills Klasse gehört in Kapitel 3, die eigentliche Klassenfahrt nach London ist Kapitel 4 (später).
- **Geschichtenecke und Geschichtenwoche** (#479): Im Klassenzimmer von Mr Hill hängt das Wandbild „Geschichtenberg“ (Berg mit vier Stationen) mit der story map daneben. Mr Hills Geschichtenwoche ist im Januar, am Freitag lesen die Kinder einander vor. Kein Schulfest, kein Lagerraum, kein Flur.
- **Neue Orte und Personen** nur einführen, wenn der Explainer sie braucht, und hier als Kommentar eintragen, bevor ein zweiter Explainer sie benutzt.

### 4. Begriffe, Sprache und Aussprache

- „**Ausdruck**“ (fester Ausdruck), nie „Wendung“. Die Tabellen heißen „Klassenzimmer-Poster · …“ und „Schulkalender · …“ und wachsen von Explainer zu Explainer.
- Deutsche Erklärtexte, englische Beispiele, **britisches Englisch** (favourite, colour), Anrede „du“ (ab 9-10 nach Absprache).
- Keine englischen Sätze mit deutschen Wörtern darin. Die Fachbegriffe noun, verb, adjective, sentence, tense gelten ab #470.
- Aussprache: Lesehilfe in deutscher Annäherung (`gud-BAI`, `aim`, `FENK ju`), betonte Silbe in Großbuchstaben, keine Lautschrift. Lautschrift (IPA) gehört nur in #482.

### 5. Übungen und Audio

- Übungen von leicht zu schwer, mindestens vier je Seite, nicht überwiegend Raten, eigene Rückmeldung je typischem Fehler.
- Gelernte Regeln aus #470 (im Inhaltsführer): Übungen fragen nur Wörter ab, die vorher auf der Seite stehen. Eine Tabelle, die eine Übung beantwortet, steht nicht direkt darüber. Auswahlaufgaben zur Großschreibung zeigen alle Optionen gleich geschrieben. Gleichwertige richtige Antworten mit `(a|b)` zulassen.
- **Audio:** Stimme `bf_emma` (britisch). Nur ganze Sätze, keine Einzelwörter. Die Stimme hängt an kurzen Sätzen ein leises Ausklingen an („Lena…s“): Nach dem Erzeugen wird es abgeschnitten, das Skript `.agents/skills/app-content/scripts/regen_audio.py` aus #470 macht das. Steht ein Name am Satzende (Anrede), wähle einen zweisilbigen (Sophie, Peter gehen, Tom und Mark nicht); hänge aber keinen Namen nur wegen des Klangs an (siehe Abschnitt 7).
- Die Audio-Umgebung lädt etwa 0,6 GB (Netz: `pypi.org`, `github.com`, `huggingface.co`).

### 6. Vor dem Veröffentlichen

- Ein Lerner-Check der Musterseite und **ein Gesamtcheck** der fertigen App mit einem Sub-Agenten (Kind der jeweiligen Stufe), dazu eine Prüfung der englischen und deutschen Sprache. Die Funde werden behoben, bevor die App gezeigt wird.
- In dieser Reihe **stoppen die Sessions vor dem Veröffentlichen**: Der Vorschau-Pull-Request bleibt offen. Der Ersteller prüft die fertigen Pull-Requests und veröffentlicht.
- Befunde zur Karte gehören in das Issue „Lernlandkarte: offene Prüfpunkte“ (Label `map-review`). Fehler der Vorlage (zum Beispiel die Standardmeldung „Deine Fassung kann trotzdem richtig sein“, kleine Auswahlfelder) in `lernapps/app-templates`.

### 7. Gelernte Regeln aus Schicht 1 und 2 (gelten ab Schicht 3)

Die Issue-Texte sagen noch „Lena“ und „Josh“: In dieser Reihe heißt Lena **Sophie**; „Josh“ kommt nicht vor (neue Nebenfiguren nur nach Rückfrage, Namen am Satzende zweisilbig).

- **Diktat und Nachsprechen** bringen neue Sätze: kein Hörsatz steht wörtlich oder fast wörtlich (nur Name oder Farbe getauscht) im Einstieg, Poster, Merke, Bildtext oder in einer Auswahl-, Ordnungs-, Schreib- oder Übersetzungsübung derselben Seite. Prüfe das vor dem Checkpoint mit einem Skript über alle Seiten.
- **Keine Lösung im Text darüber:** Poster, Merke, Einstieg und Bild nennen andere Beispielsätze und Wörter als die Übungen darunter; das Bild zeigt nicht dieselben Wörter wie die Aufgabe.
- **Distraktoren** nur echte Lernerfehler (keine Unwörter wie „goodly“, „penes“ und keine erfundenen Schreibfehler); jeder Distraktor und jedes typische Fehlerbild eine eigene Meldung. Ein Einstiegs-`single-choice` hat mindestens drei Optionen.
- **Höchstens eine kurze Wörtertabelle** je Seite (Wörter außerhalb von A1/A2 und weniger einfache Wörter); einfache Wörter gelten als bekannt. Seiten mit mehr als etwa 25 Items oder 10 Übungen kürzen.
- Wörter, die die Übungen abfragen, stehen vorher auf der Seite. Wörter außerhalb des Grundwortschatzes werden auf der Seite erklärt und im Inhaltsführer gelistet (keine Wörter listen, die nirgends vorkommen).
- Die `competencies:` jeder Seite sind Karten-Ids (nicht Seitentitel); Wiederholungsseiten (`recap`) haben keine.
- Der Inhaltsführer verlangt dasselbe, was die Seiten tun, und umgekehrt (kein Widerspruch zwischen „Rules learned“ und gebauten Seiten); feste Bildwörter und Begriffe stehen einmal im Abschnitt „Terminology“.
- **Rückmeldung der Ersteller:in zu #471 und #475 (gilt für alle Apps):** (a) Hörsätze, die auf ein kurzes einsilbiges Wort enden, hatten nach dem Erzeugen einen Fehllaut am Ende. **Hänge dafür keinen Namen an** (Rückmeldung der Ersteller:in zu #475: „die angehängten Namen waren oft unnötig“): Ein Hörsatz bleibt der natürliche Satz. Erzeuge das Audio mit `regen_audio.py` (schneidet das Ausklingen ab) und trage jeden Hörsatz, der auf ein einsilbiges Wort endet, in die **Hörliste** im Inhaltsführer ein, damit die Ersteller:in gezielt hört. Ein Name am Satzende ist nur richtig, wenn der Satz ihn braucht (Anrede). (b) Menschen sind keine „Dinge“ und Beziehungen zwischen Personen (her brother, his sister) haben keinen „Besitzer“: sage „die Person, zu der es gehört“, „Zu wem gehört es?“ statt „Wessen Ding?“; „Besitzer“ und „Ding“ nur, wo es wirklich um Gegenstände geht.
- **Retrospektive:** nur Fakten. „Ersteller:in“ ist ein Mensch; die Orchestrator-Session, die die Checkpoints beantwortet, heißt „Orchestrator-Session (in der Rolle der Ersteller:in)“. „Creator turns“ zählt nur, was ein Mensch gesagt hat.
- **Bekannte Eigenheiten der Vorlage:** `ordering` zeigt Auswahlfelder statt Karten, `accepted` einer Sprach-Aufgabe wirkt nicht (Gruppen `(a|b)` benutzen), im Modus `choice` zeigt die App `mistakes` nicht, `punctuation: hint` meldet bei richtiger Antwort „Achte auf die Satzzeichen“ (setze `punctuation: ok`). Plane die Übungen danach; melde nur Neues.
- Der Gesamtcheck der App prüft auch alle obigen Punkte; der Orchestrator prüft zusätzlich unabhängig mit einem Skript und einem Sub-Agenten.

### 8. Höhere Stufen (7-8 und 9-10): Lesestücke und Quellen

Gilt für die Inkremente (Welle 2 und 3) und die ersten Versionen von #483 bis #487. Die Ersteller:in hat dieses Konzept bestätigt („passt“); Gutenberg ist vorerst ausgeschlossen.

- **Lesestück als Kern der Seite.** Jede Seite hat ein ansprechendes, altersgemäßes **Lesestück**: Stufe 7-8 etwa 150 bis 300 Wörter, Stufe 9-10 etwa 300 bis 600. Die Länge des Lesestücks zählt nicht zu den 350 Wörtern Erklärtext. Sorten: Chat-Verläufe und Nachrichten der Figuren, kurze Zeitungsartikel, Interviews, Tagebuch- und Blogeinträge, Geschichtenauszüge, Sachtexte mit Daten (Statistik, Umfrage, Karte). Aufbau: Vorwissen-Frage, Text in Abschnitten mit Randglossar (schwere Wörter am Rand), dann Aufgaben in drei Stufen (Verstehen, Belegen mit Zeile, Meinung), zuletzt ein Schreib- oder Sprechauftrag. Höchstens ein Lesestück je Seite, höchstens etwa 25 Items.
- **Figuren und Form:** Sophie ist in 7-8 13 bis 14 (Chats, kurze Dialoge, ein Bild nur wo es etwas zeigt), in 9-10 15 bis 16: realer oder realistischer Fall mit Daten, Quellen und einer Entscheidung, **keine erfundenen Kinder mehr**; Ton sachlich, kein Kleinreden.
- **Eigene Texte nach Fakten** sind der Normalfall: keine Sätze aus fremden Texten übernehmen. Jede Faktenangabe und jedes Zitat steht mit geöffneter Quelle im Inhaltsführer („Sources“); ohne Beleg kein Satz.
- **Erlaubte Quellen für Texte, die wir ganz übernehmen oder bearbeiten dürfen** (Lizenzseite beim Bau selbst öffnen und im Inhaltsführer die Seite und den Stand nennen): **VOA** (Learning English), nur Texte, Audio und Video, die VOA exklusiv selbst erstellt hat (Public Domain; kein AP/AFP/Reuters-Material, keine Bilder Dritter, Quellenangabe), **Wikinews** (ab 16.12.2024 CC BY 4.0, davor CC BY 2.5, Namensnennung „Wikinews“; Bilder einzeln), **African Storybook** (CC BY 4.0, Nutzungsbedingungen vorher lesen). **Nur für Fakten und als Stilvorlage:** Simple English Wikipedia (CC BY-SA: Bearbeitungen müssten unter CC BY-SA stehen), NASA und NOAA (Fakten und Bilder mit Quelle, kein Logo), Met Office (OGL). **Nicht benutzen:** Texte von BBC Newsround, Time for Kids, Newsela, CommonLit, DOGOnews, The Conversation (CC BY-ND), Teen Ink und anderen Jugendmagazinen ohne offene Lizenz; Project Gutenberg erst, wenn es freigegeben ist.
- **Heikle Themen** (Geschichte der USA, Freiheit und Gleichheit, Politik, Bewerben, Meinung, Herkunft): neutral und mit mehreren Sichtweisen, keine erfundenen Details zu Religion oder Herkunft realer Gruppen, kein Belehren.
- **Hörtexte:** `bf_emma`, ganze Sätze, Lesestücke nur in kurzen Abschnitten (Hörliste im Inhaltsführer, nichts Ungehörtes als „geprüft“ ausgeben).
- Alle Regeln aus Abschnitt 7 gelten weiter (keine Lösung im Text darüber, nur echte Lernerfehler, eigene Meldung je Fehler, Fuzzy-Prüfung der Hörsätze über alle Seiten, Retrospektive nur mit Fakten).
- **Inkremente:** `lernapps update` zuerst, dann `lernapps plan new increment-<NN>-<name>` auf Branch `increment/<NN>-<name>`, Seiten der neuen Stufe im selben Repository nach dem Muster der ersten Version, Vorschau-Pull-Request. Nicht nach `main` mergen, kein Katalogeintrag; die Ersteller:in prüft und veröffentlicht.
- **Hörurteile:** Die Ersteller:in hat die Hörproben bisher gehört und für gut befunden und erlaubt, Hörurteile ab sofort für sie zu bestätigen. Der Orchestrator bestätigt sie; Sessions fragen ihn, nicht die Ersteller:in. „Nichts angehört“ bleibt in der Hörliste stehen, bis ein Mensch die Sätze gehört hat.

---
