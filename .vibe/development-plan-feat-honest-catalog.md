# Development Plan: apps (feat/honest-catalog branch)

*Generated on 2026-11-02 by Vibe Feature MCP*
*Workflow: [epcc](https://codemcp.github.io/workflows/workflows/epcc)*

## Goal
Besucherinnen und Besuchern charmant und ehrlich erklären: Die Apps auf lernapps.net bauen Menschen, denen digitale Bildung wichtig ist. Es gibt kein Unternehmen und keine Redaktion, darum fehlen Inhalte. Wer nichts findet, kann mit KI und unseren Bauhilfen selbst eine App bauen, für eine Prüfung oder einen ganzen Lehrplan, auch ohne Technikwissen.
## Key Decisions
- Ablauf: epcc. Erste Phase liefert Mockups zur Abstimmung, noch kein Code.
- Die Erklärung steht dort, wo jemand nichts findet (leeres Suchergebnis), nicht als Banner auf jeder Seite und nicht im Abschnitt „Darfst du sie einsetzen?“ (x-app-in-minutes: Lehrkraft unter Zeitdruck).

## Notes
- Klassen-Auswahl zeigt nur Klassen mit Apps (`src/_data/catalog.js:77`): Lücken sind unsichtbar.
- `find.empty` verweist nur auf „App eintragen“, nicht auf „Bauen“.
- `find.build` nutzt Fachsprache („Tooling“) und verspricht „ganz einfach“.
- Keine Stelle sagt, wer hinter lernapps.net steht.
- Mockups: https://claude.ai/artifact/2HghwbCaHCy9A2EcBgvG49 (1 Klassen 1–13, 2 kein Treffer, 3 Kasten + „Wer dahintersteht“, 4 Bauen mit Suche im Auftrag, 5 Variante bauen = später)
- Offen: Stimmt „Wir verdienen nichts an dir“? Anzahl je Klasse in der Auswahl?
- Offen: Belegbare Zeitangabe fürs Bauen („an einem Abend“?) – beim Nutzer erfragen.

## Explore
### Phase Entrance Criteria
- Der Nutzer hat ein Ziel genannt; ein Feature-Branch existiert.
### Tasks
- [ ] Nutzer gibt Rückmeldung zu den Mockups (Ton, Umfang, offene Fragen)
- [x] Mockups: leeres Suchergebnis, Kasten „Nichts gefunden?“, „Wer dahintersteht“, Einleitung der Seite „Bauen“, Klassen-Auswahl 1–13
- [ ] Nutzer wählt aus, welche Vorschläge umgesetzt werden, und bestätigt die Texte

### Completed
- [x] Created development plan file

## Plan
### Phase Entrance Criteria
- Der Nutzer hat Mockups und Texte bestätigt und den Umfang gewählt.
### Tasks
- [ ] *To be added when this phase becomes active*

### Completed
*None yet*

## Code
### Phase Entrance Criteria
- Der Plan nennt Dateien, Texte (de/en) und Prüfungen (`npm run check`, Tests).
### Tasks
- [ ] *To be added when this phase becomes active*

### Completed
*None yet*

## Commit
### Phase Entrance Criteria
- Umsetzung fertig, `npm test` und `npm run check` grün.
### Tasks
- [ ] *To be added when this phase becomes active*

### Completed
*None yet*



---
*This plan is maintained by the LLM. Tool responses provide guidance on which section to focus on and what tasks to work on.*
