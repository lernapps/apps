// The review comment on a listing pull request (.github/workflows/review.yml, the job `comment`): the verdict of the
// review agent (lernapps/tooling review/prompt.md), or why there is none. One comment per pull request, found by its
// marker `<!-- lernapps-review -->` and rewritten on every `/review`.
//
//   node scripts/review-comment.mjs <dir> [--run-url <url>] [--commit <id>] [--problem <code>]
//
// <dir> holds the review input (scripts/review-input.mjs: review.json, report.yaml, build.log) and what the review job
// wrote: verdict.yaml, and the output and exit code of tooling's verdict check (`npm run --silent verdict`) in
// verdict-check.txt and verdict-check.status. --commit is the commit the workflow asked to review; a verdict for
// another one is not valid. --problem names why the pull request cannot be reviewed (PROBLEMS below); the comment
// then says only that. Prints the comment. Exit code 0 when it shows a valid verdict, 1 for any other comment, 2 on
// wrong usage.
//
// The comment shows, in this order of precedence: a problem; a review input that is missing or says the build failed;
// a validation report with an error (the procedure stops there: no verdict); no verdict; a verdict that fails the
// check (with the check's output); else the verdict: outcome, every finding as a task, and the whole YAML.
//
// Everything in <dir> comes from the app's code or from an agent that read it: data. Ids and enums are checked
// against their patterns, links are built from rule ids, every other value stands in a fenced code block, and
// anything that looks like a token is removed from the whole comment.
import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { load } from "js-yaml";
import { codeBlock, field, plain } from "./listing-comment.mjs";

/** The first line of the comment: the workflow finds its comment by it and updates it in place. */
export const MARKER = "<!-- lernapps-review -->";
const RULE_PAGE = "https://lernapps.net/tooling/rules/#";
const ID = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;
const COMMIT = /^[0-9a-f]{40}$/;
const REPO = /^https:\/\/github\.com\/[A-Za-z0-9-]+\/[A-Za-z0-9._-]+$/;
const ENTRY = /^entries\/[a-z0-9]+(-[a-z0-9]+)*\.yaml$/;
const RUN_URL = /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/actions\/runs\/\d+$/;
const SEVERITIES = ["error", "warning", "hint"];
const ARCHETYPES = ["explainer", "interactive", "quiz"];
const ARTIFACTS = ["skill", "lint rule", "check", "rubric item"];
const MAX_FILE = 1024 * 1024;
const MAX_YAML = 30_000;
const MAX_LOG = 3_000;
const MAX_ERRORS = 50;
// GitHub takes a comment of at most 65,536 characters; the comment stays below, with room to spare, counted in bytes.
const MAX_COMMENT = 60_000;
// Tokens of GitHub (ghp_, gho_, ghu_, ghs_, ghr_, github_pat_) and of Anthropic (sk-ant-), and credentials in URLs.
const SECRETS = [/\bgh[pousr]_[A-Za-z0-9]{20,}/g, /\bgithub_pat_[A-Za-z0-9_]{20,}/g, /\bsk-ant-[A-Za-z0-9_-]{10,}/g, /x-access-token:[^@\s]+/g];

export const PROBLEMS = {
  usage: "Der Befehl ist `/review` oder `/review <commit>`, mit der vollen Commit-ID (40 Zeichen), allein in der ersten Zeile des Kommentars.",
  "no-entry": "Dieser Pull Request ändert keinen Eintrag in `entries/`.",
  "many-entries": "Dieser Pull Request ändert mehr als einen Eintrag. Das Review beurteilt genau einen Eintrag pro Pull Request.",
  "no-source": "Der Eintrag nennt in `source` kein Repo auf GitHub (`https://github.com/<owner>/<repo>`). Das Review braucht den Quellcode der App.",
  "no-commit": "Der Commit lässt sich im Repo der App nicht finden, oder das Repo hat keinen Commit auf seinem Standard-Branch.",
};

const LABEL = { error: ["Fehler", "Fehler"], warning: ["Warnung", "Warnungen"], hint: ["Hinweis", "Hinweise"] };
const count = (n, severity) => `${n} ${LABEL[severity][n === 1 ? 0 : 1]}`;
const tallyOf = (findings) =>
  SEVERITIES.map((severity) => [severity, findings.filter((f) => f.severity === severity).length])
    .filter(([, n]) => n > 0)
    .map(([severity, n]) => count(n, severity))
    .join(", ");
