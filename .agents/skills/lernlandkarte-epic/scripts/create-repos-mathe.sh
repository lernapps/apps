#!/usr/bin/env bash
# Legt die Repositories der Mathe-Explainer (Epic lernapps/apps#402) in der Organisation lernapps an (leer, öffentlich).
# Aufruf: ./create-repos-mathe.sh            alle 16
#         ./create-repos-mathe.sh 1          nur Schicht 1 (ebenso 2 und 3)
#         DRY=1 ./create-repos-mathe.sh      zeigt nur, was angelegt würde
# Voraussetzung: gh angemeldet mit dem Recht, in lernapps Repositories anzulegen.
# main entsteht mit der Regel-Datei .claude/settings.json; gh-pages (zeigt zuerst auf main) und Pages werden hier
# eingeschaltet, die Sessions legen sie nicht selbst an.
# Läuft auch für schon vorhandene Repositories (legt dort main mit der Regel-Datei an, falls main fehlt;
# ein vorhandenes main wird nie verändert).
# Abgeleitet von create-repos.sh (Englisch); Verwendung: Skill lernlandkarte-epic. Unterschiede: Fach und Repo-Liste, kein Audio, Regeln auch für
# Inkrement-Branches (`increment/*`) und die Schreibformen `-q`/`-u`/`push.negotiate`.
set -euo pipefail
ORG=lernapps
TOPICS=(lernapps mathematik)
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

# Schicht|Issue|Repository|Beschreibung
# Die Schichten sind ein Vorschlag nach Abhängigkeit (Grundlagen zuerst) und müssen vor dem Start mit den
# `requires` der Lernlandkarte Mathematik abgeglichen werden: https://lernapps.net/apps/map/mathematik/
REPOS=(
  "1|385|mathe-grosse-zahlen|Große Zahlen und Rechnen (Explainer Mathematik)"
  "1|386|mathe-teiler-potenzen-muster|Teiler, Potenzen und Muster (Explainer Mathematik)"
  "1|389|mathe-brueche-dezimal-negativ|Brüche, Dezimalzahlen und negative Zahlen (Explainer Mathematik)"
  "1|398|mathe-messen|Messen: Längen, Flächen, Volumen (Explainer Mathematik)"
  "1|397|mathe-figuren-abbilden|Figuren zeichnen und abbilden (Explainer Mathematik)"
  "1|400|mathe-daten|Daten erheben und auswerten (Explainer Mathematik)"
  "2|391|mathe-prozent-zins|Prozent- und Zinsrechnung (Explainer Mathematik)"
  "2|392|mathe-potenzen-wurzeln|Potenzen und Wurzeln (Explainer Mathematik)"
  "2|393|mathe-terme-gleichungen|Terme und Gleichungen (Explainer Mathematik)"
  "2|429|mathe-kreis-koerper|Kreis und Körper berechnen (Explainer Mathematik)"
  "2|430|mathe-saetze-entdecken|Dreiecke, Vierecke und Kreise: Sätze entdecken und begründen (Explainer Mathematik)"
  "2|432|mathe-koerper-bauen|Körper bauen, aufklappen und zeichnen (Explainer Mathematik)"
  "2|401|mathe-zufall|Zufall und Wahrscheinlichkeit (Explainer Mathematik)"
  "3|395|mathe-zuordnungen-funktionen|Zuordnungen und lineare Funktionen (Explainer Mathematik)"
  "3|396|mathe-funktionsfamilien|Funktionsfamilien mit Schiebereglern (Explainer Mathematik)"
  "3|399|mathe-aehnlichkeit-pythagoras|Ähnlichkeit, Pythagoras und Trigonometrie (Explainer Mathematik)"
)

only="${1:-}"   # leer = alle; 1, 2, 3 = Schicht

for row in "${REPOS[@]}"; do
  IFS='|' read -r layer issue name desc <<<"$row"
  [[ -n "$only" && "$only" != "$layer" ]] && continue
  if [[ -z "$DRY" ]] && gh api "repos/$ORG/$name" --silent 2>/dev/null; then
    echo "vorhanden: $ORG/$name (Issue #$issue)"
    ensure_settings "$name"
    ensure_pages "$name"
    continue
  fi
  run gh api "orgs/$ORG/repos" -f name="$name" -f description="$desc. Issue lernapps/apps#$issue" -f visibility=public --silent
  topic_args=(); for t in "${TOPICS[@]}"; do topic_args+=(-f "names[]=$t"); done
  run gh api -X PUT "repos/$ORG/$name/topics" "${topic_args[@]}" --silent || true
  echo "angelegt:  $ORG/$name (Issue #$issue)"
  ensure_settings "$name"
  ensure_pages "$name"
done
echo "Fertig."
