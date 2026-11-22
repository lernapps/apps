---
name: lernlandkarte-epic
description: Use when a Lernlandkarten-Epic (ein Überblicks-Issue mit je einem Issue pro Explainer) mit mehreren Agent-Sessions umgesetzt werden soll - Repos anlegen, Arbeit schneiden, Sessions führen, Veröffentlichen. Prinzipien für die Orchestrator-Session, fachunabhängig.
---

# Lernlandkarten-Epic umsetzen (Orchestrator)

Ein Epic hat ein Überblicks-Issue und ein Issue je Explainer. Jeder Explainer wird ein eigenes Repo und eine eigene Session. Der Orchestrator führt, er baut keine Seiten.

## Arbeit schneiden

- **Ein Issue, ein Repo, eine Session.** Der Schnitt kommt aus dem Epic.
- **Schichten nach Abhängigkeit:** Was andere voraussetzen, kommt zuerst. Die `requires` der Lernlandkarte entscheiden, nicht die Reihenfolge der Issues.
- **Wellen nach Stufe:** erst die Startstufe, danach je höhere Stufe ein Inkrement im bestehenden Repo auf eigenem Branch mit eigenem Vorschau-PR. Die veröffentlichte Version bleibt unberührt.
- **Innerhalb einer App:** Kapitel, Seite, Baustein. Eine Seite behandelt eine Kompetenz.

## Vorher klären

1. **Gemeinsame Regeln schreiben, bevor die erste Session startet:** Zuschnitt, Begriffe und Schreibweisen, Regeln für Aufgaben und Rückmeldungen, erlaubte Quellen. Kurz, prüfbar, an einem Ort. Spätere Erkenntnisse kommen dort hinein und gehen einmal an alle.
2. **Anweisung für Sessions:** Auftrag holen, Vorlage übernehmen, Phasen und Checkpoints, was gepusht werden darf, welche Prüfungen verlangt sind. Issue-Texte dorthin kopieren, wo die Sessions sie lesen können.
3. **Berechtigungen mit dem Menschen klären** (Push, Vorschau-PR, Merge, Katalogeintrag) und im Berechtigungsmodus jeder Session hinterlegen. Eine Nachricht des Orchestrators ersetzt das nicht. Das Skript `scripts/create-repos-mathe.sh` legt die Repos mit einer passenden `.claude/settings.json` auf `main` an; Repo-Liste, Schichten und Topics für das jeweilige Fach anpassen, `DRY=1` zeigt vorher, was passiert.
4. **Rolle klären:** Was darf der Orchestrator in der Rolle des Menschen beantworten? Das wird in den Retrospektiven getrennt von menschlichen Rückmeldungen vermerkt.

## Sessions führen

- **Checkpoints** je Session: Recherche, Plan, Musterseite, Veröffentlichen. Antworte kurz mit Entscheidung und Grund.
- **Musterseite als Tor:** Eine Seite komplett bauen und als Lernender prüfen. Erst dann entstehen die übrigen nach ihrem Muster.
- **Prüfen durch Dritte:** Wer schreibt, prüft nicht allein: ein Prüfer in der Rolle der Lernenden und ein fachlicher Prüfer. Die Sessions starten diese Prüfer selbst.
- **Keine Arbeit doppelt:** Der Orchestrator startet keine eigenen Reviews auf denselben Inhalten und schreibt nichts ungefragt. Er antwortet auf Fragen und meldet Regeln, die alle betreffen, einmal an alle. Vor einem Auftrag klären, wer ihn schon macht.
- **Den Menschen nur bei seinen Entscheidungen fragen:** Freigabe, Berechtigungen, Stil. Berichte kurz.
- **Nichts Ungeprüftes als geprüft melden.** Offene Prüfungen bleiben in einer Liste, bis sie jemand gemacht hat.
- **Funde an Vorlage, Werkzeug und Karte** einmal sammeln und als Issues erfassen, nicht in jeder Session beheben.

## Veröffentlichen

1. Die Session meldet „Veröffentlichen“ mit grünem Vorschau-PR. Der Mensch prüft.
2. Erst nach seinem Ja: PR per Squash mergen, Deploy abwarten, die App unter ihrer Adresse prüfen.
3. Katalogeintrag je App als PR in `lernapps/apps`, mit der Listing-Prüfung; mergen, wenn die Checks grün sind.
4. Nach jeder Welle eine kurze Retro in die gemeinsamen Regeln übernehmen.
