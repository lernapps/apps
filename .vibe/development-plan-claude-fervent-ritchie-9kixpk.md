# Development Plan: apps (claude/fervent-ritchie-9kixpk branch)

*Generated on 2026-11-13 by Vibe Feature MCP*
*Workflow: [bugfix](https://codemcp.github.io/workflows/workflows/bugfix)*

## Goal
Update-Pull-Requests der Apps bekommen zu Unrecht das Label `review`. `scripts/update-kind.mjs` meldet eine Workflow-Datei
als geändert, wenn sich nur der Zeilenkommentar hinter einem Tooling-Pin unterscheidet (Renovate schreibt `# v0.12.1`,
`lernapps update` nicht). Ziel: Ein Unterschied nur in diesem Kommentar zählt nicht als Änderung; der Pin-Wert selbst
wird weiter exakt verglichen (GitHub liefert Commits von Forks unter dem Namen des Eltern-Repos aus).

## Key Decisions
- Nur der Kommentar am Zeilenende wird ignoriert, nie der Pin-Wert (`@<ref>`, `tooling-ref:`).
- Gilt für `.github/workflows/*.yml`, Status `M`; neue oder gelöschte Dateien bleiben Review.
- Arbeit auf dem vorgegebenen Branch `claude/fervent-ritchie-9kixpk`.

## Notes
- Belege: lernapps/musik `8ac0c7b..19efca8`: `@v0.12.1 # v0.12.1 # main` (neu) gegen `@v0.12.1 # main` (Replay);
  preview-cleanup.yml `…@v0.12.1 # v0.12.1` gegen `…@v0.12.1`.
- Betroffene PRs: #259, #249, #248, #181, #180, #179, #153 (textcheck bleibt Review wegen drei Testdateien).
- Ursache bestätigt am Quelltext von lernapps/tooling v0.12.1 (`generator/update.ts`, `moveActions`, `addPreviewCleanup`).

## Reproduce
### Tasks

### Completed
- [x] Test geschrieben, der den Fehler zeigt: `test/publish.test.mjs`, "a comment behind a pin of lernapps/tooling…"; er schlägt fehl (reproduziert)
- [x] Zwei weitere Tests in `publish.test.mjs` schlagen schon vorher fehl: `js-yaml` ist in dieser Session nicht installiert (nicht Teil des Fehlers)
- [x] Created development plan file
- [x] Ursache am Replay-Log und an lernapps/musik belegt

## Analyze
### Tasks

### Completed
- [x] Ursache: `updateKind` (`scripts/update-kind.mjs`, Zeile 82 ff.) meldet jede geänderte Datei außer package.json, package-lock.json und Markdown; für Workflows gibt es keinen Inhaltsvergleich
- [x] Replay (`update-replay.mjs`) arbeitet richtig: `lernapps update` 0.12.1 schreibt Pins ohne Versionskommentar; Renovate ergänzt `# v0.12.1`, der Updater-Bot setzt SHA zurück auf Tag, der Kommentar bleibt
- [x] Entwurf: nur Zeilen mit `lernapps/tooling/...@<ref>` oder `tooling-ref:` verlieren ihren Kommentar am Zeilenende (`\s+#.*$`); der Pin selbst wird exakt verglichen; nur Status `M`, nur `.github/workflows/*.yml` (Dateien aus Tree-Ids lesen wie `json()` es tut)
- [x] Kein Eingriff in `update-replay.mjs` nötig

## Fix
### Tasks

### Completed
- [x] `scripts/update-kind.mjs`: `withoutPinComments()` und der Vergleich bei Status `M` einer Datei `.github/workflows/*.yml`
- [x] Kopfkommentar von `update-kind.mjs` um die Regel ergänzt
- [x] Neuer Test grün; `publish.test.mjs`: 8 bestanden, 2 schlagen wie vorher durch fehlendes `js-yaml` fehl
- [x] Gegenprobe mit echten Dateien aus lernapps/musik (`8ac0c7b` mit Replay-Pin gegen `19efca8`): pages.yml und preview-cleanup.yml gleich

## Verify
### Tasks

### Completed
- [x] `npm ci --ignore-scripts`; `node --test test/publish.test.mjs test/tooling-pin.test.mjs test/upgrade.test.mjs`: 18 bestanden, 0 fehlgeschlagen (auch die zwei, die ohne `js-yaml` scheiterten)
- [x] Nicht ausgeführt: die e2e-Tests (Browser, nicht betroffen) und ein echter Lauf von `update.yml` (nur nach dem Merge möglich)
- [x] Erwartung nach dem Merge: #259, #249, #248, #181, #180, #179 werden beim nächsten Lauf `auto`; #153 (textcheck) bleibt `review` wegen dreier Testdateien

## Finalize
### Tasks
- [ ] Commit auf `claude/fervent-ritchie-9kixpk` (mit `.vibe`), push; kein PR ohne Auftrag

### Completed
- [x] Aufräumen: keine Debug-Ausgaben, keine TODOs
- [x] README.md (Abschnitt `update.yml`) nennt die Kommentar-Regel



---
*This plan is maintained by the LLM. Tool responses provide guidance on which section to focus on and what tasks to work on.*