const ruleLink = (rule) => `[\`${rule}\`](${RULE_PAGE}${rule})`;
const redact = (text) => SECRETS.reduce((result, pattern) => result.replace(pattern, "[entfernt]"), text);

/** A file of <dir> as text, or undefined when it is not a readable file of sane size. */
function read(dir, name) {
  const file = join(dir, name);
  try {
    if (!statSync(file).isFile() || statSync(file).size > MAX_FILE) return undefined;
    return readFileSync(file, "utf8");
  } catch {
    return undefined;
  }
}

function parse(text) {
  if (text === undefined) return undefined;
  try {
    return load(text);
  } catch {
    return undefined;
  }
}

const object = (value) => (typeof value === "object" && value !== null && !Array.isArray(value) ? value : undefined);

/** A text without control characters but its line breaks. */
const clean = (text) => text.replace(/\r\n?/g, "\n").replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, "");
/** The end of a text, cut to `max` characters. */
const tail = (text, max) => (text.length > max ? `…\n${text.slice(-max)}` : text);

/** The YAML of the verdict in a collapsed block, as text in a fenced block; `label` says whether it is valid. */
function details(yaml, label) {
  const body = clean(yaml);
  const text = body.length > MAX_YAML ? `${body.slice(0, MAX_YAML)}\n…` : body.replace(/\n$/, "");
  const longest = Math.max(0, ...(text.match(/`+/g) ?? []).map((run) => run.length));
  const fence = "`".repeat(Math.max(3, longest + 1));
  return ["<details>", `<summary>Das Urteil als YAML: ${label}</summary>`, "", `${fence}yaml`, text, fence, "", "</details>"].join("\n");
}

/** One finding of a verdict as a task and a code block; undefined when it does not have the shape of one. */
function renderFinding(item) {
  const finding = object(item);
  if (finding === undefined || !SEVERITIES.includes(finding.severity)) return undefined;
  const fields = [field("Wo", finding.where), field("Gefunden", finding.found), field("Behebung", finding.fix)];
  const moveTo = Array.isArray(finding.moveTo) ? finding.moveTo.filter((a) => ARTIFACTS.includes(a)) : [];
  let head;
  if (typeof finding.rule === "string" && ID.test(finding.rule)) {
    head = `- [ ] ${ruleLink(finding.rule)} (${finding.severity})`;
    if (moveTo.length > 0) fields.push(field("Künftig", moveTo.join(", ")));
  } else {
    const proposal = object(finding.proposal);
    if (proposal === undefined || typeof proposal.id !== "string" || !ID.test(proposal.id)) return undefined;
    head = `- [ ] Neue Regel vorgeschlagen: \`${proposal.id}\` (${finding.severity})`;
    const actsIn = Array.isArray(proposal.actsIn) ? proposal.actsIn.filter((a) => ARTIFACTS.includes(a)) : [];
    fields.unshift(field("Titel", proposal.title ?? ""), field("Regel", proposal.text ?? ""));
    if (actsIn.length > 0) fields.push(field("Wirkt in", actsIn.join(", ")));
  }
  return [head, codeBlock(fields, "  ")].join("\n");
}

/** The lines that say what was reviewed: the commit, the repo and the entry, from values checked against patterns. */
function reviewed(commit, meta) {
  const repo = typeof meta?.repo === "string" && REPO.test(meta.repo) ? ` von ${meta.repo}` : "";
  const entry = typeof meta?.entry === "string" && ENTRY.test(meta.entry) ? `, Eintrag \`${meta.entry}\`` : "";
  return commit ? `Commit \`${commit}\`${repo}${entry}.` : `Commit unbekannt${repo}${entry}.`;
}

const again = (runUrl) =>
  [
    "---",
    "Ein Maintainer startet das Review mit dem Kommentar `/review` (der Standard-Branch des Repos der App) oder `/review <commit>`; es ersetzt diesen Kommentar.",
    ...(runUrl ? [`Der Lauf: ${runUrl}`] : []),
  ].join("\n");

const DECIDES_NOTHING = "Das Review entscheidet nichts und ändert nichts: Über den Eintrag entscheidet lernapps.net.";

/** The comment for the review in `dir`; `valid` is true when it shows a valid verdict. */
export function render(dir, options = {}) {
  const runUrl = typeof options.runUrl === "string" && RUN_URL.test(options.runUrl) ? options.runUrl : undefined;
  const meta = object(parse(read(dir, "review.json")));
  const commit = [options.commit, meta?.commit].find((value) => typeof value === "string" && COMMIT.test(value));
  const done = (title, lines, valid = false) => ({
    text: redact([MARKER, `## Review: ${title}`, "", ...lines, "", again(runUrl), ""].join("\n")),
    valid,
  });

  if (options.problem !== undefined) return done("nicht möglich", [PROBLEMS[options.problem]]);
  if (meta === undefined || !["ready", "build-failed", "clone-failed", "no-bundle"].includes(meta.state)) {
    return done("Vorbereitung nicht fertig", [
      `Die Vorbereitung (bauen, \`lernapps check\`) hat keine Eingabe für das Review geschrieben.${runUrl ? ` Ihr Protokoll: ${runUrl}` : ""}`,
    ]);
  }
  if (meta.state === "clone-failed" || meta.state === "no-bundle") {
    return done("Vorbereitung nicht fertig", [
      reviewed(commit, meta),
      meta.state === "clone-failed"
        ? "Das Repo der App lässt sich nicht klonen, oder es hat diesen Commit nicht."
        : "Der Build hat kein Bundle geschrieben: keine `index.html` in `dist/` oder `_site/` (ohne Build: im Repo).",
    ]);
  }
  if (meta.state === "build-failed") {
    const log = read(dir, "build.log");
    return done("die App lässt sich nicht bauen", [
      reviewed(commit, meta),
      "`npm ci && npm run build` schlägt fehl. Ohne Bundle gibt es kein Review.",
      ...(log ? ["Das Ende der Ausgabe:", "", codeBlock([tail(clean(log).trimEnd(), MAX_LOG)])] : []),
    ]);
  }

  // The validation report: with an error the procedure stops (review/prompt.md, 2.1), so there is no verdict.
  const report = object(parse(read(dir, "report.yaml")));
  const findings = Array.isArray(report?.findings) ? report.findings.map(object).filter(Boolean) : undefined;
  if (findings === undefined) {
    return done("Vorbereitung nicht fertig", [reviewed(commit, meta), "Der Prüfbericht von `lernapps check` fehlt oder ist nicht lesbar."]);
  }
  const errors = findings.filter((f) => f.severity === "error");
  if (errors.length > 0) {
    const shown = errors.slice(0, MAX_ERRORS);
    return done("die Prüfungen schlagen fehl", [
      reviewed(commit, meta),
      `Der Prüfbericht von \`lernapps check\` hat ${count(errors.length, "error")}. Das Review-Verfahren hört dann auf: kein Urteil (\`review/prompt.md\` von lernapps/tooling, Schritt 2.1).`,
      "",
      ...shown.map((f) =>
        [
          `- [ ] ${typeof f.rule === "string" && ID.test(f.rule) ? ruleLink(f.rule) : "Regel unbekannt"} (error)`,
          codeBlock([field("Wo", f.where), field("Gefunden", f.found), field("Behebung", f.fix)], "  "),
        ].join("\n"),
      ),
      ...(errors.length > shown.length ? ["", `… und ${errors.length - shown.length} weitere Fehler: im Artefakt \`review-input\` des Laufs.`] : []),
    ]);
  }

  const yaml = read(dir, "verdict.yaml");
  if (yaml === undefined) {
    return done("kein Urteil", [reviewed(commit, meta), `Der Review-Agent hat kein Urteil geschrieben.${runUrl ? ` Das Protokoll: ${runUrl}` : ""}`]);
  }
  const verdict = object(parse(yaml));
  const status = read(dir, "verdict-check.status")?.trim();
  const check = read(dir, "verdict-check.txt") ?? "";
  const problems = [];
  if (status !== "0") problems.push(check.trim() === "" ? "Die Prüfung des Urteils hat nicht stattgefunden." : check.trim());
  const verdictCommit = object(verdict?.reviewed)?.commit;
  if (commit !== undefined && verdictCommit !== commit) {
    problems.push(`Das Urteil nennt den Commit ${plain(verdictCommit)}, beurteilt werden sollte ${commit}.`);
  }
  const rendered = Array.isArray(verdict?.findings) ? verdict.findings.map(renderFinding) : [undefined];
  if (problems.length === 0 && (rendered.includes(undefined) || !["pass", "fail"].includes(verdict?.outcome))) {
    problems.push("Das Urteil hat nicht die Form, die review/verdict.v1.schema.json verlangt.");
  }
  if (problems.length > 0) {
    return done("Urteil ungültig", [
      reviewed(commit, meta),
      "Das Urteil des Review-Agenten besteht die Prüfung gegen `review/verdict.v1.schema.json` von lernapps/tooling nicht (`npm run --silent verdict`):",
      "",
      codeBlock(problems),
      "",
      details(yaml, "ungültig"),
    ]);
  }

  const valid = verdict.findings.map(object);
  const title = `${verdict.outcome}, ${valid.length === 0 ? "keine Befunde" : `${valid.length} ${valid.length === 1 ? "Befund" : "Befunde"} (${tallyOf(valid)})`}`;
  const archetype = ARCHETYPES.includes(verdict.archetype) ? verdict.archetype : verdict.archetype === null ? "keiner (kein Plan)" : "unbekannt";
  const rules = Array.isArray(verdict.rules) ? verdict.rules.filter((rule) => typeof rule === "string" && ID.test(rule)).length : 0;
  const head = [
    reviewed(commit, meta),
    "",
    `Der Review-Agent hat die App nach dem Review-Verfahren von lernapps/tooling beurteilt (\`review/prompt.md\`, die Rubrik \`review/rubric.md\` und die des Archetyps), ausgehend vom Prüfbericht, der keinen Fehler hat. ${DECIDES_NOTHING}`,
    "",
    codeBlock([field("Urteil", verdict.outcome), field("Archetyp", archetype), field("Beurteilt", `${rules} Punkte der Rubrik`)]),
  ];
  const body = (shown, withYaml, notice = []) => [
    ...head,
    "",
    ...notice,
    ...(valid.length > 0 ? ["### Befunde", "", ...rendered.slice(0, shown), ""] : []),
    ...(shown < valid.length ? [`… und ${valid.length - shown} weitere Befunde: im ganzen Urteil (oben verlinkt).`, ""] : []),
    withYaml ? details(yaml, "gültig nach verdict.v1.schema.json") : `Das ganze Urteil als YAML: das Artefakt \`review\` des Laufs${runUrl ? ` ${runUrl}` : ""}.`,
  ];
  const full = done(title, body(valid.length, true), true);
  if (Buffer.byteLength(full.text) <= MAX_COMMENT) return full;

  // Too long for one comment: the YAML stays in the artifact, and as many findings as fit are shown.
  const cutOff = (shown) =>
    done(
      title,
      body(shown, false, [
        `> **Gekürzt:** Ein Kommentar auf GitHub fasst höchstens 65.536 Zeichen. Dieser zeigt ${shown} von ${valid.length} Befunden; das ganze Urteil ist das Artefakt \`review\` des Laufs.`,
        "",
      ]),
      true,
    );
  let low = 0;
  let high = valid.length;
  while (low < high) {
    const middle = Math.ceil((low + high) / 2);
    if (Buffer.byteLength(cutOff(middle).text) <= MAX_COMMENT) low = middle;
    else high = middle - 1;
  }
  return cutOff(low);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const option = (name) => {
    const at = args.indexOf(name);
    return at >= 0 ? args.splice(at, 2)[1] : undefined;
  };
  const runUrl = option("--run-url");
  const commit = option("--commit");
  const problem = option("--problem");
  const usage = (message) => {
    process.stderr.write(`review-comment: ${message}\nUsage: node scripts/review-comment.mjs <dir> [--run-url <url>] [--commit <id>] [--problem <code>]\n`);
    process.exit(2);
  };
  if (args.length !== 1 || args[0].startsWith("-")) usage("name one directory");
  if (problem !== undefined && !Object.hasOwn(PROBLEMS, problem)) usage(`unknown problem: ${problem}`);
  if (commit !== undefined && !COMMIT.test(commit)) usage(`--commit ${commit}: the full id of a commit`);
  if (!existsSync(args[0])) usage(`${args[0]}: no such directory`);
  const { text, valid } = render(args[0], { runUrl, commit, problem });
  process.stdout.write(text);
  process.exitCode = valid ? 0 : 1;
}
