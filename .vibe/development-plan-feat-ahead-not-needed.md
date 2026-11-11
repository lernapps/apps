# Development Plan: apps (feat/ahead-not-needed branch)

*Generated on 2026-11-11 by Vibe Feature MCP*
*Workflow: [minor](https://codemcp.github.io/workflows/workflows/minor)*

## Goal
Der Katalog meldet `ahead`, das nicht nötig ist (Owner, 2026-11-11: „validieren, dass ahead nicht unnötig eingesetzt
wird“). Gegenstück in lernapps/tooling#282 (`prerequisites-in-order`).

## Key Decisions
- Nicht nötig: Keine Kompetenz der Seite setzt die Id direkt voraus, oder die App übt sie auf dieser oder einer
  früheren Seite bzw. wiederholt sie davor. Art `ahead-unneeded`.
- Im Eintrag immer eine Warnung, kein Fehler: Die Seite ist trotzdem in Ordnung, nur die Ausnahme ist überflüssig.
- Ob die Seite die Voraussetzung wirklich benutzt, sieht keine Prüfung; das bleibt beim Review.

## Implement
### Completed
- [x] checkPages: Art `ahead-unneeded`; listing.mjs: Warnung mit Fix
- [x] Vertrag Abschnitt 3; Tests (47 grün)

## Finalize
### Tasks
- [ ] PR; Merge durch den Owner
