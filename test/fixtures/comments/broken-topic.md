<!-- lernapps-listing -->
## Prüfung des Eintrags: nicht bestanden

Die Prüfung hat die App geöffnet, wie Lernende sie öffnen, ohne Klick, und den Eintrag mit ihr verglichen: Links, Themen, Fitness-Werte und die Regeln von lernapps.net.
Behebe jeden Fehler unten, in der App oder im Eintrag. Jeder Befund nennt die Regel, wo er ist, was gefunden wurde, die Behebung und den Link zur Regel.
Dann pushe auf den Branch dieses Pull Requests: Die Prüfung läuft neu und ändert diesen Kommentar.
Eine Änderung an der App wirkt erst, wenn sie veröffentlicht ist: Die Prüfung öffnet die App unter ihrer `url`.

### entries/bruch-trainer.yaml: nicht bestanden, 1 Fehler

```text
Geprüft:   https://example.org/bruch-trainer/ (2026-10-09T12:00:00.000Z)
Gemessen:  fitness.storage none, fitness.thirdParty none (ohne Klick)
Regeln:    8 geprüft
```

1. Regel `entry-links-resolve` (error): https://lernapps.net/tooling/rules/#entry-links-resolve
   ```text
   Wo:        entries/bruch-trainer.yaml: topics[1].path erweitern/
   Gefunden:  https://example.org/bruch-trainer/erweitern/ answers 404
   Behebung:  Point the topic's path (relative to url) to a page of the app, or correct the app's url
   ```

### Selbst prüfen

Dieselbe Prüfung läuft auch bei dir, mit demselben Ergebnis. In deinem Klon von lernapps/apps, auf dem Branch dieses Pull Requests:

```sh
npm ci
npm run --silent listing -- entries/bruch-trainer.yaml
```

Sie gibt diesen Kommentar aus und schreibt die vollständigen Prüfberichte (YAML) nach `node_modules/.cache/lernapps/listing/`.
Beim ersten Lauf installiert sie Chromium für die Prüfung.
