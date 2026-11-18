# Explainer: Physik

Stand 2026-11-17, Methode: Skill `map-explainers`. 10 Explainer, 31 Kapitel, 107 von 108 Bausteinen.

Material: die Rohdaten von `draft.mjs physik`, die Kommentare in `map/physik.yaml` (KMK, HE, BY, NW) und der erste
Versuch `map/physik/units.md` (22 Lernpakete). Die Lernpakete sind hier meist Kapitel geworden; einige sind
zusammengelegt oder anders geschnitten (siehe die Kapitel).

## Prinzipien des Fachs

Physik lernt man, indem man ein **Phänomen beobachtet**, ein **Experiment** macht und dann ein **Modell** baut, mit
dem man das Phänomen erklären und am Ende auch berechnen kann. Ein Physik-Explainer ist deshalb um ein Modell oder
ein Bild herum gebaut, das in jedem Kapitel wiederkommt: die Wasser-Analogie im Stromkreis, das Feldlinienbild beim
Magnetismus, das Energieflussdiagramm bei der Energie, der Kraftpfeil in der Mechanik, der Lichtstrahl in der Optik,
das Spektrum bei der Strahlung, das Zählrohr bei der Radioaktivität.

- **Bauen und messen, auch virtuell.** Wo es geht, baut das Kind selbst auf (Schaltung, Strahlengang, Kräfte) und
  misst in einer Simulation (Amperemeter, Kraftmesser, Zählrohr). Echte Versuche aus dem Physikraum werden als
  Video oder Bild gezeigt und dann am Bildschirm nachgebaut.
- **Qualitativ vor quantitativ.** Erst verstehen, dann rechnen. Wo die Karte eine Größe und ihre Berechnung trennt
  (Leistung, Lageenergie, ohmsches Gesetz, Halbwertszeit), stehen beide im selben Kapitel oder in aufeinander
  folgenden Kapiteln desselben Explainers.
- **Schnitt nach Strängen.** Physik hat `explainerFocus: strand`. Ein Explainer bleibt in seinem Strang. Er läuft
  über mehrere Stufen, wenn dasselbe Modell trägt (Stromkreise von 5-6 bis 9-10). Ein Strang hat mehrere Explainer,
  wenn die Themen ein anderes Modell oder eine andere Arbeitsweise brauchen: In der Elektrizitätslehre sind das
  Stromkreise (Wasser-Analogie), Strom im Haushalt (Gerät und Sicherheit) und Elektromagnetismus (Feldlinien).
- **Bewerten als eigene Arbeitsweise.** Wo die Länder Bewertung verlangen (Energieversorgung, Klima, Kernenergie),
  arbeitet ein Kapitel mit Fällen, Tabellen zum Abwägen und Argumenten, nicht mit Experimenten.
- **Typische Ausnahmen.** Die Länder lehren einige Themen in verschiedenen Jahrgängen (Elektromagnet, thermische
  Energie). Dort steht ein Baustein in einem Kapitel einer Nachbarstufe; das ist im Kapitel begründet. Die Stränge
  greifen ineinander (Ladung → Atom → Elektronenstrom, Leistung → elektrische Leistung); das lösen Wiederholungen.

## Explainer

