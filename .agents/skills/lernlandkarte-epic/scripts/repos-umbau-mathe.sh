#!/usr/bin/env bash
# Baut die Repositories des Mathe-Epics (lernapps/apps#402) nach dem neuen Zuschnitt um:
#   1. benennt drei Repositories um (Git leitet alte Adressen weiter; nichts davon ist veröffentlicht),
#   2. legt in mathe-brueche-dezimal (früher bruchrechnung) die Regel-Datei .claude/settings.json auf main an,
#   3. löscht vier leere Repositories (nur nach Prüfung: ein Commit, nur .claude/settings.json),
#   4. archiviert mathe-karte (nicht löschen: 31 Commits, rund 60 Branches),
#   5. ruft create-repos-mathe.sh auf (legt mathe-zahlen-unter-null an, prüft die übrigen).
# Aufruf: DRY=1 ./repos-umbau-mathe.sh     zeigt nur, was passieren würde (Probelauf zuerst!)
#         ./repos-umbau-mathe.sh
# Voraussetzung: gh angemeldet mit Admin-Recht in der Organisation lernapps und dem Recht delete_repo
#   (einmalig: gh auth refresh -h github.com -s delete_repo).
# Idempotent: Was schon erledigt ist, wird übersprungen. Laufende Sessions auf den alten Namen vorher beenden.
set -euo pipefail
ORG=lernapps
DRY="${DRY:-}"
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

run() { if [[ -n "$DRY" ]]; then echo "  [DRY] $*"; else "$@"; fi; }
exists() { gh api "repos/$ORG/$1" --silent 2>/dev/null; }

rename_repo() {  # $1 = alt, $2 = neu
  if exists "$2" && ! exists "$1"; then echo "schon umbenannt: $2"; return; fi
  if ! exists "$1"; then echo "FEHLT: $ORG/$1 (und $2 gibt es auch nicht) – prüfen"; return; fi
  if exists "$2"; then echo "ABBRUCH: $ORG/$2 gibt es schon, $ORG/$1 nicht umbenannt"; return; fi
  run gh api -X PATCH "repos/$ORG/$1" -f name="$2" --silent
  echo "umbenannt: $1 -> $2"
}

delete_empty() {  # $1 = Repository; löscht nur, wenn leer (ein Commit, nur .claude/settings.json)
  if ! exists "$1"; then echo "schon gelöscht: $1"; return; fi
  n="$(gh api "repos/$ORG/$1/commits" --jq length)"
  files="$(gh api "repos/$ORG/$1/git/trees/main?recursive=1" --jq '[.tree[] | select(.type=="blob") | .path] | join(",")')"
  if [[ "$n" == "1" && "$files" == ".claude/settings.json" ]]; then
    run gh repo delete "$ORG/$1" --yes
    echo "gelöscht (war leer): $1"
  else
    echo "NICHT gelöscht: $1 ist nicht leer (Commits: $n, Dateien: $files)"
  fi
}

settings_to_main() {  # $1 = Repository: legt .claude/settings.json auf main an, falls sie fehlt (Inhalt wie in den anderen Repos)
  if ! exists "$1"; then echo "FEHLT: $1"; return; fi
  if gh api "repos/$ORG/$1/contents/.claude/settings.json?ref=main" --silent 2>/dev/null; then
    echo "Regel-Datei auf main vorhanden: $1"; return
  fi
  content="$(gh api "repos/$ORG/mathe-grosse-zahlen/contents/.claude/settings.json?ref=main" --jq .content | tr -d '\n')"
  run gh api -X PUT "repos/$ORG/$1/contents/.claude/settings.json" -f branch=main \
    -f message="chore: Berechtigungen für die Skills der Sessions" -f content="$content" --silent
  echo "Regel-Datei auf main angelegt: $1"
}

echo "== 1 Umbenennen"
rename_repo mathe-teiler-potenzen-muster mathe-muster-zaehlen
rename_repo mathe-potenzen-wurzeln mathe-wurzeln-potenzgesetze
rename_repo bruchrechnung mathe-brueche-dezimal

echo "== 2 Regel-Datei für mathe-brueche-dezimal"
settings_to_main mathe-brueche-dezimal

echo "== 3 Leere Repositories löschen"
delete_empty mathe-brueche-dezimal-negativ
delete_empty mathe-prozent-zins
delete_empty mathe-terme-gleichungen
delete_empty mathe-zufall

echo "== 4 mathe-karte archivieren"
if exists mathe-karte; then
  run gh api -X PATCH "repos/$ORG/mathe-karte" -F archived=true --silent
  echo "archiviert: mathe-karte"
fi

echo "== 5 Repositories anlegen und prüfen"
"$HERE/create-repos-mathe.sh"
echo "Fertig."
