// The listing results comment (tooling docs/arc42 ch. 5, interface "Listing results comment"): the validation reports
// of a listing pull request, written for the creator's assistant. scripts/listing.mjs prints it after a check;
// .github/workflows/listing-comment.yml posts it on the pull request, rendered by this file from main.
//
//   node scripts/listing-comment.mjs <dir> [--run-url <url>] [--report-url <url>]
//
// <dir> holds one validation report per entry, <id>.yaml (schema:
// https://lernapps.net/tooling/schemas/validation-report.v1.schema.json). Prints the comment. Exit code 0 when every
// report passes, 1 when one fails or none can be read, 2 on wrong usage.
//
// A passing check gets a short comment: "bestanden", what was checked and measured, and any warnings or hints.
// Every finding is a task (`- [ ]`), grouped by rule. Only a comment too long for GitHub is cut off, and then says so:
// it shows the same number of findings of every rule, counts every rule, and links the full report, the artifact
// `listing` of the run (--report-url, its address; else --run-url, the run). The workflow rewrites the comment on
// every run, so ticked boxes start empty again.
//
// The reports come from the code of the pull request, which anybody controls in a fork: they are data. Ids and enums
// are checked against their patterns, links are built from the rule id, and every other value stands in a fenced
// code block, where GitHub renders no HTML, mention or link.
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { load } from "js-yaml";

/** The first line of the comment: the workflow finds its comment by it and updates it in place. */
export const MARKER = "<!-- lernapps-listing -->";
const RULE_PAGE = "https://lernapps.net/tooling/rules/#";
const ID = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;
const ENTRY_ID = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const SEVERITIES = ["error", "warning", "hint"];
const MAX_VALUE = 2000;
// GitHub takes a comment of at most 65,536 characters; the comment stays below, with room to spare, counted in bytes.
const MAX_COMMENT = 60_000;
const RUN_URL = /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/actions\/runs\/\d+$/;
const ARTIFACT_URL = /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/actions\/runs\/\d+\/artifacts\/\d+$/;
const MAX_REPORT = 1024 * 1024;

const LABEL = { error: ["Fehler", "Fehler"], warning: ["Warnung", "Warnungen"], hint: ["Hinweis", "Hinweise"] };
const count = (n, severity) => `${n} ${LABEL[severity][n === 1 ? 0 : 1]}`;

/** A value of the report as plain text on one or more lines, without control characters, cut to a sane length. */
function plain(value) {
  const text = String(value ?? "")
    .replace(/\r\n?/g, "\n")
    .replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, "");
  return text.length > MAX_VALUE ? `${text.slice(0, MAX_VALUE)} …` : text;
}

