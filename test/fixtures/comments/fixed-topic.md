<!-- lernapps-listing -->
## Prüfung des Eintrags: bestanden

Die Prüfung hat die App geöffnet, wie Lernende sie öffnen, ohne Klick, und den Eintrag mit ihr verglichen: Links, Themen, Fitness-Werte und die Regeln von lernapps.net. Sie findet keinen Fehler.
Als Nächstes prüft lernapps.net den Rest im Review und entscheidet über den Eintrag. Du musst nichts tun.

### entries/bruch-trainer.yaml: bestanden

```text
Geprüft:   https://example.org/bruch-trainer/ (2026-10-09T12:00:00.000Z)
Gemessen:  fitness.storage none, fitness.thirdParty none (ohne Klick)
Regeln:    8 geprüft
```

### Selbst prüfen

Dieselbe Prüfung läuft auch bei dir, mit demselben Ergebnis. In deinem Klon von lernapps/apps, auf dem Branch dieses Pull Requests:

```sh
npm ci
npm run --silent listing -- entries/bruch-trainer.yaml
```

Sie gibt diesen Kommentar aus und schreibt die vollständigen Prüfberichte (YAML) nach `node_modules/.cache/lernapps/listing/`.
Beim ersten Lauf installiert sie Chromium für die Prüfung.