### stromkreise · Stromkreise
- Explainer: strand physik/elektrizitaetslehre
- Leitidee: Ich verstehe, wie ein Stromkreis funktioniert, kann Schaltungen bauen, Stromstärke, Spannung und Widerstand messen und mit dem ohmschen Gesetz berechnen.
- Didaktik: Durchgehend die Wasser-Analogie: Die Batterie ist eine Pumpe, der Strom ist das fließende Wasser, die Spannung ist der Druckunterschied, der Widerstand ist eine enge Stelle im Rohr. Jedes Kapitel zeigt Wasserkreis und Stromkreis nebeneinander. Das Kind baut in einem virtuellen Schaltungsbaukasten selbst (Batterie, Lampen, Schalter, Kabel) und misst dort mit Amperemeter und Voltmeter. Ab 9-10 wird das Bild genauer: Das „Wasser“ sind Elektronen, die enge Stelle sind die Atomrümpfe, an denen sie sich stoßen.
- Abgrenzung: Drin ist alles, was man mit dem Modell des Stromkreises erklärt: Kreis, Leiter, Schaltungen, Schaltplan, Stromstärke, Spannung, Ladung, Widerstand, ohmsches Gesetz, Schaltungen berechnen. Nicht drin sind die Wirkungen und Gefahren des Stroms, Leistung und Energie im Haushalt (eigener Explainer mit dem Gerät im Mittelpunkt) und der Magnetismus (anderes Modell: Feldlinien).
- Davor: Sachunterricht der Grundschule (Stromkreis mit Batterie und Lampe)
- Danach: strom-im-haushalt, elektromagnetismus
- Daneben: radioaktivitaet (Atomaufbau mit Ladungen)

#### stromkreis-bauen · Wann leuchtet die Lampe? (5-6)
- Kernidee: Ich kann einfache Stromkreise mit Schalter, in Reihe und parallel aufbauen und als Schaltplan zeichnen.
- Bausteine: einfacher-stromkreis, leiter-nichtleiter, spannungsquellen, schalter, schaltzeichen, reihenschaltung, parallelschaltung

#### strom-und-spannung · Stromstärke und Spannung messen (7-8)
- Kernidee: Ich kann erklären, was Stromstärke und Spannung sind, und sie mit Amperemeter und Voltmeter richtig messen.
- Bausteine: stromstaerke, stromstaerke-messen, spannung, spannung-messen

#### was-fliesst · Was fließt im Draht? (9-10)
- Kernidee: Ich kann Aufladung mit positiven und negativen Ladungen erklären und den Strom als Fluss von Elektronen beschreiben.
- Bausteine: elektrische-ladung, elektrostatische-phaenomene, strom-als-ladungstransport
- Wiederholung: physik/atomaufbau
- Begründung: Versuche mit Luftballon, Folie und Glimmlampe. Das Kapitel steht vor dem Widerstand, weil das Elektronenmodell den Widerstand anschaulich macht. Die Wiederholung „Aufbau des Atoms“ baut selbst auf der Ladung auf; sie muss das Atom mit Kern und Hülle zeigen, ohne den Ladungsbegriff vorauszusetzen (siehe Hinweise zur Karte).

#### widerstand · Widerstand und ohmsches Gesetz (9-10)
- Kernidee: Ich kann erklären, wie stark ein Bauteil den Strom hemmt, und mit dem ohmschen Gesetz Spannung, Stromstärke oder Widerstand berechnen.
- Bausteine: widerstand, widerstand-einflussgroessen, ohmsches-gesetz, ohmsches-gesetz-rechnen

#### schaltungen-berechnen · Schaltungen berechnen (9-10)
- Kernidee: Ich kann Stromstärken, Spannungen und den Gesamtwiderstand in Reihen- und Parallelschaltungen berechnen.
- Bausteine: reihenschaltung-groessen, parallelschaltung-groessen, gesamtwiderstand

### strom-im-haushalt · Strom im Haushalt – nützlich und gefährlich
- Explainer: strand physik/elektrizitaetslehre
- Leitidee: Ich weiß, was Strom in Geräten bewirkt, wie viel Energie ein Gerät braucht und was kostet, und wie ich mich und andere vor Strom schütze.
- Didaktik: Jedes Kapitel beginnt mit einem Gerät aus dem Haushalt (Föhn, Toaster, LED-Lampe, Wasserkocher, Steckdosenleiste). Das Kind liest Typenschilder, schaltet Geräte an einem virtuellen Sicherungskasten zu und sieht, wann die Sicherung auslöst. Sicherheitsregeln stehen als wiederkehrender Kasten am Ende jedes Kapitels.
- Abgrenzung: Drin sind die Wirkungen des Stroms (Wärme, Licht), seine Gefahren, die elektrische Leistung, die Energie und ihre Kosten und die Hausinstallation mit Sicherungen. Nicht drin ist, wie der Stromkreis funktioniert (stromkreise) und wie der Strom ins Haus kommt (elektromagnetismus). Die magnetische Wirkung steht in elektromagnetismus, weil sie dort an die Magnete anschließt.
- Davor: stromkreise; energie (Leistung)
- Danach: elektromagnetismus (Stromversorgung), energieversorgung
- Daneben: energie (Leistung und Wirkungsgrad allgemein)

