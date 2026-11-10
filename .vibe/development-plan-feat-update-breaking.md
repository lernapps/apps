# Development Plan: apps (feat/update-breaking branch)

*Workflow: minor (the workflows server was not reachable in this session; the plan file is the record)*

## Goal

Der Update-PR (upgrade.yml) zeigt zuerst, was die App nach dem Update selbst ändern muss: die Zeilen
`breaking: …` von `lernapps update` (lernapps/tooling, feat/update-notes).

## Key Decisions

- Owner: so einfach wie möglich. Die Zeilen kommen in einen Abschnitt „Breaking changes“ vor „Intent“; der Titel
  bekommt `!` (`chore(deps)!: …`). Sonst ändert sich nichts.

## Implement
- [x] upgrade-message.mjs: breaking(), title(), Abschnitt; Test in test/upgrade.test.mjs

## Finalize
- [ ] PR, mergen
