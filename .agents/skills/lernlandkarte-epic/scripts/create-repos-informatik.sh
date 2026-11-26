#!/usr/bin/env bash
# Legt die Repositories der Informatik-Explainer (Epic lernapps/apps#509) in der Organisation lernapps an (leer, öffentlich),
# dazu main, Regel-Datei und Pages für die Programmierwerkstatt lernapps/coding (vom Menschen angelegt).
# Aufruf: ./create-repos-informatik.sh       alle 13 (12 Explainer und coding)
#         ./create-repos-informatik.sh 1     nur Welle 1 (ebenso 0 = coding, 2 und 3)
#         ./create-repos-informatik.sh 2 3   Welle 2 und 3 in einem Lauf (beliebig viele Wellen)
#         DRY=1 ./create-repos-informatik.sh     zeigt nur, was angelegt würde
# Voraussetzung: gh angemeldet mit dem Recht, in lernapps Repositories anzulegen.
# main entsteht mit der Regel-Datei .claude/settings.json; gh-pages (zeigt zuerst auf main) und Pages werden hier
# eingeschaltet, die Sessions legen sie nicht selbst an.
# Läuft auch für schon vorhandene Repositories (legt dort main mit der Regel-Datei an, falls main fehlt;
# ein vorhandenes main wird nie verändert).
# Abgeleitet von create-repos-mathe.sh; Unterschiede: Fach, Repo-Liste, Wellen nach Stufe statt Schichten.
set -euo pipefail
ORG=lernapps
TOPICS=(lernapps informatik)
DRY="${DRY:-}"

# Erster Commit auf main: .claude/settings.json mit den Befehlen, die die lernapps-Skills brauchen.
# Sessions mit nur einem Repository lesen die Datei beim Start (Cloud-Sessions fragen sonst bei jedem npx und git push).
# Nie auf main pushen: Die Regeln nennen nur work und increment/*.
SETTINGS='{
  "permissions": {
    "allow": [
      "Bash(npx --yes @lernapps/tooling *)",
      "Bash(npx --no -- lernapps *)",
      "Bash(npx vp *)",
      "Bash(npm install*)",
      "Bash(npm ci*)",
      "Bash(npm run *)",
      "Bash(git push -u origin work)",
      "Bash(git push -q -u origin work)",
      "Bash(git push origin work)",
      "Bash(git -c push.negotiate=true push -u origin work)",
      "Bash(git -c push.negotiate=true push origin work)",
      "Bash(git push -u origin increment/*)",
      "Bash(git push -q -u origin increment/*)",
      "Bash(git push origin increment/*)",
      "Bash(git -c push.negotiate=true push -u origin increment/*)",
      "Bash(git -c push.negotiate=true push -q -u origin increment/*)",
      "Bash(git -c push.negotiate=true push origin increment/*)",
      "Bash(gh api *)",
      "Bash(gh run *)"
    ]
  }
}
'

run() { if [[ -n "$DRY" ]]; then echo "  [DRY] $*"; else "$@"; fi; }

ensure_settings() {  # $1 = Repository
  if [[ -z "$DRY" ]] && gh api "repos/$ORG/$1/branches/main" --silent 2>/dev/null; then
    echo "  main vorhanden: $1 (Regel-Datei nicht angelegt)"
  else
    run gh api -X PUT "repos/$ORG/$1/contents/.claude/settings.json" -f message="chore: Berechtigungen für die Skills der Sessions" \
      -f content="$(printf '%s' "$SETTINGS" | base64 -w0)" --silent
    echo "  main angelegt mit .claude/settings.json: $1"
  fi
}

ensure_pages() {  # $1 = Repository: Branch gh-pages (zeigt zuerst auf main) und Pages aus gh-pages, Wurzelordner
  if [[ -n "$DRY" ]]; then echo "  [DRY] gh-pages und Pages: $1"; return; fi
  if ! gh api "repos/$ORG/$1/branches/gh-pages" --silent 2>/dev/null; then
    sha="$(gh api "repos/$ORG/$1/git/ref/heads/main" --jq .object.sha)"
    gh api -X POST "repos/$ORG/$1/git/refs" -f ref="refs/heads/gh-pages" -f sha="$sha" --silent
    echo "  gh-pages angelegt: $1"
  fi
  gh api -X POST "repos/$ORG/$1/pages" -f build_type=legacy -f "source[branch]=gh-pages" -f "source[path]=/" --silent 2>/dev/null \
    && echo "  Pages eingeschaltet: $1" || echo "  Pages schon an oder nicht änderbar: $1 (prüfen: Settings, Pages)"
}

# Welle|Issue|Repository|Beschreibung
# Welle = die Stufe, in der das Repo zuerst gebraucht wird (0 = vorab). Reihenfolge innerhalb der Welle nach den
# `requires` der Lernlandkarte Informatik (lernapps/apps#509, Kommentar „Plan des Epics“).
REPOS=(
  "0||coding|Programmierwerkstatt mit Blöcken (Blockly), Challenges von anderen Apps"
  "1|490|informatik-computer|Wie ein Computer arbeitet (Explainer Informatik)"
  "1|491|informatik-daten-codieren|Daten darstellen und codieren (Explainer Informatik)"
  "1|492|informatik-dateien|Meine Dateien: ordnen, speichern, schützen (Explainer Informatik)"
  "1|493|informatik-ki|Wie Maschinen aus Daten lernen (Explainer Informatik)"
  "1|500|informatik-automaten|Automaten und Zustände (Explainer Informatik)"
  "1|505|informatik-digitale-welt|Leben in der digitalen Welt: Fälle und Urteile (Explainer Informatik)"
  "2|495|informatik-algorithmen|Algorithmen und Programme (Explainer Informatik)"
  "2|496|informatik-datenstrukturen|Netze und Reihen von Daten (Explainer Informatik)"
  "2|502|informatik-internet|Wie das Internet funktioniert (Explainer Informatik)"
  "3|494|informatik-tabellen|Rechnen mit Tabellen (Explainer Informatik)"
  "3|498|informatik-datenbanken|Daten speichern und finden: Datenbanken (Explainer Informatik)"
  "3|504|informatik-html-css|Sprachen für den Computer: HTML und CSS (Explainer Informatik)"
)

waves=" $* "   # leer = alle; sonst die genannten Wellen 0, 1, 2, 3

for row in "${REPOS[@]}"; do
  IFS='|' read -r layer issue name desc <<<"$row"
  [[ "$waves" != "  " && "$waves" != *" $layer "* ]] && continue
  if [[ -z "$DRY" ]] && gh api "repos/$ORG/$name" --silent 2>/dev/null; then
    echo "vorhanden: $ORG/$name (Issue #$issue)"
    ensure_settings "$name"
    ensure_pages "$name"
    continue
  fi
  run gh api "orgs/$ORG/repos" -f name="$name" -f description="$desc${issue:+. Issue lernapps/apps#$issue}" -f visibility=public --silent
  topic_args=(); for t in "${TOPICS[@]}"; do topic_args+=(-f "names[]=$t"); done
  run gh api -X PUT "repos/$ORG/$name/topics" "${topic_args[@]}" --silent || true
  echo "angelegt:  $ORG/$name (Issue #$issue)"
  ensure_settings "$name"
  ensure_pages "$name"
done
echo "Fertig."