#### strom-wirkt · Was Strom kann und wann er gefährlich ist (5-6)
- Kernidee: Ich kann erklären, dass Strom Wärme und Licht erzeugt, warum Strom aus der Steckdose gefährlich ist und wie ich mich schütze.
- Bausteine: waermewirkung-strom, lichtwirkung-strom, gefahren-des-stroms, sicher-mit-strom-umgehen
- Wiederholung: physik/einfacher-stromkreis

#### leistung-und-sicherung · Warum fliegt die Sicherung raus? (9-10)
- Kernidee: Ich kann die elektrische Leistung und Energie von Geräten berechnen, ihre Kosten angeben und erklären, wann eine Sicherung auslöst.
- Bausteine: elektrische-leistung, elektrische-energie, hausinstallation-sicherungen
- Wiederholung: physik/ohmsches-gesetz-rechnen, physik/leistung

### elektromagnetismus · Magnete, Motor und Generator
- Explainer: strand physik/elektrizitaetslehre
- Leitidee: Ich verstehe Magnete und ihr Feld, weiß, dass Strom ein Magnetfeld macht und ein bewegter Magnet Spannung erzeugt, und kann damit Motor, Generator, Transformator und das Stromnetz erklären.
- Didaktik: Das Feldlinienbild kommt in jedem Kapitel wieder: erst mit Eisenfeilspänen und Kompassnadeln, dann virtuell um einen Draht und eine Spule, zuletzt im Motor und im Generator. Das Kind bewegt in Simulationen Magnete und Spulen und sieht, wie sich Feld, Kraft und Spannung ändern. Die Kette der Versuche führt vom Kompass bis zum Kraftwerk.
- Abgrenzung: Drin sind Dauermagnete, Magnetfeld, Erdmagnetfeld, Elektromagnet, Spule, Motor, Induktion, Generator, Transformator und die Stromversorgung vom Kraftwerk zur Steckdose. Nicht drin sind die Stromkreise (stromkreise) und die Arten von Kraftwerken und ihre Bewertung (energieversorgung).
- Davor: stromkreise
- Danach: energieversorgung
- Daneben: strom-im-haushalt

#### magnete · Magnete und ihr Feld (5-6)
- Kernidee: Ich kann Magnete und ihr Feld beschreiben, mit dem Modell der Elementarmagnete erklären und einen Kompass erklären.
- Bausteine: permanentmagnete, elementarmagnete-modell, magnetfeld-feldlinien, erdmagnetfeld-kompass

#### strom-macht-magnete · Strom macht Magnete (9-10)
- Kernidee: Ich kann zeigen, dass ein Strom ein Magnetfeld erzeugt, das Feld einer Spule beschreiben und erklären, wie ein Elektromotor sich dreht.
- Bausteine: magnetwirkung-strom, magnetfeld-spule, elektromotor
- Wiederholung: physik/einfacher-stromkreis
- Begründung: magnetwirkung-strom ist 7-8, die Länder sind dreifach uneins (NW Jg 6, BY Jg 7, HE 9/10). Mit dem Oersted-Versuch beginnt hier die Kette Elektromagnet, Spule, Motor; allein hätte der Baustein in 7-8 kein Kapitel. Er könnte auch am Ende von „Magnete und ihr Feld“ stehen (so NW IF2); dann wäre der Abstand zur Spule aber groß.

#### induktion · Vom Dynamo zur Steckdose (9-10)
- Kernidee: Ich kann erklären, wie ein Generator Spannung erzeugt, wie ein Transformator sie ändert und warum der Strom mit Hochspannung zu uns kommt.
- Bausteine: elektromagnetische-induktion, generator, transformator, stromversorgung
- Wiederholung: physik/spannung, physik/elektrische-leistung

