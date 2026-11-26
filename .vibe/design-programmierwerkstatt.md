# Entwurf: Programmierwerkstatt (Blockly) mit Challenges von außen

Stand 2026-11-26. Entwurf für das Epic Informatik (lernapps/apps#509); entschieden ist nur, was unter
„Entscheidungen“ steht.

## 1. Ziel und Rahmen

Eine eigene App (Archetyp `interactive`), in der Lernende mit Blöcken programmieren. Andere Apps, vor allem die
Explainer, **schicken ihr Challenges**: ein Labyrinth, einen Spirographen, eine Reihe von Schließfächern. Die
Werkstatt führt das Programm aus, prüft es und schickt das Kind zurück.

Entscheidungen (Mensch, 2026-11-26):
- Blockly als Bibliothek (Apache 2.0, gepflegt). Blockly Games nur als Vorbild (Apache 2.0, ruht seit 2024).
- Kein robotkarol.dev (keine Schnittstelle, keine Blöcke, ruht seit 2022).

Rahmen der Plattform, der den Entwurf bestimmt:
- Statische Seiten, kein Server, kein Netz, kein `eval` (`con-frontend-only`, Lint-Regeln).
- Apps teilen zur Laufzeit keinen Code; jede speichert nur unter `lernapps:<id>:` (`dec-own-data-only`).
- Explainer-Komponenten höchstens 20 kB gzip: Blockly (etwa 100 kB) gehört deshalb in eine eigene App.
- Routen des Archetyps `interactive` sind heute feste ids aus `app.yaml` (`app/#<id>`); eine Challenge in der
  Adresse braucht eine Erweiterung der Runtime (siehe 6).

## 2. Die zwei Arten von Erweiterung

Die Architektur trennt, **was Code ist** und **was Daten sind**:

| | Welt (World) | Challenge |
|---|---|---|
| Was | eine Art von Aufgabe: Labyrinth, Turtle-Grafik (Spirograph), Feld | eine konkrete Aufgabe in einer Welt |
| Form | TypeScript-Modul im Repo der Werkstatt | JSON nach einem Schema |
| Wer liefert | ein PR an die Werkstatt, geprüft und getestet | jede App (Consumer), ohne PR |
| Wie oft | selten | oft |

Grund: Fremder Code darf zur Laufzeit nicht nachgeladen werden (kein Netz, kein `eval`, ein gemeinsamer Origin
für alle Apps). Daten dürfen kommen, wenn ein Schema sie prüft.

## 3. Bausteine der Werkstatt

```
Consumer (Explainer, andere App)
   │  Link mit Challenge (Daten)
   ▼
┌──────────────── Werkstatt ───────────────────────────────┐
│ Challenge laden + gegen Schema prüfen                     │
│ Editor (Blockly): Toolbox aus der Challenge               │
│ Ansichten: Blöcke │ Struktogramm │ Pseudocode │ Text      │
│        │ Blöcke → Programm (IR, JSON)                     │
│ Interpreter (schrittweise, Schrittlimit)                  │
│        │ Befehle / Sensorfragen                           │
│ Welt-Modul: Zustand, Befehle, Sensoren, Prüfungen, Bild   │
│ Prüfung: alle Testfälle der Challenge                     │
└──────────────────────────────────────────────────────────┘
   │  Zurück-Link mit Ergebnis
   ▼
Consumer
```

- **Programm-IR:** ein kleiner, für alle Welten gleicher Syntaxbaum (Folge, Wiederhole n, Solange, Wenn/Sonst,
  Befehl, Sensor, Variable, Unterprogramm mit Parametern, Feld). Blockly erzeugt ihn mit einem eigenen Generator.
  Aus dem IR entstehen auch Struktogramm, Pseudocode und Text (#495, 7-8 bis 9-10).
- **Interpreter:** führt das IR Schritt für Schritt aus, damit man die Figur sieht, Einzelschritt und Tempo
  möglich sind und eine Endlosschleife am Schrittlimit stoppt. Kein JavaScript aus Blöcken, kein `eval`.
- **Welt-Modul** (Schnittstelle, Skizze):

```ts
interface World<Config, State> {
  id: string;                        // "labyrinth", "turtle", "feld"
  version: number;                   // Challenges nennen die Version, die sie brauchen
  configSchema: JSONSchema;          // was eine Challenge über die Welt sagen darf
  blocks: BlockDef[];                // Befehle und Sensoren dieser Welt, mit deutschen Texten
  start(config: Config): State;      // reine Funktion, JSON-Zustand
  command(state: State, name: string, args: unknown[]): State;
  sense(state: State, name: string, args: unknown[]): boolean | number;
  checks: Record<string, Check<Config, State>>;  // z. B. "ziel-erreicht", "bild-gleich"
  View: Component;                   // Vue-Komponente, zeichnet den Zustand (SVG/Canvas)
  describe(state: State, lang): string;          // Text ohne Bild, für Barrierefreiheit
}
```

  Welten der ersten Stufe: **Labyrinth** (Roboter, Wand voraus?, #495) und **Turtle** (Stift, Winkel,
  Spirograph). Später **Feld** (Schließfächer mit Index, #496).

## 4. Format einer Challenge (`challenge.v1.schema.json`)

```json
{
  "format": 1,
  "id": "labyrinth-schleife-1",
  "title": { "de": "Durch den langen Gang" },
  "task":  { "de": "Bring den Roboter mit höchstens 4 Blöcken ans Ziel." },
  "world": { "type": "labyrinth", "version": 1,
             "config": { "map": ["#####", "#S..Z#", "#####"], "facing": "east" } },
  "toolbox": ["vorwaerts", "links", "rechts", "wiederhole"],
  "start": null,
  "limits": { "blocks": 4, "steps": 500 },
  "tests": [
    { "config": { "map": ["#######", "#S....Z#", "#######"] } }
  ],
  "checks": ["ziel-erreicht"],
  "hints": [{ "de": "Welcher Block wiederholt etwas?" }],
  "view": "bloecke",
  "back": { "url": "/informatik-algorithmen/schleifen/wiederholung/", "label": { "de": "Zurück zur Erklärung" } }
}
```

- **Mehrere Testfälle** gegen fest codierte Lösungen: Das Programm muss in jeder Variante der Welt bestehen.
- **Prüfungen** kommen aus der Welt (`ziel-erreicht`, `bild-gleich` mit Toleranz, `feld-gleich`) und aus der
  Werkstatt (`hoechstens-bloecke`, `benutzt-block`).
- **`back.url`** muss ein Pfad auf lernapps.net sein (kein offener Redirect).
- **`view`**: welche Ansicht die Stufe zeigt (`bloecke`, `bloecke+struktogramm`, `text-lesen`, `text`).

## 5. Wie Challenges in die Werkstatt kommen

| Weg | Adresse | Wann |
|---|---|---|
| A. In der Adresse | `lernapps.net/<werkstatt>/app/?c=<base64url(deflate(JSON))>` | Standard: die App des Consumers besitzt ihre Challenge, kein PR nötig |
| B. Eingebaute Sammlung | `lernapps.net/<werkstatt>/app/#<id>` | Challenges, die viele brauchen (Labyrinth-Reihe zum Üben); per PR an die Werkstatt |

Beide nutzen dasselbe Schema. Die Werkstatt prüft jede Challenge beim Öffnen und zeigt sonst einen verständlichen
Fehler. Eine Challenge mit unbekannter Welt oder zu hoher Version wird nicht ausgeführt.

Für Autoren:
- Das Schema wird veröffentlicht (`<werkstatt>/schemas/challenge.v1.schema.json`), wie das Schema der Einträge.
- Eine **Autorenseite** in der Werkstatt: Challenge einfügen oder bearbeiten, ausprobieren, Link kopieren.
- Ein **Prüfskript** zum Mitnehmen (`npx`/Paket nur zur Build-Zeit), damit eine App ihre Links in ihrem Build
  prüft: Schema, Welt-Version, ob die Musterlösung alle Tests besteht. Build-Zeit ist kein geteilter Code zur
  Laufzeit.

## 6. Zurück zum Consumer

- Der Button „Zurück“ öffnet `back.url` mit `#werkstatt=<id>:<status>` (`geloest`, `offen`).
- Ein Explainer wertet das heute nicht aus; das Kind kommt einfach zurück. Die Pflichtübung der Seite bleibt im
  Explainer (z. B. „Was macht dieses Programm?“ mit dem Programm als Bild oder Code).
- Für den KI-Tutor: Die Werkstatt kann wie der Explainer eine Ergebniszeile zum Kopieren geben
  („Challenge labyrinth-schleife-1: gelöst im 2. Versuch“).
- Ein echter Rückkanal (Explainer zeigt „gelöst“) wäre eine Plattformentscheidung und ist nicht Teil dieses
  Entwurfs.

## 7. Was die Plattform dafür braucht

| Änderung | Repo | Nötig für |
|---|---|---|
| Runtime `interactive`: Parameter der Adresse an `start` geben (heute nur feste Routen-ids) | lernapps/app-templates | Weg A |
| Optional: Block `werkstatt-link` im Explainer, der eine Challenge aus YAML prüft und den Link samt No-JS-Text schreibt | lernapps/app-templates | bequemes Einbinden; ohne ihn schreibt man den Link mit der Autorenseite |
| Optional: Rückkanal | lernapps/docs (Entscheidung) | Anzeige „gelöst“ im Explainer |

Zu prüfen: Wie passt Blockly (DOM, eigener Zustand) in das Muster `start/step` des Archetyps und in seine
Playthroughs? Vermutung: Der Kern hält Programm (IR) und Lauf als JSON-Zustand; Blockly ist nur die Eingabe, die
eine Aktion „Programm geändert“ an den Kern gibt. Das klärt ein Spike.

## 8. Risiken

- **360 px und Tastatur:** Blockly auf dem Handy ist eng; Tastatur-Navigation über das Blockly-Plugin. Muss im
  Spike geprüft werden.
- **Länge der Adresse:** Eine Challenge mit drei Testfällen ist etwa 1-2 kB gepackt; Grenze im Schema setzen.
- **Versionen:** Ändert sich eine Welt, dürfen alte Links nicht brechen; deshalb `world.version` und alte
  Versionen weiter ausführen.
- **Aufwand:** Die Werkstatt ist ein eigenes Repo mit eigener Session und muss vor #495 und #496 fertig sein.

## 9. Schnitt für das Epic

1. Spike (kurz): Blockly im Archetyp `interactive`, 360 px, Tastatur, Bundle-Größe, Adresse mit Parameter.
2. Runtime-Erweiterung in app-templates (Parameter der Adresse).
3. Werkstatt Stufe 1: IR, Interpreter, Welten Labyrinth und Turtle, Weg A und B, Autorenseite, Prüfskript.
4. Danach #495 (7-8) mit Challenges; #496 (Feld) braucht die Welt Feld.
5. Später: Ansichten Struktogramm, Pseudocode, Text (#495, 9-10).
