# Kurztest-Komponente (Selbsttest in der Recap-Seite)

Herkunft: Repo `lernapps/mathe-saetze-entdecken` (#430), Branch `work`. Der Orchestrator hat die drei Dateien hierher
gestellt, weil die Sessions nur ihr eigenes Repo lesen können.

Kopiere `Kurztest.ts`, `Kurztest.vue` und `Kurztest.test.ts` nach `src/components/` deines Repos. Die Komponenten dort
werden über den Dateinamen gefunden, es gibt keine Registrierung. Passe Farben nur über die Variablen der Laufzeit an
(`--page-border`, `--page-right`, `--page-wrong`, …), nicht mit festen Werten.

Einbindung in eine Seite mit `recap:` (die Seite bleibt beschreibend; ein Kurztest ist keine Aufgabe, nichts wird
gezählt oder gespeichert):

```yaml
- type: vue-component
  id: test-beispiel
  component: Kurztest
  props:
    question: Welches Viereck hat vier gleich lange Seiten, aber keine rechten Winkel?
    options:
      - { text: "Quadrat", correct: false, info: "Ein Quadrat hat vier rechte Winkel." }
      - { text: "Raute", correct: true, info: "Alle Seiten gleich lang, die Winkel sind schief." }
    right: Richtig.
    wrong: Nicht richtig.
  nojs: |
    Kurztest: Welches Viereck hat vier gleich lange Seiten, aber keine rechten Winkel? Quadrat oder Raute. Antwort: die
    Raute. Ein Quadrat hat vier rechte Winkel.
```

Genau eine Option ist richtig, jede hat in `info` den Grund. Der Text `nojs` nennt Frage, Optionen und Antwort mit Grund,
damit die Seite auch ohne JavaScript und mit Bildschirmleser funktioniert. Unter jedem Kurztest steht der Satz, was zu
tun ist, wenn die Antwort falsch war (Name des Bausteins und seine Kartenseite).