### energie · Energie geht nicht verloren
- Explainer: strand physik/energie
- Leitidee: Ich verstehe, dass Energie nicht verloren geht, sondern nur umgewandelt und übertragen wird, kann Energie berechnen und mit dem Wirkungsgrad sagen, wie viel davon nützt.
- Didaktik: Das Energieflussdiagramm kommt in jedem Kapitel wieder: Pfeile zeigen, wohin die Energie geht, die Breite zeigt, wie viel. Dazu kommen Energiesäulen (Balken für Lage-, Bewegungs- und thermische Energie), die sich in Simulationen von Pendel, Achterbahn und Wasserkocher live verändern. Die Summe der Säulen bleibt immer gleich.
- Abgrenzung: Drin sind Energieformen, Umwandlung, Übertragung, thermische Energie und Wärmetransport, Erhaltung, Berechnung von Lage- und Bewegungsenergie, Bilanz, Leistung, Entwertung und Wirkungsgrad. Nicht drin sind Energiequellen, Speicher, Kraftwerke und ihre Bewertung (energieversorgung, eigene Arbeitsweise: Bewerten) und die elektrische Leistung (strom-im-haushalt).
- Davor: bewegungen, kraefte (Geschwindigkeit und Gewichtskraft berechnen)
- Danach: energieversorgung, strom-im-haushalt
- Daneben: strahlung-und-klima (Wärmestrahlung)

#### energieformen-wandeln · Energie hat viele Formen (9-10)
- Kernidee: Ich kann Energieformen erkennen, Energie in Joule angeben und Umwandlungen mit einem Energieflussdiagramm zeigen.
- Bausteine: energieformen, energie-und-joule, lageenergie-bewegungsenergie, energieumwandlung

#### waerme · Wärme wandert (9-10)
- Kernidee: Ich kann thermische Energie und Temperatur unterscheiden und erklären, wie Energie durch Arbeit, Wärme, Strahlung oder Strom von einem Körper auf einen anderen kommt.
- Bausteine: thermische-energie, waermetransport, energieuebertragung
- Wiederholung: physik/temperatur, physik/waermestrahlung
- Begründung: thermische-energie ist 7-8 (die Länder sind dreifach uneins: NW Jg 6, HE s1, BY Jg 9); sie ist der einzige Baustein der Energie in 7-8 und hätte allein kein Kapitel. BY lehrt sie in Jg 9 mit dem Wärmetransport (Ph9 3). Versuche: Thermoskanne, Wärmeleitung in Metallstäben, Wärmebildkamera.

#### energieerhaltung · Die Achterbahn rechnet mit (9-10)
- Kernidee: Ich kann mit dem Energieerhaltungssatz Lage- und Bewegungsenergie berechnen und zum Beispiel ausrechnen, wie schnell eine Achterbahn unten ist.
- Bausteine: energieerhaltung, lageenergie-berechnen, bewegungsenergie-berechnen, energiebilanz
- Wiederholung: physik/gewichtskraft-berechnen, physik/geschwindigkeit-berechnen

#### wirkungsgrad · Wie viel Energie nützt? (9-10)
- Kernidee: Ich kann Leistung berechnen und mit dem Wirkungsgrad sagen, wie viel der eingesetzten Energie ein Gerät wirklich nutzt.
- Bausteine: leistung, leistung-berechnen, energieentwertung, wirkungsgrad

