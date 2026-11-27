# Development Plan: apps (feat/direct-start-loslegen branch)

*Generated on 2026-11-27 by Vibe Feature MCP*
*Workflow: [epcc](https://codemcp.github.io/workflows/workflows/epcc)*

## Goal
Den Einstieg aus dem Katalog (`lernapps.net/apps/`) auf **1 Klick** bis zum eigentlichen Lernen verkürzen:
1. **Katalog-Karte (`src/_includes/components.njk`)**: Ein klarer primärer Knopf **„Loslegen →“** direkt auf der Karte plus ein sekundärer Link **„Details, Eignung & QR-Code“** zur Detailseite `/apps/<id>/`.
2. **Ziel von „Loslegen →“ (`src/_data/catalog.js`)**:
   - Bei Format-2-Explainern automatisch die **erste Nicht-Recap-Seite** aus `lernapps-pages.json` (`pages.find(p => p.recap === undefined)`).
   - Bei Apps mit optionalem `start`-Feld im Katalog-Entry (z. B. Interactive-Apps wie `typonaut.yaml`, `kniffel-trainer.yaml`, `geo-quizzer.yaml` mit `start: app/` bzw. `{ de: "app/", en: "en/app/" }`) der angegebene Einstiegspfad.
   - Sonst die reguläre `url` der App.
3. **App-Detailseite (`src/app.njk`)**: Primärer Knopf ebenfalls **„Loslegen →“** (gleiches Ziel, ohne redundanten „Inhaltsübersicht“-Link); Eignung, QR-Code, Kapitel-/Themen-Direktlinks und Danke-Bereich bleiben erhalten.

## Key Decisions
- **Ein einziger primärer CTA („Loslegen“)**: Kein konkurrierendes Paar aus „App starten“ und „Direkt zu Lektion 1“.
- **Format-2-Explainer ohne manuelle Pflege**: `catalog.js` liest bereits `lernapps-pages.json`, in dem `recap`-Seiten markiert sind. Das erste Nicht-Recap-Ziel wird automatisch ermittelt.
- **Optionales Schema-Feld `start`**: In `schemas/entry.js` (und regeneriertem `schemas/entry.v1.schema.json`) optionaler relativer Pfad als String oder `{ de, en }` – genutzt für Interactive-Apps (`/app/`, `/en/app/`) und ggf. Format-1-Apps.

## Notes
- Relevante Dateien: `schemas/entry.js`, `schemas/entry.v1.schema.json`, `src/_data/catalog.js`, `src/_data/de.js`, `src/_data/en.js`, `src/_includes/components.njk`, `src/app.njk`, `src/assets/finden.js`, `entries/*.yaml` (Interactive-Apps), `test/find.e2e.test.mjs`, `test/entry-point.e2e.test.mjs`.
- `node_modules` müssen ggf. noch installiert werden (`npm ci`), um Build und Tests auszuführen.

## Explore
### Entrance Criteria
- Feature-Branch `feat/direct-start-loslegen` angelegt.
- Gewünschtes Verhalten aus Mock-Up-Abstimmung mit Nutzer ist klar.

### Tasks
- [x] Katalog-Templates (`src/index.njk`, `src/app.njk`, `src/_includes/components.njk`) und Texte (`src/_data/de.js`) analysieren
- [x] Daten-Pipeline (`src/_data/catalog.js`) und `lernapps-pages.json`-Kontrakt prüfen
- [x] Schema (`schemas/entry.js`) und bestehende Interactive-Entries (`typonaut.yaml`, `kniffel-trainer.yaml`, `geo-quizzer.yaml`) identifizieren

### Completed
- [x] Created development plan file
- [x] `catalog.js` und `lernapps-pages.json` geprüft: erste Nicht-Recap-Seite ist direkt ermittelbar
- [x] `schemas/entry.js` und `components.njk` / `app.njk` geprüft
- [x] Bestehende Interactive-Apps in `entries/` gefunden (`typonaut`, `kniffel-trainer`, `geo-quizzer`)

## Plan
### Entrance Criteria
- Explore-Erkenntnisse und Schema-/Template-Entwurf sind dokumentiert und vom Nutzer bestätigt.

### Tasks
- [x] Schema-Erweiterung (`start` optional in `schemas/entry.js` + `schemas/entry.v1.schema.json`) festlegen
- [x] Automatische `startUrl`-Ermittlung in `src/_data/catalog.js` planen (Format-2-Explainer: erste Nicht-Recap-Seite; sonst `entry.start`; Fallback `url`)
- [x] Katalogkarte (`components.njk`), Detailseite (`app.njk`) und Texte (`de.js`/`en.js`) mit einem primären Knopf „Loslegen →“ entwerfen
- [x] Interactive-Entries (`typonaut.yaml`, `kniffel-trainer.yaml`, `geo-quizzer.yaml`) für `start: app/` identifizieren
- [x] Teststrategie (Unit/E2E + `npm run check`) festlegen

### Completed
- [x] Umsetzungsplan vollständig erstellt

## Code
### Entrance Criteria
- Konkreter Umsetzungsplan für Schema, `catalog.js`, Templates (`de`/`en`), Interactive-Entries und Tests steht fest.

### Tasks
- [x] Optionales `start`-Feld in `schemas/entry.js` ergänzen und `schemas/entry.v1.schema.json` via `npm run schema` aktualisieren
- [x] `src/_data/catalog.js` erweitern: `startUrl` (automatisch erste Nicht-Recap-Seite bei Format-2-Explainern, sonst `entry.start` relativ zu `base`, sonst `url`)
- [x] `entries/typonaut.yaml`, `entries/kniffel-trainer.yaml`, `entries/geo-quizzer.yaml` um `start: app/` bzw. `{ de: app/, en: en/app/ }` ergänzen
- [x] Texte in `src/_data/de.js` und `src/_data/en.js` ergänzen/anpassen („Loslegen“, „Details, Eignung & QR-Code“)
- [x] `src/_includes/components.njk` (`appCard`) und `src/app.njk` auf primären Knopf „Loslegen →“ umstellen
- [x] Bestehende Tests geprüft und neue Tests (`test/start-url.test.mjs`) ergänzt
- [x] `node scripts/schema.mjs --check`, `npm run build`, Unit-Tests (42/42) und `test/find.e2e.test.mjs` (10/10) grün

### Completed
- [x] Schema, Daten-Pipeline, Templates, Interactive-Entries und Tests umgesetzt und verifiziert

## Commit
### Entrance Criteria
- `npm run schema -- --check`, `npm run build` und Tests laufen grün.

### Tasks
- [x] Änderungen inkl. `.vibe/` mit Conventional Commit (Skill `commit`) committen
- [x] Branch `feat/direct-start-loslegen` pushen und Pull Request eröffnen

### Completed
- [x] Commit und Pull Request für `lernapps/apps` vorbereitet

---
*This plan is maintained by the LLM. Tool responses provide guidance on which section to focus on and what tasks to work on.*
