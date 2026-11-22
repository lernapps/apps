---
name: lernlandkarte-epic
description: Use when a Lernlandkarten-Epic (ein Überblicks-Issue mit je einem Issue pro Explainer, z. B. Englisch #489, Mathematik #402) mit mehreren Agent-Sessions umgesetzt werden soll - Repos anlegen, Aufträge schneiden, Sessions führen, Prüfungen und Veröffentlichung. Kurze Anweisung für die Orchestrator-Session.
---

# Lernlandkarten-Epic umsetzen (Orchestrator)

Ein Epic besteht aus einem Überblicks-Issue und einem Issue je Explainer. Jeder Explainer wird ein eigenes Repo `lernapps/<fach>-<thema>` und eine eigene Session. Du führst als Orchestrator die Sessions, du baust keine Seiten.

## 1. Vorbereiten (vor der ersten Session)

1. **Epic lesen** und die Explainer in **Schichten** ordnen: was andere voraussetzen, zuerst. Mit den `requires` der Lernlandkarte abgleichen (`https://lernapps.net/apps/map/<fach>/`).
2. **Konventionen schreiben** (`references/konventionen.md` als Muster (Englisch)): Zuschnitt, Figuren falls nötig, Begriffe und Schreibweisen, Regeln für Aufgaben und Rückmeldungen, was fremde Quellen dürfen. Kurz und prüfbar. Issue-Texte in eine Ablage kopieren, die die Sessions lesen (Englisch: `issues/<nr>.md` im Start-Repo), weil Sessions das Apps-Repo nicht lesen.
3. **Anweisung für Sessions** schreiben (`references/anweisung.md` als Muster (Englisch)): Auftrag holen, Vorlage kopieren, `lernapps init`, Phasen, Checkpoints, was gepusht werden darf, Prüfungen. Fachspezifisches ändern (Englisch: Sprachprüfung und Audio; Mathe: Rechnung nachrechnen, kein Audio).
4. **Repos anlegen** mit `scripts/create-repos-mathe.sh` (Repo-Liste und Topics für ein anderes Fach anpassen). `DRY=1` zeigt vorher, was passiert. Das Skript legt `main` nur mit `.claude/settings.json` an; die Regeln erlauben Push von `work` und `increment/*`, nie von `main`. **Berechtigungen vorher mit dem Menschen klären** (Push, Vorschau-PR, Merge, Katalogeintrag); eine Nachricht des Orchestrators ersetzt sie im Berechtigungsmodus einer Session nicht.
5. **Rolle klären:** Was darf der Orchestrator in der Rolle der Ersteller:in beantworten (Checkpoints, später Hörurteile oder Ähnliches)? Das vermerken die Sessions in ihrer Retrospektive getrennt von menschlichen Rückmeldungen.

## 2. Sessions führen

- **Eine Session je Repo.** Startnachricht: Issue-Nummer, Umfang, Pfad zur Anweisung, Id des Orchestrators.
- **Checkpoints** je Session: Recherche, Plan und Inhaltsmethode, Musterseite, Veröffentlichen. Antworte kurz mit Entscheidung und Grund.
- **Musterseite als Tor:** Erst nach Lerner-Check der ersten Seite und deiner Zustimmung bauen die Sub-Agenten die übrigen Seiten nach ihr (je Kapitel ein Worktree).
- **Keine Arbeit doppelt:** Die Sessions prüfen selbst mit eigenen Sub-Agenten (Lerner-Check als Kind der Stufe, fachliche Prüfung, Gesamtcheck je Kapitel). Du startest keine Review-Agenten auf denselben Inhalten und schreibst nichts ungefragt. Du antwortest nur auf Fragen und meldest Regeln, die alle betreffen, einmal in die Konventionen und einmal an alle.
- **Mensch nur bei seinen Entscheidungen** fragen: Freigabe zum Veröffentlichen, Push- und Merge-Erlaubnis, Stil.
- **Funde an Vorlage, Werkzeug und Karte** nicht in jeder Session beheben, sondern einmal sammeln und als Issues erfassen.

## 3. Veröffentlichen

1. Session meldet „Veröffentlichen“ mit Vorschau-PR (Checks grün). Der Mensch prüft die Vorschau.
2. Erst nach dem Ja des Menschen: PR per Squash mergen (lineare Historie), Pages-Lauf abwarten, `https://lernapps.net/<repo>/` prüfen.
3. **Katalogeintrag** je App als PR in `lernapps/apps` (`entries/<repo>.yaml`, Prüfung `npm run listing -- entries/<repo>.yaml`, danach mergen, wenn die Checks grün sind). `fitness.storage: device`, wenn die App im Browser speichert.

## 4. Wellen

Erst die Startstufe, danach je höhere Stufe ein **Inkrement** im bestehenden Repo auf `increment/<NN>-<name>` mit eigenem Vorschau-PR. Nach jeder Welle eine kurze Retro in die Konventionen übernehmen (`references/retro-englisch.md` als Muster).