### energieversorgung · Energie für morgen
- Explainer: strand physik/energie
- Leitidee: Ich kann Energiequellen, Kraftwerke und Speicher vergleichen und begründen, wie eine nachhaltige Energieversorgung aussehen kann.
- Didaktik: Bewerten an einem durchgehenden Fall: Eine Stadt plant ihre Energieversorgung. Jedes Kraftwerk und jeder Speicher wird als Energieflussdiagramm gezeigt und in einer Tabelle zum Abwägen eingetragen (Kosten, CO₂, Verfügbarkeit, Fläche, Risiko). Am Ende stellt das Kind mit einem Regler-Modell einen eigenen Energiemix für Tag, Nacht, Sommer und Winter zusammen.
- Abgrenzung: Drin sind Energiequellen, Kraftwerksarten, Speicher und die nachhaltige Versorgung. Nicht drin sind die physikalischen Grundlagen der Energie (energie), der Generator und das Stromnetz (elektromagnetismus) und die Kernenergie (radioaktivitaet); sie kommen als Wiederholung oder als Verweis.
- Davor: energie, elektromagnetismus
- Daneben: radioaktivitaet (Kernkraftwerk, Endlager), strahlung-und-klima (Treibhauseffekt); Erdkunde und Politik-Wirtschaft (Energiewende)

#### kraftwerke · Woher kommt unsere Energie? (9-10)
- Kernidee: Ich kann erschöpfbare und erneuerbare Energiequellen unterscheiden und erklären, wie verschiedene Kraftwerke Energie umwandeln.
- Bausteine: energiequellen, kraftwerksarten
- Wiederholung: physik/energieformen, physik/energieumwandlung, physik/generator

#### energiewende · Speichern und planen (9-10)
- Kernidee: Ich kann erklären, warum wir Energie speichern müssen, und eine nachhaltige Energieversorgung begründet bewerten.
- Bausteine: energiespeicherung, nachhaltige-energieversorgung
- Wiederholung: physik/stromversorgung

### bewegungen · Messen und Bewegungen
- Explainer: strand physik/mechanik
- Leitidee: Ich kann Länge, Zeit und Masse messen, Bewegungen mit der Geschwindigkeit beschreiben und in Diagrammen darstellen.
- Didaktik: Selbst messen und darstellen. Jedes Kapitel beginnt mit einer Messung (Maßband, Stoppuhr, Waage, Smartphone-Video eines Spielzeugautos oder eines Sprints). Die Messwerte kommen in eine Tabelle und daraus in ein Diagramm; das Stroboskopbild (Bilder in gleichen Zeitabständen) zeigt jede Bewegung auf einen Blick.
- Abgrenzung: Drin sind Messen von Strecke, Zeit und Masse, Geschwindigkeit, Geschwindigkeitsänderung und Bewegungsdiagramme (Kinematik). Nicht drin sind Kräfte als Ursache von Bewegungsänderungen (kraefte), weil sie mit dem Kraftpfeil ein anderes Modell brauchen.
- Davor: Mathematik (Größen und Einheiten, Zuordnungen und Diagramme)
- Danach: kraefte, energie

#### messen · Wie lang, wie lange, wie schwer? (5-6)
- Kernidee: Ich kann Strecken, Zeiten und Massen messen und in passenden Einheiten angeben.
- Bausteine: strecke-und-zeit-messen, masse

#### geschwindigkeit · Wie schnell ist schnell? (7-8)
- Kernidee: Ich kann Geschwindigkeiten vergleichen und aus Strecke und Zeit berechnen.
- Bausteine: geschwindigkeit, geschwindigkeit-berechnen

#### bewegungsdiagramme · Bewegungen im Diagramm (9-10)
- Kernidee: Ich kann schneller und langsamer werdende Bewegungen beschreiben und Orts-Zeit- und Geschwindigkeit-Zeit-Diagramme lesen und zeichnen.
- Bausteine: geschwindigkeitsaenderung, bewegungsdiagramme

### kraefte · Kraft und Bewegung
- Explainer: strand physik/mechanik
- Leitidee: Ich verstehe, dass eine Kraft die Bewegung oder die Form eines Körpers ändert, und kann mit Kräftegleichgewicht, Reibung und Trägheit erklären, warum etwas schneller, langsamer oder gleich schnell wird.
- Didaktik: Der Kraftpfeil ist das wiederkehrende Bild: Das Kind zeichnet Kräfte als Pfeile, misst sie mit einem virtuellen Federkraftmesser und setzt sie zusammen. Eine Simulation (Eisfläche, Luftkissenbahn) lässt die Reibung ein- und ausschalten; so wird Galileis Gedankenexperiment zum Versuch.
- Abgrenzung: Drin sind Wirkungen und Darstellung von Kräften, Gewichtskraft, Kräfte zusammensetzen, Reibung, Trägheit und Wechselwirkung (die Newtonschen Grundsätze). Nicht drin ist das Beschreiben von Bewegungen ohne Kraft (bewegungen) und die Energie (energie).
- Davor: bewegungen
- Danach: energie (Lageenergie berechnen)

