#!/usr/bin/env bash
# Legt die Repositories der Französisch-Explainer (Epic lernapps/apps#363) in der Organisation lernapps an (leer, öffentlich).
# Aufruf: ./create-repos-franzoesisch.sh            alle 15
#         ./create-repos-franzoesisch.sh 1          nur Schicht 1 (ebenso 2 und 3)
#         DRY=1 ./create-repos-franzoesisch.sh      zeigt nur, was angelegt würde
# Voraussetzung: gh angemeldet mit dem Recht, in lernapps Repositories anzulegen.
# main entsteht mit der Regel-Datei .claude/settings.json; gh-pages (zeigt zuerst auf main) und Pages werden hier
# eingeschaltet, die Sessions legen sie nicht selbst an.
# Läuft auch für schon vorhandene Repositories (legt dort main mit der Regel-Datei an, falls main fehlt;
# ein vorhandenes main wird nie verändert).
# Abgeleitet von create-repos-mathe.sh (Mathe-Epic #402); Verwendung: Skill lernlandkarte-epic. Unterschiede:
# Fach und Repo-Liste, und mit Audio: Französisch-Apps sprechen und hören (Explainer #351 braucht Ton zwingend),
# deshalb die Berechtigung für das Audio-Skript wie in den Englisch-Repos (z. B. lernapps/englisch-klang-schrift).
set -euo pipefail
ORG=lernapps
TOPICS=(lernapps franzoesisch)
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
      "Bash(python3 .agents/skills/lernapps-audio/scripts/lernapps_audio.py *)",
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
# Die Schichten folgen den `requires` der Lernlandkarte Französisch (Längster-Pfad-Schichten der Explainer,
# gruppiert in drei Wellen): https://lernapps.net/apps/map/franzoesisch/ und
# `node .agents/skills/map-explainers/scripts/check.mjs franzoesisch --relations --file map/franzoesisch/explainer.md`.
# Schicht 1: Grundlagen ohne Abhängigkeiten und die ersten Systeme (Nomen/Begleiter, Verben, Zahlen, Laute/Schrift, Sätze).
# Schicht 2: baut auf Schicht 1 auf (Zeiten, Pronomen, Brieffreundschaft, Werkzeuge für Wörter).
# Schicht 3: Situationen und Texte (Stadt, Frankreich/Frankophonie, Geschichten, Bilder, Meinung, Schreibwerkstatt).
REPOS=(
  "1|346|franzoesisch-nomen-und-begleiter|Nomen und ihre Begleiter (Explainer Französisch)"
  "1|347|franzoesisch-verben|Verben konjugieren (Explainer Französisch)"
  "1|355|franzoesisch-zahlen|Zahlen, Uhr und Kalender (Explainer Französisch)"
  "1|351|franzoesisch-laute-und-schrift|Laute und Schrift (Explainer Französisch)"
  "1|349|franzoesisch-saetze-bauen|Sätze bauen (Explainer Französisch)"
  "2|348|franzoesisch-zeiten|Zeiten auf dem Zeitstrahl (Explainer Französisch)"
  "2|350|franzoesisch-pronomen|Pronomen als Stellvertreter (Explainer Französisch)"
  "2|352|franzoesisch-salut|Salut! Eine Brieffreundschaft (Explainer Französisch)"
  "2|361|franzoesisch-woerter-werkzeuge|Werkzeuge für unbekannte Wörter (Explainer Französisch)"
  "3|354|franzoesisch-unterwegs-in-der-stadt|Unterwegs in der Stadt (Explainer Französisch)"
  "3|356|franzoesisch-frankreich-und-frankophonie|Eine Reise durch Frankreich und die Frankophonie (Explainer Französisch)"
  "3|357|franzoesisch-geschichten|Geschichten lesen und erzählen (Explainer Französisch)"
  "3|358|franzoesisch-bilder-comics-filme|Bilder, Comics und Filme lesen (Explainer Französisch)"
  "3|359|franzoesisch-meinung|Meinung sagen und abwägen (Explainer Französisch)"
  "3|360|franzoesisch-schreibwerkstatt|Schreibwerkstatt: Texte nach Bauplan (Explainer Französisch)"
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