/** Lines in a fenced code block, indented for a list item; the fence is longer than any backtick run inside. */
function codeBlock(lines, indent = "") {
  const body = lines.join("\n");
  const longest = Math.max(0, ...(body.match(/`+/g) ?? []).map((run) => run.length));
  const fence = "`".repeat(Math.max(3, longest + 1));
  return [`${fence}text`, ...body.split("\n"), fence].map((line) => (line === "" ? "" : indent + line)).join("\n");
}

/** Label and value, aligned; continuation lines of a value are indented under its first line. */
const field = (label, value) => `${`${label}:`.padEnd(11)}${plain(value).split("\n").join(`\n${" ".repeat(11)}`)}`;

/** A report read as data: what the comment needs, or undefined when it does not have the shape of a report. */
function readReport(text) {
  let value;
  try {
    value = load(text);
  } catch {
    return undefined;
  }
  if (typeof value !== "object" || value === null || !Array.isArray(value.findings)) return undefined;
  const findings = [];
  for (const item of value.findings) {
    if (typeof item !== "object" || item === null) return undefined;
    if (typeof item.rule !== "string" || !ID.test(item.rule) || !SEVERITIES.includes(item.severity)) return undefined;
    findings.push({ rule: item.rule, severity: item.severity, where: item.where, found: item.found, fix: item.fix });
  }
  const checked = typeof value.checked === "object" && value.checked !== null ? value.checked : {};
  const fitness = typeof value.fitness === "object" && value.fitness !== null ? value.fitness : {};
  return {
    url: typeof checked.url === "string" ? checked.url : undefined,
    at: typeof checked.at === "string" && /^\d{4}-\d\d-\d\dT[\d:.]+Z$/.test(checked.at) ? checked.at : undefined,
    storage: ["none", "device"].includes(fitness.storage) ? fitness.storage : undefined,
    thirdParty: ["none", "before-click"].includes(fitness.thirdParty) ? fitness.thirdParty : undefined,
    rules: Array.isArray(value.rules) ? value.rules.filter((rule) => typeof rule === "string" && ID.test(rule)).length : 0,
    findings,
  };
}

/** A report file, or undefined when it is not a readable file of sane size. */
function readFile(file) {
  try {
    if (!statSync(file).isFile() || statSync(file).size > MAX_REPORT) return undefined;
    return readReport(readFileSync(file, "utf8"));
  } catch {
    return undefined;
  }
}

/** "14 Fehler" or "2 Fehler, 1 Warnung": the findings counted by severity. */
const tallyOf = (findings) =>
  SEVERITIES.map((severity) => [severity, findings.filter((f) => f.severity === severity).length])
    .filter(([, n]) => n > 0)
    .map(([severity, n]) => count(n, severity))
    .join(", ");

/** The findings of a report grouped by rule, in the order the rules first appear (the report sorts by rule). */
function byRule(findings) {
  const groups = new Map();
  for (const finding of findings) {
    if (!groups.has(finding.rule)) groups.set(finding.rule, []);
    groups.get(finding.rule).push(finding);
  }
  return [...groups];
}

const ruleLink = (rule) => `[\`${rule}\`](${RULE_PAGE}${rule})`;

/**
 * One entry: its verdict, what was checked, and its findings, one task each, grouped by rule. `perRule` is how many
 * findings of each rule are shown (all, unless the comment is cut off to fit GitHub).
 */
function renderEntry(id, report, perRule = Infinity) {
  const file = `entries/${id}.yaml`;
  if (report === undefined) {
    return [`### ${file}: nicht bestanden`, "", "Der Prüfbericht ist nicht lesbar. Führ die Prüfung selbst aus (unten)."].join("\n");
  }
  const tally = SEVERITIES.map((severity) => [severity, report.findings.filter((f) => f.severity === severity).length]);
  const errors = tally[0][1];
  const others = tally.filter(([severity, n]) => severity !== "error" && n > 0).map(([severity, n]) => count(n, severity));
  const verdict = errors > 0 ? `nicht bestanden, ${[count(errors, "error"), ...others].join(", ")}` : ["bestanden", ...others].join(", ");
  const facts = [];
  if (report.url !== undefined) facts.push(field("Geprüft", report.at ? `${report.url} (${report.at})` : report.url));
  if (report.storage && report.thirdParty) {
    facts.push(field("Gemessen", `fitness.storage ${report.storage}, fitness.thirdParty ${report.thirdParty} (ohne Klick)`));
  }
  facts.push(field("Regeln", `${report.rules} geprüft`));
  const lines = [`### ${file}: ${verdict}`, "", codeBlock(facts)];
  const groups = byRule(report.findings);
  const cut = groups.some(([, findings]) => findings.length > perRule);
  if (cut) {
    // Every rule with its count, also those whose findings are cut off.
    lines.push("", "| Regel | Befunde | gezeigt |", "| --- | --- | --- |");
    for (const [rule, findings] of groups) lines.push(`| ${ruleLink(rule)} | ${tallyOf(findings)} | ${Math.min(findings.length, perRule)} |`);
  }
  for (const [rule, findings] of groups) {
    const shown = findings.slice(0, perRule);
    lines.push("", `#### Regel ${ruleLink(rule)}: ${tallyOf(findings)}${cut ? `, ${shown.length} davon gezeigt` : ""}`, "");
    for (const finding of shown) {
      lines.push(
        `- [ ] ${ruleLink(rule)} (${finding.severity})`,
        codeBlock([field("Wo", finding.where), field("Gefunden", finding.found), field("Behebung", finding.fix)], "  "),
      );
    }
    if (findings.length > shown.length) {
      lines.push("", `… und ${findings.length - shown.length} weitere Befunde dieser Regel: im vollständigen Prüfbericht (oben verlinkt).`);
    }
  }
  return lines.join("\n");
}

/** Where the full reports are, for a comment that is cut off: the artifact of the run, the run, or a run of one's own. */
function fullReport({ runUrl, reportUrl }) {
  if (reportUrl !== undefined) {
    return `Der vollständige Prüfbericht: das Artefakt \`listing\` dieses Laufs, ${reportUrl}${runUrl ? `\nDer Lauf: ${runUrl}` : ""}`;
  }
  if (runUrl !== undefined) return `Der vollständige Prüfbericht: das Artefakt \`listing\` des Laufs ${runUrl} (unten auf der Seite, unter „Artifacts“).`;
  return "Die vollständigen Prüfberichte (YAML) schreibt die Prüfung, wenn du sie selbst ausführst (unten).";
}

function localRun(ids) {
  return [
    "### Selbst prüfen",
    "",
    "Dieselbe Prüfung läuft auch bei dir, mit demselben Ergebnis. In deinem Klon von lernapps/apps, auf dem Branch dieses Pull Requests:",
    "",
    "```sh",
    "npm ci",
    `npm run --silent listing -- ${ids.map((id) => `entries/${id}.yaml`).join(" ")}`,
    "```",
    "",
    "Sie gibt diesen Kommentar aus und schreibt die vollständigen Prüfberichte (YAML) nach `node_modules/.cache/lernapps/listing/`.",
    "Beim ersten Lauf installiert sie Chromium für die Prüfung.",
  ].join("\n");
}

/** The comment for the reports in `dir`; `passed` is false when a report fails or none can be read. */
export function render(dir, links = {}) {
  const runUrl = typeof links.runUrl === "string" && RUN_URL.test(links.runUrl) ? links.runUrl : undefined;
  const reportUrl = typeof links.reportUrl === "string" && ARTIFACT_URL.test(links.reportUrl) ? links.reportUrl : undefined;
  const files = existsSync(dir) ? readdirSync(dir).filter((name) => name.endsWith(".yaml")) : [];
  const ids = files
    .map((name) => name.slice(0, -".yaml".length))
    .filter((id) => ENTRY_ID.test(id))
    .sort();
  if (ids.length === 0) {
    const text = [
      MARKER,
      "## Prüfung des Eintrags: nicht fertig geworden",
      "",
      "Die Prüfung hat keinen Prüfbericht geschrieben." + (runUrl ? ` Ihr Protokoll: ${runUrl}` : ""),
      "Prüf, ob jede geänderte Datei in `entries/` gültiges YAML mit einer `url` ist, und führ die Prüfung selbst aus:",
      "",
      "```sh",
      "npm ci",
      "npm run --silent listing -- entries/<id>.yaml",
      "```",
      "",
      "Die Prüfung läuft bei jedem Push neu und ändert diesen Kommentar.",
      "",
    ].join("\n");
    return { text, passed: false };
  }
  const reports = ids.map((id) => [id, readFile(join(dir, `${id}.yaml`))]);
  const passed = reports.every(([, report]) => report !== undefined && !report.findings.some((f) => f.severity === "error"));
  const intro = passed
    ? [
        `## Prüfung des Eintrags: bestanden`,
        "",
        "Die Prüfung hat die App geöffnet, wie Lernende sie öffnen, ohne Klick, und den Eintrag mit ihr verglichen: Links, Themen, Fitness-Werte und die Regeln von lernapps.net. Sie findet keinen Fehler.",
        "Als Nächstes prüft lernapps.net den Rest im Review und entscheidet über den Eintrag. Du musst nichts tun.",
        "Die Prüfung läuft bei jedem Push neu und ändert diesen Kommentar.",
      ]
    : [
        `## Prüfung des Eintrags: nicht bestanden`,
        "",
        "Die Prüfung hat die App geöffnet, wie Lernende sie öffnen, ohne Klick, und den Eintrag mit ihr verglichen: Links, Themen, Fitness-Werte und die Regeln von lernapps.net.",
        "Behebe jeden Fehler unten, in der App oder im Eintrag. Jeder Befund steht als Aufgabe in der Liste, nach Regel geordnet: die Regel mit ihrem Link, wo er ist, was gefunden wurde und die Behebung.",
        "Dann pushe auf den Branch dieses Pull Requests: Die Prüfung läuft neu und ändert diesen Kommentar.",
        "Eine Änderung an der App wirkt erst, wenn sie veröffentlicht ist: Die Prüfung öffnet die App unter ihrer `url`.",
      ];
  const comment = (perRule, notice = []) =>
    // A passing comment stays short: nothing to fix, so no instructions for running the check oneself.
    [MARKER, ...intro, "", ...notice, ...reports.flatMap(([id, report]) => [renderEntry(id, report, perRule), ""]), ...(passed ? [] : [localRun(ids), ""])].join("\n");
  const full = comment(Infinity);
  if (Buffer.byteLength(full) <= MAX_COMMENT) return { text: full, passed };

  // Too long for one comment: as many findings of each rule as fit, the same number for every rule, and the rest
  // counted and linked. The largest such number by bisection; 0 still shows every rule with its count.
  const findings = reports.flatMap(([, report]) => report?.findings ?? []);
  const shownWith = (perRule) =>
    reports.flatMap(([, report]) => byRule(report?.findings ?? [])).reduce((sum, [, group]) => sum + Math.min(group.length, perRule), 0);
  const cutOff = (perRule) =>
    comment(perRule, [
      `> **Gekürzt:** Dieser Kommentar zeigt ${shownWith(perRule)} von ${findings.length} Befunden, weil ein Kommentar auf GitHub höchstens 65.536 Zeichen fassen kann.`,
      "> Jede Regel steht unten mit der Zahl ihrer Befunde und wie viele davon gezeigt sind.",
      ...fullReport({ runUrl, reportUrl })
        .split("\n")
        .map((line) => `> ${line}`),
      "",
    ]);
  let low = 0;
  let high = Math.max(...reports.flatMap(([, report]) => byRule(report?.findings ?? []).map(([, group]) => group.length)));
  while (low < high) {
    const middle = Math.ceil((low + high) / 2);
    if (Buffer.byteLength(cutOff(middle)) <= MAX_COMMENT) low = middle;
    else high = middle - 1;
  }
  return { text: cutOff(low), passed };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const option = (name) => {
    const at = args.indexOf(name);
    return at >= 0 ? args.splice(at, 2)[1] : undefined;
  };
  const runUrl = option("--run-url");
  const reportUrl = option("--report-url");
  if (args.length !== 1 || args[0].startsWith("-")) {
    process.stderr.write("Usage: node scripts/listing-comment.mjs <dir> [--run-url <url>] [--report-url <url>]\n");
    process.exit(2);
  }
  const { text, passed } = render(args[0], { runUrl, reportUrl });
  process.stdout.write(text);
  process.exitCode = passed ? 0 : 1;
}