#### kraft-messen · Kraft und Gewicht (9-10)
- Kernidee: Ich kann Kräfte an ihren Wirkungen erkennen, als Pfeil zeichnen, mit dem Kraftmesser messen und die Gewichtskraft aus der Masse berechnen.
- Bausteine: kraft-wirkungen, kraft-darstellen, gewichtskraft, gewichtskraft-berechnen
- Wiederholung: physik/geschwindigkeitsaenderung, physik/masse

#### newton · Warum rollt der Ball nicht ewig? (9-10)
- Kernidee: Ich kann mit Kräftegleichgewicht, Reibung und Trägheit Bewegungen erklären und Kraft und Gegenkraft erkennen.
- Bausteine: kraefte-zusammensetzen, reibung, kraft-aendert-geschwindigkeit, traegheitsprinzip, wechselwirkungsprinzip

### licht · Licht, Spiegel und Linsen
- Explainer: strand physik/elektromagnetische-strahlung
- Leitidee: Ich verstehe, dass Licht sich geradlinig ausbreitet, und kann damit Sehen, Schatten, Mondphasen, Spiegel, Linsen, das Auge und Farben erklären.
- Didaktik: Durchgehend das Lichtstrahlmodell: Jedes Phänomen wird als Strahlengang gezeichnet. In einem virtuellen Lichtlabor stellt das Kind Lampe, Gegenstand, Spiegel, Linse oder Prisma auf und sieht, wie die Strahlen laufen; jeder Versuch mit Taschenlampe, Laser oder Lupe wird dort nachgebaut.
- Abgrenzung: Drin ist die Strahlenoptik von der Lichtausbreitung bis zu Linse, Auge und Farben, mit Sonne, Erde und Mond als großem Schattenversuch. Nicht drin sind Wellenlänge, Spektrum und unsichtbare Strahlung (strahlung-und-klima), weil sie das Wellenmodell brauchen; „Grenzen der Wahrnehmung“ steht hier nur als Ausblick auf das Licht, das wir nicht sehen.
- Danach: strahlung-und-klima
- Daneben: Biologie (Auge und Sehen), Erdkunde (Erde im Sonnensystem)

#### lichtausbreitung · Licht und Schatten (5-6)
- Kernidee: Ich kann erklären, wie sich Licht ausbreitet, wie wir Dinge sehen und wie Schatten entstehen.
- Bausteine: geradlinige-lichtausbreitung, lichtquellen-und-sehen, streuung, schatten

#### sonne-erde-mond · Sonne, Erde, Mond (7-8)
- Kernidee: Ich kann mit Licht und Schatten erklären, warum wir den Mond in Phasen sehen und wie Sonnen- und Mondfinsternis entstehen.
- Bausteine: mondphasen, finsternisse

#### spiegel-und-linsen · Spiegel, Linsen und das Auge (7-8)
- Kernidee: Ich kann zeichnen, wie Licht an Spiegeln reflektiert und an Linsen gebrochen wird, und erklären, wie das Auge ein Bild erzeugt und eine Brille hilft.
- Bausteine: reflexion, brechung, totalreflexion-lichtleiter, sammellinse-abbildung, auge-und-sehhilfen

#### farben · Farben und Licht, das wir nicht sehen (7-8)
- Kernidee: Ich kann erklären, wie Körper Licht aufnehmen, abgeben oder durchlassen, wie ein Prisma weißes Licht in Farben zerlegt und dass es Licht gibt, das wir nicht sehen.
- Bausteine: absorption-emission-transmission, farben-und-spektralzerlegung, wahrnehmungsgrenzen

### strahlung-und-klima · Unsichtbare Strahlung und Klima
- Explainer: strand physik/elektromagnetische-strahlung
- Leitidee: Ich kann Strahlung nach ihrer Wellenlänge ordnen, Nutzen und Risiken abwägen und erklären, wie Wärmestrahlung und Treibhauseffekt das Klima der Erde bestimmen.
- Didaktik: Das Spektrum ist eine wiederkehrende Leiste von den Radiowellen bis zur Röntgenstrahlung; jedes Kapitel setzt seine Strahlung darauf. Das Klima zeigt ein Bilanzbild der Erde mit Pfeilen für Sonnenstrahlung und Wärmestrahlung. In einer Simulation dreht das Kind am CO₂-Anteil und sieht, wie sich die Bilanz und die Temperatur ändern; dazu der Modellversuch Treibhaus.
- Abgrenzung: Drin sind Wellenlänge, Spektrum, Mobilfunk- und Röntgenstrahlung, Wärmestrahlung, Strahlungshaushalt, Treibhauseffekt und Kippelemente. Nicht drin ist die Strahlenoptik (licht) und die ionisierende Strahlung aus dem Kern (radioaktivitaet).
- Davor: licht; energie (Wärmetransport)
- Danach: radioaktivitaet (Gammastrahlung im Spektrum)
- Daneben: energieversorgung; Erdkunde und Biologie (Klimawandel)

#### spektrum · Das Spektrum der Strahlung (9-10)
- Kernidee: Ich kann Strahlung nach ihrer Wellenlänge ordnen und Nutzen und Risiken von Mobilfunk- und Röntgenstrahlung abwägen.
- Bausteine: wellenlaenge, elektromagnetisches-spektrum, mobilfunkstrahlung-roentgenstrahlung
- Wiederholung: physik/wahrnehmungsgrenzen

#### klima · Strahlung und Klima (9-10)
- Kernidee: Ich kann erklären, wie Sonnenstrahlung und Wärmestrahlung die Temperatur der Erde bestimmen, wie der Treibhauseffekt wirkt und was Kippelemente sind.
- Bausteine: waermestrahlung, strahlungshaushalt-erde, treibhauseffekt, kippelemente
- Wiederholung: physik/temperatur, physik/absorption-emission-transmission

### radioaktivitaet · Strahlung aus dem Atomkern
- Explainer: strand physik/ionisierende-strahlung
- Leitidee: Ich verstehe, woher radioaktive Strahlung kommt, wie man sie misst und sich schützt, wie Kerne zerfallen und warum Kernenergie und Endlager so schwierige Fragen sind.
- Didaktik: Ein virtuelles Strahlenlabor mit Zählrohr kommt in jedem Kapitel wieder: Das Kind misst die Zählrate, schiebt Papier, Aluminium oder Blei dazwischen, ändert den Abstand und beobachtet den Zerfall über die Zeit. Der Kern wird als Kugelmodell aus Protonen und Neutronen gezeigt. Den zufälligen Zerfall spielt das Würfelexperiment nach. Am Ende steht ein Bewertungsteil zu Kernenergie und Endlager.
- Abgrenzung: Drin sind Atomaufbau, Radioaktivität, Strahlungsarten, Zählrate, Abschirmung, Wirkung und Schutz, Medizin, Zerfall und Halbwertszeit, Kernspaltung, Kernfusion und Endlager. Nicht drin sind die elektrische Ladung (stromkreise) und das Spektrum (strahlung-und-klima); sie kommen als Wiederholung.
- Davor: stromkreise (Ladung), strahlung-und-klima (Spektrum), energie (Umwandlung)
- Daneben: energieversorgung (Kraftwerke); Chemie (Atombau); Biologie (Zelle und Erbgut)

#### atomkern · Was strahlt da? (9-10)
- Kernidee: Ich kann den Aufbau des Atoms beschreiben, erklären, woher radioaktive Strahlung kommt, Alpha-, Beta- und Gammastrahlung unterscheiden und sie mit dem Zählrohr nachweisen.
- Bausteine: atomaufbau, radioaktivitaet, strahlungsarten, aktivitaet-zaehlrate
- Wiederholung: physik/elektrische-ladung, physik/elektromagnetisches-spektrum

#### strahlenschutz · Schützen und heilen (9-10)
- Kernidee: Ich kann erklären, wie man sich vor Strahlung schützt, wie sie auf den Körper wirkt und wie die Medizin sie nutzt.
- Bausteine: absorption-ionisierender-strahlung, biologische-wirkung, medizinische-nutzung

#### zerfall · Zerfall und Halbwertszeit (9-10)
- Kernidee: Ich kann den Zerfall als Zufall beschreiben und mit der Halbwertszeit ausrechnen, wie viel nach einer Zeit noch übrig ist.
- Bausteine: spontanzerfall, halbwertszeit, halbwertszeit-rechnen

#### kernenergie · Kernenergie und Endlager (9-10)
- Kernidee: Ich kann Kernspaltung und Kernfusion erklären und begründen, warum radioaktiver Abfall so lange sicher lagern muss.
- Bausteine: kernspaltung, kernfusion, lagerung-radioaktiver-abfaelle
- Wiederholung: physik/energieumwandlung

## Ohne Explainer

- temperatur: „Temperatur messen“ (5-6) steht im Strang „Elektromagnetische Strahlung“, hat dort aber keinen Partner: Licht und Schatten brauchen sie nicht, die Wärmestrahlung ist erst 9-10. Ihre Partner in den Ländern sind das Messen (BY NT5 1.1, NW Jg 6: mit Länge, Zeit, Masse, im Explainer `bewegungen`) und die Wärmelehre (NW IF1, im Explainer `energie`); beide liegen in anderen Strängen. Ein Explainer aus einem Baustein lohnt nicht. Die Explainer `energie` und `strahlung-und-klima` wiederholen sie. Siehe Hinweise zur Karte.

## Hinweise zur Karte

- `temperatur` passt besser in den Strang „Mechanik“ (dann im Kapitel „Wie lang, wie lange, wie schwer?“ des
  Explainers `bewegungen`) oder „Energie“ (zu `thermische-energie`). Die KMK ordnet sie der Strahlung zu; für die
  Explainer ist das unpraktisch.
- `thermische-energie` ist der einzige Energie-Baustein in 7-8 (Länder dreifach uneins). Der Explainer `energie`
  lehrt sie in 9-10 mit dem Wärmetransport. Prüfen, ob 9-10 passt (BY Ph9 3).
- `waermetransport` setzt `waermestrahlung` voraus, nennt die Wärmestrahlung aber selbst als eine der drei Arten.
  Die beiden überschneiden sich; vielleicht genügt `thermische-energie` als Voraussetzung.
- `magnetwirkung-strom` (7-8) ist allein in seiner Zelle; der Explainer `elektromagnetismus` lehrt ihn in 9-10 vor der
  Spule. Prüfen, ob 9-10 (HE) oder 5-6 (NW) besser passt.
- `elektrische-ladung` (Elektrizitätslehre) → `atomaufbau` (Ionisierende Strahlung) → `elektrostatische-phaenomene`
  und `strom-als-ladungstransport` (wieder Elektrizitätslehre): Die Stränge greifen ineinander. Das Kapitel „Was
  fließt im Draht?“ wiederholt deshalb den Atomaufbau, der selbst auf der Ladung aufbaut. Ein eigener Baustein
  „einfaches Atommodell (Kern und Hülle)“ in der Elektrizitätslehre würde den Kreis auflösen.
- `elektrische-leistung` setzt `ohmsches-gesetz-rechnen` voraus. Für P = U · I genügen Spannung und Stromstärke; die
  Kante ist vielleicht zu streng.
- Die Mechanik hat in 5-6 und 7-8 nur je 2 Bausteine; die Kapitel von `bewegungen` sind deshalb klein.
